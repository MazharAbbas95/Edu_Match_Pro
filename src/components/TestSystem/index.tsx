import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateECATQuestions } from './aiService';
import { ArrowRight, Loader2, CheckCircle2, XCircle, Trophy } from 'lucide-react';

export const AdaptiveTest = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  // Auth token helper (assume stored in localStorage from login)
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const startNewSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnauthorized(true);
      setIsLoading(false);
      return;
    }
    setUnauthorized(false);
    setIsLoading(true);
    try {
      const res = await fetch('/api/test/start', { 
        method: 'POST', 
        headers: getHeaders() 
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSessionId(data.data._id);
        fetchNextQuestion(data.data._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextQuestion = async (sid: string) => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setFeedback(null);
    
    try {
      const res = await fetch(`/api/test/next?sessionId=${sid}`, { headers: getHeaders() });
      const data = await res.json();
      
      if (data.needsGeneration) {
        setIsGenerating(true);
        // Fallback to Gemini if bank is dry for this difficulty
        const subjects = ['math', 'logic', 'english'];
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const newQs = await generateECATQuestions(data.difficulty, randomSubject);
        
        if (newQs.length > 0) {
          await fetch('/api/test/questions', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ questions: newQs })
          });
          // Try again
          fetchNextQuestion(sid);
        }
        setIsGenerating(false);
      } else if (data.data) {
        setCurrentQuestion(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;
    
    try {
      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion._id,
          answerIndex: selectedAnswer
        })
      });
      const data = await res.json();
      setFeedback(data.data);
      setProgress((data.data.totalAnswered / 15) * 100);
      
      if (data.data.isCompleted) {
        setResults(data.data);
        setIsFinished(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    startNewSession();
  }, []);

  if (unauthorized) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism p-12 rounded-[40px]">
          <XCircle size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">Account Required</h2>
          <p className="text-slate-500 mb-8 font-medium">To provide adaptive tracking and scoring, we require a registered student profile. Please sign in or create an account to start your preparation.</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth'))}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            Sign In to Start
          </button>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass-morphism p-12 rounded-[40px]">
          <Trophy size={64} className="text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Test Completed!</h1>
          <div className="text-5xl font-black text-blue-600 mb-6">{results.currentScore} / 15</div>
          <p className="text-slate-500 mb-8 font-medium italic">"Your ability to adapt to {results.difficultyChangedTo} difficulty questions shows great progress."</p>
          <button onClick={startNewSession} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
            Review Answers or Retake
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Adaptive Entry Test</span>
          <span className="text-xs font-bold text-slate-400">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading || isGenerating ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="glass-morphism h-[400px] rounded-[32px] flex flex-col items-center justify-center text-center p-8"
          >
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">{isGenerating ? "AI is generating new challenges..." : "Loading Next Challenge..."}</h3>
            <p className="text-slate-500 text-sm max-w-xs">Generating ECAT-style questions in real-time based on your recent performance.</p>
          </motion.div>
        ) : currentQuestion && (
          <motion.div
            key={currentQuestion._id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-10 rounded-[40px] border-white/60 shadow-2xl shadow-blue-900/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{currentQuestion.subject}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                currentQuestion.difficulty === 'hard' ? 'bg-red-50 text-red-600' : 
                currentQuestion.difficulty === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-10">{currentQuestion.text}</h2>

            <div className="grid gap-4">
              {currentQuestion.options.map((opt: string, idx: number) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = feedback?.correctIndex === idx;
                const isWrong = feedback && selectedAnswer === idx && !isCorrect;
                
                return (
                  <button
                    key={idx}
                    disabled={!!feedback}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all group relative flex items-center justify-between font-bold ${
                      isSelected ? 'border-blue-600 bg-blue-50/50 shadow-lg' : 'border-transparent bg-white hover:border-blue-100'
                    } ${isCorrect ? 'border-green-500 bg-green-50/50' : ''} ${isWrong ? 'border-red-500 bg-red-50/50' : ''}`}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                    {isWrong && <XCircle size={20} className="text-red-600" />}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm">
                <span className="font-bold underline mb-2 block not-italic">Explanation:</span>
                {feedback.explanation || "Solving this requires applying fundamental concepts of " + currentQuestion.subject + "."}
              </motion.div>
            )}

            <div className="mt-10 flex justify-end">
              {!feedback ? (
                <button
                  disabled={selectedAnswer === null}
                  onClick={submitAnswer}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  Submit Answer <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => fetchNextQuestion(sessionId!)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                >
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
