import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../utils/validators.js";

// REGISTER
export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
        success: false,
      });
    }

    const { fullname, email, phoneNumber, password, adharcard, pancard, role } = parseResult.data;

    // Check existing unique attributes
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }, { adharcard }, { pancard }],
    });

    if (existingUser) {
      let field = "Account detail";
      if (existingUser.email === email) field = "Email";
      else if (existingUser.phoneNumber === phoneNumber) field = "Phone number";
      else if (existingUser.adharcard === adharcard) field = "Aadhaar number";
      else if (existingUser.pancard === pancard) field = "PAN card";

      return res.status(409).json({
        message: `${field} is already registered.`,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      if (fileUri) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
          folder: "job_portal_avatars",
        });
        profilePhotoUrl = cloudResponse.secure_url;
      }
    }

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role: role.toLowerCase(),
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: `Account created successfully for ${newUser.fullname}`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Validation failed",
        success: false,
      });
    }

    const { email, password, role } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        message: `Account role is registered as '${user.role}', not '${role}'`,
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      adharcard: user.adharcard,
      pancard: user.pancard,
      role: user.role,
      profile: user.profile,
    };

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
      })
      .json({
        message: `Welcome back, ${user.fullname}`,
        token,
        user: sanitizedUser,
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

// GET CURRENT LOGGED IN USER
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error logging out",
      success: false,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Invalid input data",
        success: false,
      });
    }

    const { fullname, email, phoneNumber, bio, skills } = parseResult.data;
    const file = req.file;

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already taken", success: false });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills) {
      user.profile.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (file) {
      const fileUri = getDataUri(file);
      if (fileUri) {
        // Cloudinary requires resource_type: "raw" for non-image files like PDFs and DOCX
        // so that it doesn't treat PDF as an image and corrupt the stream or block delivery
        const isPdfOrDoc =
          file.mimetype === "application/pdf" ||
          file.originalname?.endsWith(".pdf") ||
          file.originalname?.endsWith(".doc") ||
          file.originalname?.endsWith(".docx");

        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
          folder: "job_portal_resumes",
          resource_type: isPdfOrDoc ? "raw" : "auto",
        });

        // Use fl_attachment or secure_url directly
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalname = file.originalname;
      }
    } else if (req.body.removeResume === "true" || req.body.removeResume === true) {
      user.profile.resume = "";
      user.profile.resumeOriginalname = "";
    }

    await user.save();

    const sanitizedUser = await User.findById(req.id).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizedUser,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};