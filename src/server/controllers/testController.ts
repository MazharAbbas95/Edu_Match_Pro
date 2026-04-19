import { Request, Response, NextFunction } from 'express';
import { TestQuestion } from '../models/TestQuestion';
import { TestSession } from '../models/TestSession';

export const startTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      const error: any = new Error('Unauthorized');
      error.statusCode = 401;
      return next(error);
    }

    // End any existing incomplete session
    await TestSession.updateMany({ user: userId, isCompleted: false }, { isCompleted: true });

    const session = await TestSession.create({
      user: userId,
      currentDifficulty: 'medium',
      questionsAnswered: 0,
      correctAnswers: 0
    });

    res.status(200).json({ status: 'success', data: session });
  } catch (error) {
    next(error);
  }
};

export const getNextQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const { sessionId } = req.query;

    const session = await TestSession.findOne({ _id: sessionId, user: userId, isCompleted: false });
    if (!session) {
      const error: any = new Error('Active session not found');
      error.statusCode = 404;
      return next(error);
    }

    // Get previous question IDs to avoid repeat in same session
    const answeredIds = session.history.map(h => h.questionId);

    // Fetch a question matching current difficulty
    const results = await TestQuestion.aggregate([
      { 
        $match: { 
          difficulty: session.currentDifficulty, 
          _id: { $nin: answeredIds } 
        } 
      },
      { $sample: { size: 1 } }
    ]);

    let question = results[0];

    // If no more questions of current difficulty, try any difficulty not answered
    if (!question) {
      const backupResults = await TestQuestion.aggregate([
        { 
          $match: { 
            _id: { $nin: answeredIds } 
          } 
        },
        { $sample: { size: 1 } }
      ]);
      question = backupResults[0];
    }

    if (!question) {
      return res.status(200).json({ 
        status: 'success', 
        message: 'No more questions available in bank',
        needsGeneration: true,
        difficulty: session.currentDifficulty
      });
    }

    res.status(200).json({ 
      status: 'success', 
      data: {
        _id: question._id,
        text: question.text,
        options: question.options,
        subject: question.subject,
        difficulty: question.difficulty
      }
    });

  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    const { sessionId, questionId, answerIndex } = req.body;

    const session = await TestSession.findOne({ _id: sessionId, user: userId, isCompleted: false });
    const question = await TestQuestion.findById(questionId);

    if (!session || !question) {
      const error: any = new Error('Session or Question not found');
      error.statusCode = 404;
      return next(error);
    }

    const isCorrect = question.correctIndex === answerIndex;
    
    // Update session state
    session.questionsAnswered += 1;
    if (isCorrect) session.correctAnswers += 1;

    session.history.push({
      questionId: question._id as any,
      userAnswer: answerIndex,
      isCorrect,
      difficulty: question.difficulty
    });

    // Adaptive Logic
    const percentage = (session.correctAnswers / session.questionsAnswered) * 100;
    
    if (session.questionsAnswered >= 3) { // Wait for at least 3 questions to stabilize difficulty
      if (percentage < 50) {
        session.currentDifficulty = 'easy';
      } else if (percentage > 80) {
        session.currentDifficulty = 'hard';
      } else {
        session.currentDifficulty = 'medium';
      }
    }

    // End test after 15 questions
    if (session.questionsAnswered >= 15) {
      session.isCompleted = true;
    }

    await session.save();

    res.status(200).json({
      status: 'success',
      data: {
        isCorrect,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        currentScore: session.correctAnswers,
        totalAnswered: session.questionsAnswered,
        isCompleted: session.isCompleted,
        difficultyChangedTo: session.currentDifficulty
      }
    });

  } catch (error) {
    next(error);
  }
};

export const addQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questions } = req.body; // Array of items
    
    // Using insertMany with ordered: false to skip duplicates silently if they exist
    await TestQuestion.insertMany(questions, { ordered: false });

    res.status(201).json({ status: 'success', message: 'Questions added to bank' });
  } catch (error: any) {
    // Handle duplicate key error manually if needed, or just return success if some were added
    if (error.code === 11000) {
       return res.status(201).json({ status: 'success', message: 'Some questions added, some skipped as duplicates' });
    }
    next(error);
  }
};
