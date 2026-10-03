import pool from "../config/db.js";

export async function crear({ idUsuario, idProducto, origen }) {
  await pool.query(
    "INSERT INTO historial (idUsuario, idProducto, origen) VALUES (?, ?, ?)",
    [idUsuario, idProducto, origen]
  );
}
