import {Body,Controller,Get,Post,Query,Req,UseGuards} from '@nestjs/common';
import {Role} from '@prisma/client'; import {JwtAuthGuard} from '../auth/jwt-auth.guard'; import {Roles} from '../auth/roles.decorator'; import {RolesGuard} from '../auth/roles.guard'; import {TimetableService} from './timetable.service';
@Controller('timetable') @UseGuards(JwtAuthGuard,RolesGuard)
export class TimetableController{
 constructor(private readonly s:TimetableService){}
 @Get() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN,Role.TEACHER,Role.PARENT) list(@Req()r:any,@Query('className')c?:string,@Query('sectionName')sec?:string){return this.s.list(r.user.schoolId,c,sec,r.user);}
 @Post() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN) create(@Req()r:any,@Body()d:any){return this.s.create(r.user.schoolId,d);}
}
