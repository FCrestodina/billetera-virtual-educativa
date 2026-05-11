"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AvatarPicker } from "@/components/AvatarPicker";
import { ToastContainer, useToast } from "@/components/Toast";

export default function EstudiantePage() {
  const router = useRouter();
  const { toasts, add, remove } = useToast();

  const [classroomCode, setClassroomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("astronauta");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classroomCode, nickname, avatar }),
    });

    const data = await res.json();
    if (!res.ok) {
      add("error", data.error ?? "No se pudo unir al aula.");
    } else {
      localStorage.setItem("studentId", data.id);
      localStorage.setItem("classroomCode", classroomCode.toUpperCase().trim());
      router.push("/billetera");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-6 py-8 max-w-sm mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500 mb-3 shadow">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Unirse al aula</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Código de aula
          </label>
          <input
            type="text"
            value={classroomCode}
            onChange={(e) =>
              setClassroomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12))
            }
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xl font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
            placeholder="7A"
            maxLength={12}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tu apodo
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 20))}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ej: Dino Verde"
            maxLength={20}
            required
          />
          <p className="text-xs text-gray-400 mt-1">{nickname.length}/20 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Elegí tu avatar
          </label>
          <AvatarPicker selected={avatar} onSelect={setAvatar} />
        </div>

        <button
          type="submit"
          disabled={loading || !classroomCode || !nickname}
          className="w-full rounded-2xl bg-green-500 py-4 text-white font-bold text-lg hover:bg-green-600 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar al aula"}
        </button>
      </form>

      <ToastContainer toasts={toasts} onRemove={remove} />
    </main>
  );
}
