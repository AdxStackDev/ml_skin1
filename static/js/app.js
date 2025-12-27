/**
 * Skin Analysis Platform - Main JavaScript
 * With Image Carousel Support
 */

// ============================================
// GLOBAL STATE
// ============================================
let selectedFiles = [];
let mediaStream = null;
let isWebcamActive = false;
let analysisResults = null;
let currentCarouselIndex = 0;

// ============================================
// DOM ELEMENTS
// ============================================
const fileInput = document.getElementById('imageInput');
const dropZone = document.getElementById('fileDropZone');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewGrid = document.getElementById('imagePreviewGrid');
const analyzeBtn = document.getElementById('analyzeBtn');
const analyzeBtnText = document.getElementById('analyzeBtnText');
const toggleWebcamBtn = document.getElementById('toggleWebcam');
const webcamVideo = document.getElementById('webcam');
const webcamPlaceholder = document.getElementById('webcamPlaceholder');
const webcamOverlay = document.getElementById('webcamOverlay');
const captureBtn = document.getElementById('captureBtn');
const webcamCanvas = document.getElementById('webcamCanvas');
const webcamPreview = document.getElementById('webcamPreview');

// ============================================
// FILE UPLOAD HANDLERS
// ============================================

function initFileUpload() {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
    });
}

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('dragging');
}

function handleDragLeave() {
    dropZone.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(files);
}

function handleFiles(files) {
    const remainingSlots = 5 - selectedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    selectedFiles = [...selectedFiles, ...filesToAdd];
    updatePreview();
    updateAnalyzeBtn();
}

function updatePreview() {
    if (selectedFiles.length === 0) {
        imagePreview.classList.add('hidden');
        return;
    }

    imagePreview.classList.remove('hidden');
    imagePreviewGrid.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = `Preview ${index + 1}`;

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removeFile(index);

        div.appendChild(img);
        div.appendChild(removeBtn);
        imagePreviewGrid.appendChild(div);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updatePreview();
    updateAnalyzeBtn();
}

function clearAllImages() {
    selectedFiles = [];
    updatePreview();
    updateAnalyzeBtn();
    fileInput.value = '';
}

function updateAnalyzeBtn() {
    const count = selectedFiles.length;
    analyzeBtn.disabled = count === 0;
    analyzeBtnText.textContent = `Analyze Images (${count})`;
}

// ============================================
// WEBCAM HANDLERS
// ============================================

function initWebcam() {
    toggleWebcamBtn.addEventListener('click', toggleWebcam);
    captureBtn.addEventListener('click', captureImage);
    document.getElementById('retakeBtn').addEventListener('click', retakeImage);
    document.getElementById('useCaptureBtn').addEventListener('click', useCapturedImage);
}

async function toggleWebcam() {
    if (!isWebcamActive) {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Your browser does not support webcam access.');
                return;
            }

            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });

            webcamVideo.srcObject = mediaStream;
            webcamVideo.classList.remove('hidden');
            webcamPlaceholder.classList.add('hidden');
            webcamOverlay.classList.remove('hidden');
            toggleWebcamBtn.textContent = 'Stop Webcam';
            toggleWebcamBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            toggleWebcamBtn.classList.add('bg-red-600', 'hover:bg-red-700');
            isWebcamActive = true;
        } catch (err) {
            console.error('Webcam error:', err);
            alert('Camera access denied. Please allow camera permission.');
        }
    } else {
        stopWebcam();
    }
}

function captureImage() {
    webcamCanvas.width = webcamVideo.videoWidth;
    webcamCanvas.height = webcamVideo.videoHeight;
    webcamCanvas.getContext('2d').drawImage(webcamVideo, 0, 0);
    webcamPreview.classList.remove('hidden');
    document.getElementById('capturedImage').src = webcamCanvas.toDataURL('image/jpeg');
    webcamOverlay.classList.add('hidden');
}

function retakeImage() {
    webcamPreview.classList.add('hidden');
    webcamOverlay.classList.remove('hidden');
}

function useCapturedImage() {
    webcamCanvas.toBlob(blob => {
        const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFiles([file]);
        stopWebcam();
    }, 'image/jpeg', 0.9);
}

function stopWebcam() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    webcamVideo.classList.add('hidden');
    webcamPlaceholder.classList.remove('hidden');
    webcamOverlay.classList.add('hidden');
    webcamPreview.classList.add('hidden');
    toggleWebcamBtn.textContent = 'Enable Webcam';
    toggleWebcamBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
    toggleWebcamBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    isWebcamActive = false;
}

// ============================================
// ANALYSIS HANDLERS
// ============================================

function initAnalysis() {
    analyzeBtn.addEventListener('click', analyzeImages);
}

async function analyzeImages() {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        analysisResults = data;
        displayResults(data);
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Analysis failed: ' + error.message);
    } finally {
        loading.classList.add('hidden');
    }
}

function displayResults(data) {
    document.getElementById('timeTaken').textContent = `Processed in ${data.processing_time}`;

    // Build carousel
    buildCarousel(data);

    // Show first image results
    showImageResults(0);

    // Show results section and hide upload section
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('uploadSection').classList.add('hidden');

    // Scroll to results
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

function buildCarousel(data) {
    const track = document.getElementById('carouselTrack');
    const indicators = document.getElementById('carouselIndicators');
    const images = data.original_images;

    track.innerHTML = '';
    indicators.innerHTML = '';

    // Create carousel items
    images.forEach((imageName, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `<img src="/uploads/${imageName}" alt="Image ${index + 1}">`;
        track.appendChild(item);

        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = index === 0 ? 'active' : '';
        indicator.onclick = () => goToSlide(index);
        indicators.appendChild(indicator);
    });

    // Show/hide navigation arrows
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (images.length > 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        prevBtn.onclick = () => goToSlide(currentCarouselIndex - 1);
        nextBtn.onclick = () => goToSlide(currentCarouselIndex + 1);
    } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }

    currentCarouselIndex = 0;
}

function goToSlide(index) {
    const images = analysisResults.original_images;

    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentCarouselIndex = index;

    // Update carousel position
    const track = document.getElementById('carouselTrack');
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update indicators
    const indicators = document.querySelectorAll('#carouselIndicators button');
    indicators.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Update results
    showImageResults(index);
}

function showImageResults(index) {
    const imageName = analysisResults.original_images[index];
    const results = analysisResults.results[imageName];

    const features = {
        'acneResult': { name: 'acne', label: 'Acne', icon: '🔴' },
        'acneScarsResult': { name: 'acne_scars', label: 'Acne Scars', icon: '🟤' },
        'darkCirclesResult': { name: 'dark_circles', label: 'Dark Circles', icon: '🟣' },
        'eyebagsResult': { name: 'eyebags', label: 'Eyebags', icon: '👁️' },
        'wrinklesResult': { name: 'wrinkles', label: 'Wrinkles', icon: '📏' }
    };

    Object.entries(features).forEach(([cardId, feature]) => {
        const status = results[feature.name];
        const isDetected = status === 'found';
        const isError = status === 'error';

        let cardClass, statusClass, statusText, icon;

        if (isError) {
            cardClass = 'error';
            statusClass = 'error';
            statusText = 'Error';
            icon = '⚠️';
        } else if (isDetected) {
            cardClass = 'detected';
            statusClass = 'detected';
            statusText = 'Detected';
            icon = feature.icon;
        } else {
            cardClass = 'clear';
            statusClass = 'clear';
            statusText = 'Clear';
            icon = '✓';
        }

        document.getElementById(cardId).className = `result-card ${cardClass}`;
        document.getElementById(cardId).innerHTML = `
            <div class="result-icon">${icon}</div>
            <div class="result-label">${feature.label}</div>
            <span class="result-status ${statusClass}">${statusText}</span>
        `;
    });
}

function resetAnalysis() {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('uploadSection').classList.remove('hidden');
    clearAllImages();
    analysisResults = null;
    currentCarouselIndex = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initFileUpload();
    initWebcam();
    initAnalysis();
    window.addEventListener('beforeunload', stopWebcam);
    console.log('✅ Skin Analysis Platform initialized');
}

// Start app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
