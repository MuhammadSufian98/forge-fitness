"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useContactStore from "@/stores/home/useContactStore";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Globe,
  Clock,
  MessageSquare,
} from "lucide-react";

export default function ContactSection() {
  const isSent = useContactStore((state) => state.isSent);
  const form = useContactStore((state) => state.form);
  const setContactField = useContactStore((state) => state.setContactField);
  const submitContact = useContactStore((state) => state.submitContact);
  const resetContact = useContactStore((state) => state.resetContact);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitContact();
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
              Direct <span className="text-[#088395]">Inquiry</span>
            </h2>
            <p className="text-[#071952]/40 font-bold text-xs uppercase tracking-[0.3em] mt-3">
              Priority Support Channels
            </p>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 1. CONTACT INFO CARDS */}
            <div className="space-y-6">
              {[
                {
                  icon: <Phone size={20} />,
                  label: "Performance Hotline",
                  val: "+92 300 0000000",
                  color: "text-[#088395]",
                },
                {
                  icon: <Mail size={20} />,
                  label: "Elite Support",
                  val: "support@peakform.com",
                  color: "text-[#35a29f]",
                },
                {
                  icon: <MapPin size={20} />,
                  label: "Global HQ",
                  val: "Elite Industrial Zone, PK",
                  color: "text-[#071952]",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-[2rem] border border-[#071952]/5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div
                    className={`p-3 w-fit rounded-xl bg-[#f2f3f6] ${item.color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-black text-[#071952]">
                    {item.val}
                  </p>
                </motion.div>
              ))}

              {/* Operating Hours Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#071952] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#088395]/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h4 className="relative z-10 text-[10px] font-black text-[#35a29f] uppercase tracking-[0.3em] mb-4">
                  Live Facility Status
                </h4>
                <div className="relative z-10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-50 uppercase">
                      Mon - Fri
                    </span>
                    <span className="text-xs font-black italic">24 HOURS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-50 uppercase">
                      Sat - Sun
                    </span>
                    <span className="text-xs font-black italic">
                      06:00 - 22:00
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 2. INTERACTIVE CONTACT FORM */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-[#071952]/5"
                  >
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest ml-2">
                            Your Name
                          </label>
                          <input
                            required
                            value={form.name}
                            onChange={(e) =>
                              setContactField("name", e.target.value)
                            }
                            className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] outline-none transition-all"
                            placeholder="Sufian Hassan"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest ml-2">
                            Request Type
                          </label>
                          <select
                            value={form.requestType}
                            onChange={(e) =>
                              setContactField("requestType", e.target.value)
                            }
                            className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] outline-none appearance-none cursor-pointer"
                          >
                            <option>General Support</option>
                            <option>Corporate Partnership</option>
                            <option>Personal Trainer Request</option>
                            <option>Billing Inquiry</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest ml-2">
                          Message Body
                        </label>
                        <textarea
                          required
                          value={form.message}
                          onChange={(e) =>
                            setContactField("message", e.target.value)
                          }
                          className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] outline-none transition-all min-h-[150px] shadow-inner"
                          placeholder="How can we assist your performance evolution?"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-5 bg-[#071952] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#088395] transition-all shadow-xl shadow-[#071952]/20 flex items-center justify-center gap-3 group"
                      >
                        Transmit Inquiry{" "}
                        <Send
                          size={16}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full bg-white rounded-[3rem] p-12 shadow-2xl flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-[#35a29f]/10 rounded-full flex items-center justify-center text-[#35a29f]">
                      <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-[#071952] uppercase italic">
                        Inquiry Received.
                      </h3>
                      <p className="text-[#071952]/60 font-medium max-w-xs mx-auto">
                        Your request has been logged. An Elite Support
                        Specialist will respond within 4 hours.
                      </p>
                    </div>
                    <button
                      onClick={resetContact}
                      className="px-8 py-3 bg-[#f2f3f6] text-[#071952] rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#071952] hover:text-white transition-all"
                    >
                      New Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
