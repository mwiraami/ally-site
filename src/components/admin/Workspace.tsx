import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Plus, Download, Users, Star, RefreshCw,
  Search, Filter, Trash2, AlertCircle, X, Save,
  ToggleRight, ToggleLeft, Cpu, Zap, Shield, Globe, Upload,
} from "lucide-react";
import { useSoftwareStore, Software } from "../../store/SoftwareStore";
import WorkspaceDetail from "./WorkspaceDetail";

// ─── Modale création d'un nouveau logiciel ────────────────────────────────────

const iconOptions = [
  { name: "Zap", Icon: Zap, label: "Éclair" },
  { name: "Shield", Icon: Shield, label: "Sécurité" },
  { name: "Cpu", Icon: Cpu, label: "Système" },
  { name: "Globe", Icon: Globe, label: "Web" },
];

const colorOptions = [
  { value: "from-purple-500 to-pink-500", label: "Violet-Rose" },
  { value: "from-cyan-500 to-blue-600", label: "Cyan-Bleu" },
  { value: "from-green-400 to-emerald-600", label: "Vert" },
  { value: "from-orange-400 to-red-500", label: "Orange-Rouge" },
  { value: "from-yellow-400 to-amber-500", label: "Doré" },
  { value: "from-pink-500 to-rose-600", label: "Rose" },
];

function CreateSoftwareModal({ onClose }: { onClose: () => void }) {
  const { addSoftware } = useSoftwareStore();
  const [form, setForm] = useState({
    name: "",
    description: "",
    longDesc: "",
    category: "Productivité",
    iconName: "Zap",
    iconColor: "from-purple-500 to-pink-500",
    version: "1.0.0",
    status: "new" as Software["status"],
    tags: "",
    autoUpdate: true,
    updateChannel: "stable" as Software["updateChannel"],
  });

  const save = () => {
    if (!form.name || !form.description || !form.version) return;
    const sw: Software = {
      id: form.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: form.name,
      description: form.description,
      longDesc: form.longDesc || form.description,
      category: form.category,
      iconName: form.iconName,
      iconColor: form.iconColor,
      currentVersion: form.version,
      latestStableVersion: form.version,
      status: form.status,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      rating: 5.0,
      downloads: 0,
      activeUsers: 0,
      autoUpdate: form.autoUpdate,
      updateChannel: form.updateChannel,
      releases: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    addSoftware(sw);
    onClose();
  };

  const selectedIcon = iconOptions.find((o) => o.name === form.iconName);
  const SelectedIconComp = selectedIcon?.Icon ?? Zap;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#0d0d20] shadow-2xl"
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <h3 className="text-white font-bold text-lg">Nouveau logiciel</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${form.iconColor} flex items-center justify-center shadow-lg`}>
              <SelectedIconComp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">{form.name || "Nom du logiciel"}</p>
              <p className="text-gray-500 text-xs">{form.description || "Description..."}</p>
            </div>
          </div>

          {/* Nom + version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Nom *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="AllyTools Pro"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Version initiale *</label>
              <input
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="1.0.0"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-purple-500/60 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Description courte *</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Une phrase claire qui décrit votre logiciel..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Description complète</label>
            <textarea
              value={form.longDesc}
              onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
              rows={3}
              placeholder="Description détaillée des fonctionnalités..."
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
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Statut initial</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Software["status"] })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a1a] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              >
                {["new", "stable", "beta"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Icône */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">Icône</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map(({ name, Icon }) => (
                <button
                  key={name}
                  onClick={() => setForm({ ...form, iconName: name })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${
                    form.iconName === name ? "border-purple-500/60 bg-purple-500/15" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${form.iconName === name ? "text-purple-300" : "text-gray-400"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">Couleur</label>
            <div className="grid grid-cols-6 gap-2">
              {colorOptions.map(({ value }) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, iconColor: value })}
                  className={`h-8 rounded-lg bg-gradient-to-r ${value} transition ring-2 ${
                    form.iconColor === value ? "ring-white ring-offset-2 ring-offset-[#0d0d20]" : "ring-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Tags (séparés par virgule)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Windows, macOS, Gratuit"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
            />
          </div>

          {/* MàJ auto */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div>
              <p className="text-sm text-white font-semibold">Mise à jour automatique</p>
              <p className="text-xs text-gray-500">Les clients reçoivent les MàJ automatiquement</p>
            </div>
            <button onClick={() => setForm({ ...form, autoUpdate: !form.autoUpdate })}>
              {form.autoUpdate
                ? <ToggleRight className="w-8 h-8 text-green-400" />
                : <ToggleLeft className="w-8 h-8 text-gray-600" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 px-7 pb-7">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/15 text-gray-400 hover:text-white transition text-sm">
            Annuler
          </button>
          <button
            onClick={save}
            disabled={!form.name || !form.description || !form.version}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-105 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> Créer le logiciel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Carte logiciel ───────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  stable: "bg-green-500/20 text-green-400 border-green-500/30",
  beta: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  new: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  deprecated: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function SoftwareCard({ sw, onClick, onDelete }: { sw: Software; onClick: () => void; onDelete: () => void }) {
  const { getIcon } = useSoftwareStore();
  const Icon = getIcon(sw.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${sw.iconColor}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${sw.iconColor} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">{sw.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-gray-500 text-xs font-mono">v{sw.currentVersion}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColors[sw.status]}`}>
                  {sw.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/15 text-gray-600 hover:text-red-400 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{sw.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          {[
            { icon: Download, value: sw.downloads, label: "DL" },
            { icon: Users, value: sw.activeUsers, label: "Users" },
            { icon: Star, value: sw.rating, label: "Note" },
          ].map(({ icon: Ic, value, label }) => (
            <div key={label} className="p-2 rounded-lg bg-white/5">
              <Ic className="w-3.5 h-3.5 text-gray-500 mx-auto mb-0.5" />
              <div className="text-white font-bold text-sm">{value}</div>
              <div className="text-gray-600 text-xs">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            {sw.autoUpdate
              ? <><RefreshCw className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">MàJ auto</span></>
              : <><RefreshCw className="w-3.5 h-3.5 text-gray-600" /><span className="text-gray-600">Manuelle</span></>}
          </div>
          <button
            onClick={onClick}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/80 to-cyan-500/80 text-white text-xs font-semibold hover:from-purple-600 hover:to-cyan-500 transition"
          >
            Gérer →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page principale Workspace ────────────────────────────────────────────────

export default function Workspace() {
  const { softwares, deleteSoftware, getTotalDownloads, getTotalUsers } = useSoftwareStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const selected = softwares.find((s) => s.id === selectedId);

  if (selected) {
    return <WorkspaceDetail software={selected} onBack={() => setSelectedId(null)} />;
  }

  const filtered = softwares.filter((sw) => {
    const matchSearch = sw.name.toLowerCase().includes(search.toLowerCase()) ||
      sw.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tous" || sw.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Upload className="w-6 h-6 text-purple-400" />
            Espace de travail
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Gérez, publiez et mettez à jour vos logiciels — vos clients sont toujours en ligne.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" /> Nouveau logiciel
        </button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: "Logiciels publiés", value: softwares.length, color: "from-purple-500 to-indigo-500" },
          { icon: Download, label: "Téléchargements totaux", value: getTotalDownloads().toLocaleString("fr-FR"), color: "from-cyan-500 to-blue-500" },
          { icon: Users, label: "Utilisateurs actifs", value: getTotalUsers().toLocaleString("fr-FR"), color: "from-green-400 to-emerald-500" },
          { icon: RefreshCw, label: "MàJ auto activées", value: softwares.filter((s) => s.autoUpdate).length, color: "from-orange-400 to-red-500" },
        ].map(({ icon: Ic, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 rounded-xl border border-white/10 bg-white/5"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Ic className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Barre de recherche + filtre */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un logiciel..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          {["Tous", "stable", "beta", "new", "deprecated"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                filterStatus === s
                  ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 border border-dashed border-white/10 rounded-2xl">
          <Package className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">Aucun logiciel trouvé</p>
          <button onClick={() => setShowCreate(true)} className="mt-3 text-purple-400 text-sm hover:text-purple-300 transition">
            + Créer votre premier logiciel
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {filtered.map((sw) => (
              <SoftwareCard
                key={sw.id}
                sw={sw}
                onClick={() => setSelectedId(sw.id)}
                onDelete={() => setConfirmDeleteId(sw.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm suppression */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0d0d20] p-7 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Supprimer ce logiciel ?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Toutes les versions et données seront supprimées définitivement. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-400 hover:text-white transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={() => { deleteSoftware(confirmDeleteId!); setConfirmDeleteId(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale création */}
      <AnimatePresence>
        {showCreate && <CreateSoftwareModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
