"use client";

import { motion } from "framer-motion";

const statCards = [
  { label: "Active Members", value: "2,418", delta: "+12%", icon: "group" },
  { label: "Open Tickets", value: "34", delta: "-8%", icon: "support_agent" },
  { label: "Today Sessions", value: "128", delta: "+4%", icon: "event_available" },
  { label: "Revenue", value: "$84.2K", delta: "+18%", icon: "payments" },
];

export default function AdminDashboardSection({ activeSection }) {
  if (activeSection !== "Dashboard") {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-10 lg:py-12 custom-scrollbar pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-[#071952]/5"
          >
            <h2 className="text-3xl font-black text-[#071952] uppercase italic tracking-tighter">
              {activeSection}
            </h2>
            <p className="mt-3 text-[#071952]/60 font-medium max-w-2xl">
              This section is wired into the admin shell and is ready for future
              content.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 lg:py-12 custom-scrollbar pb-28">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
            Admin <span className="text-[#088395]">Overview</span>
          </h2>
          <p className="text-[#071952]/40 font-bold text-xs uppercase tracking-[0.3em]">
            Operations, usage, and platform health
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#071952]/5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f2f3f6] flex items-center justify-center text-[#088395]">
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {card.delta}
                </span>
              </div>
              <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                {card.label}
              </p>
              <p className="text-3xl font-black text-[#071952]">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-[3rem] p-8 shadow-2xl border border-[#071952]/5"
          >
            <h3 className="text-xl font-black text-[#071952] uppercase italic mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                "New member signup approved",
                "Weekly revenue report generated",
                "3 support tickets resolved",
                "Schedule sync completed",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-[#f2f3f6] px-5 py-4">
                  <span className="text-sm font-bold text-[#071952]">{item}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#071952]/35 font-black">Live</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#071952] rounded-[3rem] p-8 shadow-2xl text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#088395]/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-[#35a29f] mb-4">
              System Health
            </p>
            <h3 className="relative z-10 text-3xl font-black uppercase italic leading-tight">
              All services stable
            </h3>
            <p className="relative z-10 mt-4 text-white/70 text-sm leading-6">
              This is a placeholder admin dashboard shell with the same structure
              and navigation rhythm as the home page.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
