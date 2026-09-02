import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { companySchemaValidator, companyUpdateSchema } from "../utils/validators.js";

// Register Company (Recruiter Only)
export const registerCompany = async (req, res, next) => {
  try {
    const parseResult = companySchemaValidator.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Invalid company name",
        success: false,
      });
    }

    const { companyName } = parseResult.data;

    // Check if company name is already registered
    const existing = await Company.findOne({
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        message: "Company name already exists",
        success: false,
      });
    }

    const company = await Company.create({
      companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Get all companies of the currently logged in recruiter
export const getAllCompanies = async (req, res, next) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      companies: companies || [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Get company by ID
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Update company details (Owner Verification Required)
export const updateCompany = async (req, res, next) => {
  try {
    const parseResult = companyUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Validation failed",
        success: false,
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    // IDOR check: ensure logged in recruiter owns this company
    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "Access forbidden: You can only update companies you created",
        success: false,
      });
    }

    const { name, description, website, location } = req.body;
    if (name) company.companyName = name;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      if (fileUri) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
          folder: "job_portal_logos",
        });
        company.logo = cloudResponse.secure_url;
      }
    }

    await company.save();

    return res.status(200).json({
      message: "Company updated successfully",
      company,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};