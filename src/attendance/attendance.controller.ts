import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}

  @Post('mark')
  mark(@Req() req: any, @Body() dto: MarkAttendanceDto) {
    return this.attendance.mark(req.user.schoolId, req.user.sub, dto);
  }

  @Post('bulk')
  bulk(@Req() req: any, @Body() dto: BulkAttendanceDto) {
    return this.attendance.bulk(req.user.schoolId, req.user.sub, dto);
  }

  @Get('date')
  byDate(@Req() req: any, @Query('date') date: string) {
    return this.attendance.listByDate(req.user.schoolId, date);
  }

  @Get('monthly')
  monthly(@Req() req: any, @Query('month') month: string) {
    return this.attendance.monthlyReport(req.user.schoolId, month);
  }
}
