# Priorify-AI

Aplikasi perencana tugas akademik berbasis React dan Vite dengan antarmuka futuristis cyberpunk.

## Fitur

- Prioritas tugas berdasarkan deadline, kesulitan, kepentingan, estimasi waktu, dan status.
- Penyusunan jadwal belajar berdasarkan waktu kosong.
- AI Assistant berupa simulasi berbasis data tugas dan jadwal.
- Light/dark mode dengan rotasi matahari dan bulan, ornamen 3D, serta pengaturan animasi.
- Penyimpanan tugas, jadwal, dan preferensi tampilan di localStorage.
- Login Google melalui Firebase dan akses demo lokal.

## Jalankan secara lokal

```sh
npm ci
npm run dev
```

Buka alamat lokal yang ditampilkan Vite, biasanya http://localhost:5173.

## Build

```sh
npm run build
npm run preview
```

## Pengujian browser

```sh
npm run test:e2e
```

Pengujian menggunakan Microsoft Edge yang terpasang di Windows. Pada sistem lain, instal Chromium untuk Playwright terlebih dahulu dengan `npx playwright install chromium`.

Login simulasi hanya untuk demo. Konfigurasi Firebase berada di `src/services/firebase.js`; Google Sign-in perlu diaktifkan dan domain aplikasi perlu terdaftar di Firebase Authentication.
