import { Router } from "express";
import * as productoController from "./producto.controller.js";
import { verificarAuth } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { uploadImagen } from "../middleware/upload.middleware.js";
import { tipoUsuario } from "../constants/tipoUsuario.js";

const router = Router();

const soloAdmin = verificarRol(tipoUsuario.ADMIN);

router.get("/", productoController.listar);
router.get("/:id", productoController.obtenerPorId);
router.post("/", verificarAuth, soloAdmin, uploadImagen, productoController.crear);
router.put("/:id", verificarAuth, soloAdmin, uploadImagen, productoController.actualizar);
router.delete("/:id", verificarAuth, soloAdmin, productoController.eliminar);

export default router;
