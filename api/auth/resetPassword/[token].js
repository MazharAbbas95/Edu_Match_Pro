import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getPool } from "../../_db.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback-secret-for-dev-only", {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
}

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const tokenValue = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;
    const { password } = req.body || {};

    if (!tokenValue || !password || password.length < 8) {
      return res.status(400).json({ status: "error", message: "A valid token and password of at least 8 characters are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(tokenValue).digest("hex");
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW() LIMIT 1", [hashedToken]);
    const user = rows[0] && { ...rows[0], _id: rows[0].id };

    if (!user) {
      return res.status(400).json({ status: "error", message: "Token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await pool.query("UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?", [user.password, user.id]);

    const jwtToken = signToken(user._id);
    const { password: _, ...userSafe } = user;
    return res.status(200).json({ status: "success", token: jwtToken, data: { user: userSafe } });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ status: "error", message: error.message || "Server error" });
  }
}
