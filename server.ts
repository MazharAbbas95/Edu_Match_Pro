import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import authRoutes from "./src/server/routes/authRoutes";
import assessmentRoutes from "./src/server/routes/assessmentRoutes";
import testRoutes from "./src/server/routes/testRoutes";
import interviewRoutes from "./src/server/routes/interviewRoutes";
import contactRoutes from "./src/server/routes/contactRoutes";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // 1. Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite development
  }));
  app.use(cors());
  app.use(express.json({ limit: '10kb' })); // Body parser with limit

  // 2. Logging
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  // 3. Database Connection (Switched to Local File Database)
  let dbError = "";
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.warn("\x1b[33m%s\x1b[0m", "WARNING: MONGODB_URI is not defined.");
    dbError = "MONGODB_URI is missing";
  } else {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4 to avoid Google Cloud IPv6 issues
      });
      console.log("Connected to MongoDB Atlas successfully");
    } catch (err: any) {
      console.error("MongoDB connection error:", err);
      dbError = err.message || "Unknown connection error";
    }
  }

  // 4. API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/assessment", assessmentRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/contact", contactRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "success", 
      message: "EduMatch Pro API is operative",
      diagnostics: {
        database_url_configured: !!process.env.MONGODB_URI,
        email_user_configured: !!process.env.EMAIL_USER,
        email_pass_configured: !!process.env.EMAIL_PASS,
        node_env: process.env.NODE_ENV || 'not set',
        database_connected: mongoose.connection.readyState === 1,
        database_error: mongoose.connection.readyState === 1 ? null : dbError
      },
      timestamp: new Date().toISOString()
    });
  });

  // 5. Global Error Handling Middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // 6. Vite Integration / Static Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduMatch Pro Server active at http://localhost:${PORT}`);
  });
}

startServer();
