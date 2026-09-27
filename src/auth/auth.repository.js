import pool from "../config/db.js";

export async function buscarPorEmail(email) {
  const [filas] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  return filas[0] || null;
}

export async function buscarPorToken(token) {
  const [filas] = await pool.query("SELECT * FROM usuario WHERE token = ?", [token]);
  return filas[0] || null;
}

export async function crearUsuario({ nombre, email, contrasenaHash, tipoUsuario }) {
  const [resultado] = await pool.query(
    "INSERT INTO usuario (nombre, email, contrasenaHash, tipoUsuario) VALUES (?, ?, ?, ?)",
    [nombre, email, contrasenaHash, tipoUsuario]
  );
  return resultado.insertId;
}

export async function actualizarToken(idUsuario, token, expiraToken) {
  await pool.query(
    "UPDATE usuario SET token = ?, expiraToken = ? WHERE id = ?",
    [token, expiraToken, idUsuario]
  );
}

export async function actualizarContrasena(idUsuario, contrasenaHash) {
  await pool.query(
    "UPDATE usuario SET contrasenaHash = ?, token = NULL, expiraToken = NULL WHERE id = ?",
    [contrasenaHash, idUsuario]
  );
}
