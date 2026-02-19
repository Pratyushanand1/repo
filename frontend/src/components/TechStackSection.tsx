import { motion } from "framer-motion";

const stack = [
  { name: "TensorFlow / Keras", category: "Model" },
  { name: "FastAPI", category: "Backend" },
  { name: "React", category: "Frontend" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Python", category: "Language" },
  { name: "NumPy", category: "Processing" },
  { name: "OpenCV", category: "Image" },
  { name: "Docker", category: "Deploy" },
];

const TechStackSection = () => (
  <section id="tech" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Tech <span className="text-gradient-primary">Stack</span>
        </h2>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
        {stack.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl px-5 py-3 text-center hover:glow-sm transition-all"
          >
            <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.category}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TechStackSection;
