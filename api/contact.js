import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !/^\S+@\S+\.\S+$/.test(email) || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ status: "error", message: "Missing required fields" });
  }

  // 1. Check if variables exist
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
  if (!emailUser || !emailPass) {
    console.error("CRITICAL: EMAIL_USER or EMAIL_PASS not set in Environment Variables");
    return res.status(500).json({ 
      status: "error", 
      message: "Server configuration error. Credentials missing." 
    });
  }

  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: emailPort,
    secure: emailPort === 465,
    auth: { user: emailUser, pass: emailPass },
  });

  const mailOptions = {
    from: `"EduMatch Pro Contact" <${emailUser}>`,
    to: "mazharabbasawan95@gmail.com",
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    text: `Message from ${name} (${email}):\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: "success", message: "Email sent successfully!" });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    const message = error?.code === "EAUTH" || error?.responseCode === 534
      ? "Gmail requires an App Password. Create one for EMAIL_USER and put it in EMAIL_PASS."
      : "Failed to send email. Check your SMTP credentials.";
    return res.status(500).json({ 
      status: "error", 
      message
    });
  }
}
