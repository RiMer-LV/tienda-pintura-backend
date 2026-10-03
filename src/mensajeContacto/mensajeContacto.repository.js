import pool from "../config/db.js";

export async function crear({ idUsuario, nombre, email, telefono, mensaje }) {
  const [resultado] = await pool.query(
    "INSERT INTO mensajeContacto (idUsuario, nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?, ?)",
    [idUsuario, nombre, email, telefono, mensaje]
  );
  return resultado.insertId;
}

export async function listarNoLeidos() {
  const [filas] = await pool.query("SELECT * FROM mensajeContacto WHERE leido = FALSE ORDER BY fecha DESC");
  return filas;
}

export async function marcarLeido(id) {
  const [resultado] = await pool.query("UPDATE mensajeContacto SET leido = TRUE WHERE id = ?", [id]);
  return resultado.affectedRows;
}
