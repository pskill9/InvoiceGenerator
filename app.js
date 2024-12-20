import config from './config.js';

// Initialize company details
function initializeCompanyDetails() {
    const logo = document.getElementById('company-logo');
    const companyDetails = document.getElementById('company-details');
    
    logo.src = config.company.logoPath;
    companyDetails.innerHTML = `
        <h3>${config.company.name}</h3>
        <p>${config.company.address}</p>
        <p>${config.company.phone}</p>
        <p>${config.company.email}</p>
    `;
}

// Handle items and calculations
class InvoiceCalculator {
    constructor() {
        this.itemsContainer = document.getElementById('items-container');
        this.addItemBtn = document.getElementById('add-item');
        this.subtotalElement = document.getElementById('subtotal');
        this.taxRateElement = document.getElementById('tax-rate');
        this.taxAmountElement = document.getElementById('tax-amount');
        this.totalElement = document.getElementById('total');

        this.setupEventListeners();
        this.updateTaxRate();
    }

    setupEventListeners() {
        this.addItemBtn.addEventListener('click', () => this.addItemRow());
        this.itemsContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('item-quantity') || 
                e.target.classList.contains('item-rate')) {
                this.updateRowAmount(e.target.closest('.item-row'));
            }
        });
        this.itemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                e.target.closest('.item-row').remove();
                this.updateTotals();
            }
        });
    }

    addItemRow() {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <div class="form-group">
                <label>Description</label>
                <input type="text" class="item-description" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="item-quantity" min="1" required>
            </div>
            <div class="form-group">
                <label>Rate</label>
                <input type="number" class="item-rate" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Amount</label>
                <input type="number" class="item-amount" readonly>
            </div>
            <button type="button" class="remove-item">×</button>
        `;
        this.itemsContainer.appendChild(row);
    }

    updateRowAmount(row) {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        const amount = quantity * rate;
        row.querySelector('.item-amount').value = amount.toFixed(2);
        this.updateTotals();
    }

    updateTaxRate() {
        this.taxRateElement.textContent = (config.invoice.taxRate * 100).toFixed(0);
    }

    updateTotals() {
        const amounts = Array.from(this.itemsContainer.querySelectorAll('.item-amount'))
            .map(input => parseFloat(input.value) || 0);
        
        const subtotal = amounts.reduce((sum, amount) => sum + amount, 0);
        const taxAmount = subtotal * config.invoice.taxRate;
        const total = subtotal + taxAmount;

        this.subtotalElement.textContent = subtotal.toFixed(2);
        this.taxAmountElement.textContent = taxAmount.toFixed(2);
        this.totalElement.textContent = total.toFixed(2);
    }
}

// Preview functionality
class InvoicePreview {
    constructor() {
        this.modal = document.getElementById('preview-modal');
        this.previewContent = document.getElementById('invoice-preview');
        this.closeBtn = this.modal.querySelector('.close');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('preview-btn').addEventListener('click', () => this.showPreview());
        this.closeBtn.addEventListener('click', () => this.hidePreview());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hidePreview();
        });
    }

    showPreview() {
        const invoiceData = this.gatherInvoiceData();
        this.previewContent.innerHTML = this.generatePreviewHTML(invoiceData);
        this.modal.style.display = 'block';
    }

    hidePreview() {
        this.modal.style.display = 'none';
    }

    gatherInvoiceData() {
        return {
            clientName: document.getElementById('client-name').value,
            clientEmail: document.getElementById('client-email').value,
            clientAddress: document.getElementById('client-address').value,
            invoiceDate: document.getElementById('invoice-date').value,
            dueDate: document.getElementById('due-date').value,
            items: Array.from(document.querySelectorAll('.item-row')).map(row => ({
                description: row.querySelector('.item-description').value,
                quantity: row.querySelector('.item-quantity').value,
                rate: row.querySelector('.item-rate').value,
                amount: row.querySelector('.item-amount').value
            })),
            subtotal: document.getElementById('subtotal').textContent,
            taxAmount: document.getElementById('tax-amount').textContent,
            total: document.getElementById('total').textContent
        };
    }

    generatePreviewHTML(data) {
        // Generate invoice number using GoogleSheetsIntegration's method
        const sheetsIntegration = new GoogleSheetsIntegration();
        const invoiceNumber = `${config.invoice.prefix}${sheetsIntegration.generateInvoiceNumber()}`;

        return `
            <div class="preview-invoice">
                <div class="preview-header">
                    <div class="company-info">
                        <img src="${config.company.logoPath}" alt="Company Logo">
                        <div>
                            <h3>${config.company.name}</h3>
                            <p>${config.company.address}</p>
                            <p>${config.company.phone}</p>
                            <p>${config.company.email}</p>
                        </div>
                    </div>
                    <div class="invoice-info">
                        <h2>INVOICE</h2>
                        <h3 class="invoice-number">${invoiceNumber}</h3>
                        <p>Date: ${data.invoiceDate}</p>
                        <p>Due Date: ${data.dueDate}</p>
                    </div>
                </div>
                
                <div class="client-info">
                    <h3>Bill To:</h3>
                    <p>${data.clientName}</p>
                    <p>${data.clientEmail}</p>
                    <p>${data.clientAddress}</p>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${item.rate}</td>
                                <td>${item.amount}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="preview-totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${data.subtotal}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (${config.invoice.taxRate * 100}%):</span>
                        <span>${data.taxAmount}</span>
                    </div>
                    <div class="total-row total">
                        <span>Total:</span>
                        <span>${data.total}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Google Sheets Integration
class GoogleSheetsIntegration {
    constructor() {
        this.url = config.googleSheets.url;
        document.getElementById('send-to-sheets').addEventListener('click', () => this.sendToSheets());
    }

    generateInvoiceNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const millis = String(now.getMilliseconds()).padStart(3, '0');
        
        return `${year}${month}${day}-${hours}${minutes}${seconds}${millis}`;
    }

    sendToSheets() {
        try {
            const invoiceData = this.gatherInvoiceData();
            
            // Create a hidden form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.url;
            form.target = '_blank'; // Open in new tab
            form.style.display = 'none';

            // Add data as hidden fields
            Object.entries(invoiceData).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                // Convert items array to JSON string
                input.value = key === 'items' ? JSON.stringify(value) : value;
                form.appendChild(input);
            });

            // Add form to body and submit
            document.body.appendChild(form);
            form.submit();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(form);
            }, 1000);

            alert('Data sent to Google Sheets! Check the new tab for confirmation.');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send to Google Sheets. Check console for details.');
        }
    }

    gatherInvoiceData() {
        // Get all invoice items
        const items = Array.from(document.querySelectorAll('.item-row')).map(row => ({
            description: row.querySelector('.item-description').value,
            quantity: row.querySelector('.item-quantity').value,
            rate: row.querySelector('.item-rate').value,
            amount: row.querySelector('.item-amount').value
        }));

        return {
            timestamp: new Date().toISOString(),
            invoiceNumber: `${config.invoice.prefix}${this.generateInvoiceNumber()}`,
            clientName: document.getElementById('client-name').value,
            clientEmail: document.getElementById('client-email').value,
            invoiceDate: document.getElementById('invoice-date').value,
            dueDate: document.getElementById('due-date').value,
            subtotal: document.getElementById('subtotal').textContent,
            tax: document.getElementById('tax-amount').textContent,
            total: document.getElementById('total').textContent,
            items: items // This will be converted to JSON string during form submission
        };
    }
}

// PDF Generation
class PDFGenerator {
    constructor() {
        document.getElementById('generate-pdf').addEventListener('click', () => this.generatePDF());
    }

    async generatePDF() {
        console.log('Starting PDF generation...');
        try {
            // Show preview first
            const preview = new InvoicePreview();
            preview.showPreview();

            // Wait for preview to render
            await new Promise(resolve => setTimeout(resolve, 500));

            const element = document.querySelector('.preview-invoice');
            if (!element) {
                throw new Error('Preview element not found');
            }

            console.log('Capturing preview as image...');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true
            });

            console.log('Creating PDF...');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add the image to PDF
            pdf.addImage(
                canvas.toDataURL('image/jpeg', 1.0),
                'JPEG',
                0,
                0,
                imgWidth,
                imgHeight
            );

            // Save the PDF
            // Get invoice number for the filename
            const sheetsIntegration = new GoogleSheetsIntegration();
            const invoiceNumber = `${config.invoice.prefix}${sheetsIntegration.generateInvoiceNumber()}`;
            pdf.save(`${invoiceNumber}.pdf`);
            console.log('PDF generated successfully');

            // Hide preview
            preview.hidePreview();
        } catch (error) {
            console.error('Error in PDF generation:', error);
            alert('An error occurred while generating the PDF. Check console for details.');
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeCompanyDetails();
    const calculator = new InvoiceCalculator();
    const preview = new InvoicePreview();
    const sheetsIntegration = new GoogleSheetsIntegration();
    const pdfGenerator = new PDFGenerator();

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('due-date').value = dueDate.toISOString().split('T')[0];
});
