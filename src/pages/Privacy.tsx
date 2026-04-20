import { motion } from "motion/react";
import { Lock, Eye, Database, Server } from "lucide-react";

export const Privacy = () => {
  const sections = [
    {
      icon: <Database className="text-blue-600" size={24} />,
      title: "Information Collection",
      content: "We collect information you provide directly to us when you create an account, complete an assessment, or communicate with us. This includes your name, email address, and educational background."
    },
    {
      icon: <Eye className="text-green-600" size={24} />,
      title: "How We Use Information",
      content: "We use the information we collect to provide, maintain, and improve our services, including personalizing your career recommendations and test preparation materials."
    },
    {
      icon: <Lock className="text-purple-600" size={24} />,
      title: "Data Protection",
      content: "We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information."
    },
    {
      icon: <Server className="text-orange-600" size={24} />,
      title: "Third-Party Disclosure",
      content: "We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice."
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
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-500">Your privacy is our top priority at EduMatch Pro.</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 20 }}
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
