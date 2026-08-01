import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimetableService {
 constructor(private readonly prisma:PrismaService){}

 async list(schoolId:string, className?:string, sectionName?:string, actor?:any){
  if (actor?.role === 'PARENT') {
   const parent = await this.prisma.parent.findFirst({
    where: { schoolId, userId: actor.sub },
    include: { students: { where: { isActive: true }, include: { class: true, section: true } } },
   });
   if (!parent) throw new NotFoundException('Parent profile not found');

   const allowed = parent.students
    .filter(s => s.class?.name)
    .map(s => ({ className: s.class!.name, sectionName: s.section?.name ?? null }));

   const matches = allowed.filter(x =>
    (!className || x.className === className) &&
    (!sectionName || x.sectionName === sectionName)
   );
   if (matches.length === 0) return [];

   const ors = matches.map(x => ({
    className: x.className,
    ...(x.sectionName === null ? { sectionName: null } : { sectionName: x.sectionName }),
   }));
   return this.prisma.timetableEntry.findMany({
    where: { schoolId, OR: ors },
    orderBy:[{dayOfWeek:'asc'},{periodNo:'asc'}]
   });
  }

  return this.prisma.timetableEntry.findMany({
   where:{schoolId,...(className?{className}:{}),...(sectionName?{sectionName}:{})},
   orderBy:[{dayOfWeek:'asc'},{periodNo:'asc'}]
  });
 }

 create(schoolId:string,d:any){
  return this.prisma.timetableEntry.create({
   data:{schoolId,className:d.className,sectionName:d.sectionName,dayOfWeek:Number(d.dayOfWeek),periodNo:Number(d.periodNo),subject:d.subject,teacherName:d.teacherName,startTime:d.startTime,endTime:d.endTime}
  });
 }
}
