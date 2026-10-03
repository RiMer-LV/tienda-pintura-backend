import { Router } from "express";
import * as mensajeContactoController from "./mensajeContacto.controller.js";
import { verificarAuth, autenticacionOpcional } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { TIPO_USUARIO } from "../constants/tipoUsuario.js";

const router = Router();

const admin = [verificarAuth, verificarRol(TIPO_USUARIO.ADMIN)];

router.post("/", autenticacionOpcional, mensajeContactoController.crear);
router.get("/", ...admin, mensajeContactoController.listarNoLeidos);
router.put("/:id/leido", ...admin, mensajeContactoController.marcarLeido);

export default router;
