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
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    pancard: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    adharcard: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      default: "student",
      required: true,
      lowercase: true,
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
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);