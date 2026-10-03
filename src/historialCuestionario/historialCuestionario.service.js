import PDFDocument from "pdfkit";
import * as historialRepository from "./historialCuestionario.repository.js";
import { ErrorHttp } from "../shared/errorHttp.js";

export async function listar() {
  return historialRepository.listarNoContactados();
}

export async function marcarContactado(id) {
  const filas = await historialRepository.marcarContactado(id);

  if (!filas) {
    throw new ErrorHttp(404, "Historial no encontrado");
  }

  return { mensaje: "Historial marcado como contactado" };
}

function generarPdf(historial) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const partes = [];

    doc.on("data", (parte) => partes.push(parte));
    doc.on("end", () => resolve(Buffer.concat(partes)));
    doc.on("error", reject);

    const campo = (etiqueta, valor) => {
      doc.font("Helvetica-Bold").fontSize(11).text(etiqueta);
      doc.font("Helvetica").fontSize(11).text(valor || "-").moveDown(0.8);
    };

    doc.font("Helvetica-Bold").fontSize(18).text(`Historial de cuestionario #${historial.id}`).moveDown();

    campo("Nombre", historial.nombreUsuario);
    campo("Email", historial.emailUsuario);
    campo("Teléfono", historial.telefonoUsuario);
    campo("Fecha", new Date(historial.fecha).toLocaleString("es-ES"));
    campo("Equipo recomendado", historial.equipoRecomendado);
    campo("Respuestas", historial.respuestas);
    campo("Mensaje del cliente", historial.mensajeCliente);

    doc.end();
  });
}

export async function exportar(id) {
  const historial = await historialRepository.buscarPorId(id);

  if (!historial) {
    throw new ErrorHttp(404, "Historial no encontrado");
  }

  return { nombreArchivo: `historial-cuestionario-${historial.id}.pdf`, buffer: await generarPdf(historial) };
}
