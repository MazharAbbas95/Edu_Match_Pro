import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  backLink?: string;
}

export const AuthForm = ({ title, subtitle, children, backLink = '/' }: AuthFormProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link 
          to={backLink} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h2 className="text-center text-4xl font-black text-slate-900 tracking-tighter">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-slate-500">
          {subtitle}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-[32px] sm:px-10 border border-white/60">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
