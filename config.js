const config = {
    // Company Details
    company: {
        name: "Your Company Name",
        address: "Your Company Address",
        phone: "Phone Number",
        email: "company@email.com",
        website: "www.company.com",
        logoPath: "logo.png"
    },

    // Invoice Settings
    invoice: {
        prefix: "INV-",
        startingNumber: 1001,
        dateFormat: "YYYY-MM-DD",
        currency: "USD",
        taxRate: 0.1 // 10%
    },

    // Google Sheets Integration
    googleSheets: {
        url: "https://script.google.com/macros/s/AKfycbzhGFZDdMkYgEKtz6iKkbiIzaw9atSTcMtVUYJBIb9RuYDj5Vjk_gtZnlCAVfipKvXP/exec"
    },

    // PDF Settings
    pdf: {
        paperSize: "A4",
        orientation: "portrait",
        margin: {
            top: "2cm",
            bottom: "2cm",
            left: "2cm",
            right: "2cm"
        }
    }
};

export default config;
