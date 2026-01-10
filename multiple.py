from ultralytics import YOLO
import json
import os

model_files = ['acne.pt', 'acne_scars.pt', 'dark_circles.pt', 'eyebags.pt', 'wrinkles.pt']
image_path = 'girl.jpg'

results = {}
all_detections = []

for model_file in model_files:
    model_path = os.path.join('models', model_file)
    
    if os.path.exists(model_path):
        print(f"Running {model_file}...")
        model = YOLO(model_path)
        
        detection_results = model(image_path, verbose=False)
        boxes = detection_results[0].boxes
                
        if boxes is not None and len(boxes) > 0:
            conf = float(boxes.conf[0])
            if conf > 0.5:
                results[model_file.replace('.pt', '')] = "found/detected"
                print(f"✓ {model_file}: found/detected (conf: {conf:.2f})")
            else:
                results[model_file.replace('.pt', '')] = "not detected"
                print(f"✗ {model_file}: low confidence ({conf:.2f})")
            
            output_name = f"output/output_{model_file.replace('.pt', '')}.jpg"
            detection_results[0].save(output_name)
            print(f"  Saved: {output_name}")
            
            all_detections.append(detection_results[0])
        else:
            results[model_file.replace('.pt', '')] = "not detected"
            print(f"✗ {model_file}: not detected")
    else:
        results[model_file.replace('.pt', '')] = "model missing"
        print(f"✗ {model_file}: file not found")

json_output = json.dumps(results, indent=2)
print("\n=== JSON RESULTS ===")
print(json_output)
with open('output/skin_analysis_results.json', 'w') as f:
    f.write(json_output)

print("\n✓ All annotated images saved individually!")
print("✓ Results saved to 'output/skin_analysis_results.json'")
