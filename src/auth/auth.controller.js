import * as authService from "./auth.service.js";
import { ErrorHttp } from "./auth.service.js";

const OPCIONES_COOKIE = { httpOnly: true, secure: true, sameSite: "strict" };

function manejarError(res, error) {
  if (error instanceof ErrorHttp) {
    return res.status(error.statusCode).json({ mensaje: error.message });
  }

  console.error(error);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}

export async function register(req, res) {
  try {
    const { nombre, email, contrasena } = req.body;
    const resultado = await authService.registrar({ nombre, email, contrasena });
    return res.status(201).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function login(req, res) {
  try {
    const { email, contrasena } = req.body;
    const { token, usuario } = await authService.login({ email, contrasena });

    res.cookie("token", token, OPCIONES_COOKIE);
    return res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, tipoUsuario: usuario.tipoUsuario },
    });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function logout(req, res) {
  res.clearCookie("token", OPCIONES_COOKIE);
  return res.json({ mensaje: "Sesión cerrada" });
}

export async function verificarToken(req, res) {
  try {
    const { token } = req.params;
    const usuario = await authService.verificarTokenRegistro(token);
    return res.json({ valido: true, email: usuario.email });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function completarRegistro(req, res) {
  try {
    const { token, contrasena } = req.body;
    const resultado = await authService.completarRegistro({ token, contrasena });
    return res.json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}
