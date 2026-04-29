import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// In Vercel serverless, /tmp is the only writable directory
const DB_PATH = "/tmp/users.json";

function getUsers() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch { }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

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
    return res.status(500).json({ status: "error", message: error.message || "Server error" });
  }
}

async function handleSignup(req, res) {
  const { name, email, password } = req.body;
  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ status: "error", message: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);
  saveUsers(users);

  const token = signToken(newUser._id);
  const { password: _, ...userSafe } = newUser;
  return res.status(201).json({ status: "success", token, data: { user: userSafe } });
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Please provide email and password" });
  }

  const users = getUsers();
  const user = users.find((u) => u.email === email);

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

  const { email } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ status: "error", message: "There is no user with that email address." });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  saveUsers(users);

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  const defaultUrl = `${protocol}://${host}`;
  const resetURL = `${process.env.APP_URL || defaultUrl}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `EduMatch Pro <${process.env.EMAIL_USER}>`,
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
