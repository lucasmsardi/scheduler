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
    INSERT INTO schedules (name, api_endpoint, frequency, next_execution, last_execution, response_time, status, error_log)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    scheduleName, 
    apiEndpoint, 
    frequency, 
    nextExecution || null,  
    lastExecution || null, 
    responseTime,         
    status,               
    errorLog              
  ];

  const result = await query(sql, values);
  return result.rows[0];
}

export async function deleteSchedule(id: string) {
  const sql = `DELETE FROM "schedules" WHERE id = $1 RETURNING *;`;

  const values = [id];
  const result = await query(sql, values);

  if (result.rowCount === 0) {
    throw new Error('Schedule not found');
  }

  return result.rows[0];
}
