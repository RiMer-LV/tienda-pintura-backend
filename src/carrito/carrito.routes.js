import { Router } from "express";
import * as carritoController from "./carrito.controller.js";
import { verificarAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verificarAuth);

router.get("/", carritoController.obtener);
router.delete("/", carritoController.vaciar);
router.post("/productos", carritoController.agregarProducto);
router.put("/productos/:idProducto", carritoController.actualizarCantidad);
router.delete("/productos/:idProducto", carritoController.eliminarProducto);

export default router;
