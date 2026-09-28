import { Router } from "express";
import * as documentacionController from "./documentacion.controller.js";
import { verificarAuth } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { uploadDocumentacion } from "../middleware/uploadDocumentacion.middleware.js";
import { TIPO_USUARIO } from "../constants/tipoUsuario.js";

const router = Router({ mergeParams: true });

const soloAdmin = verificarRol(TIPO_USUARIO.ADMIN);

router.post("/", verificarAuth, soloAdmin, uploadDocumentacion, documentacionController.crear);
router.put("/", verificarAuth, soloAdmin, uploadDocumentacion, documentacionController.actualizar);
router.delete("/", verificarAuth, soloAdmin, documentacionController.eliminar);

export default router;
