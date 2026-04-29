import { motion } from "motion/react";
import { BookOpen, Target, Users, TrendingUp, CheckCircle2, ShieldCheck, Map, Smartphone, Code } from "lucide-react";

export const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Header Profile */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="relative inline-block mb-6">
              <div className="w-40 h-40 rounded-full border-8 border-white shadow-2xl overflow-hidden mx-auto bg-blue-50">
                <img 
                  src="/mazhar.png" 
                  alt="Mazhar Abbas" 
                  className="w-full h-full object-cover object-[center_10%]"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                Project Lead
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Mazhar Abbas</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              A 4th-semester Bachelor student on a mission to empower students through data-driven career selection, rigorous university entry test preparation, and advanced ISSB interview simulations.
            </p>
          </motion.div>

          {/* Team Members */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center glass-morphism p-8 rounded-[32px] border-white/60 hover:shadow-xl transition-all"
            >
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto bg-blue-50">
                  <img 
                    src="/sadam hussain.jpg.png" 
                    alt="Sadam Hussain" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-md">
                  Team Member
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Sadam Hussain</h3>
              <p className="text-slate-500 text-sm">
                Contributing to the development and success of EduMatch Pro.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center glass-morphism p-8 rounded-[32px] border-white/60 hover:shadow-xl transition-all"
            >
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto bg-blue-50">
                  <img 
                    src="/tayyab akhtar.jpg.png" 
                    alt="Tayyab Akhtar" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shadow-md">
                  Team Member
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Tayyab Akhtar</h3>
              <p className="text-slate-500 text-sm">
                Contributing to the development and success of EduMatch Pro.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="space-y-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Architecture</h2>
            <p className="text-slate-500 mt-2">The 5 Core Modules of EduMatch Pro</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Module 1 */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-morphism p-8 rounded-[32px] border-white/60 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Module 1: Career Intelligence Engine</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">Provides personalized, data-driven career recommendations based on logical reasoning, analytical ability, and behavioral traits.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Career Mapping System (Skills, Demand, Salary)</li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Step-by-step Roadmap Generator</li>
              </ul>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Future Enhancements</span>
                <span className="text-sm text-slate-600">Real-time job market integration & AI advisors.</span>
              </div>
            </motion.div>

            {/* Module 2 */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-morphism p-8 rounded-[32px] border-white/60 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Module 2: Adaptive Test Prep System</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">Delivers structured and personalized test preparation for ISSB, MDCAT, ECAT, and University Entry Tests.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Smart Question Engine (Difficulty-based)</li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Weakness Detection & Study Planner</li>
              </ul>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Future Enhancements</span>
                <span className="text-sm text-slate-600">AI-generated questions & Gamification.</span>
              </div>
            </motion.div>

            {/* Module 3 */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-morphism p-8 rounded-[32px] border-white/60 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Module 3: Interview Simulation Engine</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">Prepares students for real-world interviews through strict, AI-driven role-based mock interviews.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Job, University, and ISSB preparation</li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Content, confidence, and grammar feedback</li>
              </ul>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Future Enhancements</span>
                <span className="text-sm text-slate-600">Video-based analysis & Avatar interviewers.</span>
              </div>
            </motion.div>

            {/* Module 4 */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-morphism p-8 rounded-[32px] border-white/60 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Module 4: Smart CV Builder</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">Enables students to create professional, ATS-optimized CVs with intelligent content suggestions.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> Industry-specific formats</li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> CV Scoring System (ATS compatibility)</li>
              </ul>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Future Enhancements</span>
                <span className="text-sm text-slate-600">LinkedIn integration & Portfolio builder.</span>
              </div>
            </motion.div>
          </div>

          {/* Module 5 Full Width */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-morphism p-8 md:p-12 rounded-[40px] border-white/60 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Module 5: Concept Clarifier Engine</h3>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">Strengthens conceptual understanding in core subjects (Math, Physics, Programming) through multi-language explanations (Urdu + Simple English) and step-by-step logical breakdowns.</p>
            <div className="inline-block bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs mr-3">Future</span>
              <span className="text-sm font-medium text-slate-700">Visual simulations & Interactive AI tutor</span>
            </div>
          </motion.div>
        </div>

        {/* Strategy & Roadmap Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Map size={20} className="text-blue-600" /> Simplified User Flow
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 font-medium text-sm">
              <li>User registers</li>
              <li>Completes assessment (Career Engine)</li>
              <li>Receives career roadmap</li>
              <li>Chooses preparation path (Test/Skill)</li>
              <li>Uses CV Builder & Interview Simulator</li>
              <li>Tracks progress via dashboard</li>
            </ol>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <ShieldCheck size={20} className="text-green-600" /> Competitive Advantage
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl"><CheckCircle2 className="text-green-500 w-5 h-5" /> Integrated system (not fragmented tools)</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl"><CheckCircle2 className="text-green-500 w-5 h-5" /> AI-driven personalization</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl"><CheckCircle2 className="text-green-500 w-5 h-5" /> Pakistan-focused data</li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl"><CheckCircle2 className="text-green-500 w-5 h-5" /> Covers full student lifecycle</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 md:col-span-2">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
              <Code size={20} className="text-purple-600" /> Development Roadmap & Monetization
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-sm">Freemium Model</h4>
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50 p-4 rounded-xl">
                    <span className="block text-xs font-bold text-slate-400 mb-2">FREE TIER</span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Basic career test</li>
                      <li>• Limited questions</li>
                      <li>• Basic CV templates</li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <span className="block text-xs font-bold text-blue-600 mb-2">PREMIUM TIER</span>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Advanced analytics</li>
                      <li>• Interview simulations</li>
                      <li>• Rs. 300 - 800/month</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">P1</div>
                  <div className="flex-1 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">Career Intelligence Engine (MVP)</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">P2</div>
                  <div className="flex-1 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">Test Preparation Module</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-sm">P3</div>
                  <div className="flex-1 text-sm font-medium text-slate-700 border-b border-slate-100 pb-2">CV Builder + Interview System</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">P4</div>
                  <div className="flex-1 text-sm font-medium text-slate-500">Full AI integration & Mobile app</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
