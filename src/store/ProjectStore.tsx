import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectFile = {
  id: string;
  name: string;
  path: string;           // ex: "src/App.tsx"
  language: string;       // ex: "typescript", "css", "json"
  content: string;
  lastModified: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  version: string;
  category: string;
  status: "en cours" | "terminé" | "archivé" | "en pause";
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript",
    html: "html", css: "css", scss: "scss", json: "json",
    py: "python", cs: "csharp", java: "java", cpp: "cpp", c: "c",
    md: "markdown", sql: "sql", sh: "shell", yaml: "yaml", yml: "yaml",
    xml: "xml", php: "php", rs: "rust", go: "go",
  };
  return map[ext] ?? "plaintext";
}

// ─── Données initiales ────────────────────────────────────────────────────────

const STORAGE_KEY = "allyjoph_projects_v1";

const defaultProjects: Project[] = [
  {
    id: "proj-manager-pro",
    name: "AllyManager Pro",
    description: "Application desktop de gestion de tâches et projets",
    color: "from-purple-500 to-pink-500",
    version: "2.4.1",
    category: "Desktop",
    status: "en cours",
    createdAt: "2025-03-15",
    updatedAt: "2025-07-01",
    files: [
      {
        id: "f1",
        name: "App.cs",
        path: "src/App.cs",
        language: "csharp",
        lastModified: "2025-07-01",
        content: `using System;
using System.Windows.Forms;

namespace AllyManagerPro
{
    public class App : Form
    {
        public App()
        {
            this.Text = "AllyManager Pro v2.4.1";
            this.Width = 1200;
            this.Height = 800;
            InitializeComponents();
        }

        private void InitializeComponents()
        {
            // Initialisation de l'interface principale
            var taskPanel = new TaskPanel();
            var projectPanel = new ProjectPanel();
            this.Controls.Add(taskPanel);
            this.Controls.Add(projectPanel);
        }

        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.Run(new App());
        }
    }
}`,
      },
      {
        id: "f2",
        name: "TaskManager.cs",
        path: "src/TaskManager.cs",
        language: "csharp",
        lastModified: "2025-06-28",
        content: `using System;
using System.Collections.Generic;
using System.Linq;

namespace AllyManagerPro
{
    public class TaskManager
    {
        private List<Task> _tasks = new List<Task>();

        public void AddTask(Task task)
        {
            task.Id = Guid.NewGuid().ToString();
            task.CreatedAt = DateTime.Now;
            _tasks.Add(task);
        }

        public List<Task> GetAll() => _tasks.OrderBy(t => t.DueDate).ToList();

        public void Complete(string id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task != null) task.IsCompleted = true;
        }
    }
}`,
      },
      {
        id: "f3",
        name: "README.md",
        path: "README.md",
        language: "markdown",
        lastModified: "2025-07-01",
        content: `# AllyManager Pro

Application desktop de gestion de tâches et projets.

## Fonctionnalités
- Gestion des tâches avec priorités
- Tableaux de bord dynamiques
- Synchronisation cloud
- Export PDF

## Installation
\`\`\`
dotnet restore
dotnet run
\`\`\`

## Version
2.4.1 — Stable
`,
      },
    ],
  },
  {
    id: "proj-secure",
    name: "AllySecure",
    description: "Outil de chiffrement AES-256 de fichiers",
    color: "from-cyan-500 to-blue-600",
    version: "1.2.0",
    category: "Sécurité",
    status: "terminé",
    createdAt: "2025-03-01",
    updatedAt: "2025-05-22",
    files: [
      {
        id: "f4",
        name: "Encryptor.py",
        path: "src/encryptor.py",
        language: "python",
        lastModified: "2025-05-22",
        content: `"""
AllySecure - Chiffrement AES-256-GCM
Version: 1.2.0
"""

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64, os

class Encryptor:
    def __init__(self, key: bytes):
        assert len(key) == 32, "La clé doit faire 256 bits (32 octets)"
        self.key = key

    def encrypt(self, data: bytes) -> dict:
        """Chiffre les données et retourne un dict avec nonce + tag + ciphertext"""
        cipher = AES.new(self.key, AES.MODE_GCM)
        ciphertext, tag = cipher.encrypt_and_digest(data)
        return {
            "nonce": base64.b64encode(cipher.nonce).decode(),
            "tag": base64.b64encode(tag).decode(),
            "ciphertext": base64.b64encode(ciphertext).decode(),
        }

    def decrypt(self, payload: dict) -> bytes:
        """Déchiffre les données"""
        nonce = base64.b64decode(payload["nonce"])
        tag = base64.b64decode(payload["tag"])
        ciphertext = base64.b64decode(payload["ciphertext"])
        cipher = AES.new(self.key, AES.MODE_GCM, nonce=nonce)
        return cipher.decrypt_and_verify(ciphertext, tag)

def encrypt_file(filepath: str, key: bytes) -> str:
    """Chiffre un fichier et retourne le chemin du fichier chiffré"""
    with open(filepath, "rb") as f:
        data = f.read()
    enc = Encryptor(key)
    result = enc.encrypt(data)
    out_path = filepath + ".enc"
    with open(out_path, "w") as f:
        import json
        json.dump(result, f)
    return out_path
`,
      },
      {
        id: "f5",
        name: "main.py",
        path: "main.py",
        language: "python",
        lastModified: "2025-05-20",
        content: `"""
AllySecure - Point d'entrée
"""
import argparse
from src.encryptor import encrypt_file, Encryptor
import os, hashlib

def derive_key(password: str) -> bytes:
    return hashlib.sha256(password.encode()).digest()

def main():
    parser = argparse.ArgumentParser(description="AllySecure - Chiffrement AES-256")
    parser.add_argument("action", choices=["encrypt", "decrypt"])
    parser.add_argument("file", help="Fichier à traiter")
    parser.add_argument("--password", "-p", required=True)
    args = parser.parse_args()

    key = derive_key(args.password)
    if args.action == "encrypt":
        out = encrypt_file(args.file, key)
        print(f"Fichier chiffré : {out}")
    else:
        print("Déchiffrement...")

if __name__ == "__main__":
    main()
`,
      },
    ],
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

type ProjectContextType = {
  projects: Project[];
  addProject: (p: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addFile: (projectId: string, file: ProjectFile) => void;
  updateFile: (projectId: string, fileId: string, content: string) => void;
  deleteFile: (projectId: string, fileId: string) => void;
  renameFile: (projectId: string, fileId: string, newName: string) => void;
  importFiles: (projectId: string, files: ProjectFile[]) => void;
  exportProject: (projectId: string) => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

function load(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultProjects;
}

function save(data: Project[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(load);

  useEffect(() => { save(projects); }, [projects]);

  const addProject = (p: Project) => setProjects((prev) => [p, ...prev]);

  const updateProject = (id: string, data: Partial<Project>) =>
    setProjects((prev) =>
      prev.map((p) => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().split("T")[0] } : p)
    );

  const deleteProject = (id: string) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  const addFile = (projectId: string, file: ProjectFile) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, files: [...p.files, file], updatedAt: new Date().toISOString().split("T")[0] }
          : p
      )
    );

  const updateFile = (projectId: string, fileId: string, content: string) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              files: p.files.map((f) =>
                f.id === fileId
                  ? { ...f, content, lastModified: new Date().toISOString().split("T")[0] }
                  : f
              ),
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );

  const deleteFile = (projectId: string, fileId: string) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, files: p.files.filter((f) => f.id !== fileId) } : p
      )
    );

  const renameFile = (projectId: string, fileId: string, newName: string) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              files: p.files.map((f) =>
                f.id === fileId
                  ? { ...f, name: newName, path: f.path.replace(f.name, newName), language: detectLanguage(newName) }
                  : f
              ),
            }
          : p
      )
    );

  const importFiles = (projectId: string, files: ProjectFile[]) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, files: [...p.files, ...files], updatedAt: new Date().toISOString().split("T")[0] }
          : p
      )
    );

  const exportProject = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const JSZip = (await import("jszip")).default;
    const { saveAs } = await import("file-saver");

    const zip = new JSZip();
    const folder = zip.folder(project.name)!;

    project.files.forEach((file) => {
      folder.file(file.path, file.content);
    });

    // README auto
    folder.file("PROJECT_INFO.md", `# ${project.name}
${project.description}

- **Version** : ${project.version}
- **Catégorie** : ${project.category}
- **Statut** : ${project.status}
- **Créé le** : ${project.createdAt}
- **Mis à jour** : ${project.updatedAt}
- **Fichiers** : ${project.files.length}

---
Exporté depuis Allyjoph Alluriel Business
`);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${project.name.replace(/\s+/g, "_")}_v${project.version}.zip`);
  };

  return (
    <ProjectContext.Provider value={{
      projects, addProject, updateProject, deleteProject,
      addFile, updateFile, deleteFile, renameFile, importFiles, exportProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectStore() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectStore must be used within ProjectProvider");
  return ctx;
}
