# IPL Selector — AI-Powered Player Guessing Engine

Think of any IPL player (past or present). Our Bayesian AI engine will guess who it is within 12 questions. 

![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium-blue)
![AI](https://img.shields.io/badge/AI-DeepSeek--R1-orange)
![Framework](https://img.shields.io/badge/Framework-Next.js--14-black)

## 🚀 Features

- **Bayesian Reasoning Engine**: Uses advanced probability distribution to narrow down candidates.
* **Multi-LLM Fallback Chain**: Robust API handling with automatic failover between DeepSeek R1, Llama 3.3, Qwen 2.5, and Gemma.
- **Terminal Minimalist UI**: A premium, dark-mode terminal aesthetic with CRT effects and smooth micro-animations.
- **Real-time Stats**: Powered by Supabase with live player data merging from Kaggle datasets.
- **Smart Question Selection**: Maximizes information gain per question to ensure a guess within 12 steps.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Next.js API Routes (Serverless).
- **Database**: Supabase (PostgreSQL).
- **AI Models**: DeepSeek R1 (via OpenRouter/Direct), Meta Llama 3.3 70B, Qwen 2.5.

## 🏁 Quick Start

### 1. Prerequisites
- Node.js 18+
- Supabase Account
- OpenRouter API Key (or DeepSeek API Key)

### 2. Environment Setup
Create a `.env.local` file in the root:
```bash
OPENROUTER_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEEPSEEK_API_KEY=your_deepseek_key_optional
```

### 3. Database Initialization
1. Run the `schema.sql` script in your Supabase SQL Editor.
2. Seed the database with player statistics:
```bash
node scripts/seed-database.js
```

### 4. Run Development Server
```bash
npm run dev
```

## 🧠 Technical Architecture

### The Probability Loop
1. **Start**: Uniform probability is assigned to all ~100+ players.
2. **Question**: AI selects a question that splits the candidate pool effectively.
3. **Answer**: User provides 'Yes', 'No', 'Maybe', or 'Unknown'.
4. **Update**: Probabilities are updated using a Bayesian update rule. 
5. **Guess**: When a player exceeds 80% confidence, the AI makes its move.

### Reliability Layer
The system uses a "Multi-Model Fallback Chain". If the primary AI model (DeepSeek R1) is rate-limited or unavailable, the system automatically tries Llama 3.3, then Qwen, and finally falls back to a local mathematical scorer.

## 📄 License
MIT
