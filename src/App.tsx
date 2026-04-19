import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { CareerAssessment } from "./components/Assessment";
import { AdaptiveTest } from "./components/TestSystem";
import { InterviewSimulator } from "./components/Interview";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { FEATURES, STEPS } from "./constants";

import { About } from "./pages/About";

const Home = ({ navigateTo }: { navigateTo: (path: string) => void }) => (
  <>
    <Hero features={FEATURES} steps={STEPS} onStartAssessment={() => navigateTo('/assessment')} onLearnMore={() => navigateTo('/about')} />
    <Features features={FEATURES} onStartInterview={() => navigateTo('/interview')} />
    <HowItWorks steps={STEPS} />
    <CTA />
  </>
);

export default function App() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    // If it's a legacy page key, map it to a route, otherwise use it directly
    const route = ['home', 'assessment', 'test', 'interview', 'about'].includes(page) 
      ? (page === 'home' ? '/' : `/${page}`) 
      : page;
    navigate(route);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Scroll to top on route change (in a more complex app we'd use a useLocation effect)
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="min-h-screen font-sans text-slate-900 scroll-smooth selection:bg-blue-100 selection:text-blue-900">
      <Navbar onNavigate={handleNavigate} />
      
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home navigateTo={handleNavigate} />} />
          <Route path="/about" element={<About />} />
          <Route path="/assessment" element={<CareerAssessment />} />
          <Route path="/test" element={<AdaptiveTest />} />
          <Route path="/interview" element={<InterviewSimulator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
