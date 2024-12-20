# Invoice Generator

A modern web application for generating invoices and automatically updating Google Sheets.

## Features

- Modern, responsive user interface
- Configurable company details and logo
- Invoice generation with customizable fields
- Automatic Google Sheets integration
- PDF generation capability

## Setup

1. Clone this repository
2. Update `config.js` with your company details and logo path
3. Open `index.html` in a modern web browser

## Configuration

### Basic Setup
Edit `config.js` to customize:
- Company details
- Logo path
- Invoice numbering format
- Tax rate settings

### Google Sheets Integration Setup

1. Create a new Google Sheet with the following columns:
   ```
   | Timestamp | Invoice Number | Client Name | Client Email | Invoice Date | Due Date | Subtotal | Tax | Total |
   ```

2. Go to Tools > Script editor in your Google Sheet

3. Replace the content with this Google Apps Script code:

```javascript
   // Configuration
const SPREADSHEET_ID = ''; // Replace with your spreadsheet ID
const SHEET_NAME = 'Sheet1'; // Update if you renamed your sheet

function doPost(e) {
  try {
    // Validate request
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received');
    }

    // Parse the JSON data from the request
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      throw new Error('Invalid JSON data');
    }

    // Get the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!spreadsheet) {
      throw new Error('Could not open spreadsheet');
    }

    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Could not find specified sheet');
    }

    // Append the form data to the sheet
   sheet.appendRow([
         data.timestamp,
         data.invoiceNumber,
         data.clientName,
         data.clientEmail,
         data.invoiceDate,
         data.dueDate,
         data.subtotal,
         data.tax,
         data.total
       ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data successfully recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    console.error(error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

```

4. Deploy the script:
   - Click "Deploy" > "New deployment"
   - Choose "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Authorize the application when prompted
   - Copy the provided Web App URL

5. Update `config.js`:
   ```javascript
   googleSheets: {
       url: "YOUR_COPIED_WEB_APP_URL"
   }
   ```

Note: The Google Sheet must be accessible to your Google account, and you need to authorize the script to run under your account during the first deployment.

## Usage

1. Fill in the invoice details in the form
2. Preview the invoice
3. Generate PDF and/or send to Google Sheets
4. Download or print the generated invoice

## Technologies Used

- HTML5
- CSS3 with modern features
- Vanilla JavaScript
- Google Sheets API integration
