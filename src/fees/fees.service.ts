import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { PayFeeDto } from './dto/pay-fee.dto';

@Injectable()
export class FeesService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string, studentId?: string) {
    return this.prisma.fee.findMany({
      where: { schoolId, ...(studentId ? { studentId } : {}) },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      include: { student: { include: { class: true, section: true } }, payments: true },
    });
  }

  async create(schoolId: string, dto: CreateFeeDto) {
    const school = await this.prisma.school.findUnique({ where: { id: schoolId }, select: { currencyCode: true } });
    if (!school) throw new NotFoundException('School not found');

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, schoolId, isActive: true },
    });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.fee.create({
      data: {
        schoolId,
        studentId: dto.studentId,
        title: dto.title.trim(),
        amount: dto.amount,
        currencyCode: school.currencyCode,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        note: dto.note,
      },
      include: { student: true, payments: true },
    });
  }

  async pay(schoolId: string, feeId: string, dto: PayFeeDto) {
    const fee = await this.prisma.fee.findFirst({
      where: { id: feeId, schoolId },
      include: { payments: true },
    });
    if (!fee) throw new NotFoundException('Fee record not found');

    const paid = fee.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const balance = Number(fee.amount) - paid;
    if (dto.amount > balance + 0.0001) {
      throw new ConflictException(`Payment exceeds outstanding balance of ${balance.toFixed(2)}`);
    }

    return this.prisma.feePayment.create({
      data: {
        feeId,
        amount: dto.amount,
        currencyCode: fee.currencyCode,
        paymentMode: dto.paymentMode ?? 'CASH',
        referenceNo: dto.referenceNo,
        note: dto.note,
      },
      include: { fee: { include: { student: true } } },
    });
  }

  async summary(schoolId: string) {
    const fees = await this.prisma.fee.findMany({
      where: { schoolId },
      include: { payments: true },
    });
    let billed = 0, paid = 0;
    for (const fee of fees) {
      billed += Number(fee.amount);
      paid += fee.payments.reduce((s, p) => s + Number(p.amount), 0);
    }
    return { billed, paid, outstanding: Math.max(0, billed - paid), records: fees.length };
  }
}
