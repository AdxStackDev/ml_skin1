from ultralytics import YOLO
import json
import os

model_file = 'yolov8s.pt' 
image_path = 'yolo.jpg'

output_folder = 'output'
os.makedirs(output_folder, exist_ok=True)

result = {}

model_path = os.path.join('models', model_file)

if os.path.exists(model_path):
    print(f"Running {model_file}...")
    
    model = YOLO(model_path)
    
    detection_results = model(image_path, verbose=False)
    boxes = detection_results[0].boxes
    print(detection_results)
    
    model_name = model_file.replace('.pt', '')
    
    
    if boxes is not None and len(boxes) > 0:
        conf = float(boxes.conf[0])
        
        if conf > 0.5:
            result[model_name] = "found/detected"
            result[f"{model_name}_confidence"] = round(conf, 2)
            print(f"✓ {model_file}: found/detected (conf: {conf:.2f})")
        else:
            result[model_name] = "not detected"
            result[f"{model_name}_confidence"] = round(conf, 2)
            print(f"✗ {model_file}: low confidence ({conf:.2f})")
        
        output_name = os.path.join(output_folder, f"output_{model_name}.jpg")
        detection_results[0].save(output_name)
        print(f"  Saved: {output_name}")
    else:
        result[model_name] = "not detected"
        result[f"{model_name}_confidence"] = 0.0
        print(f"✗ {model_file}: not detected")
else:
    result[model_file.replace('.pt', '')] = "model missing"
    print(f"✗ {model_file}: file not found at {model_path}")

json_output = json.dumps(result, indent=2)
print("\n=== JSON RESULTS ===")
print(json_output)
output_json_file = os.path.join(output_folder, f"single_model_result_{model_file.replace('.pt', '')}.json")
with open(output_json_file, 'w') as f:
    f.write(json_output)

print("Annotated image saved!")
print(f"Results saved to '{output_json_file}'")
