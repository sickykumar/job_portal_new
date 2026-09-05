/**
 * ============================================================================
 * EMAIL TEMPLATE: Critical Super Admin Security Breach Watchdog
 * ============================================================================
 * 
 * Target Recipients:
 *   - Lead Developer / System Administrator (DEVELOPER_EMAIL in .env or fallback).
 * 
 * Trigger Point:
 *   - Backend/controllers/user.controller.js -> notifyDeveloperSecurityBreach()
 *   - Fired when an unauthorized entity attempts to log in as Super Admin with an
 *     unregistered email, wrong password, or invalid role privilege escalation.
 * 
 * Included Security Telemetry:
 *   - Attempted Identity (Email)
 *   - Target Role attempted
 *   - Exact block reason
 *   - Origin IP Address
 *   - Client Device / User-Agent
 *   - IST Timestamp
 * 
 * Update / Edit Instructions:
 *   - The developer email recipient can be customized via process.env.DEVELOPER_EMAIL.
 *   - Recommended mitigations can be updated in the callout banner below.
 */

export const securityBreachAlertHTML = ({
  attemptedEmail,
  attemptedRole,
  reason,
  ipAddress = "127.0.0.1",
  userAgent = "Web Browser",
}) => {
  const now = new Date();
  const alertTime = now.toLocaleString("en-IN", {
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
  <title>CRITICAL SECURITY ALERT — Unauthorized Admin Access Attempt</title>
</head>
<body style="margin:0; padding:0; background-color:#050508; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050508; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="background-color:#0f111a; border:2px solid #ef4444; border-radius:18px; overflow:hidden; box-shadow:0 0 50px rgba(239,68,68,0.25);">
          
          <!-- Warning Banner Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%); padding:32px 32px; text-align:center; border-bottom:2px solid #ef4444;">
              <div style="display:inline-block; padding:6px 16px; background:#000000; border:1px solid #f87171; border-radius:999px; margin-bottom:12px;">
                <span style="color:#fca5a5; font-size:12px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;">
                  🚨 CRITICAL SECURITY THREAT DETECTED
                </span>
              </div>
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:900; letter-spacing:-0.5px;">
                Super Admin Breach Attempt Blocked
              </h1>
              <p style="margin:6px 0 0; color:#fecaca; font-size:13px; letter-spacing:0.5px;">
                PathKhojo Enterprise Security & Intrusion Prevention Subsystem
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px;">
              <p style="margin:0 0 16px; color:#f87171; font-size:15px; font-weight:700; line-height:1.6;">
                Attention Lead Developer / System Administrator:
              </p>
              <p style="margin:0 0 24px; color:#cbd5e1; font-size:14px; line-height:1.6;">
                An unauthorized party attempted to breach the <strong style="color:#ffffff;">Super Administrator Console</strong> using unverified or mismatched credentials. The request was blocked immediately by the auth gateway.
              </p>

              <!-- Incident Telemetry Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#171926; border:1px solid #374151; border-radius:14px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:7px 0; color:#94a3b8; font-size:12px; font-weight:700; text-transform:uppercase; width:140px;">Target Role:</td>
                        <td style="padding:7px 0; color:#f87171; font-size:13px; font-weight:800;">${attemptedRole || "admin"} (ELEVATED PRIVILEGES)</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#94a3b8; font-size:12px; font-weight:700; text-transform:uppercase;">Attempted Identity:</td>
                        <td style="padding:7px 0; color:#ffffff; font-size:13px; font-family:monospace; font-weight:700;">${attemptedEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#94a3b8; font-size:12px; font-weight:700; text-transform:uppercase;">Block Reason:</td>
                        <td style="padding:7px 0; color:#fbbf24; font-size:13px; font-weight:600;">${reason}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#94a3b8; font-size:12px; font-weight:700; text-transform:uppercase;">Timestamp (IST):</td>
                        <td style="padding:7px 0; color:#e2e8f0; font-size:13px;">${alertTime}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#94a3b8; font-size:12px; font-weight:700; text-transform:uppercase;">Origin IP Address:</td>
                        <td style="padding:7px 0; color:#38bdf8; font-size:13px; font-family:monospace; font-weight:700;">${ipAddress}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0; color:#94a3b8; font-size:12px; font-weight:700; text-transform:uppercase;">User-Agent / Device:</td>
                        <td style="padding:7px 0; color:#cbd5e1; font-size:12px; line-height:1.4;">${userAgent}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <div style="background-color:rgba(239,68,68,0.1); border-left:4px solid #ef4444; border-radius:8px; padding:14px 18px; margin-bottom:24px;">
                <p style="margin:0; color:#fecaca; font-size:13px; line-height:1.6;">
                  <strong>Recommended Mitigation:</strong> If this request did not originate from your secured environment, verify server firewall logs, rate limiting rules, and consider temporary IP blocking for <code>${ipAddress}</code>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#07080d; padding:20px 32px; border-top:1px solid #1f2937; text-align:center;">
              <p style="margin:0; color:#6b7280; font-size:11px;">
                Automated Incident Report &bull; PathKhojo Platform Security Operations
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
