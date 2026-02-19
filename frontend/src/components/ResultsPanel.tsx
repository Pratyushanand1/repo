import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, FileDown } from "lucide-react";
import type { PredictionResult } from "@/lib/prediction";

interface Props {
  result: PredictionResult | null;
  loading: boolean;
}

const getConfidenceLevel = (c: number) => {
  if (c >= 0.85) return { label: "High Confidence", color: "text-success", Icon: CheckCircle2, desc: "The model is highly confident in this classification." };
  if (c >= 0.6) return { label: "Medium Confidence", color: "text-warning", Icon: AlertTriangle, desc: "Moderate confidence — clinical verification recommended." };
  return { label: "Low Confidence", color: "text-destructive", Icon: XCircle, desc: "Low confidence — manual review strongly recommended." };
};

const displayName = (label: string) => {
  const map: Record<string, string> = {
    glioma: "Glioma",
    meningioma: "Meningioma",
    pituitary: "Pituitary",
    notumor: "No Tumor",
    "Low Confidence Prediction": "Low Confidence",
  };
  return map[label] || label;
};

const barColor = (label: string) => {
  const map: Record<string, string> = {
    glioma: "bg-destructive",
    meningioma: "bg-warning",
    pituitary: "bg-info",
    notumor: "bg-success",
  };
  return map[label] || "bg-primary";
};

const ResultsPanel = ({ result, loading }: Props) => {
  if (!result && !loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Upload and analyze an MRI scan to see results here
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-border p-12">
        <div className="space-y-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 rounded bg-muted animate-pulse" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const conf = getConfidenceLevel(result.confidence);
  const sorted = Object.entries(result.all_probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-border bg-card p-6 space-y-6"
    >
      {/* Prediction */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Prediction</p>
        <h3 className="font-display text-3xl font-bold text-foreground mt-1">{displayName(result.prediction)}</h3>
        <div className={`mt-2 inline-flex items-center gap-1.5 text-sm font-medium ${conf.color}`}>
          <conf.Icon className="h-4 w-4" />
          {(result.confidence * 100).toFixed(1)}% — {conf.label}
        </div>
      </div>

      {/* Probability bars */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Class Probabilities</p>
        {sorted.map(([label, prob]) => (
          <div key={label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-foreground font-medium">{displayName(label)}</span>
              <span className="text-muted-foreground">{(prob * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prob * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${barColor(label)}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Confidence interpretation */}
      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Confidence Interpretation</p>
        <p>{conf.desc}</p>
      </div>

      {/* Download stub */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
        <FileDown className="h-4 w-4" />
        Download Report (PDF)
      </button>
    </motion.div>
  );
};

export default ResultsPanel;
