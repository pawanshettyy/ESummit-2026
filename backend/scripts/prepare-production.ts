/**
 * Production Database Preparation Script
 * 
 * This script:
 * 1. Cleans all test/development data
 * 2. Seeds required data (TCET codes)
 * 3. Verifies database integrity
 * 
 * WARNING: This will DELETE ALL existing data!
 * Run only when preparing for production deployment.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Cleaning database...\n');

  try {
    // Delete in correct order to respect foreign key constraints
    console.log('  ➤ Deleting check-ins...');
    const deletedCheckIns = await prisma.checkIn.deleteMany({});
    console.log(`    ✓ Deleted ${deletedCheckIns.count} check-ins`);

    console.log('  ➤ Deleting event registrations...');
    const deletedRegistrations = await prisma.eventRegistration.deleteMany({});
    console.log(`    ✓ Deleted ${deletedRegistrations.count} event registrations`);

    console.log('  ➤ Deleting transactions...');
    const deletedTransactions = await prisma.transaction.deleteMany({});
    console.log(`    ✓ Deleted ${deletedTransactions.count} transactions`);

    console.log('  ➤ Deleting passes...');
    const deletedPasses = await prisma.pass.deleteMany({});
    console.log(`    ✓ Deleted ${deletedPasses.count} passes`);

    console.log('  ➤ Deleting users...');
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`    ✓ Deleted ${deletedUsers.count} users`);

    console.log('  ➤ Clearing TCET codes (will reseed)...');
    const deletedTcetCodes = await prisma.tcetCode.deleteMany({});
    console.log(`    ✓ Deleted ${deletedTcetCodes.count} TCET codes`);

    console.log('\n✅ Database cleaned successfully!\n');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
}

async function seedTcetCodes() {
  console.log('🌱 Seeding Thakur Student codes (100000-102499)...\n');

  const START_CODE = 100000;
  const END_CODE = 102499;
  const BATCH_SIZE = 500;

  try {
    let seeded = 0;
    
    for (let start = START_CODE; start <= END_CODE; start += BATCH_SIZE) {
      const end = Math.min(start + BATCH_SIZE - 1, END_CODE);
      const codes = [];

      for (let code = start; code <= end; code++) {
        codes.push({
          code: code.toString(),
          isAssigned: false,
        });
      }

      await prisma.tcetCode.createMany({
        data: codes,
        skipDuplicates: true,
      });

      seeded += codes.length;
      console.log(`  ➤ Seeded codes ${start} to ${end} (${seeded}/${END_CODE - START_CODE + 1})`);
    }

    console.log(`\n✅ Successfully seeded ${seeded} Thakur Student codes!\n`);
  } catch (error) {
    console.error('❌ Error seeding TCET codes:', error);
    throw error;
  }
}

async function verifyDatabase() {
  console.log('🔍 Verifying database state...\n');

  try {
    const userCount = await prisma.user.count();
    const passCount = await prisma.pass.count();
    const tcetCodeCount = await prisma.tcetCode.count();
    const usedTcetCodes = await prisma.tcetCode.count({ where: { isAssigned: true } });
    const transactionCount = await prisma.transaction.count();

    console.log('  Database Statistics:');
    console.log(`    • Users: ${userCount}`);
    console.log(`    • Passes: ${passCount}`);
    console.log(`    • Thakur Student Codes: ${tcetCodeCount} (${usedTcetCodes} used, ${tcetCodeCount - usedTcetCodes} available)`);
    console.log(`    • Transactions: ${transactionCount}`);

    if (userCount === 0 && passCount === 0 && tcetCodeCount === 2500) {
      console.log('\n✅ Database is production-ready!\n');
      return true;
    } else if (tcetCodeCount !== 2500) {
      console.log('\n⚠️  Warning: Expected 2500 TCET codes but found', tcetCodeCount);
      return false;
    } else {
      console.log('\n⚠️  Warning: Database may still contain test data');
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying database:', error);
    throw error;
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  PRODUCTION DATABASE PREPARATION');
  console.log('='.repeat(60) + '\n');

  console.log('⚠️  WARNING: This will DELETE ALL existing data!\n');
  console.log('   This includes:');
  console.log('   • All users');
  console.log('   • All passes');
  console.log('   • All transactions');
  console.log('   • All check-ins');
  console.log('   • All event registrations');
  console.log('   • All TCET codes (will be reseeded)\n');

  // Add confirmation in production
  if (process.env.NODE_ENV === 'production') {
    console.log('❌ Cannot run in production environment without explicit confirmation!');
    console.log('   If you want to proceed, remove the NODE_ENV check in the script.\n');
    return;
  }

  try {
    // Step 1: Clean database
    await cleanDatabase();

    // Step 2: Seed required data
    await seedTcetCodes();

    // Step 3: Verify database
    await verifyDatabase();

    console.log('='.repeat(60));
    console.log('  ✅ PRODUCTION PREPARATION COMPLETE');
    console.log('='.repeat(60) + '\n');

    console.log('Next steps:');
    console.log('  1. Verify database at: http://localhost:5555 (Prisma Studio)');
    console.log('  2. Test the application locally');
    console.log('  3. Deploy to production\n');

  } catch (error) {
    console.error('\n❌ Production preparation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
