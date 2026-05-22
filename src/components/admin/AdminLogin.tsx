import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Code2, AlertCircle, ShieldCheck } from "lucide-react";

// Le mot de passe est encodé en base64 pour ne pas apparaître en clair dans le code.
// Pour changer le mot de passe : btoa("votre_mot_de_passe") dans la console du navigateur.
const ADMIN_HASH = "YWxseWpvcGgyMDI2"; // allyjoph2026

function checkPassword(input: string): boolean {
  try {
    return btoa(input) === ADMIN_HASH;
  } catch {
    return false;
  }
}

type Props = {
  onSuccess: () => void;
};

export default function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;

    setLoading(true);
    setError(false);

    // Délai simulé anti-brute-force
    await new Promise((res) => setTimeout(res, 800));

    if (checkPassword(password)) {
      sessionStorage.setItem("ally_admin_auth", "1");
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setPassword("");
      if (newAttempts >= 5) {
        setLocked(true);
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
        }, 30000); // Blocage 30 secondes après 5 tentatives
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Décor */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-purple-900/30">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-4">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Allyjoph Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Panneau d'administration sécurisé</p>
          </div>

          {/* Badge accès restreint */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-6">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span>Accès restreint · Administrateur uniquement</span>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••••••"
                  disabled={locked || loading}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    error
                      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60"
                      : "border-white/15 focus:ring-purple-500/20 focus:border-purple-500/60"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  disabled={locked || loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-200 transition disabled:opacity-40"
                  aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && !locked && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Mot de passe incorrect. ({attempts}/5 tentatives)
              </motion.div>
            )}

            {/* Verrouillé */}
            {locked && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm"
              >
                <Lock className="w-4 h-4 flex-shrink-0" />
                Accès temporairement bloqué. Réessayez dans 30 secondes.
              </motion.div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={locked || loading || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Vérification...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Accéder au panneau
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-xs mt-6">
            © {new Date().getFullYear()} Allyjoph Alluriel Business
          </p>
        </div>
      </motion.div>
    </div>
  );
}
