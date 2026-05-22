import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, User, CheckCircle2, AlertCircle, Code2 } from "lucide-react";
import { useAuth } from "../store/AuthStore";

export default function AuthModal() {
  const { showAuthModal, authTab, setAuthTab, closeAuth, login, register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reset = () => { setForm({ name: "", email: "", password: "", confirm: "" }); setError(""); setSuccess(""); };

  const switchTab = (tab: "login" | "register") => { setAuthTab(tab); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (authTab === "register" && form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas."); return;
    }

    setLoading(true);
    const result = authTab === "login"
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);
    setLoading(false);

    if (!result.ok) { setError(result.error ?? "Erreur"); }
    else { setSuccess(authTab === "login" ? "Connexion réussie !" : "Compte créé ! Bienvenue 🎉"); }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/70 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-white/15 bg-[#0d0d20] shadow-2xl shadow-purple-900/40 overflow-hidden">
              {/* Header */}
              <div className="relative p-8 pb-0">
                <button
                  onClick={closeAuth}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-3">
                    <Code2 className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-white">Allyjoph · Alluriel</h2>
                  <p className="text-gray-500 text-xs mt-1">
                    {authTab === "login" ? "Connectez-vous à votre compte" : "Créez votre compte gratuit"}
                  </p>
                </div>

                {/* Onglets */}
                <div className="flex bg-white/5 rounded-xl p-1 mb-6">
                  {(["login", "register"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => switchTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        authTab === tab
                          ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {tab === "login" ? "Connexion" : "Inscription"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                {authTab === "register" && (
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Votre nom complet"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder={authTab === "register" ? "Mot de passe (6 car. min.)" : "Mot de passe"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete={authTab === "login" ? "current-password" : "new-password"}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authTab === "register" && (
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Confirmer le mot de passe"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      required
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
                    />
                  </div>
                )}

                {/* Indicateur force mdp */}
                {authTab === "register" && form.password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          form.password.length >= i * 3
                            ? i <= 1 ? "bg-red-500" : i <= 2 ? "bg-orange-500" : i <= 3 ? "bg-yellow-500" : "bg-green-500"
                            : "bg-white/10"
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      {form.password.length < 6 ? "Trop court" : form.password.length < 9 ? "Acceptable" : form.password.length < 12 ? "Bon" : "Excellent"}
                    </p>
                  </div>
                )}

                {/* Messages */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg> {authTab === "login" ? "Connexion..." : "Création..."}</>
                  ) : (
                    authTab === "login" ? "Se connecter" : "Créer mon compte"
                  )}
                </button>

                {/* Switch tab */}
                <p className="text-center text-xs text-gray-500">
                  {authTab === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
                  <button type="button" onClick={() => switchTab(authTab === "login" ? "register" : "login")}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition">
                    {authTab === "login" ? "S'inscrire" : "Se connecter"}
                  </button>
                </p>

                {authTab === "register" && (
                  <p className="text-center text-xs text-gray-700">
                    En vous inscrivant, vous acceptez nos{" "}
                    <span className="text-gray-500">conditions d'utilisation</span> et notre{" "}
                    <span className="text-gray-500">politique de confidentialité</span>.
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
