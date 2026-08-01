# EduAttend Global V14 — Production Deployment Runbook

## 1. Install dependencies
Use a normal npm registry with network access:
`npm install --no-audit --no-fund`

## 2. Configure production environment
Copy `.env.example` to `.env` and provide production secrets/database URL.
Do not commit `.env`.

## 3. Database
Run:
`npx prisma generate`
`npx prisma migrate deploy`

## 4. Build
Run:
`npm run build`

## 5. Start
Run:
`npm run start:prod`

## 6. Smoke test
Verify authentication, school isolation, student/teacher management,
attendance, fees/payments, exams/marks, homework, notifications,
globalization settings, and role permissions against a real PostgreSQL database.

## 7. Public launch
Only after all smoke tests pass: configure HTTPS/domain, backups,
monitoring/logging, rate limiting, secret rotation, and the Flutter/mobile
release build.
