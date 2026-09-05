/**
 * ============================================================================
 * EMAIL TEMPLATE: Candidate Automated Job Alert Digest
 * ============================================================================
 * 
 * Target Recipients:
 *   - Registered Candidates who subscribed to custom Job Alerts.
 * 
 * Trigger Point:
 *   - Backend/utils/jobAlertNotifier.js -> notifyCandidatesForNewJob()
 *   - Emitted automatically via automationBus when a new Job is published.
 * 
 * Included Elements:
 *   - Alert Title matched
 *   - Job Title & Company Logo/Name
 *   - Location, Job Type, and Salary
 *   - Key Requirements skill tags
 *   - 1-click CTA button to view and apply
 * 
 * Update / Edit Instructions:
 *   - Customize the requirements tags loop or gradient banner at the top.
 */

export const jobAlertEmailTemplate = ({
  candidateName = "Candidate",
  alertTitle = "Job Alert",
  jobTitle = "Software Engineer",
  companyName = "Tech Corp",
  companyLogo = "",
  location = "Remote",
  jobType = "Full-time",
  salary = "",
  requirements = [],
  jobId = "",
  clientUrl = "http://localhost:5173",
}) => {
  const reqPills = (requirements || [])
    .slice(0, 5)
    .map(
      (r) =>
        `<span style="display:inline-block; background:#1e293b; color:#38bdf8; font-size:11px; font-weight:600; padding:4px 10px; border-radius:12px; margin:2px 4px 2px 0;">${r}</span>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Matching Job Opportunity</title>
</head>
<body style="margin:0; padding:0; background-color:#090d16; font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; -webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#090d16; padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px; background:#0d1322; border:1px solid #1e293b; border-radius:24px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding:28px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.5px;">⚡ New Job Opportunity Alert</h1>
              <p style="margin:6px 0 0; color:#e0e7ff; font-size:12px; font-weight:500;">Matched with your alert: "${alertTitle}"</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:28px; color:#e2e8f0;">
              <p style="margin:0 0 16px; font-size:14px; color:#94a3b8;">Hello <strong style="color:#ffffff;">${candidateName}</strong>,</p>
              <p style="margin:0 0 20px; font-size:14px; line-height:1.6; color:#94a3b8;">
                A new open position matching your career preferences has just been posted on <strong>PathKhojo</strong>:
              </p>

              <!-- Job Card -->
              <div style="background:#141c31; border:1px solid #2a3756; border-radius:18px; padding:22px; margin-bottom:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    ${
                      companyLogo
                        ? `<td width="54" valign="top" style="padding-right:14px;"><img src="${companyLogo}" width="48" height="48" style="border-radius:12px; object-fit:cover; border:1px solid #334155;" alt="${companyName}" /></td>`
                        : ""
                    }
                    <td valign="top">
                      <h2 style="margin:0; font-size:18px; font-weight:800; color:#ffffff;">${jobTitle}</h2>
                      <p style="margin:4px 0 0; font-size:13px; font-weight:600; color:#38bdf8;">${companyName} • <span style="color:#94a3b8; font-weight:400;">${location}</span></p>
                    </td>
                  </tr>
                </table>

                <div style="margin-top:16px; padding-top:14px; border-top:1px dashed #1e293b;">
                  <span style="display:inline-block; background:#064e3b; color:#34d399; font-size:11px; font-weight:700; padding:4px 10px; border-radius:12px; margin-right:6px;">${jobType}</span>
                  ${
                    salary
                      ? `<span style="display:inline-block; background:#312e81; color:#c7d2fe; font-size:11px; font-weight:700; padding:4px 10px; border-radius:12px; margin-right:6px;">₹${salary.toLocaleString()} / mo</span>`
                      : ""
                  }
                </div>

                ${
                  reqPills
                    ? `<div style="margin-top:12px;"><p style="margin:0 0 6px; font-size:11px; color:#64748b; font-weight:600;">KEY REQUIREMENTS:</p>${reqPills}</div>`
                    : ""
                }
              </div>

              <!-- CTA Button -->
              <div style="text-align:center; margin-bottom:20px;">
                <a href="${clientUrl}/jobs" style="display:inline-block; background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); color:#ffffff; text-decoration:none; font-size:14px; font-weight:800; padding:14px 34px; border-radius:14px; box-shadow:0 8px 25px rgba(79,70,229,0.35);">
                  View Job & Apply Now →
                </a>
              </div>

              <p style="margin:0; font-size:12px; color:#64748b; text-align:center;">
                You received this alert because you subscribed to custom job notifications on PathKhojo.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0b101d; padding:16px 28px; text-align:center; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#64748b; font-size:11px;">PathKhojo Career Intelligence Platform • <a href="${clientUrl}/jobs" style="color:#38bdf8; text-decoration:none;">Browse All Positions</a></p>
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
