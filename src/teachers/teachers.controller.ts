import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';

@Controller('teachers') @UseGuards(JwtAuthGuard,RolesGuard)
export class TeachersController{
 constructor(private readonly teachers:TeachersService){}
 @Get() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN) list(@Req() r:any){return this.teachers.list(r.user.schoolId);}
 @Get('me/sections') @Roles(Role.TEACHER) sections(@Req() r:any){return this.teachers.sectionsForTeacher(r.user.schoolId,r.user.sub);}
 @Post() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN) create(@Req() r:any,@Body() d:CreateTeacherDto){return this.teachers.create(r.user.schoolId,d);}
 @Patch(':id') @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN) update(@Req() r:any,@Param('id') id:string,@Body() d:UpdateTeacherDto){return this.teachers.update(r.user.schoolId,id,d);}
 @Delete(':id') @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN) remove(@Req() r:any,@Param('id') id:string){return this.teachers.remove(r.user.schoolId,id);}
}
