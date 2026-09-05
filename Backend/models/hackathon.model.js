import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    host: {
      type: String,
      required: true,
      trim: true,
    },
    bannerGradient: {
      type: String,
      default: "from-blue-600 via-indigo-600 to-cyan-500",
    },
    prizePool: {
      type: String,
      required: true,
    },
    firstPrize: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      default: "Online (Global)",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    daysLeft: {
      type: Number,
      default: 10,
    },
    participantsCount: {
      type: Number,
      default: 100,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    perks: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      default: "Registration Open",
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Hackathon = mongoose.model("Hackathon", hackathonSchema);
export default Hackathon;
