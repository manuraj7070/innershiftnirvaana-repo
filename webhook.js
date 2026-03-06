// webhook.js - Receives payment confirmations from Razorpay
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const paymentId = data.payload?.payment?.entity?.id;
        
        if (paymentId) {
            // Store payment in verified log
            const logEntry = `${new Date().toISOString()},${paymentId},VERIFIED\n`;
            fs.appendFileSync(path.join(__dirname, 'verified_payments.log'), logEntry);
            
            console.log('✅ Payment verified:', paymentId);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
        };
        
    } catch (error) {
        console.error('Webhook error:', error);
        return { statusCode: 500, body: 'Error' };
    }
};