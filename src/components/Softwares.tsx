import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Star, Tag, Clock, CheckCircle2,
  ChevronDown, ChevronUp, ExternalLink, Shield, AlertTriangle, Lock,
} from "lucide-react";
import { useSoftwareStore } from "../store/SoftwareStore";
import { useAuth } from "../store/AuthStore";

const statusBadge: Record<string, { label: string; class: string }> = {
  stable: { label: "Stable", class: "bg-green-500/20 text-green-400 border-green-500/30" },
  beta: { label: "Beta", class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  new: { label: "Nouveau", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  deprecated: { label: "Obsolète", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

const typeColors: Record<string, string> = {
  majeur: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  mineur: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  patch: "bg-green-500/20 text-green-400 border-green-500/30",
  sécurité: "bg-red-500/20 text-red-400 border-red-500/30",
};

function SoftwareCard({ swId }: { swId: string }) {
  const { softwares, getIcon } = useSoftwareStore();
  const sw = softwares.find((s) => s.id === swId);
  const [expanded, setExpanded] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  if (!sw) return null;

  const badge = statusBadge[sw.status] ?? statusBadge.stable;
  const Icon = getIcon(sw.iconName);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Bande de couleur */}
      <div className={`h-1 w-full bg-gradient-to-r ${sw.iconColor}`} />

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${sw.iconColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white">{sw.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${badge.class}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{sw.description}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-purple-400" /> v{sw.currentVersion}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> {sw.updatedAt}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-green-400" /> {sw.downloads.toLocaleString("fr-FR")} téléchargements
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {sw.rating}/5
          </span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {sw.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
              {tag}
            </span>
          ))}
          {sw.autoUpdate && (
            <span className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-semibold">
              ✓ Mise à jour auto
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          {sw.releases.length > 0 ? (
            <a
              href={sw.releases[0]?.fileUrl ?? "#"}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-purple-500/30"
            >
              <Download className="w-4 h-4" />
              Télécharger v{sw.currentVersion}
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-sm cursor-not-allowed">
              Bientôt disponible
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 transition text-sm flex items-center gap-1"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? "Moins" : "Plus"}
          </button>
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-6 space-y-5">
              <p className="text-gray-300 text-sm leading-relaxed">{sw.longDesc}</p>

              {/* Infos de mise à jour */}
              {sw.autoUpdate && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/15">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-green-400 font-semibold mb-0.5">Mise à jour automatique activée</p>
                    <p className="text-xs text-gray-400">
                      Ce logiciel se met à jour automatiquement. Vos données sont toujours préservées lors des mises à jour.
                    </p>
                  </div>
                </div>
              )}

              {/* Changelog */}
              {sw.releases.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowChangelog(!showChangelog)}
                    className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-semibold transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {showChangelog ? "Masquer" : "Voir"} le changelog ({sw.releases.length} versions)
                  </button>

                  <AnimatePresence>
                    {showChangelog && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                      >
                        {sw.releases.map((release, i) => (
                          <div key={release.id} className="pl-4 border-l-2 border-purple-500/40">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {i === 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                                  Dernière
                                </span>
                              )}
                              <span className="text-sm font-bold text-white font-mono">v{release.version}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${typeColors[release.type] ?? ""}`}>
                                {release.type}
                              </span>
                              <span className="text-xs text-gray-500">{release.date}</span>
                              {release.breaking && (
                                <span className="flex items-center gap-1 text-xs text-orange-400">
                                  <AlertTriangle className="w-3 h-3" /> Breaking
                                </span>
                              )}
                              {release.dataPreserved && (
                                <span className="flex items-center gap-1 text-xs text-green-400">
                                  <Shield className="w-3 h-3" /> Données préservées
                                </span>
                              )}
                            </div>
                            <ul className="space-y-1">
                              {release.notes.map((note, j) => (
                                <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                                  {note}
                                </li>
                              ))}
                            </ul>
                            {release.fileSize && release.fileSize !== "–" && (
                              <p className="text-xs text-gray-600 mt-2">
                                Taille : {release.fileSize} · {release.checksum.slice(0, 28)}...
                              </p>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Softwares() {
  const { softwares } = useSoftwareStore();
  const { isLoggedIn, openAuth } = useAuth();
  const [filter, setFilter] = useState("Tous");

  const categories = ["Tous", ...Array.from(new Set(softwares.map((s) => s.category)))];
  const filtered = filter === "Tous" ? softwares : softwares.filter((s) => s.category === filter);

  return (
    <section id="softwares" className="py-24 bg-[#0d0d20] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
            Distribution Logicielle
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black text-white">
            Mes{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Logiciels
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Téléchargez, installez et restez à jour automatiquement. Chaque version est documentée. Vos données sont toujours préservées.
          </p>
        </motion.div>

        {/* Bannière connexion si non connecté */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Créez un compte pour télécharger</p>
                <p className="text-gray-500 text-xs">Inscription gratuite · Accès immédiat à tous les logiciels</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openAuth("login")} className="px-4 py-2 rounded-lg border border-white/15 text-gray-300 text-sm font-semibold hover:text-white hover:bg-white/10 transition">
                Connexion
              </button>
              <button onClick={() => openAuth("register")} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold hover:scale-105 transition">
                S'inscrire
              </button>
            </div>
          </motion.div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p>Aucun logiciel dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((sw) => (
              <SoftwareCard key={sw.id} swId={sw.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
