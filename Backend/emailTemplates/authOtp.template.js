/**
 * ============================================================================
 * EMAIL TEMPLATES: Authentication OTP Codes & Password Lifecycle
 * ============================================================================
 * 
 * Target Recipients & Usage:
 *   1. loginOtpTemplate: 6-digit login two-factor authentication code for candidates & recruiters.
 *   2. forgotPasswordOtpTemplate: 6-digit account recovery code for resetting password.
 *   3. passwordChangedTemplate: Confirmation notice sent after successful password change.
 * 
 * Trigger Points:
 *   - Backend/controllers/user.controller.js -> login()
 *   - Backend/controllers/user.controller.js -> resendLoginOtp()
 *   - Backend/controllers/user.controller.js -> forgotPasswordRequest()
 *   - Backend/controllers/user.controller.js -> forgotPasswordReset()
 *   - Backend/controllers/user.controller.js -> changePassword()
 * 
 * Update / Edit Instructions:
 *   - To adjust OTP validity window (default 5 minutes), update the warning badges and
 *     the corresponding backend TTL in user.controller.js (expiresAt: Date.now() + 5*60*1000).
 */

/**
 * 1. 6-Digit Login Verification Code Email Template
 */
export const loginOtpTemplate = ({ name = "User", otp }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PathKhojo Login Code</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#090d16; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px; background-color:#111827; border-radius:18px; overflow:hidden; border:1px solid #1e293b; box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%); padding:32px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800;">PathKhojo Security Verification</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:13px;">Two-Factor Authentication Passcode</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px; color:#e2e8f0; text-align:center;">
              <p style="margin:0 0 16px; font-size:15px; text-align:left;">Hello <strong style="color:#ffffff;">${name}</strong>,</p>
              <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#94a3b8; text-align:left;">
                We received a sign-in request for your PathKhojo account. Please use the following 6-digit one-time passcode (OTP) to complete your login:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background:#0f172a; border:2px dashed #4f46e5; border-radius:14px; padding:22px; margin:0 auto 24px; display:inline-block; min-width:240px;">
                <span style="font-family:'Courier New',Courier,monospace; font-size:36px; font-weight:900; letter-spacing:8px; color:#38bdf8;">${otp}</span>
              </div>

              <p style="margin:0 0 12px; font-size:12px; color:#f59e0b; font-weight:600;">
                ⚠️ This passcode is valid for 5 minutes only. Do not share this code with anyone.
              </p>
              <p style="margin:0; font-size:12px; line-height:1.6; color:#64748b; text-align:left;">
                If you did not attempt to sign in to your PathKhojo account, please change your account password immediately to protect your credentials.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a; padding:16px 28px; text-align:center; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#64748b; font-size:11px;">PathKhojo Identity & Security Shield • Automated Message</p>
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
 * 2. 6-Digit Password Reset OTP Email Template
 */
export const forgotPasswordOtpTemplate = ({ name = "User", otp }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#090d16; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px; background-color:#111827; border-radius:18px; overflow:hidden; border:1px solid #1e293b; box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="background:linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%); padding:32px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800;">Password Reset Request</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:13px;">PathKhojo Account Recovery</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px; color:#e2e8f0; text-align:center;">
              <p style="margin:0 0 16px; font-size:15px; text-align:left;">Hello <strong style="color:#ffffff;">${name}</strong>,</p>
              <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#94a3b8; text-align:left;">
                We received a request to reset the password for your PathKhojo account. Enter the 6-digit recovery code below to proceed:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background:#0f172a; border:2px dashed #f43f5e; border-radius:14px; padding:22px; margin:0 auto 24px; display:inline-block; min-width:240px;">
                <span style="font-family:'Courier New',Courier,monospace; font-size:36px; font-weight:900; letter-spacing:8px; color:#fda4af;">${otp}</span>
              </div>

              <p style="margin:0 0 12px; font-size:12px; color:#f59e0b; font-weight:600;">
                ⏳ This recovery code is valid for 5 minutes only.
              </p>
              <p style="margin:0; font-size:12px; line-height:1.6; color:#64748b; text-align:left;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a; padding:16px 28px; text-align:center; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#64748b; font-size:11px;">PathKhojo Identity & Security Shield • Automated Message</p>
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
 * 3. Password Changed Confirmation Email Template
 */
export const passwordChangedTemplate = ({ name = "User", changedAt = new Date().toLocaleString("en-IN") }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed Successfully</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#090d16; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:540px; background-color:#111827; border-radius:18px; overflow:hidden; border:1px solid #1e293b; box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="background:linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%); padding:32px 30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800;">Password Updated Successfully</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:13px;">Security Confirmation Notice</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px; color:#e2e8f0;">
              <p style="margin:0 0 16px; font-size:15px;">Hello <strong style="color:#ffffff;">${name}</strong>,</p>
              <p style="margin:0 0 20px; font-size:14px; line-height:1.6; color:#94a3b8;">
                This email confirms that the password for your PathKhojo account was successfully changed on <strong>${changedAt}</strong>.
              </p>

              <div style="background:#0f172a; border-left:4px solid #10b981; border-radius:8px; padding:16px; margin-bottom:24px;">
                <p style="margin:0; color:#34d399; font-size:13px; font-weight:700;">Account Status: Secured & Active</p>
                <p style="margin:4px 0 0; color:#94a3b8; font-size:12px;">You can now sign in using your new credentials across all devices.</p>
              </div>

              <p style="margin:0 0 8px; font-size:13px; color:#ef4444; font-weight:700;">
                Did not authorize this change?
              </p>
              <p style="margin:0; font-size:12px; line-height:1.6; color:#64748b;">
                If you did not perform this password change, please contact our support desk immediately or trigger an emergency recovery.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a; padding:16px 28px; text-align:center; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#64748b; font-size:11px;">PathKhojo Platform Security Team</p>
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
