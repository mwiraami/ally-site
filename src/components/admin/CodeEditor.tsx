import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft, Plus, Trash2, Save, Download, Upload,
  FolderOpen, RefreshCw, CheckCircle2, X,
  Code2, FileText, AlertCircle,
  ChevronRight, ChevronDown, Edit3, Copy,
} from "lucide-react";
import { useProjectStore, Project, ProjectFile, detectLanguage } from "../../store/ProjectStore";

// ─── Icône de fichier selon langage ───────────────────────────────────────────

const langColors: Record<string, string> = {
  typescript: "text-blue-400", javascript: "text-yellow-400", python: "text-green-400",
  csharp: "text-purple-400", css: "text-pink-400", html: "text-orange-400",
  json: "text-cyan-400", markdown: "text-gray-300", sql: "text-amber-400",
  shell: "text-green-300", rust: "text-orange-500", go: "text-cyan-300",
};

function FileIcon({ lang }: { lang: string }) {
  const color = langColors[lang] ?? "text-gray-400";
  return <FileText className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />;
}

// ─── Onglets de fichiers ouverts ──────────────────────────────────────────────

function FileTabs({
  openFiles, activeId, onSelect, onClose,
}: {
  openFiles: ProjectFile[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto bg-[#0a0a18] border-b border-white/10 px-2 min-h-[38px]">
      {openFiles.map((f) => (
        <div
          key={f.id}
          onClick={() => onSelect(f.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer text-xs font-medium transition-all duration-150 flex-shrink-0 group ${
            activeId === f.id
              ? "bg-[#0d0d22] text-white border-t border-l border-r border-purple-500/40"
              : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
          }`}
        >
          <FileIcon lang={f.language} />
          <span>{f.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(f.id); }}
            className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Explorateur de fichiers ───────────────────────────────────────────────────

function FileExplorer({
  project,
  activeId,
  onSelect,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  onImportFiles,
}: {
  project: Project;
  activeId: string | null;
  onSelect: (f: ProjectFile) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, name: string) => void;
  onImportFiles: () => void;
}) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const startRename = (f: ProjectFile) => {
    setRenamingId(f.id);
    setRenameVal(f.name);
  };

  const confirmRename = (id: string) => {
    if (renameVal.trim()) onRenameFile(id, renameVal.trim());
    setRenamingId(null);
  };

  return (
    <div className="w-56 flex-shrink-0 bg-[#08081a] border-r border-white/10 flex flex-col">
      {/* Header explorateur */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition font-semibold uppercase tracking-widest"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Explorateur
        </button>
        <div className="flex items-center gap-1">
          <button
            title="Importer des fichiers"
            onClick={onImportFiles}
            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-cyan-400 transition"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            title="Nouveau fichier"
            onClick={onAddFile}
            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-green-400 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-1">
          {/* Dossier racine */}
          <div className="px-3 py-1 flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <FolderOpen className="w-3.5 h-3.5 text-yellow-500" />
            {project.name}
          </div>

          {project.files.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-600">Aucun fichier</div>
          ) : (
            project.files.map((file) => (
              <div
                key={file.id}
                className={`group flex items-center gap-2 px-4 py-1.5 cursor-pointer transition text-xs ${
                  activeId === file.id
                    ? "bg-purple-500/20 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
                onClick={() => onSelect(file)}
              >
                <FileIcon lang={file.language} />
                {renamingId === file.id ? (
                  <input
                    autoFocus
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    onBlur={() => confirmRename(file.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRename(file.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-white/10 border border-purple-500/50 rounded px-1 text-white outline-none text-xs"
                  />
                ) : (
                  <span className="flex-1 truncate">{file.name}</span>
                )}
                {renamingId !== file.id && (
                  <div className="hidden group-hover:flex items-center gap-0.5 ml-auto">
                    <button
                      title="Renommer"
                      onClick={(e) => { e.stopPropagation(); startRename(file); }}
                      className="p-0.5 hover:text-yellow-400 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      title="Supprimer"
                      onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                      className="p-0.5 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Raccourcis bas */}
      <div className="border-t border-white/10 p-2 space-y-1">
        <button
          onClick={onAddFile}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Nouveau fichier
        </button>
        <button
          onClick={onImportFiles}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
        >
          <Upload className="w-3.5 h-3.5" /> Importer fichiers
        </button>
      </div>
    </div>
  );
}

// ─── Modale nouveau fichier ────────────────────────────────────────────────────

function NewFileModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (name: string, content: string) => void;
}) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const templates: Record<string, string> = {
    "Component.tsx": `import React from 'react';\n\nexport default function Component() {\n  return (\n    <div>\n      <h1>Mon composant</h1>\n    </div>\n  );\n}\n`,
    "script.py": `# Script Python\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()\n`,
    "styles.css": `/* Styles */\n\n:root {\n  --primary: #7c3aed;\n  --bg: #0a0a1a;\n}\n`,
    "config.json": `{\n  "name": "mon-projet",\n  "version": "1.0.0",\n  "description": ""\n}\n`,
    "README.md": `# Mon Projet\n\n## Description\n\n## Installation\n\n## Utilisation\n`,
    "Vide": "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0d0d20] p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold">Nouveau fichier</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-widest">Nom du fichier</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: MonComposant.tsx"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-purple-500/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">Template</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(templates).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    if (t !== "Vide") setName((prev) => prev || t);
                    setContent(templates[t]);
                  }}
                  className="px-2 py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-white hover:border-purple-500/40 transition text-center"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-400 text-sm hover:text-white transition">
            Annuler
          </button>
          <button
            onClick={() => { if (name.trim()) { onCreate(name.trim(), content); onClose(); } }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-105 transition disabled:opacity-40"
          >
            Créer
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Éditeur de code principal ─────────────────────────────────────────────────

type Props = {
  project: Project;
  onBack: () => void;
};

export default function CodeEditor({ project, onBack }: Props) {
  const { updateFile, deleteFile, addFile, renameFile, importFiles, exportProject } = useProjectStore();

  const [openFileIds, setOpenFileIds] = useState<string[]>(
    project.files.length > 0 ? [project.files[0].id] : []
  );
  const [activeFileId, setActiveFileId] = useState<string | null>(
    project.files[0]?.id ?? null
  );
  const [unsaved, setUnsaved] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false);
  const [copied, setCopied] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const activeFile = project.files.find((f) => f.id === activeFileId) ?? null;

  const openFile = (f: ProjectFile) => {
    if (!openFileIds.includes(f.id)) setOpenFileIds((prev) => [...prev, f.id]);
    setActiveFileId(f.id);
  };

  const closeTab = (id: string) => {
    const remaining = openFileIds.filter((fid) => fid !== id);
    setOpenFileIds(remaining);
    if (activeFileId === id) setActiveFileId(remaining[remaining.length - 1] ?? null);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFileId || value === undefined) return;
    updateFile(project.id, activeFileId, value);
    setUnsaved((prev) => new Set([...prev, activeFileId]));
  };

  const saveAll = () => {
    setUnsaved(new Set());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile(project.id, fileId);
    closeTab(fileId);
  };

  const handleAddFile = (name: string, content: string) => {
    const f: ProjectFile = {
      id: `f-${Date.now()}`,
      name,
      path: name,
      language: detectLanguage(name),
      content,
      lastModified: new Date().toISOString().split("T")[0],
    };
    addFile(project.id, f);
    openFile(f);
  };

  const handleImportFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const imported: ProjectFile[] = await Promise.all(
      files.map(async (file) => {
        const content = await file.text();
        return {
          id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          path: file.name,
          language: detectLanguage(file.name),
          content,
          lastModified: new Date().toISOString().split("T")[0],
        };
      })
    );
    importFiles(project.id, imported);
    if (imported[0]) openFile(imported[0]);
    if (importInputRef.current) importInputRef.current.value = "";
  }, [project.id]);

  const copyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadCurrentFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openFileIds_files = openFileIds
    .map((id) => project.files.find((f) => f.id === id))
    .filter(Boolean) as ProjectFile[];

  return (
    <div className="flex flex-col h-full min-h-0" style={{ height: "calc(100vh - 64px)" }}>
      {/* Barre d'outils supérieure */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 bg-[#06060f] flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${project.color}`} />
          <span className="text-white font-bold text-sm">{project.name}</span>
          <span className="text-gray-600 text-xs">v{project.version}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {unsaved.size > 0 && (
            <span className="text-xs text-yellow-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {unsaved.size} non sauvegardé(s)
            </span>
          )}

          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-green-400 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Sauvegardé
            </motion.span>
          )}

          {/* Copier le code */}
          <button
            onClick={copyCode}
            disabled={!activeFile}
            title="Copier le code actif"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-gray-300 hover:text-white hover:border-white/30 transition disabled:opacity-40"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copié !" : "Copier"}
          </button>

          {/* Télécharger le fichier actif */}
          <button
            onClick={downloadCurrentFile}
            disabled={!activeFile}
            title="Télécharger ce fichier"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-gray-300 hover:text-white hover:border-white/30 transition disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Fichier
          </button>

          {/* Importer fichiers */}
          <label
            title="Importer des fichiers depuis votre PC"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-xs text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Importer
            <input
              type="file"
              multiple
              className="hidden"
              ref={importInputRef}
              onChange={handleImportFiles}
              accept=".ts,.tsx,.js,.jsx,.py,.cs,.java,.html,.css,.scss,.json,.md,.sql,.sh,.yaml,.yml,.txt,.xml,.php,.rs,.go,.cpp,.c"
            />
          </label>

          {/* Sauvegarder */}
          <button
            onClick={saveAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/30 bg-green-500/10 text-xs text-green-300 hover:text-white hover:bg-green-500/20 transition"
          >
            <Save className="w-3.5 h-3.5" />
            Sauver
          </button>

          {/* Exporter ZIP */}
          <button
            onClick={() => exportProject(project.id)}
            title="Télécharger tout le projet en ZIP"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-xs text-white font-semibold hover:scale-105 transition shadow-lg shadow-purple-500/30"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter .zip
          </button>
        </div>
      </div>

      {/* Corps : explorateur + éditeur */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Explorateur de fichiers */}
        <FileExplorer
          project={project}
          activeId={activeFileId}
          onSelect={openFile}
          onAddFile={() => setShowNewFile(true)}
          onDeleteFile={handleDeleteFile}
          onRenameFile={(id, name) => renameFile(project.id, id, name)}
          onImportFiles={() => importInputRef.current?.click()}
        />

        {/* Zone d'édition */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Onglets */}
          <FileTabs
            openFiles={openFileIds_files}
            activeId={activeFileId}
            onSelect={setActiveFileId}
            onClose={closeTab}
          />

          {/* Éditeur Monaco */}
          {activeFile ? (
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: "on",
                  bracketPairColorization: { enabled: true },
                  formatOnPaste: true,
                  formatOnType: true,
                  renderLineHighlight: "all",
                  lineNumbers: "on",
                  glyphMargin: true,
                  folding: true,
                  tabSize: 2,
                  padding: { top: 12, bottom: 12 },
                }}
                loading={
                  <div className="flex items-center justify-center h-full bg-[#0d0d22]">
                    <div className="text-gray-500 text-sm flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Chargement de l'éditeur...
                    </div>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0d22] text-gray-600">
              <Code2 className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm font-medium">Aucun fichier ouvert</p>
              <p className="text-xs mt-1 mb-4">Sélectionnez un fichier ou créez-en un nouveau</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewFile(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-600/30 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Nouveau fichier
                </button>
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-600/30 transition cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> Importer
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImportFiles}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Barre de statut */}
          <div className="flex items-center gap-4 px-4 py-1 bg-[#07071a] border-t border-white/10 text-xs text-gray-600 flex-shrink-0">
            {activeFile && (
              <>
                <span className="flex items-center gap-1">
                  <FileIcon lang={activeFile.language} />
                  {activeFile.language}
                </span>
                <span>{activeFile.path}</span>
                <span>Modifié : {activeFile.lastModified}</span>
                <span className="ml-auto">
                  {activeFile.content.split("\n").length} lignes · {activeFile.content.length} caractères
                </span>
              </>
            )}
            {!activeFile && <span>Allyjoph Code Editor</span>}
          </div>
        </div>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showNewFile && (
          <NewFileModal onClose={() => setShowNewFile(false)} onCreate={handleAddFile} />
        )}
      </AnimatePresence>
    </div>
  );
}
