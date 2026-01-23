import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateEventRegistrations() {
  console.log('Starting migration of event registrations...');

  try {
    // Get all existing event registrations
    const registrations = await prisma.eventRegistration.findMany({
      include: {
        event: true,
        user: true,
        pass: true,
      },
    });

    console.log(`Found ${registrations.length} registrations to migrate`);

    let migratedCount = 0;

    for (const registration of registrations) {
      const formData = registration.formData as any;

      if (!formData || !formData.registrationType) {
        console.log(`Skipping registration ${registration.id} - no formData or registrationType`);
        continue;
      }

      const baseData = {
        id: registration.id,
        userId: registration.userId,
        eventId: registration.eventId,
        passId: registration.passId,
        registrationDate: registration.registrationDate,
        status: registration.status,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt,
        // User profile data
        fullName: registration.user?.fullName,
        email: registration.user?.email,
        phone: registration.user?.phone,
        college: registration.user?.college,
        userType: (registration.user as any)?.user_type ?? (registration.user as any)?.userType ?? null,
        userStartupName: registration.user?.startup_name,
        userStartupStage: registration.user?.startup_stage,
        companyName: registration.user?.company_name,
        designation: registration.user?.designation,
      };

      try {
        switch (formData.registrationType) {
          case 'ten_minute_million':
            if (formData.attendeeType === 'audience') {
              await prisma.tenMinuteMillionAudience.create({
                data: baseData,
              });
            } else {
              await prisma.tenMinuteMillionParticipant.create({
                data: {
                  ...baseData,
                  attendeeType: formData.attendeeType || 'participant',
                  startupName: formData.startupName,
                  udhyamRegistrationNumber: formData.udhyamRegistrationNumber || formData.cin || '',
                  dpiitCertified: formData.dpiitCertified,
                  startupStage: formData.startupStage,
                  problemStatement: formData.problemStatement,
                  solution: formData.solution,
                  usp: formData.usp,
                  demoLink: formData.demoLink,
                  pitchDeckLink: formData.pitchDeckLink,
                },
              });
            }
            break;

          case 'angel_roundtable':
            if (formData.attendeeType === 'audience') {
              await prisma.angelRoundtableAudience.create({
                data: baseData,
              });
            } else {
              await prisma.angelRoundtableParticipant.create({
                data: {
                  ...baseData,
                  attendeeType: formData.attendeeType || 'student',
                  startupStage: formData.startupStage,
                  problemStatement: formData.problemStatement,
                  solution: formData.solution,
                  usp: formData.usp,
                  demoLink: formData.demoLink,
                  pitchDeckLink: formData.pitchDeckLink,
                },
              });
            }
            break;

          case 'pitch_arena':
            if (formData.attendeeType === 'audience') {
              await prisma.pitchArenaAudience.create({
                data: baseData,
              });
            } else {
              await prisma.pitchArenaParticipant.create({
                data: {
                  ...baseData,
                  attendeeType: formData.attendeeType || 'student',
                  startupName: formData.startupName,
                  studentName: formData.studentName,
                  ideaBrief: formData.ideaBrief,
                  documentLink: formData.documentLink,
                  pitchDeckLink: formData.pitchDeckLink,
                },
              });
            }
            break;

          case 'simple':
            // Route simple registrations to specific event tables based on eventId
            switch (registration.event.eventId) {
              case 'd1-ipl-auction':
                await prisma.iPLAuctionRegistration.create({
                  data: baseData,
                });
                break;
              case 'd1-ai-buildathon-start':
                await prisma.aIBuildathonStartRegistration.create({
                  data: baseData,
                });
                break;
              case 'd1-design-thinking':
                await prisma.designThinkingWorkshopRegistration.create({
                  data: baseData,
                });
                break;
              case 'd1-finance-marketing':
                await prisma.financeMarketingWorkshopRegistration.create({
                  data: baseData,
                });
                break;
              case 'd1-startup-expo':
                await prisma.startupExpoRegistration.create({
                  data: baseData,
                });
                break;
              case 'd1-panel-discussion':
                await prisma.panelDiscussionRegistration.create({
                  data: baseData,
                });
                break;
              case 'd1-networking-arena':
                await prisma.networkingArenaRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-incubator-summit':
                await prisma.incubatorSummitRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-ai-buildathon-final':
                await prisma.aIBuildathonFinalRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-startup-league':
                await prisma.startupLeagueRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-data-analytics':
                await prisma.dataAnalyticsWorkshopRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-startup-expo':
                await prisma.startupExpoRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-networking-arena':
                await prisma.networkingArenaRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-internship-fair':
                await prisma.internshipFairRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-youth-conclave':
                await prisma.youthConclaveRegistration.create({
                  data: baseData,
                });
                break;
              case 'd2-closing':
                // Closing ceremony: fall back to simpleEventRegistration
                await prisma.simpleEventRegistration.create({
                  data: baseData,
                });
                break;
              default:
                // Fallback to generic simple registration for any unmapped events
                await prisma.simpleEventRegistration.create({
                  data: baseData,
                });
                break;
            }
            break;

          default:
            console.log(`Unknown registration type: ${formData.registrationType} for registration ${registration.id}`);
            continue;
        }

        migratedCount++;
        console.log(`Migrated registration ${registration.id} (${migratedCount}/${registrations.length})`);

      } catch (error) {
        console.error(`Error migrating registration ${registration.id}:`, error);
        // Continue with next registration
      }
    }

    console.log(`Migration completed! Successfully migrated ${migratedCount} registrations.`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateEventRegistrations()
  .then(() => {
    console.log('Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });