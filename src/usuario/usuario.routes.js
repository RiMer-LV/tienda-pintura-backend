import { Router } from "express";
import * as usuarioController from "./usuario.controller.js";
import { verificarAuth, verificarAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Las rutas fijas van antes que /:id
router.post("/visitante", verificarAuth, verificarAdmin, usuarioController.crearVisitante);
router.get("/visitantes", verificarAuth, verificarAdmin, usuarioController.listarVisitantes);
router.get("/perfil", verificarAuth, usuarioController.obtenerPerfil);
router.put("/perfil", verificarAuth, usuarioController.actualizarPerfil);
router.post("/:id/enviar-invitacion", verificarAuth, verificarAdmin, usuarioController.enviarInvitacion);
router.delete("/:id", verificarAuth, verificarAdmin, usuarioController.eliminar);

export default router;
