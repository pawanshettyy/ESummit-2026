import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvents() {
  try {
    console.log('Checking events in database...\n');

    const events = await prisma.event.findMany({
      select: {
        id: true,
        eventId: true,
        title: true,
      },
      take: 5,
    });

    console.log(`Total events found: ${events.length}\n`);
    console.log('First 5 events:');
    events.forEach((event) => {
      console.log(`- ID (UUID): ${event.id}`);
      console.log(`  eventId: ${event.eventId}`);
      console.log(`  Title: ${event.title}\n`);
    });

    // Try to find a specific event by eventId
    const testEventId = 'd1-pitch-arena';
    console.log(`\nTrying to find event with eventId="${testEventId}"...`);
    const testEvent = await prisma.event.findFirst({
      where: { eventId: testEventId },
    });

    if (testEvent) {
      console.log('✅ Event found!');
      console.log(`   ID: ${testEvent.id}`);
      console.log(`   Title: ${testEvent.title}`);
    } else {
      console.log('❌ Event not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents();
