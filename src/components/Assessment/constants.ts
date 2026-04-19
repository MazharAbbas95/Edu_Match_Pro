export interface Question {
  id: number;
  text: string;
  category: 'logic' | 'verbal' | 'discipline' | 'creativity';
  options: { text: string; score: number }[];
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'logic',
    text: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
    options: [
      { text: "True", score: 5 },
      { text: "False", score: 1 },
      { text: "Not enough information", score: 2 }
    ]
  },
  {
    id: 2,
    category: 'logic',
    text: "Complete the sequence: 2, 6, 12, 20, ...",
    options: [
      { text: "28", score: 1 },
      { text: "30", score: 5 },
      { text: "32", score: 2 }
    ]
  },
  {
    id: 3,
    category: 'verbal',
    text: "Which word is most nearly the opposite of 'Meticulous'?",
    options: [
      { text: "Careless", score: 5 },
      { text: "Detailed", score: 1 },
      { text: "Fast", score: 2 }
    ]
  },
  {
    id: 4,
    category: 'verbal',
    text: "I enjoy explaining complex ideas to people who don't understand them.",
    options: [
      { text: "Strongly Agree", score: 5 },
      { text: "Neutral", score: 3 },
      { text: "Disagree", score: 1 }
    ]
  },
  {
    id: 5,
    category: 'discipline',
    text: "I prefer working in a high-stakes environment with clear hierarchy and rules.",
    options: [
      { text: "Strongly Agree", score: 5 },
      { text: "Agreement", score: 4 },
      { text: "Neutral", score: 2 },
      { text: "Disagree", score: 1 }
    ]
  },
  {
    id: 6,
    category: 'discipline',
    text: "How do you handle deadlines?",
    options: [
      { text: "Finish well in advance", score: 5 },
      { text: "Finish on the day", score: 3 },
      { text: "Finish last minute", score: 1 }
    ]
  },
  {
    id: 7,
    category: 'creativity',
    text: "I am constantly looking for new ways to express my ideas visually or through storytelling.",
    options: [
      { text: "Always", score: 5 },
      { text: "Often", score: 4 },
      { text: "Rarely", score: 1 }
    ]
  },
  {
    id: 8,
    category: 'creativity',
    text: "When faced with a technical problem, I prefer to find a unique, unconventional solution.",
    options: [
      { text: "Yes", score: 5 },
      { text: "Sometimes", score: 3 },
      { text: "Prefer sticking to proven methods", score: 1 }
    ]
  },
  {
    id: 9,
    category: 'logic',
    text: "A box has 3 red balls and 2 blue balls. What is the probability of picking a blue ball?",
    options: [
      { text: "40%", score: 5 },
      { text: "60%", score: 1 },
      { text: "50%", score: 2 }
    ]
  },
  {
    id: 10,
    category: 'verbal',
    text: "If you were to write a book, what would it be about?",
    options: [
      { text: "A technical guide or manual", score: 3 },
      { text: "A fictional novel with deep character growth", score: 5 },
      { text: "A collection of facts", score: 2 }
    ]
  }
];
