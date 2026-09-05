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

// 5. Healthcheck Route
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
