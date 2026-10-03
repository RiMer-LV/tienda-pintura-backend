import * as historialRepository from "./historial.repository.js";
import * as productoRepository from "../producto/producto.repository.js";
import { origenHistorial } from "../constants/origenHistorial.js";
import { ErrorHttp } from "../shared/errorHttp.js";

export async function registrar({ usuario, idProducto, origen }) {
  if (!idProducto || !Object.values(origenHistorial).includes(origen)) {
    throw new ErrorHttp(400, "idProducto y un origen válido son obligatorios");
  }

  const producto = await productoRepository.buscarPorId(idProducto);
  if (!producto) {
    throw new ErrorHttp(404, "Producto no encontrado");
  }

  await historialRepository.crear({
    idUsuario: usuario?.id ?? null,
    idProducto,
    origen,
  });
}
