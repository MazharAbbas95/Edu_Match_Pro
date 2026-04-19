import mongoose from 'mongoose';

const testQuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    enum: ['math', 'logic', 'english'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctIndex: {
    type: Number,
    required: true
  },
  explanation: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid duplicates by indexing text
testQuestionSchema.index({ text: 1 }, { unique: true });

export const TestQuestion = mongoose.model('TestQuestion', testQuestionSchema);
