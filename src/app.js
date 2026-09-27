import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando" });
});

app.use("/auth", authRoutes);

export default app;
