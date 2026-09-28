import pool from "../config/db.js";

export async function buscarPorIdProducto(idProducto) {
  const [filas] = await pool.query("SELECT * FROM documentacion WHERE idProducto = ?", [idProducto]);
  return filas[0] || null;
}

export async function crear({ idProducto, fichaTecnica, manual, fuenteEnergia }) {
  const [resultado] = await pool.query(
    "INSERT INTO documentacion (idProducto, fichaTecnica, manual, fuenteEnergia) VALUES (?, ?, ?, ?)",
    [idProducto, fichaTecnica, manual, fuenteEnergia]
  );
  return resultado.insertId;
}

export async function actualizar(idProducto, { fichaTecnica, manual, fuenteEnergia }) {
  await pool.query(
    "UPDATE documentacion SET fichaTecnica = ?, manual = ?, fuenteEnergia = ? WHERE idProducto = ?",
    [fichaTecnica, manual, fuenteEnergia, idProducto]
  );
}

export async function eliminar(idProducto) {
  const [resultado] = await pool.query("DELETE FROM documentacion WHERE idProducto = ?", [idProducto]);
  return resultado.affectedRows;
}
