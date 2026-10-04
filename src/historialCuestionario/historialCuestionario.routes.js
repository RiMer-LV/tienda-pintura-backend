import { Router } from "express";
import * as historialController from "./historialCuestionario.controller.js";
import { verificarAuth } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { tipoUsuario } from "../constants/tipoUsuario.js";

const router = Router();

router.use(verificarAuth, verificarRol(tipoUsuario.ADMIN));

router.get("/", historialController.listar);
router.put("/:id/contactado", historialController.marcarContactado);
router.get("/:id/exportar", historialController.exportar);

export default router;
