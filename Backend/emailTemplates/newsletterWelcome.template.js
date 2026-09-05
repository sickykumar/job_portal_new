/**
 * ============================================================================
 * EMAIL TEMPLATE: Newsletter Welcome & Subscription Confirmation
 * ============================================================================
 * 
 * Target Recipients:
 *   - Any visitor or user who subscribes to PathKhojo Tech Alerts newsletter.
 * 
 * Trigger Point:
 *   - Backend/controllers/newsletter.controller.js -> subscribe()
 * 
 * Update / Edit Instructions:
 *   - To modify newsletter bullet points, edit the Feature Cards table below.
 *   - To update job browsing URL or branding colors, adjust the CTA Button gradient.
 */

export const newsletterWelcomeHTML = (email) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to PathKhojo Tech Alerts</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#06b6d4); padding:36px 32px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; letter-spacing:-0.5px;">
                Path<span style="color:#22d3ee;">Khojo</span>
              </h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.85); font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:600;">
                Career Navigation Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <h2 style="margin:0 0 12px; color:#0f172a; font-size:22px; font-weight:700;">
                🎉 You're In! Welcome to PathKhojo Tech Alerts
              </h2>
              <p style="margin:0 0 20px; color:#475569; font-size:15px; line-height:1.7;">
                Hi there! You've successfully subscribed to <strong>PathKhojo's weekly curated tech career alerts</strong>. 
                Here's what you'll receive straight in your inbox:
              </p>

              <!-- Feature Cards -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:12px 16px; background:#f8fafc; border-radius:12px; border-left:4px solid #4f46e5; margin-bottom:8px;">
                    <p style="margin:0; color:#1e293b; font-size:14px; font-weight:600;">🚀 High-Growth Engineering Roles</p>
                    <p style="margin:4px 0 0; color:#64748b; font-size:13px;">Curated Full-Stack, AI/ML, Cloud, and DevOps openings from verified employers.</p>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px; background:#f8fafc; border-radius:12px; border-left:4px solid #06b6d4;">
                    <p style="margin:0; color:#1e293b; font-size:14px; font-weight:600;">💰 Salary & Compensation Insights</p>
                    <p style="margin:4px 0 0; color:#64748b; font-size:13px;">Weekly benchmarks on base pay, bonuses, and stock packages across tech tiers.</p>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px; background:#f8fafc; border-radius:12px; border-left:4px solid #8b5cf6;">
                    <p style="margin:0; color:#1e293b; font-size:14px; font-weight:600;">🤖 AI Interview Prep Tips</p>
                    <p style="margin:4px 0 0; color:#64748b; font-size:13px;">Gemini-powered question strategies and STAR answer frameworks each week.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="https://pathkhojo.sickykumar.in/jobs" target="_blank" style="display:inline-block; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#ffffff; text-decoration:none; padding:14px 36px; border-radius:12px; font-size:14px; font-weight:700; letter-spacing:0.3px;">
                      Browse Open Positions →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
              <p style="margin:0 0 6px; color:#94a3b8; font-size:12px;">
                This email was sent to <strong>${email}</strong> because you subscribed to PathKhojo Tech Career Alerts.
              </p>
              <p style="margin:0; color:#cbd5e1; font-size:11px;">
                © ${new Date().getFullYear()} PathKhojo Platforms Technologies Pvt. Ltd. • All rights reserved.
              </p>
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
