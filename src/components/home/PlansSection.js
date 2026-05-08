"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePlansStore from "@/stores/home/usePlansStore";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/userAuth";
import { subscriptionsApi } from "@/utils/authApi";
import {
  Check,
  X,
  Star,
  Zap,
  ShieldCheck,
  ArrowRight,
  XCircle,
  Loader2,
  Clock,
} from "lucide-react";

export default function PlansSection({ isReadOnly = false }) {
  const selectedPlan = usePlansStore((state) => state.selectedPlan);
  const openPlan = usePlansStore((state) => state.openPlan);
  const closePlan = usePlansStore((state) => state.closePlan);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: subData } = useSWR(
    isReadOnly ? null : "/api/subscriptions/current",
    fetcher,
  );
  const currentSub = subData?.data;

  const plans = [
    {
      id: "basic",
      title: "Basic",
      tagline: "Casual Athlete",
      price: "29",
      icon: <Zap size={24} />,
      desc: "Perfect for those starting their fitness journey with essential access.",
      features: [
        { text: "Standard Gym Access", included: true },
        { text: "Weekly Basic Programs", included: true },
        { text: "Locker Room Access", included: true },
        { text: "1-on-1 Coaching", included: false },
      ],
      details:
        "Our Basic plan is designed for flexibility. It includes access to all cardio and strength equipment during standard hours. You'll receive a monthly newsletter with workout tips and a digital orientation to get you started safely.",
    },
    {
      id: "pro",
      title: "Pro",
      tagline: "Performance Focused",
      price: "59",
      icon: <ShieldCheck size={24} />,
      badge: "MOST POPULAR",
      desc: "Comprehensive performance tracking and custom nutritional guidance.",
      features: [
        { text: "All Gym Access + Bio-Scans", included: true },
        { text: "Custom Nutritional Tracking", included: true },
        { text: "AI Workout Correction", included: true },
        { text: "Sauna & Steam Room", included: true },
      ],
      details:
        "The Pro tier is our most popular choice. It integrates our advanced AI systems to track your form and biological markers. You'll get a dedicated mobile app dashboard to monitor your progress 24/7.",
    },
    {
      id: "elite",
      title: "Elite",
      tagline: "Ultimate Athlete",
      price: "129",
      icon: <Star size={24} />,
      desc: "The ultimate concierge fitness experience with private coaching.",
      features: [
        { text: "Unlimited 1-on-1 Coaching", included: true },
        { text: "Priority Equipment Booking", included: true },
        { text: "Exclusive Recovery Lounge", included: true },
        { text: "Personal Trainer Chat", included: true },
      ],
      details:
        "Elite members are treated like professional athletes. This includes a dedicated coach who builds your entire lifestyle plan, priority booking for all machines, and access to our private recovery suite featuring cryotherapy.",
    },
  ];

  const handleConfirmTier = async (planId) => {
    setIsSubmitting(true);
    try {
      const response = await subscriptionsApi.apply({
        planId,
        paymentMethod: "Manual/In-Gym", // Default for now
        billingCycle: "Monthly",
      });
      if (response.success) {
        mutate("/api/subscriptions/current");
        closePlan();
      } else {
        alert(response.message || "Failed to apply for plan");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-[#071952] uppercase italic tracking-tighter">
                Training <span className="text-[#088395]">Tiers</span>
              </h2>
              <p className="text-[#071952]/60 font-medium mt-2">
                Select the path that matches your ambition.
              </p>
            </div>

            {currentSub && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-[#088395] rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm"
              >
                <div className="bg-[#088395]/10 p-2 rounded-xl text-[#088395]">
                  {currentSub.status === "Pending" ? (
                    <Clock size={24} />
                  ) : (
                    <ShieldCheck size={24} />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#088395] uppercase tracking-widest">
                    Current Status
                  </p>
                  <h4 className="text-lg font-black text-[#071952] uppercase italic">
                    {currentSub.tier}{" "}
                    <span className="text-sm not-italic font-bold text-[#071952]/40">
                      — {currentSub.status}
                    </span>
                  </h4>
                </div>
              </motion.div>
            )}
          </motion.header>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isActive =
                currentSub?.tier === plan.id && currentSub?.status === "Active";
              const isPending =
                currentSub?.tier === plan.id &&
                currentSub?.status === "Pending";

              return (
                <motion.div
                  key={plan.id}
                  layoutId={`card-${plan.id}`}
                  onClick={() => openPlan(plan)}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-[2.5rem] p-8 border ${isActive ? "border-[#088395] border-2 shadow-lg shadow-[#088395]/10" : "border-[#071952]/5"} shadow-sm cursor-pointer relative overflow-hidden group flex flex-col`}
                >
                  {plan.badge && (
                    <div className="absolute top-6 right-6 bg-[#088395] px-3 py-1 rounded-full text-[9px] font-black text-white tracking-widest uppercase">
                      {plan.badge}
                    </div>
                  )}

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${plan.id === "pro" ? "bg-[#088395] text-white" : "bg-[#f2f3f6] text-[#071952]"}`}
                  >
                    {plan.icon}
                  </div>

                  <h3 className="text-2xl font-black text-[#071952] uppercase italic flex items-center gap-2">
                    {plan.title}
                    {isActive && (
                      <div className="w-2 h-2 bg-[#088395] rounded-full animate-pulse" />
                    )}
                  </h3>
                  <p className="text-[10px] font-bold text-[#088395] uppercase tracking-[0.2em] mb-4">
                    {plan.tagline}
                  </p>
                  <p className="text-sm text-[#071952]/60 mb-8 line-clamp-2">
                    {plan.desc}
                  </p>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#071952] tracking-tighter">
                        ${plan.price}
                      </span>
                      <span className="text-xs font-bold text-[#071952]/30">
                        /mo
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-xl transition-colors ${isActive ? "bg-[#088395] text-white" : "bg-[#071952] text-white group-hover:bg-[#088395]"}`}
                    >
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Detailed View */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePlan}
              className="absolute inset-0 bg-[#071952]/40 backdrop-blur-md"
            />

            <motion.div
              layoutId={`card-${selectedPlan.id}`}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full max-h-[85vh] lg:h-auto"
            >
              {/* Left Side: Brand & Price */}
              <div
                className={`p-12 lg:w-2/5 flex flex-col justify-between ${selectedPlan.id === "pro" ? "bg-[#088395] text-white" : "bg-[#071952] text-white"}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/20 rounded-xl">
                      {selectedPlan.icon}
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">
                      FORGE FITNESS {selectedPlan.title}
                    </span>
                  </div>
                  <h2 className="text-5xl lg:text-6xl font-black uppercase italic leading-none mb-4">
                    {selectedPlan.title}
                  </h2>
                  <p className="text-white/60 font-medium uppercase tracking-widest text-xs">
                    {selectedPlan.tagline}
                  </p>
                </div>

                <div className="mt-12 lg:mt-0">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-6xl font-black tracking-tighter">
                      ${selectedPlan.price}
                    </span>
                    <span className="text-white/40 font-bold uppercase text-sm">
                      per month
                    </span>
                  </div>

                  {currentSub?.tier === selectedPlan.id ? (
                    <div className="w-full py-5 bg-white/10 border-2 border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-center">
                      {currentSub.status === "Pending"
                        ? "Verification Pending"
                        : "Current Active Plan"}
                    </div>
                  ) : (
                    (() => {
                      const tierHierarchy = {
                        free: 0,
                        basic: 1,
                        pro: 2,
                        elite: 3,
                      };
                      const currentTierValue =
                        tierHierarchy[currentSub?.tier] || 0;
                      const requestedTierValue = tierHierarchy[selectedPlan.id];
                      const isDowngrade = currentTierValue > requestedTierValue;

                      return (
                        <button
                          disabled={
                            isReadOnly ||
                            isSubmitting ||
                            currentSub?.status === "Pending" ||
                            isDowngrade
                          }
                          onClick={() => handleConfirmTier(selectedPlan.id)}
                          className="w-full py-5 bg-[#35a29f] hover:bg-white hover:text-[#071952] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3"
                        >
                          {isReadOnly ? (
                            "Read Only Preview"
                          ) : isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : isDowngrade ? (
                            "Downgrade Restriction"
                          ) : (
                            "Confirm Tier"
                          )}
                        </button>
                      );
                    })()
                  )}
                  {currentSub?.status === "Pending" &&
                    currentSub?.tier !== selectedPlan.id && (
                      <p className="text-[10px] text-center mt-3 font-bold text-white/40 uppercase tracking-tighter">
                        Existing pending request found. Please wait for
                        approval.
                      </p>
                    )}
                </div>
              </div>

              {/* Right Side: Features & Details */}
              <div className="p-12 flex-1 overflow-y-auto bg-white custom-scrollbar relative">
                <button
                  onClick={closePlan}
                  className="absolute top-8 right-8 text-[#071952]/20 hover:text-[#071952] transition-colors"
                >
                  <XCircle size={32} />
                </button>

                <section className="mb-10">
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-6">
                    Tier Details
                  </h4>
                  <p className="text-[#071952]/70 leading-relaxed font-medium">
                    {selectedPlan.details}
                  </p>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-6">
                    Included Benefits
                  </h4>
                  <ul className="space-y-4">
                    {selectedPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-4 group">
                        <div
                          className={`p-2 rounded-lg ${feature.included ? "bg-[#35a29f]/10 text-[#35a29f]" : "bg-[#f2f3f6] text-[#071952]/20"}`}
                        >
                          {feature.included ? (
                            <Check size={16} strokeWidth={3} />
                          ) : (
                            <X size={16} />
                          )}
                        </div>
                        <span
                          className={`font-bold text-sm ${feature.included ? "text-[#071952]" : "text-[#071952]/30 line-through"}`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
