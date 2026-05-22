import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Code2, Heart, ArrowUp, Globe } from "lucide-react";
import DeployGuide from "./DeployGuide";

const footerLinks = {
  Navigation: [
    { label: "Accueil", href: "#home" },
    { label: "À propos", href: "#about" },
    { label: "Logiciels", href: "#softwares" },
    { label: "Travaux", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
  Logiciels: [
    { label: "AllyManager Pro", href: "#softwares" },
    { label: "AllySecure", href: "#softwares" },
    { label: "AllyMonitor", href: "#softwares" },
    { label: "AllyWeb Toolkit", href: "#softwares" },
  ],
  Légal: [
    { label: "Mentions légales", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "CGU", href: "#" },
    { label: "Licences", href: "#" },
  ],
};

export default function Footer() {
  const [showDeploy, setShowDeploy] = useState(false);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#06060f] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Bannière de déploiement */}
        <div className="mb-12 p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-cyan-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg flex-shrink-0">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">Publiez ce site en ligne</h3>
              <p className="text-gray-400 text-sm">Guide complet pour déployer sur Vercel — gratuit, en 5 minutes</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeploy(true)}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:scale-105 transition"
          >
            <Globe className="w-4 h-4" />
            Voir le guide de déploiement
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-extrabold text-base">Allyjoph</div>
                <div className="text-[10px] text-purple-400 font-semibold tracking-widest uppercase -mt-0.5">
                  Alluriel Business
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
              Développeur logiciel passionné. Je crée, je partage, j'innove.
            </p>
            {/* Indicateur statut */}
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500">Site opérationnel</span>
            </div>
          </div>

          {/* Liens */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white text-sm font-bold mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#") && link.href.length > 1) {
                          e.preventDefault();
                          scrollTo(link.href);
                        }
                      }}
                      className="text-gray-500 text-sm hover:text-gray-200 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1 flex-wrap justify-center sm:justify-start">
            © {new Date().getFullYear()}{" "}
            {/* Lien admin invisible dans le copyright */}
            <a href="#/admin" className="text-gray-600 hover:text-gray-600 cursor-default" aria-hidden="true" tabIndex={-1}>
              Allyjoph Alluriel Business.
            </a>{" "}
            Fait avec <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> par Allyjoph.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeploy(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              Déployer
            </button>
            <button
              onClick={() => scrollTo("#home")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/30 text-sm transition"
            >
              <ArrowUp className="w-4 h-4" />
              Retour en haut
            </button>
          </div>
        </div>
      </div>

      {/* Guide de déploiement */}
      <AnimatePresence>
        {showDeploy && <DeployGuide onClose={() => setShowDeploy(false)} />}
      </AnimatePresence>
    </footer>
  );
}
