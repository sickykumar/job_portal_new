import { Hackathon } from "../models/hackathon.model.js";

const DEFAULT_HACKATHONS = [
  {
    title: "NexHire AI Autonomous Agent Hackathon 2026",
    host: "NexHire Labs & Google Cloud",
    bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    prizePool: "₹5,00,000",
    firstPrize: "₹2,50,000 + Google Cloud Credits",
    mode: "Online (Global)",
    startDate: "Sept 15, 2026",
    endDate: "Sept 18, 2026",
    daysLeft: 11,
    participantsCount: 1420,
    tags: ["Autonomous Agents", "LLMs", "Full-Stack", "Multi-Agent"],
    description:
      "Build production-grade autonomous agent applications using LLMs, tool orchestration, and real-time execution graphs. Top 5 teams receive direct interview fast-tracks to partner tech firms.",
    perks: ["Cloud Credits ($500/team)", "Direct Recruiter Visibility", "Mentorship from Staff AI Engineers"],
    status: "Registration Open",
  },
  {
    title: "HyperScale FinTech & Web3 Sprint",
    host: "Fintech Guild & Polygon",
    bannerGradient: "from-violet-600 via-purple-600 to-pink-500",
    prizePool: "₹3,50,000",
    firstPrize: "₹1,80,000 + Seed Grant",
    mode: "Hybrid (Bengaluru & Remote)",
    startDate: "Sept 24, 2026",
    endDate: "Sept 26, 2026",
    daysLeft: 20,
    participantsCount: 980,
    tags: ["High-Frequency APIs", "Security", "FinTech", "Zero-Knowledge"],
    description:
      "Solve critical latency and security bottlenecks in modern financial transaction pipelines and decentralized payment rails.",
    perks: ["Seed Investment Opportunity", "Exclusive Swag Pack", "Top Tier Networking"],
    status: "Registration Open",
  },
  {
    title: "CleanCode 2026: 48-Hour Open Innovation Challenge",
    host: "Open Source Collective",
    bannerGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    prizePool: "₹2,00,000",
    firstPrize: "₹1,00,000 + M3 MacBook Pro",
    mode: "100% Remote",
    startDate: "Oct 02, 2026",
    endDate: "Oct 04, 2026",
    daysLeft: 28,
    participantsCount: 640,
    tags: ["Open Source", "Web Dev", "DevTools", "React"],
    description:
      "Create high-impact developer tooling, CLI utilities, and developer ergonomics plugins designed to save 1,000 developer hours.",
    perks: ["GitHub Sponsorship Grant", "Open Source Promotion", "Certificates of Honor"],
    status: "Upcoming",
  },
  {
    title: "HealthTech AI & Computer Vision Marathon",
    host: "BioNova Health Sciences",
    bannerGradient: "from-rose-600 via-amber-600 to-orange-500",
    prizePool: "₹4,00,000",
    firstPrize: "₹2,00,000 + Incubation",
    mode: "Online (Global)",
    startDate: "Oct 12, 2026",
    endDate: "Oct 15, 2026",
    daysLeft: 38,
    participantsCount: 410,
    tags: ["Computer Vision", "HealthTech", "Python", "Deep Learning"],
    description:
      "Leverage medical image models and diagnostic multi-modal AI to improve patient triage accuracy and clinical workflow speed.",
    perks: ["Hospital Pilot Launch", "Clinical Validation Support", "Incubation Space"],
    status: "Upcoming",
  },
];

/**
 * Get all hackathons (auto-seeds database if empty)
 */
export const getHackathons = async (req, res, next) => {
  try {
    let hackathons = await Hackathon.find().sort({ createdAt: -1 });

    if (!hackathons || hackathons.length === 0) {
      await Hackathon.insertMany(DEFAULT_HACKATHONS);
      hackathons = await Hackathon.find().sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      hackathons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register user/team for a hackathon
 */
export const registerHackathon = async (req, res, next) => {
  try {
    const hackathonId = req.params.id;
    const userId = req.id || req.user?._id;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    if (userId) {
      const alreadyRegistered = (hackathon.registeredUsers || []).some(
        (id) => id.toString() === userId.toString()
      );
      if (alreadyRegistered) {
        return res.status(400).json({
          success: false,
          message: "You are already registered for this hackathon.",
        });
      }

      hackathon.registeredUsers.push(userId);
    }

    hackathon.participantsCount = (hackathon.participantsCount || 0) + 1;
    await hackathon.save();

    return res.status(200).json({
      success: true,
      message: "Registration successful! Welcome to the challenge.",
      participantsCount: hackathon.participantsCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new hackathon (Recruiter & Admin only)
 */
export const createHackathon = async (req, res, next) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin" && userRole !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters and administrators can host hackathons.",
      });
    }

    const {
      title,
      host,
      prizePool,
      firstPrize,
      mode = "Online (Global)",
      startDate,
      endDate,
      daysLeft = 14,
      tags = [],
      description,
      perks = [],
    } = req.body;

    if (!title || !host || !prizePool || !firstPrize || !startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required hackathon specifications.",
      });
    }

    const newHackathon = await Hackathon.create({
      title: title.trim(),
      host: host.trim(),
      prizePool: prizePool.trim(),
      firstPrize: firstPrize.trim(),
      mode: mode.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      daysLeft: Number(daysLeft) || 14,
      tags: Array.isArray(tags) ? tags : String(tags).split(",").map((t) => t.trim()).filter(Boolean),
      description: description.trim(),
      perks: Array.isArray(perks) ? perks : String(perks).split(",").map((p) => p.trim()).filter(Boolean),
      status: "Registration Open",
      createdBy: req.id,
      participantsCount: 0,
      registeredUsers: [],
    });

    return res.status(201).json({
      success: true,
      message: "Hackathon challenge created and published successfully!",
      hackathon: newHackathon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a hackathon (Admin or Creator Recruiter)
 */
export const deleteHackathon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found.",
      });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner = hackathon.createdBy?.toString() === req.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only delete hackathons you created.",
      });
    }

    await Hackathon.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Hackathon listing deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get hackathons created by current recruiter or all for admin
 */
export const getMyHackathons = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const query = isAdmin ? {} : { createdBy: req.id };

    const hackathons = await Hackathon.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      hackathons,
    });
  } catch (error) {
    next(error);
  }
};

