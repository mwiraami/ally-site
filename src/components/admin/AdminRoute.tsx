import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function AdminRoute() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifie si la session admin est active
    const auth = sessionStorage.getItem("ally_admin_auth");
    if (auth === "1") setAuthenticated(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("ally_admin_auth");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
