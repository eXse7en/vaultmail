# eXse7en - Private, Serverless Disposable Mail

![eXse7en Banner](public/readme-banner.png)

A premium, privacy-focused disposable email service built with **Next.js** and **MongoDB**. Features real-time inbox updates, custom domain support, and configurable privacy settings.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248)

## ✨ Features

- **🛡️ Privacy First**: Emails are stored in short-lived MongoDB records with auto-expiry logic.
- **⚙️ Configurable Retention**: Users can set email lifespan from **30 minutes** to **1 week**.
- **🌐 Custom Domains**: Bring your own domain via Cloudflare or Mailgun (Manage Domains GUI included).
- **⚡ Real-time**: Instant email delivery and inbox updates.
- **🎨 Premium UI**: Glassmorphism aesthetic, Dark Mode, and responsive mobile design.
- **📜 History**: Locally stored history of generated addresses for quick access.
- **🔗 Pretty URLs**: Shareable links like `https://app.com/user@domain.com`.
- **🤖 Telegram Notifications**: Get notified when new emails arrive.
- **📥 IMAP Fetch**: Alternative email intake via IMAP (Gmail, etc.).
- **🛠️ Built-in Tools**: 2FA generator, token generator, URL codec, breach checker, and more.

## 🏗️ Architecture

1. **Incoming Mail**: DNS MX Records point to your email routing service (Cloudflare/Mailgun).
2. **Webhook**: The service forwards the raw email to `https://your-app.com/api/webhook`.
3. **Processing**: The app parses the email, checks user retention settings, and stores it in **MongoDB**.
4. **Frontend**: The Next.js UI polls the API to display emails for the current address.

---

## 🚀 Deployment Guide

### 1. Deploy to Vercel

Clone this repository and deploy it to Vercel.

### 2. Environment Variables

Set the following variables in your Vercel project dashboard:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `MONGODB_DB` | No | Database name (default: `vaultmail`) |
| `ADMIN_PASSWORD` | ✅ Yes | Password for `/admin` dashboard login |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | No | Google AdSense client ID (optional) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No | Default language: `en` or `id` (default: `en`) |
| `ATTACHMENT_MAX_BYTES` | No | Max attachment size in bytes (default: `2000000`) |

### 3. Configure Database (MongoDB)

Provision a MongoDB database (MongoDB Atlas or self-hosted) and set the connection string:

```env
MONGODB_URI="your-connection-string"
MONGODB_DB="vaultmail"
```

### 4. Configure Email Forwarding

You need a service to receive SMTP traffic and forward it to your app's webhook.

#### Recommended: Cloudflare Email Workers (Free)

We include a pre-configured worker in the `worker/` directory.

1. **Setup Cloudflare**:
   - Add your domain to Cloudflare.
   - Enable **Email Routing** in the Cloudflare Dashboard.

2. **Deploy the Worker**:
   ```bash
   cd worker
   npm install
   npm run deploy
   ```

   Set the required environment variable in Cloudflare:
   - `WEBHOOK_URL` — your app's webhook URL, e.g. `https://your-app.vercel.app/api/webhook`

   Optional:
   - `FORWARD_DOMAINS` — forward emails from specific domains to a verified address
   - `FORWARD_EMAIL` — the verified email address to forward to

3. **Route Emails**:
   - In Cloudflare Email Routing > **Routes**.
   - Create a **Catch-All** route.
   - Action: `Send to Worker` → Destination: your worker name.

---

## 🌐 Custom Domain Setup (Admin Dashboard)

Selain menggunakan domain default, Anda bisa menambahkan **domain kustom** sendiri melalui Admin Dashboard.

### Cara menambahkan domain:

1. **Login ke Admin Dashboard** di `/admin`.
2. Masuk ke section **Manajemen Domain**.
3. Masukkan nama domain (contoh: `mail.domainkamu.com`) lalu klik **Tambah**.
4. Domain akan langsung muncul di daftar dan bisa dipilih oleh user di halaman utama.

### Cara kerja domain di aplikasi:

| Langkah | Penjelasan |
|---------|------------|
| **1. Tambah domain** | Admin menambah domain via dashboard `/admin` |
| **2. User pilih domain** | User memilih domain dari dropdown di halaman utama |
| **3. Buat alamat** | User mendapat alamat `username@domainkamu.com` |
| **4. Email masuk** | Email dikirim ke alamat tsb → MX record → Cloudflare → Worker → webhook app |
| **5. Tampil di inbox** | Email muncul di inbox user secara real-time |

### Catatan penting:

- Pastikan **MX Records** domain sudah mengarah ke Cloudflare/Mailgun **sebelum** menambahkan domain.
- Domain yang ditambahkan di Admin Dashboard akan langsung tersedia untuk semua user.
- Kamu juga bisa menghapus domain kapan saja.

---

## 🤖 Telegram Notification Setup

1. **Login ke Admin Dashboard** `/admin`.
2. Cari section **Status Notifikasi**.
3. Aktifkan toggle, lalu isi:
   - **Bot Token**: Token dari [@BotFather](https://t.me/BotFather)
   - **Chat ID**: ID channel/group (bisa negatif, contoh: `-100xxxx`)
4. Pilih domain mana yang akan mengirim notifikasi.
5. Klik **Simpan**.

Setiap email baru yang masuk akan otomatis dikirim notifikasi ke Telegram.

---

## 📥 Alternative: IMAP Fetch Setup (Admin Dashboard)

Selain webhook, Anda juga bisa menarik email langsung dari akun IMAP (misalnya Gmail) lewat **Admin Dashboard**.

### A. Buka pengaturan IMAP di admin
1. Login ke `/admin`.
2. Cari section **IMAP Fetch**.
3. Isi parameter berikut lalu klik **Simpan IMAP**:
   - `Host`: server IMAP (contoh Gmail: `imap.gmail.com`)
   - `Port`: biasanya `993`
   - `User`: email login IMAP
   - `Password`: password IMAP / app password
   - `Mailbox`: biasanya `INBOX`
   - `Max Fetch`: jumlah email terakhir yang di-scan per request inbox
4. Aktifkan toggle **Aktif** pada IMAP Fetch.

### B. Contoh setup Gmail (disarankan pakai App Password)
> Catatan: untuk Gmail, password akun biasa sering ditolak untuk IMAP. Gunakan App Password.

1. Buka akun Google yang mau dipakai menerima email.
2. Pastikan **2-Step Verification** sudah aktif.
3. Buat **App Password** dari halaman keamanan Google.
4. Gunakan konfigurasi berikut di Admin Dashboard:
   - Host: `imap.gmail.com`
   - Port: `993`
   - User: `namaakun@gmail.com`
   - Password: *16-digit App Password* (tanpa spasi)
   - Mailbox: `INBOX`
   - Max Fetch: contoh `30`
5. Simpan, aktifkan IMAP, lalu buka inbox target di aplikasi.

### C. Cara kerjanya
- Saat frontend memanggil `GET /api/inbox?address=...`, server akan:
  1. load email existing,
  2. pull email terbaru dari IMAP (jika aktif),
  3. deduplicate berdasarkan `sourceId`,
  4. simpan ke inbox storage yang sama dengan webhook.
- Artinya mode webhook lama **tetap jalan**; IMAP adalah jalur alternatif/tambahan.

---

## 🛠️ Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create `.env.local`:

   ```env
   MONGODB_URI="your-connection-string"
   MONGODB_DB="vaultmail"
   ADMIN_PASSWORD="your-admin-password"
   NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxxxxxxxx"  # optional
   NEXT_PUBLIC_DEFAULT_LOCALE="en"  # optional: "en" or "id"
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 📚 API Documentation (Temporary Email)

### 1) Fetch Inbox

Ambil daftar email untuk alamat sementara.

**Endpoint**
```
GET /api/inbox?address=nama@domain.com
```

**Response**
```json
{
  "emails": [
    {
      "id": "uuid",
      "from": "sender@example.com",
      "to": "nama@domain.com",
      "subject": "Hello",
      "text": "Plain text",
      "html": "<p>Plain text</p>",
      "attachments": [],
      "receivedAt": "2025-01-01T00:00:00.000Z",
      "read": false
    }
  ]
}
```

### 2) Webhook (Inbound Email)

Email routing service (Cloudflare/Mailgun) mengirim email ke endpoint ini.

**Endpoint**
```
POST /api/webhook
```

**JSON Body Example**
```json
{
  "from": "sender@example.com",
  "to": "nama@domain.com",
  "subject": "Hello",
  "text": "Plain text message",
  "html": "<p>Plain text message</p>",
  "attachments": []
}
```

**Response**
```json
{ "success": true, "id": "uuid" }
```

### 3) Download Email / Attachment

**Endpoint**
```
GET /api/download?address=nama@domain.com&emailId=uuid&type=email
GET /api/download?address=nama@domain.com&emailId=uuid&type=attachment&index=0
```

### 4) Retention Settings (Read Only)

**Endpoint**
```
GET /api/retention
```

**Response**
```json
{
  "seconds": 86400,
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### 5) Domain List

**Endpoint**
```
GET /api/domains
```

**Response**
```json
{
  "domains": ["mail.example.com", "exse7en.dpdns.org"]
}
```

---

## 📝 Additional Admin Features

### Homepage Lock
Kunci seluruh halaman utama dengan password. Aktifkan di Admin Dashboard → **Homepage Private**. Password di-hash dengan SHA-256 dan disimpan di MongoDB.

### Retention Settings
Atur berapa lama email disimpan sebelum otomatis dihapus. Pilihan: 30 menit, 1 jam, 24 jam, 3 hari, atau 1 minggu.

### Branding
Ubah nama aplikasi, title header, dan deskripsi dari Admin Dashboard tanpa perlu deploy ulang.

### Inbox Maintenance
- **Cleanup**: Hapus email yang sudah kedaluwarsa secara manual.
- **Delete Inbox**: Hapus inbox spesifik berdasarkan alamat email.
- **Delete All**: Hapus semua pesan di seluruh inbox.

---

## 📜 License

MIT License. Feel free to fork and deploy your own private email shield.

---

## 🔗 Links

- **Store**: [store.exse7en.com](https://store.exse7en.com)
- **Order Bot**: [t.me/exse7en_bot](https://t.me/exse7en_bot)
- **GitHub**: [github.com/eXse7en](https://github.com/eXse7en)
