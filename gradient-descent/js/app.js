/**
 * Gradient Descent Demo
 * Interactive visualization of gradient descent optimization
 */

// ===== STATE =====
const state = {
    functionType: 'parabola',
    ballCount: 1,
    balls: [
        { x0: 2.5, alpha: 0.1, x: 2.5, trail: [] },
        { x0: -2.5, alpha: 0.3, x: -2.5, trail: [] }
    ],
    maxIter: 100,
    playSpeed: 150,
    currentStep: 0,
    isPlaying: false,
    playInterval: null
};

// ===== CONSTANTS =====
const COLORS = {
    ball1: '#e74c3c',
    ball2: '#3498db',
    trail1: 'rgba(231, 76, 60, 0.7)',
    trail2: 'rgba(52, 152, 219, 0.7)',
    curve: '#667eea',
    curveStroke: '#5a6fd6',
    axis: '#999',
    grid: '#e0e0e0',
    text: '#666',
    background: '#fafafa'
};

const BALL_RADIUS = 12;
const TRAIL_RADIUS = 5;
const X_MIN = -4;
const X_MAX = 4;

// ===== DOM ELEMENTS =====
let canvas, ctx;
let elements = {};

// ===== FUNCTIONS (with larger Y range) =====
const functions = {
    parabola: {
        f: (x) => x * x,
        df: (x) => 2 * x,
        yMin: -2,
        yMax: 20
    },
    doublewell: {
        f: (x) => x * x * x * x - 2 * x * x + 1,
        df: (x) => 4 * x * x * x - 4 * x,
        yMin: -2,
        yMax: 15
    },
    wavy: {
        f: (x) => x * x / 4 + Math.sin(2.5 * x) + 2,
        df: (x) => x / 2 + 2.5 * Math.cos(2.5 * x),
        yMin: -2,
        yMax: 10
    }
};

// ===== COORDINATE TRANSFORMS =====
function xToCanvas(x) {
    const padding = 50;
    const width = canvas.width - 2 * padding;
    return padding + ((x - X_MIN) / (X_MAX - X_MIN)) * width;
}

function yToCanvas(y) {
    const padding = 40;
    const height = canvas.height - 2 * padding;
    const func = functions[state.functionType];
    return padding + (1 - (y - func.yMin) / (func.yMax - func.yMin)) * height;
}

// ===== DRAWING =====
function draw() {
    // Clear canvas with light background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawAxes();
    drawFunction();
    drawTrails();
    drawBalls();
}

function drawGrid() {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = X_MIN; x <= X_MAX; x++) {
        const cx = xToCanvas(x);
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    const func = functions[state.functionType];
    const yStep = Math.ceil((func.yMax - func.yMin) / 10);
    for (let y = func.yMin; y <= func.yMax; y += yStep) {
        const cy = yToCanvas(y);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(canvas.width, cy);
        ctx.stroke();
    }
}

function drawAxes() {
    ctx.strokeStyle = COLORS.axis;
    ctx.lineWidth = 2;

    const func = functions[state.functionType];

    // X axis (at y=0 if visible, otherwise at bottom)
    let xAxisY = yToCanvas(0);
    if (xAxisY > canvas.height - 30) xAxisY = canvas.height - 30;
    if (xAxisY < 30) xAxisY = 30;

    ctx.beginPath();
    ctx.moveTo(xToCanvas(X_MIN), xAxisY);
    ctx.lineTo(xToCanvas(X_MAX), xAxisY);
    ctx.stroke();

    // Y axis
    const x0 = xToCanvas(0);
    ctx.beginPath();
    ctx.moveTo(x0, yToCanvas(func.yMin));
    ctx.lineTo(x0, yToCanvas(func.yMax));
    ctx.stroke();

    // X axis labels
    ctx.fillStyle = COLORS.text;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    for (let x = X_MIN; x <= X_MAX; x++) {
        ctx.fillText(x.toString(), xToCanvas(x), xAxisY + 20);
    }

    // Y axis labels
    ctx.textAlign = 'right';
    const yStep = Math.ceil((func.yMax - func.yMin) / 5);
    for (let y = 0; y <= func.yMax; y += yStep) {
        if (y >= func.yMin) {
            ctx.fillText(y.toString(), x0 - 8, yToCanvas(y) + 4);
        }
    }

    // Axis labels
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('x', canvas.width - 25, xAxisY + 5);
    ctx.fillText('f(x)', x0 + 25, 25);
}

function drawFunction() {
    const func = functions[state.functionType];

    // Draw filled area under curve
    ctx.beginPath();
    const steps = 200;
    ctx.moveTo(xToCanvas(X_MIN), yToCanvas(func.yMin));

    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (X_MAX - X_MIN) * (i / steps);
        const y = Math.min(func.f(x), func.yMax);
        const cx = xToCanvas(x);
        const cy = yToCanvas(y);
        ctx.lineTo(cx, cy);
    }

    ctx.lineTo(xToCanvas(X_MAX), yToCanvas(func.yMin));
    ctx.closePath();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.15)');
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw curve line
    ctx.strokeStyle = COLORS.curve;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
        const x = X_MIN + (X_MAX - X_MIN) * (i / steps);
        const y = func.f(x);
        const cx = xToCanvas(x);
        const cy = yToCanvas(Math.min(y, func.yMax + 5));

        if (i === 0) {
            ctx.moveTo(cx, cy);
        } else {
            ctx.lineTo(cx, cy);
        }
    }
    ctx.stroke();
}

function drawTrails() {
    const func = functions[state.functionType];
    const count = state.ballCount;

    for (let b = 0; b < count; b++) {
        const ball = state.balls[b];
        const color = b === 0 ? COLORS.trail1 : COLORS.trail2;

        ball.trail.forEach((pos, index) => {
            const y = func.f(pos.x);
            const cx = xToCanvas(pos.x);
            const cy = yToCanvas(Math.min(y, functions[state.functionType].yMax));

            // Fade older trails slightly
            const alpha = 0.4 + 0.6 * (index / ball.trail.length);
            ctx.globalAlpha = alpha;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cx, cy, TRAIL_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }
}

function drawBalls() {
    const func = functions[state.functionType];
    const count = state.ballCount;

    for (let b = 0; b < count; b++) {
        const ball = state.balls[b];
        const y = func.f(ball.x);
        const cx = xToCanvas(ball.x);
        const cy = yToCanvas(Math.min(y, functions[state.functionType].yMax));
        const color = b === 0 ? COLORS.ball1 : COLORS.ball2;

        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;

        // Ball
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Highlight
        const gradient = ctx.createRadialGradient(cx - 4, cy - 4, 0, cx, cy, BALL_RADIUS);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== GRADIENT DESCENT STEP =====
function gradientDescentStep() {
    const func = functions[state.functionType];
    const count = state.ballCount;
    let anyMoved = false;

    for (let b = 0; b < count; b++) {
        const ball = state.balls[b];

        // Save current position to trail
        ball.trail.push({ x: ball.x });

        // Calculate gradient and update
        const gradient = func.df(ball.x);
        const newX = ball.x - ball.alpha * gradient;

        // Clamp to bounds (allow ping-pong effect but stay in view)
        ball.x = Math.max(X_MIN + 0.3, Math.min(X_MAX - 0.3, newX));

        // Check if moved significantly
        if (Math.abs(gradient) > 0.001) {
            anyMoved = true;
        }
    }

    state.currentStep++;
    updateStepDisplay();

    return anyMoved && state.currentStep < state.maxIter;
}

// ===== CONTROLS =====
function play() {
    if (state.isPlaying) {
        pause();
        return;
    }

    state.isPlaying = true;
    elements.btnPlay.textContent = '⏸';
    elements.btnPlay.classList.add('playing');

    state.playInterval = setInterval(() => {
        const shouldContinue = gradientDescentStep();
        draw();

        if (!shouldContinue) {
            pause();
        }
    }, state.playSpeed);
}

function pause() {
    state.isPlaying = false;
    elements.btnPlay.textContent = '▶';
    elements.btnPlay.classList.remove('playing');

    if (state.playInterval) {
        clearInterval(state.playInterval);
        state.playInterval = null;
    }
}

function stepNext() {
    if (state.currentStep < state.maxIter) {
        gradientDescentStep();
        draw();
    }
}

function stepPrev() {
    if (state.currentStep > 0) {
        // Restore previous position from trail
        for (let b = 0; b < state.ballCount; b++) {
            const ball = state.balls[b];
            if (ball.trail.length > 0) {
                const prevPos = ball.trail.pop();
                ball.x = prevPos.x;
            }
        }
        state.currentStep--;
        updateStepDisplay();
        draw();
    }
}

function reset() {
    pause();

    // Reset balls to initial positions
    state.balls[0].x = state.balls[0].x0;
    state.balls[0].trail = [];
    state.balls[1].x = state.balls[1].x0;
    state.balls[1].trail = [];

    state.currentStep = 0;
    updateStepDisplay();
    draw();
}

function updateStepDisplay() {
    elements.currentStep.textContent = state.currentStep;
}

// ===== INITIALIZATION =====
function init() {
    canvas = document.getElementById('graph-canvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get DOM elements
    elements = {
        btnPlay: document.getElementById('btn-play'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        btnReset: document.getElementById('btn-reset'),
        currentStep: document.getElementById('current-step'),
        ball1Settings: document.getElementById('ball1-settings'),
        ball2Settings: document.getElementById('ball2-settings'),
        ball1X0: document.getElementById('ball1-x0'),
        ball1Alpha: document.getElementById('ball1-alpha'),
        ball2X0: document.getElementById('ball2-x0'),
        ball2Alpha: document.getElementById('ball2-alpha'),
        maxIter: document.getElementById('max-iter'),
        playSpeed: document.getElementById('play-speed')
    };

    setupEventListeners();
    draw();
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Get height from CSS
    const style = getComputedStyle(canvas);
    const height = parseInt(style.height) || 400;

    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    canvas.width = rect.width;
    canvas.height = height;

    draw();
}

function setupEventListeners() {
    // Playback controls
    elements.btnPlay.addEventListener('click', play);
    elements.btnPrev.addEventListener('click', stepPrev);
    elements.btnNext.addEventListener('click', stepNext);
    elements.btnReset.addEventListener('click', reset);

    // Function selection
    document.querySelectorAll('input[name="function"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.functionType = e.target.value;
            reset();
        });
    });

    // Ball count selection
    document.querySelectorAll('input[name="ballcount"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.ballCount = parseInt(e.target.value);
            elements.ball2Settings.classList.toggle('hidden', state.ballCount === 1);
            reset();
        });
    });

    // Ball 1 settings
    elements.ball1X0.addEventListener('change', (e) => {
        state.balls[0].x0 = parseFloat(e.target.value);
        reset();
    });

    elements.ball1Alpha.addEventListener('change', (e) => {
        state.balls[0].alpha = parseFloat(e.target.value);
        reset();
    });

    // Ball 2 settings
    elements.ball2X0.addEventListener('change', (e) => {
        state.balls[1].x0 = parseFloat(e.target.value);
        reset();
    });

    elements.ball2Alpha.addEventListener('change', (e) => {
        state.balls[1].alpha = parseFloat(e.target.value);
        reset();
    });

    // Max iterations
    elements.maxIter.addEventListener('change', (e) => {
        state.maxIter = parseInt(e.target.value);
    });

    // Play speed
    elements.playSpeed.addEventListener('change', (e) => {
        state.playSpeed = parseInt(e.target.value);
        // If currently playing, restart with new speed
        if (state.isPlaying) {
            pause();
            play();
        }
    });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
