const config = {
    // Company Details
    company: {
        name: "ANUBIS CONSULTING",
        address: "81-19525 73 Avenue",
        phone: "5863728531",
        email: "team@anubisconsulting.org",
        website: "anubisconsulting.org",
        logoPath: "A.png"
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
        url: "https://script.google.com/macros/s/AKfycbwS5G2I_uxdTBcNzeEtMifhL2fAPcC00_JGfq8KKZulOYumiHnR7XfdJ-BSpK8mJuyu/exec"
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
