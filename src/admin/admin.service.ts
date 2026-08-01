import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(schoolId: string) {
    const [students, teachers, classes, sections, todayAttendance] =
      await Promise.all([
        this.prisma.student.count({ where: { schoolId, isActive: true } }),
        this.prisma.teacher.count({ where: { schoolId, isActive: true } }),
        this.prisma.schoolClass.count({ where: { schoolId } }),
        this.prisma.section.count({ where: { class: { schoolId } } }),
        this.prisma.attendance.count({
          where: {
            schoolId,
            date: this.today(),
          },
        }),
      ]);

    const statusRows = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: { schoolId, date: this.today() },
      _count: { _all: true },
    });

    const attendance = Object.fromEntries(
      statusRows.map((row) => [row.status, row._count._all]),
    );

    return {
      students,
      teachers,
      classes,
      sections,
      todayAttendance,
      attendance: {
        PRESENT: attendance.PRESENT ?? 0,
        ABSENT: attendance.ABSENT ?? 0,
        LATE: attendance.LATE ?? 0,
        LEAVE: attendance.LEAVE ?? 0,
      },
    };
  }

  private today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
