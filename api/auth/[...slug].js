import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getPool } from "../_db.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback-secret-for-dev-only", {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  // Parse the route: /api/auth/signup, /api/auth/login, etc.
  const { slug } = req.query;
  const action = Array.isArray(slug) ? slug[0] : slug;

  try {
    if (action === "signup") {
      return await handleSignup(req, res);
    } else if (action === "login") {
      return await handleLogin(req, res);
    } else if (action === "forgotPassword") {
      return await handleForgotPassword(req, res);
    } else {
      return res.status(404).json({ status: "error", message: "Route not found" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    const message = error?.code === "EAUTH" || error?.responseCode === 534
      ? "Gmail requires an App Password. Create one for EMAIL_USER and put it in EMAIL_PASS."
      : error.message || "Server error";
    return res.status(error?.code === "EAUTH" || error?.responseCode === 534 ? 503 : 500).json({ status: "error", message });
  }
}

async function handleSignup(req, res) {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return res.status(400).json({ status: "error", message: "Name, valid email, and a password of at least 8 characters are required" });
  }
  const pool = getPool();
  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);
  if (existing.length) {
    return res.status(400).json({ status: "error", message: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await pool.query("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)", [newUser._id, name.trim(), normalizedEmail, hashedPassword]);

  const token = signToken(newUser._id);
  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({ status: "success", token, data: { user: userSafe } });
}

async function handleLogin(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Please provide email and password" });
  }

  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email.trim().toLowerCase()]);
  const user = rows[0] && { ...rows[0], _id: rows[0].id };

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ status: "error", message: "Incorrect email or password" });
  }

  const token = signToken(user._id);
  const { password: _, ...userSafe } = user;
  return res.status(200).json({ status: "success", token, data: { user: userSafe } });
}

async function handleForgotPassword(req, res) {
  const { default: nodemailer } = await import("nodemailer");
  const { default: crypto } = await import("crypto");

  const { email } = req.body || {};
  if (!email?.trim()) {
    return res.status(400).json({ status: "error", message: "Email is required" });
  }
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email.trim().toLowerCase()]);
  const user = rows[0] && { ...rows[0], _id: rows[0].id };

  if (!user) {
    return res.status(404).json({ status: "error", message: "There is no user with that email address." });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await pool.query("UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?", [user.passwordResetToken, user.passwordResetExpires, user.id]);

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  const defaultUrl = `${protocol}://${host}`;
  const configuredAppUrl = process.env.APP_URL?.trim();
  const baseUrl = configuredAppUrl && configuredAppUrl !== "MY_APP_URL" ? configuredAppUrl : defaultUrl;
  const resetURL = `${baseUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
  if (!emailUser || !emailPass) {
    return res.status(503).json({ status: "error", message: "Email service is not configured on the server." });
  }

  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: emailPort,
    secure: emailPort === 465,
    auth: { user: emailUser, pass: emailPass },
  });

  await transporter.sendMail({
    from: `EduMatch Pro <${emailUser}>`,
    to: user.email,
    subject: "Your password reset token (valid for 10 min)",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Click the button below to set a new password. This link is valid for 10 minutes.</p>
        <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
      </div>
    `,
  });

  return res.status(200).json({ status: "success", message: "Token sent to email!" });
}
