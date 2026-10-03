import jwt from "jsonwebtoken";

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

export function autenticacionOpcional(req, res, next) {
  const token = req.cookies?.token;

  if (token) {
    try {
      req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // token inválido: se trata como visitante
    }
  }

  next();
}
