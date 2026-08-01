import { AttendanceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsISO8601, IsOptional, IsString, ValidateNested } from 'class-validator';

class AttendanceItem {
  @IsString() studentId!: string;
  @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @IsOptional() @IsString() note?: string;
}

export class BulkAttendanceDto {
  @IsISO8601() date!: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItem)
  items!: AttendanceItem[];
}
