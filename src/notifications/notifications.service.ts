import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  list(schoolId: string, role: string) {
    return this.prisma.notification.findMany({
      where: { schoolId, OR: [{ audience: 'ALL' }, { audience: role }] },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  create(schoolId: string, title: string, message: string, audience = 'ALL') {
    return this.prisma.notification.create({
      data: { schoolId, title: title.trim(), message: message.trim(), audience },
    });
  }
}
