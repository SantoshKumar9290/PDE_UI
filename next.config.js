/** @type {import('next').NextConfig} */



const securityHeaders = [
	{key: 'X-Frame-Options',value: 'SAMEORIGIN'},
	//{key:'X-Content-Type-Options', value:'nosniff'},
	//{key:'X-XSS-Protection', value:'1; mode=block'},
	 //{key:'Content-Security-Policy',value:"default-src *; style-src * 'unsafe-inline'; script-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: 'unsafe-inline'; connect-src * 'unsafe-inline'; frame-src *"},
	//{key:'Strict-Transport-Security', value:'max-age=63072000; includeSubDomains; preload'},
]
require("dotenv").config();
const nextConfig = {
	async headers() {
		return [
		  {
			// Apply these headers to all routes in your application.
			source: '/:path*',
			headers: securityHeaders,
		  },
		]
	},
	poweredByHeader: false,
	reactStrictMode: false,
	swcMinify: true,
	basePath: "/PDE",
	env:{
		BACKEND_URL:process.env.BACKEND_URL,
		PAYMENT_URL:process.env.PAYMENT_URL,
		EC_API_URL:process.env.EC_API_URL,
		TRANSFER_DOC_URL:process.env.TRANSFER_DOC_URL,
		IGRS_AADHAAR_ENC: 'igrsSecretPhrase',
                PASSPORT_URL:process.env.PASSPORT_URL,
                PAN_URL:process.env.PAN_URL,
		ADR_SECRET_KEY :'!Gr$@SeCApP&',
                ADR_SECRET_IV :'!Gr$IVApP&' ,
		OWN_ESIGN_URL: 'https://esign.rs.ap.gov.in/igrs-esign-service',
		SLOT_BOOKING_URL:process.env.SLOT_BOOKING_URL,
		AADHAR_URL:process.env.AADHAR_URL
		
	},
}

module.exports = nextConfig
