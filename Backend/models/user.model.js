import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    agreedToTerms: {
      type: Boolean,
      default: true,
    },
    pancard: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    adharcard: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
      required: true,
      lowercase: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    profile: {
      bio: { type: String, default: "" },
      skills: [{ type: String }],
      resume: { type: String, default: "" },
      resumeOriginalname: { type: String, default: "" },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      profilePhoto: {
        type: String,
        default: "",
      },
      savedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
      ],
      department: { type: String, default: "" },
      website: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      expectedCtc: { type: String, default: "" },
      notifications: {
        type: mongoose.Schema.Types.Mixed,
        default: {
          emailAlerts: true,
          applicationUpdates: true,
          interviewReminders: true,
          marketing: false,
        },
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);