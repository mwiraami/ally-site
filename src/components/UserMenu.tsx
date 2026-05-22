import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Download, ChevronDown, Star, Settings } from "lucide-react";
import { useAuth } from "../store/AuthStore";

export default function UserMenu() {
  const { user, logout, openAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuth("login")}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition"
        >
          Connexion
        </button>
        <button
          onClick={() => openAuth("register")}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30 hover:scale-105 transition"
        >
          S'inscrire
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition"
      >
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-xs font-black`}>
          {user.avatar}
        </div>
        <span className="text-sm font-semibold text-white hidden sm:block max-w-[120px] truncate">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/15 bg-[#0d0d20] shadow-2xl shadow-purple-900/40 overflow-hidden z-50"
          >
            {/* Profil */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{user.name}</p>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      user.role === "vip"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    }`}>
                      {user.role === "vip" ? "⭐ VIP" : "Membre"}
                    </span>
                    <span className="text-[10px] text-gray-600">depuis {user.joinedAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/10">
              {[
                { icon: Download, label: "Téléchargements", value: user.downloads },
                { icon: Star, label: "Statut", value: user.role === "vip" ? "VIP" : "Standard" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 bg-[#0d0d20] text-center">
                  <Icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                  <div className="text-white font-bold text-sm">{value}</div>
                  <div className="text-gray-600 text-[10px]">{label}</div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <div className="p-2">
              {[
                { icon: User, label: "Mon profil", action: () => setOpen(false) },
                { icon: Download, label: "Mes téléchargements", action: () => setOpen(false) },
                { icon: Settings, label: "Paramètres", action: () => setOpen(false) },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={() => { action(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <div className="my-1 border-t border-white/10" />
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
