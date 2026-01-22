/**
 * FIREBASE CONFIGURATION
 * ========================
 *
 * HUONG DAN SETUP:
 * 1. Vao https://console.firebase.google.com
 * 2. Tao project moi (hoac dung project co san)
 * 3. Vao Project Settings > Your apps > Add app > Web
 * 4. Copy config vao day
 * 5. Vao Realtime Database > Create Database > Start in test mode
 *
 * CHU Y: Nho thay YOUR_... bang gia tri thuc tu Firebase Console
 */

// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//     databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT_ID.appspot.com",
//     messagingSenderId: "YOUR_SENDER_ID",
//     appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCsEb6hA0Ib1aFKe2sK1Q0Hx-N-3i1E1VU",
  authDomain: "monty-hall-game-b07ad.firebaseapp.com",
  databaseURL: "https://monty-hall-game-b07ad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monty-hall-game-b07ad",
  storageBucket: "monty-hall-game-b07ad.firebasestorage.app",
  messagingSenderId: "672906666105",
  appId: "1:672906666105:web:abea24610bc553a859f4a8"
};

// Session ID - Doi moi session cho moi buoi hoc
// Format: ten-lop-ngay (vd: toan-tin-k20-20240120)
const SESSION_ID = "demo-session";

// So luot choi mac dinh
const TOTAL_ROUNDS = 5;

// Google Sheet URL (Apps Script Web App)
// Huong dan: Xem README.md phan "Backup Google Sheet"
// Sau khi deploy Apps Script, paste URL vao day
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxfnJ1IaO9m428xXkm27UP-cn7179XAkO6dFxNUKNz-lyIYXSlUodm6E2rJm3AL0q94/exec";

// ===== KHONG CAN CHINH SUA DUOI DAY =====

// Initialize Firebase
let app, database;
let isFirebaseEnabled = false;

try {
    // Kiem tra xem config da duoc dien chua
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("⚠️ Firebase chua duoc cau hinh. Game se chay o che do OFFLINE.");
        console.warn("📖 Doc huong dan trong file firebase-config.js de setup Firebase.");
        isFirebaseEnabled = false;
    } else {
        app = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        isFirebaseEnabled = true;
        console.log("✅ Firebase da ket noi thanh cong!");
    }
} catch (error) {
    console.error("❌ Loi ket noi Firebase:", error);
    isFirebaseEnabled = false;
}

// Export cho cac file khac su dung
window.firebaseConfig = {
    database,
    isFirebaseEnabled,
    SESSION_ID,
    TOTAL_ROUNDS,
    GOOGLE_SHEET_URL
};
