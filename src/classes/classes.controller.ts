import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateSectionDto } from './dto/create-section.dto';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
export class ClassesController {
  constructor(private readonly classes: ClassesService) {}
  @Get() list(@Req() req:any){ return this.classes.list(req.user.schoolId); }
  @Post() createClass(@Req() req:any,@Body() dto:CreateClassDto){return this.classes.createClass(req.user.schoolId,dto);}
  @Post('sections') createSection(@Req() req:any,@Body() dto:CreateSectionDto){return this.classes.createSection(req.user.schoolId,dto);}
  @Delete(':id') removeClass(@Req() req:any,@Param('id') id:string){return this.classes.removeClass(req.user.schoolId,id);}
  @Delete('sections/:id') removeSection(@Req() req:any,@Param('id') id:string){return this.classes.removeSection(req.user.schoolId,id);}
}
