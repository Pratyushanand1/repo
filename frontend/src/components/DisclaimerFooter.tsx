import { Brain, Github, AlertTriangle } from "lucide-react";

const DisclaimerFooter = () => (
  <footer className="border-t border-border">
    {/* Disclaimer */}
    <div className="container mx-auto px-6 py-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-warning/30 bg-warning/5 p-5 text-center">
        <AlertTriangle className="mx-auto mb-2 h-5 w-5 text-warning" />
        <p className="text-sm font-semibold text-foreground mb-1">Medical Disclaimer</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This tool is for educational and research purposes only. It is NOT a substitute for
          professional medical diagnosis. Always consult qualified healthcare professionals for
          medical decisions.
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <span className="font-display font-semibold text-foreground">
          NeuroScan AI
        </span>
      </div>
      <p>B.Tech Final Year Project · Brain Tumor Detection Using Deep Learning</p>
      <a
        href="https://github.com/Pratyushanand1/Brain-Tumor-Detection-Using-Deep-Learning"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 hover:text-primary transition-colors"
      >
        <Github className="h-4 w-4" />
        View on GitHub
      </a>
    </div>
  </footer>
);

export default DisclaimerFooter;
