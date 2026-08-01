import { AttendanceStatus } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';

export class MarkAttendanceDto {
  @IsString() studentId!: string;
  @IsISO8601() date!: string;
  @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @IsOptional() @IsString() note?: string;
}
