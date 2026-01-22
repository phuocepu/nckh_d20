/**
 * MONTY HALL GAME
 * ================
 * Logic chính của game
 */

// ===== GAME STATE =====
const gameState = {
    playerName: '',
    playerId: '',
    currentRound: 1,
    totalRounds: window.firebaseConfig?.TOTAL_ROUNDS || 5,
    wins: 0,
    losses: 0,

    // Current game data
    carPosition: 0,      // Cửa có xe (1, 2, 3)
    firstChoice: 0,      // Cửa chọn đầu tiên
    openedDoor: 0,       // Cửa MC mở (có dê)
    otherDoor: 0,        // Cửa còn lại
    switched: false,     // Có đổi cửa không
    finalChoice: 0,      // Cửa cuối cùng

    // Statistics
    switchWins: 0,
    switchLosses: 0,
    stayWins: 0,
    stayLosses: 0,

    // All games history
    games: []
};

// ===== DOM ELEMENTS =====
const elements = {
    // Screens
    screenWelcome: document.getElementById('screen-welcome'),
    screenChoose: document.getElementById('screen-choose'),
    screenSwitch: document.getElementById('screen-switch'),
    screenResult: document.getElementById('screen-result'),
    screenFinal: document.getElementById('screen-final'),

    // Welcome screen
    playerNameInput: document.getElementById('player-name'),
    btnStart: document.getElementById('btn-start'),
    sessionId: document.getElementById('session-id'),

    // Game stats
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    wins: document.getElementById('wins'),
    losses: document.getElementById('losses'),
    currentRound2: document.getElementById('current-round-2'),
    totalRounds2: document.getElementById('total-rounds-2'),
    wins2: document.getElementById('wins-2'),
    losses2: document.getElementById('losses-2'),
    displayName: document.getElementById('display-name'),

    // Progress bars
    progressBar: document.getElementById('progress-bar'),
    progressBar2: document.getElementById('progress-bar-2'),

    // Choose screen
    doors: document.querySelectorAll('#screen-choose .door'),

    // Switch screen
    chosenDoor: document.getElementById('chosen-door'),
    openedDoor: document.getElementById('opened-door'),
    otherDoor: document.getElementById('other-door'),
    btnSwitch: document.getElementById('btn-switch'),
    btnStay: document.getElementById('btn-stay'),
    stayDoorNum: document.getElementById('stay-door-num'),

    // Result screen
    resultHeader: document.getElementById('result-header'),
    resultTitle: document.getElementById('result-title'),
    resultSubtitle: document.getElementById('result-subtitle'),
    explanationText: document.getElementById('explanation-text'),
    btnNext: document.getElementById('btn-next'),

    // Final screen
    finalName: document.getElementById('final-name'),
    finalTotal: document.getElementById('final-total'),
    finalWins: document.getElementById('final-wins'),
    finalRate: document.getElementById('final-rate'),
    switchBar: document.getElementById('switch-bar'),
    stayBar: document.getElementById('stay-bar'),
    switchStat: document.getElementById('switch-stat'),
    stayStat: document.getElementById('stay-stat'),
    btnPlayMore: document.getElementById('btn-play-more'),
    btnSubmit: document.getElementById('btn-submit'),

    // Confetti
    confettiContainer: document.getElementById('confetti-container')
};

// ===== UTILITY FUNCTIONS =====
function generateId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function updateStats() {
    elements.currentRound.textContent = gameState.currentRound;
    elements.totalRounds.textContent = gameState.totalRounds;
    elements.wins.textContent = gameState.wins;
    elements.losses.textContent = gameState.losses;

    elements.currentRound2.textContent = gameState.currentRound;
    elements.totalRounds2.textContent = gameState.totalRounds;
    elements.wins2.textContent = gameState.wins;
    elements.losses2.textContent = gameState.losses;

    // Update progress bars
    const progress = (gameState.currentRound / gameState.totalRounds) * 100;
    if (elements.progressBar) elements.progressBar.style.width = progress + '%';
    if (elements.progressBar2) elements.progressBar2.style.width = progress + '%';
}

function resetDoors() {
    document.querySelectorAll('.door').forEach(door => {
        door.classList.remove('selected', 'opened', 'disabled', 'chosen', 'final-choice', 'win', 'lose', 'eliminated');
        const content = door.querySelector('.door-content');
        if (content) content.className = 'door-content';
    });
}

// ===== CONFETTI EFFECT =====
function createConfetti() {
    const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            elements.confettiContainer.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ===== GAME LOGIC =====
function setupNewGame() {
    // Random vị trí xe (1, 2, hoặc 3)
    gameState.carPosition = Math.floor(Math.random() * 3) + 1;
    gameState.firstChoice = 0;
    gameState.openedDoor = 0;
    gameState.otherDoor = 0;
    gameState.switched = false;
    gameState.finalChoice = 0;

    resetDoors();
    updateStats();
}

function handleDoorChoice(doorNum) {
    if (gameState.firstChoice !== 0) return; // Đã chọn rồi

    gameState.firstChoice = doorNum;

    // Highlight cửa đã chọn
    elements.doors.forEach(door => {
        if (parseInt(door.dataset.door) === doorNum) {
            door.classList.add('selected');
        }
    });

    // Delay trước khi chuyển màn hình
    setTimeout(() => {
        prepareSwitch();
        showScreen('screen-switch');
    }, 800);
}

function prepareSwitch() {
    // Tìm cửa MC sẽ mở (phải có dê, không phải cửa người chơi chọn)
    const possibleDoors = [1, 2, 3].filter(d =>
        d !== gameState.carPosition && d !== gameState.firstChoice
    );

    // Nếu có 2 cửa có thể mở, chọn random
    gameState.openedDoor = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

    // Cửa còn lại (để người chơi đổi sang)
    gameState.otherDoor = [1, 2, 3].find(d =>
        d !== gameState.firstChoice && d !== gameState.openedDoor
    );

    // Update UI
    elements.chosenDoor.textContent = gameState.firstChoice;
    elements.openedDoor.textContent = gameState.openedDoor;
    elements.otherDoor.textContent = gameState.otherDoor;
    elements.stayDoorNum.textContent = gameState.firstChoice;

    // Setup doors cho màn hình switch
    [1, 2, 3].forEach(doorNum => {
        const door = document.getElementById(`switch-door-${doorNum}`);
        door.classList.remove('selected', 'opened', 'disabled', 'chosen', 'eliminated');
        const content = door.querySelector('.door-content');
        if (content) content.className = 'door-content';

        if (doorNum === gameState.firstChoice) {
            door.classList.add('chosen');
        } else if (doorNum === gameState.openedDoor) {
            // Mở cửa có dê
            if (content) content.classList.add('goat');
            setTimeout(() => {
                door.classList.add('opened');
                door.classList.add('eliminated');
            }, 300);
            door.classList.add('disabled');
        }
    });
}

function handleSwitch(didSwitch) {
    gameState.switched = didSwitch;
    gameState.finalChoice = didSwitch ? gameState.otherDoor : gameState.firstChoice;

    const won = gameState.finalChoice === gameState.carPosition;

    // Cập nhật thống kê
    if (won) {
        gameState.wins++;
        if (didSwitch) gameState.switchWins++;
        else gameState.stayWins++;
    } else {
        gameState.losses++;
        if (didSwitch) gameState.switchLosses++;
        else gameState.stayLosses++;
    }

    // Lưu game history
    const gameData = {
        round: gameState.currentRound,
        carPosition: gameState.carPosition,
        firstChoice: gameState.firstChoice,
        openedDoor: gameState.openedDoor,
        switched: gameState.switched,
        finalChoice: gameState.finalChoice,
        won: won,
        timestamp: new Date().toISOString()
    };
    gameState.games.push(gameData);

    // Gửi lên Firebase
    sendGameToFirebase(gameData);

    // Hiển thị kết quả
    showResult(won, didSwitch);
}

function showResult(won, didSwitch) {
    // Setup result screen
    elements.resultHeader.className = 'result-header ' + (won ? 'win' : 'lose');
    elements.resultTitle.textContent = won ? '🎉 THẮNG RỒI!' : '😢 THUA RỒI!';

    const action = didSwitch ? 'ĐỔI' : 'GIỮ';
    elements.resultSubtitle.textContent = `Bạn đã ${action} cửa`;

    // Explanation
    if (won) {
        elements.explanationText.textContent = didSwitch
            ? `🔄 Bạn đổi sang cửa ${gameState.finalChoice} và trúng XE! Chiến thuật đổi cửa thắng 66.7% theo lý thuyết.`
            : `✋ Bạn giữ cửa ${gameState.finalChoice} và may mắn trúng XE! Chỉ có 33.3% cơ hội thôi đấy.`;
    } else {
        elements.explanationText.textContent = didSwitch
            ? `🔄 Bạn đổi sang cửa ${gameState.finalChoice} nhưng là DÊ 🐐. Xe ở cửa ${gameState.carPosition}. Lần sau sẽ may hơn!`
            : `✋ Bạn giữ cửa ${gameState.finalChoice} nhưng là DÊ 🐐. Xe ở cửa ${gameState.carPosition}. Thử đổi cửa lần sau xem!`;
    }

    // Setup doors - mở tất cả
    [1, 2, 3].forEach(doorNum => {
        const door = document.getElementById(`result-door-${doorNum}`);
        door.classList.remove('selected', 'opened', 'disabled', 'chosen', 'final-choice', 'win', 'lose', 'eliminated');

        const content = door.querySelector('.door-content');
        if (content) {
            content.className = 'door-content';

            if (doorNum === gameState.carPosition) {
                content.classList.add('car');
            } else {
                content.classList.add('goat');
            }
        }

        if (doorNum === gameState.finalChoice) {
            door.classList.add('final-choice');
            door.classList.add(won ? 'win' : 'lose');
        }

        // Mở cửa với delay
        setTimeout(() => door.classList.add('opened'), doorNum * 200);
    });

    // Confetti nếu thắng
    if (won) {
        setTimeout(createConfetti, 500);
    }

    // Update button text
    if (gameState.currentRound >= gameState.totalRounds) {
        elements.btnNext.textContent = '📊 XEM KẾT QUẢ';
    } else {
        elements.btnNext.textContent = '▶️ LƯỢT TIẾP THEO';
    }

    showScreen('screen-result');
}

function handleNext() {
    if (gameState.currentRound >= gameState.totalRounds) {
        showFinalStats();
    } else {
        gameState.currentRound++;
        setupNewGame();
        showScreen('screen-choose');
    }
}

function showFinalStats() {
    const totalGames = gameState.wins + gameState.losses;
    const winRate = totalGames > 0 ? Math.round((gameState.wins / totalGames) * 100) : 0;

    elements.finalName.textContent = gameState.playerName;
    elements.finalTotal.textContent = totalGames;
    elements.finalWins.textContent = gameState.wins;
    elements.finalRate.textContent = winRate + '%';

    // Strategy breakdown
    const switchTotal = gameState.switchWins + gameState.switchLosses;
    const stayTotal = gameState.stayWins + gameState.stayLosses;

    const switchRate = switchTotal > 0 ? Math.round((gameState.switchWins / switchTotal) * 100) : 0;
    const stayRate = stayTotal > 0 ? Math.round((gameState.stayWins / stayTotal) * 100) : 0;

    elements.switchBar.style.width = switchRate + '%';
    elements.stayBar.style.width = stayRate + '%';

    elements.switchStat.textContent = `${gameState.switchWins}/${switchTotal} (${switchRate}%)`;
    elements.stayStat.textContent = `${gameState.stayWins}/${stayTotal} (${stayRate}%)`;

    showScreen('screen-final');
}

function playMoreRounds() {
    gameState.totalRounds += 5;
    gameState.currentRound++;
    setupNewGame();
    showScreen('screen-choose');
}

// ===== FIREBASE FUNCTIONS =====
function sendGameToFirebase(gameData) {
    if (!window.firebaseConfig?.isFirebaseEnabled) {
        console.log('Firebase offline - game data:', gameData);
        return;
    }

    const db = window.firebaseConfig.database;
    const sessionId = window.firebaseConfig.SESSION_ID;

    // Gửi game data
    const gameRef = db.ref(`sessions/${sessionId}/games`).push();
    gameRef.set({
        ...gameData,
        playerId: gameState.playerId,
        playerName: gameState.playerName
    });

    // Cập nhật stats
    updateFirebaseStats();
}

function updateFirebaseStats() {
    if (!window.firebaseConfig?.isFirebaseEnabled) return;

    const db = window.firebaseConfig.database;
    const sessionId = window.firebaseConfig.SESSION_ID;

    const statsRef = db.ref(`sessions/${sessionId}/stats`);

    statsRef.transaction(currentStats => {
        if (!currentStats) {
            currentStats = {
                totalGames: 0,
                switchWins: 0,
                switchLosses: 0,
                stayWins: 0,
                stayLosses: 0
            };
        }

        const lastGame = gameState.games[gameState.games.length - 1];

        currentStats.totalGames++;

        if (lastGame.switched) {
            if (lastGame.won) currentStats.switchWins++;
            else currentStats.switchLosses++;
        } else {
            if (lastGame.won) currentStats.stayWins++;
            else currentStats.stayLosses++;
        }

        return currentStats;
    });
}

function registerPlayer() {
    if (!window.firebaseConfig?.isFirebaseEnabled) return;

    const db = window.firebaseConfig.database;
    const sessionId = window.firebaseConfig.SESSION_ID;

    db.ref(`sessions/${sessionId}/players/${gameState.playerId}`).set({
        name: gameState.playerName,
        joinedAt: new Date().toISOString()
    });
}

function submitToGoogleSheet() {
    // Google Apps Script Web App URL
    const GOOGLE_SHEET_URL = window.firebaseConfig?.GOOGLE_SHEET_URL || '';

    const totalGames = gameState.wins + gameState.losses;
    const winRate = totalGames > 0 ? Math.round((gameState.wins / totalGames) * 100) : 0;

    const data = {
        name: gameState.playerName,
        totalGames: totalGames,
        wins: gameState.wins,
        losses: gameState.losses,
        winRate: winRate + '%',
        switchWins: gameState.switchWins,
        switchLosses: gameState.switchLosses,
        stayWins: gameState.stayWins,
        stayLosses: gameState.stayLosses,
        sessionId: window.firebaseConfig?.SESSION_ID || 'unknown'
    };

    // Kiểm tra URL đã được cấu hình chưa
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === '') {
        alert(`✅ Đã lưu kết quả!\n\n👤 Tên: ${data.name}\n🎮 Tổng: ${data.totalGames} lượt\n🏆 Thắng: ${data.wins} (${data.winRate})\n\n🔄 Đổi cửa: ${data.switchWins}\n✋ Giữ cửa: ${data.stayWins}\n\n(Cấu hình GOOGLE_SHEET_URL để tự động lưu vào Sheet)`);
        return;
    }

    // Gửi data lên Google Sheet qua URL parameters (GET request)
    const params = new URLSearchParams(data).toString();
    const fullUrl = `${GOOGLE_SHEET_URL}?${params}`;

    fetch(fullUrl, {
        method: 'GET',
        mode: 'no-cors'
    })
    .then(() => {
        alert(`✅ Đã gửi kết quả thành công!\n\n👤 Tên: ${data.name}\n🎮 Tổng: ${data.totalGames} lượt\n🏆 Thắng: ${data.wins} (${data.winRate})\n\n🔄 Đổi cửa: ${data.switchWins}\n✋ Giữ cửa: ${data.stayWins}`);
    })
    .catch(error => {
        console.error('Lỗi gửi Google Sheet:', error);
        alert(`📊 Kết quả của bạn:\n\n👤 Tên: ${data.name}\n🎮 Tổng: ${data.totalGames} lượt\n🏆 Thắng: ${data.wins}\n\n(Lỗi kết nối - vui lòng thử lại)`);
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Welcome screen
    elements.playerNameInput.addEventListener('input', (e) => {
        elements.btnStart.disabled = e.target.value.trim().length === 0;
    });

    elements.btnStart.addEventListener('click', () => {
        gameState.playerName = elements.playerNameInput.value.trim();
        gameState.playerId = generateId();
        elements.displayName.textContent = gameState.playerName;

        registerPlayer();
        setupNewGame();
        showScreen('screen-choose');
    });

    // Allow Enter key to start
    elements.playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !elements.btnStart.disabled) {
            elements.btnStart.click();
        }
    });

    // Choose screen - door clicks
    elements.doors.forEach(door => {
        door.addEventListener('click', () => {
            handleDoorChoice(parseInt(door.dataset.door));
        });
    });

    // Switch screen
    elements.btnSwitch.addEventListener('click', () => handleSwitch(true));
    elements.btnStay.addEventListener('click', () => handleSwitch(false));

    // Result screen
    elements.btnNext.addEventListener('click', handleNext);

    // Final screen
    elements.btnPlayMore.addEventListener('click', playMoreRounds);
    elements.btnSubmit.addEventListener('click', submitToGoogleSheet);
}

// ===== INITIALIZATION =====
function init() {
    // Hiển thị session ID
    elements.sessionId.textContent = window.firebaseConfig?.SESSION_ID || 'offline-mode';

    // Init event listeners
    initEventListeners();

    // Show welcome screen
    showScreen('screen-welcome');

    console.log('🎮 Monty Hall Game đã sẵn sàng!');
    console.log(`📡 Firebase: ${window.firebaseConfig?.isFirebaseEnabled ? 'Đã kết nối' : 'Offline'}`);
}

// Start game when DOM ready
document.addEventListener('DOMContentLoaded', init);
