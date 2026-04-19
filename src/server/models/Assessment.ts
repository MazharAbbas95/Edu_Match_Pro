import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assessment must belong to a user']
  },
  scores: {
    logic: Number,
    verbal: Number,
    discipline: Number,
    creativity: Number
  },
  suggestions: [{
    title: String,
    industry: String
  }],
  strengths: [String],
  weaknesses: [String],
  topTrait: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Assessment = mongoose.model('Assessment', assessmentSchema);
