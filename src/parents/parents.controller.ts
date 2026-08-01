import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ParentsService } from './parents.service';

@Controller('parent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
export class ParentsController {
  constructor(private readonly parents: ParentsService) {}

  @Get('dashboard')
  dashboard(@Req() req:any) {
    return this.parents.dashboard(req.user.schoolId, req.user.sub);
  }

  @Get('students/:studentId/attendance')
  attendance(@Req() req:any,@Param('studentId') studentId:string) {
    return this.parents.attendance(req.user.schoolId, req.user.sub, studentId);
  }

  @Get('students/:studentId/report/:examId')
  report(@Req() req:any,@Param('studentId') studentId:string,@Param('examId') examId:string) {
    return this.parents.studentReport(req.user.schoolId, req.user.sub, studentId, examId);
  }
}
