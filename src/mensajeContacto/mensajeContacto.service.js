import * as mensajeContactoRepository from "./mensajeContacto.repository.js";
import { ErrorHttp } from "../shared/errorHttp.js";

export async function crear({ usuario, nombre, email, telefono, mensaje }) {
  if (!nombre || !email || !mensaje) {
    throw new ErrorHttp(400, "Nombre, email y mensaje son obligatorios");
  }

  const id = await mensajeContactoRepository.crear({
    idUsuario: usuario?.id ?? null,
    nombre,
    email,
    telefono: telefono || null,
    mensaje,
  });

  return { id, mensaje: "Mensaje enviado correctamente" };
}

export async function listarNoLeidos() {
  return mensajeContactoRepository.listarNoLeidos();
}

export async function marcarLeido(id) {
  const filas = await mensajeContactoRepository.marcarLeido(id);

  if (!filas) {
    throw new ErrorHttp(404, "Mensaje no encontrado");
  }

  return { mensaje: "Mensaje marcado como leído" };
}
