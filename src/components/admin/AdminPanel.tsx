import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, FolderOpen, Mail, Settings,
  LogOut, Code2, Trash2, Download, Users,
  TrendingUp, Bell, ChevronRight, Save, Eye,
  Upload, Star, BarChart3, Globe,
} from "lucide-react";
import DeployGuide from "../DeployGuide";
import { useSoftwareStore } from "../../store/SoftwareStore";
import { useAuth as _useAuth } from "../../store/AuthStore";
const useAuth = _useAuth;
import Workspace from "./Workspace";
import ProjectsWorkspace from "./ProjectsWorkspace";

type Props = { onLogout: () => void };

// ─── Données statiques ────────────────────────────────────────────────────────

const recentMessages = [
  { name: "Jean Dupont", email: "jean@email.com", subject: "Nouveau projet", date: "Il y a 2h", read: false },
  { name: "Marie Claire", email: "marie@email.com", subject: "Question logiciel", date: "Il y a 5h", read: false },
  { name: "Paul Martin", email: "paul@email.com", subject: "Collaboration", date: "Hier", read: true },
  { name: "Sophie L.", email: "sophie@email.com", subject: "Demande de devis", date: "Il y a 2j", read: true },
];

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { id: "workspace", icon: Upload, label: "Logiciels & MàJ" },
  { id: "projects", icon: Code2, label: "Projets & Code" },
  { id: "portfolio", icon: FolderOpen, label: "Portfolio" },
  { id: "messages", icon: Mail, label: "Messages", badge: 2 },
  { id: "settings", icon: Settings, label: "Paramètres" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ setActive }: { setActive: (s: string) => void }) {
  const { softwares, getTotalDownloads, getTotalUsers } = useSoftwareStore();
  const { users } = useAuth();
  const [showDeploy, setShowDeploy] = useState(false);

  const stats = [
    { icon: Download, label: "Téléchargements totaux", value: getTotalDownloads().toLocaleString("fr-FR"), trend: "+12%", color: "from-purple-500 to-indigo-500" },
    { icon: Package, label: "Logiciels publiés", value: softwares.length, trend: `${softwares.filter(s => s.status === "new").length} nouveaux`, color: "from-cyan-500 to-blue-500" },
    { icon: Users, label: "Membres inscrits", value: users.length, trend: "Nouveaux comptes", color: "from-green-400 to-emerald-500" },
    { icon: FolderOpen, label: "Utilisateurs actifs (logiciels)", value: getTotalUsers().toLocaleString("fr-FR"), trend: "+8%", color: "from-orange-400 to-red-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white mb-1">Tableau de bord</h2>
        <p className="text-gray-500 text-sm">Bienvenue, Allyjoph 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ icon: Icon, label, value, trend, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Workspace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-cyan-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">Espace de travail</h3>
            <p className="text-gray-400 text-sm">
              Publiez une nouvelle version de vos logiciels en quelques clics.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActive("workspace")}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 hover:scale-105 transition"
        >
          Ouvrir →
        </button>
      </motion.div>

      {/* CTA Déploiement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-900/15 to-cyan-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">Publier votre site en ligne</h3>
            <p className="text-gray-400 text-sm">Guide complet pour déployer sur Vercel — gratuit, accessible par tout le monde</p>
          </div>
        </div>
        <button
          onClick={() => setShowDeploy(true)}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-green-500/30 hover:scale-105 transition"
        >
          <Globe className="w-4 h-4" /> Guide de déploiement
        </button>
      </motion.div>

      {/* Messages récents */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-bold">Messages récents</h3>
          <span className="text-xs text-purple-400 font-semibold">2 non lus</span>
        </div>
        <div className="divide-y divide-white/5">
          {recentMessages.map((msg) => (
            <div key={msg.email} className={`flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition ${!msg.read ? "bg-purple-500/5" : ""}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? "bg-purple-400" : "bg-transparent"}`} />
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {msg.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${!msg.read ? "text-white" : "text-gray-300"}`}>{msg.name}</span>
                  <span className="text-xs text-gray-600">{msg.date}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Logiciels récents */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" /> Top logiciels
          </h3>
          <div className="space-y-3">
            {softwares.map((sw) => (
              <div key={sw.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{sw.name}</span>
                    <span className="text-xs text-gray-500">{sw.downloads}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-700"
                      style={{ width: `${Math.min((sw.downloads / getTotalDownloads()) * 100 * 1.5, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" /> Actions rapides
          </h3>
          <div className="space-y-2">
            {[
              { label: "Espace de travail", icon: Upload, color: "text-purple-400", action: () => setActive("workspace") },
              { label: "Voir les messages", icon: Mail, color: "text-green-400", action: () => setActive("messages") },
              { label: "Paramètres", icon: Settings, color: "text-orange-400", action: () => setActive("settings") },
              { label: "Voir le site public", icon: Eye, color: "text-cyan-400", action: () => window.open("/", "_blank") },
              { label: "Publier le site", icon: Globe, color: "text-emerald-400", action: () => setShowDeploy(true) },
            ].map(({ label, icon: Icon, color, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm text-gray-300">{label}</span>
                <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide déploiement */}
      <AnimatePresence>
        {showDeploy && <DeployGuide onClose={() => setShowDeploy(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Messages ─────────────────────────────────────────────────────────────────

function MessagesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Messages</h2>
        <p className="text-gray-500 text-sm">Messages reçus via le formulaire de contact</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5 overflow-hidden">
        {recentMessages.map((msg) => (
          <div key={msg.email} className={`flex items-start gap-4 px-6 py-5 hover:bg-white/5 transition cursor-pointer ${!msg.read ? "bg-purple-500/5" : ""}`}>
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.read ? "bg-purple-400" : "bg-transparent"}`} />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {msg.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold ${!msg.read ? "text-white" : "text-gray-300"}`}>{msg.name}</span>
                <span className="text-xs text-gray-600">{msg.date}</span>
              </div>
              <p className="text-xs text-gray-500">{msg.email}</p>
              <p className={`text-sm mt-1 ${!msg.read ? "text-gray-200 font-medium" : "text-gray-400"}`}>{msg.subject}</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Paramètres ───────────────────────────────────────────────────────────────

function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Paramètres</h2>
        <p className="text-gray-500 text-sm">Configuration de votre panneau d'administration</p>
      </div>
      <div className="space-y-4">
        {[
          { label: "Nom affiché", value: "Allyjoph", type: "text" },
          { label: "Email de contact", value: "allyjoph@alluriel.com", type: "email" },
          { label: "Slogan du site", value: "Développeur logiciel passionné", type: "text" },
        ].map(({ label, value, type }) => (
          <div key={label} className="p-5 rounded-2xl border border-white/10 bg-white/5">
            <label className="block text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">{label}</label>
            <input
              type={type}
              defaultValue={value}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition"
            />
          </div>
        ))}
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:scale-105 transition">
          <Save className="w-4 h-4" /> Enregistrer les modifications
        </button>
        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
          <h3 className="text-red-400 font-semibold text-sm mb-1">Zone dangereuse</h3>
          <p className="text-gray-500 text-xs mb-3">Ces actions sont irréversibles.</p>
          <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition">
            Réinitialiser toutes les données
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio (placeholder) ──────────────────────────────────────────────────

function PortfolioSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Portfolio</h2>
          <p className="text-gray-500 text-sm">Gérez vos projets affichés sur le site</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:scale-105 transition">
          + Ajouter un projet
        </button>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-gray-600 border border-dashed border-white/10 rounded-2xl">
        <FolderOpen className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">Gestion du portfolio — À venir</p>
        <p className="text-xs mt-1 text-gray-700">Les projets sont gérés directement dans le code pour l'instant.</p>
      </div>
    </div>
  );
}

// ─── AdminPanel principal ─────────────────────────────────────────────────────

export default function AdminPanel({ onLogout }: Props) {
  const [active, setActive] = useState("dashboard");
  const { softwares } = useSoftwareStore();

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <Dashboard setActive={setActive} />;
      case "workspace": return <Workspace />;
      case "projects": return <ProjectsWorkspace />;
      case "portfolio": return <PortfolioSection />;
      case "messages": return <MessagesSection />;
      case "settings": return <SettingsSection />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Section en cours de développement</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#06060f] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm">Allyjoph</div>
              <div className="text-[10px] text-purple-400 uppercase tracking-widest font-semibold">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === id
                  ? "bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-white border border-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Résumé logiciels */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold px-2">Logiciels</p>
          {softwares.slice(0, 3).map((sw) => (
            <div key={sw.id} className="flex items-center gap-2 px-2 py-1">
              <div className={`w-2 h-2 rounded-full ${sw.status === "stable" ? "bg-green-400" : sw.status === "beta" ? "bg-yellow-400" : "bg-purple-400"}`} />
              <span className="text-xs text-gray-500 truncate flex-1">{sw.name}</span>
              <span className="text-xs text-gray-700 font-mono">v{sw.currentVersion}</span>
            </div>
          ))}
          {softwares.length > 3 && (
            <p className="text-xs text-gray-700 px-2">+{softwares.length - 3} autres...</p>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
