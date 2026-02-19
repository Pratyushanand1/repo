import { useCallback, useState, useRef } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { predict, type PredictionResult } from "@/lib/prediction";
import ResultsPanel from "./ResultsPanel";

const ACCEPTED = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError(null);
    setResult(null);

    if (!ACCEPTED.includes(f.type)) {
      setError("Only JPG, JPEG, and PNG files are accepted.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File size must be under 10 MB.");
      return;
    }

    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predict(file);
      setResult(res);
    } catch {
      setError("Analysis failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <section id="upload" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            MRI <span className="text-gradient-primary">Analysis</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Upload a brain MRI scan to get an instant AI-powered tumor classification
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2">
          {/* Upload area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {!preview ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Upload className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="font-display font-semibold text-foreground">
                  Drop MRI image here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse · JPG, PNG · Max 10 MB
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-border">
                <img
                  src={preview}
                  alt="MRI scan preview"
                  className="w-full aspect-square object-cover"
                />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {!result && !loading && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                    <button
                      onClick={analyze}
                      className="w-full rounded-xl bg-primary px-6 py-3 font-display font-semibold text-primary-foreground transition-all hover:scale-[1.02] glow-primary"
                    >
                      Analyze Scan
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    <p className="mt-4 text-sm font-medium text-foreground">
                      Analyzing MRI scan…
                    </p>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {!import.meta.env.VITE_API_URL && (
              <p className="mt-3 text-xs text-center text-muted-foreground">
                ⚡ Demo mode — results are simulated. Connect your FastAPI backend via{" "}
                <code className="text-primary">VITE_API_URL</code>.
              </p>
            )}
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ResultsPanel result={result} loading={loading} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
