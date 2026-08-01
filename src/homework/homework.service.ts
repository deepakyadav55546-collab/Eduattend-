import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  async list(schoolId: string, actor: any) {
    if (actor.role === 'PARENT') {
      const parent = await this.prisma.parent.findFirst({
        where: { schoolId, userId: actor.sub },
        select: { id: true },
      });
      if (!parent) throw new NotFoundException('Parent profile not found');

      return this.prisma.homework.findMany({
        where: { schoolId },
        orderBy: { dueDate: 'asc' },
        include: {
          submissions: {
            where: { student: { parentId: parent.id, isActive: true } },
            include: { student: { select: { id: true, firstName: true, lastName: true } } },
          },
        },
      });
    }

    return this.prisma.homework.findMany({
      where: { schoolId },
      orderBy: { dueDate: 'asc' },
      include: { submissions: true },
    });
  }

  create(schoolId: string, d: any) {
    return this.prisma.homework.create({
      data: {
        schoolId,
        title: d.title,
        description: d.description,
        subject: d.subject,
        dueDate: d.dueDate ? new Date(d.dueDate) : undefined,
      },
    });
  }

  async submit(schoolId: string, homeworkId: string, studentId: string, d: any, actor: any) {
    const h = await this.prisma.homework.findFirst({ where: { id: homeworkId, schoolId } });
    if (!h) throw new NotFoundException('Homework not found');

    const st = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId, isActive: true },
      include: { parent: true },
    });
    if (!st) throw new NotFoundException('Student not found');

    if (actor.role === 'PARENT' && st.parent?.userId !== actor.sub) {
      throw new ForbiddenException('You can only submit homework for your own child');
    }

    return this.prisma.homeworkSubmission.upsert({
      where: { homeworkId_studentId: { homeworkId, studentId } },
      update: {
        status: d.status ?? 'SUBMITTED',
        submittedAt: new Date(),
        note: d.note,
      },
      create: {
        homeworkId,
        studentId,
        status: d.status ?? 'SUBMITTED',
        submittedAt: new Date(),
        note: d.note,
      },
    });
  }
}
