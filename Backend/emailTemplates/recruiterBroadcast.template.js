/**
 * ============================================================================
 * EMAIL TEMPLATE: Recruiter Candidate Skill-Match Broadcast
 * ============================================================================
 * 
 * Target Recipients:
 *   - Candidates whose verified profile skills match an urgent hiring broadcast from a recruiter.
 * 
 * Trigger Point:
 *   - Backend/controllers/job.controller.js -> broadcastJobAlert()
 * 
 * Included Elements:
 *   - Recruiter/Company name and branding
 *   - Matched skill pill tags (green checkboxes)
 *   - Custom personal note from the hiring manager (optional)
 *   - 1-Click apply link
 * 
 * Update / Edit Instructions:
 *   - Adjust custom message callout border or CTA styling in the template below.
 */

export const recruiterBroadcastEmailTemplate = ({
  candidateName = "Candidate",
  job,
  company,
  matchedSkills = [],
  customMessage = "",
  clientUrl = process.env.FRONTEND_URL || "http://localhost:5173",
}) => {
  const companyName = company?.companyName || "Verified Employer";
  const jobTitle = job?.title || "Exciting New Role";
  const salaryText = job?.salary ? `₹${Number(job.salary).toLocaleString("en-IN")}` : "Competitive Compensation";
  const locationText = job?.location || "Remote";
  const jobTypeText = job?.jobType || "Full-Time";

  const matchedPills = (matchedSkills || [])
    .slice(0, 6)
    .map(
      (s) =>
        `<span style="display:inline-block; background:rgba(6,182,212,0.15); color:#22d3ee; border:1px solid rgba(6,182,212,0.3); padding:4px 10px; border-radius:8px; font-size:11px; font-weight:700; margin:2px 4px 2px 0;">✓ ${s}</span>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hiring Alert: ${jobTitle} at ${companyName}</title>
</head>
<body style="margin:0; padding:0; background-color:#080c14; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#080c14; padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background-color:#0d1322; border-radius:20px; border:1px solid #1e293b; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%); padding:28px 24px; text-align:center;">
              <p style="margin:0 0 6px; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#a5f3fc;">
                📢 DIRECT RECRUITER HIRING ALERT
              </p>
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:900; letter-spacing:-0.5px;">
                ${companyName} is Looking for You!
              </h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:28px 24px;">
              <p style="margin:0 0 14px; font-size:15px; color:#cbd5e1; line-height:1.6;">
                Hi <strong style="color:#ffffff;">${candidateName}</strong>,
              </p>
              <p style="margin:0 0 20px; font-size:14px; color:#94a3b8; line-height:1.6;">
                The hiring team at <strong style="color:#38bdf8;">${companyName}</strong> has just broadcasted an urgent hiring alert for candidates with your technical background:
              </p>

              <!-- Job Overview Card -->
              <div style="background-color:#131b2e; border:1px solid #1e293b; border-radius:16px; padding:20px; margin-bottom:20px;">
                <h2 style="margin:0 0 8px; color:#ffffff; font-size:18px; font-weight:800;">
                  ${jobTitle}
                </h2>
                <p style="margin:0 0 14px; color:#94a3b8; font-size:13px;">
                  🏢 ${companyName} &bull; 📍 ${locationText} &bull; 💼 ${jobTypeText}
                </p>

                <div style="display:inline-block; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); color:#34d399; font-size:12px; font-weight:800; padding:4px 12px; border-radius:10px; margin-bottom:14px;">
                  💰 ${salaryText}
                </div>

                ${
                  matchedPills
                    ? `<div style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.06); pt-3;">
                        <p style="margin:10px 0 6px; font-size:11px; color:#38bdf8; font-weight:700; text-transform:uppercase; letter-spacing:1px;">
                          🎯 YOUR MATCHING SKILLS DETECTED:
                        </p>
                        <div>${matchedPills}</div>
                      </div>`
                    : ""
                }
              </div>

              ${
                customMessage
                  ? `<!-- Recruiter Message Note -->
                    <div style="background:rgba(79,70,229,0.1); border-left:4px solid #6366f1; border-radius:8px; padding:14px; margin-bottom:24px;">
                      <p style="margin:0 0 4px; font-size:11px; font-weight:800; color:#818cf8; text-transform:uppercase; letter-spacing:1px;">
                        Message from Hiring Manager:
                      </p>
                      <p style="margin:0; font-size:13px; color:#e2e8f0; font-style:italic; line-height:1.5;">
                        "${customMessage}"
                      </p>
                    </div>`
                  : ""
              }

              <!-- CTA Button -->
              <div style="text-align:center; margin-bottom:20px;">
                <a href="${clientUrl}/jobs" style="display:inline-block; background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); color:#ffffff; text-decoration:none; font-size:14px; font-weight:800; padding:14px 34px; border-radius:14px; box-shadow:0 8px 25px rgba(79,70,229,0.4);">
                  View Job & Apply Now &rarr;
                </a>
              </div>

              <p style="margin:0; font-size:12px; color:#64748b; text-align:center; line-height:1.5;">
                You received this alert because your verified profile skills align with this open role on NexHire.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#090d16; padding:16px 24px; text-align:center; border-top:1px solid #1e293b;">
              <p style="margin:0; color:#64748b; font-size:11px;">
                NexHire Career Intelligence Platform &bull; <a href="${clientUrl}/profile" style="color:#38bdf8; text-decoration:none;">Update Skills & Profile</a>
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
