// verify-payment.js - Checks if payment is valid
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const paymentId = event.queryStringParameters?.id;
    
    if (!paymentId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ valid: false, error: 'No payment ID' })
        };
    }
    
    try {
        // Read verified payments log
        const logPath = path.join(__dirname, 'verified_payments.log');
        
        if (!fs.existsSync(logPath)) {
            return {
                statusCode: 200,
                body: JSON.stringify({ valid: false, error: 'No payments found' })
            };
        }
        
        const logs = fs.readFileSync(logPath, 'utf8');
        const isValid = logs.includes(paymentId);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                valid: isValid,
                paymentId: paymentId,
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ valid: false, error: error.message })
        };
    }
};