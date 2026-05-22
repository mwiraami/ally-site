import { motion } from "framer-motion";
import { Code2, Cpu, Layers, Zap } from "lucide-react";

const skills = [
  { name: "Développement Web", level: 90, color: "from-purple-500 to-pink-500" },
  { name: "Applications Desktop", level: 85, color: "from-cyan-500 to-blue-500" },
  { name: "Applications Mobile", level: 75, color: "from-green-400 to-emerald-500" },
  { name: "Base de données", level: 80, color: "from-orange-400 to-red-500" },
  { name: "API & Backend", level: 82, color: "from-purple-400 to-cyan-400" },
  { name: "UI/UX Design", level: 70, color: "from-pink-400 to-rose-500" },
];

const stats = [
  { icon: Code2, value: "20+", label: "Projets réalisés" },
  { icon: Cpu, value: "10+", label: "Logiciels publiés" },
  { icon: Layers, value: "5+", label: "Ans d'expérience" },
  { icon: Zap, value: "100%", label: "Satisfaction client" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#0a0a1a] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-900/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">
            Qui suis-je ?
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black text-white">
            À propos de <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">moi</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-5 text-gray-300 text-base leading-relaxed">
              <p>
                Bienvenue sur <strong className="text-white">Allyjoph Alluriel Business</strong> — ma plateforme personnelle dédiée à la présentation et à la distribution de mes créations logicielles.
              </p>
              <p>
                Je suis un développeur passionné par la création de solutions numériques innovantes. Mon objectif est de créer des outils qui simplifient la vie, automatisent les tâches complexes et offrent une expérience utilisateur exceptionnelle.
              </p>
              <p>
                Sur ce site, vous pouvez découvrir mes projets, télécharger mes logiciels, suivre leurs mises à jour en temps réel — un peu comme un <strong className="text-purple-300">GitHub personnel</strong> mais avec une interface propre et accessible à tous.
              </p>
              <p>
                Chaque logiciel que je publie est soigneusement développé, testé et documenté. Je crois que la qualité prime sur la quantité.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["React", "TypeScript", "Node.js", "Python", "C#", ".NET", "SQL", "Electron"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-purple-400/50 hover:text-purple-300 transition"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            {skills.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.level}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 mb-4 mx-auto">
                <Icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-sm text-gray-400 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
