# 🧴 Skin Analysis App

An AI-powered web application for detecting skin conditions using YOLO (You Only Look Once) object detection models. The app can detect acne, acne scars, dark circles, eyebags, and wrinkles from uploaded images or webcam captures.

## 📋 Features

- **Multi-Image Upload**: Upload up to 5 images at once (PNG, JPG)
- **Live Webcam Capture**: Take photos directly from your webcam
- **AI-Powered Detection**: Uses 5 specialized YOLO models for different skin conditions
- **Real-time Analysis**: Fast processing with visual results
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## 🔍 Detected Conditions

1. **Acne** - Active acne breakouts
2. **Acne Scars** - Post-acne scarring
3. **Dark Circles** - Under-eye darkness
4. **Eyebags** - Under-eye puffiness
5. **Wrinkles** - Fine lines and wrinkles

## 🏗️ Project Structure

```
face/
├── app.py                  # Main FastAPI application
├── basic_app.py           # CLI version for testing
├── requirements.txt       # Python dependencies
├── .gitignore            # Git ignore rules
├── models/               # YOLO model files (*.pt)
│   ├── acne.pt
│   ├── acne_scars.pt
│   ├── dark_circles.pt
│   ├── eyebags.pt
│   └── wrinkles.pt
├── static/               # Frontend files
│   ├── index.html       # Main HTML page
│   ├── css/
│   │   └── style.css    # Custom styles
│   └── js/
│       └── app.js       # JavaScript logic
├── uploads/             # User uploaded images (auto-created)
```

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Webcam (optional, for live capture)

### Setup Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\wamp64\www\2025\python\machine\hf\face
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify model files**
   Ensure all 5 model files (*.pt) are in the `models/` directory:
   - acne.pt
   - acne_scars.pt
   - dark_circles.pt
   - eyebags.pt
   - wrinkles.pt

## 💻 Usage

### Running the Web Application

1. **Start the server**
   ```bash
   python app.py
   ```

2. **Open your browser**
   Navigate to: `http://localhost:8000`

3. **Analyze skin**
   - Upload images using drag-and-drop or file picker
   - OR enable webcam and capture a photo
   - Click "Analyze Skin" button
   - View results with detected conditions

### Running the CLI Version

For quick testing without the web interface:

```bash
python basic_app.py
```

This will analyze `check.jpg` and save results to `skin_analysis_results.json`.

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Ultralytics YOLO** - Object detection models
- **Uvicorn** - ASGI server
- **aiofiles** - Async file operations

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - No framework dependencies
- **Custom CSS** - Enhanced animations and effects

## 📁 File Separation

The codebase has been refactored for better maintainability:

- **HTML** (`static/index.html`) - Clean semantic structure
- **CSS** (`static/css/style.css`) - Custom styles and animations
- **JavaScript** (`static/js/app.js`) - Modular, well-documented code
- **Python** (`app.py`) - Backend API and model logic

## 🎨 UI Features

- **Gradient backgrounds** with glassmorphism effects
- **Drag-and-drop** file upload
- **Live webcam** preview with capture controls
- **Animated loading** states
- **Responsive grid** layout for results
- **Smooth scrolling** to results
- **Custom scrollbar** styling
- **Hover effects** on interactive elements

## 🔧 API Endpoints

### `GET /`
Returns the main HTML page

### `POST /analyze`
Analyzes uploaded images

**Request:**
- Content-Type: `multipart/form-data`
- Body: `files` (array of image files)

**Response:**
```json
{
  "results": {
    "filename.jpg": {
      "acne": "found" | "not detected",
      "acne_scars": "found" | "not detected",
      "dark_circles": "found" | "not detected",
      "eyebags": "found" | "not detected",
      "wrinkles": "found" | "not detected"
    }
  },
  "processing_time": "1.23s",
  "original_images": ["filename.jpg"]
}
```

## 🔒 Security Notes

- Images are stored with unique UUIDs to prevent conflicts
- CORS is enabled for all origins (configure for production)
- File uploads are limited to 5 images per request
- Only image files are accepted

## 🐛 Troubleshooting

### Models not loading
- Verify all `.pt` files are in the `models/` directory
- Check file permissions

### Webcam not working
- Grant camera permissions in your browser
- Check if another application is using the webcam

### Port already in use
- Change the port in `app.py`:
  ```python
  uvicorn.run(app, host="0.0.0.0", port=8001)
  ```

## 📝 Development Notes

### Code Quality
- JSDoc comments for JavaScript functions
- Type hints in Python code (where applicable)
- Modular function design
- Error handling throughout

### Performance
- Async file operations
- Efficient model loading at startup
- Client-side image preview
- Optimized CSS animations

## 🤝 Contributing

To contribute to this project:

1. Follow the existing code structure
2. Add comments for complex logic
3. Test with multiple image types
4. Update documentation as needed

## 📄 License

This project is for educational and research purposes.

## 🙏 Acknowledgments

- **Ultralytics** for YOLO models
- **FastAPI** for the excellent web framework
- **Tailwind CSS** for rapid UI development

---

**Made with ❤️ for skin health analysis**
