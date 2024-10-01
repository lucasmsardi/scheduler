import { NextResponse } from 'next/server';
import { getSchedules, createSchedule } from '@/lib/db/schedules';

export async function GET() {
  try {
    const schedules = await getSchedules();
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { scheduleName, apiEndpoint, frequency, nextExecution, lastExecution, responseTime, status, errorLog } = await req.json();
    const newSchedule = await createSchedule(
      scheduleName,
      apiEndpoint,
      frequency,
      nextExecution,
      lastExecution,
      responseTime,
      status,
      errorLog
    );
    return NextResponse.json(newSchedule);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
