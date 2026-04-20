import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const signToken = (id: string) => {
  const secret: Secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '90d') as any
  };
  return jwt.sign({ id }, secret, options);
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
  const userSafe = { ...user };
  delete userSafe.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user: userSafe }
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: any = new Error('Email already registered');
      error.statusCode = 400;
      return next(error);
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    createSendToken(newUser, 201, res);
  } catch (error: any) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error: any = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    const user: any = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error: any = new Error('Incorrect email or password');
      error.statusCode = 401;
      return next(error);
    }

    createSendToken(user, 200, res);
  } catch (error: any) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = await User.findOne({ email: req.body.email });
    if (!user) {
      const error: any = new Error('There is no user with that email address.');
      error.statusCode = 404;
      return next(error);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `EduMatch Pro <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      text: `Forgot your password? Reset it here: ${resetURL}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Click the button below to set a new password. This link is valid for 10 minutes.</p>
          <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user: any = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      const error: any = new Error('Token is invalid or has expired');
      error.statusCode = 400;
      return next(error);
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error: any) {
    next(error);
  }
};

