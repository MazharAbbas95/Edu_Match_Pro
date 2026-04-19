import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EntryTestQuestion, getRandomEntryTest } from './entryTestBank';
import { ArrowRight, Loader2, CheckCircle2, XCircle, AlertTriangle, GraduationCap } from 'lucide-react';

interface EntryTestUIProps {
  onBack: () => void;
}

export const EntryTestUI = ({ onBack }: EntryTestUIProps) => {
  const [step, setStep] = useState<'instructions' | 'exam' | 'analyzing' | 'results'>('instructions');
  const [questions, setQuestions] = useState<EntryTestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});

  useEffect(() => {
    setQuestions(getRandomEntryTest(15));
  }, []);

  const handleStart = () => setStep('exam');

  const handleSelectOption = (opt: string) => {
    if (selectedAnswer !== null) return; // Lock after selection
    const currentQ = questions[currentIndex];
    const isCorrect = opt === currentQ.correctAnswer;

    setSelectedAnswer(opt);
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: { selected: opt, isCorrect }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setStep('analyzing');
      setTimeout(() => {
        setStep('results');
      }, 5000); // 5 seconds wait
    }
  };

  const calculateResults = () => {
    const answersArray = Object.values(answers) as { selected: string; isCorrect: boolean }[];
    const correctCount = answersArray.filter(a => a.isCorrect).length;
    const incorrectCount = answersArray.length - correctCount;

    // Find weak categories
    const categoryScores: Record<string, { total: number; correct: number }> = {};
    questions.forEach(q => {
      const ans = answers[q.id];
      if (!categoryScores[q.category]) categoryScores[q.category] = { total: 0, correct: 0 };
      categoryScores[q.category].total++;
      if (ans?.isCorrect) categoryScores[q.category].correct++;
    });

    const weakCategories = Object.entries(categoryScores)
      .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([cat]) => cat);

    return { correctCount, incorrectCount, weakCategories };
  };

  if (step === 'instructions') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-morphism p-12 rounded-[40px] border-white/60 shadow-xl">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={40} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">University Entry Test</h1>
          <p className="text-lg text-slate-500 mb-8 font-medium leading-relaxed">
            Prepare for FAST, NTS, and ECAT exams. This highly intensive mock test draws from our 500+ past paper question bank.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left space-y-4">
            <h3 className="font-bold text-blue-900 uppercase tracking-widest text-sm flex items-center gap-2">
              <AlertTriangle size={18} /> Test Instructions
            </h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside font-medium">
              <li>The test consists of exactly <strong>15 multiple-choice questions</strong>.</li>
              <li>Questions cover Mathematics, Science, Biology, Chemistry, Logical Reasoning, and English.</li>
              <li><strong>Single Selection:</strong> Once you click an option, it locks instantly.</li>
              <li>Instant feedback will be provided immediately after each selection.</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={onBack} className="px-8 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={handleStart} className="px-12 py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30">
              Start Test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center py-32 h-[60vh]">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-blue-100 rounded-full animate-pulse"></div>
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mt-8 mb-2">Analyzing Test Performance</h2>
        <p className="text-slate-500 font-medium">Calculating accurate subject area proficiencies...</p>
      </div>
    );
  }

  if (step === 'results') {
    const { correctCount, incorrectCount, weakCategories } = calculateResults();
    const total = 15;
    const percentage = (correctCount / total) * 100;
    const dashArray = 251.2; // 2 * pi * r (where r = 40)
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-morphism p-12 rounded-[40px] shadow-2xl border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-8">Final Results</h2>

          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="none" />
              <circle
                cx="50" cy="50" r="40"
                className="text-blue-600 transition-all duration-1000 ease-out"
                strokeWidth="12"
                stroke="currentColor"
                fill="none"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{correctCount}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">of 15</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
              <span className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Correct</span>
              <span className="text-2xl font-black text-green-700">{correctCount}</span>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
              <span className="block text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Incorrect</span>
              <span className="text-2xl font-black text-red-700">{incorrectCount}</span>
            </div>
          </div>

          {weakCategories.length > 0 ? (
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-left mb-8">
              <h3 className="font-bold text-orange-900 uppercase tracking-widest text-sm flex items-center gap-2 mb-3">
                <AlertTriangle size={18} /> Needs Improvement Next Time
              </h3>
              <p className="text-sm text-orange-800 mb-3 font-medium">Your accuracy was below 60% in the following subjects. Focus your revision here:</p>
              <div className="flex flex-wrap gap-2">
                {weakCategories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-orange-200 text-orange-900 text-xs font-bold rounded-lg uppercase">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 p-6 rounded-2xl text-left mb-8">
              <h3 className="font-bold text-green-900 uppercase tracking-widest text-sm flex items-center gap-2">
                <CheckCircle2 size={18} /> Outstanding Performance
              </h3>
              <p className="text-sm text-green-800 mt-2 font-medium">You scored exceptionally well across all tested subjects.</p>
            </div>
          )}

          <button onClick={onBack} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all">
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // EXAM STEP
  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Question {currentIndex + 1} of 15</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentQuestion.category}</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / 15) * 100}%` }}
            className="bg-blue-600 h-full transition-all duration-300"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-morphism p-8 rounded-[32px] min-h-[400px] flex flex-col shadow-xl border-white/60"
        >
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid gap-4 mb-8">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === currentQuestion.correctAnswer;

              let btnClass = "bg-white border-transparent hover:border-blue-100 text-slate-600";

              if (selectedAnswer !== null) {
                if (isSelected) {
                  btnClass = isCorrectOpt
                    ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20"
                    : "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20";
                } else if (isCorrectOpt) {
                  btnClass = "bg-green-50 border-green-200 text-green-700";
                } else {
                  btnClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-50 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold flex justify-between items-center ${btnClass}`}
                >
                  {opt}
                  {selectedAnswer !== null && isSelected && isCorrectOpt && <CheckCircle2 size={20} />}
                  {selectedAnswer !== null && isSelected && !isCorrectOpt && <XCircle size={20} />}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-auto">
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                {selectedAnswer === currentQuestion.correctAnswer ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> : <XCircle className="mt-0.5 shrink-0" size={18} />}
                <div>
                  <span className="font-bold text-sm uppercase tracking-widest block mb-1">
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct' : 'Incorrect'}
                  </span>
                  <p className="text-sm font-medium">{currentQuestion.explanation}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                >
                  {currentIndex === 14 ? "Finish Test" : "Next Question"} <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
