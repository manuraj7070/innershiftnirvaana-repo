// payment-log.js - View all payments (protect this in production)
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    try {
        const verifiedPath = path.join(__dirname, 'verified_payments.log');
        const paymentsPath = path.join(__dirname, 'payments.log');
        
        const verified = fs.existsSync(verifiedPath) 
            ? fs.readFileSync(verifiedPath, 'utf8').split('\n').filter(Boolean)
            : [];
            
        const payments = fs.existsSync(paymentsPath)
            ? fs.readFileSync(paymentsPath, 'utf8').split('\n').filter(Boolean)
            : [];
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' },
            body: `
<!DOCTYPE html>
<html>
<head>
    <title>Payment Logs</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #1e1e2f; color: #0f0; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #444; padding: 8px; text-align: left; }
        th { background: #2d2d3f; }
        .verified { color: #0f0; }
        .pending { color: #ff0; }
    </style>
</head>
<body>
    <h1>📋 Payment Logs</h1>
    
    <h2>✅ Verified Payments (${verified.length})</h2>
    <table>
        <tr><th>Timestamp</th><th>Payment ID</th><th>Status</th></tr>
        ${verified.map(line => {
            const [timestamp, id] = line.split(',');
            return `<tr><td>${timestamp}</td><td>${id}</td><td class="verified">✓ Verified</td></tr>`;
        }).join('')}
    </table>
    
    <h2>⏳ All Payments (${payments.length})</h2>
    <table>
        <tr><th>Timestamp</th><th>Payment ID</th></tr>
        ${payments.map(line => {
            const [timestamp, id] = line.split(',');
            return `<tr><td>${timestamp}</td><td>${id}</td></tr>`;
        }).join('')}
    </table>
</body>
</html>
            `
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error: ' + error.message
        };
    }
};