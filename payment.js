// payment.js - Handles payment redirects
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const paymentId = event.queryStringParameters?.razorpay_payment_id;
    
    if (!paymentId) {
        return {
            statusCode: 302,
            headers: {
                Location: '/?error=no_payment_id'
            }
        };
    }
    
    // Log payment
    const logEntry = `${new Date().toISOString()},${paymentId}\n`;
    fs.appendFileSync(path.join(__dirname, 'payments.log'), logEntry);
    
    return {
        statusCode: 302,
        headers: {
            Location: `/?payment_id=${paymentId}`
        }
    };
};