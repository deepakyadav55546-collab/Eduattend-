import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SchoolsModule } from './schools/schools.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AdminModule } from './admin/admin.module';
import { FeesModule } from './fees/fees.module';
import { ExamsModule } from './exams/exams.module';
import { ParentsModule } from './parents/parents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TimetableModule } from './timetable/timetable.module';
import { HomeworkModule } from './homework/homework.module';
import { GlobalizationModule } from './globalization/globalization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SchoolsModule,
    ClassesModule,
    StudentsModule,
    TeachersModule,
    AttendanceModule,
    AdminModule,
    FeesModule,
    ExamsModule,
    ParentsModule,
    NotificationsModule,
    TimetableModule,
    HomeworkModule,
    GlobalizationModule,
  ],
})
export class AppModule {}
