import dns from "node:dns";
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDB from "./utils/db.js";
import { verifySmtp } from "./utils/emailService.js";
import { initAutomationEngine, shutdownAutomationEngine } from "./automation/index.js";
import { startKeepAlive, stopKeepAlive } from "./utils/keepAlive.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

let server;

// Start Server and connect DB
const startServer = async () => {
  await connectDB();
  // Verify Gmail SMTP connection (non-blocking)
  verifySmtp().catch(() => {});
  // Initialize Automated Recruiter/Candidate Automation Engine
  initAutomationEngine(app);
  // Initialize Anti-Cold-Start Keep-Alive Heartbeat (10-min interval for Render / Free-tier)
  startKeepAlive({ intervalMs: 10 * 60 * 1000 });
  server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
  return server;
};

startServer();

// Graceful Shutdown Handlers
const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Gracefully closing server...`);
  shutdownAutomationEngine();
  stopKeepAlive();
  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

export { server, startServer };
export default server;
