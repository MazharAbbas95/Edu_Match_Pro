import { ClipboardCheck, Target, MessageSquare } from "lucide-react";
import { Step } from "../types";

interface HowItWorksProps {
  steps: Step[];
}

export const HowItWorks = ({ steps }: HowItWorksProps) => {
  return (
    <section id="how-it-works" className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-slate-600 mb-10 text-lg">
              Your journey towards a successful career is just three steps away.
            </p>
            
            <div className="space-y-8 text-left">
              {steps.map((item, idx) => (
                <div key={idx} className="flex gap-6 relative">
                  <span className="text-4xl font-black text-blue-600/10 absolute -top-2 left-0 leading-none">
                    {item.step}
                  </span>
                  <div className="relative pl-12">
                    <h4 className="text-lg font-bold mb-1 text-slate-900">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group lg:pl-10">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[40px] blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
            <div className="glass-morphism rounded-[40px] p-10 relative flex flex-col justify-center gap-8 h-full min-h-[480px] border-white/40 shadow-2xl shadow-blue-900/5">
              <div className="flex items-center gap-5 p-6 bg-white/80 rounded-2xl border border-white/60 shadow-sm transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Career Mapping</span>
                  <span className="font-bold text-slate-800 text-lg">Top Fit: Computer Science</span>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 bg-white/80 rounded-2xl border border-white/60 shadow-sm transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Target className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Exam Progress</span>
                  <span className="font-bold text-slate-800 text-lg">ECAT Proficiency: 85%</span>
                </div>
              </div>
              <div className="flex items-center gap-5 p-7 bg-blue-600 text-white rounded-[24px] shadow-2xl shadow-blue-600/40 transform hover:scale-[1.02] transition-all duration-500">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <span className="block text-[12px] font-bold text-blue-100 uppercase tracking-widest mb-1">AI Simulator</span>
                  <span className="text-xl font-black">Mock Interview Ready</span>
                  <span className="block text-[10px] text-blue-200 mt-1">Scheduled for 4:00 PM today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
