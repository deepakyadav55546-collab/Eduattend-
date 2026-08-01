# EduAttend V13.2 Release Checklist

- [x] AppModule registers all feature modules
- [x] School Admin cross-school school lookup blocked
- [x] Parent access restricted to linked active children
- [x] Parent homework submissions restricted to own children
- [x] Parent timetable restricted to linked children's class/section
- [x] Notification audience filtering enforced
- [x] JWT bearer authentication and expiry handling present
- [x] Refresh token stored as bcrypt hash and rotated on refresh
- [x] TypeScript/Nest build configuration added
- [x] Static security smoke test: 8/8 PASS
- [ ] `npm install` in a normal package registry environment (sandbox registry currently returns 404 for `@nestjs/cli@^11.0.0`)
- [ ] `npm run prisma:generate`
- [ ] `npm run build`
- [ ] staging PostgreSQL migration
- [ ] live API smoke test (login/refresh/logout + role isolation)
- [ ] frontend/APK integration test
- [x] Globalization input hardening + unit coverage added

## Release decision
**Release Candidate — not yet production-certified.**

- [x] Universal institute-type product specification added
- [ ] Backend institute-type implementation
- [ ] Dynamic dashboard/navigation implementation

- [x] Institute type enum/config implemented
- [x] Type-specific UI terminology/module map implemented
- [x] Unit tests for universal institute configuration added
- [ ] Generate/apply Prisma migration in a real PostgreSQL environment
- [ ] Wire frontend/mobile navigation to institute configuration

- [x] Institute-type setup API field
- [x] Tenant-safe `GET /schools/:id/ui-config` endpoint
- [x] Prisma migration for existing schools
- [ ] Frontend/mobile consumes `ui-config` dynamically

- [x] Flutter cross-platform frontend scaffold connected to `ui-config` API contract
- [ ] Complete production Flutter screens/authentication/persistence
- [ ] Android/iOS release builds and device testing
