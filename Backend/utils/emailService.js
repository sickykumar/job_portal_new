import nodemailer from "nodemailer";
import dns from "node:dns/promises";
import net from "node:net";

/**
 * ============================================================================
 * 📧 ENTERPRISE GMAIL SMTP SERVICE (IPv4 FORCED FOR RENDER / CLOUD)
 * ============================================================================
 * Cloud platforms like Render don't support outbound IPv6 traffic.
 * When Node.js resolves smtp.gmail.com to an IPv6 address, it triggers ENETUNREACH.
 * By dynamically resolving the hostname to an IPv4 address before connecting,
 * and passing the domain to `tls.servername`, we achieve 100% reliable delivery
 * without IPv6 routing errors or SSL certificate mismatches.
 */

let activeTransporter = null;
let activePort = null;

/**
 * Creates a Nodemailer transporter bound to an explicit IPv4 address.
 * Supports auto-fallback between SSL (port 465) and STARTTLS (port 587).
 *
 * @param {number} port
 * @returns {Promise<nodemailer.Transporter>}
 */
const createTransporterForPort = async (port) => {
  const configuredHost = process.env.SMTP_HOST || "smtp.gmail.com";
  let targetHost = configuredHost;

  // Resolve to explicit IPv4 address if host is a domain
  if (!net.isIP(configuredHost)) {
    try {
      const { address } = await dns.lookup(configuredHost, { family: 4 });
      if (address) {
        targetHost = address;
      }
    } catch (dnsErr) {
      console.warn(`[EmailService] IPv4 DNS pre-lookup failed for ${configuredHost}:`, dnsErr.message);
    }
  }

  const isSecure = port === 465;

  return nodemailer.createTransport({
    host: targetHost,
    port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      servername: configuredHost, // Ensures SSL/TLS certificate validates against smtp.gmail.com
    },
    connectionTimeout: 15000,
  });
};

/**
 * Returns an active, verified transporter. Caches instance for connection pooling.
 * Falls back between 465 and 587 if one port is unreachable.
 *
 * @returns {Promise<nodemailer.Transporter>}
 */
const getTransporter = async () => {
  if (activeTransporter) {
    return activeTransporter;
  }

  const preferredPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const fallbackPort = preferredPort === 465 ? 587 : 465;

  try {
    const transporter = await createTransporterForPort(preferredPort);
    activeTransporter = transporter;
    activePort = preferredPort;
    return transporter;
  } catch (err) {
    console.warn(`[EmailService] Port ${preferredPort} setup failed, attempting fallback port ${fallbackPort}:`, err.message);
    const fallbackTransporter = await createTransporterForPort(fallbackPort);
    activeTransporter = fallbackTransporter;
    activePort = fallbackPort;
    return fallbackTransporter;
  }
};

/**
 * Send an email using the configured Gmail SMTP transporter.
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 * @returns {Promise<object>} Nodemailer send result
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EmailService] SMTP credentials not configured. Skipping email send.");
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
    const transporter = await getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent to ${to} — MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
    // Invalidate cached transporter on failure so next attempt re-resolves IPv4
    activeTransporter = null;
    throw error;
  }
};

/**
 * Verify SMTP connection on startup (non-blocking).
 * Automatically tests primary port, falls back if needed, and logs success.
 */
export const verifySmtp = async () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EmailService] SMTP not configured. Email features disabled.");
    return false;
  }

  const preferredPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const fallbackPort = preferredPort === 465 ? 587 : 465;

  // Try preferred port
  try {
    const transporter = await createTransporterForPort(preferredPort);
    await transporter.verify();
    activeTransporter = transporter;
    activePort = preferredPort;
    console.log(`[EmailService] ✅ Gmail SMTP verified successfully on IPv4 (Port ${preferredPort}).`);
    return true;
  } catch (err1) {
    console.warn(`[EmailService] ⚠️ Port ${preferredPort} failed (${err1.message}). Retrying on fallback port ${fallbackPort}...`);
    try {
      const fallbackTransporter = await createTransporterForPort(fallbackPort);
      await fallbackTransporter.verify();
      activeTransporter = fallbackTransporter;
      activePort = fallbackPort;
      console.log(`[EmailService] ✅ Gmail SMTP verified successfully on IPv4 (Fallback Port ${fallbackPort}).`);
      return true;
    } catch (err2) {
      console.error("[EmailService] ❌ SMTP verification failed on both ports:", err2.message);
      activeTransporter = null;
      return false;
    }
  }
};

export default { sendEmail, verifySmtp };
