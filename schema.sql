-- 1. Create players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    nationality TEXT NOT NULL,
    role TEXT NOT NULL,
    batting_style TEXT,
    bowling_style TEXT,
    is_overseas BOOLEAN DEFAULT false,
    teams TEXT[] NOT NULL,
    seasons INT[] NOT NULL,
    is_active_2024 BOOLEAN DEFAULT false,
    has_captained BOOLEAN DEFAULT false,
    won_trophy BOOLEAN DEFAULT false,
    orange_cap BOOLEAN DEFAULT false,
    purple_cap BOOLEAN DEFAULT false,
    matches INT DEFAULT 0,
    runs INT DEFAULT 0,
    wickets INT DEFAULT 0,
    strike_rate DECIMAL(5,2),
    economy DECIMAL(5,2),
    catches INT DEFAULT 0,
    stumpings INT DEFAULT 0,
    fifties INT DEFAULT 0,
    hundreds INT DEFAULT 0,
    best_score INT,
    is_finisher BOOLEAN DEFAULT false,
    is_opener BOOLEAN DEFAULT false,
    is_death_bowler BOOLEAN DEFAULT false,
    is_spin_bowler BOOLEAN DEFAULT false,
    is_fast_bowler BOOLEAN DEFAULT false,
    era TEXT,
    height_cm INT,
    age INT,
    debut_year INT,
    last_year INT,
    description TEXT,
    photo_url TEXT,
    tricky_pair_tag TEXT
);

-- 2. Create sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_pool JSONB NOT NULL,
    history JSONB NOT NULL DEFAULT '[]',
    question_count INT DEFAULT 0,
    status TEXT DEFAULT 'active',
    last_guessed_player TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create error_log table
CREATE TABLE error_log (
    id SERIAL PRIMARY KEY,
    session_id UUID,
    error_type TEXT,
    error_message TEXT,
    fallback_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
