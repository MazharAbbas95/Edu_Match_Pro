import { Request, Response, NextFunction } from 'express';
import { Assessment } from '../models/Assessment';

export const submitAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answers } = req.body;
    const userId = (req as any).user?._id;

    if (!answers || !Array.isArray(answers)) {
      const error: any = new Error('Invalid assessment data');
      error.statusCode = 400;
      return next(error);
    }

    const scores: Record<string, number> = {
      logic: 0,
      verbal: 0,
      discipline: 0,
      creativity: 0
    };

    answers.forEach((ans: any) => {
      if (scores.hasOwnProperty(ans.category)) {
        scores[ans.category] += ans.score;
      }
    });

    const suggestions = [];
    const strengths = [];
    const weaknesses = [];

    const sortedTraits = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topTrait = sortedTraits[0][0];

    if (scores.logic > 10) {
      suggestions.push({ title: 'Software Engineer', industry: 'Technology' });
      suggestions.push({ title: 'Data Scientist', industry: 'Technology' });
      strengths.push('Analytical Reasoning');
    }
    
    if (scores.verbal > 10) {
      suggestions.push({ title: 'Corporate Lawyer', industry: 'Legal' });
      suggestions.push({ title: 'Business Consultant', industry: 'Business' });
      strengths.push('Effective Communication');
    }

    if (scores.discipline > 10) {
      suggestions.push({ title: 'Military Officer', industry: 'Armed Forces' });
      suggestions.push({ title: 'Operations Manager', industry: 'Logistics' });
      strengths.push('Structural Thinking');
    }

    if (scores.creativity > 10) {
      suggestions.push({ title: 'UI/UX Designer', industry: 'Design' });
      suggestions.push({ title: 'Creative Director', industry: 'Media' });
      strengths.push('Innovative Problem Solving');
    }

    const finalSuggestions = Array.from(new Set(suggestions.map(s => JSON.stringify(s))))
      .map(s => JSON.parse(s))
      .slice(0, 3);

    if (finalSuggestions.length < 3) {
      finalSuggestions.push({ title: 'Project Manager', industry: 'General' });
      if (finalSuggestions.length < 3) finalSuggestions.push({ title: 'Financial Analyst', industry: 'Finance' });
    }

    if (scores.logic < 5) weaknesses.push('Abstract Math');
    if (scores.verbal < 5) weaknesses.push('Public Speaking');
    if (scores.discipline < 5) weaknesses.push('Routine Management');
    if (scores.creativity < 5) weaknesses.push('Visual Expression');

    const resultData = {
      scores,
      suggestions: finalSuggestions,
      strengths: strengths.length > 0 ? strengths : ['General Aptitude'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['None identified'],
      topTrait,
      user: userId
    };

    // Save to DB if user is logged in
    if (userId) {
      await Assessment.create(resultData);
    }

    res.status(200).json({
      status: 'success',
      data: resultData
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) {
      const error: any = new Error('You must be logged in to view your results');
      error.statusCode = 401;
      return next(error);
    }

    const assessment = await Assessment.findOne({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};
