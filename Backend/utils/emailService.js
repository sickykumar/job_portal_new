import nodemailer from "nodemailer";
import dns from "node:dns/promises";
import net from "node:net";

/**
 * ============================================================================
 * 📧 ENTERPRISE HYBRID EMAIL SERVICE
 * ============================================================================
 * Cloud hosts (like Render Free Tier) completely firewall-block outbound SMTP
 * ports (25, 465, 587) to prevent spam.
 * 
 * To guarantee 100% email delivery across both local development & production:
 * 1. HTTPS API (Resend / Brevo) -> Port 443 (Never blocked by cloud hosts).
 * 2. Gmail SMTP -> Port 465/587 with IPv4 pre-resolution (Localhost / Paid tier).
 * ============================================================================
 */

let activeTransporter = null;
let activePort = null;

/**
 * Send email via Resend HTTPS API (Port 443 - zero port restrictions)
 */
const sendViaResend = async ({ to, subject, html, text }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "PathKhojo Careers <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(text && { text }),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Resend API error (${response.status})`);
  }

  console.log(`[EmailService:Resend] Email sent to ${to} — Id: ${data.id}`);
  return { messageId: data.id, provider: "resend" };
};

/**
 * Send email via Brevo HTTPS API (Port 443 - zero port restrictions)
 */
const sendViaBrevo = async ({ to, subject, html, text }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER || process.env.SMTP_USER || "sickykumar01@gmail.com";
  const senderName = process.env.BREVO_NAME || "PathKhojo Careers";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: (Array.isArray(to) ? to : [to]).map((addr) => ({ email: addr })),
      subject,
      htmlContent: html,
      ...(text && { textContent: text }),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Brevo API error (${response.status})`);
  }

  console.log(`[EmailService:Brevo] Email sent to ${to} — MessageId: ${data.messageId}`);
  return { messageId: data.messageId, provider: "brevo" };
};

/**
 * Creates an explicit IPv4 Nodemailer SMTP transporter (for Local / Paid servers)
 */
const createTransporterForPort = async (port) => {
  const configuredHost = process.env.SMTP_HOST || "smtp.gmail.com";
  let targetHost = configuredHost;

  if (!net.isIP(configuredHost)) {
    try {
      const { address } = await dns.lookup(configuredHost, { family: 4 });
      if (address) targetHost = address;
    } catch {
      // Fallback to configured host name
    }
  }

  return nodemailer.createTransport({
    host: targetHost,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      servername: configuredHost,
    },
    connectionTimeout: 5000, // Quick 5s timeout to prevent hanging on blocked ports
  });
};

const getSmtpTransporter = async () => {
  if (activeTransporter) return activeTransporter;

  const preferredPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const fallbackPort = preferredPort === 465 ? 587 : 465;

  try {
    const transporter = await createTransporterForPort(preferredPort);
    activeTransporter = transporter;
    activePort = preferredPort;
    return transporter;
  } catch (err) {
    const fallbackTransporter = await createTransporterForPort(fallbackPort);
    activeTransporter = fallbackTransporter;
    activePort = fallbackPort;
    return fallbackTransporter;
  }
};

/**
 * Universal Email Sender:
 * 1. Checks for HTTP APIs (Resend, Brevo) first (works on Render free tier over Port 443).
 * 2. Falls back to direct Gmail SMTP (works on Localhost / Paid compute).
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  // Option 1: Resend HTTP API (Port 443)
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendViaResend({ to, subject, html, text });
    } catch (err) {
      console.error("[EmailService] Resend API failed:", err.message);
      // Fall through to other options if available
    }
  }

  // Option 2: Brevo HTTP API (Port 443)
  if (process.env.BREVO_API_KEY) {
    try {
      return await sendViaBrevo({ to, subject, html, text });
    } catch (err) {
      console.error("[EmailService] Brevo API failed:", err.message);
      // Fall through to SMTP
    }
  }

  // Option 3: Nodemailer Gmail SMTP
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EmailService] No email provider configured (Set RESEND_API_KEY, BREVO_API_KEY, or SMTP_USER/PASS).");
    return null;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"PathKhojo Careers" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    ...(text && { text }),
  };

  try {
    const transporter = await getSmtpTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService:SMTP] Email sent to ${to} — MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    activeTransporter = null;
    console.error(`[EmailService:SMTP] Failed to send to ${to}: ${error.message}`);
    if (error.message.includes("timeout") || error.code === "ETIMEDOUT") {
      console.warn("[EmailService] 💡 Tip: Render Free Tier blocks outbound SMTP ports 465/587. Add RESEND_API_KEY or BREVO_API_KEY to Render Environment Variables for instant delivery over HTTPS (Port 443).");
    }
    throw error;
  }
};

/**
 * Startup Verifier (Non-blocking):
 * Tests configured email channel without halting the server.
 */
export const verifySmtp = async () => {
  // 1. Verify HTTP APIs first
  if (process.env.RESEND_API_KEY) {
    console.log("[EmailService] ✅ Resend HTTPS API configured (Port 443 — Cloud Ready).");
    return true;
  }

  if (process.env.BREVO_API_KEY) {
    console.log("[EmailService] ✅ Brevo HTTPS API configured (Port 443 — Cloud Ready).");
    return true;
  }

  // 2. Verify SMTP (Localhost / Unblocked server)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EmailService] Email credentials not set. Features disabled.");
    return false;
  }

  try {
    const transporter = await createTransporterForPort(465);
    await transporter.verify();
    activeTransporter = transporter;
    activePort = 465;
    console.log("[EmailService] ✅ Gmail SMTP connection verified successfully (Port 465).");
    return true;
  } catch (err1) {
    try {
      const fallback = await createTransporterForPort(587);
      await fallback.verify();
      activeTransporter = fallback;
      activePort = 587;
      console.log("[EmailService] ✅ Gmail SMTP connection verified successfully (Port 587).");
      return true;
    } catch (err2) {
      console.warn(`[EmailService] ⚠️ SMTP connection timed out or blocked: ${err2.message}`);
      console.warn("[EmailService] ℹ️ If running on Render Free Tier, SMTP ports 465/587 are blocked by Render. To send emails on Render, add a free RESEND_API_KEY in Render Environment Variables.");
      activeTransporter = null;
      return false;
    }
  }
};

export default { sendEmail, verifySmtp };
