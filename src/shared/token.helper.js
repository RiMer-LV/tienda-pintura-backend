import crypto from "crypto";

const EXPIRACION_TOKEN_MS = 24 * 60 * 60 * 1000; // 24 horas

export function generarToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function calcularExpiracion() {
  return new Date(Date.now() + EXPIRACION_TOKEN_MS);
}
