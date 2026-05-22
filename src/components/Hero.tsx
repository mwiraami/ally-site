import { motion } from "framer-motion";
import { ArrowDown, Download, UserPlus, Sparkles } from "lucide-react";
import { useAuth } from "../store/AuthStore";

const stats = [
  { value: "20+", label: "Projets" },
  { value: "10+", label: "Logiciels" },
  { value: "1.2k+", label: "Utilisateurs" },
  { value: "4.8★", label: "Note" },
];

export default function Hero() {
  const { openAuth, isLoggedIn, user } = useAuth();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Fond dégradé CSS pur */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, #2d1b69 0%, #0a0a1a 70%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 80% 80%, #0e3a4a 0%, transparent 60%)"
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1a]" />

      {/* Orbes animés */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />

      {/* Grille */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Particules */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">

        {/* Badge de bienvenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          {isLoggedIn
            ? `Bienvenue, ${user!.name.split(" ")[0]} 👋 — Accès membre actif`
            : "Inscription gratuite · Accès à tous les logiciels"}
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tight"
        >
          <span className="block">Allyjoph</span>
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent pb-2">
            Alluriel Business
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Plateforme de distribution logicielle professionnelle. Découvrez, téléchargez et suivez
          les mises à jour de mes applications. Créez un compte pour accéder à tout le contenu.
        </motion.p>

        {/* Boutons CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => openAuth("register")}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-base shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                S'inscrire gratuitement
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">Gratuit</span>
              </button>
              <button
                onClick={() => scrollTo("#softwares")}
                className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold text-base hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Voir les logiciels
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => scrollTo("#softwares")}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-base shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger mes logiciels
              </button>
              <button
                onClick={() => scrollTo("#portfolio")}
                className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white font-bold text-base hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Voir mes travaux
              </button>
            </>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto mb-16"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Avatars utilisateurs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex -space-x-2">
            {["from-purple-500 to-pink-500", "from-cyan-500 to-blue-600", "from-green-400 to-emerald-500", "from-orange-400 to-red-500"].map((color, i) => (
              <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} border-2 border-[#0a0a1a] flex items-center justify-center text-white text-[10px] font-bold`}>
                {["JD", "MC", "PK", "AL"][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            <span className="text-white font-semibold">+1 200</span> membres inscrits
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={() => scrollTo("#about")}
          className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400 transition group"
        >
          <span className="text-xs tracking-widest uppercase">Explorer</span>
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
