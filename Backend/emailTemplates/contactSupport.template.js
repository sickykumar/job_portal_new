/**
 * ============================================================================
 * EMAIL TEMPLATES: Contact Form Support Desk
 * ============================================================================
 * 
 * Target Recipients & Usage:
 *   1. contactConfirmationHTML: Sent to the visitor/candidate confirming receipt of support inquiry.
 *   2. contactAdminNotifyHTML: Sent to platform admin notifying them of a new inquiry.
 *   3. contactResolutionHTML: Sent to the user when an admin marks their ticket as resolved or in-progress.
 * 
 * Trigger Points:
 *   - Backend/controllers/contact.controller.js -> submitContact()
 *   - Backend/controllers/admin.controller.js -> resolveTicket()
 * 
 * Update / Edit Instructions:
 *   - To modify expected support response turnaround time, update text in contactConfirmationHTML.
 *   - Status pill badges in contactResolutionHTML dynamically adapt to 'resolved' or 'in_progress'.
 */

/**
 * 1. Contact form confirmation email sent to the user.
 */
export const contactConfirmationHTML = ({ name, email, subject, category, ticketId, message }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#06b6d4); padding:28px 32px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800;">Nex<span style="color:#22d3ee;">Hire</span></h1>
              <p style="margin:4px 0 0; color:rgba(255,255,255,0.8); font-size:11px; text-transform:uppercase; letter-spacing:2px; font-weight:600;">Support & Contact</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 8px; color:#0f172a; font-size:20px; font-weight:700;">✅ We've Received Your Message, ${name}!</h2>
              <p style="margin:0 0 20px; color:#475569; font-size:14px; line-height:1.6;">
                Thank you for reaching out. Our support team will review your query and respond within <strong>24-48 hours</strong>.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color:#64748b; font-size:11px; padding-bottom:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">YOUR SUPPORT TICKET</td></tr>
                      <tr><td style="color:#334155; font-size:13px; padding-bottom:6px;"><strong>Ticket ID:</strong> <span style="color:#4f46e5; font-weight:700;">${ticketId}</span></td></tr>
                      <tr><td style="color:#334155; font-size:13px; padding-bottom:6px;"><strong>Subject:</strong> ${subject}</td></tr>
                      <tr><td style="color:#334155; font-size:13px; padding-bottom:6px;"><strong>Category:</strong> ${category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</td></tr>
                      <tr><td style="color:#334155; font-size:13px;"><strong>Status:</strong> <span style="color:#f59e0b; font-weight:600;">⏳ Pending Review</span></td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:12px 16px; background:#f0fdf4; border-radius:10px; border-left:4px solid #22c55e;">
                    <p style="margin:0; color:#166534; font-size:12px; line-height:1.5;">
                      <strong>💡 Tip:</strong> Save your Ticket ID <strong>${ticketId}</strong> for future reference. You can reply to this email for follow-ups.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="margin:0; color:#94a3b8; font-size:11px;">This is an automated confirmation from PathKhojo Support.</p>
              <p style="margin:4px 0 0; color:#cbd5e1; font-size:10px;">© ${new Date().getFullYear()} PathKhojo Platforms Technologies Pvt. Ltd.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * 2. Admin notification email when a new contact form is submitted.
 */
export const contactAdminNotifyHTML = ({ name, email, subject, category, ticketId, message }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; padding:30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#0f172a; padding:20px 28px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:700;">📩 New Contact Submission</h1>
              <p style="margin:4px 0 0; color:#94a3b8; font-size:11px;">PathKhojo Admin Panel Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:14px 18px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="color:#64748b; font-size:11px; padding-bottom:8px; font-weight:700; text-transform:uppercase;">TICKET DETAILS</td></tr>
                      <tr><td style="color:#1e293b; font-size:13px; padding-bottom:5px;"><strong>Ticket:</strong> <span style="color:#dc2626; font-weight:700;">${ticketId}</span></td></tr>
                      <tr><td style="color:#1e293b; font-size:13px; padding-bottom:5px;"><strong>From:</strong> ${name} (${email})</td></tr>
                      <tr><td style="color:#1e293b; font-size:13px; padding-bottom:5px;"><strong>Subject:</strong> ${subject}</td></tr>
                      <tr><td style="color:#1e293b; font-size:13px;"><strong>Category:</strong> ${category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div style="padding:14px 18px; background:#fffbeb; border-radius:10px; border:1px solid #fde68a;">
                <p style="margin:0 0 6px; color:#92400e; font-size:11px; font-weight:700; text-transform:uppercase;">MESSAGE</p>
                <p style="margin:0; color:#1e293b; font-size:13px; line-height:1.6; white-space:pre-wrap;">${message}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="margin:0; color:#94a3b8; font-size:10px;">Reply directly to ${email} to respond to this ticket.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * 3. Contact resolution email sent to the user when admin resolves their ticket.
 */
export const contactResolutionHTML = ({ name, email, subject, ticketId, message, resolutionNotes, status = "resolved" }) => {
  const statusLabel = status === "resolved" ? "RESOLVED" : status === "in_progress" ? "IN PROGRESS" : status.toUpperCase();
  const statusBg = status === "resolved" ? "#10b981" : status === "in_progress" ? "#3b82f6" : "#64748b";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Resolution — ${ticketId}</title>
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#1e293b; border-radius:16px; overflow:hidden; border:1px solid #334155; box-shadow:0 20px 40px rgba(0,0,0,0.4);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%); padding:32px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800; letter-spacing:-0.5px;">Ticket Resolution Update</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:13px;">PathKhojo Global Support & Compliance Desk</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 28px; color:#e2e8f0;">
              <p style="margin:0 0 16px; font-size:15px; line-height:1.6;">Hello <strong style="color:#ffffff;">${name}</strong>,</p>
              <p style="margin:0 0 20px; font-size:14px; line-height:1.6; color:#94a3b8;">
                Our platform operations team has reviewed your support inquiry. Here is the official resolution details regarding your ticket.
              </p>

              <!-- Ticket Info Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px; background-color:#0f172a; border-radius:12px; border:1px solid #334155; padding:16px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0; color:#94a3b8; font-size:13px; width:130px;">Ticket Reference:</td>
                        <td style="padding:6px 0; color:#38bdf8; font-size:13px; font-weight:700;">${ticketId}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#94a3b8; font-size:13px;">Inquiry Subject:</td>
                        <td style="padding:6px 0; color:#f1f5f9; font-size:13px;">${subject}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#94a3b8; font-size:13px;">Current Status:</td>
                        <td style="padding:6px 0;">
                          <span style="display:inline-block; padding:3px 10px; background-color:${statusBg}; color:#ffffff; font-size:11px; font-weight:700; border-radius:999px; text-transform:uppercase;">${statusLabel}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Official Resolution -->
              <div style="background:rgba(16, 185, 129, 0.08); border:1px solid #10b981; border-radius:12px; padding:20px; margin-bottom:24px;">
                <p style="margin:0 0 8px; color:#34d399; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">Official Support Resolution</p>
                <div style="color:#ffffff; font-size:14px; line-height:1.7; white-space:pre-wrap;">${resolutionNotes}</div>
              </div>

              <!-- Original Query snippet -->
              <div style="background:#0f172a; border-radius:8px; padding:14px 16px; margin-bottom:24px; border:1px solid #1e293b;">
                <p style="margin:0 0 6px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase;">Original Inquiry</p>
                <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.5;">${message}</p>
              </div>

              <p style="margin:0; font-size:13px; line-height:1.6; color:#94a3b8;">
                If you have further questions or require additional assistance, simply submit a follow-up ticket referencing <strong>${ticketId}</strong>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#0f172a; padding:20px 28px; text-align:center; border-top:1px solid #334155;">
              <p style="margin:0 0 4px; color:#64748b; font-size:12px;">PathKhojo Cloud Platform & Support Operations</p>
              <p style="margin:0; color:#475569; font-size:11px;">Protected by 256-bit encryption. Do not share confidential credentials over email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
