import * as productoService from "./producto.service.js";

function parseBooleano(valor) {
  if (valor === undefined) return undefined;
  return valor === true || valor === "true";
}

export async function listar(req, res, next) {
  try {
    const { page, limit, categoria, buscar, orden } = req.query;
    return res.json(await productoService.listar({ page, limit, categoria, buscar, orden }));
  } catch (error) {
    return next(error);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    return res.json(await productoService.obtenerPorId(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria, marca, numeroParte, umbralStockBajo, destacado } = req.body;
    const resultado = await productoService.crear({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      marca,
      numeroParte,
      umbralStockBajo,
      destacado: parseBooleano(destacado),
      imagen: req.file?.path,
    });
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function actualizar(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria, marca, numeroParte, umbralStockBajo, destacado } = req.body;
    const resultado = await productoService.actualizar(req.params.id, {
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      marca,
      numeroParte,
      umbralStockBajo,
      destacado: parseBooleano(destacado),
      imagen: req.file?.path,
    });
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    return res.json(await productoService.eliminar(req.params.id));
  } catch (error) {
    return next(error);
  }
}
