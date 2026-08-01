# EduAttend Global V14 Progress

## Completed in this iteration
- Ran the repository security smoke check: 8/8 PASS.
- Hardened globalization amount validation and added date/invalid-input unit coverage.
- Added a dedicated globalization module.
- Added supported country/currency/locale options endpoint.
- Added locale-aware money formatting using `Intl.NumberFormat`.
- Added timezone-aware date/time formatting using `Intl.DateTimeFormat`.
- Added authenticated school-settings endpoint for tenant-specific locale/currency/timezone.
- Added currency snapshots to fees and fee payments so historical amounts remain tied to the currency used when billed/paid.
- Added a Prisma migration for the new fee currency fields.
- Added unit coverage for INR/USD formatting and unsupported currency rejection.

## API additions
- `GET /api/globalization/options`
- `GET /api/globalization/school` (authenticated)
- `GET /api/globalization/format-money?amount=1234.50&currency=USD&locale=en-US`
- `GET /api/globalization/format-date?value=2026-07-31T12:00:00Z&timezone=Asia/Kolkata&locale=en-IN`

## Still pending before public launch
- Full translation catalog and frontend language switcher.
- International payment gateway integration and country-specific tax/compliance rules.
- Production build + database migration + live API smoke tests in a normal Node/PostgreSQL environment (blocked in this sandbox because the configured npm registry does not provide `@nestjs/cli@^11.0.0`).
- Flutter/Web client integration with the new globalization endpoints.


## Universal Education Platform
- InstituteType enum added to the Prisma model layer.
- Supported types: School, College/University, Coaching, Tuition, Language, Computer/IT, Skill Training, Other.
- Type-specific terminology and module configuration added with unit coverage.

- Institute type is accepted during school/institute creation.
- Tenant-safe `GET /schools/:id/ui-config` returns the appropriate terminology and modules.
- Migration added for existing School records.
        