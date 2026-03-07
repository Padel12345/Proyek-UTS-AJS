import express from "express";
import cors from "cors";
import router from "./routes.js";
import { pool } from "./db.js";
import { initBucket } from "./minio.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

async function start() {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    nama TEXT,
    email TEXT,
    kelas TEXT,
    judul TEXT,
    filename TEXT,
    url TEXT
  )
`);

  await initBucket();

  app.listen(8080, () => console.log("Backend running on port 8080"));
}

start();