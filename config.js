import loadEnv from './loadEnv.js';

const defaultConfig = {
    // Company Details
    company: {
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        logoPath: ""
    },

    // Invoice Settings
    invoice: {
        prefix: "INV-",
        dateFormat: "YYYY-MM-DD",
        currency: "USD",
        taxRate: 0.1
    },

    // Google Sheets Integration
    googleSheets: {
        url: ""
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

async function getConfig() {
    const env = await loadEnv();
    
    return {
        company: {
            name: env.COMPANY_NAME || defaultConfig.company.name,
            address: env.COMPANY_ADDRESS || defaultConfig.company.address,
            phone: env.COMPANY_PHONE || defaultConfig.company.phone,
            email: env.COMPANY_EMAIL || defaultConfig.company.email,
            website: env.COMPANY_WEBSITE || defaultConfig.company.website,
            logoPath: env.COMPANY_LOGO || defaultConfig.company.logoPath
        },
        invoice: {
            prefix: env.INVOICE_PREFIX || defaultConfig.invoice.prefix,
            dateFormat: env.INVOICE_DATE_FORMAT || defaultConfig.invoice.dateFormat,
            currency: env.INVOICE_CURRENCY || defaultConfig.invoice.currency,
            taxRate: parseFloat(env.INVOICE_TAX_RATE || defaultConfig.invoice.taxRate)
        },
        googleSheets: {
            url: env.GOOGLE_SHEETS_URL || defaultConfig.googleSheets.url
        },
        pdf: defaultConfig.pdf
    };
}

export default getConfig;
