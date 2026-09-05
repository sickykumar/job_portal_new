/**
 * ============================================================================
 * EMAIL TEMPLATE: User Login Security Alert
 * ============================================================================
 * 
 * Target Recipients:
 *   - Registered Candidates (Students) and Recruiters upon successful sign-in.
 *   - Note: Super Admin routine logins DO NOT receive this alert (handled separately).
 * 
 * Trigger Point:
 *   - Backend/controllers/user.controller.js -> issueAuthSession() / verifyLoginOtp()
 * 
 * Included Telemetry:
 *   - Account Email & Role
 *   - Sign-in Timestamp (IST)
 *   - Origin IP Address
 *   - Client Device / User-Agent string
 * 
 * Update / Edit Instructions:
 *   - Modify the Session Details Card table rows to add or remove audit telemetry fields.
 *   - The security verification advice notice advises users what to do if the login was unauthorized.
 */

export const loginSecurityAlertHTML = ({
  fullname,
  email,
  role,
  ipAddress = "127.0.0.1",
  userAgent = "Web Browser",
}) => {
  const isRecruiter = role?.toLowerCase() === "recruiter";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const dashboardUrl = isRecruiter
    ? `${clientUrl}/recruiter-dashboard`
    : `${clientUrl}/candidate-dashboard`;
  const dashboardLabel = isRecruiter ? "Recruiter Command Center" : "Career Hub Dashboard";

  const now = new Date();
  const loginTime = now.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Security Alert — PathKhojo Account Login</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0f19; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0f19; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#131b2e; border:1px solid #1e293b; border-radius:18px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #1e1b4b 0%, #31104b 50%, #0f172a 100%); padding:32px 32px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.08);">
              <div style="display:inline-block; padding:6px 14px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); border-radius:999px; margin-bottom:12px;">
                <span style="color:#f87171; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">
                  🛡️ Security Alert: New Sign-In
                </span>
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:800; letter-spacing:-0.5px;">
                Nex<span style="color:#38bdf8;">Hire</span> Account Login
              </h1>
              <p style="margin:6px 0 0; color:#94a3b8; font-size:12px; letter-spacing:0.5px;">
                Intelligent Career & Recruitment Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px;">
              <h2 style="margin:0 0 10px; color:#ffffff; font-size:20px; font-weight:700;">
                Hello ${fullname},
              </h2>
              <p style="margin:0 0 24px; color:#94a3b8; font-size:14px; line-height:1.6;">
                We detected a recent successful sign-in to your <strong>PathKhojo (${isRecruiter ? "Recruiter" : "Candidate"})</strong> account. Here are the session details:
              </p>

              <!-- Session Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a; border:1px solid #1e293b; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase; width:120px;">Account:</td>
                        <td style="padding:6px 0; color:#e2e8f0; font-size:13px; font-weight:600;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Role:</td>
                        <td style="padding:6px 0; color:#38bdf8; font-size:13px; font-weight:600;">${isRecruiter ? "🏢 Recruiter" : "👤 Candidate / Student"}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Time (IST):</td>
                        <td style="padding:6px 0; color:#e2e8f0; font-size:13px;">${loginTime}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">IP Address:</td>
                        <td style="padding:6px 0; color:#a5b4fc; font-size:13px; font-family:monospace;">${ipAddress}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Device / Client:</td>
                        <td style="padding:6px 0; color:#cbd5e1; font-size:12px; line-height:1.4;">${userAgent}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Advice Notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px; background:rgba(245,158,11,0.1); border-radius:10px; border-left:4px solid #f59e0b;">
                    <p style="margin:0 0 6px; color:#fbbf24; font-size:13px; font-weight:700;">
                      🔒 Security Verification:
                    </p>
                    <p style="margin:0; color:#cbd5e1; font-size:12px; line-height:1.5;">
                      • If <strong>this was you</strong>, you can safely ignore this alert.<br/>
                      • If <strong>you did not log in</strong>, someone else may have gained access to your credentials. Please change your password immediately.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" target="_blank" style="display:inline-block; background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#ffffff; text-decoration:none; padding:14px 34px; border-radius:12px; font-size:14px; font-weight:700; letter-spacing:0.3px; box-shadow:0 8px 20px rgba(79,70,229,0.4);">
                      Open ${dashboardLabel} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; background-color:#090d16; border-top:1px solid #1e293b; text-align:center;">
              <p style="margin:0 0 4px; color:#64748b; font-size:11px;">
                Automated security alert sent to <strong>${email}</strong> &bull; PathKhojo Security Center
              </p>
              <p style="margin:0; color:#475569; font-size:10px;">
                © ${now.getFullYear()} PathKhojo Platforms Technologies Pvt. Ltd. &bull; All rights reserved.
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

export const loginWelcomeHTML = loginSecurityAlertHTML;
