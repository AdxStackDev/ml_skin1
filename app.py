from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import json
import os
from pathlib import Path
import time
import shutil
import uuid
import aiofiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories first
upload_dir = "uploads"
os.makedirs(upload_dir, exist_ok=True)

# Serve uploads and static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static", StaticFiles(directory="static"), name="static")

model_files = ['acne.pt', 'acne_scars.pt', 'dark_circles.pt', 'eyebags.pt', 'wrinkles.pt']
models = {}

# Load models
print("Loading models...")
for model_file in model_files:
    model_path = os.path.join('models', model_file)
    if os.path.exists(model_path):
        models[model_file] = YOLO(model_path)
        print(f"✓ Loaded {model_file}")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main HTML page"""
    html_path = os.path.join("static", "index.html")
    async with aiofiles.open(html_path, "r", encoding="utf-8") as f:
        html_content = await f.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/analyze")
async def analyze_image(files: list[UploadFile] = File(...)):
    """Analyze uploaded images for skin conditions"""
    start_time = time.time()
    results = {}
    
    for file in files[:5]:
        # Generate unique filename
        ext = Path(file.filename).suffix or '.jpg'
        unique_filename = f"{uuid.uuid4().hex[:8]}{ext}"
        image_path = os.path.join(upload_dir, unique_filename)
        
        # Save original using async file operations
        async with aiofiles.open(image_path, "wb") as buffer:
            content = await file.read()
            await buffer.write(content)
        
        # Analyze with each model
        file_results = {}
        for model_file, model in models.items():
            feature_name = model_file.replace('.pt', '')
            try:
                # Run YOLO detection
                detection_results = model(image_path, verbose=False, save=False)
                boxes = detection_results[0].boxes
                
                # Check if any detections were found
                if boxes is not None and len(boxes) > 0:
                    conf = float(boxes.conf[0])
                    if conf > 0.5:
                        file_results[feature_name] = "found"
                        print(f"✓ {feature_name}: found (confidence: {conf:.2f})")
                    else:
                        file_results[feature_name] = "not detected"
                        print(f"✗ {feature_name}: low confidence ({conf:.2f})")
                else:
                    file_results[feature_name] = "not detected"
                    print(f"✗ {feature_name}: not detected")
                    
            except Exception as e:
                file_results[feature_name] = "error"
                print(f"❌ {feature_name}: error - {str(e)}")
        
        results[unique_filename] = file_results
    
    processing_time = time.time() - start_time
    print(f"\n✅ Analysis complete in {processing_time:.2f}s")
    
    return {
        "results": results,
        "processing_time": f"{processing_time:.2f}s",
        "original_images": list(results.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
