import {Body,Controller,Get,Param,Post,Req,UseGuards} from '@nestjs/common';
import {Role} from '@prisma/client'; import {JwtAuthGuard} from '../auth/jwt-auth.guard'; import {Roles} from '../auth/roles.decorator'; import {RolesGuard} from '../auth/roles.guard'; import {HomeworkService} from './homework.service';
@Controller('homework') @UseGuards(JwtAuthGuard,RolesGuard)
export class HomeworkController{
 constructor(private readonly s:HomeworkService){}
 @Get() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN,Role.TEACHER,Role.PARENT) list(@Req()r:any){return this.s.list(r.user.schoolId,r.user);}
 @Post() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN,Role.TEACHER) create(@Req()r:any,@Body()d:any){return this.s.create(r.user.schoolId,d);}
 @Post(':id/submit') @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN,Role.TEACHER,Role.PARENT) submit(@Req()r:any,@Param('id')id:string,@Body()d:any){return this.s.submit(r.user.schoolId,id,d.studentId,d,r.user);}
}
