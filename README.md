# 🎓 API Dummy Kampus - Campus Authentication System

API dummy untuk simulasi sistem autentikasi kampus yang menyediakan data mahasiswa, dosen, dan staff. API ini dirancang untuk digunakan sebagai **resource server** untuk validasi login pada aplikasi perpustakaan atau sistem kampus lainnya.

## 📋 Deskripsi

API ini berfungsi sebagai **dummy OAuth/SSO provider** yang menyimpan data user kampus. Ketika aplikasi library (atau aplikasi lain) ingin memvalidasi login user, mereka akan:

1. Mengirim email user ke endpoint `/api/oauth/login`
2. API akan mengecek apakah email terdaftar di database kampus
3. Jika terdaftar, API mengembalikan data user lengkap (role, nim/nidn, prodi, dll) + token
4. Aplikasi library kemudian bisa menyinkronkan data user tersebut ke database mereka

## 🚀 Fitur

- ✅ **Login Validation** - Validasi email user kampus
- ✅ **User Registration** - Registrasi user baru
- ✅ **Get All Users** - Mendapatkan semua user terdaftar
- ✅ **Get User by Email** - Cari user berdasarkan email
- ✅ **Multi-Role Support** - Mahasiswa, Dosen, Staff
- ✅ **Swagger Documentation** - Dokumentasi API interaktif
- ✅ **PostgreSQL Database** - Menggunakan Drizzle ORM

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Documentation**: Swagger/OpenAPI 3.0
- **Language**: TypeScript

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd api-test-login-library

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env
# Edit .env dengan DATABASE_URL Anda
```

## ⚙️ Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
```

## 🗄️ Database Setup

```bash
# Generate migration files
bun run db:generate

# Run migrations
bun run db:migrate

# Seed database dengan data dummy
bun run seed
```

## 🏃 Running the Application

### Development Mode

```bash
bun run dev
```

### Production Mode

```bash
# Build
bun run build

# Start
bun run start
```

Server akan berjalan di `http://localhost:3000`

## 📚 API Documentation

Akses dokumentasi Swagger di: `http://localhost:3000/docs`

**Production URL**: https://api-dummy-oauth.vercel.app/docs

## 🔌 API Endpoints

### Authentication

#### 1. Login

```http
POST /api/oauth/login
Content-Type: application/json

{
  "email": "mahasiswa@campus.ac.id"
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "email": "mahasiswa@campus.ac.id",
      "fullName": "John Doe",
      "role": "mahasiswa",
      "faculty": "Teknik",
      "prodi": "Teknik Informatika",
      "nim": "2021001",
      "nidn": null,
      "status": "active"
    },
    "token": "campus_token_1_1234567890"
  }
}
```

**Response (401 Unauthorized)**:

```json
{
  "success": false,
  "message": "User tidak terdaftar di sistem kampus",
  "data": null
}
```

#### 2. Register

```http
POST /api/oauth/register
Content-Type: application/json

{
  "email": "newuser@campus.ac.id"
}
```

### Users

#### 3. Get All Users

```http
GET /api/users
```

**Response**:

```json
{
  "data": [
    {
      "id": 1,
      "email": "mahasiswa@campus.ac.id",
      "full_name": "John Doe",
      "role": "mahasiswa",
      "faculty": "Teknik",
      "prodi": "Teknik Informatika",
      "nim": "2021001",
      "nidn": null,
      "status": "active"
    }
  ]
}
```

#### 4. Get User by Email

```http
GET /api/users/:email
```

**Example**:

```http
GET /api/users/mahasiswa@campus.ac.id
```

**Response (200 OK)**:

```json
{
  "success": true,
  "message": "User ditemukan",
  "data": {
    "id": 1,
    "email": "mahasiswa@campus.ac.id",
    "full_name": "John Doe",
    "role": "mahasiswa",
    "faculty": "Teknik",
    "prodi": "Teknik Informatika",
    "nim": "2021001",
    "nidn": null,
    "status": "active"
  }
}
```

**Response (404 Not Found)**:

```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "data": null
}
```

## 👥 User Roles

API mendukung 3 role user:

### 1. **Mahasiswa** (Student)

- Role: `mahasiswa`
- Identifier: `nim` (Nomor Induk Mahasiswa)
- Fields: `faculty`, `prodi`, `nim`

### 2. **Dosen** (Lecturer)

- Role: `dosen`
- Identifier: `nidn` (Nomor Induk Dosen Nasional)
- Fields: `faculty`, `prodi`, `nidn`

### 3. **Staff**

- Role: `staff`
- Identifier: None
- Fields: Minimal (hanya email, full_name, role)

## 🗃️ Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role role DEFAULT 'mahasiswa' NOT NULL, -- ENUM: mahasiswa, dosen, staff
  faculty VARCHAR(255),
  prodi VARCHAR(255),
  nim VARCHAR(50),
  nidn VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' NOT NULL
);

-- Token Table (untuk future development)
CREATE TABLE token (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  access_token VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id)
);
```

## 🔄 Integration Flow

Berikut cara aplikasi library menggunakan API ini:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Library App    │         │  API Dummy       │         │  PostgreSQL     │
│  (Frontend)     │         │  Kampus          │         │  Database       │
└────────┬────────┘         └────────┬─────────┘         └────────┬────────┘
         │                           │                            │
         │  1. POST /oauth/login     │                            │
         │     { email: "..." }      │                            │
         ├──────────────────────────>│                            │
         │                           │  2. Query user by email    │
         │                           ├───────────────────────────>│
         │                           │                            │
         │                           │  3. Return user data       │
         │                           │<───────────────────────────┤
         │                           │                            │
         │  4. Return user + token   │                            │
         │<──────────────────────────┤                            │
         │                           │                            │
         │  5. Sync user to library  │                            │
         │     database              │                            │
         │                           │                            │
```

## 📝 Sample Data

Setelah menjalankan `bun run seed`, database akan terisi dengan data berikut:

| Email                     | Role      | NIM/NIDN | Faculty | Prodi                 | Status   |
| ------------------------- | --------- | -------- | ------- | --------------------- | -------- |
| fauzanrizqinoor@gmail.com | mahasiswa | 12345678 | Teknik  | Teknik Informatika    | active   |
| rizqinoorf@gmail.com      | dosen     | 98765432 | Teknik  | Teknik Informatika    | active   |
| staff@campus.ac.id        | staff     | -        | -       | -                     | active   |
| inactive@campus.ac.id     | mahasiswa | 87654321 | -       | -                     | inactive |
| zanntehsaha@gmail.com     | mahasiswa | 12345678 | FKIP    | Pendidikan Matematika | active   |

## 🔒 Security Notes

⚠️ **PENTING**: Ini adalah API **DUMMY** untuk development/testing!

- Token yang dihasilkan adalah **dummy token** (bukan JWT yang secure)
- Tidak ada password/authentication yang sebenarnya
- Tidak ada rate limiting
- Tidak ada CORS protection yang ketat

**Untuk production**, gunakan:

- OAuth 2.0 / OpenID Connect yang proper
- JWT dengan secret key
- Password hashing (bcrypt/argon2)
- Rate limiting
- CORS configuration
- HTTPS only

## 📂 Project Structure

```
api-test-login-library/
├── src/
│   ├── config/
│   │   └── swagger.ts          # Swagger/OpenAPI configuration
│   ├── db/
│   │   ├── index.ts            # Database connection
│   │   └── schema.ts           # Drizzle schema definitions
│   ├── routes/
│   │   └── oauth.route.ts      # API routes
│   ├── service/
│   │   └── oauth.service.ts    # Business logic
│   ├── seed.ts                 # Database seeder
│   └── server.ts               # Express server setup
├── drizzle/                    # Migration files (SAFE to commit)
├── dist/                       # Build output (ignored)
├── .env                        # Environment variables (ignored)
├── .gitignore
├── drizzle.config.ts           # Drizzle configuration
├── package.json
└── README.md
```

## 🤝 Use Cases

API ini cocok untuk:

1. **Development/Testing** - Simulasi SSO kampus tanpa perlu setup OAuth yang kompleks
2. **Prototype** - Membuat prototype aplikasi yang butuh data user kampus
3. **Learning** - Belajar integrasi dengan external authentication provider
4. **Demo** - Demonstrasi flow login dengan external API

## 📞 Support

Untuk pertanyaan atau issue, silakan hubungi:

- Email: support@campus.ac.id
- GitHub Issues: [Create an issue]

## 📄 License

MIT License - Feel free to use for educational purposes

---

**Made with ❤️ for Campus Integration**
