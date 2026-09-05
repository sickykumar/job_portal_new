import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root of project is parent of Backend/
const projectRoot = path.resolve(__dirname, "../..");

const IGNORED_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  ".gemini",
  ".vscode",
  "build",
  ".DS_Store",
  "package-lock.json",
  ".env",
  ".env.local"
]);

// Known descriptions map for domain knowledge
const KNOWN_DESCS = {
  "Backend/": "Node.js & Express 5 API Gateway, Controllers, Mongoose Models, and Background Automation",
  "frontend/": "Vite v8 + React 18 Single Page Application styled with Tailwind CSS v3",
  "automation/": "Background worker queues, candidate matcher, and autonomous schedulers",
  "controllers/": "Business logic and API request handlers",
  "middleware/": "Route security, authentication guards, and file upload processing",
  "models/": "Mongoose 9 database schemas and compound indexes",
  "routes/": "REST API route definitions",
  "utils/": "Helper libraries, formatters, and Zod validators",
  "components/": "Domain-grouped atomic React UI components",
  "context/": "Global state management providers (Auth, Theme, Toast)",
  "pages/": "Complete route views and role-tailored dashboards",
  "admin/": "Super Admin console tabs, moderation panels, and overview metrics",
  "candidate/": "Candidate dashboard cards, resume viewer, and opportunities widget",
  "recruiter/": "Recruiter hiring funnel, job cards, and opportunities hub",
  "pipeline/": "Kanban pipeline, candidate status decisions, and interview scheduler",
  "ai-coach/": "Conversational career coach, interview simulator, and salary strategist",
  "ats/": "ATS resume score engine, STAR bullet optimizer, and keyword gap analyzer",
  "footer/": "Universal responsive footer, navigation links, and legal modals",
  "jobAlert/": "Automated email alert subscriptions and preferences modal",
  "post-job/": "Job & internship posting forms with active duration controls",
  "profile/": "User profile editor, verified skill badges, and recruiter KYC",
  "company/": "Company registry, branding editor, and employer profiles",
  "common/": "Universal navbar, sidebar, error boundary, and cyber loader",
};

const getSmartDescription = (name, relativePath, isDir) => {
  if (KNOWN_DESCS[name]) return KNOWN_DESCS[name];
  if (KNOWN_DESCS[relativePath]) return KNOWN_DESCS[relativePath];

  if (isDir) {
    if (name.includes("admin")) return "Administrative console components and tools";
    if (name.includes("candidate")) return "Candidate-facing modules and workflows";
    if (name.includes("recruiter")) return "Recruiter pipeline and candidate tools";
    return `Directory containing ${name} resources`;
  }

  // Files
  if (name.endsWith(".controller.js")) return `API request controller for ${name.replace(".controller.js", "")}`;
  if (name.endsWith(".model.js")) return `Mongoose 9 data schema for ${name.replace(".model.js", "")}`;
  if (name.endsWith(".route.js")) return `REST API route definitions for ${name.replace(".route.js", "")}`;
  if (name.endsWith(".service.js")) return `Background service worker for ${name.replace(".service.js", "")}`;
  if (name.endsWith(".test.js")) return `Automated test suite for ${name.replace(".test.js", "")}`;
  if (name === "Hackathons.jsx") return "Hackathon discovery, team registration, and prize arena";
  if (name === "SkillQuizzes.jsx") return "Interactive timed skill assessment quizzes and verified badges";
  if (name === "Internships.jsx") return "Curated internship portal with stipend filters and 1-click apply";
  if (name === "ArchitectureDiagram.jsx") return "Interactive 6-tier system architecture visualization";
  if (name === "FolderStructure.jsx") return "Interactive live codebase directory tree and ASCII blueprint";
  if (name === "AdminOpportunitiesTab.jsx") return "Admin management for hackathons, quizzes, and internships";
  if (name === "RecruiterOpportunitiesHub.jsx") return "Recruiter hub to post internships, host hackathons & create quizzes";
  if (name === "CandidateOpportunitiesWidget.jsx") return "Candidate dashboard widget for hackathons, badges & internships";
  if (name === "app.js") return "Express 5 application setup, security middleware, and REST routes";
  if (name === "server.js") return "Server bootstrap, database connection, and graceful lifecycle management";
  if (name === "index.js") return "Express 5 application entry point";
  if (name === "package.json") return "Project manifest, build scripts, and dependencies";
  if (name === "AGENTS.md") return "Complete master architecture & feature changelog";
  if (name === "README.md") return "Project introduction and quick start guide";

  return `Source file for ${name}`;
};

const buildTree = (dirPath, relPath = "", depth = 0) => {
  if (depth > 6) return [];
  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  // Sort directories first, then files alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() === b.isDirectory()) return a.name.localeCompare(b.name);
    return a.isDirectory() ? -1 : 1;
  });

  const children = [];

  for (const entry of entries) {
    if (IGNORED_NAMES.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".gitignore") continue;

    const fullPath = path.join(dirPath, entry.name);
    const childRel = relPath ? `${relPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const subChildren = buildTree(fullPath, childRel, depth + 1);
      children.push({
        name: entry.name + "/",
        path: childRel,
        type: "folder",
        desc: getSmartDescription(entry.name + "/", childRel + "/", true),
        children: subChildren,
      });
    } else {
      let size = 0;
      try {
        size = fs.statSync(fullPath).size;
      } catch {}
      children.push({
        name: entry.name,
        path: childRel,
        type: "file",
        size,
        desc: getSmartDescription(entry.name, childRel, false),
      });
    }
  }

  return children;
};

// Generates ASCII Tree string
const buildAsciiTree = (nodes, prefix = "") => {
  let ascii = "";
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const marker = isLast ? "└── " : "├── ";
    ascii += `${prefix}${marker}${node.name}\n`;
    if (node.children && node.children.length > 0) {
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      ascii += buildAsciiTree(node.children, childPrefix);
    }
  });
  return ascii;
};

// Count files and folders
const countNodes = (nodes) => {
  let files = 0;
  let folders = 0;
  for (const node of nodes) {
    if (node.type === "folder") {
      folders++;
      if (node.children) {
        const sub = countNodes(node.children);
        files += sub.files;
        folders += sub.folders;
      }
    } else {
      files++;
    }
  }
  return { files, folders };
};

router.get("/codebase-tree", (req, res) => {
  try {
    const rawTree = buildTree(projectRoot);
    const ascii = `Job Portal/\n` + buildAsciiTree(rawTree);
    const stats = countNodes(rawTree);

    res.status(200).json({
      success: true,
      scannedAt: new Date().toISOString(),
      stats: {
        totalFiles: stats.files,
        totalFolders: stats.folders,
      },
      tree: rawTree,
      ascii,
    });
  } catch (error) {
    console.error("Codebase tree scan error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to scan codebase structure",
      error: error.message,
    });
  }
});

export default router;
