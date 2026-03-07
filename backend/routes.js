import express from "express";
import multer from "multer";
import { pool } from "./db.js";
import { minioClient, bucket } from "./minio.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* =========================
   UPLOAD FILE + DATA
========================= */
router.post("/users", upload.single("file"), async (req, res) => {
  try {
    const { nama, email, kelas, judul } = req.body;
    const file = req.file;

    if (!nama || !email || !kelas || !judul) {
      return res.status(400).json({
        message: "Semua field harus diisi"
      });
    }
    if (!file) {
      return res.status(400).json({ message: "File tidak ada" });
    }

    const fileName = Date.now() + "-" + file.originalname;

    // Upload ke MinIO
    await minioClient.putObject(bucket, fileName, file.buffer);

    const url = `http://localhost:9000/${bucket}/${fileName}`;

    // Simpan ke PostgreSQL
    const result = await pool.query(
      `INSERT INTO files (nama, email, kelas, judul, filename, url)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [nama, email, kelas, judul, fileName, url]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload gagal" });
  }
});

/* =========================
   GET ALL FILES
========================= */
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM files ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil data" });
  }
});

/* =========================
   UPDATE DATA
========================= */
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kelas, judul } = req.body;

    const result = await pool.query(
      `UPDATE files
       SET nama=$1, kelas=$2, judul=$3
       WHERE id=$4
       RETURNING *`,
      [nama, kelas, judul, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update" });
  }
});

/* =========================
   DELETE FILE
========================= */
/* =========================
   DELETE FILE (FULL CLEAN)
========================= */
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Ambil data dulu dari database
    const result = await pool.query(
      "SELECT filename FROM files WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "File tidak ditemukan" });
    }

    const filename = result.rows[0].filename;

    // 2️⃣ Hapus file dari MinIO
    await minioClient.removeObject(bucket, filename);

    // 3️⃣ Hapus metadata dari PostgreSQL
    await pool.query("DELETE FROM files WHERE id=$1", [id]);

    res.json({ message: "File berhasil dihapus total" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal hapus file" });
  }
});

export default router;




/*routes ger*/
router.get("/users/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM files WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil data" });
  }
}); 

