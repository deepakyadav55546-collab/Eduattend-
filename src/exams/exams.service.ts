import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SaveMarkDto } from './dto/save-mark.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string) {
    return this.prisma.exam.findMany({
      where: { schoolId },
      
      orderBy: { createdAt: 'desc' },
include: {
  subjects: true,
},
    
  });
}

  async create(schoolId: string, dto: CreateExamDto) {
    return this.prisma.exam.create({
      data: {
        schoolId, name: dto.name.trim(),
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async addSubject(schoolId: string, examId: string, dto: CreateSubjectDto) {
    const exam = await this.prisma.exam.findFirst({ where: { id: examId, schoolId } });
    if (!exam) throw new NotFoundException('Exam not found');
    const exists = await this.prisma.examSubject.findUnique({
      where: { examId_name: { examId, name: dto.name } },
    });
    if (exists) throw new ConflictException('Subject already exists for this exam');
    return this.prisma.examSubject.create({
      data: { examId, name: dto.name.trim(), maxMarks: dto.maxMarks ?? 100 },
    });
  }

  async saveMark(schoolId: string, examId: string, dto: SaveMarkDto) {
    const subject = await this.prisma.examSubject.findFirst({
      where: { id: dto.subjectId, examId, exam: { schoolId } },
    });
    if (!subject) throw new NotFoundException('Exam subject not found');
    const student = await this.prisma.student.findFirst({ where: { id: dto.studentId, schoolId, isActive: true } });
    if (!student) throw new NotFoundException('Student not found');
    if (dto.marks > Number(subject.maxMarks)) throw new ConflictException('Marks cannot exceed maximum marks');

    return this.prisma.examMark.upsert({
      where: { studentId_subjectId: { studentId: dto.studentId, subjectId: dto.subjectId } },
      update: { marks: dto.marks, grade: dto.grade },
      create: { studentId: dto.studentId, subjectId: dto.subjectId, marks: dto.marks, grade: dto.grade },
    });
  }

  async reportCard(schoolId: string, examId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({ where: { id: studentId, schoolId } });
    if (!student) throw new NotFoundException('Student not found');
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
    return { student, exam, subjects, total, maxTotal, percentage: Number(percentage.toFixed(2)) };
  }
}
