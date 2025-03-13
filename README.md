# 🚀 Jumper Challenge

## Overview

Jumper Challenge is a full-stack application consisting of **two directories**:

- **`frontend/`** → A Next.js app with TailwindCSS for UI and RainbowKit for wallet authentication.
- **`backend/`** → An Express.js server handling authentication and ERC20 token fetching using Alchemy.

Each directory has its own **README.md** with more details on setup and usage.

---

## 🛠 Setup Instructions

### **1️⃣ Set Up Environment Variables**

Both the frontend and backend require environment variables.

- Frontend:
  - Copy .env.template to .env.local and add your NEXT_PUBLIC_PROJECT_ID (obtained here https://cloud.walletconnect.com)
- Backend:
  - Copy .env.template to .env and add your ALCHEMY_API_KEY (obtained here https://www.alchemy.com)

### **2️⃣ Install Dependencies**

Run the following command in both frontend/ and backend/:

```bash
npm install
# or
yarn install
```

### **3️⃣ Run the Application**

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 in your browser to see the app.

### **✅ Features**

- Frontend (Next.js)
  - 🦄 Wallet Authentication using RainbowKit & Wagmi
  - 🔗 EVM Signature Verification
  - 🔄 Automatic ERC20 Token Fetching
  - 🎨 Responsive UI with TailwindCSS
  - ⚠️ Developer Warnings for Missing Environment Variables
- Backend (Express.js)
  - 🔑 Signature Verification (/api/auth)
  - 💰 Fetch ERC20 Balances (/api/tokens/:address)
  - 🛡 Error Handling & Validation
  - 🔍 Unit Tests with Vitest

### **🧪 Running Tests**

```bash
cd backend
npm test
```

or with coverage:

```bash
npm run test:cov
```
