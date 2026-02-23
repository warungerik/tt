# TikSave — TikTok Downloader

Web app untuk download video TikTok tanpa watermark. Dibangun dengan Next.js, siap deploy ke Vercel.

## Fitur
- ✅ Download video tanpa watermark (HD)
- ✅ Download video standard
- ✅ Download audio / MP3
- ✅ Proxy aman untuk bypass CORS
- ✅ Responsive design (mobile & desktop)
- ✅ Tidak perlu database atau auth

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Next.js API Routes (Edge Runtime)
- **API TikTok**: [tikwm.com](https://tikwm.com) (free, no watermark)
- **Deploy**: Vercel

---

## Deploy ke Vercel

### Cara 1: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Masuk ke folder project
cd tiktok-downloader

# Deploy
vercel
```

### Cara 2: Via GitHub
1. Upload folder ini ke GitHub repo baru
2. Buka [vercel.com](https://vercel.com), login
3. Klik "Add New Project"
4. Import repo GitHub kamu
5. Klik "Deploy" — selesai!

---

## Jalankan Lokal
```bash
npm install
npm run dev
# Buka http://localhost:3000
```

---

## Catatan
- Menggunakan API pihak ketiga (tikwm.com), pastikan dalam batas fair use
- Edge Runtime digunakan agar lebih cepat di Vercel
- Video private tidak bisa didownload
