import { Router } from "express";
import * as mensajeContactoController from "./mensajeContacto.controller.js";
import { verificarAuth, autenticacionOpcional } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { tipoUsuario } from "../constants/tipoUsuario.js";

const router = Router();

const admin = [verificarAuth, verificarRol(tipoUsuario.ADMIN)];

router.post("/", autenticacionOpcional, mensajeContactoController.crear);
router.get("/", ...admin, mensajeContactoController.listarNoLeidos);
router.put("/:id/leido", ...admin, mensajeContactoController.marcarLeido);

export default router;
