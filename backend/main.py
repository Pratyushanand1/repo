"""
Brain Tumor Detection API
FastAPI backend that loads a trained VGG16-based model and serves predictions.
"""

import os
import json
import logging
from contextlib import asynccontextmanager

import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import tensorflow as tf
from io import BytesIO

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
IMAGE_SIZE = 128
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
CONFIDENCE_THRESHOLD = 0.60
MODEL_PATH = os.getenv("MODEL_PATH", "model/brain_tumor_model.keras")
CLASS_NAMES_PATH = os.getenv("CLASS_NAMES_PATH", "model/class_names.json")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("brain-tumor-api")

# ---------------------------------------------------------------------------
# Global model & class names (loaded once at startup)
# ---------------------------------------------------------------------------
model = None
class_names: list[str] = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model and class names once at startup."""
    global model, class_names

    logger.info("Loading class names from %s", CLASS_NAMES_PATH)
    with open(CLASS_NAMES_PATH, "r") as f:
        class_names = json.load(f)
    logger.info("Class names: %s", class_names)

    logger.info("Loading model from %s", MODEL_PATH)
    model = tf.keras.models.load_model(MODEL_PATH)
    logger.info("Model loaded successfully.")

    yield  # app is running

    logger.info("Shutting down.")


app = FastAPI(
    title="Brain Tumor Detection API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the React frontend from any origin during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def validate_file(file: UploadFile) -> None:
    """Validate uploaded file type."""
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '.{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    EXACT preprocessing matching the Colab notebook:
    1. Open image
    2. Convert to RGB
    3. Resize to (IMAGE_SIZE, IMAGE_SIZE)
    4. Convert to numpy array (float32)
    5. Divide by 255.0
    6. Expand dimensions (add batch axis)
    """
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
async def root():
    return {"status": "ok", "message": "Brain Tumor Detection API is running."}


@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate file type
    validate_file(file)

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(contents)} bytes). Max: {MAX_FILE_SIZE} bytes.",
        )

    try:
        img_array = preprocess_image(contents)
    except Exception as e:
        logger.error("Preprocessing error: %s", e)
        raise HTTPException(status_code=400, detail="Could not process the image.")

    # Inference
    predictions = model.predict(img_array)
    probabilities = predictions[0].tolist()

    predicted_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_index])
    predicted_class = class_names[predicted_index]

    # Build probability map
    all_probabilities = {
        class_names[i]: round(probabilities[i], 4) for i in range(len(class_names))
    }

    # Low confidence safety
    if confidence < CONFIDENCE_THRESHOLD:
        predicted_class = "Low Confidence Prediction"

    logger.info(
        "Prediction: %s (%.2f%%) | Probabilities: %s",
        predicted_class,
        confidence * 100,
        all_probabilities,
    )

    return JSONResponse(
        content={
            "prediction": predicted_class,
            "confidence": round(confidence, 4),
            "all_probabilities": all_probabilities,
        }
    )
