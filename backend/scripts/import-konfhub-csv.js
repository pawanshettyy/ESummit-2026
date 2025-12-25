const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const prisma = new PrismaClient();

/**
 * Import passes from KonfHub CSV export
 * Handles all KonfHub export fields
 * 
 * Usage: node scripts/import-konfhub-csv.js path/to/export.csv
 */
async function importKonfHubCSV() {
  try {
    const csvPath = process.argv[2];
    
    console.log('📥 KonfHub CSV Import\n');
    
    if (!csvPath) {
      console.error('❌ Please provide CSV file path');
      console.log('\nUsage: node scripts/import-konfhub-csv.js path/to/export.csv');
      console.log('\nExample: node scripts/import-konfhub-csv.js ../data/konfhub-export.csv');
      process.exit(1);
    }

    if (!fs.existsSync(csvPath)) {
      console.error(`❌ File not found: ${csvPath}`);
      process.exit(1);
    }

    console.log(`Reading: ${csvPath}\n`);
    
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`Found ${records.length} records\n`);

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNum = i + 2; // +2 because CSV is 1-indexed and has header
      
      try {
        // Extract email (required)
        const email = record['Email Address']?.toLowerCase().trim();
        
        if (!email) {
          console.log(`⚠️  Row ${rowNum}: No email found, skipping`);
          results.skipped++;
          continue;
        }

        // Skip if not confirmed
        const registrationStatus = record['Registration status'];
        if (registrationStatus && registrationStatus.toLowerCase() === 'cancelled') {
          console.log(`⏭️  Row ${rowNum}: Registration cancelled, skipping (${email})`);
          results.skipped++;
          continue;
        }

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Create user if they don't exist
          const name = record['Name'] || email.split('@')[0];
          const college = record['College'];
          const phone = record['Phone Number'];
          
          user = await prisma.user.create({
            data: {
              email,
              fullName: name,
              clerkUserId: '', // Will be updated when user signs in
              ...(college && { college }),
              ...(phone && { phone }),
            },
          });
          console.log(`👤 Created user: ${email}`);
        }

        // Extract ticket data
        const bookingId = record['Booking ID'];
        const ticketName = record['Ticket name'];
        const ticketPrice = parseFloat(record['Ticket price']?.replace(/[^0-9.]/g, '') || '0');
        const amountPaid = parseFloat(record['Amount paid']?.replace(/[^0-9.]/g, '') || ticketPrice || '0');
        const registeredAt = record['Registered at'];
        const paymentId = record['Payment ID'];
        const couponCode = record['Coupon code'];
        const ticketUrl = record['Ticket URL'];
        
        // Check if pass already exists
        const existingPass = await prisma.pass.findFirst({
          where: {
            OR: [
              { bookingId: bookingId },
              { 
                AND: [
                  { userId: user.id },
                  { passType: ticketName || 'General Pass' },
                ]
              }
            ],
          },
        });

        const passData = {
          userId: user.id,
          passType: ticketName || 'General Pass',
          passId: bookingId || `PASS-${Date.now()}-${i}`,
          bookingId: bookingId,
          konfhubTicketId: paymentId || bookingId,
          konfhubOrderId: paymentId,
          price: amountPaid,
          purchaseDate: registeredAt ? new Date(registeredAt) : new Date(),
          ticketDetails: {
            // Store all KonfHub fields for reference
            attendeeName: record['Name'],
            email: record['Email Address'],
            country: record['Country'],
            phone: record['Phone Number'],
            college: record['College'],
            ticketName: record['Ticket name'],
            bookingId: record['Booking ID'],
            paymentId: record['Payment ID'],
            ticketPrice: record['Ticket price'],
            amountPaid: record['Amount paid'],
            balanceAmount: record['Balance amount'],
            registeredAt: record['Registered at'],
            registrationStatus: record['Registration status'],
            couponCode: record['Coupon code'],
            ticketUrl: record['Ticket URL'],
            invoiceUrl: record['Invoice URL'],
            checkInStatus: record['Check-in Status'],
            utmSource: record['UTM source'],
            utmMedium: record['UTM medium'],
            utmCampaign: record['UTM campaign'],
            importedAt: new Date().toISOString(),
          },
          qrCodeUrl: ticketUrl || null,
          qrCodeData: bookingId || paymentId,
          status: registrationStatus?.toLowerCase() === 'confirmed' ? 'Active' : 'Pending',
        };

        if (existingPass) {
          await prisma.pass.update({
            where: { id: existingPass.id },
            data: {
              price: passData.price,
              purchaseDate: passData.purchaseDate,
              ticketDetails: passData.ticketDetails,
              qrCodeUrl: passData.qrCodeUrl,
              status: passData.status,
            },
          });
          console.log(`✅ Row ${rowNum}: Updated pass for ${email}`);
          results.updated++;
        } else {
          await prisma.pass.create({ data: passData });
          console.log(`✅ Row ${rowNum}: Created pass for ${email} (${ticketName})`);
          results.created++;
        }

      } catch (error) {
        console.error(`❌ Row ${rowNum}: Error - ${error.message}`);
        results.errors.push({ 
          row: rowNum, 
          email: record['Email Address'],
          error: error.message 
        });
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passes created: ${results.created}`);
    console.log(`🔄 Passes updated: ${results.updated}`);
    console.log(`⏭️  Rows skipped: ${results.skipped}`);
    console.log(`❌ Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      results.errors.forEach(err => {
        console.log(`   Row ${err.row} (${err.email || 'Unknown'}): ${err.error}`);
      });
    }

    console.log('='.repeat(60));
    console.log('\n✨ Import completed!');

    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

importKonfHubCSV();
