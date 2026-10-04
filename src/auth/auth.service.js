import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepository from "./auth.repository.js";
import { tipoUsuario } from "../constants/tipoUsuario.js";
import { ErrorHttp } from "../shared/errorHttp.js";
import { generarToken, calcularExpiracion } from "../shared/token.helper.js";

const SALT_ROUNDS = 10;
const EXPIRACION_JWT = "1d";

export async function registrar({ nombre, email, contrasena, telefono }) {
  const usuarioExistente = await authRepository.buscarPorEmail(email);

  if (usuarioExistente) {
    if (usuarioExistente.tipoUsuario === tipoUsuario.VISITANTE) {
      const token = generarToken();
      const expiraToken = calcularExpiracion();
      await authRepository.actualizarToken(usuarioExistente.id, token, expiraToken);
      return { mensaje: "Revisa tu correo para completar el registro" };
    }

    throw new ErrorHttp(409, "El email ya está registrado");
  }

  const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);
  await authRepository.crearUsuario({
    nombre,
    email,
    telefono: telefono || null,
    contrasenaHash,
    tipoUsuario: tipoUsuario.CLIENTE,
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
  await authRepository.completarRegistroUsuario(usuario.id, contrasenaHash, tipoUsuario.CLIENTE);

  return { mensaje: "Registro completado correctamente" };
}
