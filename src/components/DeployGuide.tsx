import { useState } from "react";
import { motion } from "framer-motion";
import {
  X, Globe, CheckCircle2, ExternalLink,
  Upload, Zap,
  Monitor, FolderOpen,
} from "lucide-react";

type Props = { onClose: () => void };

const steps = [
  {
    num: 1,
    emoji: "🧑‍💻",
    title: "Créer un compte GitHub",
    subtitle: "Gratuit · 2 minutes",
    color: "from-gray-700 to-gray-900",
    borderColor: "border-gray-600/30",
    bgColor: "bg-gray-800/10",
    icon: Monitor,
    actions: [
      {
        label: "👉 Ouvrir GitHub.com",
        href: "https://github.com/signup",
        primary: true,
      },
    ],
    instructions: [
      { icon: "1️⃣", text: 'Allez sur github.com → cliquez "Sign up"' },
      { icon: "2️⃣", text: "Entrez votre adresse email" },
      { icon: "3️⃣", text: "Créez un mot de passe sécurisé" },
      { icon: "4️⃣", text: 'Choisissez un nom d\'utilisateur (ex: "allyjoph")' },
      { icon: "5️⃣", text: "Confirmez votre email (vérifiez vos spams)" },
    ],
    tip: "💡 GitHub est gratuit et c'est là que votre code sera stocké en ligne.",
  },
  {
    num: 2,
    emoji: "📁",
    title: "Créer un nouveau dépôt",
    subtitle: "Votre espace de stockage en ligne",
    color: "from-blue-600 to-indigo-700",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-900/10",
    icon: FolderOpen,
    actions: [
      {
        label: "👉 Créer un dépôt GitHub",
        href: "https://github.com/new",
        primary: true,
      },
    ],
    instructions: [
      { icon: "1️⃣", text: 'Dans le champ "Repository name" tapez : alluriel-business' },
      { icon: "2️⃣", text: 'Sélectionnez "Public" (obligatoire pour Vercel gratuit)' },
      { icon: "3️⃣", text: '✅ Cochez "Add a README file"' },
      { icon: "4️⃣", text: 'Cliquez le bouton vert "Create repository"' },
    ],
    tip: "💡 Un dépôt = un dossier en ligne qui contient votre site web.",
  },
  {
    num: 3,
    emoji: "⬆️",
    title: "Télécharger & Uploader votre site",
    subtitle: "Envoyer les fichiers sur GitHub",
    color: "from-purple-600 to-violet-700",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-900/10",
    icon: Upload,
    actions: [],
    instructions: [
      { icon: "1️⃣", text: "Sur Arena.ai → cliquez les 3 points (...) en haut → Download / Export pour télécharger votre site" },
      { icon: "2️⃣", text: "Sur GitHub, dans votre dépôt → cliquez \"Add file\" → \"Upload files\"" },
      { icon: "3️⃣", text: "Glissez le fichier index.html téléchargé dans la zone" },
      { icon: "4️⃣", text: 'En bas → cliquez "Commit changes" (bouton vert)' },
      { icon: "5️⃣", text: "✅ Votre code est maintenant sur GitHub !" },
    ],
    tip: "💡 Chaque fois que vous voulez mettre à jour le site, répétez cette étape.",
    altMethod: {
      title: "Méthode alternative — GitHub Desktop",
      desc: "Téléchargez GitHub Desktop (logiciel gratuit) pour synchroniser facilement depuis votre ordinateur.",
      link: "https://desktop.github.com",
      linkLabel: "Télécharger GitHub Desktop",
    },
  },
  {
    num: 4,
    emoji: "⚡",
    title: "Déployer sur Vercel",
    subtitle: "Votre site en ligne en 1 minute",
    color: "from-cyan-500 to-blue-600",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-900/10",
    icon: Zap,
    actions: [
      {
        label: "👉 Aller sur Vercel.com",
        href: "https://vercel.com/signup",
        primary: true,
      },
    ],
    instructions: [
      { icon: "1️⃣", text: 'Sur vercel.com → cliquez "Sign Up" → "Continue with GitHub"' },
      { icon: "2️⃣", text: 'Cliquez "Add New Project" ou "Import Project"' },
      { icon: "3️⃣", text: 'Sélectionnez votre dépôt "alluriel-business"' },
      { icon: "4️⃣", text: 'Laissez tous les paramètres par défaut → cliquez "Deploy"' },
      { icon: "5️⃣", text: "Attendez ~60 secondes ☕" },
      { icon: "✅", text: "Votre site est EN LIGNE !" },
    ],
    tip: "💡 Vercel est 100% gratuit pour les projets personnels. Aucune carte bancaire requise.",
  },
  {
    num: 5,
    emoji: "🌍",
    title: "Votre site est publié !",
    subtitle: "Accessible par tout le monde dans le monde",
    color: "from-green-500 to-emerald-600",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-900/10",
    icon: Globe,
    actions: [],
    instructions: [
      { icon: "🔗", text: "Votre URL : alluriel-business.vercel.app (ou le nom choisi)" },
      { icon: "🔒", text: "HTTPS automatique — cadenas de sécurité inclus" },
      { icon: "📱", text: "Accessible depuis mobile, tablette, ordinateur" },
      { icon: "🌐", text: "Domaine personnalisé possible : allyjoph.com (payant ~10$/an)" },
      { icon: "🔄", text: "Pour mettre à jour : re-uploadez les fichiers sur GitHub → Vercel met à jour automatiquement" },
      { icon: "📤", text: "Partagez le lien avec vos clients, amis, et sur vos réseaux !" },
    ],
    tip: "🎉 Félicitations ! Allyjoph Alluriel Business est maintenant un vrai site web professionnel !",
  },
];

export default function DeployGuide({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const markDone = (num: number) => {
    if (!completedSteps.includes(num)) {
      setCompletedSteps((prev) => [...prev, num]);
    }
    if (num < steps.length) setCurrentStep(num + 1);
  };

  const step = steps[currentStep - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-6 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#08081a] shadow-2xl shadow-purple-900/50 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className={`px-7 py-5 bg-gradient-to-r ${step.color} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)"
          }} />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                Étape {step.num} sur {steps.length}
              </div>
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                <span className="text-2xl">{step.emoji}</span>
                {step.title}
              </h2>
              <p className="text-white/70 text-sm mt-1">{step.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition p-2 rounded-xl hover:bg-white/15 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barre de progression */}
          <div className="mt-4 flex gap-1.5">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  completedSteps.includes(s.num)
                    ? "bg-white"
                    : s.num === currentStep
                    ? "bg-white/60"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation étapes (mini) */}
        <div className="flex items-center gap-0 overflow-x-auto bg-[#06060f] border-b border-white/10 px-4">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition border-b-2 flex-shrink-0 ${
                currentStep === s.num
                  ? "border-purple-500 text-white"
                  : completedSteps.includes(s.num)
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-gray-600 hover:text-gray-400"
              }`}
            >
              {completedSteps.includes(s.num)
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                : <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                    currentStep === s.num ? "bg-purple-500 text-white" : "bg-white/10 text-gray-500"
                  }`}>{s.num}</span>
              }
              <span className="hidden sm:block">{s.emoji}</span>
            </button>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="p-6 space-y-5 max-h-[55vh] overflow-y-auto">

          {/* Boutons d'action */}
          {step.actions.length > 0 && (
            <div className="space-y-2">
              {step.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-500/30 hover:scale-[1.02] transition group"
                >
                  <span>{action.label}</span>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg text-xs">
                    <ExternalLink className="w-3 h-3" />
                    Ouvrir
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className={`rounded-2xl border ${step.borderColor} ${step.bgColor} p-5 space-y-3`}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Instructions :</p>
            {step.instructions.map((inst, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg flex-shrink-0 leading-none mt-0.5">{inst.icon}</span>
                <p className="text-sm text-gray-200 leading-relaxed">{inst.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Astuce */}
          <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-300 leading-relaxed">{step.tip}</p>
          </div>

          {/* Méthode alternative (étape 3) */}
          {"altMethod" in step && step.altMethod && (
            <div className="px-4 py-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-sm mb-1">{step.altMethod.title}</p>
              <p className="text-gray-400 text-xs mb-3">{step.altMethod.desc}</p>
              <a
                href={step.altMethod.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-gray-300 text-xs hover:text-white hover:bg-white/15 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {step.altMethod.linkLabel}
              </a>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-500 hover:text-white text-sm transition disabled:opacity-30 hover:border-white/25"
          >
            ← Précédent
          </button>

          <div className="flex items-center gap-1">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentStep === s.num ? "bg-purple-400 w-4" : completedSteps.includes(s.num) ? "bg-green-500" : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length ? (
            <button
              onClick={() => markDone(currentStep)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm hover:scale-105 transition shadow-lg shadow-purple-500/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              Fait ! Suivant →
            </button>
          ) : (
            <button
              onClick={() => { markDone(currentStep); onClose(); }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm hover:scale-105 transition shadow-lg shadow-green-500/30"
            >
              🎉 Terminer !
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
