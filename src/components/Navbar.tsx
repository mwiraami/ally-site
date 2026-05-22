import { useState, useEffect } from "react";
import { Menu, X, Code2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";
import { useAuth } from "../store/AuthStore";

const navLinks = [
  { label: "Accueil", href: "#home" },
  { label: "À propos", href: "#about" },
  { label: "Logiciels", href: "#softwares" },
  { label: "Travaux", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openAuth, isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goAdmin = () => {
    window.location.hash = "#/admin";
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a1a]/95 backdrop-blur-md shadow-lg shadow-purple-900/20 border-b border-purple-900/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover:shadow-purple-500/70 transition-all duration-300">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-white font-extrabold text-lg tracking-wide">Allyjoph</span>
              <span className="block text-[10px] text-purple-400 font-semibold tracking-widest -mt-1 uppercase">
                Alluriel Business
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            {/* Admin Button (discret) */}
            <button
              onClick={goAdmin}
              title="Administration"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin
            </button>

            {/* User menu (connexion/inscription ou profil) */}
            <UserMenu />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a1a]/98 backdrop-blur-md border-t border-purple-900/30"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition font-medium"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 space-y-2 border-t border-white/10">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { openAuth("login"); setOpen(false); }}
                      className="w-full px-4 py-3 rounded-lg border border-white/15 text-gray-300 font-semibold text-sm hover:text-white hover:bg-white/10 transition"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => { openAuth("register"); setOpen(false); }}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm"
                    >
                      S'inscrire gratuitement
                    </button>
                  </>
                ) : (
                  <div className="px-4">
                    <UserMenu />
                  </div>
                )}
                <button
                  onClick={goAdmin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 font-semibold text-sm"
                >
                  <Lock className="w-3.5 h-3.5" /> Admin
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
