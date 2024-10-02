import { deleteSchedule } from "@/lib/db/schedules";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      const deletedSchedule = await deleteSchedule(id);
      return NextResponse.json(deletedSchedule);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
  }
  