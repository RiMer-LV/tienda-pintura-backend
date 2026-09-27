import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";

const SALT_ROUNDS = 10;
const EXPIRACION_TOKEN_MS = 24 * 60 * 60 * 1000; // 24 horas
const EXPIRACION_JWT = "1d";

class ErrorHttp extends Error {
  constructor(statusCode, mensaje) {
    super(mensaje);
    this.statusCode = statusCode;
  }
}

function generarTokenAleatorio() {
  return crypto.randomBytes(32).toString("hex");
}

export async function registrar({ nombre, email, contrasena }) {
  const usuarioExistente = await authRepository.buscarPorEmail(email);

  if (usuarioExistente) {
    if (usuarioExistente.tipoUsuario === "visitante") {
      const token = generarTokenAleatorio();
      const expiraToken = new Date(Date.now() + EXPIRACION_TOKEN_MS);
      await authRepository.actualizarToken(usuarioExistente.id, token, expiraToken);
      return { mensaje: "Revisa tu correo para completar el registro" };
    }

    throw new ErrorHttp(409, "El email ya está registrado");
  }

  const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);
  await authRepository.crearUsuario({
    nombre,
    email,
    contrasenaHash,
    tipoUsuario: "cliente",
  });

  return { mensaje: "Usuario registrado correctamente" };
}

export async function login({ email, contrasena }) {
  const usuario = await authRepository.buscarPorEmail(email);

  if (!usuario || !usuario.activo) {
    throw new ErrorHttp(401, "Credenciales inválidas");
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasenaHash || "");

  if (!contrasenaValida) {
    throw new ErrorHttp(401, "Credenciales inválidas");
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, tipoUsuario: usuario.tipoUsuario },
    process.env.JWT_SECRET,
    { expiresIn: EXPIRACION_JWT }
  );

  return { token, usuario };
}

export async function verificarTokenRegistro(token) {
  const usuario = await authRepository.buscarPorToken(token);

  if (!usuario) {
    throw new ErrorHttp(404, "Token no encontrado");
  }

  if (!usuario.expiraToken || new Date(usuario.expiraToken) < new Date()) {
    throw new ErrorHttp(410, "El token ha expirado");
  }

  return usuario;
}

export async function completarRegistro({ token, contrasena }) {
  const usuario = await verificarTokenRegistro(token);

  const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);
  await authRepository.actualizarContrasena(usuario.id, contrasenaHash);

  return { mensaje: "Registro completado correctamente" };
}

export { ErrorHttp };
