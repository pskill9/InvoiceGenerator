# Invoice Generator

A modern web application for generating invoices and automatically updating Google Sheets.

## Features

- Modern, responsive user interface
- Configurable company details and logo
- Invoice generation with customizable fields
- Automatic Google Sheets integration
- PDF generation capability
- Environment-based configuration

## Setup

1. Clone this repository
2. Create a `.env` file in the root directory (see Configuration section below)
3. Place your company logo in the root directory (default: `logo.svg`)
4. Open `index.html` in a modern web browser

## Configuration

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Company Details
COMPANY_NAME=Your Company Name
COMPANY_ADDRESS=Your Company Address
COMPANY_PHONE=Your Phone Number
COMPANY_EMAIL=Your Email
COMPANY_WEBSITE=Your Website
COMPANY_LOGO=logo.svg

# Invoice Settings
INVOICE_PREFIX=INV-
INVOICE_DATE_FORMAT=YYYY-MM-DD
INVOICE_CURRENCY=USD
INVOICE_TAX_RATE=0.1

# Google Sheets Integration
GOOGLE_SHEETS_URL=Your Google Apps Script Web App URL
```

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
   - Add the URL to your `.env` file as `GOOGLE_SHEETS_URL`

## Usage

1. Open `index.html` in a modern web browser
2. Fill in the client information:
   - Client Name
   - Client Email
   - Client Address

3. Set invoice details:
   - Invoice Date
   - Due Date

4. Add invoice items:
   - Click "Add Item" to add new items
   - Fill in description, quantity, and rate for each item
   - Amounts are calculated automatically
   - Use the "×" button to remove items

5. Review the invoice:
   - Click the eye icon to preview the invoice
   - Check the automatically calculated subtotal, tax, and total

6. Generate and save:
   - Click the download icon to generate a PDF
   - The invoice data is automatically sent to your configured Google Sheet

## Technologies Used

- HTML5
- CSS3 with modern features
- Vanilla JavaScript (ES6+)
- Font Awesome for icons
- jsPDF for PDF generation
- html2canvas for PDF rendering
- Google Sheets API integration
- Environment variable support
