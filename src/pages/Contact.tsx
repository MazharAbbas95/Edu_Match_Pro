import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Send, MapPin, Phone, CheckCircle } from "lucide-react";

export const Contact = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", { 
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Have questions about EduMatch Pro? We're here to help you navigate your career path.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-8 md:p-12 rounded-[40px] border-white/60 shadow-2xl relative overflow-hidden"
          >
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Message Sent!</h2>
                <p className="text-slate-500 max-w-sm">
                  Thank you for reaching out, Mazhar. We've received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    name="subject"
                    required
                    placeholder="How can we help?"
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === "loading" ? "Sending..." : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>

                {status === "error" && (
                  <p className="text-red-500 text-center text-sm font-medium">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
