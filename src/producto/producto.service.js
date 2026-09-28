import * as productoRepository from "./producto.repository.js";
import * as documentacionRepository from "../documentacion/documentacion.repository.js";
import { categoriaProducto } from "../constants/categoriaProducto.js";
import { ErrorHttp } from "../shared/errorHttp.js";

export async function listar({ page, limit, categoria, buscar, orden }) {
  const paginaActual = Math.max(1, parseInt(page, 10) || 1);
  const limiteResultados = Math.max(1, parseInt(limit, 10) || 10);

  const { filas, total } = await productoRepository.listar({
    page: paginaActual,
    limit: limiteResultados,
    categoria,
    buscar,
    orden,
  });

  return {
    datos: filas,
    paginaActual,
    totalPaginas: Math.max(1, Math.ceil(total / limiteResultados)),
    totalResultados: total,
  };
}

export async function obtenerPorId(id) {
  const producto = await productoRepository.buscarPorId(id);

  if (!producto || !producto.activo) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }

  if (producto.categoria !== categoriaProducto.EQUIPO) {
    return producto;
  }

  const documentacion = await documentacionRepository.buscarPorIdProducto(id);

  return {
    ...producto,
    documentacion: documentacion
      ? {
          fichaTecnica: documentacion.fichaTecnica,
          manual: documentacion.manual,
          fuenteEnergia: documentacion.fuenteEnergia,
        }
      : null,
  };
}

export async function crear({
  nombre,
  descripcion,
  precio,
  stock,
  categoria,
  marca,
  numeroParte,
  umbralStockBajo,
  destacado,
  imagen,
}) {
  if (!nombre || precio === undefined || stock === undefined || !categoria) {
    throw new ErrorHttp(400, "Nombre, precio, stock y categoría son obligatorios");
  }

  const id = await productoRepository.crear({
    nombre,
    descripcion: descripcion ?? null,
    precio,
    stock,
    categoria,
    marca: marca ?? null,
    numeroParte: numeroParte ?? null,
    umbralStockBajo: umbralStockBajo ?? 5,
    destacado: destacado ?? false,
    imagen: imagen ?? null,
  });

  return { id, mensaje: "Producto creado correctamente" };
}

export async function actualizar(id, {
  nombre,
  descripcion,
  precio,
  stock,
  categoria,
  marca,
  numeroParte,
  umbralStockBajo,
  destacado,
  imagen,
}) {
  const producto = await productoRepository.buscarPorId(id);

  if (!producto || !producto.activo) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }

  await productoRepository.actualizar(id, {
    nombre: nombre ?? producto.nombre,
    descripcion: descripcion ?? producto.descripcion,
    precio: precio ?? producto.precio,
    stock: stock ?? producto.stock,
    categoria: categoria ?? producto.categoria,
    marca: marca ?? producto.marca,
    numeroParte: numeroParte ?? producto.numeroParte,
    umbralStockBajo: umbralStockBajo ?? producto.umbralStockBajo,
    destacado: destacado ?? producto.destacado,
    imagen: imagen ?? null,
  });

  return { mensaje: "Producto actualizado correctamente" };
}

export async function eliminar(id) {
  const filas = await productoRepository.desactivar(id);

  if (!filas) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }

  return { mensaje: "Producto eliminado correctamente" };
}
