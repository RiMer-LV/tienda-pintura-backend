import * as mensajeContactoService from "./mensajeContacto.service.js";

export async function crear(req, res, next) {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    const resultado = await mensajeContactoService.crear({ usuario: req.usuario, nombre, email, telefono, mensaje });
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function listarNoLeidos(req, res, next) {
  try {
    return res.json(await mensajeContactoService.listarNoLeidos());
  } catch (error) {
    return next(error);
  }
}

export async function marcarLeido(req, res, next) {
  try {
    return res.json(await mensajeContactoService.marcarLeido(req.params.id));
  } catch (error) {
    return next(error);
  }
}
