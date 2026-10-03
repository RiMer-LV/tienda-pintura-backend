import { Router } from "express";
import * as cuestionarioController from "./cuestionario.controller.js";
import { verificarAuth, autenticacionOpcional } from "../middleware/auth.middleware.js";
import { verificarRol } from "../middleware/role.middleware.js";
import { TIPO_USUARIO } from "../constants/tipoUsuario.js";

const router = Router();

const admin = [verificarAuth, verificarRol(TIPO_USUARIO.ADMIN)];

// Públicas
router.get("/pregunta/inicio", cuestionarioController.obtenerInicio);
router.post("/cuestionario/completado", autenticacionOpcional, cuestionarioController.completar);

// Administración (GET /pregunta/:id es público y se declara al final de las rutas /pregunta)
router.get("/pregunta", ...admin, cuestionarioController.listarPreguntas);
router.get("/pregunta/:id", cuestionarioController.obtenerPregunta);
router.post("/pregunta", ...admin, cuestionarioController.crearPregunta);
router.put("/pregunta/:id", ...admin, cuestionarioController.actualizarPregunta);
router.delete("/pregunta/:id", ...admin, cuestionarioController.eliminarPregunta);
router.post("/pregunta/:id/opcion", ...admin, cuestionarioController.crearOpcion);

router.put("/opcion/:id", ...admin, cuestionarioController.actualizarOpcion);
router.delete("/opcion/:id", ...admin, cuestionarioController.eliminarOpcion);

router.get("/recomendacion", ...admin, cuestionarioController.listarRecomendaciones);
router.post("/recomendacion", ...admin, cuestionarioController.crearRecomendacion);
router.put("/recomendacion/:id", ...admin, cuestionarioController.actualizarRecomendacion);
router.delete("/recomendacion/:id", ...admin, cuestionarioController.eliminarRecomendacion);
router.post("/recomendacion/:id/productos", ...admin, cuestionarioController.agregarProducto);
router.delete("/recomendacion/:id/productos/:idProducto", ...admin, cuestionarioController.quitarProducto);

export default router;
