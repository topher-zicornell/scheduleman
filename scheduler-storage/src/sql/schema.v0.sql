SELECT 'CREATE DATABASE scheduleman OWNER scheduleman'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname='scheduleman');

CREATE TABLE IF NOT EXISTS schedule (
  schedule_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_url TEXT NOT NULL,
  action_body TEXT,
  schedule_type INTEGER NOT NULL,
  schedule_detail TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS next_execution (
  execution_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES schedule(schedule_id),
  execute_at TIMESTAMP NOT NULL,
  started_at TIMESTAMP,
  try_count INTEGER DEFAULT 0
);
