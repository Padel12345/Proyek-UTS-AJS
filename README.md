# Proyek-UTS-ASJ

Web Aplikasi Sederhana berbasis CRUD (Create, Read, Update, Delete) 

## Arsitektur Sistem
```
Frontend (React)
      │
      ▼
Backend (Express API)
      │
 ┌────┴────┐
 ▼         ▼
PostgreSQL  MinIO
(Database)  (File Storage)
```

- **Frontend** : React digunakan untuk antarmuka pengguna
- **Backend** : Express.js sebagai REST API
- **PostgreSQL** : Menyimpan metadata file
- **MinIO** : Menyimpan file upload
- **Docker Compose** : Menjalankan semua service dalam container


## Teknologi
- Node.js
- Express.js
- PostgreSQL
- MinIO
- Docker
- Docker Compose
- React (Frontend)
- Axios


## Cara Menjalankan Project
### 1 Clone Repository
- git clone https://github.com/username/project-name.git
- cd project-name

### 2 Jalankan Docker
- docker compose up --build
- Setelah container berjalan, service dapat diakses pada:
- Backend API : http://localhost:8080
- MinIO Console : http://localhost:9001
- Frontend : http://localhost:5173
