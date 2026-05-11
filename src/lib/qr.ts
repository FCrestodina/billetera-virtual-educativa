import type { QRData, QRParseError } from "@/types";

export type QRParseResult =
  | { ok: true; data: QRData }
  | { ok: false; error: QRParseError };

export function parseQR(raw: string): QRParseResult {
  const lines = raw.trim().split(/\r?\n/);
  const map: Record<string, string> = {};

  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim().toLowerCase();
    const value = line.slice(eq + 1).trim();
    map[key] = value;
  }

  if (!map["precio"]) {
    return { ok: false, error: "Falta el precio." };
  }

  const precio = parseInt(map["precio"], 10);
  if (isNaN(precio) || precio <= 0) {
    return { ok: false, error: "El precio del QR no es válido." };
  }

  const tipoRaw = (map["tipo"] ?? "normal").toLowerCase();
  if (!["descuento", "reintegro", "normal"].includes(tipoRaw)) {
    return { ok: false, error: "No se pudo leer la promoción." };
  }

  const modoRaw = (map["modo"] ?? "porcentaje").toLowerCase();
  if (!["porcentaje", "monto"].includes(modoRaw)) {
    return { ok: false, error: "No se pudo leer la promoción." };
  }

  const promo = parseFloat(map["promo"] ?? "0");
  const tope = map["tope"] ? parseInt(map["tope"], 10) : undefined;

  return {
    ok: true,
    data: {
      comercio: map["comercio"] ?? "Comercio",
      producto: map["producto"] ?? "Producto",
      precio,
      promo: isNaN(promo) ? 0 : promo,
      modo: modoRaw as QRData["modo"],
      tipo: tipoRaw as QRData["tipo"],
      tope: tope && !isNaN(tope) ? tope : undefined,
    },
  };
}

export function calcularPromoKey(data: QRData): string {
  return `${data.comercio}|${data.producto}|${data.precio}|${data.promo}|${data.modo}|${data.tipo}`;
}
