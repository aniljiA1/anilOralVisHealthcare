import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDb } from "./db.js";
import authRoutes from "./auth.js";
import scanRoutes from "./scans.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()), credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => res.send("OralVis API OK"));
app.use("/auth", authRoutes);
app.use("/", scanRoutes);

initDb().then(() => {
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
});
