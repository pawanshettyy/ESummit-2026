const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Simple test script to upload the Excel file
async function testImport() {
  const excelPath = path.join(__dirname, '..', 'passes', 'TCET-ESUMMIT-2026-Attendees-12-01-2026-09-57-55.xlsx');

  if (!fs.existsSync(excelPath)) {
    console.error('Excel file not found at:', excelPath);
    return;
  }

  console.log('Testing import with file:', excelPath);

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(excelPath), {
      filename: 'TCET-ESUMMIT-2026-Attendees-12-01-2026-09-57-55.xlsx',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const response = await fetch('http://localhost:5000/api/v1/admin/import-passes', {
      method: 'POST',
      headers: {
        'x-admin-secret': 'esummit2026-admin-import',
        ...form.getHeaders()
      },
      body: form
    });

    const result = await response.json();
    console.log('Import result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testImport();