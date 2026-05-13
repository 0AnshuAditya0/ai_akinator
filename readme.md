# IPL AI Akinator — Neural Identity Correlation Engine

Think of any IPL player (past or present). Our neural-linked AI engine will diagnose your player's identity using advanced strategy integrity checks and real-time probability vectors.

![UI Design](https://img.shields.io/badge/UI-Vibrant_Glassmorphism-purple)
![AI Engine](https://img.shields.io/badge/Logic-Bayesian_Local_Scorer-cyan)
![Performance](https://img.shields.io/badge/Latency-~50ms-green)

---

## 🌌 Project Overview

The **IPL AI Akinator** is a high-performance, visually immersive player-guessing game. It combines **Bayesian probability mathematics** with a **Vibrant Glassmorphism UI** to deliver a "Machine Diagnostic" experience. Unlike traditional LLM-based games, this project uses a hybrid logic engine to achieve near-instant response times.

### 🎮 How It Works (The Workflow)

1.  **Initialization**: The system boots up a "Neural Pool" containing **260+ IPL players**. Every player starts with an equal probability (Uniform Distribution).
2.  **Strategic Questioning**: The engine analyzes the pool and selects the question from its **Pre-computed Question Bank** that will split the candidate pool most effectively (Maximum Information Gain).
3.  **Bayesian Update Loop**:
    - As you answer (Yes/No/Maybe), the **Local Scorer** applies weights to every player in the database.
    - Players matching your answer get a probability boost; those who don't are heavily penalized.
    - The **Diagnostics Sidebar** updates in real-time, showing the **Top 5 Candidates** currently in the lead.
4.  **Target Lock**: Once a player's probability exceeds **80%**, or after 12 questions, the system enters "Target Lock" and reveals the identity via the **Third Umpire Review** interface.

---

## 🛠️ Tech Stack & Tools

### **Frontend (The Interface)**
- **Next.js 14 (App Router)**: The backbone of the application, providing server-side rendering and efficient routing.
- **Tailwind CSS**: Custom utility-first styling used to build the **Vibrant Stadium** aesthetic.
- **Framer Motion**: Handles all complex animations, including the **Neural Loading Overlay**, glass card transitions, and the sticky HUD animations.
- **Lucide React**: For the high-fidelity diagnostic icons.

### **Backend (The Brain)**
- **Next.js API Routes**: Serverless functions that handle the scoring logic and database interactions.
- **Supabase (PostgreSQL)**: Stores the extensive player dataset and manages real-time game sessions.
- **Local Scoring Logic**: A custom implementation of Bayesian filtering that resides in `lib/question-bank.js`, eliminating the need for expensive LLM calls during standard turns.

### **Design Assets**
- **Vibrant Backdrop**: `public/vibrant2.png` provides the high-energy, blurred stadium atmosphere.
- **IPL Identity**: `public/ipl.jpeg` used for the sidebar branding and browser favicon.

---

## 🧠 Core Engineering Features

### 1. Zero-Latency Engine
By using a **Pre-computed Question Bank**, we've eliminated the typical 10-30 second wait time associated with LLMs. The game now responds in **~50ms**, with an intentional **800ms "Machine Thinking" delay** added solely for a premium user experience.

### 2. Machine Diagnostics Sidebar
A dedicated sidebar that functions as a "Live Debugger" for the game. It shows:
- **State History**: Your previous answers and their impact on the logic.
- **Prediction Metrics**: Live probability bars for the leading candidates.
- **Strategy Integrity**: A floating HUD at the bottom tracking the synchronization level of the current guess.

### 3. Intelligence Fallback
While 90% of the game is handled by the local Bayesian engine, the system is designed to fall back to **DeepSeek-R1** or **OpenRouter** models if complex reasoning or unmapped questions are required.

---

## ⚡ Setup & Development

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Add your Supabase and OpenRouter keys to `.env.local`.
3.  **Seed the Neural Pool**:
    ```bash
    node scripts/seed-database.js
    ```
4.  **Launch**:
    ```bash
    npm run dev
    ```

---

## 📄 License
MIT — Engineered for high-speed cricket intelligence.
