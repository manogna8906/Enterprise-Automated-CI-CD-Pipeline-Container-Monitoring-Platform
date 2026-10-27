const express = require('express');
const os = require('os');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Container Monitoring System</title>
            <style>
                body { font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; text-align: center; padding: 50px; }
                .card { background: #1e293b; display: inline-block; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                h1 { color: #38bdf8; }
                .badge { background: #22c55e; color: #fff; padding: 6px 14px; border-radius: 20px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 Automated Container Monitoring System</h1>
                <p>Status: <span class="badge">ONLINE</span></p>
                <p>Host Architecture: <strong>${os.arch()}</strong></p>
                <p>System Uptime: <strong>${Math.floor(os.uptime() / 60)} minutes</strong></p>
                <p>Deployment Pipeline: <strong>Jenkins + Docker + Selenium + Ansible</strong></p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Application running on http://localhost:${PORT}`);
});