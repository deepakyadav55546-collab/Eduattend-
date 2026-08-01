import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SUPPORTED_LOCALES = ['en', 'en-IN', 'hi-IN', 'en-US', 'en-GB'] as const;
const SUPPORTED_CURRENCIES = ['INR', 'USD', 'GBP', 'EUR', 'CAD', 'AUD', 'AED', 'SGD'] as const;
const COUNTRY_DEFAULTS: Record<string, { currencyCode: string; timezone: string; locale: string }> = {
  IN: { currencyCode: 'INR', timezone: 'Asia/Kolkata', locale: 'en-IN' },
  US: { currencyCode: 'USD', timezone: 'America/New_York', locale: 'en-US' },
  GB: { currencyCode: 'GBP', timezone: 'Europe/London', locale: 'en-GB' },
  AE: { currencyCode: 'AED', timezone: 'Asia/Dubai', locale: 'en' },
  SG: { currencyCode: 'SGD', timezone: 'Asia/Singapore', locale: 'en' },
  CA: { currencyCode: 'CAD', timezone: 'America/Toronto', locale: 'en' },
  AU: { currencyCode: 'AUD', timezone: 'Australia/Sydney', locale: 'en' },
};

@Injectable()
export class GlobalizationService {
  constructor(private readonly prisma: PrismaService) {}

  options() {
    return {
      countries: Object.entries(COUNTRY_DEFAULTS).map(([countryCode, defaults]) => ({ countryCode, ...defaults })),
      locales: SUPPORTED_LOCALES,
      currencies: SUPPORTED_CURRENCIES,
    };
  }

  async schoolSettings(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true, name: true, countryCode: true, currencyCode: true, timezone: true, locale: true },
    });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  formatMoney(amount: number, currencyCode: string, locale = 'en') {
    if (!Number.isFinite(amount)) {
      throw new BadRequestException('Invalid amount');
    }
    if (!SUPPORTED_CURRENCIES.includes(currencyCode as (typeof SUPPORTED_CURRENCIES)[number])) {
      throw new BadRequestException('Unsupported currencyCode');
    }
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(amount);
    } catch {
      throw new BadRequestException('Invalid locale');
    }
  }

  formatDate(value: string, timezone: string, locale = 'en') {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Invalid date');
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: timezone }).format(date);
    } catch {
      throw new BadRequestException('Invalid locale or timezone');
    }
  }
}
