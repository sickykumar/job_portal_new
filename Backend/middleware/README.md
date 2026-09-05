# 🛡️ Production Express Middleware Suite

Yeh folder modular, plug-and-play middlewares ka collection hai jise aap **apne kisi bhi Express / Node.js project** me as-is copy-paste karke use kar sakte hain.

---

## 📂 File Directory

| File | Kaam (Purpose) | Required Dependencies |
| :--- | :--- | :--- |
| `isAuthenticated.middleware.js` | Cookie & Header se JWT Token verify karta hai, Role Guard (`authorizeRoles`), aur Hybrid (`optionalAuth`) provide karta hai | `jsonwebtoken`, `cookie-parser` |
| `multer.middleware.js` | Multer memory buffer single/multi file upload handling with 10MB size limits | `multer` |
| `rateLimiter.middleware.js` | DDoS & brute-force protection (General 300/15min, Auth 30/15min, Custom factory) | `express-rate-limit` |
| `cors.middleware.js` | Cross-Origin configuration with cookie support, localhost & production domain allowlist | `cors` |
| `security.middleware.js` | Helmet security HTTP headers (XSS, frameguard, sniff, CORP protection) | `helmet` |
| `validate.middleware.js` | Zod schema request input validator for `body`, `query`, or `params` | `zod` |
| `errorHandler.middleware.js` | Centralized error handler catching duplicate keys (11000), cast errors, and hiding stack in prod | — |
| `notFound.middleware.js` | Universal 404 handler for undefined routes (Express 5 compatible) | — |
| `index.js` | Master barrel file jo saare middlewares ko single import me provide karta hai | — |

---

## 🚀 Dusre Project me Kaise Use Karein (Step-by-Step)

### Step 1: Middleware Folder Copy Karein
Is pure `middleware/` folder ko apne naye project ke `src/` ya root directory me copy karein.

### Step 2: Dependencies Install Karein
Naye project ke terminal me yeh command run karein:
```bash
npm install jsonwebtoken cookie-parser multer express-rate-limit cors helmet zod
```

### Step 3: Environment Variables (.env)
Apne `.env` file me yeh variables add karein:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

### Step 4: `app.js` me Setup Karein
Apne naye project ke `app.js` me middlewares ko is order me lagayein:

```javascript
import express from "express";
import cookieParser from "cookie-parser";

// Middlewares import karein
import {
  securityMiddleware,
  corsMiddleware,
  generalLimiter,
  authLimiter,
  notFoundHandler,
  errorHandler,
} from "./middleware/index.js";

const app = express();

// 1. Security & Core Parsers
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 2. Rate Limiting
app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 4. 404 Catch-All (Routes ke baad)
app.use(notFoundHandler);

// 5. Centralized Error Handler (Sabse aakhri me)
app.use(errorHandler);

export default app;
```

---

## 💡 Route-Level Middleware Usage Examples

### 1. Route Protect Karna (JWT Auth)
```javascript
import { authenticateToken } from "./middleware/isAuthenticated.middleware.js";

// Sirf logged-in user profile dekh sakta hai
router.get("/profile", authenticateToken, getUserProfile);
```

### 2. Role-Based Access Guard (RBAC)
```javascript
import { authenticateToken, authorizeRoles } from "./middleware/isAuthenticated.middleware.js";

// Sirf Admin user delete kar sakta hai
router.delete("/users/:id", authenticateToken, authorizeRoles("admin"), deleteUser);

// Admin aur Recruiter dono access kar sakte hain
router.post("/jobs", authenticateToken, authorizeRoles("recruiter", "admin"), createJob);
```

### 3. File Upload Karna (Single File)
```javascript
import { singleUpload } from "./middleware/multer.middleware.js";

// Form me 'avatar' ya 'resume' field name kuch bhi ho, req.file mil jayega
router.post("/upload-avatar", singleUpload, (req, res) => {
  console.log("Uploaded file buffer:", req.file.buffer);
  res.json({ message: "File uploaded successfully" });
});
```

### 4. Zod Schema Validation
```javascript
import { z } from "zod";
import { validate } from "./middleware/validate.middleware.js";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

router.post("/register", validate(registerSchema, "body"), registerController);
```
