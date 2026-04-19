import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error: any = new Error('You are not logged in! Please log in to get access.');
      error.statusCode = 401;
      return next(error);
    }

    // 2) Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev-only');

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      const error: any = new Error('The user belonging to this token no longer exists.');
      error.statusCode = 401;
      return next(error);
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as any).user = currentUser;
    next();
  } catch (error: any) {
    next(error);
  }
};

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next();

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev-only');
    const currentUser = await User.findById(decoded.id);
    
    if (currentUser) {
      (req as any).user = currentUser;
    }
    next();
  } catch (err) {
    next();
  }
};
