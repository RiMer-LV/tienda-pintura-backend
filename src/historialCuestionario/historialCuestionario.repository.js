import pool from "../config/db.js";

const SELECT_CON_USUARIO = `
  SELECT h.id, h.idUsuario, h.fecha, h.respuestas, h.mensajeCliente, h.equipoRecomendado, h.contactado,
         u.nombre AS nombreUsuario, u.email AS emailUsuario, u.telefono AS telefonoUsuario
    FROM historialCuestionario h
    LEFT JOIN usuario u ON u.id = h.idUsuario`;

export async function listarNoContactados() {
  const [filas] = await pool.query(`${SELECT_CON_USUARIO} WHERE h.contactado = FALSE ORDER BY h.fecha DESC`);
  return filas;
}

export async function buscarPorId(id) {
  const [filas] = await pool.query(`${SELECT_CON_USUARIO} WHERE h.id = ?`, [id]);
  return filas[0] || null;
}

export async function marcarContactado(id) {
  const [resultado] = await pool.query("UPDATE historialCuestionario SET contactado = TRUE WHERE id = ?", [id]);
  return resultado.affectedRows;
}
