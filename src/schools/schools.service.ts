import { ForbiddenException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { INSTITUTE_UI_CONFIG, InstituteType } from './institute-type.config';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { users: true } } },
    });
  }

  async create(dto: CreateSchoolDto) {
    const exists = await this.prisma.school.findUnique({ where: { code: dto.code } });
    if (exists) throw new ConflictException('School code already exists');
    return this.prisma.school.create({
      data: {
        name: dto.name,
        code: dto.code,
        countryCode: dto.countryCode ?? 'IN',
        currencyCode: dto.currencyCode ?? 'INR',
        timezone: dto.timezone ?? 'Asia/Kolkata',
        locale: dto.locale ?? 'en-IN',
        instituteType: dto.instituteType ?? InstituteType.SCHOOL,
      },
    });
  }

  async getUiConfig(id: string, role: string, requesterSchoolId: string | null) {
    if (role !== 'SUPER_ADMIN' && requesterSchoolId !== id) {
      throw new ForbiddenException('You can only access your own school');
    }
    const school = await this.prisma.school.findUnique({
      where: { id },
      select: { id: true, instituteType: true },
    });
    if (!school) throw new NotFoundException('School not found');
    return {
      schoolId: school.id,
      instituteType: school.instituteType,
      ...INSTITUTE_UI_CONFIG[school.instituteType as InstituteType],
    };
  }

  async get(id: string, role: string, requesterSchoolId: string | null) {
    if (role !== 'SUPER_ADMIN' && requesterSchoolId !== id) {
      throw new ForbiddenException('You can only access your own school');
    }
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }
}
