import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  changePassword,
  getMyResume,
  getMe,
  verifyLoginOtp,
  resendLoginOtp,
  forgotPasswordRequest,
  forgotPasswordVerifyOtp,
  forgotPasswordReset,
  googleAuth,
  getAuthConfig,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.middleware.js";
import { singleUpload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/auth-config").get(getAuthConfig);
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/login-verify-otp").post(verifyLoginOtp);
router.route("/login-resend-otp").post(resendLoginOtp);
router.route("/forgot-password-request").post(forgotPasswordRequest);
router.route("/forgot-password-verify-otp").post(forgotPasswordVerifyOtp);
router.route("/forgot-password-reset").post(forgotPasswordReset);
router.route("/google-auth").post(googleAuth);
router.route("/logout").post(logout);
router.route("/me").get(authenticateToken, getMe);
router
  .route("/profile/update")
  .post(authenticateToken, singleUpload, updateProfile);
router.route("/change-password").post(authenticateToken, changePassword);
router.route("/resume/download").get(authenticateToken, getMyResume);

export default router;