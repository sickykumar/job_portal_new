import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Custom Enterprise Middlewares
import {
  securityMiddleware,
  corsMiddleware,
  generalLimiter,
  authLimiter,
  notFoundHandler,
  errorHandler,
} from "./middleware/index.js";

// Routes
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import aiRoute from "./routes/ai.route.js";
import notificationRoute from "./routes/notification.route.js";
import newsletterRoute from "./routes/newsletter.route.js";
import contactRoute from "./routes/contact.route.js";
import adminRoute from "./routes/admin.route.js";
import atsRoute from "./routes/ats.route.js";
import jobAlertRoute from "./routes/jobAlert.route.js";
import hackathonRoute from "./routes/hackathon.route.js";
import quizRoute from "./routes/quiz.route.js";
import systemRoute from "./routes/system.route.js";
import { automationRoute, interviewRoute } from "./automation/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

import dns from "node:dns";
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const app = express();

// Trust reverse proxy (e.g. Render, Heroku, Nginx, Cloudflare)
// Resolves ERR_ERL_UNEXPECTED_X_FORWARDED_FOR in express-rate-limit
app.set("trust proxy", 1);

// 1. Security HTTP Headers
app.use(securityMiddleware);

// 2. CORS Policy
app.use(corsMiddleware);

// 3. Body Parsers with limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 4. Rate Limiting Guards
app.use("/api/", generalLimiter);
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);

// 5. Home Route — Backend Status Page
app.get("/", (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PathKhojo API</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080C14;font-family:'Segoe UI',system-ui,sans-serif;color:#e2e8f0;overflow:hidden}
    .bg{position:fixed;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(6,182,212,.12),transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(139,92,246,.10),transparent 60%)}
    .card{position:relative;text-align:center;padding:3rem 2.5rem;border-radius:1.25rem;background:rgba(13,19,34,.85);border:1px solid rgba(6,182,212,.2);backdrop-filter:blur(20px);box-shadow:0 0 60px rgba(6,182,212,.08);max-width:420px;width:90%}
    .pulse{width:14px;height:14px;background:#22c55e;border-radius:50%;display:inline-block;margin-right:8px;animation:pulse 2s infinite;vertical-align:middle;box-shadow:0 0 12px #22c55e80}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.25)}}
    h1{font-size:1.75rem;font-weight:700;margin-bottom:.25rem;background:linear-gradient(135deg,#06b6d4,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .sub{color:#94a3b8;font-size:.95rem;margin-bottom:1.75rem}
    .status{font-size:1.1rem;font-weight:600;margin-bottom:1.5rem}
    .stats{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.5rem}
    .stat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:.75rem;padding:.75rem .5rem}
    .stat-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:.25rem}
    .stat-value{font-size:.95rem;font-weight:600;color:#cbd5e1}
    .links{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
    .links a{display:inline-block;padding:.5rem 1.1rem;border-radius:.5rem;font-size:.8rem;font-weight:500;text-decoration:none;transition:all .2s}
    .primary{background:linear-gradient(135deg,#06b6d4,#8b5cf6);color:#fff}
    .primary:hover{opacity:.85;transform:translateY(-1px)}
    .ghost{border:1px solid rgba(255,255,255,.12);color:#94a3b8}
    .ghost:hover{border-color:#06b6d4;color:#06b6d4}
    .footer{margin-top:1.5rem;font-size:.7rem;color:#475569}
  </style>
</head>
<body>
  <div class="bg"></div>
  <div class="card">
    <h1>PathKhojo API</h1>
    <p class="sub">Job Portal Backend Service</p>
    <p class="status"><span class="pulse"></span> Running Perfectly</p>
    <div class="stats">
      <div class="stat"><div class="stat-label">Status</div><div class="stat-value">✅ Online</div></div>
      <div class="stat"><div class="stat-label">Uptime</div><div class="stat-value">${hours}h ${mins}m ${secs}s</div></div>
      <div class="stat"><div class="stat-label">Environment</div><div class="stat-value">${process.env.NODE_ENV || "development"}</div></div>
      <div class="stat"><div class="stat-label">Port</div><div class="stat-value">${process.env.PORT || 5000}</div></div>
    </div>
    <div class="links">
      <a href="/api/health" class="primary">Health Check</a>
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}" class="ghost" target="_blank">Frontend ↗</a>
    </div>
    <p class="footer">© ${new Date().getFullYear()} PathKhojo — Major Project by Group 6</p>
  </div>
</body>
</html>`);
});

// 6. Healthcheck Route
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 6. Application REST API Routes
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/ai", aiRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/newsletter", newsletterRoute);
app.use("/api/contact", contactRoute);
app.use("/api/admin", adminRoute);
app.use("/api/ats", atsRoute);
app.use("/api/job-alert", jobAlertRoute);
app.use("/api/hackathon", hackathonRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/system", systemRoute);
app.use("/api/automation", automationRoute);
app.use("/api/interview", interviewRoute);

// 7. 404 Catch-all handler for undefined routes
app.use(notFoundHandler);

// 8. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
export { app };
