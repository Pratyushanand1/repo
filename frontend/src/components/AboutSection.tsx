import { motion } from "framer-motion";
import { Brain, Database, BarChart3, Eye } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "CNN Architecture",
    desc: "Convolutional Neural Network trained on thousands of MRI scans for accurate tumor classification.",
  },
  {
    icon: Database,
    title: "Dataset",
    desc: "Trained on the Brain Tumor MRI Dataset with 4 classes: Glioma, Meningioma, Pituitary, and No Tumor.",
  },
  {
    icon: BarChart3,
    title: "High Accuracy",
    desc: "Achieves ~96.5% classification accuracy with robust preprocessing and augmentation.",
  },
  {
    icon: Eye,
    title: "Grad-CAM",
    desc: "Gradient-weighted Class Activation Mapping highlights the regions influencing the prediction.",
  },
];

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          About the <span className="text-gradient-primary">Model</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Built with modern deep learning techniques for reliable brain tumor detection
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:glow-sm transition-all"
          >
            <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
