import * as carritoService from "./carrito.service.js";

export async function obtener(req, res, next) {
  try {
    return res.json(await carritoService.obtener(req.usuario.id));
  } catch (error) {
    return next(error);
  }
}

export async function agregarProducto(req, res, next) {
  try {
    const { idProducto, cantidad } = req.body;
    return res.status(201).json(await carritoService.agregarProducto(req.usuario.id, { idProducto, cantidad }));
  } catch (error) {
    return next(error);
  }
}

export async function actualizarCantidad(req, res, next) {
  try {
    return res.json(
      await carritoService.actualizarCantidad(req.usuario.id, req.params.idProducto, req.body.cantidad)
    );
  } catch (error) {
    return next(error);
  }
}

export async function eliminarProducto(req, res, next) {
  try {
    return res.json(await carritoService.eliminarProducto(req.usuario.id, req.params.idProducto));
  } catch (error) {
    return next(error);
  }
}

export async function vaciar(req, res, next) {
  try {
    return res.json(await carritoService.vaciar(req.usuario.id));
  } catch (error) {
    return next(error);
  }
}
