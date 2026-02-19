import { motion } from "framer-motion";
import { ArrowDown, Activity, Shield, Zap } from "lucide-react";
import heroBrain from "@/assets/hero-brain.jpg";

const stats = [
  { icon: Activity, label: "Model Accuracy", value: "96.5%" },
  { icon: Zap, label: "Inference Time", value: "<1s" },
  { icon: Shield, label: "Classes Detected", value: "4" },
];

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroBrain} alt="" className="h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
    </div>

    <div className="container relative z-10 mx-auto px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Deep Learning Powered
        </div>

        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Brain Tumor
          <br />
          <span className="text-gradient-primary">Detection AI</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Upload an MRI scan and get instant AI-powered classification with Grad-CAM
          visualization. Detecting Glioma, Meningioma, Pituitary tumors, and healthy scans.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a
          href="#upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display font-semibold text-primary-foreground transition-all hover:scale-105 glow-primary"
        >
          Analyze MRI Scan
          <ArrowDown className="h-4 w-4" />
        </a>
        <a
          href="#about"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 font-display font-medium text-foreground transition-all hover:border-primary/50 hover:text-primary"
        >
          Learn More
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto"
      >
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center">
            <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
            <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
