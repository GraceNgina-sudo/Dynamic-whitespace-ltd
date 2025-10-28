// Google Analytics configuration
const MEASUREMENT_ID = 'G-20SJ85K947'; // Store ID in separate file

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', MEASUREMENT_ID);