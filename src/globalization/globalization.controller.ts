import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GlobalizationService } from './globalization.service';

@Controller('globalization')
export class GlobalizationController {
  constructor(private readonly globalization: GlobalizationService) {}

  @Get('options')
  options() { return this.globalization.options(); }

  @Get('school')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER, Role.ACCOUNTANT)
  school(@Req() req: any) { return this.globalization.schoolSettings(req.user.schoolId); }

  @Get('format-money')
  formatMoney(@Query('amount') amount: string, @Query('currency') currency: string, @Query('locale') locale?: string) {
    return { formatted: this.globalization.formatMoney(Number(amount), currency, locale ?? 'en') };
  }

  @Get('format-date')
  formatDate(@Query('value') value: string, @Query('timezone') timezone: string, @Query('locale') locale?: string) {
    return { formatted: this.globalization.formatDate(value, timezone, locale ?? 'en') };
  }
}
