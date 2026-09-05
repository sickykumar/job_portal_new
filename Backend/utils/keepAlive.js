/**
 * ============================================================================
 * PLUGGABLE PRODUCTION MODULE: AutoKeepAlive (Render / Free-Tier Anti-Sleep)
 * ============================================================================
 * 
 * PROBLEM THIS SOLVES:
 *   Free hosting services like Render, Railway, or Fly.io spin down (sleep) web
 *   services after 15 minutes of inactivity. When a new user arrives, the server
 *   takes 50 to 90 seconds ("cold start") to respond.
 * 
 * HOW THIS WORKS:
 *   Every 10 minutes (configurable), this background worker sends a lightweight
 *   HTTP ping to its own `/health` endpoint. Render automatically sets the
 *   `RENDER_EXTERNAL_URL` environment variable. If on another host, you can set
 *   `BACKEND_URL` or `SERVER_URL`.
 * 
 * HOW TO USE IN ANY PROJECT (PORTABLE):
 *   1. Copy this file `keepAlive.js` to your backend (e.g., `utils/keepAlive.js`).
 *   2. In your `server.js` or `index.js`, import and call:
 *        import { startKeepAlive } from "./utils/keepAlive.js";
 *        startKeepAlive();
 *   3. Ensure you have a lightweight `/health` route in your Express app:
 *        app.get("/health", (req, res) => res.status(200).send("ok"));
 * 
 * ENVIRONMENT VARIABLES SUPPORTED:
 *   - RENDER_EXTERNAL_URL: Automatically injected by Render (e.g. https://my-app.onrender.com)
 *   - BACKEND_URL or SERVER_URL: Custom public server URL fallback
 *   - KEEP_ALIVE_INTERVAL_MS: Optional override (defaults to 10 minutes: 600,000 ms)
 *   - KEEP_ALIVE_DISABLED: Set "true" to disable in testing or local dev
 */

let keepAliveTimer = null;

export const startKeepAlive = (options = {}) => {
  // Respect explicit disable flag
  if (process.env.KEEP_ALIVE_DISABLED === "true") {
    console.log("[KeepAlive] Disabled via KEEP_ALIVE_DISABLED env flag.");
    return;
  }

  // Resolve target public server URL
  const serverUrl =
    options.url ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    process.env.SERVER_URL;

  // 10 minutes default interval (Render spins down at 15 minutes)
  const intervalMs =
    options.intervalMs ||
    Number(process.env.KEEP_ALIVE_INTERVAL_MS) ||
    10 * 60 * 1000;

  const healthPath = options.healthPath || "/health";

  if (!serverUrl) {
    // Only warn if in production; silently skip in local dev unless URL is provided
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[KeepAlive] Notice: No RENDER_EXTERNAL_URL or BACKEND_URL detected. Auto-ping paused. Set BACKEND_URL in .env to enable."
      );
    }
    return;
  }

  const cleanUrl = serverUrl.endsWith("/") ? serverUrl.slice(0, -1) : serverUrl;
  const targetPingUrl = `${cleanUrl}${healthPath}`;

  console.log(
    `[KeepAlive] ✅ Anti-cold-start initialized. Target: ${targetPingUrl} (interval: ${Math.round(
      intervalMs / 60000
    )} mins)`
  );

  // Clear existing timer if any
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
  }

  // Self-invoking ping function
  const pingServer = async () => {
    try {
      const response = await fetch(targetPingUrl, {
        method: "GET",
        headers: {
          "User-Agent": "NexHire-AutoKeepAlive/1.0",
          "X-Keep-Alive-Ping": "true",
        },
      });

      if (response.ok) {
        console.log(
          `[KeepAlive] 💓 Heartbeat ping successful [HTTP ${response.status}] at ${new Date().toLocaleTimeString("en-IN")}`
        );
      } else {
        console.warn(`[KeepAlive] ⚠️ Ping returned HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn(`[KeepAlive] ⚠️ Ping attempt error:`, error.message);
    }
  };

  // Schedule recurring heartbeat
  keepAliveTimer = setInterval(pingServer, intervalMs);

  // Optional initial ping after 30 seconds of boot
  setTimeout(pingServer, 30 * 1000);
};

export const stopKeepAlive = () => {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
    console.log("[KeepAlive] Heartbeat stopped.");
  }
};
