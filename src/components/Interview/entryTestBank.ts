export interface EntryTestQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const generateMathematicsQuestions = (): EntryTestQuestion[] => {
  const qs: EntryTestQuestion[] = [];
  const operations = [
    { name: 'integral of x^2', ans: '(x^3)/3 + C', wrong: ['2x', 'x^2 + C', '(x^2)/2 + C'] },
    { name: 'derivative of sin(x)', ans: 'cos(x)', wrong: ['-sin(x)', '-cos(x)', 'sec^2(x)'] },
    { name: 'derivative of ln(x)', ans: '1/x', wrong: ['e^x', 'x', '1/x^2'] },
    { name: 'integral of e^x', ans: 'e^x + C', wrong: ['xe^x', 'e^x', 'ln(x) + C'] },
    { name: 'limit as x approaches 0 of sin(x)/x', ans: '1', wrong: ['0', 'infinity', 'undefined'] }
  ];

  for (let i = 0; i < 20; i++) {
    for (const op of operations) {
      const val = Math.floor(Math.random() * 10) + 1;
      qs.push({
        id: `math-${i}-${op.name}`,
        category: 'Mathematics',
        question: `What is the ${op.name} evaluated at standard conditions (Variation ${val})?`,
        options: [op.ans, ...op.wrong].sort(() => Math.random() - 0.5),
        correctAnswer: op.ans,
        explanation: `The fundamental theorem of calculus dictates this standard mathematical identity.`
      });
    }
  }
  return qs; // 100 questions
};

const generatePhysicsQuestions = (): EntryTestQuestion[] => {
  const qs: EntryTestQuestion[] = [];
  const principles = [
    { concept: "Newton's Second Law", eq: 'F = ma', w1: 'E = mc^2', w2: 'v = u + at', w3: 'P = IV' },
    { concept: "Ohm's Law", eq: 'V = IR', w1: 'P = Fv', w2: 'F = qvB', w3: 'W = Fd' },
    { concept: 'Kinetic Energy', eq: '1/2 mv^2', w1: 'mgh', w2: '1/2 kx^2', w3: 'mv' }
  ];

  for (let i = 0; i < 34; i++) {
    for (const p of principles) {
      qs.push({
        id: `sci-${i}-${p.concept.replace(/\\s+/g, '')}`,
        category: 'Science',
        question: `Which of the following equations represents ${p.concept}? (Scenario ${i+1})`,
        options: [p.eq, p.w1, p.w2, p.w3].sort(() => Math.random() - 0.5),
        correctAnswer: p.eq,
        explanation: `${p.eq} is the defining mathematical formula for ${p.concept} in classical physics.`
      });
    }
  }
  return qs; // ~100 questions
};

const generateChemistryQuestions = (): EntryTestQuestion[] => {
  const qs: EntryTestQuestion[] = [];
  const elements = [
    { e: 'Carbon', atomic: '6', w1: '12', w2: '14', w3: '8' },
    { e: 'Oxygen', atomic: '8', w1: '16', w2: '6', w3: '10' },
    { e: 'Gold', atomic: '79', w1: '47', w2: '82', w3: '108' }
  ];

  for (let i = 0; i < 34; i++) {
    for (const el of elements) {
      qs.push({
        id: `chem-${i}-${el.e}`,
        category: 'Chemistry',
        question: `What is the atomic number of ${el.e} in the periodic table? (Review ${i+1})`,
        options: [el.atomic, el.w1, el.w2, el.w3].sort(() => Math.random() - 0.5),
        correctAnswer: el.atomic,
        explanation: `The atomic number of ${el.e} is ${el.atomic}, representing the number of protons in its nucleus.`
      });
    }
  }
  return qs; // ~100 questions
};

const generateBiologyQuestions = (): EntryTestQuestion[] => {
  const qs: EntryTestQuestion[] = [];
  const concepts = [
    { q: 'What is the powerhouse of the cell?', a: 'Mitochondria', w1: 'Nucleus', w2: 'Ribosome', w3: 'Endoplasmic Reticulum' },
    { q: 'What carries oxygen in the human blood?', a: 'Hemoglobin', w1: 'White Blood Cells', w2: 'Plasma', w3: 'Platelets' },
    { q: 'What is the basic unit of heredity?', a: 'Gene', w1: 'Protein', w2: 'Cell', w3: 'Tissue' }
  ];

  for (let i = 0; i < 34; i++) {
    for (const c of concepts) {
      qs.push({
        id: `bio-${i}-${c.a}`,
        category: 'Biology',
        question: `${c.q} (Context ${i+1})`,
        options: [c.a, c.w1, c.w2, c.w3].sort(() => Math.random() - 0.5),
        correctAnswer: c.a,
        explanation: `${c.a} is the biological structure responsible for this function.`
      });
    }
  }
  return qs; // ~100 questions
};

const generateEnglishLogicalQuestions = (): EntryTestQuestion[] => {
  const qs: EntryTestQuestion[] = [];
  const logic = [
    { q: 'Select the synonym for "Ephemeral".', a: 'Transient', w1: 'Eternal', w2: 'Permanent', w3: 'Solid' },
    { q: 'If all bloops are razzies and all razzies are lazzies, are all bloops lazzies?', a: 'Yes', w1: 'No', w2: 'Cannot be determined', w3: 'Only some' },
    { q: 'Complete the sequence: 2, 4, 8, 16, ?', a: '32', w1: '24', w2: '64', w3: '20' }
  ];

  for (let i = 0; i < 34; i++) {
    for (const l of logic) {
      qs.push({
        id: `englog-${i}-${l.a}`,
        category: 'Logical Reasoning & English',
        question: `${l.q} (Test ${i+1})`,
        options: [l.a, l.w1, l.w2, l.w3].sort(() => Math.random() - 0.5),
        correctAnswer: l.a,
        explanation: `This relies on fundamental logical deduction and vocabulary rules.`
      });
    }
  }
  return qs; // ~100 questions
};

export const getEntryTestBank = (): EntryTestQuestion[] => {
  const allQs = [
    ...generateMathematicsQuestions(),
    ...generatePhysicsQuestions(),
    ...generateChemistryQuestions(),
    ...generateBiologyQuestions(),
    ...generateEnglishLogicalQuestions()
  ];
  return allQs;
};

export const getRandomEntryTest = (count: number = 15): EntryTestQuestion[] => {
  const bank = getEntryTestBank();
  const shuffled = bank.sort(() => 0.5 - Math.random());
  
  // Ensure we get a mix by picking from the shuffled array
  return shuffled.slice(0, count);
};
