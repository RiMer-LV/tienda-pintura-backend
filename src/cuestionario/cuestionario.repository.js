import pool from "../config/db.js";

// ---------- Pregunta ----------

export async function listarPreguntas() {
  const [filas] = await pool.query("SELECT * FROM pregunta ORDER BY orden ASC");
  return filas;
}

export async function buscarPreguntaPorId(id) {
  const [filas] = await pool.query("SELECT * FROM pregunta WHERE id = ?", [id]);
  return filas[0] || null;
}

export async function buscarPreguntaPorOrden(orden) {
  const [filas] = await pool.query("SELECT * FROM pregunta WHERE orden = ? LIMIT 1", [orden]);
  return filas[0] || null;
}

export async function crearPregunta({ texto, orden }) {
  const [resultado] = await pool.query("INSERT INTO pregunta (texto, orden) VALUES (?, ?)", [texto, orden]);
  return resultado.insertId;
}

export async function actualizarPregunta(id, { texto, orden }) {
  await pool.query("UPDATE pregunta SET texto = ?, orden = ? WHERE id = ?", [texto, orden, id]);
}

export async function eliminarPregunta(id) {
  const [resultado] = await pool.query("DELETE FROM pregunta WHERE id = ?", [id]);
  return resultado.affectedRows;
}

// ---------- Opcion ----------

export async function listarOpciones() {
  const [filas] = await pool.query("SELECT * FROM opcion ORDER BY id ASC");
  return filas;
}

export async function listarOpcionesPorPregunta(idPregunta) {
  const [filas] = await pool.query("SELECT * FROM opcion WHERE idPregunta = ? ORDER BY id ASC", [idPregunta]);
  return filas;
}

export async function buscarOpcionPorId(id) {
  const [filas] = await pool.query("SELECT * FROM opcion WHERE id = ?", [id]);
  return filas[0] || null;
}

export async function crearOpcion({ idPregunta, texto, tipoSigPaso, idSiguiente }) {
  const [resultado] = await pool.query(
    "INSERT INTO opcion (idPregunta, texto, sigPaso, tipoSigPaso) VALUES (?, ?, ?, ?)",
    [idPregunta, texto, idSiguiente, tipoSigPaso]
  );
  return resultado.insertId;
}

export async function actualizarOpcion(id, { texto, tipoSigPaso, idSiguiente }) {
  await pool.query(
    "UPDATE opcion SET texto = ?, sigPaso = ?, tipoSigPaso = ? WHERE id = ?",
    [texto, idSiguiente, tipoSigPaso, id]
  );
}

export async function eliminarOpcion(id) {
  const [resultado] = await pool.query("DELETE FROM opcion WHERE id = ?", [id]);
  return resultado.affectedRows;
}

export async function eliminarOpcionesDePregunta(idPregunta) {
  await pool.query("DELETE FROM opcion WHERE idPregunta = ?", [idPregunta]);
}

export async function existeOpcionQueApunta(tipoSigPaso, idSiguiente) {
  const [filas] = await pool.query(
    "SELECT id FROM opcion WHERE tipoSigPaso = ? AND sigPaso = ? LIMIT 1",
    [tipoSigPaso, idSiguiente]
  );
  return filas.length > 0;
}

// ---------- Recomendacion ----------

export async function listarRecomendaciones() {
  const [filas] = await pool.query("SELECT * FROM recomendacion ORDER BY id ASC");
  return filas;
}

export async function buscarRecomendacionPorId(id) {
  const [filas] = await pool.query("SELECT * FROM recomendacion WHERE id = ?", [id]);
  return filas[0] || null;
}

export async function crearRecomendacion({ nombre, descripcion }) {
  const [resultado] = await pool.query(
    "INSERT INTO recomendacion (nombre, descripcion) VALUES (?, ?)",
    [nombre, descripcion]
  );
  return resultado.insertId;
}

export async function actualizarRecomendacion(id, { nombre, descripcion }) {
  await pool.query("UPDATE recomendacion SET nombre = ?, descripcion = ? WHERE id = ?", [nombre, descripcion, id]);
}

export async function eliminarRecomendacion(id) {
  const [resultado] = await pool.query("DELETE FROM recomendacion WHERE id = ?", [id]);
  return resultado.affectedRows;
}

// ---------- recomendacion_producto ----------

export async function listarProductosDeRecomendacion(idRecomendacion) {
  const [filas] = await pool.query(
    `SELECT p.* FROM producto p
      INNER JOIN recomendacion_producto rp ON rp.idProducto = p.id
      WHERE rp.idRecomendacion = ? AND p.activo = TRUE`,
    [idRecomendacion]
  );
  return filas;
}

export async function existeRelacionProducto(idRecomendacion, idProducto) {
  const [filas] = await pool.query(
    "SELECT 1 FROM recomendacion_producto WHERE idRecomendacion = ? AND idProducto = ?",
    [idRecomendacion, idProducto]
  );
  return filas.length > 0;
}

export async function agregarProducto(idRecomendacion, idProducto) {
  await pool.query(
    "INSERT INTO recomendacion_producto (idRecomendacion, idProducto) VALUES (?, ?)",
    [idRecomendacion, idProducto]
  );
}

export async function quitarProducto(idRecomendacion, idProducto) {
  const [resultado] = await pool.query(
    "DELETE FROM recomendacion_producto WHERE idRecomendacion = ? AND idProducto = ?",
    [idRecomendacion, idProducto]
  );
  return resultado.affectedRows;
}

export async function quitarProductosDeRecomendacion(idRecomendacion) {
  await pool.query("DELETE FROM recomendacion_producto WHERE idRecomendacion = ?", [idRecomendacion]);
}

// ---------- Historial / completado ----------

export async function crearHistorialCuestionario({ idUsuario, respuestas, mensajeCliente, equipoRecomendado }) {
  await pool.query(
    `INSERT INTO historialCuestionario (idUsuario, respuestas, mensajeCliente, equipoRecomendado, contactado)
      VALUES (?, ?, ?, ?, FALSE)`,
    [idUsuario, respuestas, mensajeCliente, equipoRecomendado]
  );
}

export async function registrarCompletado(tipo) {
  await pool.query("INSERT INTO cuestionario_completado (tipo) VALUES (?)", [tipo]);
}
