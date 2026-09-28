import bcrypt from "bcryptjs";
import * as usuarioRepository from "./usuario.repository.js";
import { TIPO_USUARIO } from "../constants/tipoUsuario.js";
import { ErrorHttp } from "../shared/errorHttp.js";
import { generarToken, calcularExpiracion } from "../shared/token.helper.js";

const SALT_ROUNDS = 10;

function datosPublicos(usuario) {
  const { contrasenaHash, token, expiraToken, ...resto } = usuario;
  return resto;
}

export async function crearVisitante({ nombre, email, telefono }) {
  if (!nombre || !email) {
    throw new ErrorHttp(400, "Nombre y email son obligatorios");
  }

  if (await usuarioRepository.buscarPorEmail(email)) {
    throw new ErrorHttp(409, "El email ya está registrado");
  }

  const id = await usuarioRepository.crearVisitante({
    nombre,
    email,
    telefono,
    tipoUsuario: TIPO_USUARIO.VISITANTE,
  });

  return { id, mensaje: "Visitante creado correctamente" };
}

export async function listarVisitantes() {
  return usuarioRepository.listarPorTipo(TIPO_USUARIO.VISITANTE);
}

export async function enviarInvitacion(id) {
  const usuario = await usuarioRepository.buscarPorId(id);

  if (!usuario || !usuario.activo || usuario.tipoUsuario !== TIPO_USUARIO.VISITANTE) {
    throw new ErrorHttp(404, "Visitante no encontrado");
  }

  await usuarioRepository.actualizarToken(usuario.id, generarToken(), calcularExpiracion());

  // TODO: enviar el email de invitación con Mailtrap
  return { mensaje: "Invitación generada correctamente" };
}

export async function obtenerPerfil(id) {
  const usuario = await usuarioRepository.buscarPorId(id);

  if (!usuario || !usuario.activo) {
    throw new ErrorHttp(404, "Usuario no encontrado");
  }

  return datosPublicos(usuario);
}

export async function actualizarPerfil(id, { nombre, telefono, contrasenaActual, contrasenaNueva }) {
  const usuario = await usuarioRepository.buscarPorId(id);

  if (!usuario || !usuario.activo) {
    throw new ErrorHttp(404, "Usuario no encontrado");
  }

  let contrasenaHash = null;

  if (contrasenaNueva) {
    if (!contrasenaActual) {
      throw new ErrorHttp(400, "Debes indicar tu contraseña actual");
    }

    const coincide = await bcrypt.compare(contrasenaActual, usuario.contrasenaHash || "");
    if (!coincide) {
      throw new ErrorHttp(401, "La contraseña actual es incorrecta");
    }

    contrasenaHash = await bcrypt.hash(contrasenaNueva, SALT_ROUNDS);
  }

  await usuarioRepository.actualizarPerfil(id, {
    nombre: nombre ?? usuario.nombre,
    telefono: telefono ?? usuario.telefono,
    contrasenaHash,
  });

  return { mensaje: "Perfil actualizado correctamente" };
}

export async function eliminar(id) {
  const filas = await usuarioRepository.desactivar(id);

  if (!filas) {
    throw new ErrorHttp(404, "Usuario no encontrado");
  }

  return { mensaje: "Usuario eliminado correctamente" };
}
