import nodemailer from "nodemailer";
import dns from "node:dns";

// Ensure Node.js resolves IPv4 first (prevents ENETUNREACH on cloud environments like Render)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

/**
 * Gmail SMTP Transporter
 * Uses App Password authentication for secure automated email delivery.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465", 10),
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  family: 4, // Force IPv4 to prevent ENETUNREACH on platforms without IPv6 support (e.g. Render)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent to ${to} — MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

/**
 * Verify SMTP connection on startup (non-blocking).
 */
export const verifySmtp = async () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[EmailService] SMTP not configured. Email features disabled.");
    return false;
  }

  try {
    await transporter.verify();
    console.log("[EmailService] ✅ Gmail SMTP connection verified successfully.");
    return true;
  } catch (error) {
    console.error("[EmailService] ❌ SMTP verification failed:", error.message);
    return false;
  }
};
