import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Bot, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Loader2,
  FileText
} from 'lucide-react';
import { generateInterviewQuestions, evaluateInterviewAnswer, generateFinalHRFeedback } from './aiService';
import { EntryTestUI } from './EntryTestUI';

type InterviewType = 'University' | 'Job' | 'ISSB';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  feedback?: {
    score: number;
    strengths: string;
    improvements: string;
  };
}

export const InterviewSimulator = () => {
  const [step, setStep] = useState<'selection' | 'chat' | 'results' | 'entry-test'>('selection');
  const [type, setType] = useState<InterviewType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [finalHRFeedback, setFinalHRFeedback] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const startInterview = async (selectedType: InterviewType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnauthorized(true);
      return;
    }

    setUnauthorized(false);
    setType(selectedType);

    if (selectedType === 'University') {
      setStep('entry-test');
      return;
    }

    setStep('chat');
    setIsTyping(true);

    try {
      // Mock session creation locally instead of relying on the backend
      setSessionId(Date.now().toString());

      const generatedQs = await generateInterviewQuestions(selectedType);
      setQuestions(generatedQs);

      const firstQuestion = generatedQs[0];
      setMessages([
        {
          id: 'msg-0',
          role: 'assistant',
          content: `Welcome to your ${selectedType} simulation. I will be your examiner today. Let's start with our first question:\n\n"${firstQuestion}"`
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !sessionId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let evaluation = undefined;
      // Skip instant evaluation for Job and ISSB interviews to simulate a continuous conversation
      if (type !== 'Job' && type !== 'ISSB') {
        evaluation = await evaluateInterviewAnswer(questions[currentQuestionIndex], input, type || '');
      }
      
      const updatedUserMsg = evaluation ? { ...userMsg, feedback: evaluation } : userMsg;
      setMessages(prev => prev.map(m => m.id === userMsg.id ? updatedUserMsg : m));

      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Here's your next question:\n\n"${questions[nextIndex]}"`
        }]);
      } else {
        if (type === 'Job' || type === 'ISSB') {
          // Fetch the final comprehensive review before moving to results
          const allMessagesForEval = [...messages, updatedUserMsg];
          const finalFeedback = await generateFinalHRFeedback(allMessagesForEval, type);
          setFinalHRFeedback(finalFeedback);
        }
        setStep('results');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const calculateAverageScore = () => {
    const scoredMessages = messages.filter(m => m.feedback);
    if (scoredMessages.length === 0) return 0;
    const total = scoredMessages.reduce((acc, m) => acc + (m.feedback?.score || 0), 0);
    return (total / scoredMessages.length).toFixed(1);
  };

  const SelectionCard = ({ t, icon: Icon, desc, titleOverride }: { t: InterviewType, icon: any, desc: string, titleOverride?: string }) => (
    <button
      onClick={() => startInterview(t)}
      className="glass-morphism p-8 rounded-[32px] text-left group hover:bg-blue-600 transition-all duration-500 hover:-translate-y-2 border-white/60"
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
        <Icon className="text-blue-600 group-hover:text-white transition-colors" size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-white transition-colors">{titleOverride || `${t} Interview`}</h3>
      <p className="text-slate-500 text-sm leading-relaxed group-hover:text-blue-100 transition-colors">{desc}</p>
      <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest group-hover:text-white transition-colors">
        Begin Simulation <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {unauthorized && (
          <div className="max-w-2xl mx-auto py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-morphism p-12 rounded-[40px]">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-slate-900 mb-4">Preparation Profile Required</h2>
              <p className="text-slate-500 mb-8 font-medium">To provide personalized behavioral analysis and save your interview transcripts, you need a student profile. Please sign in to proceed.</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth'))}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
              >
                Sign In to Simulate
              </button>
              <button onClick={() => setUnauthorized(false)} className="block w-full mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">Back to Selection</button>
            </motion.div>
          </div>
        )}

        {step === 'selection' && !unauthorized && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1.5 mb-4 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-600/10 rounded-full">
                AI Mock Interviewer
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                Master Your Presentation
              </h1>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium">
                Our AI simulator mimics real-world panel questions and provides instant behavioral feedback to help you refine your responses.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <SelectionCard 
                t="University" 
                icon={GraduationCap} 
                desc="Prepare for entry tests at FAST, IBA, GIKI, and more."
                titleOverride="University Entry Test Preparation"
              />
              <SelectionCard 
                t="Job" 
                icon={Briefcase} 
                desc="Technical and HR round simulations for top corporate firms."
              />
              <SelectionCard 
                t="ISSB" 
                icon={ShieldCheck} 
                desc="Military leadership and psychological testing simulations."
              />
            </div>
          </motion.div>
        )}

        {step === 'entry-test' && type === 'University' && (
          <EntryTestUI onBack={() => {
            setStep('selection');
            setType(null);
          }} />
        )}

        {step === 'chat' && (
          <div className="max-w-4xl mx-auto flex flex-col h-[750px] glass-morphism rounded-[40px] overflow-hidden border-white/60 shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{type} Simulation</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Session</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm ${
                      msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    
                    <div className="space-y-4">
                      <div className={`p-5 rounded-2xl font-medium leading-relaxed shadow-sm ${
                        msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>

                      {msg.feedback && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-morphism p-6 rounded-2xl border-white/60">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Feedback</span>
                            <div className="text-lg font-black text-blue-600">{msg.feedback.score}<span className="text-xs text-slate-400">/10</span></div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                              <div className="text-xs font-semibold text-slate-600">{msg.feedback.strengths}</div>
                            </div>
                            <div className="flex items-start gap-3">
                              <TrendingUp size={16} className="text-blue-500 mt-0.5" />
                              <div className="text-xs font-semibold text-slate-500">{msg.feedback.improvements}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/50 border-t border-slate-100">
              <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your response here..."
                  className="w-full pl-6 pr-16 py-5 rounded-[24px] bg-white border-2 border-transparent focus:border-blue-600 transition-all outline-none font-semibold text-slate-700 shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center mt-4 text-[10px] lowercase font-bold text-slate-400 tracking-widest">Powered by Gemini AI • EduMatch Pro v2.0</p>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="max-w-3xl mx-auto py-20 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-morphism p-12 rounded-[40px] border-white/60">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                {type === 'Job' ? <Briefcase size={40} className="text-blue-600" /> : type === 'ISSB' ? <ShieldCheck size={40} className="text-blue-600" /> : <GraduationCap size={40} className="text-blue-600" />}
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                {type === 'Job' ? 'HR Evaluation Complete' : type === 'ISSB' ? 'ISSB Assessment Complete' : 'Excellent Session!'}
              </h2>
              
              {type !== 'Job' && type !== 'ISSB' && (
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-6 bg-white/60 rounded-3xl border border-white">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Questions</span>
                    <span className="text-2xl font-black text-slate-900">5/5</span>
                  </div>
                  <div className="p-6 bg-white/60 rounded-3xl border border-white">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</span>
                    <span className="text-2xl font-black text-blue-600">{calculateAverageScore()}</span>
                  </div>
                  <div className="p-6 bg-white/60 rounded-3xl border border-white">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                    <span className="text-2xl font-black text-green-600">PASS</span>
                  </div>
                </div>
              )}

              {(type === 'Job' || type === 'ISSB') && finalHRFeedback ? (
                <div className="mb-10 text-left bg-white/80 p-8 rounded-[32px] border-2 border-blue-200 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="flex items-center gap-3 mb-6 text-blue-900 border-b border-blue-100 pb-4 relative z-10">
                    <FileText size={24} className="text-blue-600" />
                    <h3 className="font-black uppercase tracking-[0.2em] text-sm">
                      {type === 'Job' ? 'Official HR Hiring Decision' : 'Official ISSB Recommendation'}
                    </h3>
                  </div>
                  <div className="text-slate-800 leading-relaxed whitespace-pre-line font-medium relative z-10">
                    {finalHRFeedback}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-10">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left">Key AI Recommendations</h4>
                  {messages.filter(m => m.feedback).slice(0, 2).map((m, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/40 rounded-2xl text-left border border-white/50">
                      <TrendingUp className="text-blue-500 shrink-0" size={18} />
                      <p className="text-sm font-semibold text-slate-600 italic">"{m.feedback?.improvements}"</p>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => {
                  setStep('selection');
                  setMessages([]);
                  setCurrentQuestionIndex(0);
                  setFinalHRFeedback(null);
                }}
                className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30"
              >
                Practice Again
              </button>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
