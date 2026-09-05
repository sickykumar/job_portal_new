import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  q: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
  explanation: { type: String, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, default: "Engineering" },
    level: { type: String, default: "Intermediate" },
    color: { type: String, default: "from-cyan-500 to-blue-600" },
    timeLimit: { type: Number, default: 120 },
    questions: [questionSchema],
    attemptsCount: { type: Number, default: 0 },
    passCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
