import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateFeeDto } from './dto/create-fee.dto';
import { PayFeeDto } from './dto/pay-fee.dto';
import { FeesService } from './fees.service';

@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeesController {
  constructor(private readonly fees: FeesService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
  list(@Req() req: any, @Query('studentId') studentId?: string) {
    return this.fees.list(req.user.schoolId, studentId);
  }

  @Get('summary')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  summary(@Req() req: any) {
    return this.fees.summary(req.user.schoolId);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  create(@Req() req: any, @Body() dto: CreateFeeDto) {
    return this.fees.create(req.user.schoolId, dto);
  }

  @Post(':id/pay')
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  pay(@Req() req: any, @Param('id') id: string, @Body() dto: PayFeeDto) {
    return this.fees.pay(req.user.schoolId, id, dto);
  }
}
