'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const steps = [
  { 
    num: "01", 
    title: { en: "Discovery", kh: "ការស្វែងយល់" }, 
    desc: { en: "We listen to your needs, understand your goals and define the project scope.", kh: "យើងស្តាប់តម្រូវការរបស់អ្នក យល់ពីគោលដៅរបស់អ្នក និងកំណត់វិសាលភាពនៃគម្រោង។" }
  },
  { 
    num: "02", 
    title: { en: "Design", kh: "ការរចនា" }, 
    desc: { en: "Our UI/UX team creates wireframes and prototypes for your approval.", kh: "ក្រុម UI/UX របស់យើងបង្កើតទម្រង់ដើម និងគំរូសម្រាប់ការយល់ព្រមរបស់អ្នក។" }
  },
  { 
    num: "03", 
    title: { en: "Develop", kh: "ការអភិវឌ្ឍ" }, 
    desc: { en: "Our developers build your product with clean, scalable code.", kh: "អ្នកអភិវឌ្ឍន៍របស់យើងបង្កើតផលិតផលរបស់អ្នកជាមួយនឹងកូដស្អាត និងអាចពង្រីកបាន។" }
  },
  { 
    num: "04", 
    title: { en: "Test", kh: "ការសាកល្បង" }, 
    desc: { en: "We thoroughly test across devices and fix all issues before launch.", kh: "យើងធ្វើការសាកល្បងយ៉ាងល្អិតល្អន់លើគ្រប់ឧបករណ៍ និងជួសជុលបញ្ហាទាំងអស់មុនពេលដាក់ឱ្យដំណើរការ។" }
  },
  { 
    num: "05", 
    title: { en: "Launch", kh: "ការដាក់ឱ្យដំណើរការ" }, 
    desc: { en: "We deploy your product and ensure a smooth, successful launch.", kh: "យើងដាក់ពង្រាយផលិតផលរបស់អ្នក និងធានានូវការដាក់ឱ្យដំណើរការដោយរលូន និងជោគជ័យ។" }
  }
];

export default function HowWeWork() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === 'kh' ? kh : en);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };

  return (
    <section className="relative mt-12 py-20 ">
      <div className="max-w-6xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-[color:var(--color-primary)] mb-6 capitalize tracking-tight"
          >
            {t("How We Work", "របៀបដែលយើងធ្វើការ")}
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-24 h-1 bg-[color:var(--color-secondary)]/30 mx-auto rounded-full origin-center" 
          />
        </div>

        <div className="relative pt-4 pb-10">
          {/* Continuous Horizontal Line cutting exactly through the center of the circles (Desktop) */}
          {/* circle is h-24 (6rem), so center is top-12 (3rem) */}
          <div className="hidden lg:block absolute top-[3rem] left-[10%] right-[5%] h-1.5 bg-[color:var(--color-secondary)]/20 z-0" />

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-4 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center text-center relative group">
                
                {/* Large Background Circle for Number */}
                <div className="w-24 h-24 rounded-full bg-[color:var(--color-primary)] flex justify-center items-center text-white text-2xl font-black mb-8 shadow-md shadow-[color:var(--color-primary)]/20 transition-transform duration-300 group-hover:scale-105 z-10 mx-auto relative cursor-default">
                  {/* Subtle white border inside to match the clean aesthetic */}
                  <div className="absolute inset-2 border-[1.5px] border-white/10 rounded-full" />
                  {step.num}
                </div>

                {/* Primary Title */}
                <h4 className="text-xl font-bold text-[color:var(--color-primary)] mb-4">
                  {t(step.title.en, step.title.kh)}
                </h4>

                {/* Description details provided in the requirements */}
                <p className="text-[color:var(--text-muted)] text-[14.5px] leading-relaxed font-medium px-2 max-w-[16rem] mx-auto min-h-[5rem]">
                  {t(step.desc.en, step.desc.kh)}
                </p>
                
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
