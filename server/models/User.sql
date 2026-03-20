-- Run this SQL in your PostgreSQL database (mock_interview_db) to create the users table

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Interview sessions table (for Dashboard stats)
CREATE TABLE IF NOT EXISTS interview_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  score INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  ai_feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on user_id for fast session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON interview_sessions(user_id);

-- Interview questions / transcript table
CREATE TABLE IF NOT EXISTS interview_questions (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  user_answer TEXT,
  ai_feedback TEXT,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on session_id for fast transcript lookups
CREATE INDEX IF NOT EXISTS idx_questions_session_id ON interview_questions(session_id);
