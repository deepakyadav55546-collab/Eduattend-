import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard,RolesGuard)
export class NotificationsController {
 constructor(private readonly service:NotificationsService){}
 @Get() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN,Role.TEACHER,Role.PARENT)
 list(@Req() r:any){return this.service.list(r.user.schoolId, r.user.role);}
 @Post() @Roles(Role.SUPER_ADMIN,Role.SCHOOL_ADMIN)
 create(@Req() r:any,@Body() d:any){return this.service.create(r.user.schoolId,d.title,d.message,d.audience??'ALL');}
}
