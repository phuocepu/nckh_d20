# Monty Hall Game Show

Game mo phong bai toan Monty Hall de day xac suat cho sinh vien.

## Tinh nang

- **Game cho sinh vien**: Choi tren dien thoai, 5 luot/nguoi
- **Dashboard giang vien**: Xem ket qua realtime, QR code, export CSV
- **Firebase Realtime**: Dong bo ket qua tuc thi
- **Hoat dong offline**: Van chay duoc khi khong co Firebase

## Cau truc thu muc

```
monty-hall-game/
├── index.html          # Game cho sinh vien
├── dashboard.html      # Dashboard cho giang vien
├── css/
│   └── style.css       # Giao dien game
├── js/
│   ├── firebase-config.js  # Cau hinh Firebase (CAN CHINH SUA)
│   ├── game.js             # Logic game
│   └── dashboard.js        # Logic dashboard
└── README.md           # File nay
```

---

## HUONG DAN SETUP

### Buoc 1: Tao Firebase Project (5 phut)

1. Vao https://console.firebase.google.com
2. Click **"Add project"** (hoac "Create a project")
3. Dat ten project: `monty-hall-game`
4. **Tat** Google Analytics (khong can thiet)
5. Click **"Create project"**
6. Doi 30 giay de Firebase tao project

### Buoc 2: Tao Realtime Database (3 phut)

1. Trong Firebase Console, menu ben trai chon **"Build"** > **"Realtime Database"**
2. Click **"Create Database"**
3. Chon location: **Singapore** (gan Viet Nam)
4. Chon **"Start in test mode"** (cho phep doc/ghi tu do)
5. Click **"Enable"**

> **Luu y**: Test mode se het han sau 30 ngay. Khi do can cap nhat rules.

### Buoc 3: Lay Firebase Config (2 phut)

1. Click icon **⚙️ (Settings)** > **"Project settings"**
2. Cuon xuong phan **"Your apps"**
3. Click icon **"</>"** (Web) de them web app
4. Dat nickname: `monty-hall-web`
5. **KHONG** tich "Firebase Hosting"
6. Click **"Register app"**
7. Copy doan code config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "monty-hall-game-xxxxx.firebaseapp.com",
  databaseURL: "https://monty-hall-game-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monty-hall-game-xxxxx",
  storageBucket: "monty-hall-game-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Buoc 4: Cap nhat file firebase-config.js

Mo file `js/firebase-config.js` va thay the cac gia tri `YOUR_...`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",           // <-- Thay bang apiKey tu Firebase
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Doi SESSION_ID cho moi buoi hoc
const SESSION_ID = "toan-tin-k20-20240120";
```

### Buoc 5: Deploy len GitHub Pages (5 phut)

1. Tao repository moi tren GitHub: `monty-hall-game`

2. Push code len:
```bash
cd monty-hall-game
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/monty-hall-game.git
git push -u origin main
```

3. Bat GitHub Pages:
   - Vao **Settings** > **Pages**
   - Source: chon **"Deploy from a branch"**
   - Branch: chon **"main"** va **"/ (root)"**
   - Click **Save**

4. Doi 2-3 phut, website se co tai:
   - Game: `https://YOUR_USERNAME.github.io/monty-hall-game/`
   - Dashboard: `https://YOUR_USERNAME.github.io/monty-hall-game/dashboard.html`

---

## CACH SU DUNG

### Truoc buoi hoc:

1. Mo `js/firebase-config.js`
2. Doi `SESSION_ID` thanh ten moi (vd: `"toan-tin-k20-buoi-2"`)
3. Commit va push len GitHub

### Trong buoi hoc:

1. **Giang vien**: Mo `dashboard.html` tren may chieu
2. **Sinh vien**: Quet QR code hoac nhap URL de vao game
3. Xem ket qua realtime tren dashboard

### Sau buoi hoc:

1. Click **"Export CSV"** de tai du lieu
2. (Tuy chon) Click **"Reset Session"** de xoa du lieu cu

---

## MOT SO LUU Y

### Game khong ket noi Firebase?

- Kiem tra lai config trong `firebase-config.js`
- Kiem tra Realtime Database da duoc tao chua
- Kiem tra rules cua database (phai cho phep read/write)

### Rules cho Realtime Database

Neu test mode het han, vao **Realtime Database** > **Rules** va dat:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> **Canh bao**: Rules nay cho phep bat ky ai cung doc/ghi duoc. Chi dung cho muc dich hoc tap.

### Doi so luot choi

Mo `js/firebase-config.js` va doi:

```javascript
const TOTAL_ROUNDS = 5;  // Doi thanh so luot mong muon
```

---

## LIEN HE

Tao boi Claude Code cho chuong trinh bo tuc ky nang NCKH - EPU

*Phien ban: 1.0*
