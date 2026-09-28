import fs from "fs/promises";
import * as documentacionRepository from "./documentacion.repository.js";
import * as productoRepository from "../producto/producto.repository.js";
import { categoriaProducto } from "../constants/categoriaProducto.js";
import { ErrorHttp } from "../shared/errorHttp.js";

async function borrarArchivo(ruta) {
  if (!ruta) return;
  try {
    await fs.unlink(ruta);
  } catch {
    // El archivo ya no existe en disco, no hay nada que borrar
  }
}

async function validarProductoEquipo(idProducto) {
  const producto = await productoRepository.buscarPorId(idProducto);

  if (!producto || !producto.activo) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }

  if (producto.categoria !== categoriaProducto.EQUIPO) {
    throw new ErrorHttp(400, "La documentación solo aplica a equipos");
  }

  return producto;
}

export async function crear(idProducto, { fuenteEnergia }, archivos) {
  await validarProductoEquipo(idProducto);

  await documentacionRepository.crear({
    idProducto,
    fichaTecnica: archivos?.fichaTecnica?.[0]?.path ?? null,
    manual: archivos?.manual?.[0]?.path ?? null,
    fuenteEnergia: fuenteEnergia ?? null,
  });

  return { mensaje: "Documentación creada correctamente" };
}

export async function actualizar(idProducto, { fuenteEnergia }, archivos) {
  await validarProductoEquipo(idProducto);

  const documentacion = await documentacionRepository.buscarPorIdProducto(idProducto);

  if (!documentacion) {
    throw new ErrorHttp(404, "Documentación no encontrada");
  }

  const nuevaFichaTecnica = archivos?.fichaTecnica?.[0]?.path;
  const nuevoManual = archivos?.manual?.[0]?.path;

  if (nuevaFichaTecnica) {
    await borrarArchivo(documentacion.fichaTecnica);
  }

  if (nuevoManual) {
    await borrarArchivo(documentacion.manual);
  }

  await documentacionRepository.actualizar(idProducto, {
    fichaTecnica: nuevaFichaTecnica ?? documentacion.fichaTecnica,
    manual: nuevoManual ?? documentacion.manual,
    fuenteEnergia: fuenteEnergia ?? documentacion.fuenteEnergia,
  });

  return { mensaje: "Documentación actualizada correctamente" };
}

export async function eliminar(idProducto) {
  await validarProductoEquipo(idProducto);

  const documentacion = await documentacionRepository.buscarPorIdProducto(idProducto);

  if (!documentacion) {
    throw new ErrorHttp(404, "Documentación no encontrada");
  }

  await borrarArchivo(documentacion.fichaTecnica);
  await borrarArchivo(documentacion.manual);
  await documentacionRepository.eliminar(idProducto);

  return { mensaje: "Documentación eliminada correctamente" };
}
