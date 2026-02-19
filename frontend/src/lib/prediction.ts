export interface PredictionResult {
  prediction: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  gradcam_url?: string;
}

const TUMOR_CLASSES = ["glioma", "meningioma", "pituitary", "notumor"];

// Demo mode: simulates a prediction when no backend is connected
export const mockPredict = async (): Promise<PredictionResult> => {
  await new Promise((r) => setTimeout(r, 2000));

  const main = Math.random();
  let prediction: string;
  let confidence: number;

  if (main < 0.4) {
    prediction = "glioma";
    confidence = 0.88 + Math.random() * 0.1;
  } else if (main < 0.65) {
    prediction = "meningioma";
    confidence = 0.82 + Math.random() * 0.12;
  } else if (main < 0.85) {
    prediction = "pituitary";
    confidence = 0.85 + Math.random() * 0.1;
  } else {
    prediction = "notumor";
    confidence = 0.9 + Math.random() * 0.08;
  }

  const remaining = 1 - confidence;
  const others = TUMOR_CLASSES.filter((c) => c !== prediction);
  const weights = others.map(() => Math.random());
  const wSum = weights.reduce((a, b) => a + b, 0);

  const all_probabilities: Record<string, number> = { [prediction]: confidence };
  others.forEach((c, i) => {
    all_probabilities[c] = parseFloat(((weights[i] / wSum) * remaining).toFixed(4));
  });

  return { prediction, confidence: parseFloat(confidence.toFixed(4)), all_probabilities };
};

const API_URL = import.meta.env.VITE_API_URL || "";

export const predict = async (file: File): Promise<PredictionResult> => {
  if (!API_URL) return mockPredict();

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
};
