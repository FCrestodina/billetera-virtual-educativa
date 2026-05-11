import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classrooms, students } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const codeNorm = code.toUpperCase();

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(and(eq(classrooms.code, codeNorm), eq(classrooms.active, true)));

  if (!classroom) {
    return NextResponse.json(
      { error: "No encontramos esa aula. Verificá el código con tu docente." },
      { status: 404 }
    );
  }

  const studentList = await db
    .select()
    .from(students)
    .where(eq(students.classroomId, classroom.id))
    .orderBy(students.joinedAt);

  return NextResponse.json({ classroom, students: studentList });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { pin } = await req.json();

  if (pin !== process.env.TEACHER_PIN) {
    return NextResponse.json({ error: "PIN incorrecto." }, { status: 401 });
  }

  await db
    .update(classrooms)
    .set({ active: false })
    .where(eq(classrooms.code, code.toUpperCase()));

  return NextResponse.json({ ok: true });
}
