# EduAttend V13.2 Security + Release Test Report

## Current verification
- Static security smoke check: **PASS (8/8)**.
- Nest module registration reviewed: **PASS**.
- TypeScript/Nest build configuration added: **PASS** (`tsconfig.json`, `nest-cli.json`).
- Package version: **1.0.2**.

## Security checks covered
1. Parent profile resolves from the authenticated `User.userId`.
2. Parent attendance/report access requires the student to be an active child linked to that parent.
3. Parent homework submissions require the target student to be linked to that parent.
4. Parent homework listing exposes only submissions for the parent's active children.
5. Parent timetable is restricted to linked children's class/section combinations.
6. School Admin school lookup is restricted to the authenticated school.
7. Notification listing is filtered by audience and school.
8. JWT bearer validation and refresh-token hash validation are present.

## Environment limitation
A real production build could not be executed here because the available npm registry returns HTTP 404 for the declared NestJS packages (including `@nestjs/cli` and `@nestjs/common`). This is an environment/package-registry limitation, not a successful build result.

## Required final gate
Run in a normal Node/npm environment with PostgreSQL staging:
```bash
npm install
npm run prisma:generate
npm run build
npm run security:smoke
npm run prisma:migrate
npm run start:dev
```
Then execute the manual API smoke-test sequence for login, refresh, logout, role isolation, parent isolation, homework, notifications, attendance, exams and fees.
