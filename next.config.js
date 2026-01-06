/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // { key: 'X-Content-Type-Options', value: 'nosniff' },
  // { key: 'X-XSS-Protection', value: '1; mode=block' },
  // { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,

  // Application base path
  basePath: "/PDE",

  // Keeping env as in old file (NO CHANGE in behavior)
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    PAYMENT_URL: process.env.PAYMENT_URL,
    EC_API_URL: process.env.EC_API_URL,
    TRANSFER_DOC_URL: process.env.TRANSFER_DOC_URL,
    PASSPORT_URL: process.env.PASSPORT_URL,
    PAN_URL: process.env.PAN_URL,
    SLOT_BOOKING_URL: process.env.SLOT_BOOKING_URL,
    AADHAR_URL: process.env.AADHAR_URL,

    // Constants (as in old file)
    IGRS_AADHAAR_ENC: 'igrsSecretPhrase',
    ADR_SECRET_KEY: '!Gr$@SeCApP&',
    ADR_SECRET_IV: '!Gr$IVApP&',
    OWN_ESIGN_URL: 'https://esign.rs.ap.gov.in/igrs-esign-service',
    GOOGLE_KEY: 'AIzaSyBg1nhgyR7W28t3nMCwIRiHVEClk12JFPY'
  },
};

module.exports = nextConfig;
