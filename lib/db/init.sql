-- Ensure you're connected to the correct database and schema
SET search_path TO public;

-- Create the schedules table if it doesn't exist
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  api_endpoint TEXT NOT NULL,
  frequency VARCHAR(50),
  next_execution TIMESTAMPTZ,
  last_execution TIMESTAMPTZ,
  response_time FLOAT,
  status VARCHAR(20),
  error_log TEXT
);


