import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
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
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

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

    // 1) Check if email and password exist
    if (!email || !password) {
      const error: any = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await (user as any).comparePassword(password))) {
      const error: any = new Error('Incorrect email or password');
      error.statusCode = 401;
      return next(error);
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (error: any) {
    next(error);
  }
};
