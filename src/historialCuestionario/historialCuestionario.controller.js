import * as historialService from "./historialCuestionario.service.js";

export async function listar(req, res, next) {
  try {
    return res.json(await historialService.listar());
  } catch (error) {
    return next(error);
  }
}

export async function marcarContactado(req, res, next) {
  try {
    return res.json(await historialService.marcarContactado(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function exportar(req, res, next) {
  try {
    const { nombreArchivo, buffer } = await historialService.exportar(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${nombreArchivo}"`);
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
}
