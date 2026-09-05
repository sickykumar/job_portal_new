import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../utils/validators.js";
import { sendEmail } from "../utils/emailService.js";
import {
  loginSecurityAlertHTML,
  registrationWelcomeHTML,
  loginOtpTemplate,
  forgotPasswordOtpTemplate,
  passwordChangedTemplate,
  securityBreachAlertHTML,
} from "../emailTemplates/index.js";
import { emitEvent } from "../automation/events/automationBus.js";
import { EVENT_TYPES } from "../automation/events/eventTypes.js";

// Helper to issue authenticated session cookie and JSON response
const issueAuthSession = (res, user, message = "Authenticated successfully", req = null) => {
  const isProduction = process.env.NODE_ENV === "production";
  const tokenData = {
    userId: user._id,
    role: user.role,
  };

  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  const sanitizedUser = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    adharcard: user.adharcard,
    pancard: user.pancard,
    role: user.role,
    profile: user.profile,
  };

  // Telemetry for security audit log
  const ipAddress =
    req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req?.ip ||
    req?.socket?.remoteAddress ||
    "127.0.0.1";
  const userAgent = req?.headers?.["user-agent"] || "Web Browser";

  // Send real-time Login Security Alert email ONLY for Candidates and Recruiters
  // (Admin is intentionally excluded as requested: no routine login alerts for admin)
  if (user.role.toLowerCase() !== "admin") {
    sendEmail({
      to: user.email,
      subject: `🛡️ Security Alert: New Login to your NexHire Account`,
      html: loginSecurityAlertHTML({
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        ipAddress,
        userAgent,
      }),
    }).catch((err) => console.error("[Login Security Alert] Email failed:", err.message));
  }

  return res
    .status(200)
    .cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    })
    .json({
      message,
      token,
      user: sanitizedUser,
      success: true,
    });
};

// REGISTER
export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
        success: false,
      });
    }

    const { fullname, email, phoneNumber, password, adharcard, pancard, role } = parseResult.data;

    // Disallow admin registration explicitly
    if (role.toLowerCase() === "admin") {
      return res.status(403).json({
        message: "Administrator accounts cannot be registered publicly. Please sign in.",
        success: false,
      });
    }

    const cleanAadhaar = (adharcard || "").replace(/\s+/g, "").trim();
    const cleanPAN = (pancard || "").trim();

    // Check existing unique attributes dynamically
    const checkOr = [{ email }, { phoneNumber }];
    if (cleanAadhaar) {
      checkOr.push({ adharcard: cleanAadhaar });
    }
    if (cleanPAN) {
      checkOr.push({ pancard: cleanPAN });
    }

    const existingUser = await User.findOne({ $or: checkOr });

    if (existingUser) {
      let field = "Account detail";
      if (existingUser.email === email) field = "Email";
      else if (existingUser.phoneNumber === phoneNumber) field = "Phone number";
      else if (cleanAadhaar && existingUser.adharcard === cleanAadhaar) field = "Aadhaar number";
      else if (cleanPAN && existingUser.pancard === cleanPAN) field = "PAN card";

      return res.status(409).json({
        message: `${field} is already registered.`,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      if (fileUri) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
          folder: "job_portal_avatars",
        });
        profilePhotoUrl = cloudResponse.secure_url;
      }
    }

    const userData = {
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role.toLowerCase(),
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    };

    if (cleanAadhaar) userData.adharcard = cleanAadhaar;
    if (cleanPAN) userData.pancard = cleanPAN;

    const newUser = await User.create(userData);

    // Send Welcome & Greeting Email with role-tailored recommendations in background
    sendEmail({
      to: newUser.email,
      subject: `🎉 Welcome to NexHire, ${newUser.fullname}! Recommended next steps for you`,
      html: registrationWelcomeHTML({
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      }),
    }).catch((err) => console.error("[Registration Greeting] Email failed:", err.message));

    return res.status(201).json({
      message: `Account created successfully for ${newUser.fullname}`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to notify developer of critical admin security breaches
const notifyDeveloperSecurityBreach = (attemptedEmail, attemptedRole, reason, req) => {
  const developerEmail = process.env.DEVELOPER_EMAIL || "connect@sickykumar.in";
  const ipAddress =
    req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req?.ip ||
    req?.socket?.remoteAddress ||
    "127.0.0.1";
  const userAgent = req?.headers?.["user-agent"] || "Web Browser";

  console.warn(`[SECURITY BREACH ATTEMPT] Blocked attempt on ${attemptedEmail} as ${attemptedRole}. Notifying developer ${developerEmail}.`);

  sendEmail({
    to: developerEmail,
    subject: `🚨 CRITICAL SECURITY ALERT: Unauthorized Super Admin Login Attempt (${attemptedEmail})`,
    html: securityBreachAlertHTML({
      attemptedEmail,
      attemptedRole,
      reason,
      ipAddress,
      userAgent,
    }),
  }).catch((err) => console.error("[Security Breach Alert] Developer notification failed:", err.message));
};

// LOGIN (With OTP Verification for Candidates & Recruiters; Direct for Super Admin)
export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Validation failed",
        success: false,
      });
    }

    const { email, password, role } = parseResult.data;
    const isTargetingAdmin = role.toLowerCase() === "admin";

    const user = await User.findOne({ email });
    if (!user) {
      // If someone attempts to log in as admin with an unauthorized/unregistered email, trigger developer alert
      if (isTargetingAdmin) {
        notifyDeveloperSecurityBreach(
          email,
          role,
          "Identity not found in database. Unregistered email attempted Admin login.",
          req
        );
      }
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If someone attempts admin credentials with wrong password, trigger developer alert
      if (isTargetingAdmin || user.role.toLowerCase() === "admin") {
        notifyDeveloperSecurityBreach(
          email,
          role,
          "Invalid password attempt on elevated Administrator account.",
          req
        );
      }
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      // Role mismatch on admin attempt (e.g. candidate trying to claim admin role)
      if (isTargetingAdmin || user.role.toLowerCase() === "admin") {
        notifyDeveloperSecurityBreach(
          email,
          role,
          `Role mismatch privilege escalation attempt: Account is registered as '${user.role}' but tried logging in as '${role}'.`,
          req
        );
      }
      return res.status(403).json({
        message: `Account role is registered as '${user.role}', not '${role}'`,
        success: false,
      });
    }

    // SUPER ADMIN: Direct master login without OTP barrier (No routine login alerts sent)
    if (user.role.toLowerCase() === "admin") {
      return issueAuthSession(res, user, `Welcome back, Master Administrator`, req);
    }

    // CANDIDATE & RECRUITER: Trigger 6-Digit Email OTP Verification
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email: user.email.toLowerCase(), purpose: "login" });
    await Otp.create({
      email: user.email.toLowerCase(),
      otp: generatedOtp,
      purpose: "login",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    sendEmail({
      to: user.email,
      subject: `🔑 Your NexHire Login Verification Code: ${generatedOtp}`,
      html: loginOtpTemplate({ name: user.fullname, otp: generatedOtp }),
    }).catch((err) => console.error("[Login OTP] Email send error:", err.message));

    return res.status(200).json({
      requireOtp: true,
      email: user.email,
      role: user.role,
      message: `A 6-digit verification code has been sent to ${user.email} (valid for 5 minutes).`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY LOGIN OTP (Candidate & Recruiter)
export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp, role } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and 6-digit OTP code are required",
        success: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const otpRecord = await Otp.findOne({ email: cleanEmail, purpose: "login" });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Verification code has expired or is invalid. Please request a new code.",
        success: false,
      });
    }

    // Check 5-minute expiry timestamp
    if (otpRecord.expiresAt && new Date(otpRecord.expiresAt).getTime() < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "Verification code has expired (valid for 5 minutes). Please request a fresh code.",
        success: false,
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          message: "Too many incorrect attempts. Please request a fresh OTP.",
          success: false,
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        message: "Incorrect verification code. Please check your inbox and try again.",
        success: false,
      });
    }

    // OTP Verified — remove used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        message: "User account not found",
        success: false,
      });
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        message: `Account role is registered as '${user.role}', not '${role}'`,
        success: false,
      });
    }

    return issueAuthSession(res, user, `Welcome back, ${user.fullname}!`, req);
  } catch (error) {
    next(error);
  }
};

// RESEND LOGIN OTP
export const resendLoginOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email", success: false });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email: cleanEmail, purpose: "login" });
    await Otp.create({
      email: cleanEmail,
      otp: generatedOtp,
      purpose: "login",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    sendEmail({
      to: cleanEmail,
      subject: `🔑 Your New NexHire Login Code: ${generatedOtp}`,
      html: loginOtpTemplate({ name: user.fullname, otp: generatedOtp }),
    }).catch((err) => console.error("[Resend OTP] Failed to send email:", err.message));

    return res.status(200).json({
      success: true,
      message: `Fresh verification code sent to ${cleanEmail} (valid for 5 minutes).`,
    });
  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD: STEP 1 - REQUEST OTP
export const forgotPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please provide your registered email address",
        success: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        message: "No registered account found with this email address.",
        success: false,
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Super Administrator recovery is restricted. Please contact platform operations.",
        success: false,
      });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email: cleanEmail, purpose: "forgot_password" });
    await Otp.create({
      email: cleanEmail,
      otp: resetOtp,
      purpose: "forgot_password",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    sendEmail({
      to: cleanEmail,
      subject: `🛡️ NexHire Password Reset Code: ${resetOtp}`,
      html: forgotPasswordOtpTemplate({ name: user.fullname, otp: resetOtp }),
    }).catch((err) => console.error("[Forgot Password] Email send failed:", err.message));

    return res.status(200).json({
      success: true,
      email: cleanEmail,
      message: "A 6-digit recovery code has been sent to your registered email (valid for 5 minutes).",
    });
  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD: STEP 2 - VERIFY OTP CODE ONLY
export const forgotPasswordVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and 6-digit recovery code are required.",
        success: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const otpRecord = await Otp.findOne({ email: cleanEmail, purpose: "forgot_password" });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Recovery code has expired or is invalid. Please request a new code.",
        success: false,
      });
    }

    // Check 5-minute expiry timestamp
    if (otpRecord.expiresAt && new Date(otpRecord.expiresAt).getTime() < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "Recovery code has expired (valid for 5 minutes). Please request a fresh one.",
        success: false,
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          message: "Too many incorrect attempts. Please request a fresh recovery code.",
          success: false,
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        message: "Incorrect recovery code. Please check your email and try again.",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recovery code verified successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD: STEP 3 - VERIFY OTP & SET NEW PASSWORD
export const forgotPasswordReset = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, recovery code, and new password are required.",
        success: false,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
        success: false,
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    const otpRecord = await Otp.findOne({ email: cleanEmail, purpose: "forgot_password" });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired recovery code. Please request a fresh one.",
        success: false,
      });
    }

    // Check 5-minute expiry timestamp
    if (otpRecord.expiresAt && new Date(otpRecord.expiresAt).getTime() < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        message: "Recovery code has expired (valid for 5 minutes). Please request a fresh one.",
        success: false,
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        return res.status(400).json({
          message: "Too many incorrect attempts. Please request a new recovery code.",
          success: false,
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        message: "Incorrect recovery code. Please try again.",
        success: false,
      });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        message: "User account not found.",
        success: false,
      });
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Send confirmation security email
    sendEmail({
      to: cleanEmail,
      subject: "🔒 Security Alert: Your NexHire Password Was Changed Successfully",
      html: passwordChangedTemplate({
        name: user.fullname,
        changedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      }),
    }).catch((err) => console.error("[Password Changed] Confirmation email error:", err.message));

    return res.status(200).json({
      success: true,
      message: "Password reset successfully! A confirmation notice has been sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

// GOOGLE AUTH (CANDIDATE & RECRUITER ONLY - NOT ADMIN)
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({
        message: "Google credential token is required.",
        success: false,
      });
    }

    const targetRole = (role || "student").toLowerCase();

    // STRICT ADMIN GATING
    if (targetRole === "admin") {
      return res.status(403).json({
        message: "Google Sign-In is strictly disabled for Super Administrator accounts.",
        success: false,
      });
    }

    // Decode / verify Google token (supports both ID Token & Access Token)
    let googleUser = null;
    try {
      const gRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (gRes.ok) {
        googleUser = await gRes.json();
      }
    } catch (fetchErr) {
      console.warn("[GoogleAuth] tokeninfo fetch fallback:", fetchErr.message);
    }

    // Try Google Userinfo endpoint if credential is an access token
    if (!googleUser || !googleUser.email) {
      try {
        const uRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${credential}` },
        });
        if (uRes.ok) {
          googleUser = await uRes.json();
        }
      } catch (uErr) {
        console.warn("[GoogleAuth] userinfo fetch fallback:", uErr.message);
      }
    }

    // Fallback base64 decode for local testing/dev
    if (!googleUser || !googleUser.email) {
      try {
        const parts = credential.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
          if (payload && payload.email) {
            googleUser = payload;
          }
        }
      } catch (decodeErr) {
        console.warn("[GoogleAuth] fallback decode failed:", decodeErr.message);
      }
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({
        message: "Unable to verify Google credential token.",
        success: false,
      });
    }

    const email = googleUser.email.toLowerCase().trim();
    const fullname = googleUser.name || googleUser.given_name || "Google User";
    const googleId = googleUser.sub;
    const picture = googleUser.picture || "";

    let user = await User.findOne({ email });

    if (user) {
      if (user.accountStatus === "suspended") {
        return res.status(403).json({
          message: "Your account has been suspended. Please contact platform operations.",
          success: false,
        });
      }

      if (user.role === "admin") {
        return res.status(403).json({
          message: "Super Administrator accounts cannot be accessed via Google Sign-In.",
          success: false,
        });
      }

      // Link googleId or avatar photo if missing
      let needsSave = false;
      if (!user.googleId) {
        user.googleId = googleId;
        needsSave = true;
      }
      if (!user.profile?.profilePhoto && picture) {
        if (!user.profile) user.profile = {};
        user.profile.profilePhoto = picture;
        needsSave = true;
      }
      if (needsSave) await user.save();

      return issueAuthSession(res, user, `Welcome back, ${user.fullname}!`);
    }

    // Register new candidate or recruiter via Google
    user = await User.create({
      fullname,
      email,
      role: targetRole === "recruiter" ? "recruiter" : "student",
      googleId,
      agreedToTerms: true,
      profile: {
        profilePhoto: picture,
      },
    });

    return issueAuthSession(
      res,
      user,
      `Account created successfully with Google! Welcome to NexHire, ${user.fullname}.`
    );
  } catch (error) {
    next(error);
  }
};

// GET CURRENT LOGGED IN USER
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error logging out",
      success: false,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Invalid input data",
        success: false,
      });
    }

    const { fullname, email, phoneNumber, bio, skills } = parseResult.data;
    const file = req.file;

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already taken", success: false });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills) {
      user.profile.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (req.body.department !== undefined) user.profile.department = req.body.department;
    if (req.body.website !== undefined) user.profile.website = req.body.website;
    if (req.body.github !== undefined) user.profile.github = req.body.github;
    if (req.body.linkedin !== undefined) user.profile.linkedin = req.body.linkedin;
    if (req.body.portfolio !== undefined) user.profile.portfolio = req.body.portfolio;
    if (req.body.expectedCtc !== undefined) user.profile.expectedCtc = req.body.expectedCtc;
    if (req.body.notifications) {
      try {
        user.profile.notifications =
          typeof req.body.notifications === "string"
            ? JSON.parse(req.body.notifications)
            : req.body.notifications;
      } catch {
        // ignore json parse error
      }
    }

    if (file) {
      const fileUri = getDataUri(file);
      if (fileUri) {
        const isImage = file.mimetype?.startsWith("image/");
        const isPdfOrDoc =
          file.mimetype === "application/pdf" ||
          file.originalname?.endsWith(".pdf") ||
          file.originalname?.endsWith(".doc") ||
          file.originalname?.endsWith(".docx");

        if (isImage) {
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: "job_portal_avatars",
          });
          user.profile.profilePhoto = cloudResponse.secure_url;
        } else {
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            folder: "job_portal_resumes",
            resource_type: isPdfOrDoc ? "raw" : "auto",
          });
          user.profile.resume = cloudResponse.secure_url;
          user.profile.resumeOriginalname = file.originalname;

          // Emit event: triggers asynchronous CV text extraction & CandidateProfile normalization
          emitEvent(EVENT_TYPES.RESUME_UPLOADED, {
            entityType: "user",
            entityId: user._id,
            actorId: user._id,
            metadata: {
              resumeUrl: cloudResponse.secure_url,
              originalName: file.originalname,
              uploadedAt: Date.now(),
            },
          });
        }
      }
    } else if (req.body.removeResume === "true" || req.body.removeResume === true) {
      user.profile.resume = "";
      user.profile.resumeOriginalname = "";
    }

    await user.save();

    const sanitizedUser = await User.findById(req.id).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizedUser,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
        success: false,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
        success: false,
      });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found.", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        success: false,
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Candidate: Get/Stream Authenticated Own Resume
// ======================================
export const getMyResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    if (!user || !user.profile?.resume) {
      return res.status(404).json({
        message: "No resume document found for this account.",
        success: false,
      });
    }

    const resumeUrl = user.profile.resume;
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      return res.redirect(resumeUrl);
    }

    let filename =
      user.profile.resumeOriginalname ||
      `${(user.fullname || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`;

    if (!filename.toLowerCase().endsWith(".pdf")) {
      filename += ".pdf";
    }

    const isView = req.query.view === "true";
    const disposition = isView ? "inline" : "attachment";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${filename}"`
    );

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    next(error);
  }
};

// GET PUBLIC AUTH CONFIGURATION (Google Client ID)
export const getAuthConfig = async (req, res) => {
  return res.status(200).json({
    success: true,
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  });
};