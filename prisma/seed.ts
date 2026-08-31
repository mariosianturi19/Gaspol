// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed credentials come from the environment, never from this file.
 *
 * Earlier revisions hard-coded the passwords here. This file is committed to a
 * public repository, so anything written in it is a published credential for
 * whatever database the seed has been run against. Reading them from the
 * environment keeps the account structure in version control while the secrets
 * stay out of it.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Seeding would otherwise create an account with a ` +
        `predictable password. Set it in .env before running the seed; see .env.example.`,
    );
  }
  return value;
}

async function main() {
  const prosesor = await prisma.user.upsert({
    where: { email: requireEnv('SEED_PROSESOR_EMAIL') },
    update: {},
    create: {
      email: requireEnv('SEED_PROSESOR_EMAIL'),
      name: 'Prosesor',
      password: await hash(requireEnv('SEED_PROSESOR_PASSWORD'), 12),
      role: 'PROSESOR',
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: requireEnv('SEED_SALES_EMAIL') },
    update: {},
    create: {
      email: requireEnv('SEED_SALES_EMAIL'),
      name: 'Sales',
      password: await hash(requireEnv('SEED_SALES_PASSWORD'), 12),
      role: 'SALES',
    },
  });

  // Log the accounts, not their passwords.
  console.log('Seeded:', { prosesor: prosesor.email, sales: sales.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
