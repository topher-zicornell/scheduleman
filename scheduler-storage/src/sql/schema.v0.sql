CREATE TABLE schedule (
  schedule_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_url TEXT NOT NULL,
  action_body TEXT,
  schedule_type INTEGER NOT NULL,
  schedule_details TEXT NOT NULL
);

CREATE TABLE next_execution (
  execution_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES schedule,
  execute_at TIMESTAMP NOT NULL,
  started_at TIMESTAMP,
  retry_count INTEGER DEFAULT 0
);
