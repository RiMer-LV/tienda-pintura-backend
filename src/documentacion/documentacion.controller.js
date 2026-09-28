import * as documentacionService from "./documentacion.service.js";

export async function crear(req, res, next) {
  try {
    const resultado = await documentacionService.crear(req.params.idProducto, req.body, req.files);
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const resultado = await documentacionService.actualizar(req.params.idProducto, req.body, req.files);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const resultado = await documentacionService.eliminar(req.params.idProducto);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
}
