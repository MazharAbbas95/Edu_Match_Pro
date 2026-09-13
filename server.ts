import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { pool } from "./src/server/db";
import { createServer as createViteServer } from "vite";
import authRoutes from "./src/server/routes/authRoutes";
import assessmentRoutes from "./src/server/routes/assessmentRoutes";
import testRoutes from "./src/server/routes/testRoutes";
import interviewRoutes from "./src/server/routes/interviewRoutes";
import contactRoutes from "./src/server/routes/contactRoutes";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // 1. Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, 
  }));
  app.use(cors());
  app.use(express.json({ limit: '10kb' })); 

  // 2. Logging
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  // 3. Database Connection
  let dbError = "";
  try {
    await pool.query("SELECT 1");
    console.log("Connected to MySQL successfully");
  } catch (err: any) {
    console.error("MySQL connection error:", err);
    dbError = err.message || "Unknown connection error";
    console.error("Set MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, and MYSQL_HOST in .env, then restart the server.");
    return;
  }

  // 4. API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/assessment", assessmentRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/contact", contactRoutes);

  app.get("/api/health", async (req, res) => {
    let databaseConnected = false;
    try { await pool.query("SELECT 1"); databaseConnected = true; } catch { databaseConnected = false; }

    res.json({ 
      status: "success", 
      message: "EduMatch Pro API is operative",
      diagnostics: {
        database_url_configured: !!(process.env.DATABASE_URL || process.env.MYSQL_HOST || process.env.MYSQL_DATABASE),
        email_user_configured: !!process.env.EMAIL_USER,
        email_pass_configured: !!process.env.EMAIL_PASS,
        node_env: process.env.NODE_ENV || 'not set',
        database_connected: databaseConnected,
        database_error: databaseConnected ? null : dbError
      },
      timestamp: new Date().toISOString()
    });
  });

  // 5. Global Error Handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
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
    console.log(`EduMatch Pro Server active at port ${PORT}`);
  });
}

startServer();
