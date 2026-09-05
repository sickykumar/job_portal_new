import mongoose from "mongoose";

const adminAuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["candidate", "recruiter", "job", "ticket", "system"],
      required: true,
    },
    targetId: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    adminLevel: {
      type: String,
      enum: ["superadmin", "moderator", "support_lead"],
      default: "superadmin",
    },
    permissions: {
      type: [String],
      default: [
        "manage_candidates",
        "manage_recruiters",
        "manage_jobs",
        "manage_tickets",
        "system_audit",
      ],
    },
    auditLogs: [adminAuditLogSchema],
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
export const AdminAuditLog = mongoose.model("AdminAuditLog", adminAuditLogSchema);
