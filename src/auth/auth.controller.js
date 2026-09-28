import * as authService from "./auth.service.js";

const OPCIONES_COOKIE = { httpOnly: true, secure: true, sameSite: "strict" };

export async function register(req, res, next) {
  try {
    const { nombre, email, contrasena } = req.body;
    const resultado = await authService.registrar({ nombre, email, contrasena });
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, contrasena } = req.body;
    const { token, usuario } = await authService.login({ email, contrasena });

    res.cookie("token", token, OPCIONES_COOKIE);
    return res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, tipoUsuario: usuario.tipoUsuario },
    });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie("token", OPCIONES_COOKIE);
  return res.json({ mensaje: "Sesión cerrada" });
}

export async function verificarToken(req, res, next) {
  try {
    const { token } = req.params;
    const usuario = await authService.verificarTokenRegistro(token);
    return res.json({ valido: true, email: usuario.email });
  } catch (error) {
    return next(error);
  }
}

export async function completarRegistro(req, res, next) {
  try {
    const { token, contrasena } = req.body;
    const resultado = await authService.completarRegistro({ token, contrasena });
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
}
