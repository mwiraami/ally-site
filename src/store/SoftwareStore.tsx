import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Zap, Shield, Cpu, Globe } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReleaseNote = {
  id: string;
  version: string;
  date: string;
  type: "majeur" | "mineur" | "patch" | "sécurité";
  notes: string[];
  breaking: boolean;     // changement majeur qui casse la compatibilité
  dataPreserved: boolean; // les données client sont préservées
  fileUrl: string;       // URL de téléchargement du fichier
  fileSize: string;
  checksum: string;      // hash MD5/SHA pour vérifier l'intégrité
  publishedAt: string;
};

export type Software = {
  id: string;
  name: string;
  description: string;
  longDesc: string;
  category: string;
  iconName: string;
  iconColor: string;
  currentVersion: string;
  latestStableVersion: string;
  status: "stable" | "beta" | "new" | "deprecated";
  tags: string[];
  rating: number;
  downloads: number;
  activeUsers: number;
  autoUpdate: boolean;     // mise à jour automatique activée
  updateChannel: "stable" | "beta" | "nightly";
  releases: ReleaseNote[];
  createdAt: string;
  updatedAt: string;
};

// ─── Données initiales ────────────────────────────────────────────────────────

const STORAGE_KEY = "allyjoph_softwares_v1";

const iconMap: Record<string, React.ElementType> = { Zap, Shield, Cpu, Globe };

const defaultSoftwares: Software[] = [
  {
    id: "ally-manager-pro",
    name: "AllyManager Pro",
    description: "Gestionnaire de tâches et projets ultra-rapide pour professionnels.",
    longDesc: "AllyManager Pro est une application desktop complète pour gérer vos projets, tâches, équipes et deadlines. Interface intuitive, notifications intelligentes et synchronisation cloud incluse.",
    category: "Productivité",
    iconName: "Zap",
    iconColor: "from-purple-500 to-pink-500",
    currentVersion: "2.4.1",
    latestStableVersion: "2.4.1",
    status: "stable",
    tags: ["Windows", "macOS", "Gratuit"],
    rating: 4.8,
    downloads: 1200,
    activeUsers: 890,
    autoUpdate: true,
    updateChannel: "stable",
    releases: [
      {
        id: "r1-3",
        version: "2.4.1",
        date: "10/06/2025",
        type: "patch",
        notes: ["Correction de bugs mineurs sur l'export PDF", "Amélioration des performances de démarrage"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "45.2 MB",
        checksum: "sha256:a1b2c3d4e5f6...",
        publishedAt: "2025-06-10T10:00:00Z",
      },
      {
        id: "r1-2",
        version: "2.4.0",
        date: "01/05/2025",
        type: "mineur",
        notes: ["Nouvelle interface dark mode", "Ajout de la synchronisation cloud", "Export PDF amélioré", "Nouveau système de notifications"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "44.8 MB",
        checksum: "sha256:b2c3d4e5f6a1...",
        publishedAt: "2025-05-01T08:00:00Z",
      },
      {
        id: "r1-1",
        version: "2.3.0",
        date: "15/03/2025",
        type: "majeur",
        notes: ["Première version stable publique", "Gestion des projets", "Tâches et sous-tâches", "Calendrier intégré"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "42.1 MB",
        checksum: "sha256:c3d4e5f6a1b2...",
        publishedAt: "2025-03-15T09:00:00Z",
      },
    ],
    createdAt: "2025-03-15",
    updatedAt: "2025-06-10",
  },
  {
    id: "ally-secure",
    name: "AllySecure",
    description: "Chiffrez vos fichiers et données sensibles en un clic.",
    longDesc: "AllySecure utilise l'algorithme AES-256 pour protéger vos fichiers. Simple à utiliser, léger et totalement hors-ligne. Idéal pour les professionnels et particuliers soucieux de leur vie privée.",
    category: "Sécurité",
    iconName: "Shield",
    iconColor: "from-cyan-500 to-blue-600",
    currentVersion: "1.2.0",
    latestStableVersion: "1.2.0",
    status: "stable",
    tags: ["Windows", "Gratuit", "Open Source"],
    rating: 4.9,
    downloads: 850,
    activeUsers: 620,
    autoUpdate: true,
    updateChannel: "stable",
    releases: [
      {
        id: "r2-3",
        version: "1.2.0",
        date: "22/05/2025",
        type: "mineur",
        notes: ["Support AES-256-GCM", "Interface redesignée", "Mode ligne de commande ajouté"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "12.4 MB",
        checksum: "sha256:d4e5f6a1b2c3...",
        publishedAt: "2025-05-22T11:00:00Z",
      },
      {
        id: "r2-2",
        version: "1.1.0",
        date: "10/04/2025",
        type: "mineur",
        notes: ["Ajout du chiffrement par lot", "Correction de bugs d'encodage"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "11.8 MB",
        checksum: "sha256:e5f6a1b2c3d4...",
        publishedAt: "2025-04-10T09:00:00Z",
      },
      {
        id: "r2-1",
        version: "1.0.0",
        date: "01/03/2025",
        type: "majeur",
        notes: ["Première release publique", "Chiffrement AES-256", "Interface graphique simple"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "10.5 MB",
        checksum: "sha256:f6a1b2c3d4e5...",
        publishedAt: "2025-03-01T08:00:00Z",
      },
    ],
    createdAt: "2025-03-01",
    updatedAt: "2025-05-22",
  },
  {
    id: "ally-monitor",
    name: "AllyMonitor",
    description: "Surveillez les performances de votre système en temps réel.",
    longDesc: "AllyMonitor est un tableau de bord système qui affiche CPU, RAM, disque, réseau et température. Léger, personnalisable et avec alertes automatiques.",
    category: "Système",
    iconName: "Cpu",
    iconColor: "from-green-400 to-emerald-600",
    currentVersion: "3.0.0-beta",
    latestStableVersion: "2.1.0",
    status: "beta",
    tags: ["Windows", "Linux", "Beta"],
    rating: 4.6,
    downloads: 320,
    activeUsers: 210,
    autoUpdate: false,
    updateChannel: "beta",
    releases: [
      {
        id: "r3-2",
        version: "3.0.0-beta",
        date: "01/07/2025",
        type: "majeur",
        notes: ["Refonte complète de l'interface", "Nouveau moteur de monitoring", "Support Linux ajouté", "Graphiques interactifs"],
        breaking: true,
        dataPreserved: false,
        fileUrl: "#",
        fileSize: "28.7 MB",
        checksum: "sha256:a1c3e5b2d4f6...",
        publishedAt: "2025-07-01T07:00:00Z",
      },
      {
        id: "r3-1",
        version: "2.1.0",
        date: "20/04/2025",
        type: "mineur",
        notes: ["Ajout des alertes CPU", "Graphiques améliorés", "Export des logs"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "22.1 MB",
        checksum: "sha256:b2d4f6a1c3e5...",
        publishedAt: "2025-04-20T10:00:00Z",
      },
    ],
    createdAt: "2025-04-20",
    updatedAt: "2025-07-01",
  },
  {
    id: "ally-web-toolkit",
    name: "AllyWeb Toolkit",
    description: "Boîte à outils pour développeurs web : minifier, formatter, encoder.",
    longDesc: "Une suite d'outils en ligne pour les développeurs : minification JS/CSS, formatage JSON/XML, encodage Base64/URL, générateur de couleurs et bien plus.",
    category: "Développement",
    iconName: "Globe",
    iconColor: "from-orange-400 to-red-500",
    currentVersion: "1.0.0",
    latestStableVersion: "1.0.0",
    status: "new",
    tags: ["Web", "Gratuit", "Nouveau"],
    rating: 4.7,
    downloads: 200,
    activeUsers: 180,
    autoUpdate: true,
    updateChannel: "stable",
    releases: [
      {
        id: "r4-1",
        version: "1.0.0",
        date: "28/06/2025",
        type: "majeur",
        notes: ["Lancement initial", "15 outils disponibles", "Interface responsive", "Mode sombre"],
        breaking: false,
        dataPreserved: true,
        fileUrl: "#",
        fileSize: "5.2 MB",
        checksum: "sha256:c3e5a1b2d4f6...",
        publishedAt: "2025-06-28T12:00:00Z",
      },
    ],
    createdAt: "2025-06-28",
    updatedAt: "2025-06-28",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

type StoreContextType = {
  softwares: Software[];
  getIcon: (name: string) => React.ElementType;
  addSoftware: (sw: Software) => void;
  updateSoftware: (id: string, data: Partial<Software>) => void;
  deleteSoftware: (id: string) => void;
  publishRelease: (softwareId: string, release: ReleaseNote) => void;
  deleteRelease: (softwareId: string, releaseId: string) => void;
  getTotalDownloads: () => number;
  getTotalUsers: () => number;
};

const StoreContext = createContext<StoreContextType | null>(null);

function loadFromStorage(): Software[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultSoftwares;
}

function saveToStorage(data: Software[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function SoftwareProvider({ children }: { children: ReactNode }) {
  const [softwares, setSoftwares] = useState<Software[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(softwares);
  }, [softwares]);

  const getIcon = (name: string): React.ElementType => iconMap[name] || Zap;

  const addSoftware = (sw: Software) => {
    setSoftwares((prev) => [...prev, sw]);
  };

  const updateSoftware = (id: string, data: Partial<Software>) => {
    setSoftwares((prev) =>
      prev.map((sw) => (sw.id === id ? { ...sw, ...data, updatedAt: new Date().toISOString().split("T")[0] } : sw))
    );
  };

  const deleteSoftware = (id: string) => {
    setSoftwares((prev) => prev.filter((sw) => sw.id !== id));
  };

  const publishRelease = (softwareId: string, release: ReleaseNote) => {
    setSoftwares((prev) =>
      prev.map((sw) => {
        if (sw.id !== softwareId) return sw;
        const newReleases = [release, ...sw.releases];
        const isStable = !release.version.includes("beta") && !release.version.includes("alpha");
        return {
          ...sw,
          releases: newReleases,
          currentVersion: release.version,
          latestStableVersion: isStable ? release.version : sw.latestStableVersion,
          updatedAt: new Date().toISOString().split("T")[0],
          status: isStable ? "stable" : sw.status,
        };
      })
    );
  };

  const deleteRelease = (softwareId: string, releaseId: string) => {
    setSoftwares((prev) =>
      prev.map((sw) => {
        if (sw.id !== softwareId) return sw;
        const newReleases = sw.releases.filter((r) => r.id !== releaseId);
        return {
          ...sw,
          releases: newReleases,
          currentVersion: newReleases[0]?.version ?? sw.currentVersion,
          updatedAt: new Date().toISOString().split("T")[0],
        };
      })
    );
  };

  const getTotalDownloads = () => softwares.reduce((sum, sw) => sum + sw.downloads, 0);
  const getTotalUsers = () => softwares.reduce((sum, sw) => sum + sw.activeUsers, 0);

  return (
    <StoreContext.Provider value={{
      softwares,
      getIcon,
      addSoftware,
      updateSoftware,
      deleteSoftware,
      publishRelease,
      deleteRelease,
      getTotalDownloads,
      getTotalUsers,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useSoftwareStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useSoftwareStore must be used within SoftwareProvider");
  return ctx;
}
