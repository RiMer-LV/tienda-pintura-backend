import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";
import usuarioRoutes from "./usuario/usuario.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});

app.use("/auth", authRoutes);
app.use("/usuario", usuarioRoutes);

app.use(errorMiddleware);

export default app;
