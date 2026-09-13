import { getPool } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    return res.status(200).json({
      status: "success",
      message: "EduMatch Pro API is operative",
      diagnostics: {
        database_connected: true,
        database_configured: Boolean(process.env.DATABASE_URL || (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)),
        email_configured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
        environment: process.env.VERCEL ? "vercel" : "local",
      },
    });
  } catch (error) {
    console.error("Vercel health check failed:", error);
    return res.status(503).json({
      status: "error",
      message: "Database connection failed",
      diagnostics: {
        database_connected: false,
        database_configured: Boolean(process.env.DATABASE_URL || (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)),
        email_configured: Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
        error: error.message,
      },
    });
  }
}