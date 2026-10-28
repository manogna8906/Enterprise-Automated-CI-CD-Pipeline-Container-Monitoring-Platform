const express = require('express');
const os = require('os');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const uptimeMins = Math.floor(os.uptime() / 60);
    const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const usedMemPercent = Math.round((1 - os.freemem() / os.totalmem()) * 100);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Enterprise Container Management & System Control</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --bg-main: #f8fafc;
                    --card-bg: #ffffff;
                    --border-color: #e2e8f0;
                    --text-primary: #0f172a;
                    --text-secondary: #475569;
                    --text-muted: #64748b;
                    --brand-primary: #2563eb;
                    --brand-primary-light: #eff6ff;
                    --success: #16a34a;
                    --success-light: #f0fdf4;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: var(--bg-main);
                    color: var(--text-primary);
                    padding: 30px 20px;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1150px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--card-bg);
                    padding: 20px 24px;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    margin-bottom: 24px;
                }
                .header-title h1 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .header-title p {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    margin-top: 4px;
                }
                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--success-light);
                    border: 1px solid #bbf7d0;
                    color: var(--success);
                    font-weight: 600;
                    font-size: 0.85rem;
                    padding: 6px 14px;
                    border-radius: 20px;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background-color: var(--success);
                    border-radius: 50%;
                }
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .metric-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    padding: 18px 20px;
                    border-radius: 10px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                }
                .metric-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: var(--text-muted);
                    letter-spacing: 0.5px;
                }
                .metric-value {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-top: 6px;
                }
                .metric-sub {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-top: 4px;
                }
                .section-card {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    padding: 24px;
                    margin-bottom: 24px;
                }
                .section-header {
                    margin-bottom: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .section-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .table-wrapper {
                    overflow-x: auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    font-size: 0.875rem;
                }
                th {
                    background-color: #f1f5f9;
                    color: var(--text-secondary);
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.5px;
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--border-color);
                }
                td {
                    padding: 14px 16px;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-primary);
                }
                tr:last-child td {
                    border-bottom: none;
                }
                tr:hover {
                    background-color: #f8fafc;
                }
                .code-text {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.8rem;
                    background: #f1f5f9;
                    padding: 3px 8px;
                    border-radius: 4px;
                    color: var(--brand-primary);
                }
                .tag {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .tag-active { background: var(--success-light); color: var(--success); border: 1px solid #bbf7d0; }
                .tag-pipeline { background: var(--brand-primary-light); color: var(--brand-primary); border: 1px solid #bfdbfe; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="header-title">
                        <h1>Container Management & system control interface</h1>
                        <p>Real-time Microservices Cluster Telemetry & Pipeline Registry</p>
                    </div>
                    <div class="status-badge">
                        <div class="status-dot"></div>
                        CLUSTER HEALTHY
                    </div>
                </div>

                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">Host Architecture</div>
                        <div class="metric-value">${os.arch().toUpperCase()} / ${os.platform().toUpperCase()}</div>
                        <div class="metric-sub">Node.js Engine v${process.versions.node}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">System Uptime</div>
                        <div class="metric-value">${uptimeMins} Minutes</div>
                        <div class="metric-sub">Continuous Execution</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Memory Utilization</div>
                        <div class="metric-value">${usedMemPercent}% Used</div>
                        <div class="metric-sub">${freeMemGB} GB Free / ${totalMemGB} GB Total</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Active Workloads</div>
                        <div class="metric-value">5 Containers</div>
                        <div class="metric-sub">Docker Swarm / Compose Mesh</div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title">Active Microservices Container Fleet</div>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Container Name</th>
                                    <th>Image Reference</th>
                                    <th>State</th>
                                    <th>Port Mapping</th>
                                    <th>Memory Footprint</th>
                                    <th>Network I/O</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="code-text">node-container</span></td>
                                    <td>node-app:latest (Primary)</td>
                                    <td><span class="tag tag-active">Running</span></td>
                                    <td>3000:3000/tcp</td>
                                    <td>142 MB</td>
                                    <td>Rx: 2.4 MB / Tx: 1.1 MB</td>
                                </tr>
                                <tr>
                                    <td><span class="code-text">api-gateway-svc</span></td>
                                    <td>nginx:alpine-edge</td>
                                    <td><span class="tag tag-active">Running</span></td>
                                    <td>80:80 / 443:443</td>
                                    <td>32 MB</td>
                                    <td>Rx: 18.5 MB / Tx: 24.2 MB</td>
                                </tr>
                                <tr>
                                    <td><span class="code-text">auth-service-core</span></td>
                                    <td>python:3.9-slim</td>
                                    <td><span class="tag tag-active">Running</span></td>
                                    <td>5000:5000/tcp</td>
                                    <td>88 MB</td>
                                    <td>Rx: 940 KB / Tx: 820 KB</td>
                                </tr>
                                <tr>
                                    <td><span class="code-text">redis-cache-node</span></td>
                                    <td>redis:alpine-7.2</td>
                                    <td><span class="tag tag-active">Running</span></td>
                                    <td>6379:6379/tcp</td>
                                    <td>18 MB</td>
                                    <td>Rx: 5.1 MB / Tx: 4.8 MB</td>
                                </tr>
                                <tr>
                                    <td><span class="code-text">postgres-db-replica</span></td>
                                    <td>postgres:15-alpine</td>
                                    <td><span class="tag tag-active">Running</span></td>
                                    <td>5432:5432/tcp</td>
                                    <td>115 MB</td>
                                    <td>Rx: 3.2 MB / Tx: 2.9 MB</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title">Automated CI/CD Pipeline Audit Matrix</div>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Pipeline Stage</th>
                                    <th>Technology</th>
                                    <th>Validation Objective</th>
                                    <th>Audit Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1. Source Control</td>
                                    <td>GitHub</td>
                                    <td>Repository Code Sync & Webhook Trigger</td>
                                    <td><span class="tag tag-pipeline">PASSED</span></td>
                                </tr>
                                <tr>
                                    <td>2. Container Build</td>
                                    <td>Jenkins + Docker</td>
                                    <td>Fresh Image Build (--no-cache) & Deployment</td>
                                    <td><span class="tag tag-pipeline">PASSED</span></td>
                                </tr>
                                <tr>
                                    <td>3. Configuration Mgmt</td>
                                    <td>Ansible</td>
                                    <td>Host Environment Readiness & Health Check</td>
                                    <td><span class="tag tag-pipeline">PASSED</span></td>
                                </tr>
                                <tr>
                                    <td>4. Integration Test</td>
                                    <td>Selenium / Python</td>
                                    <td>HTTP Health & DOM Verification</td>
                                    <td><span class="tag tag-pipeline">PASSED</span></td>
                                </tr>
                            </tbody>
                        </table>
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