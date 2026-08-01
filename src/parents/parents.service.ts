import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async parentForUser(schoolId: string, userId: string) {
    const parent = await this.prisma.parent.findFirst({
      where: { schoolId, userId },
    });
    if (!parent) throw new NotFoundException('Parent profile not found');
    return parent;
  }

  async dashboard(schoolId: string, userId: string) {
    const parent = await this.parentForUser(schoolId, userId);
    return this.prisma.parent.findUnique({
      where: { id: parent.id },
      include: {
        students: {
          where: { isActive: true },
          include: { class: true, section: true },
          orderBy: { firstName: 'asc' },
        },
      },
    });
  }

  async studentReport(schoolId: string, userId: string, studentId: string, examId: string) {
    const parent = await this.parentForUser(schoolId, userId);
    const link = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId, parentId: parent.id, isActive: true },
    });
    if (!link) throw new NotFoundException('Student is not linked to this parent');

    const exam = await this.prisma.exam.findFirst({
      where: { id: examId, schoolId },
      include: { subjects: { include: { marks: { where: { studentId } } } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    let total = 0, maxTotal = 0;
    const subjects = exam.subjects.map(s => {
      const mark = s.marks[0]?.marks == null ? null : Number(s.marks[0].marks);
      const max = Number(s.maxMarks);
      maxTotal += max;
      if (mark != null) total += mark;
      return { subject: s.name, marks: mark, maxMarks: max, grade: s.marks[0]?.grade ?? null };
    });
    const percentage = maxTotal ? (total / maxTotal) * 100 : 0;
    return {
      student: link,
      exam,
      subjects,
      total,
      maxTotal,
      percentage: Number(percentage.toFixed(2)),
    };
  }

  async attendance(schoolId: string, userId: string, studentId: string) {
    const parent = await this.parentForUser(schoolId, userId);
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId, parentId: parent.id, isActive: true },
      include: { attendance: { orderBy: { date: 'desc' }, take: 100 } },
    });
    if (!student) throw new NotFoundException('Student is not linked to this parent');
    return student;
  }
}
