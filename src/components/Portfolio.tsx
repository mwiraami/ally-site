import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, Palette, Monitor, Smartphone, Server, BarChart3 } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  color: string;
  tags: string[];
  link: string;
  featured: boolean;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Système de Gestion ERP",
    description:
      "Application ERP complète pour PME : comptabilité, RH, stocks, facturation. Interface intuitive avec tableaux de bord dynamiques.",
    category: "Desktop",
    icon: Monitor,
    color: "from-purple-500 to-indigo-600",
    tags: ["C#", ".NET", "SQL Server", "WPF"],
    link: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Plateforme E-learning",
    description:
      "Plateforme d'apprentissage en ligne avec cours vidéo, quiz interactifs, certifications et système de paiement intégré.",
    category: "Web",
    icon: Code2,
    color: "from-cyan-500 to-blue-600",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
    featured: true,
  },
  {
    id: 3,
    title: "App Mobile Santé",
    description:
      "Application mobile de suivi de santé : calories, sommeil, activité physique, avec IA pour les recommandations personnalisées.",
    category: "Mobile",
    icon: Smartphone,
    color: "from-green-400 to-teal-500",
    tags: ["React Native", "Firebase", "AI"],
    link: "#",
    featured: false,
  },
  {
    id: 4,
    title: "Dashboard Analytics",
    description:
      "Tableau de bord analytique temps réel pour e-commerce : ventes, trafic, conversions avec graphiques interactifs.",
    category: "Web",
    icon: BarChart3,
    color: "from-orange-400 to-red-500",
    tags: ["Vue.js", "D3.js", "Python", "FastAPI"],
    link: "#",
    featured: false,
  },
  {
    id: 5,
    title: "API Gateway Sécurisée",
    description:
      "Architecture microservices avec API gateway, authentification JWT, rate limiting, logging centralisé.",
    category: "Backend",
    icon: Server,
    color: "from-pink-500 to-rose-600",
    tags: ["Node.js", "Docker", "Redis", "Nginx"],
    link: "#",
    featured: false,
  },
  {
    id: 6,
    title: "Design System UI",
    description:
      "Bibliothèque de composants React réutilisables avec documentation Storybook, tests automatisés et thème personnalisable.",
    category: "Design",
    icon: Palette,
    color: "from-amber-400 to-yellow-500",
    tags: ["React", "Storybook", "Figma", "SCSS"],
    link: "#",
    featured: false,
  },
];

const categories = ["Tous", "Web", "Desktop", "Mobile", "Backend", "Design"];

export default function Portfolio() {
  const [filter, setFilter] = useState("Tous");
  const filtered =
    filter === "Tous" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-[#0a0a1a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -top-32 right-0 w-80 h-80 bg-cyan-900/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
            Portfolio
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black text-white">
            Mes{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Travaux
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Une sélection de mes projets les plus significatifs, développés avec passion et rigueur.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((project) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${project.color}`} />

                  {project.featured && (
                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                      ⭐ Vedette
                    </div>
                  )}

                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={project.link}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition"
                    >
                      Voir le projet
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
