import mongoose from 'mongoose';

const testSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  history: [{
    questionId: mongoose.Schema.Types.ObjectId,
    userAnswer: Number,
    isCorrect: Boolean,
    difficulty: String
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now
  }
});

export const TestSession = mongoose.model('TestSession', testSessionSchema);
