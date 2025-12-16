# 🏢 Employee Management System

Employee Data with AngularJS as frontend and ExpressJS as backend. Using MSSql as database and SSMS as database manager

## 📋 Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:
* [Node.js](https://nodejs.org/) (v24.12.0 atau terbaru)
* [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/)
* SQL Server Management Studio (SSMS)

---

## 🚀 Langkah Instalasi

### 1. Konfigurasi Database
1. Buka **SQL Server Management Studio (SSMS)**.
2. Buat database baru dengan nama `EmployeeDB` (atau sesuaikan dengan keinginan Anda).
3. Cari file berkstensi `.sql` yang tersedia di dalam folder proyek ini.
4. Buka file tersebut di SSMS, lalu tekan **Execute (F5)** untuk membuat tabel dan mengisi data awal.

### 2. Pengaturan Backend
1. Buka terminal atau Command Prompt.
2. Masuk ke direktori `backend`:

 ```bash
 cd nama-folder-proyek/backend
 ```

Instal semua dependensi library yang diperlukan:

```bash
npm install
```

Buat file baru bernama .env di dalam folder backend tersebut.

Salin dan sesuaikan konfigurasi berikut ke dalam file `.env`:

```.env
# Database Configuration
DB_USER=isi_username_sql_anda
DB_PASSWORD=isi_password_sql_anda
DB_SERVER=localhost
DB_DATABASE=EmployeeDB

# Security
API_KEY=secret135
PORT=1433
```

Buka file app.js di sisi frontend, pastikan variabel API_KEY sudah sesuai dengan yang ada di file .env.

🛠️ Cara Menjalankan Program
Pastikan servis SQL Server Anda sudah berjalan.

Di dalam terminal (folder backend), jalankan perintah:

  ```bash
    node server.js
  ```
Jika berhasil, akan muncul pesan: API running at http://localhost:3000.

Buka browser Anda dan akses:

```
http://localhost:3000
```
📂 Struktur Folder
```plaintext
├── backend/
│   ├── middleware/    # Proteksi Auth & API Key
│   ├── routes/        # Endpoint API (Employees, Dept, dll)
│   ├── database.sql   # Script untuk setup MSSQL
│   ├── db.js          # connector ke database
│   ├── server.js      # File utama server Node.js
│   └── .env           # Konfigurasi rahasia (Database & Key)
├── frontend/
│   ├── app.js         # Logic AngularJS (Controller & Service)
│   ├── index.html     # Tampilan Utama
│   └── style.css      # Styling Custom
└── .gitignore         # .gitignore
```

🔒 Keamanan (Security)
1. SQL Injection Protection: Menggunakan Parameterized Queries (request.input) untuk semua input user.
2. API Authentication: Menggunakan Middleware untuk memvalidasi x-api-key pada setiap request.
3. Rate Limiting: Membatasi jumlah request dari satu IP untuk mencegah serangan brute-force.
4. XSS Protection: Menggunakan auto-escaping bawaan AngularJS untuk menampilkan data.
