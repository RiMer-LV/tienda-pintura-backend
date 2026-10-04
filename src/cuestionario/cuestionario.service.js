import * as cuestionarioRepository from "./cuestionario.repository.js";
import * as usuarioRepository from "../usuario/usuario.repository.js";
import * as productoRepository from "../producto/producto.repository.js";
import { tipoSigPaso } from "../constants/tipoSigPaso.js";
import { tipoCompletado } from "../constants/tipoCompletado.js";
import { tipoUsuario } from "../constants/tipoUsuario.js";
import { ErrorHttp } from "../shared/errorHttp.js";

const TIPOS_SIG_PASO = Object.values(tipoSigPaso);

// ---------- Helpers ----------

async function conOpciones(pregunta) {
  const opciones = await cuestionarioRepository.listarOpcionesPorPregunta(pregunta.id);
  return { ...pregunta, opciones };
}

async function obtenerPreguntaOError(id) {
  const pregunta = await cuestionarioRepository.buscarPreguntaPorId(id);
  if (!pregunta) {
    throw new ErrorHttp(404, "Pregunta no encontrada");
  }
  return pregunta;
}

async function obtenerRecomendacionOError(id) {
  const recomendacion = await cuestionarioRepository.buscarRecomendacionPorId(id);
  if (!recomendacion) {
    throw new ErrorHttp(404, "Recomendación no encontrada");
  }
  return recomendacion;
}

async function validarSiguiente(tipo, idSiguiente) {
  if (!TIPOS_SIG_PASO.includes(tipo) || !idSiguiente) {
    throw new ErrorHttp(400, "tipoSigPaso e idSiguiente son obligatorios y deben ser válidos");
  }

  const destino = tipo === tipoSigPaso.PREGUNTA
    ? await cuestionarioRepository.buscarPreguntaPorId(idSiguiente)
    : await cuestionarioRepository.buscarRecomendacionPorId(idSiguiente);

  if (!destino) {
    throw new ErrorHttp(400, `El siguiente paso (${tipo}) indicado no existe`);
  }
}

// ---------- Pregunta (público) ----------

export async function obtenerInicio() {
  const pregunta = await cuestionarioRepository.buscarPreguntaPorOrden(1);
  if (!pregunta) {
    throw new ErrorHttp(404, "No hay una pregunta inicial configurada");
  }
  return conOpciones(pregunta);
}

export async function obtenerPregunta(id) {
  return conOpciones(await obtenerPreguntaOError(id));
}

// ---------- Pregunta (admin) ----------

export async function listarPreguntas() {
  const [preguntas, opciones] = await Promise.all([
    cuestionarioRepository.listarPreguntas(),
    cuestionarioRepository.listarOpciones(),
  ]);

  return preguntas.map((pregunta) => ({
    ...pregunta,
    opciones: opciones.filter((opcion) => opcion.idPregunta === pregunta.id),
  }));
}

export async function crearPregunta({ texto, orden }) {
  if (!texto || orden === undefined) {
    throw new ErrorHttp(400, "Texto y orden son obligatorios");
  }

  const id = await cuestionarioRepository.crearPregunta({ texto, orden });
  return { id, mensaje: "Pregunta creada correctamente" };
}

export async function actualizarPregunta(id, { texto, orden }) {
  const pregunta = await obtenerPreguntaOError(id);

  await cuestionarioRepository.actualizarPregunta(id, {
    texto: texto ?? pregunta.texto,
    orden: orden ?? pregunta.orden,
  });

  return { mensaje: "Pregunta actualizada correctamente" };
}

export async function eliminarPregunta(id) {
  await obtenerPreguntaOError(id);

  if (await cuestionarioRepository.existeOpcionQueApunta(tipoSigPaso.PREGUNTA, id)) {
    throw new ErrorHttp(400, "No se puede eliminar: otra opción apunta a esta pregunta");
  }

  await cuestionarioRepository.eliminarOpcionesDePregunta(id);
  await cuestionarioRepository.eliminarPregunta(id);
  return { mensaje: "Pregunta eliminada correctamente" };
}

// ---------- Opcion (admin) ----------

export async function crearOpcion(idPregunta, { texto, tipoSigPaso: tipo, idSiguiente }) {
  await obtenerPreguntaOError(idPregunta);

  if (!texto) {
    throw new ErrorHttp(400, "El texto es obligatorio");
  }
  await validarSiguiente(tipo, idSiguiente);

  const id = await cuestionarioRepository.crearOpcion({ idPregunta, texto, tipoSigPaso: tipo, idSiguiente });
  return { id, mensaje: "Opción creada correctamente" };
}

export async function actualizarOpcion(id, { texto, tipoSigPaso: tipo, idSiguiente }) {
  const opcion = await cuestionarioRepository.buscarOpcionPorId(id);
  if (!opcion) {
    throw new ErrorHttp(404, "Opción no encontrada");
  }

  const nuevoTipo = tipo ?? opcion.tipoSigPaso;
  const nuevoSiguiente = idSiguiente ?? opcion.sigPaso;
  await validarSiguiente(nuevoTipo, nuevoSiguiente);

  await cuestionarioRepository.actualizarOpcion(id, {
    texto: texto ?? opcion.texto,
    tipoSigPaso: nuevoTipo,
    idSiguiente: nuevoSiguiente,
  });

  return { mensaje: "Opción actualizada correctamente" };
}

export async function eliminarOpcion(id) {
  const filas = await cuestionarioRepository.eliminarOpcion(id);
  if (!filas) {
    throw new ErrorHttp(404, "Opción no encontrada");
  }
  return { mensaje: "Opción eliminada correctamente" };
}

// ---------- Recomendacion (admin) ----------

export async function listarRecomendaciones() {
  return cuestionarioRepository.listarRecomendaciones();
}

export async function crearRecomendacion({ nombre, descripcion }) {
  if (!nombre) {
    throw new ErrorHttp(400, "El nombre es obligatorio");
  }

  const id = await cuestionarioRepository.crearRecomendacion({ nombre, descripcion: descripcion ?? null });
  return { id, mensaje: "Recomendación creada correctamente" };
}

export async function actualizarRecomendacion(id, { nombre, descripcion }) {
  const recomendacion = await obtenerRecomendacionOError(id);

  await cuestionarioRepository.actualizarRecomendacion(id, {
    nombre: nombre ?? recomendacion.nombre,
    descripcion: descripcion ?? recomendacion.descripcion,
  });

  return { mensaje: "Recomendación actualizada correctamente" };
}

export async function eliminarRecomendacion(id) {
  await obtenerRecomendacionOError(id);

  if (await cuestionarioRepository.existeOpcionQueApunta(tipoSigPaso.RECOMENDACION, id)) {
    throw new ErrorHttp(400, "No se puede eliminar: una opción apunta a esta recomendación");
  }

  await cuestionarioRepository.quitarProductosDeRecomendacion(id);
  await cuestionarioRepository.eliminarRecomendacion(id);
  return { mensaje: "Recomendación eliminada correctamente" };
}

export async function agregarProducto(idRecomendacion, idProducto) {
  await obtenerRecomendacionOError(idRecomendacion);

  if (!idProducto) {
    throw new ErrorHttp(400, "idProducto es obligatorio");
  }

  const producto = await productoRepository.buscarPorId(idProducto);
  if (!producto) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }

  if (await cuestionarioRepository.existeRelacionProducto(idRecomendacion, idProducto)) {
    throw new ErrorHttp(400, "El producto ya está asociado a la recomendación");
  }

  await cuestionarioRepository.agregarProducto(idRecomendacion, idProducto);
  return { mensaje: "Producto agregado a la recomendación" };
}

export async function quitarProducto(idRecomendacion, idProducto) {
  const filas = await cuestionarioRepository.quitarProducto(idRecomendacion, idProducto);
  if (!filas) {
    throw new ErrorHttp(404, "El producto no está asociado a la recomendación");
  }
  return { mensaje: "Producto quitado de la recomendación" };
}

// ---------- Cuestionario completado (público) ----------

async function armarRespuestas(respuestas) {
  const lineas = [];

  for (const [indice, { idPregunta, idOpcion }] of respuestas.entries()) {
    const pregunta = await cuestionarioRepository.buscarPreguntaPorId(idPregunta);
    const opcion = await cuestionarioRepository.buscarOpcionPorId(idOpcion);

    if (!pregunta || !opcion || opcion.idPregunta !== pregunta.id) {
      throw new ErrorHttp(400, `Respuesta ${indice + 1} inválida`);
    }

    lineas.push(`${indice + 1}. ${pregunta.texto}? --> ${opcion.texto}`);
  }

  return lineas.join("\n");
}

async function resolverUsuarioVisitante(datosVisitante) {
  const { nombre, email, telefono } = datosVisitante;

  if (!email) {
    throw new ErrorHttp(400, "El email es obligatorio");
  }

  const existente = await usuarioRepository.buscarPorEmail(email);
  if (existente) {
    return existente.id;
  }

  if (!nombre) {
    throw new ErrorHttp(400, "El nombre es obligatorio");
  }

  return usuarioRepository.crearVisitante({
    nombre,
    email,
    telefono,
    tipoUsuario: tipoUsuario.VISITANTE,
  });
}

export async function completar({ usuario, idRecomendacion, respuestas, datosVisitante }) {
  if (!idRecomendacion || !Array.isArray(respuestas) || respuestas.length === 0) {
    throw new ErrorHttp(400, "idRecomendacion y respuestas son obligatorios");
  }

  const recomendacion = await obtenerRecomendacionOError(idRecomendacion);
  const textoRespuestas = await armarRespuestas(respuestas);

  let idUsuario = null;
  let mensajeCliente = null;
  let tipo = tipoCompletado.ANONIMO;

  if (usuario) {
    idUsuario = usuario.id;
    tipo = tipoCompletado.USUARIO;
  } else if (datosVisitante) {
    idUsuario = await resolverUsuarioVisitante(datosVisitante);
    mensajeCliente = datosVisitante.mensajeCliente ?? null;
    tipo = tipoCompletado.VISITANTE;
  }

  if (idUsuario !== null) {
    await cuestionarioRepository.crearHistorialCuestionario({
      idUsuario,
      respuestas: textoRespuestas,
      mensajeCliente,
      equipoRecomendado: recomendacion.nombre,
    });
  }

  await cuestionarioRepository.registrarCompletado(tipo);

  const productos = await cuestionarioRepository.listarProductosDeRecomendacion(idRecomendacion);
  return { productos };
}
