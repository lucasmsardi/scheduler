import { NextRequest, NextResponse } from 'next/server';
import { createSchedule, getSchedules } from '@/lib/db/schedules';

export async function GET(request: NextRequest) {
  try {
    const schedules = await getSchedules();
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.api_endpoint || !data.next_execution) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newSchedule = await createSchedule(
      data.name,                            
      data.api_endpoint,
      data.frequency,
      data.next_execution,                 
      data.last_execution || null,         
      data.response_time || 'N/A',         
      data.status || 'Active',            
      data.error_log || ''                  
    );

    return NextResponse.json(newSchedule, { status: 201 }); 
  } catch (error) {
    console.error('Error creating schedule:', error); 
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
