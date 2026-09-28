import { ErrorHttp } from "../shared/errorHttp.js";

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  if (err instanceof ErrorHttp) {
    return res.status(err.statusCode).json({ mensaje: err.message });
  }

  console.error(err);
  return res.status(500).json({ mensaje: "Error interno del servidor" });
}
