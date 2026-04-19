import { motion } from "motion/react";
import { Feature } from "../types";

interface FeaturesProps {
  features: Feature[];
  onStartInterview?: () => void;
}

export const Features = ({ features, onStartInterview }: FeaturesProps) => {
  return (
    <section id="features" className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful AI Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We've built specialized engines to handle every aspect of your academic transition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                if (feature.title.includes('Interview')) {
                  onStartInterview?.();
                }
              }}
              className="glass-morphism p-8 rounded-[24px] cursor-pointer hover:border-blue-200 transition-colors"
            >
              <div className="mb-6 p-2 bg-white inline-block rounded-xl shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
