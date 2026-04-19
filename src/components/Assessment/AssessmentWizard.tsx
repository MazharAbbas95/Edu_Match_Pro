import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getRandomAssessmentSet, Question } from './questionBank';
import { ArrowRight, ArrowLeft, Loader2, Clock, AlertTriangle } from 'lucide-react';

interface AssessmentWizardProps {
  onComplete: (answers: { category: string; score: number }[]) => void;
}

const GLOBAL_TIME_LIMIT = 50 * 60; // 50 minutes in seconds
const MCQ_TIME_LIMIT = 100; // 100 seconds per MCQ

export const AssessmentWizard = ({ onComplete }: AssessmentWizardProps) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { category: string; score: number }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timers
  const [globalTimeLeft, setGlobalTimeLeft] = useState(GLOBAL_TIME_LIMIT);
  const [mcqTimeLeft, setMcqTimeLeft] = useState(MCQ_TIME_LIMIT);
  const [timeoutMessage, setTimeoutMessage] = useState<string | null>(null);

  // Initialize questions on mount
  useEffect(() => {
    setQuestions(getRandomAssessmentSet());
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    const answersArray = Object.values(answers) as { category: string; score: number }[];
    onComplete(answersArray);
  }, [answers, onComplete]);

  const next = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setMcqTimeLeft(MCQ_TIME_LIMIT);
    } else {
      submit();
    }
  }, [currentIndex, questions.length, submit]);

  // Timer logic
  useEffect(() => {
    if (!hasStarted || isSubmitting) return;

    const timerInterval = setInterval(() => {
      setGlobalTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setTimeoutMessage("Global time limit exceeded. Submitting your assessment...");
          submit();
          return 0;
        }
        return prev - 1;
      });

      setMcqTimeLeft((prev) => {
        if (prev <= 1) {
          setTimeoutMessage("Time expired for this question! Moving to next.");
          next();
          return MCQ_TIME_LIMIT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [hasStarted, isSubmitting, next, submit]);

  // Clear timeout message after 3 seconds
  useEffect(() => {
    if (timeoutMessage) {
      const t = setTimeout(() => setTimeoutMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [timeoutMessage]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (score: number) => {
    const currentQuestion = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { category: currentQuestion.category, score }
    }));
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(p => p - 1);
      setMcqTimeLeft(MCQ_TIME_LIMIT); // Reset timer when navigating back (optional design choice)
    }
  };

  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-morphism p-12 rounded-[40px]">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">EduMatch Career Assessment</h1>
          <p className="text-lg text-slate-500 mb-8 font-medium leading-relaxed">
            This core assessment will analyze your aptitude across 8 critical fields: AI, Business, LLB, Agriculture, Software Development, Mathematics, Science, and Biology. Your results will determine your optimal career path.
          </p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left space-y-4">
            <h3 className="font-bold text-blue-900 uppercase tracking-widest text-sm flex items-center gap-2">
              <AlertTriangle size={18} /> Important Instructions
            </h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside font-medium">
              <li>You will face exactly 30 questions randomly selected from our 4000+ question bank.</li>
              <li>You have a strict <strong>50-minute time limit</strong> for the entire assessment.</li>
              <li>Each question has an individual <strong>100-second timer</strong>. If it expires, you will automatically be moved to the next question.</li>
              <li>Ensure you read carefully—your career recommendation depends on this analysis!</li>
            </ul>
          </div>

          <button 
            onClick={() => setHasStarted(true)}
            className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-full font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95"
          >
            Start Assessment Now
          </button>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isCurrentAnswered = !!answers[currentQuestion.id];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Timeout Alert Toast */}
      <AnimatePresence>
        {timeoutMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm"
          >
            <Clock size={16} /> {timeoutMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 space-y-4">
        {/* Timers */}
        <div className="flex justify-between items-center bg-white/50 p-4 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Time Remaining</span>
            <span className={`text-xl font-black ${globalTimeLeft < 300 ? 'text-red-600' : 'text-slate-900'}`}>
              {formatTime(globalTimeLeft)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Timer</span>
            <span className={`text-xl font-black ${mcqTimeLeft < 15 ? 'text-red-600' : 'text-blue-600'}`}>
              0:{mcqTimeLeft.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-blue-600 h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-morphism p-8 rounded-[32px] min-h-[400px] flex flex-col border-white/60"
        >
          <div className="mb-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter mb-4">
              {currentQuestion.category} Analysis
            </span>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="grid gap-3 mt-12">
            {currentQuestion.options.map((opt, idx) => {
              const isActive = answers[currentQuestion.id]?.score === opt.score;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt.score)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]' 
                      : 'bg-white border-transparent hover:border-blue-100 text-slate-600'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          disabled={currentIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
        
        <button
          onClick={next}
          disabled={!isCurrentAnswered || isSubmitting}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-600/20"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : (
            currentIndex === questions.length - 1 ? "Finish Assessment" : <>Next <ArrowRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};
