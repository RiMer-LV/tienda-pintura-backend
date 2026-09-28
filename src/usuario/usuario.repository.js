import pool from "../config/db.js";

const COLUMNAS_PUBLICAS = "id, nombre, email, telefono, tipoUsuario, activo, fechaCreacion";

export async function buscarPorId(id) {
  const [filas] = await pool.query("SELECT * FROM usuario WHERE id = ?", [id]);
  return filas[0] || null;
}

export async function buscarPorEmail(email) {
  const [filas] = await pool.query("SELECT id FROM usuario WHERE email = ?", [email]);
  return filas[0] || null;
}

export async function crearVisitante({ nombre, email, telefono, tipoUsuario }) {
  const [resultado] = await pool.query(
    "INSERT INTO usuario (nombre, email, telefono, tipoUsuario) VALUES (?, ?, ?, ?)",
    [nombre, email, telefono || null, tipoUsuario]
  );
  return resultado.insertId;
}

export async function listarPorTipo(tipoUsuario) {
  const [filas] = await pool.query(
    `SELECT ${COLUMNAS_PUBLICAS} FROM usuario WHERE tipoUsuario = ? AND activo = TRUE`,
    [tipoUsuario]
  );
  return filas;
}

export async function actualizarToken(idUsuario, token, expiraToken) {
  await pool.query(
    "UPDATE usuario SET token = ?, expiraToken = ? WHERE id = ?",
    [token, expiraToken, idUsuario]
  );
}

export async function actualizarPerfil(idUsuario, { nombre, telefono, contrasenaHash }) {
  await pool.query(
    "UPDATE usuario SET nombre = ?, telefono = ?, contrasenaHash = COALESCE(?, contrasenaHash) WHERE id = ?",
    [nombre, telefono, contrasenaHash ?? null, idUsuario]
  );
}

export async function desactivar(idUsuario) {
  const [resultado] = await pool.query("UPDATE usuario SET activo = FALSE WHERE id = ?", [idUsuario]);
  return resultado.affectedRows;
}
