import { Notification } from "../models/notification.model.js";

// Helper to reliably create a notification without interrupting primary transactions
export const createNotification = async ({ recipient, type, title, message, link = "" }) => {
  try {
    if (!recipient) return null;
    return await Notification.create({
      recipient,
      type,
      title,
      message,
      link,
    });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
    return null;
  }
};

// GET all notifications for logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.id;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(25),
      Notification.countDocuments({ recipient: userId, read: false }),
    ]);

    return res.status(200).json({
      success: true,
      notifications: notifications || [],
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// Mark single notification as read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.id;
    const notificationId = req.params.id;

    const notif = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({ message: "Notification not found", success: false });
    }

    return res.status(200).json({ success: true, notification: notif });
  } catch (error) {
    next(error);
  }
};

// Mark all as read
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.id;

    await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });

    return res.status(200).json({
      message: "All notifications marked as read",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
