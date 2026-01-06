module.exports = {
  apps: [
    {
      name: "pde_frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/opt/apps/frontend/current",
      env: {
        NODE_ENV: "production",

        BACKEND_URL: "http://10.10.120.190:8080",
        PAYMENT_URL: "http://payment-url",
        EC_API_URL: "http://ec-api-url",
        TRANSFER_DOC_URL: "http://transfer-doc-url",
        SLOT_BOOKING_URL: "http://slot-booking-url",
        AADHAR_URL: "http://aadhar-url",
        PASSPORT_URL: "http://passport-url",
        PAN_URL: "http://pan-url"
      }
    }
  ]
};
