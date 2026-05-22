import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;       // initiales colorées
  color: string;        // couleur avatar
  role: "member" | "vip";
  joinedAt: string;
  downloads: number;
};

type AuthContextType = {
  user: User | null;
  users: User[];
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  showAuthModal: boolean;
  authTab: "login" | "register";
  openAuth: (tab?: "login" | "register") => void;
  closeAuth: () => void;
  setAuthTab: (tab: "login" | "register") => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "allyjoph_users_v1";
const SESSION_KEY = "allyjoph_session_v1";

const avatarColors = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-600",
  "from-green-400 to-emerald-500",
  "from-orange-400 to-red-500",
  "from-yellow-400 to-amber-500",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-purple-600",
  "from-teal-400 to-cyan-500",
];

function hashPassword(password: string): string {
  // Simple hash pour stockage local (en prod → bcrypt côté serveur)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return btoa(hash.toString() + password.length.toString());
}

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUsers(users: User[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}

function loadSession(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(user: User | null) {
  try {
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Stocker les hash séparément (sécurité)
  const getPasswords = (): Record<string, string> => {
    try { return JSON.parse(localStorage.getItem("allyjoph_pw") ?? "{}"); } catch { return {}; }
  };
  const savePasswords = (pw: Record<string, string>) => {
    try { localStorage.setItem("allyjoph_pw", JSON.stringify(pw)); } catch {}
  };

  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => { saveSession(user); }, [user]);

  const register = async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    if (!name.trim() || !email.trim() || !password.trim())
      return { ok: false, error: "Tous les champs sont obligatoires." };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { ok: false, error: "Adresse email invalide." };

    if (password.length < 6)
      return { ok: false, error: "Le mot de passe doit faire au moins 6 caractères." };

    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: "Un compte existe déjà avec cet email." };

    const initials = name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
    const colorIdx = users.length % avatarColors.length;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: initials,
      color: avatarColors[colorIdx],
      role: "member",
      joinedAt: new Date().toISOString().split("T")[0],
      downloads: 0,
    };

    const pw = getPasswords();
    pw[newUser.id] = hashPassword(password);
    savePasswords(pw);

    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setShowAuthModal(false);
    return { ok: true };
  };

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) return { ok: false, error: "Aucun compte trouvé avec cet email." };

    const pw = getPasswords();
    if (pw[found.id] !== hashPassword(password))
      return { ok: false, error: "Mot de passe incorrect." };

    setUser(found);
    setShowAuthModal(false);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    saveSession(null);
  };

  const openAuth = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  const closeAuth = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{
      user, users, isLoggedIn: !!user,
      login, register, logout,
      showAuthModal, authTab, openAuth, closeAuth, setAuthTab,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
