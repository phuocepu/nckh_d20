/**
 * MONTY HALL DASHBOARD
 * =====================
 * Realtime statistics for teachers
 */

// ===== STATE =====
const dashboardState = {
    stats: {
        totalGames: 0,
        switchWins: 0,
        switchLosses: 0,
        stayWins: 0,
        stayLosses: 0
    },
    players: {},
    games: []
};

// ===== DOM ELEMENTS =====
const dashElements = {
    sessionId: document.getElementById('session-id'),
    playerCount: document.getElementById('player-count'),
    offlineWarning: document.getElementById('offline-warning'),
    qrCode: document.getElementById('qr-code'),
    gameUrl: document.getElementById('game-url'),

    // Stats
    totalGames: document.getElementById('total-games'),
    switchWins: document.getElementById('switch-wins'),
    switchLosses: document.getElementById('switch-losses'),
    stayWins: document.getElementById('stay-wins'),
    stayLosses: document.getElementById('stay-losses'),

    // Bars
    switchBar: document.getElementById('switch-bar'),
    stayBar: document.getElementById('stay-bar'),
    switchStats: document.getElementById('switch-stats'),
    stayStats: document.getElementById('stay-stats'),

    // Players table
    playersTbody: document.getElementById('players-tbody')
};

// ===== INITIALIZATION =====
function init() {
    const sessionId = window.firebaseConfig?.SESSION_ID || 'demo-session';
    dashElements.sessionId.textContent = sessionId;

    // Generate QR Code
    generateQRCode();

    // Check Firebase connection
    if (!window.firebaseConfig?.isFirebaseEnabled) {
        dashElements.offlineWarning.style.display = 'block';
        console.warn('Firebase not connected - showing demo mode');
        showDemoData();
        return;
    }

    // Setup realtime listeners
    setupRealtimeListeners();
}

// ===== QR CODE =====
function generateQRCode() {
    // Get the game URL (same domain, index.html)
    let gameUrl = window.location.href.replace('dashboard.html', 'index.html');

    // Neu dang chay local (file://), hien thi placeholder
    if (gameUrl.startsWith('file://')) {
        dashElements.gameUrl.textContent = '⚠️ Dang chay local - QR se hoat dong khi deploy len GitHub Pages';
        dashElements.qrCode.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <p style="color: #333; margin-bottom: 10px;">📱 QR Code</p>
                <p style="color: #666; font-size: 0.9em;">Deploy len GitHub Pages de co QR code</p>
                <p style="color: #888; font-size: 0.8em; margin-top: 10px;">Hoac chay: python3 -m http.server 8000</p>
            </div>
        `;
        return;
    }

    dashElements.gameUrl.textContent = gameUrl;

    // Dung QR Server API (mien phi, khong can thu vien)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(gameUrl)}`;

    const img = document.createElement('img');
    img.src = qrApiUrl;
    img.alt = 'QR Code';
    img.style.width = '200px';
    img.style.height = '200px';

    img.onerror = function() {
        dashElements.qrCode.innerHTML = `<p style="color: #333; padding: 20px;">URL: ${gameUrl}</p>`;
    };

    dashElements.qrCode.innerHTML = '';
    dashElements.qrCode.appendChild(img);
}

// ===== FIREBASE REALTIME LISTENERS =====
function setupRealtimeListeners() {
    const db = window.firebaseConfig.database;
    const sessionId = window.firebaseConfig.SESSION_ID;

    // Listen to stats
    db.ref(`sessions/${sessionId}/stats`).on('value', (snapshot) => {
        const stats = snapshot.val();
        if (stats) {
            dashboardState.stats = stats;
            updateStatsUI();
        }
    });

    // Listen to players
    db.ref(`sessions/${sessionId}/players`).on('value', (snapshot) => {
        const players = snapshot.val();
        if (players) {
            dashboardState.players = players;
            dashElements.playerCount.textContent = Object.keys(players).length;
        }
    });

    // Listen to games for leaderboard
    db.ref(`sessions/${sessionId}/games`).on('value', (snapshot) => {
        const games = snapshot.val();
        if (games) {
            dashboardState.games = Object.values(games);
            updateLeaderboard();
        }
    });

    console.log('✅ Realtime listeners setup complete');
}

// ===== UPDATE UI =====
function updateStatsUI() {
    const stats = dashboardState.stats;

    // Update numbers
    dashElements.totalGames.textContent = stats.totalGames || 0;
    dashElements.switchWins.textContent = stats.switchWins || 0;
    dashElements.switchLosses.textContent = stats.switchLosses || 0;
    dashElements.stayWins.textContent = stats.stayWins || 0;
    dashElements.stayLosses.textContent = stats.stayLosses || 0;

    // Calculate rates
    const switchTotal = (stats.switchWins || 0) + (stats.switchLosses || 0);
    const stayTotal = (stats.stayWins || 0) + (stats.stayLosses || 0);

    const switchRate = switchTotal > 0 ? Math.round((stats.switchWins / switchTotal) * 100) : 0;
    const stayRate = stayTotal > 0 ? Math.round((stats.stayWins / stayTotal) * 100) : 0;

    // Update bars
    dashElements.switchBar.style.width = switchRate + '%';
    dashElements.switchBar.textContent = switchRate + '%';
    dashElements.stayBar.style.width = stayRate + '%';
    dashElements.stayBar.textContent = stayRate + '%';

    // Update stats text
    dashElements.switchStats.textContent = `${stats.switchWins || 0}/${switchTotal} (${switchRate}%)`;
    dashElements.stayStats.textContent = `${stats.stayWins || 0}/${stayTotal} (${stayRate}%)`;
}

function updateLeaderboard() {
    const games = dashboardState.games;

    // Group games by player
    const playerStats = {};

    games.forEach(game => {
        const playerId = game.playerId;
        if (!playerStats[playerId]) {
            playerStats[playerId] = {
                name: game.playerName || 'Unknown',
                totalGames: 0,
                wins: 0,
                switchCount: 0
            };
        }

        playerStats[playerId].totalGames++;
        if (game.won) playerStats[playerId].wins++;
        if (game.switched) playerStats[playerId].switchCount++;
    });

    // Convert to array and sort by win rate
    const sortedPlayers = Object.values(playerStats)
        .map(p => ({
            ...p,
            winRate: p.totalGames > 0 ? Math.round((p.wins / p.totalGames) * 100) : 0,
            switchRate: p.totalGames > 0 ? Math.round((p.switchCount / p.totalGames) * 100) : 0
        }))
        .sort((a, b) => {
            // Sort by wins first, then by win rate
            if (b.wins !== a.wins) return b.wins - a.wins;
            return b.winRate - a.winRate;
        });

    // Update table
    if (sortedPlayers.length === 0) {
        dashElements.playersTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #888;">
                    Chua co nguoi choi...
                </td>
            </tr>
        `;
        return;
    }

    dashElements.playersTbody.innerHTML = sortedPlayers.map((player, index) => {
        const winRateClass = player.winRate >= 50 ? 'good' : 'bad';
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(player.name)}</td>
                <td>${player.totalGames}</td>
                <td>${player.wins}</td>
                <td class="win-rate ${winRateClass}">${player.winRate}%</td>
                <td>${player.switchRate}%</td>
            </tr>
        `;
    }).join('');
}

// ===== DEMO DATA (for offline mode) =====
function showDemoData() {
    // Show fake data for demo
    dashboardState.stats = {
        totalGames: 47,
        switchWins: 15,
        switchLosses: 7,
        stayWins: 8,
        stayLosses: 17
    };

    updateStatsUI();

    // Show demo players
    dashElements.playersTbody.innerHTML = `
        <tr>
            <td>1</td>
            <td>Nguyen Van A (Demo)</td>
            <td>5</td>
            <td>4</td>
            <td class="win-rate good">80%</td>
            <td>80%</td>
        </tr>
        <tr>
            <td>2</td>
            <td>Tran Thi B (Demo)</td>
            <td>5</td>
            <td>3</td>
            <td class="win-rate good">60%</td>
            <td>60%</td>
        </tr>
        <tr>
            <td>3</td>
            <td>Le Van C (Demo)</td>
            <td>5</td>
            <td>2</td>
            <td class="win-rate bad">40%</td>
            <td>20%</td>
        </tr>
    `;

    dashElements.playerCount.textContent = '3 (Demo)';
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== EXPORT DATA =====
function exportData() {
    const games = dashboardState.games;

    if (games.length === 0) {
        alert('Chua co du lieu de export!');
        return;
    }

    // Create CSV content
    const headers = ['Timestamp', 'Player', 'Round', 'Car Position', 'First Choice', 'Switched', 'Final Choice', 'Won'];
    const rows = games.map(g => [
        g.timestamp,
        g.playerName,
        g.round,
        g.carPosition,
        g.firstChoice,
        g.switched ? 'Yes' : 'No',
        g.finalChoice,
        g.won ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `monty-hall-${window.firebaseConfig?.SESSION_ID || 'data'}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

// ===== RESET SESSION =====
function resetSession() {
    if (!window.firebaseConfig?.isFirebaseEnabled) {
        alert('Firebase chua ket noi!');
        return;
    }

    if (!confirm('Ban co chac muon RESET tat ca du lieu?\n\nHanh dong nay KHONG THE HOAN TAC!')) {
        return;
    }

    const db = window.firebaseConfig.database;
    const sessionId = window.firebaseConfig.SESSION_ID;

    db.ref(`sessions/${sessionId}`).remove()
        .then(() => {
            alert('Da reset session thanh cong!');
            location.reload();
        })
        .catch(err => {
            alert('Loi khi reset: ' + err.message);
        });
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
