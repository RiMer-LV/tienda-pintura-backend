import * as historialService from "./historial.service.js";

export async function registrar(req, res, next) {
  try {
    const { idProducto, origen } = req.body;
    await historialService.registrar({ usuario: req.usuario, idProducto, origen });
    return res.status(201).json({ mensaje: "Historial registrado" });
  } catch (error) {
    return next(error);
  }
}
