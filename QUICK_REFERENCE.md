# Quick Reference Guide

## 🚀 Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the app
python app.py

# 3. Open browser
# Navigate to http://localhost:8000
```

## 📂 File Organization

### Backend (Python)
- **`app.py`** - Main FastAPI application (87 lines)
  - Routes: `/` (GET), `/analyze` (POST)
  - Model loading and inference
  - File upload handling

### Frontend (HTML/CSS/JS)
- **`static/index.html`** - Main page structure (140 lines)
  - Semantic HTML5
  - SEO meta tags
  - Accessibility features

- **`static/css/style.css`** - Custom styles (150 lines)
  - Animations
  - Responsive design
  - Custom scrollbar
  - Glass morphism

- **`static/js/app.js`** - Application logic (300 lines)
  - File upload handling
  - Webcam capture
  - API communication
  - Results display

### Configuration
- **`requirements.txt`** - Python dependencies
- **`.gitignore`** - Git ignore rules
- **`README.md`** - Full documentation

### Testing
- **`basic_app.py`** - CLI version for quick testing

## 🔧 Common Tasks

### Adding a New Skin Condition

1. **Add model file** to `models/` directory:
   ```
   models/new_condition.pt
   ```

2. **Update model list** in `app.py`:
   ```python
   model_files = [..., 'new_condition.pt']
   ```

3. **Add result card** in `index.html`:
   ```html
   <div id="newConditionResult" class="result-card h-64"></div>
   ```

4. **Update features map** in `app.js`:
   ```javascript
   const features = {
       ...
       'newConditionResult': 'new_condition'
   };
   ```

### Customizing the UI

**Colors**: Edit `index.html` Tailwind classes
```html
<!-- Change gradient -->
from-purple-600 to-pink-600  →  from-blue-600 to-green-600
```

**Animations**: Edit `static/css/style.css`
```css
@keyframes yourAnimation {
    /* Custom animation */
}
```

**Layout**: Modify grid in `index.html`
```html
<!-- Change columns -->
grid-cols-5  →  grid-cols-3
```

### Debugging

**Check server logs**:
```bash
python app.py
# Look for model loading messages
```

**Check browser console**:
```
F12 → Console tab
# Look for JavaScript errors
```

**Test API directly**:
```bash
curl -X POST http://localhost:8000/analyze \
  -F "files=@check.jpg"
```

## 📊 Code Statistics

| Component | Lines | Purpose |
|-----------|-------|---------|
| app.py | 87 | Backend API |
| index.html | 140 | Page structure |
| style.css | 150 | Custom styles |
| app.js | 300 | Frontend logic |
| **Total** | **677** | **Full app** |

## 🎯 Key Functions

### JavaScript (`app.js`)

```javascript
// File handling
handleFiles(files)          // Process selected files
updatePreview()             // Update image preview grid
removeFile(index)           // Remove file from selection

// Webcam
toggleWebcam()              // Start/stop webcam
captureImage()              // Capture from webcam
useCapturedImage()          // Use captured image

// Analysis
analyzeImages()             // Send to API
displayResults(data)        // Show results
```

### Python (`app.py`)

```python
# Routes
read_root()                 # Serve HTML page
analyze_image(files)        # Analyze uploaded images

# Model inference
model(image_path)           # Run YOLO detection
```

## 🔍 API Response Format

```json
{
  "results": {
    "abc123.jpg": {
      "acne": "found",
      "acne_scars": "not detected",
      "dark_circles": "found",
      "eyebags": "not detected",
      "wrinkles": "not detected"
    }
  },
  "processing_time": "1.23s",
  "original_images": ["abc123.jpg"]
}
```

## 🎨 CSS Classes Reference

### Custom Classes
- `.glass` - Glass morphism effect
- `.gradient-text` - Gradient text
- `.shadow-3xl` - Extra large shadow
- `.result-card` - Result card container

### Animations
- `fadeIn` - Fade in from bottom
- `pulse` - Pulsing effect
- `spin` - Rotation animation

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Models not loading | Check `models/` directory |
| Port in use | Change port in `app.py` |
| Webcam not working | Grant browser permissions |
| CSS not loading | Clear browser cache |
| JS errors | Check browser console |

## 📦 Dependencies

```
fastapi       - Web framework
uvicorn       - ASGI server
ultralytics   - YOLO models
aiofiles      - Async file I/O
opencv-python - Image processing
pillow        - Image handling
```

## 🔐 Security Checklist

- [ ] Configure CORS for production
- [ ] Add rate limiting
- [ ] Validate file types
- [ ] Limit file sizes
- [ ] Sanitize filenames
- [ ] Use HTTPS in production
- [ ] Add authentication (if needed)

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment Options

1. **Local**: `python app.py`
2. **Docker**: Create Dockerfile
3. **Cloud**: Deploy to Heroku/AWS/GCP
4. **VPS**: Use systemd service

## 💡 Tips

- Use `basic_app.py` for quick model testing
- Check `uploads/` for processed images
- Monitor `__pycache__/` size (can delete)
- Keep models in Git LFS if using Git
- Use virtual environment for isolation

---

**Need help?** Check `README.md` for detailed documentation!
