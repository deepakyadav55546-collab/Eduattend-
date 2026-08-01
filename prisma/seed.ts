import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@12345', 12);

  const school = await prisma.school.upsert({
    where: { code: 'DEMO001' },
    update: {},
    create: {
      name: 'Demo Public School',
      code: 'DEMO001',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@eduattend.local' },
    update: {},
    create: {
      name: 'School Admin',
      email: 'admin@eduattend.local',
      passwordHash,
      role: Role.SCHOOL_ADMIN,
      schoolId: school.id,
    },
  });

  console.log('Demo school:', school.code);
  console.log('Login: admin@eduattend.local / Admin@12345');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
