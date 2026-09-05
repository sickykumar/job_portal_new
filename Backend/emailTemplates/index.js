/**
 * ============================================================================
 * PATHKHOJO EMAIL TEMPLATES MASTER DIRECTORY & INDEX
 * ============================================================================
 * 
 * This directory breaks down all system email templates into dedicated, modular,
 * self-documenting files with detailed context and update instructions.
 * 
 * Modules:
 *   1. newsletterWelcome.template.js
 *      - Trigger: newsletter.controller.js -> subscribe()
 *      - Purpose: Welcomes new newsletter subscribers with tech career insights.
 * 
 *   2. loginSecurityAlert.template.js
 *      - Trigger: user.controller.js -> issueAuthSession() / verifyLoginOtp()
 *      - Purpose: Dispatches real-time session telemetry (IP, Device, Timestamp) to
 *                 Candidates and Recruiters upon sign-in.
 * 
 *   3. registrationWelcome.template.js
 *      - Trigger: user.controller.js -> register()
 *      - Purpose: Role-tailored onboarding roadmap with recommendations for Recruiters & Candidates.
 * 
 *   4. contactSupport.template.js
 *      - Trigger: contact.controller.js & admin.controller.js
 *      - Purpose: Confirmation of support tickets, admin alert, and resolution notifications.
 * 
 *   5. authOtp.template.js
 *      - Trigger: user.controller.js (login, forgot password, password change)
 *      - Purpose: 6-digit verification codes for 2FA, password recovery, and change confirmations.
 * 
 *   6. jobAlert.template.js
 *      - Trigger: jobAlertNotifier.js / automationBus
 *      - Purpose: Automated notification to candidates matching new job preferences.
 * 
 *   7. recruiterBroadcast.template.js
 *      - Trigger: job.controller.js -> broadcastJobAlert()
 *      - Purpose: Direct candidate outreach from hiring managers with matched skill tags.
 * 
 *   8. securityBreachAlert.template.js
 *      - Trigger: user.controller.js -> notifyDeveloperSecurityBreach()
 *      - Purpose: High-priority intrusion warning sent directly to the Lead Developer
 *                 upon unauthorized Admin login attempts.
 */

// 1. Newsletter
export * from "./newsletterWelcome.template.js";

// 2. Login Security Alert
export * from "./loginSecurityAlert.template.js";

// 3. Registration Greeting & Recommendations
export * from "./registrationWelcome.template.js";

// 4. Contact & Support Desk
export * from "./contactSupport.template.js";

// 5. Auth OTP Codes & Password Lifecycle
export * from "./authOtp.template.js";

// 6. Candidate Job Alert Digest
export * from "./jobAlert.template.js";

// 7. Recruiter Candidate Skill Broadcast
export * from "./recruiterBroadcast.template.js";

// 8. Super Admin Security Breach Watchdog
export * from "./securityBreachAlert.template.js";
