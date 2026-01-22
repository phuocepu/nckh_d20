/**
 * MONTY HALL GAME
 * ================
 * Logic chinh cua game
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
    carPosition: 0,      // Cua co xe (1, 2, 3)
    firstChoice: 0,      // Cua chon dau tien
    openedDoor: 0,       // Cua MC mo (co de)
    otherDoor: 0,        // Cua con lai
    switched: false,     // Co doi cua khong
    finalChoice: 0,      // Cua cuoi cung

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
}

function resetDoors() {
    document.querySelectorAll('.door').forEach(door => {
        door.classList.remove('selected', 'opened', 'disabled', 'chosen', 'final-choice', 'win', 'lose');
        door.querySelector('.door-content').className = 'door-content';
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
    // Random vi tri xe (1, 2, hoac 3)
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
    if (gameState.firstChoice !== 0) return; // Da chon roi

    gameState.firstChoice = doorNum;

    // Highlight cua da chon
    elements.doors.forEach(door => {
        if (parseInt(door.dataset.door) === doorNum) {
            door.classList.add('selected');
        }
    });

    // Delay truoc khi chuyen man hinh
    setTimeout(() => {
        prepareSwitch();
        showScreen('screen-switch');
    }, 800);
}

function prepareSwitch() {
    // Tim cua MC se mo (phai co de, khong phai cua nguoi choi chon)
    const possibleDoors = [1, 2, 3].filter(d =>
        d !== gameState.carPosition && d !== gameState.firstChoice
    );

    // Neu co 2 cua co the mo, chon random
    gameState.openedDoor = possibleDoors[Math.floor(Math.random() * possibleDoors.length)];

    // Cua con lai (de nguoi choi doi sang)
    gameState.otherDoor = [1, 2, 3].find(d =>
        d !== gameState.firstChoice && d !== gameState.openedDoor
    );

    // Update UI
    elements.chosenDoor.textContent = gameState.firstChoice;
    elements.openedDoor.textContent = gameState.openedDoor;
    elements.otherDoor.textContent = gameState.otherDoor;
    elements.stayDoorNum.textContent = gameState.firstChoice;

    // Setup doors cho man hinh switch
    [1, 2, 3].forEach(doorNum => {
        const door = document.getElementById(`switch-door-${doorNum}`);
        door.classList.remove('selected', 'opened', 'disabled', 'chosen');
        door.querySelector('.door-content').className = 'door-content';

        if (doorNum === gameState.firstChoice) {
            door.classList.add('chosen');
        } else if (doorNum === gameState.openedDoor) {
            // Mo cua co de
            door.querySelector('.door-content').classList.add('goat');
            setTimeout(() => door.classList.add('opened'), 300);
            door.classList.add('disabled');
        }
    });
}

function handleSwitch(didSwitch) {
    gameState.switched = didSwitch;
    gameState.finalChoice = didSwitch ? gameState.otherDoor : gameState.firstChoice;

    const won = gameState.finalChoice === gameState.carPosition;

    // Cap nhat thong ke
    if (won) {
        gameState.wins++;
        if (didSwitch) gameState.switchWins++;
        else gameState.stayWins++;
    } else {
        gameState.losses++;
        if (didSwitch) gameState.switchLosses++;
        else gameState.stayLosses++;
    }

    // Luu game history
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

    // Gui len Firebase
    sendGameToFirebase(gameData);

    // Hien thi ket qua
    showResult(won, didSwitch);
}

function showResult(won, didSwitch) {
    // Setup result screen
    elements.resultHeader.className = 'result-header ' + (won ? 'win' : 'lose');
    elements.resultTitle.textContent = won ? '🎉 THANG! 🎉' : '😢 THUA ROI!';

    const action = didSwitch ? 'DOI' : 'GIU';
    elements.resultSubtitle.textContent = `Ban da ${action} cua`;

    // Explanation
    if (won) {
        elements.explanationText.textContent = didSwitch
            ? `Ban doi sang cua ${gameState.finalChoice} va trung XE! Chien thuat doi cua thang 66.7% theo ly thuyet.`
            : `Ban giu cua ${gameState.finalChoice} va may man trung XE! Chi co 33.3% co hoi thoi.`;
    } else {
        elements.explanationText.textContent = didSwitch
            ? `Ban doi sang cua ${gameState.finalChoice} nhung la DE. Xe o cua ${gameState.carPosition}. Lan sau se may hon!`
            : `Ban giu cua ${gameState.finalChoice} nhung la DE. Xe o cua ${gameState.carPosition}. Thu doi cua lan sau xem!`;
    }

    // Setup doors - mo tat ca
    [1, 2, 3].forEach(doorNum => {
        const door = document.getElementById(`result-door-${doorNum}`);
        door.classList.remove('selected', 'opened', 'disabled', 'chosen', 'final-choice', 'win', 'lose');

        const content = door.querySelector('.door-content');
        content.className = 'door-content';

        if (doorNum === gameState.carPosition) {
            content.classList.add('car');
        } else {
            content.classList.add('goat');
        }

        if (doorNum === gameState.finalChoice) {
            door.classList.add('final-choice');
            door.classList.add(won ? 'win' : 'lose');
        }

        // Mo cua voi delay
        setTimeout(() => door.classList.add('opened'), doorNum * 200);
    });

    // Confetti neu thang
    if (won) {
        setTimeout(createConfetti, 500);
    }

    // Update button text
    if (gameState.currentRound >= gameState.totalRounds) {
        elements.btnNext.textContent = 'XEM KET QUA';
    } else {
        elements.btnNext.textContent = 'CHOI TIEP';
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

    // Gui game data
    const gameRef = db.ref(`sessions/${sessionId}/games`).push();
    gameRef.set({
        ...gameData,
        playerId: gameState.playerId,
        playerName: gameState.playerName
    });

    // Cap nhat stats
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
    // Thay bang URL cua ban sau khi deploy Apps Script
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

    // Kiem tra URL da duoc cau hinh chua
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL === '') {
        alert(`Da luu ket qua!\n\nTen: ${data.name}\nTong: ${data.totalGames} luot\nThang: ${data.wins} (${data.winRate})\n\nDoi cua: ${data.switchWins}\nGiu cua: ${data.stayWins}\n\n(Cau hinh GOOGLE_SHEET_URL de tu dong luu vao Sheet)`);
        return;
    }

    // Gui data len Google Sheet
    fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script yeu cau no-cors
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        alert(`Da gui ket qua thanh cong!\n\nTen: ${data.name}\nTong: ${data.totalGames} luot\nThang: ${data.wins} (${data.winRate})\n\nDoi cua: ${data.switchWins}\nGiu cua: ${data.stayWins}`);
    })
    .catch(error => {
        console.error('Loi gui Google Sheet:', error);
        alert(`Ket qua cua ban:\n\nTen: ${data.name}\nTong: ${data.totalGames} luot\nThang: ${data.wins}\n\n(Loi ket noi - vui long thu lai)`);
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
    // Hien thi session ID
    elements.sessionId.textContent = window.firebaseConfig?.SESSION_ID || 'offline-mode';

    // Init event listeners
    initEventListeners();

    // Show welcome screen
    showScreen('screen-welcome');

    console.log('🎮 Monty Hall Game loaded!');
    console.log(`📡 Firebase: ${window.firebaseConfig?.isFirebaseEnabled ? 'Connected' : 'Offline'}`);
}

// Start game when DOM ready
document.addEventListener('DOMContentLoaded', init);
