import { motion } from "motion/react";
import { Feature, Step } from "../types";

interface HeroProps {
  features: Feature[];
  steps: Step[];
  onStartAssessment?: () => void;
  onLearnMore?: () => void;
}

export const Hero = ({ features, steps, onStartAssessment, onLearnMore }: HeroProps) => {
  return (
    <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left"
        >
          <span className="inline-block px-3 py-1.5 mb-4 text-[12px] font-bold tracking-widest text-blue-600 uppercase bg-blue-600/10 rounded-full">
            Powered by Advanced AI
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 lg:leading-[1.1]">
            Smart Career Guidance & <br className="hidden md:block" />
            Interview Simulation
          </h1>
          <p className="text-lg text-slate-500 mb-8 leading-relaxed">
            Empowering students to unlock their potential through personalized career mapping and rigorous exam and interview simulations.
          </p>
          <button 
            onClick={onStartAssessment}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-md font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            Start Your Journey
          </button>
        </motion.div>

        <div className="flex flex-col gap-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-morphism rounded-[24px] p-8"
          >
            <h2 className="text-[18px] font-bold mb-6 text-slate-900">Core Platform Features</h2>
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm mb-3">
                    {idx === 0 ? "🎯" : idx === 1 ? "⚡" : "💬"}
                  </div>
                  <h3 className="text-[15px] font-bold text-blue-600 mb-2 truncate">{feature.title.split(' ')[0]} Engine</h3>
                  <p className="text-[13px] text-slate-500 leading-tight">
                    {idx === 0 ? "Analyze strengths to map the perfect trajectory." : idx === 1 ? "Focus on your weaknesses for NTS and ECAT." : "Realistic interview practice with feedback loops."}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6 flex-wrap">
              {["NTS", "ECAT", "FAST", "COMSATS", "GAT"].map(tag => (
                <span key={tag} className="text-[10px] bg-white px-2 py-1 rounded-md text-blue-600 border border-white/30 font-bold">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="glass-morphism rounded-[24px] p-8"
          >
            <h2 className="text-[18px] font-bold mb-6 text-slate-900">The Roadmap to Success</h2>
            <div className="grid grid-cols-3 gap-6">
              {steps.map((item, idx) => (
                <div key={idx} className="relative">
                  <span className="text-3xl font-black text-blue-600/10 absolute -top-3 left-0 leading-none">
                    {item.step}
                  </span>
                  <div className="relative pt-4">
                    <h4 className="text-[14px] font-bold mb-1.5 text-slate-900">{item.title}</h4>
                    <p className="text-[12px] text-slate-500 leading-tight">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button onClick={onLearnMore} className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-600/5 transition-colors cursor-pointer">
                Learn More &rarr;
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
