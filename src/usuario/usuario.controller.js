import * as usuarioService from "./usuario.service.js";

export async function listarVisitantes(req, res, next) {
  try {
    return res.json(await usuarioService.listarVisitantes());
  } catch (error) {
    return next(error);
  }
}

export async function enviarInvitacion(req, res, next) {
  try {
    return res.json(await usuarioService.enviarInvitacion(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function obtenerPerfil(req, res, next) {
  try {
    return res.json(await usuarioService.obtenerPerfil(req.usuario.id));
  } catch (error) {
    return next(error);
  }
}

export async function actualizarPerfil(req, res, next) {
  try {
    const { nombre, telefono, contrasenaActual, contrasenaNueva } = req.body;
    const resultado = await usuarioService.actualizarPerfil(req.usuario.id, {
      nombre,
      telefono,
      contrasenaActual,
      contrasenaNueva,
    });
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    return res.json(await usuarioService.eliminar(req.params.id));
  } catch (error) {
    return next(error);
  }
}
