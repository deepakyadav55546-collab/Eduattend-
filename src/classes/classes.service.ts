import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}
  list(schoolId: string) {
    return this.prisma.schoolClass.findMany({
      where: { schoolId }, orderBy: { name: 'asc' },
      include: { sections: { orderBy: { name: 'asc' }, include: { _count: { select: { students: true } } } }, _count: { select: { students: true } } },
    });
  }
  async createClass(schoolId: string, dto: CreateClassDto) {
    const exists = await this.prisma.schoolClass.findUnique({ where: { schoolId_name: { schoolId, name: dto.name } } });
    if (exists) throw new ConflictException('Class already exists');
    return this.prisma.schoolClass.create({ data: { schoolId, name: dto.name } });
  }
  async createSection(schoolId: string, dto: CreateSectionDto) {
    const cls = await this.prisma.schoolClass.findFirst({ where: { id: dto.classId, schoolId } });
    if (!cls) throw new NotFoundException('Class not found');
    const exists = await this.prisma.section.findUnique({ where: { classId_name: { classId: dto.classId, name: dto.name } } });
    if (exists) throw new ConflictException('Section already exists');
    return this.prisma.section.create({ data: { classId: dto.classId, name: dto.name }, include: { class: true, _count: { select: { students: true } } } });
  }
  async removeClass(schoolId: string, id: string) {
    const x = await this.prisma.schoolClass.findFirst({ where: { id, schoolId } });
    if (!x) throw new NotFoundException('Class not found');
    await this.prisma.schoolClass.delete({ where: { id } });
    return { message: 'Class deleted successfully' };
  }
  async removeSection(schoolId: string, id: string) {
    const x = await this.prisma.section.findFirst({ where: { id, class: { schoolId } } });
    if (!x) throw new NotFoundException('Section not found');
    await this.prisma.section.delete({ where: { id } });
    return { message: 'Section deleted successfully' };
  }
}
