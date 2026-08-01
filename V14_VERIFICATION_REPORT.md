# EduAttend Global V14 Verification Report

## Verification run

### security_smoke
- Exit code: `0`
```text

> eduattend-backend@1.0.2 security:smoke
> node scripts/security-smoke-check.mjs

PASS src/parents/parents.service.ts
PASS src/homework/homework.service.ts
PASS src/notifications/notifications.service.ts
PASS src/auth/jwt-auth.guard.ts
PASS src/auth/auth.service.ts
PASS src/schools/schools.service.ts
PASS src/homework/homework.service.ts
PASS src/timetable/timetable.service.ts
Security smoke checks passed.


```

- Package: `eduattend-backend`
- Version: `1.0.2`
- Build script: `nest build`

## Release status

- Security/unit verification was attempted in this environment.
- A production build is not marked PASS unless dependency installation and compilation succeed.
- Live PostgreSQL/API validation still requires a real deployment environment and credentials.