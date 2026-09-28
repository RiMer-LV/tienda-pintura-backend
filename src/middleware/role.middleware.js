import { ErrorHttp } from "../shared/errorHttp.js";

export function verificarRol(rolRequerido) {
  return function (req, res, next) {
    if (req.usuario?.tipoUsuario !== rolRequerido) {
      return next(new ErrorHttp(403, "No autorizado"));
    }
    next();
  };
}
