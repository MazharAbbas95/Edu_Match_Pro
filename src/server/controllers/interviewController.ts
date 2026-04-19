import { Request, Response, NextFunction } from 'express';
import { InterviewSession } from '../models/InterviewSession';

export const startInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const { type } = req.body;

    if (!type) {
      const error: any = new Error('Interview type is required');
      error.statusCode = 400;
      return next(error);
    }

    // Deactivate previous active sessions
    await InterviewSession.updateMany({ user: userId, status: 'active' }, { status: 'completed' });

    const session = await InterviewSession.create({
      user: userId,
      type
    });

    res.status(201).json({ status: 'success', data: session });
  } catch (error) {
    next(error);
  }
};

export const saveExchange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const { sessionId, question, answer, feedback } = req.body;

    const session = await InterviewSession.findOne({ _id: sessionId, user: userId, status: 'active' });
    if (!session) {
      const error: any = new Error('Active session not found');
      error.statusCode = 404;
      return next(error);
    }

    session.transcript.push({
      question,
      answer,
      feedback
    });

    if (session.transcript.length >= 5) {
      session.status = 'completed';
    }

    await session.save();

    res.status(200).json({ status: 'success', data: session });
  } catch (error) {
    next(error);
  }
};

export const getLatestInterview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const session = await InterviewSession.findOne({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ status: 'success', data: session });
  } catch (error) {
    next(error);
  }
};
