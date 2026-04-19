export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-white/20 mt-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[12px] text-slate-500 font-medium">
          &copy; 2026 EduMatch Pro. All Rights Reserved.
        </div>
        <div className="flex gap-8 text-[12px] text-slate-500 font-bold">
          <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Terms</a>
          <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Privacy</a>
          <a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">Contact</a>
        </div>
      </div>
    </footer>
  );
};
