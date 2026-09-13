import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ override: true });

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, '');
const recipient = process.env.EMAIL_TEST_TO?.trim() || emailUser;
const emailPort = Number(process.env.EMAIL_PORT || 587);

function fail(message: string): never {
  console.error(`Email configuration error: ${message}`);
  process.exit(1);
}

if (!emailUser) fail('EMAIL_USER is missing from .env.');
if (!emailPass) fail('EMAIL_PASS is missing from .env.');
if (!/^[A-Za-z0-9]{16}$/.test(emailPass)) {
  fail('EMAIL_PASS must be the 16-character Gmail App Password without spaces.');
}
if (!recipient) fail('Set EMAIL_TEST_TO or configure EMAIL_USER.');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const message = {
  from: `EduMatch Pro <${emailUser}>`,
  to: recipient,
  subject: 'EduMatch Pro SMTP test',
  text: 'Your EduMatch Pro Gmail SMTP configuration is working.',
};

transporter.sendMail(message, (error, info) => {
  if (error) {
    if (error.code === 'EAUTH' || error.responseCode === 534 || error.responseCode === 535) {
      console.error('SMTP authentication failed: use a valid Gmail App Password for EMAIL_USER.');
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.error(`SMTP transport failed: ${error.message}`);
    } else {
      console.error(`Email send failed: ${error.message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Email sent successfully. Message ID: ${info.messageId}`);
});