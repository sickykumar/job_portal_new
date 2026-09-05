import { JobAlert } from "../models/jobAlert.model.js";

/**
 * Standalone JobAlert Controller
 * Full CRUD for candidate job alert subscriptions.
 */

// CREATE JOB ALERT
export const createJobAlert = async (req, res, next) => {
  try {
    const {
      title,
      keywords = [],
      location = "Any Location",
      jobType = "All",
      minSalary = 0,
      frequency = "instant",
    } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Alert title is required (e.g. 'Remote React Developer').",
      });
    }

    const cleanKeywords = Array.isArray(keywords)
      ? keywords.map((k) => k.trim()).filter(Boolean)
      : typeof keywords === "string"
      ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const newAlert = await JobAlert.create({
      userId: req.id,
      email: req.user.email,
      title: title.trim(),
      keywords: cleanKeywords,
      location: location.trim(),
      jobType: jobType.trim(),
      minSalary: Number(minSalary) || 0,
      frequency,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Job alert created successfully! You will receive email notifications when matching positions are posted.",
      alert: newAlert,
    });
  } catch (error) {
    next(error);
  }
};

// GET MY JOB ALERTS
export const getMyJobAlerts = async (req, res, next) => {
  try {
    const alerts = await JobAlert.find({ userId: req.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// TOGGLE JOB ALERT STATUS (Pause / Resume)
export const toggleJobAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await JobAlert.findOne({ _id: id, userId: req.id });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Job alert not found or unauthorized.",
      });
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    return res.status(200).json({
      success: true,
      message: `Job alert ${alert.isActive ? "resumed" : "paused"} successfully.`,
      alert,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE JOB ALERT
export const deleteJobAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alert = await JobAlert.findOneAndDelete({ _id: id, userId: req.id });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Job alert not found or unauthorized.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job alert deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
