import { useNavigate } from 'react-router-dom';

export const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden mx-4 my-12 rounded-[40px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to secure your future?</h2>
        <p className="text-blue-100 mb-12 text-lg md:text-xl max-w-2xl mx-auto">
          Join thousands of students who are already using EduMatch Pro to build their dream careers.
        </p>
        <button 
          onClick={() => navigate('/interview')}
          className="group bg-white text-blue-600 px-10 py-5 rounded-full text-xl font-black hover:scale-105 transition-all shadow-2xl active:scale-95 cursor-pointer"
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};
