import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/verificar-token/:token", authController.verificarToken);
router.post("/completar-registro", authController.completarRegistro);

export default router;
