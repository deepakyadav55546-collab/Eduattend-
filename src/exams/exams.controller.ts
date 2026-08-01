import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SaveMarkDto } from './dto/save-mark.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamsController {
  constructor(private readonly exams: ExamsService) {}
  @Get() @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER) list(@Req() r:any){ return this.exams.list(r.user.schoolId); }
  @Post() @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN) create(@Req() r:any,@Body() d:CreateExamDto){ return this.exams.create(r.user.schoolId,d); }
  @Post(':id/subjects') @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN) addSubject(@Req() r:any,@Param('id') id:string,@Body() d:CreateSubjectDto){ return this.exams.addSubject(r.user.schoolId,id,d); }
  @Post(':id/marks') @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER) saveMark(@Req() r:any,@Param('id') id:string,@Body() d:SaveMarkDto){ return this.exams.saveMark(r.user.schoolId,id,d); }
  @Get(':id/report/:studentId') @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER) report(@Req() r:any,@Param('id') id:string,@Param('studentId') studentId:string){ return this.exams.reportCard(r.user.schoolId,id,studentId); }
}
