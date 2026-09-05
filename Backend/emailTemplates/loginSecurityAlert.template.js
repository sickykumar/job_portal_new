/**
 * ============================================================================
 * 🛡️ ENTERPRISE EMAIL TEMPLATE: User Login Security Alert
 * ============================================================================
 * Modeled after Google, Stripe & GitHub enterprise security advisories.
 * Styled with light-theme anti-spam compliance, clean telemetry grid,
 * and high deliverability scoring (DKIM/SPF friendly, zero spam triggers).
 * ============================================================================
 */

/**
 * Human-friendly User-Agent parser for professional presentation
 */
const formatDevice = (ua = "") => {
  if (!ua || ua === "Web Browser") return "Desktop Web Browser";
  let os = "Desktop";
  if (/Windows/i.test(ua)) os = "Windows PC";
  else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS Device";
  else if (/iPhone|iPad/i.test(ua)) os = "Apple iOS Device";
  else if (/Android/i.test(ua)) os = "Android Device";
  else if (/Linux/i.test(ua)) os = "Linux Machine";

  let browser = "Web Browser";
  if (/Edg/i.test(ua)) browser = "Microsoft Edge";
  else if (/Chrome/i.test(ua)) browser = "Google Chrome";
  else if (/Firefox/i.test(ua)) browser = "Mozilla Firefox";
  else if (/Safari/i.test(ua)) browser = "Apple Safari";

  return `${browser} on ${os}`;
};

export const loginSecurityAlertHTML = ({
  fullname,
  email,
  role,
  ipAddress = "127.0.0.1",
  userAgent = "Web Browser",
}) => {
  const isRecruiter = role?.toLowerCase() === "recruiter";
  const clientUrl = process.env.CLIENT_URL || "https://pathkhojo.sickykumar.in";
  const dashboardUrl = isRecruiter
    ? `${clientUrl}/recruiter-dashboard`
    : `${clientUrl}/candidate-dashboard`;
  const securitySettingsUrl = `${clientUrl}/profile`;
  const roleLabel = isRecruiter ? "Verified Recruiter" : "Candidate / Job Seeker";

  const now = new Date();
  const loginTime = now.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const deviceSummary = formatDevice(userAgent);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Security Alert: New Sign-in to your PathKhojo Account</title>
</head>
<body style="margin:0; padding:0; background-color:#F3F4F6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#1F2937; line-height:1.5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F3F4F6; padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width:580px; background-color:#FFFFFF; border:1px solid #E5E7EB; border-radius:16px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Top Brand Header -->
          <tr>
            <td style="padding:28px 32px 20px 32px; border-bottom:1px solid #F3F4F6; background:#FFFFFF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- PathKhojo Logo -->
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background:linear-gradient(135deg, #0EA5E9, #6366F1, #8B5CF6); width:36px; height:36px; border-radius:10px; text-align:center; vertical-align:middle;">
                          <span style="color:#FFFFFF; font-size:20px; font-weight:900; line-height:36px; display:inline-block;">P</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="font-size:20px; font-weight:800; color:#0F172A; letter-spacing:-0.4px;">
                            Path<span style="color:#0EA5E9;">Khojo</span>
                          </span>
                          <span style="display:block; font-size:10px; font-weight:700; color:#6366F1; text-transform:uppercase; letter-spacing:1px; margin-top:1px;">
                            Career Navigator
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <!-- Security Badge -->
                    <span style="display:inline-block; padding:4px 12px; background-color:#FEF2F2; border:1px solid #FCA5A5; border-radius:999px; font-size:11px; font-weight:700; color:#DC2626; text-transform:uppercase; letter-spacing:0.5px;">
                      🛡️ Security Alert: New Sign-In
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding:32px 32px 24px 32px;">
              <h1 style="margin:0 0 12px 0; font-size:20px; font-weight:800; color:#111827; letter-spacing:-0.3px;">
                New sign-in detected on your account
              </h1>
              <p style="margin:0 0 20px 0; font-size:14px; color:#4B5563; line-height:1.6;">
                Hello <strong style="color:#111827;">${fullname}</strong>,<br/>
                We detected a successful sign-in to your <strong>PathKhojo</strong> account (<span style="color:#2563EB;">${email}</span>).
              </p>

              <!-- Telemetry Audit Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#64748B;">
                      📋 Session Information
                    </p>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <!-- Row 1: Time -->
                      <tr>
                        <td style="padding:7px 0; font-size:13px; color:#64748B; width:130px; vertical-align:top;">Timestamp:</td>
                        <td style="padding:7px 0; font-size:13px; font-weight:600; color:#0F172A; vertical-align:top;">${loginTime} (IST)</td>
                      </tr>
                      <!-- Row 2: Device -->
                      <tr>
                        <td style="padding:7px 0; font-size:13px; color:#64748B; vertical-align:top;">Device / App:</td>
                        <td style="padding:7px 0; font-size:13px; font-weight:600; color:#0F172A; vertical-align:top;">
                          ${deviceSummary}
                          <span style="display:block; font-size:11px; color:#94A3B8; font-weight:400; margin-top:2px;">${userAgent}</span>
                        </td>
                      </tr>
                      <!-- Row 3: IP Address -->
                      <tr>
                        <td style="padding:7px 0; font-size:13px; color:#64748B; vertical-align:top;">IP Address:</td>
                        <td style="padding:7px 0; font-size:13px; font-family:ui-monospace,Menlo,Monaco,Consolas,monospace; font-weight:700; color:#4338CA; vertical-align:top;">
                          <span style="background-color:#EEF2FF; padding:3px 8px; border-radius:6px; border:1px solid #C7D2FE;">${ipAddress}</span>
                        </td>
                      </tr>
                      <!-- Row 4: Account Role -->
                      <tr>
                        <td style="padding:7px 0; font-size:13px; color:#64748B; vertical-align:top;">Account Type:</td>
                        <td style="padding:7px 0; font-size:13px; font-weight:600; color:#0284C7; vertical-align:top;">${isRecruiter ? "🏢 Recruiter" : "👤 Candidate / Student"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Safety Guidelines Notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:28px; background-color:#EFF6FF; border:1px solid #BFDBFE; border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#1E40AF;">
                      🛡️ Was this you?
                    </p>
                    <p style="margin:0; font-size:13px; color:#1E3A8A; line-height:1.6;">
                      • <strong>If this was you</strong>, no further action is required. You can safely dismiss this message.<br/>
                      • <strong>If you did not sign in</strong>, your account credentials may have been compromised. Please secure your account immediately by changing your password.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons (Google / Stripe Style) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right:12px;">
                          <a href="${dashboardUrl}" target="_blank" style="display:inline-block; background-color:#0EA5E9; color:#FFFFFF; text-decoration:none; padding:12px 24px; border-radius:10px; font-size:14px; font-weight:700; letter-spacing:0.2px; box-shadow:0 2px 6px rgba(14,165,233,0.3);">
                            Open Dashboard →
                          </a>
                        </td>
                        <td>
                          <a href="${securitySettingsUrl}" target="_blank" style="display:inline-block; background-color:#FFFFFF; color:#DC2626; border:1px solid #F87171; text-decoration:none; padding:12px 20px; border-radius:10px; font-size:14px; font-weight:700;">
                            Secure Account
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security Footer -->
          <tr>
            <td style="padding:24px 32px; background-color:#F9FAFB; border-top:1px solid #E5E7EB; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:12px; color:#6B7280;">
                You received this mandatory security alert because a new login was authenticated for <strong>${email}</strong>.
              </p>
              <p style="margin:0 0 10px 0; font-size:11px; color:#9CA3AF;">
                PathKhojo Security Operations &bull; 
                <a href="${clientUrl}/privacy" target="_blank" style="color:#6B7280; text-decoration:underline;">Privacy Policy</a> &bull; 
                <a href="${clientUrl}/contact" target="_blank" style="color:#6B7280; text-decoration:underline;">Contact Support</a>
              </p>
              <p style="margin:0; font-size:11px; color:#9CA3AF;">
                © ${now.getFullYear()} PathKhojo Platforms &bull; https://pathkhojo.sickykumar.in
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
export default { loginSecurityAlertHTML, loginWelcomeHTML };
