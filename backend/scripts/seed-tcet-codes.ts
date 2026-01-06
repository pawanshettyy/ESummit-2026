import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed Thakur Student codes (100000 to 102499)
 * ONLY FOR TCET, TGBS, AND TIMSR STUDENTS
 * Total: 2500 codes
 */
async function seedTcetCodes() {
  console.log('🌱 Seeding Thakur Student codes (TCET/TGBS/TIMSR)...');

  const codes: string[] = [];
  
  // Generate codes from 100000 to 102499
  for (let i = 100000; i <= 102499; i++) {
    codes.push(i.toString());
  }

  console.log(`📝 Generated ${codes.length} codes`);

  // Check if codes already exist
  const existingCount = await prisma.tcetCode.count();
  
  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} existing codes in database`);
    console.log('❓ Do you want to skip seeding? (Existing codes will be preserved)');
    return;
  }

  // Insert codes in batches to avoid memory issues
  const batchSize = 500;
  let inserted = 0;

  for (let i = 0; i < codes.length; i += batchSize) {
    const batch = codes.slice(i, i + batchSize);
    
    await prisma.tcetCode.createMany({
      data: batch.map(code => ({
        code,
        isAssigned: false
      })),
      skipDuplicates: true
    });

    inserted += batch.length;
    console.log(`✅ Inserted ${inserted}/${codes.length} codes`);
  }

  console.log('🎉 Thakur Student codes seeded successfully!');
  console.log(`📊 Total codes available: ${codes.length}`);
}

// Run the seed function
seedTcetCodes()
  .catch((error) => {
    console.error('❌ Error seeding Thakur Student codes:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
