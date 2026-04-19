import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Trophy, Target, AlertTriangle, RefreshCw, Loader2, BookOpen } from 'lucide-react';

interface ResultData {
  scores: Record<string, number>;
  suggestions: { title: string; industry: string }[];
  strengths: string[];
  weaknesses: string[];
  topTrait: string;
  resources?: { name: string; type: string; desc: string }[];
}

interface AssessmentResultsProps {
  data: ResultData;
  onReset: () => void;
}

export const AssessmentResults = ({ data, onReset }: AssessmentResultsProps) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchAIExplanation = async () => {
      setLoadingAI(true);
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
        const prompt = `
          The user took a career assessment for EduMatch Pro.
          Scores (Quantitative): ${JSON.stringify(data.scores)}
          Top suggested career paths: ${data.suggestions.map(s => s.title).join(', ')}
          Core Strengths identified: ${data.strengths.join(', ')}
          Development areas: ${data.weaknesses.join(', ')}
          
          As an elite career coach, provide a deep, highly personalized insight into these results. 
          Break down what their top trait (${data.topTrait}) actually means for their professional future.
          Explicitly connect their highest scores to the suggested careers.
          Provide highly actionable advice on exactly what they should do next to build skills and secure this career path.
          
          IMPORTANT INSTRUCTIONS:
          - Give a detailed, comprehensive analysis (do not artificially limit the length).
          - Structure your response beautifully using clean paragraphs and bullet points using dashes (-).
          - DO NOT use markdown formatting characters like asterisks (**bold**) or hashes (#). Keep the text pure so it renders cleanly.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt
        });

        setExplanation(response.text || "Our AI is currently analyzing your results for deeper insight.");
      } catch (err) {
        console.error("AI Generation Error:", err);
        
        // Provide a highly contextual fallback insight if the AI API fails (e.g., missing API key)
        const fallbackInsight = `Based on your assessment, your dominant aptitude is in ${data.topTrait}. This indicates that your natural cognitive strengths align perfectly with roles like ${data.suggestions.map(s => s.title).join(' or ')}.

Here is a breakdown of what this means for you:
- Your core strengths (${data.strengths.join(', ')}) give you a distinct advantage in this field. You should heavily leverage these traits in interviews and projects.
- However, be mindful of your growth areas (${data.weaknesses.join(', ')}). The best professionals actively work to mitigate these risks.

Actionable Next Steps:
- Review the Recommended Resources below to start building foundational knowledge.
- Focus your immediate learning on bridging the gap between your current skill level and industry expectations.
- Start a hands-on project related to ${data.suggestions[0]?.title || data.topTrait} to solidify your interest.`;

        setExplanation(fallbackInsight);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAIExplanation();
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-600/20 text-white">
          <Trophy size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Assessment Complete!</h1>
        <p className="text-slate-500">We've analyzed your responses to find your optimal path.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Suggested Careers */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-morphism p-8 rounded-[32px]">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <Sparkles size={20} />
              <h2 className="font-black uppercase tracking-tighter text-lg">Personalized AI Insight</h2>
            </div>
            
            <div className="text-slate-700 leading-relaxed min-h-[100px]">
              {loadingAI ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">Consulting Gemini AI...</p>
                </div>
              ) : (
                <p className="whitespace-pre-line">{explanation}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {data.suggestions.map((career, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm hover:shadow-md transition-all group"
              >
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{career.industry}</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight">{career.title}</h3>
              </motion.div>
            ))}
          </div>

          {/* Recommended Resources */}
          {data.resources && (
            <div className="glass-morphism p-8 rounded-[32px]">
              <div className="flex items-center gap-2 mb-6 text-indigo-600">
                <BookOpen size={20} />
                <h2 className="font-black uppercase tracking-tighter text-lg">Recommended Skill Resources</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {data.resources.map((res, idx) => (
                  <div key={idx} className="bg-white/60 p-5 rounded-2xl border border-white flex flex-col hover:bg-white transition-colors">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{res.type}</span>
                    <h4 className="font-bold text-slate-900 mb-2">{res.name}</h4>
                    <p className="text-sm text-slate-500 mt-auto">{res.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: Traits */}
        <div className="space-y-4">
          <div className="glass-morphism p-6 rounded-[24px]">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <Target size={18} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm font-semibold text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg border border-white/30">{s}</li>
              ))}
            </ul>
          </div>

          <div className="glass-morphism p-6 rounded-[24px]">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <AlertTriangle size={18} />
              <h3 className="font-bold text-sm uppercase tracking-widest">Grow Areas</h3>
            </div>
            <ul className="space-y-2">
              {data.weaknesses.map((w, i) => (
                <li key={i} className="text-sm font-semibold text-slate-500 bg-white/50 px-3 py-1.5 rounded-lg border border-white/30">{w}</li>
              ))}
            </ul>
          </div>

          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <RefreshCw size={18} /> Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
