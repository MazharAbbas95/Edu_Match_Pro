import { useState, useEffect } from 'react';
import { AssessmentWizard } from './AssessmentWizard';
import { AssessmentResults } from './AssessmentResults';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export const CareerAssessment = () => {
  const [step, setStep] = useState<'wizard' | 'analyzing' | 'results'>('wizard');
  const [results, setResults] = useState<any>(null);

  const handleAssessmentComplete = (answers: { category: string; score: number }[]) => {
    setStep('analyzing');

    // Simulate the 10-second backend analysis
    setTimeout(() => {
      // 1. Calculate totals per category
      const scores: Record<string, number> = {};
      answers.forEach(ans => {
        scores[ans.category] = (scores[ans.category] || 0) + ans.score;
      });

      // 2. Identify top category
      const sortedCategories = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'General';

      // 3. Generate Mock Suggestion Data based on top category
      const categoryProfiles: Record<string, any> = {
        'AI': {
          title: 'AI Engineer / Data Scientist', industry: 'Technology',
          strengths: ['Analytical Thinking', 'Pattern Recognition', 'Future-oriented'],
          weaknesses: ['May overcomplicate simple problems', 'Needs to improve communication of complex ideas'],
          resources: [
            { name: "DeepLearning.AI (Coursera)", type: "Course", desc: "Foundational AI & Neural Networks by Andrew Ng." },
            { name: "Kaggle", type: "Platform", desc: "Practice datasets and machine learning competitions." },
            { name: "Hands-On Machine Learning (Book)", type: "Book", desc: "A practical guide to ML using Scikit-Learn and TensorFlow." }
          ]
        },
        'Business': {
          title: 'Entrepreneur / Strategy Consultant', industry: 'Business & Finance',
          strengths: ['Leadership', 'Strategic Vision', 'Negotiation'],
          weaknesses: ['Prone to burnout', 'Can be impatient with execution details'],
          resources: [
            { name: "Harvard Business Review", type: "Reading", desc: "Case studies and insights on modern management." },
            { name: "Y Combinator Startup School", type: "Course", desc: "Free resources on how to start and scale a company." },
            { name: "The Lean Startup (Book)", type: "Book", desc: "Core methodology for modern entrepreneurship." }
          ]
        },
        'LLB': {
          title: 'Corporate Lawyer / Legal Advisor', industry: 'Law',
          strengths: ['Attention to Detail', 'Logical Reasoning', 'Debate'],
          weaknesses: ['Can be overly critical', 'May struggle with ambiguity'],
          resources: [
            { name: "Harvard Law (edX)", type: "Course", desc: "Introduction to contracts, jurisprudence, and legal reasoning." },
            { name: "LSAT Prep (Khan Academy)", type: "Practice", desc: "Official logic and analytical reasoning practice." },
            { name: "Thinking, Fast and Slow (Book)", type: "Book", desc: "Understanding cognitive biases crucial for litigation." }
          ]
        },
        'Agriculture': {
          title: 'AgriTech Specialist / Farm Manager', industry: 'Agriculture',
          strengths: ['Systems Thinking', 'Environmental Awareness', 'Practical execution'],
          weaknesses: ['Resistance to rapid non-tested changes', 'Highly dependent on physical variables'],
          resources: [
            { name: "Wageningen University (edX)", type: "Course", desc: "Advanced courses on sustainable agriculture." },
            { name: "AgFunderNews", type: "Publication", desc: "Latest news in global agriculture technology." },
            { name: "Permaculture Design Certification", type: "Certification", desc: "Hands-on sustainable ecosystem design." }
          ]
        },
        'Software Development': {
          title: 'Full-Stack Developer / Systems Architect', industry: 'Technology',
          strengths: ['Problem Solving', 'System Design', 'Persistence'],
          weaknesses: ['Can get stuck in "tutorial hell"', 'Sometimes neglects user-experience (UX)'],
          resources: [
            { name: "The Odin Project", type: "Course", desc: "A massive, free, open-source curriculum for full-stack web dev." },
            { name: "LeetCode", type: "Platform", desc: "Master algorithms and data structures." },
            { name: "Clean Code (Book)", type: "Book", desc: "A handbook of agile software craftsmanship." }
          ]
        },
        'Mathematics': {
          title: 'Quantitative Analyst / Actuary', industry: 'Finance & Research',
          strengths: ['High Numerical Literacy', 'Abstract Reasoning', 'Precision'],
          weaknesses: ['Struggles with highly subjective topics', 'Perfectionism'],
          resources: [
            { name: "MIT OpenCourseWare", type: "Course", desc: "Free university-level linear algebra and calculus." },
            { name: "Brilliant.org", type: "Platform", desc: "Interactive problem solving in logic and math." },
            { name: "Society of Actuaries (SOA)", type: "Certification", desc: "Exam prep materials for actuarial science." }
          ]
        },
        'Science': {
          title: 'Research Scientist / Laboratory Director', industry: 'Research & Development',
          strengths: ['Empirical Analysis', 'Curiosity', 'Methodical approach'],
          weaknesses: ['Can be slow to make decisions without full data', 'Isolated work habits'],
          resources: [
            { name: "Nature / Science Journals", type: "Publication", desc: "Stay updated with global breakthrough research." },
            { name: "Data Analysis with Python (Coursera)", type: "Course", desc: "Essential data handling skills for modern labs." },
            { name: "A Brief History of Time (Book)", type: "Book", desc: "Inspirational foundational reading for physics." }
          ]
        },
        'Biology': {
          title: 'Biomedical Researcher / Geneticist', industry: 'Healthcare',
          strengths: ['Deep understanding of complex systems', 'Patience', 'Observation'],
          weaknesses: ['Overwhelmed by vast interconnected variables', 'Requires strict laboratory boundaries'],
          resources: [
            { name: "Genomic Data Science (Coursera)", type: "Course", desc: "Learn to analyze next-generation sequencing data." },
            { name: "Bioinformatics (Rosalind)", type: "Platform", desc: "Learn bioinformatics through problem solving." },
            { name: "The Immortal Life of Henrietta Lacks", type: "Book", desc: "Essential reading on medical ethics." }
          ]
        }
      };

      const profile = categoryProfiles[topCategory] || categoryProfiles['Software Development'];

      const finalData = {
        scores,
        suggestions: [
          { title: profile.title, industry: profile.industry },
          { title: 'Project Manager', industry: 'Management' } // Secondary fallback
        ],
        strengths: profile.strengths,
        weaknesses: profile.weaknesses,
        topTrait: topCategory,
        resources: profile.resources
      };

      setResults(finalData);
      setStep('results');
    }, 10000); // 10 seconds analyzing
  };

  const reset = () => {
    setResults(null);
    setStep('wizard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 'wizard' && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentWizard onComplete={handleAssessmentComplete} />
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative">
              <div className="w-32 h-32 border-4 border-blue-100 rounded-full animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mt-8 mb-2">Analyzing Responses</h2>
            <p className="text-slate-500 font-medium">Cross-referencing your aptitude against 8 global career fields...</p>
            <div className="mt-8 w-64 bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: "linear" }}
                className="bg-blue-600 h-full"
              />
            </div>
          </motion.div>
        )}

        {step === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentResults data={results} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
