-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- 1. Sessions Table (Structured Metadata)
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT,
    device_info JSONB,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    behavior_fingerprint VECTOR(512) -- For future behavioral embeddings
);

-- 2. Behavioral Events Table (Time-series)
CREATE TABLE IF NOT EXISTS behavioral_events (
    time TIMESTAMPTZ NOT NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    url TEXT,
    event_data JSONB,
    x INTEGER,
    y INTEGER,
    dwell_time_ms INTEGER
);

-- Convert to Hypertable for massive scale
SELECT create_hypertable('behavioral_events', 'time', if_not_exists => TRUE);

-- Indexes for fast retrieval during training
CREATE INDEX IF NOT EXISTS idx_session_events ON behavioral_events (session_id, time DESC);
