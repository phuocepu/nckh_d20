/**
 * SVD Image Compression - Main Application
 * Using Web Worker for non-blocking computation
 */

// ===== STATE =====
const state = {
    originalImage: null,
    originalWidth: 0,
    originalHeight: 0,
    processedSize: 200,
    colorMode: 'grayscale',
    currentK: 50,
    maxK: 200,
    // SVD results (stored for quick reconstruction)
    svdData: null,         // Grayscale
    svdDataR: null,        // Color R
    svdDataG: null,        // Color G
    svdDataB: null,        // Color B
    imageMatrix: null,
    imageMatrixR: null,
    imageMatrixG: null,
    imageMatrixB: null,
    totalTime: 0
};

// Web Worker
let svdWorker = null;

// ===== DOM ELEMENTS (initialized in init()) =====
let elements = {};

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ===== INITIALIZE =====
function init() {
    // Get DOM elements after DOM is ready
    elements = {
        screenWelcome: document.getElementById('screen-welcome'),
        screenSize: document.getElementById('screen-size'),
        screenProcessing: document.getElementById('screen-processing'),
        screenResult: document.getElementById('screen-result'),
        screenMath: document.getElementById('screen-math'),
        uploadBox: document.getElementById('upload-box'),
        fileInput: document.getElementById('file-input'),
        btnBackSize: document.getElementById('btn-back-size'),
        previewOriginal: document.getElementById('preview-original'),
        originalSize: document.getElementById('original-size'),
        btnStartCompress: document.getElementById('btn-start-compress'),
        processingTitle: document.getElementById('processing-title'),
        processingStatus: document.getElementById('processing-status'),
        procSize: document.getElementById('proc-size'),
        procProgress: document.getElementById('proc-progress'),
        processingHint: document.getElementById('processing-hint'),
        btnBackResult: document.getElementById('btn-back-result'),
        canvasOriginal: document.getElementById('canvas-original'),
        canvasCompressed: document.getElementById('canvas-compressed'),
        statsOriginalSize: document.getElementById('stats-original-size'),
        statsK: document.getElementById('stats-k'),
        kSlider: document.getElementById('k-slider'),
        kValue: document.getElementById('k-value'),
        kMax: document.getElementById('k-max'),
        compressionRatio: document.getElementById('compression-ratio'),
        psnrValue: document.getElementById('psnr-value'),
        energyValue: document.getElementById('energy-value'),
        svdTime: document.getElementById('svd-time'),
        explanationText: document.getElementById('explanation-text'),
        btnShowMath: document.getElementById('btn-show-math'),
        btnBackMath: document.getElementById('btn-back-math'),
        canvasSvChart: document.getElementById('canvas-sv-chart'),
        loadingOverlay: document.getElementById('loading-overlay')
    };

    // Initialize Web Worker
    svdWorker = new Worker('js/svd-worker.js');
    svdWorker.onmessage = handleWorkerMessage;

    setupEventListeners();
}

function setupEventListeners() {
    // File input change (label handles click automatically)
    elements.fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    elements.uploadBox.addEventListener('dragenter', handleDragEnter);
    elements.uploadBox.addEventListener('dragover', handleDragOver);
    elements.uploadBox.addEventListener('dragleave', handleDragLeave);
    elements.uploadBox.addEventListener('drop', handleDrop);

    document.querySelectorAll('.sample-item').forEach(item => {
        item.addEventListener('click', () => loadSampleImage(item.dataset.sample));
    });

    // Color mode toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.colorMode = btn.dataset.mode;
        });
    });

    elements.btnBackSize.addEventListener('click', () => showScreen('screen-welcome'));
    elements.btnBackResult.addEventListener('click', () => showScreen('screen-welcome'));
    elements.btnBackMath.addEventListener('click', () => showScreen('screen-result'));

    elements.btnStartCompress.addEventListener('click', startCompression);

    // Debounced slider for smooth performance
    // Color mode needs longer debounce (3x reconstruction)
    let sliderTimeout;
    elements.kSlider.addEventListener('input', () => {
        elements.kValue.textContent = elements.kSlider.value;
        elements.statsK.textContent = `k = ${elements.kSlider.value}`;

        clearTimeout(sliderTimeout);
        const debounceTime = state.colorMode === 'color' ? 150 : 50;
        sliderTimeout = setTimeout(() => {
            state.currentK = parseInt(elements.kSlider.value);
            updateCompressedImage();
        }, debounceTime);
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const k = btn.dataset.k === 'max' ? state.maxK : parseInt(btn.dataset.k);
            state.currentK = Math.min(k, state.maxK);
            elements.kSlider.value = state.currentK;
            elements.kValue.textContent = state.currentK;
            updateCompressedImage();
            updatePresetButtons();
        });
    });

    elements.btnShowMath.addEventListener('click', () => {
        showScreen('screen-math');
        drawSingularValuesChart();
    });
}

// ===== WEB WORKER MESSAGE HANDLER =====
let pendingChannels = 0;
let computeStartTime = 0;

function handleWorkerMessage(e) {
    const { type, result, channel, progress } = e.data;

    if (type === 'progress') {
        const baseProgress = channel === 'gray' ? 0 :
                            channel === 'R' ? 0 :
                            channel === 'G' ? 33 : 66;
        const channelWeight = state.colorMode === 'grayscale' ? 100 : 33;
        const totalProgress = baseProgress + (progress * channelWeight / 100);
        elements.procProgress.style.width = totalProgress + '%';
    }

    if (type === 'computed') {
        if (channel === 'gray') {
            state.svdData = result;
        } else if (channel === 'R') {
            state.svdDataR = result;
            elements.processingHint.textContent = 'Tính SVD cho kênh G...';
        } else if (channel === 'G') {
            state.svdDataG = result;
            elements.processingHint.textContent = 'Tính SVD cho kênh B...';
        } else if (channel === 'B') {
            state.svdDataB = result;
        }

        pendingChannels--;

        if (pendingChannels === 0) {
            state.totalTime = (performance.now() - computeStartTime) / 1000;
            elements.procProgress.style.width = '100%';
            elements.processingTitle.textContent = 'Hoàn tất!';

            setTimeout(() => {
                showResultScreen();
            }, 300);
        }
    }
}

// ===== DRAG AND DROP =====
function handleDragEnter(e) {
    e.preventDefault();
    elements.uploadBox.classList.add('dragover');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    elements.uploadBox.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadBox.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadBox.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            loadImage(file);
        } else {
            alert('Vui lòng chọn file ảnh (PNG, JPG, JPEG)');
        }
    }
}

// ===== FILE HANDLING =====
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) loadImage(file);
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            state.originalImage = img;
            state.originalWidth = img.width;
            state.originalHeight = img.height;
            showSizeScreen();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function loadSampleImage(type) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (type === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(1, '#fff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
    } else if (type === 'checkerboard') {
        const cellSize = 32;
        for (let y = 0; y < size; y += cellSize) {
            for (let x = 0; x < size; x += cellSize) {
                ctx.fillStyle = ((x + y) / cellSize) % 2 === 0 ? '#000' : '#fff';
                ctx.fillRect(x, y, cellSize, cellSize);
            }
        }
    } else if (type === 'circles') {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 5; i++) {
            const x = 30 + (i % 3) * 80;
            const y = 50 + Math.floor(i / 3) * 120;
            const r = 30 + i * 10;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#333');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const img = new Image();
    img.onload = () => {
        state.originalImage = img;
        state.originalWidth = img.width;
        state.originalHeight = img.height;
        showSizeScreen();
    };
    img.src = canvas.toDataURL();
}

// ===== SIZE SCREEN =====
function showSizeScreen() {
    // Create thumbnail for preview (max 300px) to prevent lag with large images
    const thumbnailSrc = createThumbnail(state.originalImage, 300);
    elements.previewOriginal.src = thumbnailSrc;

    elements.originalSize.textContent = `${state.originalWidth} × ${state.originalHeight}`;

    // Fixed size 200x200
    state.processedSize = 200;

    showScreen('screen-size');
}

// Create a small thumbnail to avoid lag when displaying large images
function createThumbnail(img, maxSize) {
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.8);
}

// ===== COMPRESSION =====
function startCompression() {
    showScreen('screen-processing');

    // Reset progress
    elements.procProgress.style.width = '0%';
    elements.processingTitle.textContent = 'Đang chuẩn bị...';
    elements.processingHint.textContent = 'Chuyển đổi ảnh thành ma trận...';

    // Fixed size 200x200
    const targetSize = 200;
    elements.procSize.textContent = `${targetSize}×${targetSize}`;

    // Use requestAnimationFrame to allow UI update
    requestAnimationFrame(() => {
        setTimeout(() => {
            processImage(targetSize);
        }, 100);
    });
}

function processImage(targetSize) {
    const resizedCanvas = resizeImage(state.originalImage, targetSize);
    const ctx = resizedCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, targetSize, targetSize);

    computeStartTime = performance.now();

    if (state.colorMode === 'grayscale') {
        state.imageMatrix = imageDataToGrayscaleMatrix(imageData);
        state.maxK = Math.min(state.imageMatrix.length, state.imageMatrix[0].length);

        pendingChannels = 1;
        elements.processingTitle.textContent = 'Đang tính toán SVD...';
        elements.processingHint.textContent = 'Phân tích ma trận grayscale...';

        svdWorker.postMessage({
            type: 'compute',
            data: { matrix: state.imageMatrix, channel: 'gray' }
        });
    } else {
        const { R, G, B } = imageDataToRGBMatrices(imageData);
        state.imageMatrixR = R;
        state.imageMatrixG = G;
        state.imageMatrixB = B;
        state.maxK = Math.min(R.length, R[0].length);

        pendingChannels = 3;
        elements.processingTitle.textContent = 'Đang tính toán SVD...';
        elements.processingHint.textContent = 'Tính SVD cho kênh R...';

        svdWorker.postMessage({ type: 'compute', data: { matrix: R, channel: 'R' } });
        svdWorker.postMessage({ type: 'compute', data: { matrix: G, channel: 'G' } });
        svdWorker.postMessage({ type: 'compute', data: { matrix: B, channel: 'B' } });
    }
}

function resizeImage(img, targetSize) {
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    const scale = Math.min(targetSize / img.width, targetSize / img.height);
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (targetSize - width) / 2;
    const y = (targetSize - height) / 2;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, targetSize, targetSize);
    ctx.drawImage(img, x, y, width, height);

    return canvas;
}

function imageDataToGrayscaleMatrix(imageData) {
    const { width, height, data } = imageData;
    const matrix = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            row.push(gray);
        }
        matrix.push(row);
    }
    return matrix;
}

function imageDataToRGBMatrices(imageData) {
    const { width, height, data } = imageData;
    const R = [], G = [], B = [];
    for (let y = 0; y < height; y++) {
        const rowR = [], rowG = [], rowB = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            rowR.push(data[i]);
            rowG.push(data[i + 1]);
            rowB.push(data[i + 2]);
        }
        R.push(rowR);
        G.push(rowG);
        B.push(rowB);
    }
    return { R, G, B };
}

// ===== RESULT SCREEN =====
function showResultScreen() {
    const size = state.colorMode === 'grayscale' ?
                 state.svdData.rows : state.svdDataR.rows;

    elements.canvasOriginal.width = size;
    elements.canvasOriginal.height = size;
    elements.canvasCompressed.width = size;
    elements.canvasCompressed.height = size;

    drawOriginalImage(size);

    elements.kSlider.max = state.maxK;
    elements.kMax.textContent = state.maxK;
    state.currentK = Math.min(50, state.maxK);
    elements.kSlider.value = state.currentK;
    elements.kValue.textContent = state.currentK;

    elements.statsOriginalSize.textContent = `${size} × ${size}`;
    elements.svdTime.textContent = state.totalTime.toFixed(2) + 's';

    updateCompressedImage();
    updatePresetButtons();

    showScreen('screen-result');
}

function drawOriginalImage(size) {
    const ctx = elements.canvasOriginal.getContext('2d');
    const imageData = ctx.createImageData(size, size);

    if (state.colorMode === 'grayscale') {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;
                const gray = state.imageMatrix[y][x];
                imageData.data[i] = gray;
                imageData.data[i + 1] = gray;
                imageData.data[i + 2] = gray;
                imageData.data[i + 3] = 255;
            }
        }
    } else {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;
                imageData.data[i] = state.imageMatrixR[y][x];
                imageData.data[i + 1] = state.imageMatrixG[y][x];
                imageData.data[i + 2] = state.imageMatrixB[y][x];
                imageData.data[i + 3] = 255;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function updateCompressedImage() {
    const k = state.currentK;
    const ctx = elements.canvasCompressed.getContext('2d');
    let size, reconstructed;

    if (state.colorMode === 'grayscale') {
        size = state.svdData.rows;
        reconstructed = reconstructMatrix(state.svdData, k);

        const imageData = ctx.createImageData(size, size);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const i = (y * size + x) * 4;
                const gray = reconstructed[y][x];
                imageData.data[i] = gray;
                imageData.data[i + 1] = gray;
                imageData.data[i + 2] = gray;
                imageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    } else {
        size = state.svdDataR.rows;
        // Optimized: reconstruct directly to ImageData (avoids creating 3 intermediate arrays)
        const imageData = reconstructColorToImageData(
            state.svdDataR, state.svdDataG, state.svdDataB, k, size
        );
        ctx.putImageData(imageData, 0, 0);
    }

    updateStats(k, size);
    updatePresetButtons();
}

// Reconstruct matrix on main thread (for grayscale)
function reconstructMatrix(svdData, k) {
    const { U, S, V, rows, cols } = svdData;
    k = Math.min(k, S.length);

    const result = [];
    for (let row = 0; row < rows; row++) {
        const resultRow = new Array(cols).fill(0);
        for (let i = 0; i < k; i++) {
            if (S[i] < 1e-10) break;
            for (let col = 0; col < cols; col++) {
                resultRow[col] += S[i] * U[row][i] * V[col][i];
            }
        }
        for (let col = 0; col < cols; col++) {
            resultRow[col] = Math.max(0, Math.min(255, Math.round(resultRow[col])));
        }
        result.push(resultRow);
    }
    return result;
}

// Optimized color reconstruction - directly to ImageData (no intermediate arrays)
function reconstructColorToImageData(svdR, svdG, svdB, k, size) {
    const imageData = new ImageData(size, size);
    const data = imageData.data;

    // Pre-compute weighted V columns for each channel
    const kR = Math.min(k, svdR.S.length);
    const kG = Math.min(k, svdG.S.length);
    const kB = Math.min(k, svdB.S.length);

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let r = 0, g = 0, b = 0;

            // Reconstruct R
            for (let i = 0; i < kR && svdR.S[i] > 1e-10; i++) {
                r += svdR.S[i] * svdR.U[row][i] * svdR.V[col][i];
            }
            // Reconstruct G
            for (let i = 0; i < kG && svdG.S[i] > 1e-10; i++) {
                g += svdG.S[i] * svdG.U[row][i] * svdG.V[col][i];
            }
            // Reconstruct B
            for (let i = 0; i < kB && svdB.S[i] > 1e-10; i++) {
                b += svdB.S[i] * svdB.U[row][i] * svdB.V[col][i];
            }

            const idx = (row * size + col) * 4;
            data[idx] = Math.max(0, Math.min(255, Math.round(r)));
            data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
            data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
            data[idx + 3] = 255;
        }
    }

    return imageData;
}

function updateStats(k, size) {
    const originalData = size * size;
    const compressedData = k * (size + size + 1);
    const ratio = Math.max(0, (1 - compressedData / originalData) * 100);

    // Energy preserved
    const S = state.colorMode === 'grayscale' ? state.svdData.S : state.svdDataR.S;
    let totalEnergy = 0, keptEnergy = 0;
    for (let i = 0; i < S.length; i++) {
        totalEnergy += S[i] * S[i];
        if (i < k) keptEnergy += S[i] * S[i];
    }
    const energyPreserved = (keptEnergy / totalEnergy) * 100;

    // Calculate PSNR
    const psnr = calculatePSNR(k, size);

    // Update UI
    elements.compressionRatio.textContent = ratio.toFixed(0) + '%';
    elements.psnrValue.textContent = psnr === Infinity ? '∞ dB' : psnr.toFixed(1) + ' dB';
    elements.energyValue.textContent = energyPreserved.toFixed(1) + '%';
    elements.statsK.textContent = `k = ${k}`;

    // PSNR quality indicator
    let psnrQuality = '';
    if (psnr >= 40) psnrQuality = '(Xuất sắc)';
    else if (psnr >= 30) psnrQuality = '(Tốt)';
    else if (psnr >= 20) psnrQuality = '(Chấp nhận)';
    else psnrQuality = '(Kém)';

    elements.explanationText.innerHTML = `
        Với <strong>k = ${k}</strong>, ta chỉ giữ <strong>${k} singular values</strong> lớn nhất.
        <br><br>
        📊 <strong>PSNR = ${psnr === Infinity ? '∞' : psnr.toFixed(1)} dB</strong> ${psnrQuality}
        <br>
        ⚡ <strong>Energy = ${energyPreserved.toFixed(1)}%</strong> năng lượng giữ lại
        <br>
        💾 <strong>Nén ${ratio.toFixed(0)}%</strong> (${originalData.toLocaleString()} → ${compressedData.toLocaleString()} số)
    `;
}

// Calculate PSNR between original and reconstructed image
function calculatePSNR(k, size) {
    let mse = 0;
    const n = size * size;

    if (state.colorMode === 'grayscale') {
        const { U, S, V } = state.svdData;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                let reconstructed = 0;
                for (let i = 0; i < k && S[i] > 1e-10; i++) {
                    reconstructed += S[i] * U[row][i] * V[col][i];
                }
                const original = state.imageMatrix[row][col];
                const diff = original - reconstructed;
                mse += diff * diff;
            }
        }
    } else {
        // For color, average MSE across R, G, B
        const channels = [
            { svd: state.svdDataR, matrix: state.imageMatrixR },
            { svd: state.svdDataG, matrix: state.imageMatrixG },
            { svd: state.svdDataB, matrix: state.imageMatrixB }
        ];
        for (const { svd, matrix } of channels) {
            const { U, S, V } = svd;
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    let reconstructed = 0;
                    for (let i = 0; i < k && S[i] > 1e-10; i++) {
                        reconstructed += S[i] * U[row][i] * V[col][i];
                    }
                    const original = matrix[row][col];
                    const diff = original - reconstructed;
                    mse += diff * diff;
                }
            }
        }
        mse /= 3; // Average across 3 channels
    }

    mse /= n;

    if (mse === 0) return Infinity;
    return 10 * Math.log10((255 * 255) / mse);
}

function updatePresetButtons() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnK = btn.dataset.k === 'max' ? state.maxK : parseInt(btn.dataset.k);
        if (btnK === state.currentK) btn.classList.add('active');
    });
}

// ===== MATH SCREEN =====
function drawSingularValuesChart() {
    const canvas = elements.canvasSvChart;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    const width = canvas.width;
    const height = 200;

    ctx.clearRect(0, 0, width, height);

    const S = state.colorMode === 'grayscale' ? state.svdData.S : state.svdDataR.S;
    const maxS = S[0];
    const numBars = Math.min(S.length, 100);
    const barWidth = (width - 40) / numBars;
    const maxHeight = height - 40;

    // Axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, height - 20);
    ctx.lineTo(width - 10, height - 20);
    ctx.stroke();

    // Bars
    for (let i = 0; i < numBars; i++) {
        const barHeight = (S[i] / maxS) * maxHeight;
        const x = 35 + i * barWidth;
        const y = height - 20 - barHeight;
        ctx.fillStyle = i < state.currentK ? '#667eea' : 'rgba(255,255,255,0.2)';
        ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight);
    }

    // Labels
    ctx.fillStyle = '#aaa';
    ctx.font = '12px sans-serif';
    ctx.fillText('σ₁', 5, 20);
    ctx.fillText('k →', width / 2 - 10, height - 5);

    // Current k line
    if (state.currentK <= numBars) {
        const kX = 35 + state.currentK * barWidth;
        ctx.strokeStyle = '#f093fb';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(kX, 10);
        ctx.lineTo(kX, height - 20);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f093fb';
        ctx.fillText(`k=${state.currentK}`, kX - 15, height - 5);
    }
}

// ===== START APP =====
document.addEventListener('DOMContentLoaded', init);
