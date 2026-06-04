"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, RefreshCw, Wallet, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Student } from "@/types";
import { formatPesos } from "@/lib/format";
import { getAvatar } from "@/components/avatars";

interface ClassroomData {
  classroom: {
    id: string;
    code: string;
    initialBalance: number;
    active: boolean;
  };
  students: Student[];
}

// useParams() devuelve el segmento de ruta tal cual (url-encoded). Lo decodificamos
// una vez para tener el nombre real del aula y re-encodear sin duplicar.
function decodeParam(v?: string): string {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export default function DocentePanelPage() {
  const params = useParams<{ code: string }>();
  const code = decodeParam(params.code);
  const [data, setData] = useState<ClassroomData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    if (code) setJoinUrl(`${window.location.origin}/estudiante?aula=${encodeURIComponent(code)}`);
  }, [code]);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/classrooms/${encodeURIComponent(code)}`);
    if (!res.ok) {
      const j = await res.json();
      setError(j.error);
      return;
    }
    const json = await res.json();
    setData(json);
    setLastUpdated(new Date());
  }, [code]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <Link href="/docente" className="text-blue-600 underline">
            Volver
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p>Cargando aula...</p>
        </div>
      </main>
    );
  }

  const { classroom, students } = data;

  return (
    <main className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <Link
        href="/docente"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="bg-blue-600 rounded-3xl p-6 text-white mb-6 shadow-lg">
        <p className="text-blue-200 text-sm mb-1">Nombre del aula</p>
        <p className="text-3xl sm:text-4xl font-black tracking-tight break-words">{classroom.code}</p>
        <p className="text-blue-200 text-sm mt-3">
          Crédito inicial: <strong className="text-white">{formatPesos(classroom.initialBalance)}</strong>
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <QrCode className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-sm">Escaneá para unirte al aula</span>
        </div>
        {joinUrl ? (
          <div className="bg-white p-3 rounded-2xl border border-gray-100">
            <QRCodeSVG value={joinUrl} size={180} level="M" marginSize={0} />
          </div>
        ) : (
          <div className="w-[180px] h-[180px] bg-gray-50 rounded-2xl animate-pulse" />
        )}
        <p className="text-xs text-gray-400 mt-3">
          Apuntá la cámara o ingresá el aula <strong className="text-gray-600">{classroom.code}</strong> en{" "}
          <span className="font-mono">Soy estudiante</span>.
        </p>
      </div>

      <Link
        href="/generar"
        className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 text-white font-bold hover:bg-green-600 active:scale-95 transition-all mb-6"
      >
        <QrCode className="w-5 h-5" /> Generar QR de productos
      </Link>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span className="font-semibold">{students.length} estudiante{students.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {lastUpdated
            ? `Actualizado ${lastUpdated.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : "Conectando..."}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Esperando que los estudiantes se unan...</p>
          <p className="text-xs mt-1">Compartí el aula <strong className="text-gray-600">{classroom.code}</strong> o el QR de arriba</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {students.map((s) => {
            const av = getAvatar(s.avatar);
            const pct = (s.balance / classroom.initialBalance) * 100;
            return (
              <li key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{av.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{s.username}</p>
                    <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{formatPesos(s.balance)}</p>
                    <div className="flex items-center gap-1 justify-end text-xs text-gray-400 mt-0.5">
                      <Wallet className="w-3 h-3" />
                      <span>{Math.round(pct)}%</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
