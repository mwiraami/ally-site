import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Globe,
  Database,
  Lightbulb,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Développement Web",
    desc: "Sites vitrines, applications web, e-commerce et portails SaaS. Technologies modernes : React, Vue.js, Next.js.",
    features: ["Design responsive", "SEO optimisé", "Performance maximale"],
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Smartphone,
    title: "Applications Mobile",
    desc: "Applications iOS et Android performantes avec React Native ou Flutter. Expérience native garantie.",
    features: ["iOS & Android", "UX soignée", "Notifications push"],
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Code2,
    title: "Logiciels Desktop",
    desc: "Applications Windows et macOS sur mesure. Automatisation, gestion et outils métiers professionnels.",
    features: ["Windows & macOS", "Installation simple", "Mises à jour auto"],
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Database,
    title: "API & Backend",
    desc: "Architecture backend scalable, APIs RESTful ou GraphQL, bases de données optimisées.",
    features: ["REST & GraphQL", "Authentification JWT", "Documentation Swagger"],
    color: "from-orange-400 to-red-500",
  },
  {
    icon: Lightbulb,
    title: "Conseil & Architecture",
    desc: "Audit de votre stack technique, conseils d'architecture et roadmap de développement.",
    features: ["Audit technique", "Roadmap projet", "Choix technologies"],
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: RefreshCw,
    title: "Maintenance & Mises à jour",
    desc: "Support continu, maintenance corrective et évolutive de vos applications existantes.",
    features: ["Support réactif", "Monitoring", "Évolutions régulières"],
    color: "from-amber-400 to-yellow-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#0d0d20] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
            Ce que je propose
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black text-white">
            Mes{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Du développement à la maintenance, je couvre l'ensemble du cycle de vie de vos projets numériques.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.desc}</p>

                <ul className="space-y-2">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl border border-purple-500/20 bg-purple-500/5">
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">Besoin d'un devis ?</h3>
              <p className="text-gray-400 text-sm">Décrivez-moi votre projet, je vous réponds sous 24h.</p>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-all duration-200"
            >
              Obtenir un devis gratuit
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
