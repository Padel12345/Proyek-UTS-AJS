import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("");
  const [judul, setJudul] = useState("");

  const [editId, setEditId] = useState(null);

  // =========================
  // FETCH DATA FROM BACKEND
  // =========================
  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/users");
      setFiles(res.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  // =========================
  // UPLOAD FILE + DATA
  // =========================
  const upload = async () => {
    if (!nama || !email || !kelas || !judul) {
      alert("Semua data harus diisi!");
      return;
    }

    if (!file) {
      alert("File harus dipilih!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("kelas", kelas);
      formData.append("judul", judul);

      await axios.post("http://localhost:8080/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchFiles(); // ambil ulang dari backend

      // reset form
      setNama("");
      setKelas("");
      setJudul("");
      setFile(null);
    } catch (err) {
      console.error("Upload gagal:", err);
    }
  };

  // =========================
  // DELETE FILE
  // =========================
  const remove = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/users/${id}`);
      await fetchFiles();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (data) => {
    setEditId(data.id);
    setNama(data.nama);
    setEmail(data.email);
    setKelas(data.kelas);
    setJudul(data.judul);
  };

  // =========================
  // SAVE EDIT (UPDATE)
  // =========================
  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/users/${editId}`, {
        nama,
        kelas,
        judul,
      });

      await fetchFiles();

      setEditId(null);
      setNama("");
      setKelas("");
      setJudul("");
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  // =========================
  // LOAD DATA SAAT PERTAMA
  // =========================
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <div className="home-icon"></div>
        <h2>
          Management <br /> Task
        </h2>
      </div>

      <div className="main">
        <h1 className="title">UPLOAD TUGAS TKJ</h1>

        <div className="form-section">
          <div className="left-form">
            <label>Nama :</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="contoh : Budi"
            />

            <label>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh: budi@gmail.com"
            />

            <label>Kelas :</label>
            <input
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
            />
          </div>

          <div className="right-form">
            <label>Judul Tugas :</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />

            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />

            

            {file && (
              <p className="file-name">{file.name}</p>
            )}

            {editId ? (
              <button className="kirim-btn" onClick={saveEdit}>
                Save Edit
              </button>
            ) : (
              <button className="kirim-btn" onClick={upload}>
                Kirim
              </button>
            )}
          </div>
        </div>

        <div className="divider"></div>

        <table className="file-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Kelas</th>
              <th>Judul Tugas</th>
              <th>File Upload</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.id}>
                <td>{f.nama}</td>
                <td>{f.email}</td>
                <td>{f.kelas}</td>
                <td>{f.judul}</td>
                <td>
  <div>
    <a href={f.url} target="_blank" rel="noreferrer">
      {f.filename.split("-").slice(1).join("-")}
    </a>
  </div>
  <small>
    {new Date(Number(f.filename.split("-")[0])).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </small>
</td>
                <td className="action-btn">
                  <button onClick={() => startEdit(f)}>✏</button>
                  <button onClick={() => remove(f.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;