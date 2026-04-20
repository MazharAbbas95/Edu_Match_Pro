import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import fs from "fs";

const DB_PATH = "/tmp/users.json";

function getUsers() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch {}
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
  if (req.method !== "PATCH") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const { token } = req.query;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const users = getUsers();
    const user = users.find(
      (u) => u.passwordResetToken === hashedToken && u.passwordResetExpires > Date.now()
    );

    if (!user) {
      return res.status(400).json({ status: "error", message: "Token is invalid or has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    saveUsers(users);

    const jwtToken = signToken(user._id);
    const { password: _, ...userSafe } = user;
    return res.status(200).json({ status: "success", token: jwtToken, data: { user: userSafe } });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ status: "error", message: error.message || "Server error" });
  }
}
