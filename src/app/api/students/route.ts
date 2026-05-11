import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classrooms, students } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { classroomCode, nickname, avatar } = await req.json();

  const codeNorm = String(classroomCode).toUpperCase().trim();
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

  const nick = String(nickname).trim().slice(0, 20);
  if (!nick) {
    return NextResponse.json({ error: "El apodo no puede estar vacío." }, { status: 400 });
  }

  const [student] = await db
    .insert(students)
    .values({
      classroomId: classroom.id,
      nickname: nick,
      avatar: String(avatar),
      balance: classroom.initialBalance,
    })
    .returning();

  return NextResponse.json(student, { status: 201 });
}

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("id");
  if (!studentId) return NextResponse.json({ error: "Falta el ID." }, { status: 400 });

  const [student] = await db.select().from(students).where(eq(students.id, studentId));
  if (!student) return NextResponse.json({ error: "Estudiante no encontrado." }, { status: 404 });

  return NextResponse.json(student);
}
