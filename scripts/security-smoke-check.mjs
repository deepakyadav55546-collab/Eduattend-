import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mustContain = [
  ['src/parents/parents.service.ts', 'where: { schoolId, userId }'],
  ['src/homework/homework.service.ts', "actor.role === 'PARENT'"],
  ['src/notifications/notifications.service.ts', "OR: [{ audience: 'ALL' }, { audience: role }]"],
  ['src/auth/jwt-auth.guard.ts', "startsWith('Bearer ')"],
  ['src/auth/auth.service.ts', "refreshTokenHash"],
  ['src/schools/schools.service.ts', "requesterSchoolId !== id"],
  ['src/homework/homework.service.ts', "student: { parentId: parent.id, isActive: true }"],
  ['src/timetable/timetable.service.ts', "actor?.role === 'PARENT'"],
];

let failed = 0;
for (const [file, needle] of mustContain) {
  const full = path.join(root, file);
  const ok = fs.existsSync(full) && fs.readFileSync(full, 'utf8').includes(needle);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${file}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log('Security smoke checks passed.');
