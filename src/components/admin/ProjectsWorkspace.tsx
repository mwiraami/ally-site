import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Plus, Trash2, Download, Edit3, Search,
  Folder, Clock, AlertCircle, X, Save,
  FolderOpen, FileText, Zap, BarChart3,
} from "lucide-react";
import { useProjectStore, Project } from "../../store/ProjectStore";
import CodeEditor from "./CodeEditor";

// ─── Couleurs disponibles ─────────────────────────────────────────────────────

const colorOptions = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-600",
  "from-green-400 to-emerald-600",
  "from-orange-400 to-red-500",
  "from-yellow-400 to-amber-500",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-purple-600",
  "from-teal-400 to-cyan-600",
];

const statusColors: Record<string, string> = {
  "en cours": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "terminé": "bg-green-500/20 text-green-400 border-green-500/30",
  "archivé": "bg-gray-500/20 text-gray-400 border-gray-500/30",
  "en pause": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

// ─── Modale de création ───────────────────────────────────────────────────────

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const { addProject } = useProjectStore();
  const [form, setForm] = useState({
    name: "", description: "", version: "1.0.0",
    category: "Web", status: "en cours" as Project["status"],
    color: colorOptions[0],
  });

  const save = () => {
    if (!form.name.trim()) return;
    const p: Project = {
      id: `proj-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      color: form.color,
      version: form.version || "1.0.0",
      category: form.category,
      status: form.status,
      files: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    addProject(p);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0d0d20] shadow-2xl"
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-purple-400" />
            Nouveau projet
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4">
          {/* Aperçu */}
          <div className={`h-2 w-full rounded-full bg-gradient-to-r ${form.color}`} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Nom du projet *</label>
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="MonSuperProjet"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Version</label>
              <input
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="1.0.0"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-purple-500/60 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description courte du projet..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
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
                {["Web", "Desktop", "Mobile", "Backend", "Script", "Design", "Autre"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a1a] border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 transition"
              >
                {["en cours", "terminé", "en pause", "archivé"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">Couleur</label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`h-7 rounded-lg bg-gradient-to-r ${c} transition ring-2 ring-offset-2 ring-offset-[#0d0d20] ${
                    form.color === c ? "ring-white" : "ring-transparent hover:ring-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-7 pb-7">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/15 text-gray-400 text-sm hover:text-white transition">
            Annuler
          </button>
          <button
            onClick={save}
            disabled={!form.name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-105 transition disabled:opacity-40"
          >
            <Save className="w-4 h-4" /> Créer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Carte projet ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onClick,
  onDelete,
  onExport,
}: {
  project: Project;
  onClick: () => void;
  onDelete: () => void;
  onExport: () => void;
}) {
  const fileCount = project.files.length;
  const totalLines = project.files.reduce((sum, f) => sum + f.content.split("\n").length, 0);
  const langs = [...new Set(project.files.map((f) => f.language))].slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* Bande colorée */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${project.color}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{project.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-gray-600 font-mono text-xs">v{project.version}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
            <button
              title="Exporter .zip"
              onClick={(e) => { e.stopPropagation(); onExport(); }}
              className="p-1.5 rounded-lg hover:bg-purple-500/20 text-gray-500 hover:text-purple-300 transition"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              title="Supprimer"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-500 hover:text-red-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {project.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{project.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: FileText, label: "Fichiers", value: fileCount },
            { icon: BarChart3, label: "Lignes", value: totalLines.toLocaleString() },
            { icon: Clock, label: "MàJ", value: project.updatedAt },
          ].map(({ icon: Ic, label, value }) => (
            <div key={label} className="p-2 rounded-lg bg-white/5 text-center">
              <Ic className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
              <div className="text-white font-bold text-xs">{value}</div>
              <div className="text-gray-600 text-[10px]">{label}</div>
            </div>
          ))}
        </div>

        {/* Langages */}
        {langs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {langs.map((lang) => (
              <span key={lang} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
                {lang}
              </span>
            ))}
            {project.files.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-600">
                +{project.files.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bouton ouvrir */}
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-cyan-500/80 hover:from-purple-600 hover:to-cyan-500 text-white text-xs font-semibold transition"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Ouvrir l'éditeur
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function ProjectsWorkspace() {
  const { projects, deleteProject, exportProject } = useProjectStore();
  const [showCreate, setShowCreate] = useState(false);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openProject = projects.find((p) => p.id === openProjectId);

  // Si un projet est ouvert → afficher l'éditeur plein écran
  if (openProject) {
    return (
      <div className="fixed inset-0 z-30 bg-[#09091b] flex flex-col">
        {/* Barre du titre */}
        <div className="flex items-center gap-3 px-4 h-10 bg-[#06060f] border-b border-white/10 flex-shrink-0">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${openProject.color}`} />
          <span className="text-white text-xs font-bold">{openProject.name}</span>
          <span className="text-gray-600 text-xs">— Éditeur de code</span>
          <span className="ml-auto text-gray-700 text-xs">Allyjoph Code Editor</span>
        </div>
        <div className="flex-1 min-h-0">
          <CodeEditor
            project={openProject}
            onBack={() => setOpenProjectId(null)}
          />
        </div>
      </div>
    );
  }

  // Filtres
  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tous" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalFiles = projects.reduce((sum, p) => sum + p.files.length, 0);
  const totalLines = projects.reduce(
    (sum, p) => sum + p.files.reduce((s, f) => s + f.content.split("\n").length, 0), 0
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-400" />
            Projets & Code
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Éditez vos projets, modifiez vos fichiers et exportez-les vers votre ordinateur.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Folder, label: "Projets", value: projects.length, color: "from-purple-500 to-indigo-500" },
          { icon: FileText, label: "Fichiers totaux", value: totalFiles, color: "from-cyan-500 to-blue-500" },
          { icon: BarChart3, label: "Lignes de code", value: totalLines.toLocaleString("fr-FR"), color: "from-green-400 to-emerald-500" },
          { icon: Zap, label: "En cours", value: projects.filter((p) => p.status === "en cours").length, color: "from-orange-400 to-red-500" },
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

      {/* Info export */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
        <Download className="w-5 h-5 text-purple-400 flex-shrink-0" />
        <div>
          <p className="text-sm text-white font-semibold">Exportation vers votre ordinateur</p>
          <p className="text-xs text-gray-400">
            Ouvrez un projet → cliquez sur <strong className="text-purple-300">"Exporter .zip"</strong> pour télécharger tout le code sur votre PC. Vous pouvez aussi importer des fichiers depuis votre ordinateur directement dans l'éditeur.
          </p>
        </div>
      </div>

      {/* Barre de recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 transition"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["Tous", "en cours", "terminé", "en pause", "archivé"].map((s) => (
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

      {/* Grille des projets */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-2xl text-gray-600">
          <FolderOpen className="w-14 h-14 mb-3 opacity-20" />
          <p className="text-sm font-medium">Aucun projet trouvé</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-600/30 transition"
          >
            + Créer votre premier projet
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => setOpenProjectId(p.id)}
                onDelete={() => setConfirmDeleteId(p.id)}
                onExport={() => exportProject(p.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation suppression */}
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
              <h3 className="text-white font-bold text-lg mb-2">Supprimer ce projet ?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Tous les fichiers et le code seront supprimés définitivement.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-400 text-sm hover:text-white transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => { deleteProject(confirmDeleteId!); setConfirmDeleteId(null); }}
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
        {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
      </AnimatePresence>
    </div>
  );
}
