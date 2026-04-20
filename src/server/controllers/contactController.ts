import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const sendContactEmail = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

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
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`, // Most providers require 'from' to be the authenticated user
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
    // Only attempt to send if credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } else {
      console.warn("\x1b[33m%s\x1b[0m", "WARNING: Email credentials not configured. Message logged to console instead.");
    }

    res.status(200).json({
      status: "success",
      message: "Message received successfully"
    });
  } catch (error) {
    console.error("Error sending email:", error);
    // Even if email fails, we return success if we logged it (so user isn't stuck), 
    // or we can return error if we want them to know delivery failed.
    // Let's return error but ensure we logged the content.
    res.status(500).json({
      status: "error",
      message: "Failed to send email, but your message has been logged. Please contact us directly if urgent."
    });
  }
};
