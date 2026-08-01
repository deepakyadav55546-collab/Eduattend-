import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string, search?: string, sectionId?: string) {
    return this.prisma.student.findMany({
      where: {
        schoolId,
        isActive: true,
        ...(sectionId ? { sectionId } : {}),
        ...(search ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { admissionNo: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      include: { class: true, section: true, parent: true },
    });
  }

  async get(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId },
      include: {
        class: true,
        section: true,
        parent: true,
        attendance: { orderBy: { date: 'desc' }, take: 30 },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  private async validatePlacement(schoolId: string, classId?: string, sectionId?: string) {
    if (sectionId) {
      const section = await this.prisma.section.findFirst({
        where: { id: sectionId, class: { schoolId } },
        include: { class: true },
      });
      if (!section) throw new NotFoundException('Section not found');
      if (classId && section.classId !== classId) {
        throw new ConflictException('Selected section does not belong to selected class');
      }
      return section.classId;
    }
    if (classId) {
      const cls = await this.prisma.schoolClass.findFirst({ where: { id: classId, schoolId } });
      if (!cls) throw new NotFoundException('Class not found');
    }
    return classId;
  }

  async create(schoolId: string, dto: CreateStudentDto) {
    const exists = await this.prisma.student.findUnique({
      where: { schoolId_admissionNo: { schoolId, admissionNo: dto.admissionNo } },
    });
    if (exists) throw new ConflictException('Admission number already exists');

    const classId = await this.validatePlacement(schoolId, dto.classId, dto.sectionId);

    return this.prisma.$transaction(async (tx) => {
      let parentId: string | undefined;
      if (dto.parentName) {
        const parent = await tx.parent.create({
          data: {
            schoolId,
            name: dto.parentName,
            phone: dto.parentPhone,
            email: dto.parentEmail,
          },
        });
        parentId = parent.id;
      }

      return tx.student.create({
        data: {
          schoolId,
          admissionNo: dto.admissionNo.trim(),
          firstName: dto.firstName.trim(),
          lastName: dto.lastName?.trim(),
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender,
          phone: dto.phone,
          address: dto.address,
          classId,
          sectionId: dto.sectionId,
          parentId,
        },
        include: { class: true, section: true, parent: true },
      });
    });
  }

  async update(schoolId: string, id: string, dto: UpdateStudentDto) {
    const student = await this.prisma.student.findFirst({ where: { id, schoolId } });
    if (!student) throw new NotFoundException('Student not found');

    const classId = await this.validatePlacement(
      schoolId,
      dto.classId ?? student.classId ?? undefined,
      dto.sectionId ?? student.sectionId ?? undefined,
    );

    return this.prisma.student.update({
      where: { id },
      data: {
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        phone: dto.phone,
        address: dto.address,
        classId,
        sectionId: dto.sectionId,
        isActive: dto.isActive,
      },
      include: { class: true, section: true, parent: true },
    });
  }

  async remove(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({ where: { id, schoolId } });
    if (!student) throw new NotFoundException('Student not found');

    // Soft-delete so historical attendance remains available.
    await this.prisma.student.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Student archived successfully' };
  }
}
