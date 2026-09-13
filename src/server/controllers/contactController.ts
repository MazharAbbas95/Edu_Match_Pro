import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const sendContactEmail = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {};

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      status: "error",
      message: "Please provide all required fields: name, email, subject, message"
    });
  }

  console.log(`\x1b[36m%s\x1b[0m`, `New Contact Form Submission:`);
  console.log(`From: ${name} (${email})`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);

  // Configure transporter
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
  if (!emailUser || !emailPass) {
    return res.status(503).json({ status: 'error', message: 'Email service is not configured on the server.' });
  }

  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: emailPort,
    secure: emailPort === 465,
    auth: { user: emailUser, pass: emailPass },
  });

  const mailOptions = {
    from: `"${name}" <${emailUser}>`, // Most providers require 'from' to be the authenticated user
    to: "mazharabbasawan95@gmail.com",
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    text: `You have a new message from your website contact form:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    res.status(200).json({
      status: "success",
      message: "Message received successfully"
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    const message = error?.code === 'EAUTH' || error?.responseCode === 534
      ? 'Gmail requires an App Password. Create one for EMAIL_USER and put it in EMAIL_PASS.'
      : error.message || "Failed to send email.";
    res.status(500).json({
      status: "error",
      message
    });
  }
};
