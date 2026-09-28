import multer from "multer";
import fs from "fs";
import path from "path";
import { ErrorHttp } from "../shared/errorHttp.js";

const DESTINOS = {
  fichaTecnica: "uploads/fichasTecnicas/",
  manual: "uploads/manuales/",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destino = DESTINOS[file.fieldname];
    fs.mkdirSync(destino, { recursive: true });
    cb(null, destino);
  },
  filename: (req, file, cb) => {
    const sufijo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sufijo}${path.extname(file.originalname)}`);
  },
});

function filtroPdf(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(new ErrorHttp(400, "Solo se permiten archivos PDF"));
  }
  cb(null, true);
}

export const uploadDocumentacion = multer({ storage, fileFilter: filtroPdf }).fields([
  { name: "fichaTecnica", maxCount: 1 },
  { name: "manual", maxCount: 1 },
]);
