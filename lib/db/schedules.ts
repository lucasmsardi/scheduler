import { query } from '@/lib/db/db';

export async function getSchedules() {
  const sql = `SELECT * FROM "schedules"`;
  const result = await query(sql);
  return result.rows;
}

export async function createSchedule(
  scheduleName: string,
  apiEndpoint: string,
  frequency: string,
  nextExecution: string | null,
  lastExecution: string | null,
  responseTime: number | null,
  status: string | null,
  errorLog: string | null
) {
  const sql = `
    INSERT INTO schedules (schedule_name, api_endpoint, frequency, next_execution, last_execution, response_time, status, error_log)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [scheduleName, apiEndpoint, frequency, nextExecution, lastExecution, responseTime, status, errorLog];
  const result = await query(sql, values);
  return result.rows[0];
}
