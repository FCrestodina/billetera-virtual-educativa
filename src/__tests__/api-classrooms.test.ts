import { describe, it, expect, vi, beforeEach } from "vitest";
import { db } from "@/lib/db";
import { POST } from "@/app/api/classrooms/route";
import { postRequest, mockSelect, mockInsert, mockDelete } from "./api-test-utils";

vi.mock("@/lib/db", () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));

const URL = "http://localhost/api/classrooms";
const PIN = "1234";

describe("POST /api/classrooms", () => {
  beforeEach(() => {
    process.env.TEACHER_PIN = PIN;
    vi.mocked(db.select).mockReset();
    vi.mocked(db.insert).mockReset();
    vi.mocked(db.delete).mockReset();
  });

  it("rechaza con PIN incorrecto", async () => {
    const req = postRequest(URL, { pin: "0000", code: "5A", initialBalance: "1000" });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/PIN/);
  });

  it("rechaza código de aula vacío", async () => {
    const req = postRequest(URL, { pin: PIN, code: "   ", initialBalance: "1000" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rechaza crédito inicial inválido", async () => {
    const req = postRequest(URL, { pin: PIN, code: "5A", initialBalance: "-10" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rechaza si ya existe un aula activa con ese código", async () => {
    vi.mocked(db.select).mockReturnValueOnce(
      mockSelect([{ id: "c1", code: "5A", active: true, initialBalance: 1000 }]) as ReturnType<typeof db.select>
    );
    const req = postRequest(URL, { pin: PIN, code: "5A", initialBalance: "1000" });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it("reactiva un aula existente pero inactiva con el mismo código", async () => {
    vi.mocked(db.select).mockReturnValueOnce(
      mockSelect([{ id: "c1", code: "5A", active: false, initialBalance: 500 }]) as ReturnType<typeof db.select>
    );
    vi.mocked(db.delete).mockReturnValueOnce(mockDelete() as ReturnType<typeof db.delete>);
    vi.mocked(db.insert).mockReturnValueOnce(
      mockInsert([{ id: "c2", code: "5A", active: true, initialBalance: 2000 }]) as ReturnType<typeof db.insert>
    );
    const req = postRequest(URL, { pin: PIN, code: "5A", initialBalance: "2000" });
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(db.delete).toHaveBeenCalled();
  });

  it("crea el aula exitosamente", async () => {
    vi.mocked(db.select).mockReturnValueOnce(mockSelect([]) as ReturnType<typeof db.select>);
    vi.mocked(db.insert).mockReturnValueOnce(
      mockInsert([{ id: "c1", code: "5A", active: true, initialBalance: 1000 }]) as ReturnType<typeof db.insert>
    );
    const req = postRequest(URL, { pin: PIN, code: "5A", initialBalance: "1000" });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.code).toBe("5A");
    expect(body.initialBalance).toBe(1000);
  });
});
