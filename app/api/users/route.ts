import { NextRequest, NextResponse } from 'next/server';
import { createSchedule, getSchedules } from '@/lib/db/schedules';

export async function GET(request: NextRequest) {
  try {
    const schedules = await getSchedules();
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newSchedule = await createSchedule(
      data.schedule_name,
      data.api_endpoint,
      data.frequency,
      data.next_execution,
      data.last_execution,
      data.response_time,
      data.status,
      data.error_log
    );
    return NextResponse.json(newSchedule);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
