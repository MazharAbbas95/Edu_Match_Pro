import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['University', 'Job', 'ISSB'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  transcript: [{
    question: String,
    answer: String,
    feedback: {
      score: Number,
      strengths: String,
      improvements: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
