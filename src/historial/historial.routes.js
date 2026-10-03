import { Router } from "express";
import * as historialController from "./historial.controller.js";
import { autenticacionOpcional } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", autenticacionOpcional, historialController.registrar);

export default router;
