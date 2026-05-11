import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { classrooms } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { pin, code, initialBalance } = await req.json();

  if (pin !== process.env.TEACHER_PIN) {
    return NextResponse.json({ error: "PIN incorrecto." }, { status: 401 });
  }

  const codeNorm = String(code).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  if (!codeNorm) {
    return NextResponse.json({ error: "Código de aula inválido." }, { status: 400 });
  }

  const balance = parseInt(initialBalance, 10);
  if (isNaN(balance) || balance <= 0) {
    return NextResponse.json({ error: "Crédito inicial inválido." }, { status: 400 });
  }

  const existing = await db.select().from(classrooms).where(eq(classrooms.code, codeNorm));
  if (existing.length > 0) {
    if (existing[0].active) {
      return NextResponse.json({ error: "Ya existe un aula activa con ese código." }, { status: 409 });
    }
    await db.delete(classrooms).where(eq(classrooms.code, codeNorm));
  }

  const [classroom] = await db
    .insert(classrooms)
    .values({ code: codeNorm, initialBalance: balance })
    .returning();

  return NextResponse.json(classroom, { status: 201 });
}
