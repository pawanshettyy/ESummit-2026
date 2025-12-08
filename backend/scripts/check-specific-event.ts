import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvent() {
  try {
    // Check what eventId the frontend might be sending
    const testEventIds = [
      'd1-pitch-arena',
      'd2-pitch-arena',
      'pitch-arena',
      'Pitch Arena - Idea to Reality'
    ];

    for (const eventId of testEventIds) {
      console.log(`\nTrying eventId: "${eventId}"`);
      const event = await prisma.event.findFirst({
        where: { eventId },
      });

      if (event) {
        console.log(`✅ FOUND: ${event.title} (id: ${event.id})`);
      } else {
        console.log('❌ NOT FOUND');
      }
    }

    // List all event IDs
    console.log('\n\n=== ALL EVENT IDs IN DATABASE ===');
    const allEvents = await prisma.event.findMany({
      select: { eventId: true, title: true },
      orderBy: { eventId: 'asc' },
    });

    allEvents.forEach(e => {
      console.log(`${e.eventId} - ${e.title}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvent();
