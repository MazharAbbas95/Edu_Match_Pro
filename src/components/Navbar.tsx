import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth";

export const Navbar = ({ 
  onNavigate 
}: { 
  onNavigate?: (page: string) => void 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
    };
    
    // Listen to custom auth-change event
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    if (onNavigate) onNavigate('/');
    else navigate('/');
    setIsMenuOpen(false);
  };

  const navTo = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full glass-morphism z-50 border-none px-4">
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center cursor-pointer" onClick={() => navTo('home')}>
            {/* Custom SVG Logo matching the user's uploaded image */}
            <svg width="56" height="56" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              {/* Graduation Cap Top */}
              <path d="M15 50L60 32L105 50L60 68L15 50Z" fill="#254A8D" />
              {/* Cap Base */}
              <path d="M30 56V75C30 75 60 92 90 75V56" fill="#254A8D" />
              {/* Cap Tassel String */}
              <path d="M22 52V70" stroke="#254A8D" strokeWidth="4" strokeLinecap="round" />
              <circle cx="22" cy="74" r="4" fill="#254A8D" />
              {/* Magnifying Glass Lens (Teal) */}
              <circle cx="82" cy="62" r="16" fill="white" stroke="#37B4A6" strokeWidth="8" />
              {/* Magnifying Glass Handle (Purple) */}
              <path d="M70 74L45 88" stroke="white" strokeWidth="12" strokeLinecap="round" />
              <path d="M70 74L45 88" stroke="#703494" strokeWidth="6" strokeLinecap="round" />
              {/* Handle Bulb */}
              <circle cx="42" cy="90" r="8" fill="#703494" stroke="white" strokeWidth="3" />
            </svg>
            <div className="flex items-center tracking-tight font-extrabold text-[28px] mt-1">
              <span style={{ color: '#254A8D' }}>Edu Match</span>
              <span style={{ color: '#703494' }} className="ml-1.5">Pro</span>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navTo('home')} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">Platform</button>
            <button onClick={() => navTo('interview')} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">Exam & Interview Sim</button>
            <button onClick={() => navTo('assessment')} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-lg">Career Assessment</button>
            
            {user ? (
              <div className="flex items-center gap-6 border-l pl-8 border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{user.name?.split(' ')[0] || 'USER'}</span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-slate-600 focus:outline-none"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-morphism border-none mt-2 rounded-2xl overflow-hidden p-6 space-y-4 mb-4"
          >
            <button onClick={() => navTo('home')} className="block w-full text-left text-slate-700 font-bold py-2">Platform</button>
            <button onClick={() => navTo('interview')} className="block w-full text-left text-slate-700 font-bold py-2">Exam & Interview Sim</button>
            <button onClick={() => navTo('assessment')} className="block w-full text-left text-blue-600 font-bold py-2">Career Assessment</button>
            <div className="pt-4 border-t border-slate-100">
              {user ? (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  <button onClick={handleLogout} className="text-red-500 text-sm font-bold">Log Out</button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold block text-center mt-2"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
