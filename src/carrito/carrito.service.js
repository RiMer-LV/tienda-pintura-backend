import * as carritoRepository from "./carrito.repository.js";
import * as productoRepository from "../producto/producto.repository.js";
import { ErrorHttp } from "../shared/errorHttp.js";

function parsearCantidad(cantidad) {
  const valor = Number(cantidad);
  if (!Number.isInteger(valor) || valor < 1) {
    throw new ErrorHttp(400, "La cantidad debe ser un entero mayor a 0");
  }
  return valor;
}

async function obtenerProductoActivo(idProducto) {
  const producto = await productoRepository.buscarPorId(idProducto);
  if (!producto || !producto.activo) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }
  return producto;
}

function validarStock(producto, cantidad) {
  if (cantidad > producto.stock) {
    throw new ErrorHttp(400, `Stock insuficiente: solo hay ${producto.stock} unidades disponibles`);
  }
}

async function armarRespuesta(carrito) {
  if (!carrito) {
    return { lineas: [], total: 0 };
  }

  const filas = await carritoRepository.listarLineas(carrito.id);
  const lineas = filas.map((fila) => ({
    ...fila,
    subtotal: Number(fila.precio) * fila.cantidad,
  }));
  const total = lineas.reduce((acumulado, linea) => acumulado + linea.subtotal, 0);

  return { id: carrito.id, lineas, total };
}

export async function obtener(idUsuario) {
  return armarRespuesta(await carritoRepository.buscarPorUsuario(idUsuario));
}

export async function agregarProducto(idUsuario, { idProducto, cantidad }) {
  const cantidadNueva = parsearCantidad(cantidad);
  const producto = await obtenerProductoActivo(idProducto);

  let carrito = await carritoRepository.buscarPorUsuario(idUsuario);
  const linea = carrito ? await carritoRepository.buscarLinea(carrito.id, producto.id) : null;

  validarStock(producto, (linea?.cantidad ?? 0) + cantidadNueva);

  if (!carrito) {
    carrito = { id: await carritoRepository.crear(idUsuario) };
  }

  if (linea) {
    await carritoRepository.actualizarCantidad(carrito.id, producto.id, linea.cantidad + cantidadNueva);
  } else {
    await carritoRepository.crearLinea(carrito.id, producto.id, cantidadNueva);
  }

  await carritoRepository.tocar(carrito.id);
  return armarRespuesta(carrito);
}

export async function actualizarCantidad(idUsuario, idProducto, cantidad) {
  const cantidadNueva = parsearCantidad(cantidad);
  const producto = await obtenerProductoActivo(idProducto);

  const carrito = await carritoRepository.buscarPorUsuario(idUsuario);
  const linea = carrito ? await carritoRepository.buscarLinea(carrito.id, producto.id) : null;

  if (!linea) {
    throw new ErrorHttp(404, "El producto no está en el carrito");
  }

  validarStock(producto, cantidadNueva);

  await carritoRepository.actualizarCantidad(carrito.id, producto.id, cantidadNueva);
  await carritoRepository.tocar(carrito.id);
  return armarRespuesta(carrito);
}

export async function eliminarProducto(idUsuario, idProducto) {
  const carrito = await carritoRepository.buscarPorUsuario(idUsuario);
  const filas = carrito ? await carritoRepository.eliminarLinea(carrito.id, idProducto) : 0;

  if (!filas) {
    throw new ErrorHttp(404, "El producto no está en el carrito");
  }

  await carritoRepository.tocar(carrito.id);
  return armarRespuesta(carrito);
}

export async function vaciar(idUsuario) {
  const carrito = await carritoRepository.buscarPorUsuario(idUsuario);

  if (carrito) {
    await carritoRepository.vaciar(carrito.id);
    await carritoRepository.tocar(carrito.id);
  }

  return { mensaje: "Carrito vaciado correctamente" };
}
