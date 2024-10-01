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

-- Insert initial records into the schedules table
INSERT INTO schedules 
(name, api_endpoint, frequency, next_execution, last_execution, response_time, status, error_log) 
VALUES 
('Daily User Sync', 'https://api.example.com/sync-users', 'Daily', '2023-09-25 00:00:00+00', '2023-09-24 00:00:00+00', 1.2, 'Active', ''),
('Weekly Report Generation', 'https://api.example.com/generate-report', 'Weekly', '2023-09-25 01:00:00+00', '2023-09-18 01:00:00+00', 3.5, 'Active', ''),
('Monthly Data Backup', 'https://api.example.com/backup', 'Monthly', '2023-10-01 02:00:00+00', '2023-09-01 02:00:00+00', 10.7, 'Error', 'Connection timeout');
