import pool from "../config/db.js";

const ORDENES = {
  precio_asc: "precio ASC",
  precio_desc: "precio DESC",
  nombre_asc: "nombre ASC",
};

export async function listar({ page, limit, categoria, buscar, orden }) {
  const condiciones = ["activo = TRUE"];
  const parametros = [];

  if (categoria) {
    condiciones.push("categoria = ?");
    parametros.push(categoria);
  }

  if (buscar) {
    condiciones.push("nombre LIKE ?");
    parametros.push(`%${buscar}%`);
  }

  const whereClause = `WHERE ${condiciones.join(" AND ")}`;
  const orderClause = ORDENES[orden] ? `ORDER BY ${ORDENES[orden]}` : "";
  const offset = (page - 1) * limit;

  const [filas] = await pool.query(
    `SELECT * FROM producto ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
    [...parametros, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM producto ${whereClause}`,
    parametros
  );

  return { filas, total };
}

export async function buscarPorId(id) {
  const [filas] = await pool.query("SELECT * FROM producto WHERE id = ?", [id]);
  return filas[0] || null;
}

export async function crear({
  nombre,
  descripcion,
  precio,
  stock,
  categoria,
  marca,
  numeroParte,
  umbralStockBajo,
  destacado,
  imagen,
}) {
  const [resultado] = await pool.query(
    `INSERT INTO producto
      (nombre, descripcion, precio, stock, categoria, marca, numeroParte, umbralStockBajo, destacado, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, descripcion, precio, stock, categoria, marca, numeroParte, umbralStockBajo, destacado, imagen]
  );
  return resultado.insertId;
}

export async function actualizar(id, {
  nombre,
  descripcion,
  precio,
  stock,
  categoria,
  marca,
  numeroParte,
  umbralStockBajo,
  destacado,
  imagen,
}) {
  await pool.query(
    `UPDATE producto SET
      nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?,
      marca = ?, numeroParte = ?, umbralStockBajo = ?, destacado = ?,
      imagen = COALESCE(?, imagen)
      WHERE id = ?`,
    [nombre, descripcion, precio, stock, categoria, marca, numeroParte, umbralStockBajo, destacado, imagen ?? null, id]
  );
}

export async function desactivar(id) {
  const [resultado] = await pool.query("UPDATE producto SET activo = FALSE WHERE id = ?", [id]);
  return resultado.affectedRows;
}
