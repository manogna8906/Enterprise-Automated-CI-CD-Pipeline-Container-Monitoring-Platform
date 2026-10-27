const express = require('express');
const os = require('os');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Enterprise Container Monitoring HUD</title>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
            <style>
                :root {
                    --bg-color: #030712;
                    --panel-bg: rgba(15, 23, 42, 0.75);
                    --border-glow: rgba(56, 189, 248, 0.3);
                    --neon-cyan: #38bdf8;
                    --neon-purple: #c084fc;
                    --neon-green: #22c55e;
                    --text-main: #f8fafc;
                    --text-muted: #94a3b8;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'JetBrains Mono', monospace;
                    background-color: var(--bg-color);
                    background-image: 
                        radial-gradient(circle at 50% 10%, rgba(56, 189, 248, 0.08) 0%, transparent 60%),
                        linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 100% 100%, 40px 40px, 40px 40px;
                    color: var(--text-main);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .hud-container {
                    width: 100%;
                    max-width: 900px;
                    background: var(--panel-bg);
                    backdrop-filter: blur(16px);
                    border: 1px solid var(--border-glow);
                    border-radius: 16px;
                    box-shadow: 0 0 50px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255,255,255,0.1);
                    overflow: hidden;
                    position: relative;
                }
                .hud-header {
                    background: linear-gradient(90deg, rgba(56,189,248,0.1), rgba(192,132,252,0.1));
                    padding: 20px 30px;
                    border-bottom: 1px solid rgba(56, 189, 248, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .hud-title {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.3rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: var(--neon-cyan);
                    text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
                }
                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(34, 197, 94, 0.15);
                    border: 1px solid rgba(34, 197, 94, 0.4);
                    padding: 6px 14px;
                    border-radius: 20px;
                    color: var(--neon-green);
                    font-weight: 700;
                    font-size: 0.85rem;
                }
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background-color: var(--neon-green);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--neon-green);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                    70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
                    100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                .hud-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 30px;
                }
                .metric-card {
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }
                .metric-card:hover {
                    border-color: rgba(56, 189, 248, 0.4);
                    box-shadow: 0 4px 20px rgba(56, 189, 248, 0.1);
                }
                .metric-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }
                .metric-value {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .pipeline-section {
                    margin: 0 30px 30px 30px;
                    background: rgba(15, 23, 42, 0.9);
                    border: 1px solid rgba(192, 132, 252, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                }
                .pipeline-title {
                    font-size: 0.75rem;
                    color: var(--neon-purple);
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 12px;
                }
                .pipeline-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .badge {
                    background: rgba(56, 189, 248, 0.1);
                    border: 1px solid rgba(56, 189, 248, 0.3);
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    color: var(--neon-cyan);
                }
            </style>
        </head>
        <body>
            <div class="hud-container">
                <div class="hud-header">
                    <div class="hud-title">⚡ CONTAINER MONITORING SYSTEM</div>
                    <div class="status-badge">
                        <div class="pulse-dot"></div>
                        ONLINE
                    </div>
                </div>
                <div class="hud-grid">
                    <div class="metric-card">
                        <div class="metric-label">Host Architecture</div>
                        <div class="metric-value">${os.arch().toUpperCase()} / ${os.platform().toUpperCase()}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">System Uptime</div>
                        <div class="metric-value">${Math.floor(os.uptime() / 60)} MIN</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Memory Load</div>
                        <div class="metric-value">${Math.round((1 - os.freemem() / os.totalmem()) * 100)}% USED</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Runtime Engine</div>
                        <div class="metric-value">NODE ${process.version}</div>
                    </div>
                </div>
                <div class="pipeline-section">
                    <div class="pipeline-title">Active Automated Pipeline Stack</div>
                    <div class="pipeline-badges">
                        <span class="badge">GitHub VCS</span>
                        <span class="badge">Jenkins CI/CD</span>
                        <span class="badge">Docker Container</span>
                        <span class="badge">Selenium Testing</span>
                        <span class="badge">Ansible Verification</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Application running on http://localhost:${PORT}`);
});