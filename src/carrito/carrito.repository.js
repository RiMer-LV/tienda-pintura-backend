import pool from "../config/db.js";

export async function buscarPorUsuario(idUsuario) {
  const [filas] = await pool.query("SELECT * FROM carrito WHERE idUsuario = ?", [idUsuario]);
  return filas[0] || null;
}

export async function crear(idUsuario) {
  const [resultado] = await pool.query("INSERT INTO carrito (idUsuario) VALUES (?)", [idUsuario]);
  return resultado.insertId;
}

export async function listarLineas(idCarrito) {
  const [filas] = await pool.query(
    `SELECT d.idProducto, p.nombre, p.imagen, p.precio, p.stock, p.activo, d.cantidad
      FROM detalle_carrito d
      INNER JOIN producto p ON p.id = d.idProducto
      WHERE d.idCarrito = ?
      ORDER BY d.id ASC`,
    [idCarrito]
  );
  return filas;
}

export async function buscarLinea(idCarrito, idProducto) {
  const [filas] = await pool.query(
    "SELECT * FROM detalle_carrito WHERE idCarrito = ? AND idProducto = ?",
    [idCarrito, idProducto]
  );
  return filas[0] || null;
}

export async function crearLinea(idCarrito, idProducto, cantidad) {
  await pool.query(
    "INSERT INTO detalle_carrito (idCarrito, idProducto, cantidad) VALUES (?, ?, ?)",
    [idCarrito, idProducto, cantidad]
  );
}

export async function actualizarCantidad(idCarrito, idProducto, cantidad) {
  await pool.query(
    "UPDATE detalle_carrito SET cantidad = ? WHERE idCarrito = ? AND idProducto = ?",
    [cantidad, idCarrito, idProducto]
  );
}

export async function eliminarLinea(idCarrito, idProducto) {
  const [resultado] = await pool.query(
    "DELETE FROM detalle_carrito WHERE idCarrito = ? AND idProducto = ?",
    [idCarrito, idProducto]
  );
  return resultado.affectedRows;
}

export async function vaciar(idCarrito) {
  await pool.query("DELETE FROM detalle_carrito WHERE idCarrito = ?", [idCarrito]);
}

export async function tocar(idCarrito) {
  await pool.query("UPDATE carrito SET fechaActualizacion = CURRENT_TIMESTAMP WHERE id = ?", [idCarrito]);
}
