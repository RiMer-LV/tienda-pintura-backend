import jwt from "jsonwebtoken";
import { TIPO_USUARIO } from "../constants/tipoUsuario.js";

export function verificarAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ mensaje: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
}

export function verificarAdmin(req, res, next) {
  if (req.usuario?.tipoUsuario !== TIPO_USUARIO.ADMIN) {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }
  next();
}
