import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, Edit3, Download, Users, Star,
  CheckCircle2, AlertTriangle, Shield, Tag, Clock,
  ToggleLeft, ToggleRight, RefreshCw, Package, Save, X,
} from "lucide-react";
import { useSoftwareStore, Software } from "../../store/SoftwareStore";
import WorkspaceRelease from "./WorkspaceRelease";

type Props = {
  software: Software;
  onBack: () => void;
};

const typeColors: Record<string, string> = {
  majeur: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  mineur: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  patch: "bg-green-500/20 text-green-400 border-green-500/30",
  sécurité: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ─── Modale d'édition des infos du logiciel ───────────────────────────────────

function EditInfoModal({ software, onClose }: { software: Software; onClose: () => void }) {
  const { updateSoftware } = useSoftwareStore();
  const [form, setForm] = useState({
    name: software.name,
    description: software.description,
    longDesc: software.longDesc,
    category: software.category,
    autoUpdate: software.autoUpdate,
    updateChannel: software.updateChannel,
    status: software.status,
    tags: software.tags.join(", "),
  });

  const save = () => {
    updateSoftware(software.id, {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0d0d20] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-bold">Modifier les informations</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {[
            { label: "Nom du logiciel", key: "name", type: "text" },
            { label: "Description courte", key: "description", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Description longue</label>
            <textarea
              value={form.longDesc}
              onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a1a] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              >
                {["Productivité", "Sécurité", "Système", "Développement", "Autre"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Software["status"] })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a1a] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              >
                {["stable", "beta", "new", "deprecated"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Tags (séparés par virgule)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Windows, macOS, Gratuit"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
            />
          </div>
          {/* Mise à jour automatique */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="text-sm text-white font-semibold">Mise à jour automatique</p>
              <p className="text-xs text-gray-500">Les clients reçoivent les MàJ sans action manuelle</p>
            </div>
            <button
              onClick={() => setForm({ ...form, autoUpdate: !form.autoUpdate })}
              className="text-2xl transition"
            >
              {form.autoUpdate
                ? <ToggleRight className="w-8 h-8 text-green-400" />
                : <ToggleLeft className="w-8 h-8 text-gray-600" />}
            </button>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-400 hover:text-white transition text-sm">
            Annuler
          </button>
          <button onClick={save} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-105 transition">
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Vue détaillée d'un logiciel ──────────────────────────────────────────────

export default function WorkspaceDetail({ software, onBack }: Props) {
  const { deleteRelease, updateSoftware, getIcon } = useSoftwareStore();
  const [showRelease, setShowRelease] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const Icon = getIcon(software.iconName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${software.iconColor} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{software.name}</h2>
            <p className="text-gray-500 text-sm">
              v{software.currentVersion} · Mis à jour le {software.updatedAt}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:text-white hover:border-white/30 transition text-sm font-medium"
          >
            <Edit3 className="w-4 h-4" /> Modifier infos
          </button>
          <button
            onClick={() => setShowRelease(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" /> Nouvelle version
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Download, label: "Téléchargements", value: software.downloads.toLocaleString("fr-FR"), color: "text-purple-400" },
          { icon: Users, label: "Utilisateurs actifs", value: software.activeUsers.toLocaleString("fr-FR"), color: "text-cyan-400" },
          { icon: Star, label: "Note", value: `${software.rating}/5`, color: "text-yellow-400" },
          { icon: RefreshCw, label: "MàJ auto", value: software.autoUpdate ? "Activée" : "Désactivée", color: software.autoUpdate ? "text-green-400" : "text-gray-500" },
        ].map(({ icon: Ic, label, value, color }) => (
          <div key={label} className="p-4 rounded-xl border border-white/10 bg-white/5">
            <Ic className={`w-5 h-5 ${color} mb-2`} />
            <div className="text-xl font-black text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="p-5 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-purple-400" />
          <h3 className="text-white font-semibold text-sm">Description</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{software.longDesc}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {software.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">{tag}</span>
          ))}
        </div>
      </div>

      {/* Paramètres MàJ */}
      <div className="p-5 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-sm">Paramètres de mise à jour</h3>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-1">Version stable</p>
            <p className="text-white font-mono font-bold">v{software.latestStableVersion}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-1">Canal actif</p>
            <p className="text-white font-semibold capitalize">{software.updateChannel}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 mb-1">Mise à jour auto</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSoftware(software.id, { autoUpdate: !software.autoUpdate })}
                className="transition"
              >
                {software.autoUpdate
                  ? <ToggleRight className="w-6 h-6 text-green-400" />
                  : <ToggleLeft className="w-6 h-6 text-gray-600" />}
              </button>
              <span className={software.autoUpdate ? "text-green-400" : "text-gray-500"}>
                {software.autoUpdate ? "Activée" : "Désactivée"}
              </span>
            </div>
          </div>
        </div>
        {software.autoUpdate && (
          <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/15">
            <Shield className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              Les <strong className="text-green-400">{software.activeUsers}</strong> utilisateurs actifs recevront automatiquement les nouvelles versions. Leurs données seront migrées sans interruption de service.
            </p>
          </div>
        )}
      </div>

      {/* Historique des releases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-400" />
            Historique des versions ({software.releases.length})
          </h3>
        </div>

        {software.releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 border border-dashed border-white/10 rounded-xl">
            <Package className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Aucune version publiée</p>
            <button onClick={() => setShowRelease(true)} className="mt-3 text-purple-400 text-sm hover:text-purple-300 transition">
              + Publier la première version
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {software.releases.map((release, i) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border overflow-hidden transition-all ${
                  i === 0 ? "border-purple-500/30 bg-purple-500/5" : "border-white/10 bg-white/5"
                }`}
              >
                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-black text-white text-lg">
                        v{release.version}
                      </span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                          Dernière
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${typeColors[release.type] || "bg-gray-500/20 text-gray-400"}`}>
                        {release.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {release.date}
                      </span>
                      {i !== 0 && (
                        <button
                          onClick={() => setConfirmDelete(release.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-600 hover:text-red-400 transition"
                          title="Supprimer cette version"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <ul className="space-y-1.5 mb-3">
                    {release.notes.map((note, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>

                  {/* Badges + Meta */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                    {release.breaking && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-xs font-semibold">
                        <AlertTriangle className="w-3 h-3" /> Breaking
                      </span>
                    )}
                    {release.dataPreserved && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-semibold">
                        <Shield className="w-3 h-3" /> Données préservées
                      </span>
                    )}
                    {release.fileSize !== "–" && (
                      <span className="text-xs text-gray-600 flex items-center gap-1 ml-auto">
                        <Download className="w-3 h-3" /> {release.fileSize}
                      </span>
                    )}
                  </div>
                </div>

                {/* Confirm delete */}
                <AnimatePresence>
                  {confirmDelete === release.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-red-500/20 bg-red-500/5 px-5 py-3 flex items-center justify-between"
                    >
                      <p className="text-sm text-red-400">Supprimer cette version ? Cette action est irréversible.</p>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 text-xs rounded-lg border border-white/15 text-gray-400 hover:text-white transition">
                          Annuler
                        </button>
                        <button
                          onClick={() => { deleteRelease(software.id, release.id); setConfirmDelete(null); }}
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showRelease && <WorkspaceRelease software={software} onClose={() => setShowRelease(false)} />}
        {showEdit && <EditInfoModal software={software} onClose={() => setShowEdit(false)} />}
      </AnimatePresence>
    </div>
  );
}
