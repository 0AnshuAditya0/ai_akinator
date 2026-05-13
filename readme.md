# IPL Selector Engine — Neural Identity Correlation

Think of any IPL player (past or present). Our neural-linked AI engine will diagnose your player's identity using advanced strategy integrity checks and real-time probability vectors.

![UI Design](https://img.shields.io/badge/UI-Vibrant_Glassmorphism-purple)
![AI](https://img.shields.io/badge/Engine-DeepSeek--R1-cyan)
![Performance](https://img.shields.io/badge/UX-Zero_Latency-green)

## 🌌 The Experience

The IPL Selector Engine is a high-performance, immersive guessing game built with a **Vibrant Glassmorphism** aesthetic. Drawing inspiration from modern machine diagnostics and daylight stadium scoreboards, it provides a premium data-driven experience.

### 🚀 Key Features

- **Bayesian Neural Core**: Uses high-gain information splitting to narrow down ~100 candidates in under 12 questions.
- **Machine Diagnostics Sidebar**: Real-time tracking of state transitions (State 01, 02...) and **Target Prediction Metrics** showing the top 3 likely players at any moment.
- **Vibrant Backdrop System**: Dynamic high-energy backgrounds (`vibrant2.png`) with deep glassmorphism blurs and frosted card interaction.
- **Neural Loading & Sync**: A sophisticated loading overlay with a **30-second intelligent timer** that breaks the cycle as soon as data is synthesized.
- **Multi-Model Fallback Chain**: Robust failover between DeepSeek-R1, OpenRouter Smart-Routing, and local mathematical scoring for 100% uptime.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion (AnimatePresence).
- **Backend**: Next.js API Routes (Optimized Streaming & Token Limits).
- **Data Layer**: Supabase (PostgreSQL) for session management and player telemetry.
- **AI Layers**: DeepSeek-R1 (Primary), OpenRouter (Fallback Cluster).

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- Supabase Project
- API Keys for DeepSeek or OpenRouter

### 2. Environment Configuration
Create a `.env.local` file:
```bash
OPENROUTER_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEEPSEEK_API_KEY=your_deepseek_key_optional
```

### 3. Initialize Neural Pool
1. Execute `schema.sql` in your Supabase SQL Editor.
2. Seed the player data stream:
```bash
node scripts/seed-database.js
```

### 4. Deploy Diagnostic Server
```bash
npm run dev
```

## 🧠 Neural Architecture

### The Synchronized Loop
1. **Booting**: The system initializes a uniform probability distribution across the player pool.
2. **Analysis**: AI analyzes the search space and selects a high-gain delivery.
3. **Synchronization**: User answers (Yes/No/Maybe) update the probability vectors.
4. **Target Lock**: Once a candidate exceeds the **80% Confidence Threshold**, the system initiates the **"Third Umpire Review"** for the final guess reveal.

## 📄 License
MIT — High-Performance Strategic Entertainment.
