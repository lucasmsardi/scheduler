import { NextResponse } from 'next/server';
import { getSchedules, createSchedule } from '@/lib/db/schedules';
import { Task } from '@/types'; 

export async function GET() {
  try {
    const tasks: Task[] = await getSchedules();
    return NextResponse.json(tasks || []);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) { 
  try {
    const {
      name,
      apiEndpoint,
      frequency,
      nextExecution,
      lastExecution,
      responseTime,
      status,
      errorLog
    }: Omit<Task, 'id'> = await req.json();  

    const newSchedule: Task = await createSchedule(
      name,
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
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
