# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Viewed user-stories.md:1-60
Viewed rancangan-teknis.md:1-69
Viewed DESIGN.md:1-52
Viewed page.jsx:1-37
Listed directory lib
Listed directory components
Viewed KartuProduk.jsx:1-25
Viewed package.json:1-25
Viewed .env.example:1-14
Viewed schema.sql:1-49
Listed directory docs
Viewed skema-database.md:1-27
Viewed checklist-keamanan.md:1-14
Searched for "lib/supabase"
Searched for "@supabase"
Viewed PRD.md:1-60
Viewed problem-statement.md:1-83
Listed directory app
Listed directory produk
Viewed page.jsx:1-41
Listed directory admin
Viewed globals.css:1-34
Viewed data-contoh.js:1-60
Searched for "Belum ada produk"
Viewed PROMPTS.md:1-61
Searched for "dynamic"
Viewed page.jsx:1-28
Created server.js
Created index.js
Created page.jsx
Ran command: `npm run build`
Used tool: manage_task
Used tool: manage_task
Used tool: manage_task
Used tool: manage_task

Fitur **US-01: Katalog dari database** telah selesai dikerjakan sesuai spesifikasi dan aturan di [AGENTS.md](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/AGENTS.md).

---

### File yang Dibuat & Diubah

1. **[lib/supabase/server.js](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/lib/supabase/server.js)** *(Baru)*
   - Membuat inisialisasi client Supabase di sisi server menggunakan `@supabase/supabase-js`.
   - Membaca environment variable `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` (menolak akses tanpa awalan `NEXT_PUBLIC_` untuk keamanan).
2. **[lib/supabase/index.js](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/lib/supabase/index.js)** *(Baru)*
   - Mengekspor `createServerClient` dan `createClient` dari folder `lib/supabase`.
3. **[app/page.jsx](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/app/page.jsx)** *(Diubah)*
   - Mengambil data dari tabel `produk` di Supabase secara dinamis di sisi server (`async Server Component`).
   - Menampilkan daftar produk menggunakan [KartuProduk](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/components/KartuProduk.jsx) tanpa mengubah tampilannya.
   - Menampilkan tulisan `"Belum ada produk"` jika tabel kosong.
   - Menampilkan pesan error yang jelas jika terjadi kegagalan koneksi atau query.
   - Menghapus komponen `CatatanBelumAktif` dan referensi `produkContoh`.

---

### Cara Mengetes

1. Pastikan file `.env.local` sudah berisi nilai `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` yang valid serta tabel `produk` di Supabase telah dibuat dan diisi data (lihat [docs/schema.sql](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/docs/schema.sql)).
2. Buka browser di alamat `http://localhost:3000`.
3. **Kondisi Normal:** Periksa apakah daftar produk yang tampil sesuai dengan data dari tabel `produk` di Supabase.
4. **Kondisi Kosong:** Jika tabel `produk` dikosongkan, halaman akan menampilkan tulisan *"Belum ada produk"*.
5. **Kondisi Error:** Jika `SUPABASE_URL` atau `SUPABASE_SECRET_KEY` salah/kosong, halaman akan menampilkan kotak pesan error yang informatif.

**Perbaikan:**
Viewed .env.local:1-4
Edited server.js
Edited .env.local
Ran command: `curl -s http://localhost:3000`
Used tool: manage_task
Used tool: manage_task
Ran command: `node -e "fetch('http://localhost:3000').then(r => r.text()).then(t => console.log('Status: OK, length:', t.length, 'Contains error:', t.includes('Gagal memuat produk'), 'Contains Kopi:', t.includes('Kopi'))).catch(e => console.error(e))"`

Error `Invalid path specified in request URL.` telah berhasil diperbaiki tanpa mengubah tampilan.

---

### Penyebab Error

Pada file `.env.local`, variabel `SUPABASE_URL` sebelumnya berisi path endpoint REST lengkap (misal: `https://<project-ref>.supabase.co/rest/v1/`). Karena Supabase Client secara otomatis menambahkan path `/rest/v1/produk` ke base URL saat query dijalankan, URL yang terbentuk menjadi ganda (`.../rest/v1//rest/v1/produk`), sehingga Supabase menolak request tersebut.

---

### Perbaikan yang Dilakukan

1. **[.env.local](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/.env.local)**
   - Mengubah `SUPABASE_URL` menjadi URL utama project saja (menghapus `/rest/v1/`).

2. **[lib/supabase/server.js](file:///d:/xampp/htdocs/jersey-rangga/rangga-jersey/lib/supabase/server.js)**
   - Menambahkan normalisasi URL otomatis (menghapus trailing slash `/` dan akhiran `/rest/v1` jika ada). Hal ini mencegah error serupa terjadi kembali saat deployment ke Vercel atau jika URL disalin dengan format REST.

---

### Hasil Pengujian

Halaman katalog di `http://localhost:3000` telah diuji dan berhasil memuat daftar produk dari database Supabase dengan status normal tanpa error.

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
