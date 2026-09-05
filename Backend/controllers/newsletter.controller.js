import { Newsletter } from "../models/newsletter.model.js";
import { sendEmail } from "../utils/emailService.js";
import { newsletterWelcomeHTML } from "../emailTemplates/index.js";

// ======================================
// Subscribe to Tech Job Alert Newsletter
// ======================================
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, source = "footer" } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
        success: false,
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email format (e.g. name@domain.com).",
        success: false,
      });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: cleanEmail });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.subscribedAt = new Date();
        await existing.save();

        // Send re-activation welcome email (non-blocking)
        sendEmail({
          to: cleanEmail,
          subject: "Welcome Back to NexHire Tech Alerts! 🚀",
          html: newsletterWelcomeHTML(cleanEmail),
        }).catch((err) =>
          console.error("[Newsletter] Reactivation email failed:", err.message)
        );

        return res.status(200).json({
          message: "Welcome back! Your subscription has been reactivated. Check your inbox!",
          success: true,
        });
      }

      return res.status(200).json({
        message: "You are already subscribed to NexHire job alerts!",
        success: true,
      });
    }

    // Create new subscription
    await Newsletter.create({
      email: cleanEmail,
      source,
      isActive: true,
      subscribedAt: new Date(),
    });

    // Send welcome email (non-blocking — don't fail the API response)
    sendEmail({
      to: cleanEmail,
      subject: "🎉 Welcome to NexHire Tech Career Alerts!",
      html: newsletterWelcomeHTML(cleanEmail),
    }).catch((err) =>
      console.error("[Newsletter] Welcome email failed:", err.message)
    );

    return res.status(201).json({
      message: "Successfully subscribed! Check your inbox for a welcome email. 📬",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Unsubscribe from Newsletter
// ======================================
export const unsubscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required to unsubscribe.",
        success: false,
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const sub = await Newsletter.findOne({ email: cleanEmail });
    if (sub) {
      sub.isActive = false;
      await sub.save();
    }

    return res.status(200).json({
      message: "You have been unsubscribed from NexHire job alerts.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
