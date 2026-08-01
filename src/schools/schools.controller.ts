import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolsService } from './schools.service';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(private readonly schools: SchoolsService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  list() { return this.schools.list(); }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CreateSchoolDto) { return this.schools.create(dto); }

  @Get(':id/ui-config')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  getUiConfig(@Req() req: any, @Param('id') id: string) {
    return this.schools.getUiConfig(id, req.user.role, req.user.schoolId ?? null);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  get(@Req() req: any, @Param('id') id: string) {
    return this.schools.get(id, req.user.role, req.user.schoolId ?? null);
  }
}
