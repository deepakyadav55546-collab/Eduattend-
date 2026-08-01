# EduAttend Backend V13.2 — Security Hardened Release Candidate

## Included
- JWT authentication + refresh-token rotation/hash validation
- Role-based authorization
- School-level tenant isolation
- Parent-to-child authorization for attendance/reports/homework/timetable
- Homework, exams, fees, attendance, notifications, timetable, classes, students and teachers modules
- Prisma PostgreSQL schema
- Static security smoke checks
- NestJS TypeScript build configuration (`tsconfig.json`, `nest-cli.json`)

## Commands
```bash
npm install
npm run prisma:generate
npm run build
npm run security:smoke
```

For a database-backed staging verification:
```bash
npm run prisma:migrate
npm run start:dev
```

## Release gate
The static security smoke test passes 8/8 in the current environment. A production TypeScript build and live database/API smoke test still require a normal Node/npm environment with access to the declared dependencies and a staging PostgreSQL database.


## Global readiness foundation (V14)
Schools now carry country, currency, timezone and locale metadata. This lets the same EduAttend deployment serve schools in different countries without hard-coding India-specific formatting into business logic.

### Example school settings
- India: `IN` / `INR` / `Asia/Kolkata` / `en-IN`
- United States: `US` / `USD` / `America/New_York` / `en-US`
- United Kingdom: `GB` / `GBP` / `Europe/London` / `en-GB`

These fields are configuration metadata; country-specific education, tax, payment and privacy compliance still needs to be implemented and verified before launch in each market.


## Global V14 — iteration 2
The backend now exposes a dedicated globalization module for country/currency/locale/timezone settings. Fees and payments snapshot the school currency so historical financial records remain stable if a school later changes its default currency.

Run the migration before using the updated fees schema:
```bash
npx prisma migrate deploy
```
