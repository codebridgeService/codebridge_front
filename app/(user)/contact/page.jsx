"use client";
import React, { useState } from "react";
import { motion, AnimatePresence  } from "framer-motion";
import { UserIcon, EnvelopeIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaTiktok, FaTelegram, FaInstagram } from "react-icons/fa";

import { useLanguage } from "../../context/LanguageContext";

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = (en, kh) => (lang === "kh" ? kh : en);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    try {
      const startTime = Date.now();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      // Ensure the loading state is visible for at least 800ms for smooth transition
      const duration = Date.now() - startTime;
      if (duration < 800) {
        await new Promise(resolve => setTimeout(resolve, 800 - duration));
      }

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        // Auto-reset success state after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setStatus("error");
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const socialLinks = [
    { 
      enName: "Facebook Page", 
      khName: "ទំព័រ Facebook",
      icon: FaFacebook, 
      url: "https://www.facebook.com/profile.php?id=61563715387398", 
      color: "text-[#1877F2]",
      bgColor: "bg-[#1877F2]/10",
      borderColor: "border-[#1877F2]/20"
    },
    { 
      enName: "TikTok", 
      khName: "TikTok",
      icon: FaTiktok, 
      url: "https://www.tiktok.com/@code.bridge2026", 
      color: "text-[#000000]",
      bgColor: "bg-[#000000]/5",
      borderColor: "border-[#000000]/10"
    },
    { 
      enName: "Telegram Channel", 
      khName: "តេឡេក្រាម",
      icon: FaTelegram, 
      url: "https://t.me/codebridgee", 
      color: "text-[#26A5E4]",
      bgColor: "bg-[#26A5E4]/10",
      borderColor: "border-[#26A5E4]/20"
    },
    { 
      enName: "Instagram", 
      khName: "Instagram",
      icon: FaInstagram, 
      url: "https://www.instagram.com/codebrigde/", 
      color: "text-[#E4405F]",
      bgColor: "bg-[#E4405F]/5",
      borderColor: "border-[#E4405F]/10"
    },
  ];

  return (
    <motion.section
      className="max-w-4xl mx-auto px-6 py-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-16">
        <motion.h1 
          className="text-3xl lg:text-5xl font-black text-[color:var(--text-main)] mb-6 tracking-tight transition-colors duration-300"
          variants={itemVariants}
        >
          {t("Let's Start a", "តោះចាប់ផ្តើម")} <span className="text-[color:var(--color-primary)]">{t("Conversation", "ការសន្ទនា")}</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-[color:var(--text-muted)] leading-relaxed max-w-2xl mx-auto transition-colors duration-300"
          variants={itemVariants}
        >
          {t(
            "Have a vision? We have the expertise to build it. Reach out today and let's bridge the gap between your ideas and reality.",
            "មានចក្ខុវិស័យមែនទេ? យើងមានជំនាញក្នុងការកសាងវា។ ទាក់ទងមកថ្ងៃនេះ ហើយអនុញ្ញាតឱ្យយើងតភ្ជាប់គំនិតរបស់អ្នកទៅជាការពិត។"
          )}
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Contact Form */}
        <motion.div className="lg:col-span-3 lg:pr-8" variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--text-muted)] group-focus-within:text-[color:var(--color-primary)] transition-colors" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("Full Name", "ឈ្មោះពេញ")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:border-[color:var(--color-primary)] transition-all text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
                required
              />
            </div>

            <div className="relative group">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[color:var(--text-muted)] group-focus-within:text-[color:var(--color-primary)] transition-colors" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("Email Address", "អាសយដ្ឋានអ៊ីមែល")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:border-[color:var(--color-primary)] transition-all text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
                type="email"
                required
              />
            </div>

            <div className="relative group">
              <ChatBubbleBottomCenterTextIcon className="absolute left-4 top-5 h-5 w-5 text-[color:var(--text-muted)] group-focus-within:text-[color:var(--color-primary)] transition-colors" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t("Project Details & Goals", "ព័ត៌មានលម្អិតនៃគម្រោង & គោលដៅ")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:border-[color:var(--color-primary)] transition-all h-40 resize-none text-[color:var(--text-main)] placeholder-[color:var(--text-muted)]/50"
                required
              />
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                type="submit"
                className="relative overflow-hidden flex-grow sm:flex-grow-0 px-10 py-4 bg-[color:var(--color-primary)] text-white font-bold rounded-2xl shadow-lg hover:shadow-[color:var(--color-primary)]/20 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === "sending" || status === "success"}
              >
                <span className={status === "sending" ? "opacity-0" : "opacity-100"}>
                  {status === "success" ? t("Message Sent!", "ផ្ញើរសាររួចហើយ!") : t("Send Message", "ផ្ញើសារ")}
                </span>
                {status === "sending" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div className="lg:col-span-2 space-y-12" variants={itemVariants}>
          <div>
            <h3 className="text-sm font-black text-[color:var(--text-muted)] uppercase tracking-[0.2em] mb-6 transition-colors duration-300">{t("Connect With Us", "តភ្ជាប់ជាមួយយើង")}</h3>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.enName}
                  href={social.url}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] shadow-sm transition-all duration-300 group hover:shadow-md ${social.bgColor} ${social.borderColor}`}
                >
                  <social.icon className={`h-6 w-6 ${social.color}`} />
                  <span className="font-bold text-[color:var(--text-main)] group-hover:text-[color:var(--color-primary)] transition-colors">{t(social.enName, social.khName)}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[color:var(--bg-secondary)] border border-[color:var(--border-main)] relative overflow-hidden group transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[color:var(--color-primary)]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[color:var(--color-primary)]/10 transition-colors" />
            <h4 className="text-lg font-black text-[color:var(--text-main)] mb-2 uppercase tracking-tighter transition-colors duration-300">{t("Fast Response Guarantee", "ការធានាឆ្លើយតបឆាប់រហ័ស")}</h4>
            <p className="text-sm text-[color:var(--text-muted)] leading-relaxed transition-colors duration-300">
              {t(
                "We typically respond to all inquiries via email or social channels within",
                "ជាធម្មតាយើងឆ្លើយតបទៅនឹងរាល់ការសាកសួរតាមរយៈអ៊ីមែល ឬបណ្តាញសង្គមក្នុងរយៈពេល"
              )} <span className="font-bold text-[color:var(--color-primary)]">24 {t("hours or less", "ម៉ោង ឬតិចជាងនេះ")}</span>.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {status === "success" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-md"
               onClick={() => setStatus("idle")}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-[color:var(--bg-main)] p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-[color:var(--border-main)] transition-colors duration-300"
            >
               <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <CheckCircleIcon className="w-10 h-10 text-green-500" />
               </div>
               <h2 className="text-2xl font-black text-[color:var(--text-main)] mb-2 uppercase tracking-tight">
                 {t("Thank You!", "សូមអរគុណ!")}
               </h2>
               <p className="text-[color:var(--text-muted)] font-medium mb-8">
                 {t("Your message has been sent successfully. We'll get back to you soon!", "សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។ យើងនឹងទាក់ទងអ្នកវិញឆាប់ៗនេះ!")}
               </p>
               <button 
                 onClick={() => setStatus("idle")}
                 className="w-full py-4 bg-[color:var(--color-primary)] text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg active:scale-95"
               >
                 {t("Close", "បិទ")}
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
