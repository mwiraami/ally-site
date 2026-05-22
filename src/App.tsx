import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Softwares from "./components/Softwares";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AdminRoute from "./components/admin/AdminRoute";
import { SoftwareProvider } from "./store/SoftwareStore";
import { ProjectProvider } from "./store/ProjectStore";
import { AuthProvider } from "./store/AuthStore";

function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsAdmin(
        window.location.hash === "#/admin" ||
        window.location.pathname === "/admin"
      );
    };
    check();
    window.addEventListener("hashchange", check);
    window.addEventListener("popstate", check);
    return () => {
      window.removeEventListener("hashchange", check);
      window.removeEventListener("popstate", check);
    };
  }, []);
  return isAdmin;
}

function AppContent() {
  const isAdmin = useIsAdmin();

  if (isAdmin) {
    return <AdminRoute />;
  }

  return (
    <div className="bg-[#0a0a1a] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Softwares />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <Footer />
      {/* Modal auth global — accessible depuis toute la page */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SoftwareProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </SoftwareProvider>
    </AuthProvider>
  );
}
