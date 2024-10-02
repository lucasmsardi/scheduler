import { NextResponse } from 'next/server';
import { getSchedules, createSchedule } from '@/lib/db/schedules';
import { Task } from '@/types/types'; 

// GET request to fetch all schedules
export async function GET() {
  try {
    const tasks: Task[] = await getSchedules();  // Define the type for fetched tasks
    return NextResponse.json(tasks || []);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST request to create a new schedule
export async function POST(req: Request) {
  try {
    // Extract the data from the request body and ensure it matches the Task structure
    const {
      name,
      apiEndpoint,
      frequency,
      nextExecution,
      lastExecution,
      responseTime,
      status,
      errorLog
    }: Omit<Task, 'id'> = await req.json();  // Use Omit to exclude 'id' from the request body

    // Call the createSchedule function to insert a new schedule
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
