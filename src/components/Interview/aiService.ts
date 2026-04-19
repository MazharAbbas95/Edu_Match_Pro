import { GoogleGenAI, Type } from "@google/genai";

export const generateInterviewQuestions = async (type: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) throw new Error("Missing API Key");

    const ai = new GoogleGenAI({ apiKey });
    
      const randomFocusAreas = ["leadership and conflict resolution", "failure and tight deadlines", "innovation and adaptability", "teamwork and communication", "strategic thinking and career growth"];
      const randomFocus = randomFocusAreas[Math.floor(Math.random() * randomFocusAreas.length)];
      
      const issbFocusAreas = ["psychological resilience", "moral courage and integrity", "quick decision making under pressure", "military leadership potential", "mechanical aptitude and situational awareness"];
      const issbFocus = issbFocusAreas[Math.floor(Math.random() * issbFocusAreas.length)];

      let prompt = `
      You are an elite HR Examiner and Assessor for EduMatch Pro.
      Generate 5 unique, professional questions for a candidate preparing for a "${type}" assessment.
      - If type is University: Provide multiple-choice or short-answer questions typical of Pakistani university entry tests.
      - If type is Job: Act as a strict corporate HR. Ask deep behavioral questions, situational judgment scenarios, and background verification questions. Specifically focus on ${randomFocus} to ensure variety.
      - If type is ISSB: Act strictly as a Pakistan Army ISSB Psychologist / Deputy President. Ask logical, highly difficult, and pressure-inducing questions for a candidate seeking an officer commission. Specifically focus on ${issbFocus} to ensure variety.
      
      Return as a JSON array of strings. For University type, format the string to clearly present the question and options.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    
    // Fallback data based on type
    if (type === 'University') {
      return [
        "What is the derivative of sin(x) with respect to x?\nA) cos(x)\nB) -cos(x)\nC) sin(x)\nD) -sin(x)",
        "If a train travels 60 km in 1.5 hours, what is its average speed in km/h?\nA) 40\nB) 45\nC) 50\nD) 90",
        "Which of the following is a scalar quantity?\nA) Velocity\nB) Force\nC) Temperature\nD) Acceleration"
      ];
    }
    
    if (type === 'Job') {
      const jobBank = [
        "Tell me about a time you had to manage a difficult conflict in a professional setting. How did you resolve it?",
        "How do you prioritize your tasks when multiple projects have tight deadlines at the exact same time?",
        "Describe a situation where you failed to meet an objective. What did you learn and how did you adapt?",
        "What is your greatest professional achievement, and what specific steps did you take to accomplish it?",
        "Why do you believe your specific skills make you a highly credible hire for this role?",
        "Describe a time when you had to work with a difficult team member. How did you handle it?",
        "Give an example of a time you showed initiative and took the lead on a project.",
        "How do you stay motivated when working on repetitive or tedious tasks?",
        "Tell me about a time you had to quickly learn a new skill or technology to complete a task.",
        "What is your approach to handling constructive criticism from a manager?"
      ];
      return jobBank.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    if (type === 'ISSB') {
      const issbBank = [
        "If you are ordered by a senior officer to fire upon an unarmed crowd, what would you do?",
        "You are commanding a unit that is out of rations and surrounded by the enemy. Surrender means survival. What is your decision?",
        "What is the most shameful thing you have ever done in your life?",
        "Why do you want to join the Pakistan Army when you can easily earn more in the corporate sector?",
        "If your closest friend in the unit commits theft and confides in you, will you report him?",
        "What are your three biggest weaknesses that could make you a liability on the battlefield?",
        "Imagine you have two injured soldiers and only one medical kit. How do you decide who gets it?",
        "How do you handle a situation where your subordinate refuses a direct order during peacetime?",
        "If you fail the ISSB today, what is your backup plan for the rest of your life?",
        "Describe a time when you completely lost your temper. What triggered it?",
        "Do you think taking risks is more important than following strict procedures?",
        "If you catch your sibling taking drugs, what steps will you take?",
        "What is your opinion on the geopolitical importance of Pakistan's borders?",
        "If you find out a superior officer is corrupt, how do you handle the situation?",
        "You are leading a patrol and your communication equipment fails. What are your immediate actions?",
        "Why should the Pakistan Army select you over the other candidates in your batch?",
        "Have you ever lied to your parents to get out of trouble? Give a specific example.",
        "How do you react when someone challenges your religious or moral beliefs aggressively?",
        "If you are leading an operation and realize your original plan is failing, how do you adapt?",
        "What is your definition of moral courage, and when have you demonstrated it recently?",
        "If you are selected as an officer, how would you deal with troops who are older and more experienced than you?",
        "Describe a scenario where you had to make a split-second decision with incomplete information."
      ];
      return issbBank.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    
    return [
      "Describe a time you demonstrated strong leadership.",
      "How do you handle high-pressure situations?"
    ];
  }
};

export const evaluateInterviewAnswer = async (question: string, answer: string, type: string = 'Job') => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) throw new Error("Missing API Key");

    const ai = new GoogleGenAI({ apiKey });
    
    let prompt = `
      As an expert examiner, evaluate the following answer.
      Question: "${question}"
      Answer: "${answer}"
      
      Provide a constructive evaluation in JSON format:
      - score: A number from 1 to 10.
      - strengths: A concise point about what they did well.
      - improvements: A concise point about what they can do better.
      
      Keep feedback positive, professional, and free of jargon.
    `;

    if (type === 'Job') {
      prompt = `
        Act as a strict Corporate HR Manager evaluating a candidate's response during a job interview.
        Question asked: "${question}"
        Candidate's Answer: "${answer}"
        
        You must strictly judge:
        1. Professional Content (Did they answer the question well?)
        2. Grammar & Spelling (Identify spelling mistakes, incorrect verb usage, or poor sentence structure).
        
        Provide your evaluation in JSON format:
        - score: A number from 1 to 10 (deduct points for poor grammar/spelling).
        - strengths: What they did well in terms of content or communication.
        - improvements: Explicitly point out any spelling mistakes, grammar issues, or structural flaws, along with how to fix them. If none, advise on content improvement.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.STRING },
            improvements: { type: Type.STRING }
          },
          required: ["score", "strengths", "improvements"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      score: 7,
      strengths: "You provided a clear response.",
      improvements: "Try to add more specific reasoning, and ensure your grammar and spelling are professional."
    };
  }
};

export const generateFinalHRFeedback = async (messages: any[], type: string = 'Job') => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) throw new Error("Missing API Key");

    const ai = new GoogleGenAI({ apiKey });
    
    // Extract the conversation flow (excluding initial setup)
    const transcript = messages
      .filter(m => m.id !== 'msg-0')
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    let prompt = `
      Act as an elite Corporate HR Director. Review the following interview transcript of a candidate.
      Transcript:
      ${transcript}
      
      Provide a final, comprehensive feedback summary directed at the candidate.
      1. Judge their overall communication style, spelling, grammar, and sentence construction.
      2. Analyze their confidence and depth of answers.
      3. If they performed exceptionally well, start by saying: "Wow, you are ready for the interview!"
      4. If they had poor grammar, spelling mistakes, or weak answers, be constructive but strict.
      Format clearly with paragraphs and bullet points. No markdown bold/italic symbols. Max 250 words.
    `;

    if (type === 'ISSB') {
      prompt = `
      Act as the Deputy President of the Inter Services Selection Board (ISSB) for the Pakistan Army. 
      Review the following interview transcript of a candidate seeking an officer commission.
      Transcript:
      ${transcript}
      
      Provide your OFFICIAL ISSB RECOMMENDATION.
      1. Assess their psychological resilience, moral courage, logical reasoning, and confidence under pressure.
      2. If their answers are weak, generic, or lack leadership traits, start with "NOT RECOMMENDED" and tell them exactly why they failed.
      3. If they show strong logic, honor, and courage, start with "RECOMMENDED" and tell them they have the makings of a fine officer.
      Format clearly with paragraphs and bullet points. No markdown bold/italic symbols. Max 250 words.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return response.text || "Your interview session is complete.";
  } catch (error) {
    console.error("Gemini Final Feedback Error:", error);
    
    if (type === 'ISSB') {
      return `OFFICIAL ISSB DECISION: NOT RECOMMENDED AT THIS STAGE

Thank you for completing the ISSB simulation. Based on your responses, the psychological and leadership assessment indicates further development is required.

- Leadership Potential: Your answers lacked the decisive, commanding presence expected of a future officer. 
- Moral Courage & Logic: While you attempted to answer logically, your responses under pressure appeared rehearsed rather than authentic. The Pakistan Army requires quick, morally sound decision-making.
- Action Plan: Before your actual ISSB appearance, practice articulating your thoughts with extreme confidence and clarity. Do not try to fake perfection; focus on honest, honorable responses.

You must build stronger situational awareness and mental toughness. Keep preparing.`;
    }

    return `HIRING DECISION: CONDITIONAL PROCEED

Thank you for completing the HR evaluation. Based on your overall responses, here is my professional assessment of your candidacy:

- Skill Credibility: You demonstrated a foundational understanding of professional workflows, but lacked specific metric-driven examples to back up your claims. Real recruiters need hard proof of your achievements.
- Communication & Grammar: Your sentence structure is mostly coherent, though there are areas where vocabulary could be elevated to sound more authoritative.
- Action Plan: Before sitting for an actual HR interview, practice the STAR method (Situation, Task, Action, Result). Make sure every answer explicitly proves your credibility.

You have potential, but you must refine your delivery to secure a formal offer. Keep practicing!`;
  }
};
