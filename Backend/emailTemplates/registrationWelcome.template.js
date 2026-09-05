/**
 * ============================================================================
 * EMAIL TEMPLATE: New User Registration Greeting & Recommendations
 * ============================================================================
 * 
 * Target Recipients:
 *   - Newly registered Candidates (Students) and Recruiters.
 * 
 * Trigger Point:
 *   - Backend/controllers/user.controller.js -> register()
 * 
 * Tailored Content:
 *   - Recruiters: Instructions to complete company profile, post job using Gemini AI,
 *     manage applicants via Kanban pipeline, and broadcast skill alerts.
 *   - Candidates: Instructions to run ATS Resume check, explore open jobs, compete
 *     in hackathons & skill quizzes, and enable automated job alerts.
 * 
 * Update / Edit Instructions:
 *   - To modify recommendations for either persona, edit the ternary conditional blocks:
 *     isRecruiter ? `...` : `...`
 */

export const registrationWelcomeHTML = ({ fullname, email, role }) => {
  const isRecruiter = role?.toLowerCase() === "recruiter";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const dashboardUrl = isRecruiter
    ? `${clientUrl}/recruiter-dashboard`
    : `${clientUrl}/candidate-dashboard`;
  const roleTitle = isRecruiter ? "Recruiter & Hiring Partner" : "Tech Candidate";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to NexHire — Get Started</title>
</head>
<body style="margin:0; padding:0; background-color:#0b0f19; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b0f19; padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#131b2e; border:1px solid #1e293b; border-radius:18px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #0891b2 100%); padding:36px 32px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; letter-spacing:-0.5px;">
                Nex<span style="color:#a5f3fc;">Hire</span>
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:700;">
                Next-Generation Career Intelligence
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <h2 style="margin:0 0 10px; color:#ffffff; font-size:22px; font-weight:800;">
                🎉 Welcome to NexHire, ${fullname}!
              </h2>
              <p style="margin:0 0 24px; color:#94a3b8; font-size:14px; line-height:1.6;">
                Your account is ready as a registered <strong>${roleTitle}</strong>. We're thrilled to partner with you on your career journey.
              </p>

              <!-- Curated Recommendations Title -->
              <div style="border-bottom:1px solid #1e293b; padding-bottom:8px; margin-bottom:20px;">
                <h3 style="margin:0; font-size:14px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:1px;">
                  💡 Recommended Next Steps For You:
                </h3>
              </div>

              ${
                isRecruiter
                  ? `<!-- Recruiter Recommendations -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #4f46e5;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">🏢 1. Set Up Your Verified Company Profile</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Add your company logo, description, and website to build trust and attract top-tier talent.</p>
                      </td>
                    </tr>
                    <tr><td style="height:10px;"></td></tr>
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #06b6d4;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">📢 2. Post Your First Job Opening with AI</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Use our Gemini AI job description generator to draft formatted, high-impact job postings in seconds.</p>
                      </td>
                    </tr>
                    <tr><td style="height:10px;"></td></tr>
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #8b5cf6;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">📊 3. Manage Talent via 5-Stage Kanban</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Review applicants, run AI candidate ranking, and schedule Google Meet interviews effortlessly.</p>
                      </td>
                    </tr>
                    <tr><td style="height:10px;"></td></tr>
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #10b981;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">⚡ 4. Broadcast Skill-Matched Candidate Alerts</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Reach top-scoring active candidates instantly with tailored job alerts matching their skill radar.</p>
                      </td>
                    </tr>
                  </table>`
                  : `<!-- Candidate Recommendations -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #4f46e5;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">📄 1. Upload & Benchmark Your Resume with AI</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Use our Enterprise ATS Resume Checker to identify keyword gaps, formatting issues, and STAR metrics.</p>
                      </td>
                    </tr>
                    <tr><td style="height:10px;"></td></tr>
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #06b6d4;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">🔍 2. Discover High-Growth Tech Jobs</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Browse verified job postings with transparent salary benchmarks and one-click quick apply.</p>
                      </td>
                    </tr>
                    <tr><td style="height:10px;"></td></tr>
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #8b5cf6;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">🏆 3. Compete in Hackathons & Quizzes</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Earn verified skill badges and increase your profile visibility directly to hiring recruiters.</p>
                      </td>
                    </tr>
                    <tr><td style="height:10px;"></td></tr>
                    <tr>
                      <td style="padding:14px 18px; background:#0f172a; border-radius:12px; border-left:4px solid #10b981;">
                        <p style="margin:0; color:#f8fafc; font-size:14px; font-weight:700;">🔔 4. Turn On Automated Job Alerts</p>
                        <p style="margin:4px 0 0; color:#94a3b8; font-size:13px; line-height:1.5;">Receive instant email digests whenever exciting roles matching your skill set are posted.</p>
                      </td>
                    </tr>
                  </table>`
              }

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" target="_blank" style="display:inline-block; background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#ffffff; text-decoration:none; padding:15px 38px; border-radius:12px; font-size:14px; font-weight:800; letter-spacing:0.3px; box-shadow:0 8px 25px rgba(79,70,229,0.4);">
                      Launch Your Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 32px; background-color:#090d16; border-top:1px solid #1e293b; text-align:center;">
              <p style="margin:0 0 6px; color:#64748b; font-size:12px;">
                Welcome email sent to <strong>${email}</strong> &bull; NexHire Career Platform
              </p>
              <p style="margin:0; color:#475569; font-size:11px;">
                © ${new Date().getFullYear()} NexHire Platforms Technologies Pvt. Ltd. &bull; All rights reserved.
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
