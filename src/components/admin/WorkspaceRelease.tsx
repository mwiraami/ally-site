import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, Plus, Trash2, Upload, AlertTriangle,
  CheckCircle2, Shield, Package, Info,
} from "lucide-react";
import { useSoftwareStore, ReleaseNote, Software } from "../../store/SoftwareStore";

// ─── Modale de publication d'une release ─────────────────────────────────────

type Props = {
  software: Software;
  onClose: () => void;
};

const releaseTypes = [
  { value: "patch", label: "Patch (bug fixes)", color: "text-green-400", desc: "Corrections de bugs uniquement, sans nouvelle fonctionnalité" },
  { value: "mineur", label: "Mise à jour mineure", color: "text-blue-400", desc: "Nouvelles fonctionnalités rétrocompatibles" },
  { value: "majeur", label: "Mise à jour majeure", color: "text-purple-400", desc: "Changements importants, peut nécessiter migration" },
  { value: "sécurité", label: "Correctif de sécurité", color: "text-red-400", desc: "Correction de vulnérabilités critiques" },
] as const;

function bumpVersion(current: string, type: string): string {
  const clean = current.replace(/-beta|-alpha|-rc\d*/g, "");
  const parts = clean.split(".").map(Number);
  if (parts.length < 3) return current;
  if (type === "majeur") return `${parts[0] + 1}.0.0`;
  if (type === "mineur") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export default function WorkspaceRelease({ software, onClose }: Props) {
  const { publishRelease } = useSoftwareStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [releaseType, setReleaseType] = useState<"patch" | "mineur" | "majeur" | "sécurité">("patch");
  const [version, setVersion] = useState(bumpVersion(software.currentVersion, "patch"));
  const [isBeta, setIsBeta] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [dataPreserved, setDataPreserved] = useState(true);
  const [notes, setNotes] = useState<string[]>([""]); // liste des notes de changelog
  const [fileUrl, setFileUrl] = useState("#");
  const [fileSize, setFileSize] = useState("");
  const [checksum, setChecksum] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [published, setPublished] = useState(false);

  const versionFinal = isBeta ? `${version}-beta` : version;
  const today = new Date().toLocaleDateString("fr-FR");

  const handleTypeChange = (type: "patch" | "mineur" | "majeur" | "sécurité") => {
    setReleaseType(type);
    setVersion(bumpVersion(software.currentVersion, type));
    if (type === "majeur") {
      setBreaking(true);
    } else {
      setBreaking(false);
    }
  };

  const addNote = () => setNotes([...notes, ""]);
  const removeNote = (i: number) => setNotes(notes.filter((_, idx) => idx !== i));
  const updateNote = (i: number, val: string) => {
    const n = [...notes];
    n[i] = val;
    setNotes(n);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
      setFileUrl(URL.createObjectURL(file));
      setChecksum(`sha256:${Math.random().toString(36).slice(2)}...`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSize(`${(file.size / 1024 / 1024).toFixed(1)} MB`);
      setFileUrl(URL.createObjectURL(file));
      setChecksum(`sha256:${Math.random().toString(36).slice(2)}...`);
    }
  };

  const canPublish = notes.filter((n) => n.trim()).length > 0 && versionFinal.trim();

  const handlePublish = () => {
    const release: ReleaseNote = {
      id: `r-${Date.now()}`,
      version: versionFinal,
      date: today,
      type: releaseType,
      notes: notes.filter((n) => n.trim()),
      breaking,
      dataPreserved,
      fileUrl,
      fileSize: fileSize || "–",
      checksum: checksum || "–",
      publishedAt: new Date().toISOString(),
    };
    publishRelease(software.id, release);
    setPublished(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0d0d20] shadow-2xl shadow-purple-900/40 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${software.iconColor} flex items-center justify-center`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">{software.name}</h2>
              <p className="text-gray-500 text-xs">Publier une nouvelle version</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-0 px-8 py-4 border-b border-white/10">
          {[
            { n: 1, label: "Type & Version" },
            { n: 2, label: "Fichier & Notes" },
            { n: 3, label: "Confirmation" },
          ].map(({ n, label }, i, arr) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > n ? "bg-green-500 text-white" : step === n ? "bg-gradient-to-br from-purple-500 to-cyan-500 text-white" : "bg-white/10 text-gray-500"
                }`}>
                  {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === n ? "text-white" : "text-gray-500"}`}>{label}</span>
              </div>
              {i < arr.length - 1 && <div className={`flex-1 h-px mx-3 ${step > n ? "bg-green-500/50" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {published && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0d20]/95 rounded-2xl"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </motion.div>
              <h3 className="text-white text-xl font-black mb-2">Version publiée !</h3>
              <p className="text-gray-400 text-sm text-center">
                <span className="text-purple-300 font-semibold">{versionFinal}</span> est maintenant disponible pour vos clients.
              </p>
              <p className="text-gray-600 text-xs mt-3">Les données des utilisateurs sont préservées ✓</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-8 py-6 space-y-6">

          {/* ÉTAPE 1 : Type & Version */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <label className="block text-xs text-gray-400 mb-3 font-semibold uppercase tracking-widest">
                  Type de mise à jour
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {releaseTypes.map((rt) => (
                    <button
                      key={rt.value}
                      onClick={() => handleTypeChange(rt.value)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        releaseType === rt.value
                          ? "border-purple-500/50 bg-purple-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`text-sm font-bold mb-1 ${rt.color}`}>{rt.label}</div>
                      <div className="text-xs text-gray-500">{rt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
                    Numéro de version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="ex: 1.2.3"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition font-mono"
                  />
                  <p className="text-xs text-gray-600 mt-1">Version actuelle : v{software.currentVersion}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
                    Canal de publication
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition">
                      <input type="checkbox" checked={isBeta} onChange={(e) => setIsBeta(e.target.checked)}
                        className="w-4 h-4 accent-purple-500" />
                      <div>
                        <div className="text-sm text-white">Canal bêta</div>
                        <div className="text-xs text-gray-500">Ajoutera "-beta" à la version</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Avertissements */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 border-white/10 bg-white/5 hover:border-orange-500/30">
                  <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-orange-500" />
                  <div>
                    <div className="text-sm text-orange-400 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Changement critique (breaking change)
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Cette version modifie des comportements existants. Vos clients seront avertis.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 border-green-500/20 bg-green-500/5 hover:border-green-500/40">
                  <input type="checkbox" checked={dataPreserved} onChange={(e) => setDataPreserved(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-green-500" />
                  <div>
                    <div className="text-sm text-green-400 font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Les données des clients sont préservées
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Cochez si cette mise à jour ne supprime aucune donnée utilisateur existante.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-105 transition"
                >
                  Suivant →
                </button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2 : Fichier & Notes */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {/* Upload */}
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
                  Fichier de mise à jour
                </label>
                <label
                  htmlFor="file-upload"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`flex flex-col items-center justify-center w-full p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-purple-500/70 bg-purple-500/10"
                      : fileUrl !== "#"
                        ? "border-green-500/40 bg-green-500/5"
                        : "border-white/15 bg-white/5 hover:border-purple-500/40 hover:bg-purple-500/5"
                  }`}
                >
                  {fileUrl !== "#" ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" />
                      <p className="text-green-400 text-sm font-semibold">Fichier chargé ✓</p>
                      <p className="text-gray-500 text-xs mt-1">{fileSize} · {checksum.slice(0, 24)}...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="text-gray-300 text-sm">Glissez le fichier ici ou <span className="text-purple-400">parcourir</span></p>
                      <p className="text-gray-600 text-xs mt-1">.exe · .dmg · .zip · .AppImage · max 2GB</p>
                    </>
                  )}
                  <input id="file-upload" type="file" className="hidden" onChange={handleFileInput} />
                </label>
              </div>

              {/* Notes de changelog */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                    Notes de changelog
                  </label>
                  <button onClick={addNote} className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition">
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>
                <div className="space-y-2">
                  {notes.map((note, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-gray-600 text-sm flex-shrink-0">•</span>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateNote(i, e.target.value)}
                        placeholder={`Changement ${i + 1}...`}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 transition"
                      />
                      {notes.length > 1 && (
                        <button onClick={() => removeNote(i)} className="text-gray-600 hover:text-red-400 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Ces notes seront affichées dans le changelog public de vos clients.
                </p>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-white/15 text-gray-400 hover:text-white transition text-sm">
                  ← Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={notes.filter((n) => n.trim()).length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:scale-105 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 3 : Confirmation */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-white font-bold text-sm">Récapitulatif de la publication</h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Logiciel", value: software.name },
                    { label: "Nouvelle version", value: <span className="text-purple-300 font-mono font-bold">{versionFinal}</span> },
                    { label: "Précédente version", value: <span className="text-gray-500 font-mono">v{software.currentVersion}</span> },
                    { label: "Type", value: releaseTypes.find((r) => r.value === releaseType)?.label },
                    { label: "Date", value: today },
                    { label: "Taille fichier", value: fileSize || "–" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                      <p className="text-gray-200">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {breaking && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold">
                      <AlertTriangle className="w-3 h-3" /> Breaking change
                    </span>
                  )}
                  {dataPreserved && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold">
                      <Shield className="w-3 h-3" /> Données préservées
                    </span>
                  )}
                  {isBeta && (
                    <span className="px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                      Beta
                    </span>
                  )}
                </div>

                {/* Notes preview */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Changelog ({notes.filter((n) => n.trim()).length} entrées)</p>
                  <ul className="space-y-1">
                    {notes.filter((n) => n.trim()).map((n, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Avertissement MàJ auto */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  {software.autoUpdate
                    ? "Les clients avec la mise à jour automatique activée recevront cette version automatiquement. Les données seront migrées sans interruption."
                    : "La mise à jour automatique est désactivée pour ce logiciel. Les clients verront une notification pour télécharger manuellement."}
                </p>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl border border-white/15 text-gray-400 hover:text-white transition text-sm">
                  ← Retour
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!canPublish}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-500/30 hover:scale-105 transition disabled:opacity-40"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Publier maintenant
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
