import { Router } from "express";
import * as usuarioController from "./usuario.controller.js";
import { verificarAuth } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { TIPO_USUARIO } from "../constants/tipoUsuario.js";

const router = Router();

const soloAdmin = verificarRol(TIPO_USUARIO.ADMIN);

// Las rutas fijas van antes que /:id
router.get("/visitantes", verificarAuth, soloAdmin, usuarioController.listarVisitantes);
router.get("/perfil", verificarAuth, usuarioController.obtenerPerfil);
router.put("/perfil", verificarAuth, usuarioController.actualizarPerfil);
router.post("/:id/enviar-invitacion", verificarAuth, soloAdmin, usuarioController.enviarInvitacion);
router.delete("/:id", verificarAuth, soloAdmin, usuarioController.eliminar);

export default router;
