import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  title?: string;
  subtitle?: string;
}

const FaqSection: React.FC<FaqSectionProps> = ({
  faqs,
  title = "Часто задаваемые вопросы",
  subtitle = "Ответы на наиболее популярные вопросы о наших услугах"
}) => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24">
      {/* Декоративные элементы */}
      <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
        theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'
      }`} />
      <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
        theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'
      }`} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl mb-6 mx-auto ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white'
                : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 text-gray-900'
            }`}
          >
            <HelpCircle className="w-8 h-8" />
          </motion.div>
          <h2 className={`text-4xl md:text-5xl font-black mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {subtitle}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Градиентная рамка */}
              <div className="absolute inset-0  rounded-[2rem] p-[2px]" />

              {/* Основной контент */}
              <div className={`relative rounded-[2rem] overflow-hidden ${
                theme === 'dark' ? 'bg-neutral-950/80 backdrop-blur-xl border border-neutral-800' : 'bg-white'
              }`}>
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className={`text-lg font-bold pr-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                        : 'bg-gray-900'
                    }`}
                  >
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className={`px-6 pb-6 border-t ${
                    theme === 'dark' 
                      ? 'text-gray-300 border-gray-800' 
                      : 'text-gray-700 border-gray-100'
                  }`}>
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;