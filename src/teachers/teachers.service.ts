import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string) {
    return this.prisma.teacher.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: { sections: { include: { class: true } }, user: { select: { id: true, email: true, role: true } } },
    });
  }

  sectionsForTeacher(schoolId: string, userId: string) {
    return this.prisma.teacher.findFirst({
      where: { schoolId, userId },
      include: {
        sections: {
          orderBy: [{ class: { name: 'asc' } }, { name: 'asc' }],
          include: { class: true, _count: { select: { students: true } } },
        },
      },
    });
  }

  async create(schoolId: string, dto: CreateTeacherDto) {
    const [employeeExists, emailExists] = await Promise.all([
      this.prisma.teacher.findUnique({ where: { schoolId_employeeNo: { schoolId, employeeNo: dto.employeeNo } } }),
      this.prisma.user.findUnique({ where: { email: dto.email } }),
    ]);
    if (employeeExists) throw new ConflictException('Employee number already exists');
    if (emailExists) throw new ConflictException('Email already exists');

    if (dto.sectionId) {
      const section = await this.prisma.section.findFirst({
        where: { id: dto.sectionId, class: { schoolId } },
      });
      if (!section) throw new NotFoundException('Section not found');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          schoolId,
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: Role.TEACHER,
        },
      });

      return tx.teacher.create({
        data: {
          schoolId,
          userId: user.id,
          employeeNo: dto.employeeNo,
          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          subject: dto.subject,
          ...(dto.sectionId ? { sections: { connect: { id: dto.sectionId } } } : {}),
        },
        include: { sections: { include: { class: true } } },
      });
    });
  }
  async update(schoolId:string,id:string,dto:UpdateTeacherDto){
    const t=await this.prisma.teacher.findFirst({where:{id,schoolId}});
    if(!t) throw new NotFoundException('Teacher not found');
    if(dto.sectionIds){
      const n=await this.prisma.section.count({where:{id:{in:dto.sectionIds},class:{schoolId}}});
      if(n!==dto.sectionIds.length) throw new NotFoundException('One or more sections not found');
    }
    const passwordHash=dto.password?await bcrypt.hash(dto.password,12):undefined;
    return this.prisma.$transaction(async tx=>{
      if(t.userId) await tx.user.update({where:{id:t.userId},data:{
        ...(dto.name!==undefined?{name:dto.name}:{}),...(dto.email!==undefined?{email:dto.email}:{}),
        ...(dto.phone!==undefined?{phone:dto.phone}:{}),...(passwordHash?{passwordHash}:{}),
        ...(dto.isActive!==undefined?{isActive:dto.isActive}:{}),
      }});
      return tx.teacher.update({where:{id},data:{
        ...(dto.name!==undefined?{name:dto.name}:{}),...(dto.email!==undefined?{email:dto.email}:{}),
        ...(dto.phone!==undefined?{phone:dto.phone}:{}),...(dto.subject!==undefined?{subject:dto.subject}:{}),
        ...(dto.isActive!==undefined?{isActive:dto.isActive}:{}),
        ...(dto.sectionIds?{sections:{set:dto.sectionIds.map(x=>({id:x}))}}:{})
      },include:{sections:{include:{class:true}}}});
    });
  }
  async remove(schoolId:string,id:string){
    const t=await this.prisma.teacher.findFirst({where:{id,schoolId}});
    if(!t) throw new NotFoundException('Teacher not found');
    await this.prisma.$transaction(async tx=>{
      await tx.teacher.delete({where:{id}});
      if(t.userId) await tx.user.delete({where:{id:t.userId}});
    });
    return {message:'Teacher deleted successfully'};
  }
