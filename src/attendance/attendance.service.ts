import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

function dayStart(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  d.setHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async mark(schoolId: string, markedById: string, dto: MarkAttendanceDto) {
    const date = dayStart(dto.date);
    const student = await this.prisma.student.findFirst({ where: { id: dto.studentId, schoolId } });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.attendance.upsert({
      where: { studentId_date: { studentId: dto.studentId, date } },
      create: { schoolId, studentId: dto.studentId, date, status: dto.status, note: dto.note, markedById },
      update: { status: dto.status, note: dto.note, markedById },
    });
  }

  async bulk(schoolId: string, markedById: string, dto: BulkAttendanceDto) {
    const date = dayStart(dto.date);
    const ids = dto.items.map(x => x.studentId);
    const students = await this.prisma.student.findMany({ where: { schoolId, id: { in: ids } }, select: { id: true } });
    const valid = new Set(students.map(s => s.id));
    if (valid.size !== ids.length) throw new BadRequestException('One or more students do not belong to this school');

    await this.prisma.$transaction(
      dto.items.map(item =>
        this.prisma.attendance.upsert({
          where: { studentId_date: { studentId: item.studentId, date } },
          create: { schoolId, studentId: item.studentId, date, status: item.status, note: item.note, markedById },
          update: { status: item.status, note: item.note, markedById },
        }),
      ),
    );

    return { message: 'Attendance saved', date, count: dto.items.length };
  }

  listByDate(schoolId: string, dateValue: string) {
    const date = dayStart(dateValue);
    return this.prisma.attendance.findMany({
      where: { schoolId, date },
      orderBy: { student: { firstName: 'asc' } },
      include: { student: { include: { class: true, section: true } } },
    });
  }

  monthlyReport(schoolId: string, month: string) {
    const start = new Date(`${month}-01T00:00:00`);
    if (Number.isNaN(start.getTime())) throw new BadRequestException('Month must be YYYY-MM');
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    return this.prisma.attendance.groupBy({
      by: ['studentId', 'status'],
      where: { schoolId, date: { gte: start, lt: end } },
      _count: { _all: true },
      orderBy: { studentId: 'asc' },
    });
  }
}
