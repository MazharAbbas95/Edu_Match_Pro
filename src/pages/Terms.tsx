import { motion } from "motion/react";
import { Shield, FileText, Scale, Clock } from "lucide-react";

export const Terms = () => {
  const sections = [
    {
      icon: <FileText className="text-blue-600" size={24} />,
      title: "Acceptance of Terms",
      content: "By accessing or using EduMatch Pro, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: "Use License",
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on EduMatch Pro's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      icon: <Scale className="text-purple-600" size={24} />,
      title: "Disclaimer",
      content: "The materials on EduMatch Pro's website are provided on an 'as is' basis. EduMatch Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability."
    },
    {
      icon: <Clock className="text-orange-600" size={24} />,
      title: "Limitations",
      content: "In no event shall EduMatch Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EduMatch Pro's website."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-lg text-slate-500">Last Updated: April 20, 2026</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-morphism p-8 rounded-[32px] border-white/60 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </div>
  );
};
