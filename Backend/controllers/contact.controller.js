import { Contact } from "../models/contact.model.js";
import { sendEmail } from "../utils/emailService.js";
import {
  contactConfirmationHTML,
  contactAdminNotifyHTML,
} from "../emailTemplates/index.js";
import { contactSchemaValidator } from "../utils/validators.js";

// ======================================
// Submit Contact Form
// ======================================
export const submitContact = async (req, res, next) => {
  try {
    const validation = contactSchemaValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid contact form submission",
        success: false,
      });
    }

    const { name, email, subject, category, message } = validation.data;

    // Create contact record in MongoDB
    const contact = await Contact.create({
      name,
      email,
      subject,
      category,
      message,
    });

    const emailData = {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      category: contact.category,
      ticketId: contact.ticketId,
      message: contact.message,
    };

    // 1. Send confirmation email to the user (non-blocking)
    sendEmail({
      to: contact.email,
      subject: `✅ We received your message — Ticket ${contact.ticketId}`,
      html: contactConfirmationHTML(emailData),
    }).catch((err) =>
      console.error("[Contact] User confirmation email failed:", err.message)
    );

    // 2. Send admin notification email (non-blocking)
    const adminEmail = process.env.SMTP_USER;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `📩 New Contact: ${contact.subject} [${contact.ticketId}]`,
        html: contactAdminNotifyHTML(emailData),
      }).catch((err) =>
        console.error("[Contact] Admin notification email failed:", err.message)
      );
    }

    return res.status(201).json({
      message: `Message sent successfully! Your ticket ID is ${contact.ticketId}. Check your inbox for confirmation.`,
      ticketId: contact.ticketId,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
