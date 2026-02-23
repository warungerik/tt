'use client'

import { useState, useRef } from 'react'
import styles from './page.module.css'

interface VideoInfo {
  title: string
  author: string
  thumbnail: string
  duration: number
  videoUrl: string
  audioUrl: string
  videoNoWatermark: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<VideoInfo | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      inputRef.current?.focus()
    }
  }

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengambil video')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (downloadUrl: string, type: string) => {
    setDownloading(type)
    try {
      const ext = type === 'audio' ? 'mp3' : 'mp4'
      const filename = `tiktok-${type}-${Date.now()}.${ext}`

      // Use proxy to force download
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(downloadUrl)}`)
      if (!res.ok) throw new Error('Download gagal')
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      alert('Download gagal. Coba klik kanan > Save As pada tombol download.')
    } finally {
      setDownloading(null)
    }
  }

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <main className={styles.main}>
      {/* Background decoration */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>▶</span>
          <span>TikSave</span>
        </div>
        <div className={styles.badge}>Free & No Watermark</div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>✦ TikTok Downloader</div>
        <h1 className={styles.heroTitle}>
          Download TikTok<br />
          <span className={styles.heroAccent}>Tanpa Watermark</span>
        </h1>
        <p className={styles.heroSub}>
          Paste link TikTok, download video HD, audio MP3 — gratis & cepat.
        </p>

        {/* Input form */}
        <form onSubmit={handleFetch} className={styles.form}>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>🔗</span>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@user/video/..."
              className={styles.input}
              spellCheck={false}
            />
            <button type="button" onClick={handlePaste} className={styles.pasteBtn}>
              Paste
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              'Download ↓'
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className={styles.errorBox}>
            <span>⚠</span> {error}
          </div>
        )}
      </section>

      {/* Result */}
      {result && (
        <section className={styles.resultSection}>
          <div className={styles.resultCard}>
            <div className={styles.resultLeft}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/proxy?url=${encodeURIComponent(result.thumbnail)}`}
                alt="thumbnail"
                className={styles.thumbnail}
              />
              {result.duration > 0 && (
                <span className={styles.duration}>{formatDuration(result.duration)}</span>
              )}
            </div>

            <div className={styles.resultRight}>
              <p className={styles.videoAuthor}>@{result.author}</p>
              <p className={styles.videoTitle}>{result.title}</p>

              <div className={styles.downloadButtons}>
                {result.videoNoWatermark && (
                  <button
                    className={`${styles.dlBtn} ${styles.dlBtnPrimary}`}
                    onClick={() => handleDownload(result.videoNoWatermark, 'video-hd')}
                    disabled={!!downloading}
                  >
                    {downloading === 'video-hd' ? <span className={styles.spinnerSm} /> : '↓'}
                    Video HD (No Watermark)
                  </button>
                )}
                {result.videoUrl && (
                  <button
                    className={`${styles.dlBtn} ${styles.dlBtnSecondary}`}
                    onClick={() => handleDownload(result.videoUrl, 'video')}
                    disabled={!!downloading}
                  >
                    {downloading === 'video' ? <span className={styles.spinnerSm} /> : '↓'}
                    Video Standard
                  </button>
                )}
                {result.audioUrl && (
                  <button
                    className={`${styles.dlBtn} ${styles.dlBtnAudio}`}
                    onClick={() => handleDownload(result.audioUrl, 'audio')}
                    disabled={!!downloading}
                  >
                    {downloading === 'audio' ? <span className={styles.spinnerSm} /> : '♫'}
                    Audio MP3
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className={styles.features}>
        {[
          { icon: '⚡', title: 'Super Cepat', desc: 'Proses download dalam hitungan detik' },
          { icon: '🚫', title: 'No Watermark', desc: 'Video bersih tanpa logo TikTok' },
          { icon: '🎵', title: 'Extract Audio', desc: 'Download musik sebagai file MP3' },
          { icon: '🔒', title: 'Aman & Gratis', desc: 'Tidak perlu login atau install apapun' },
        ].map(f => (
          <div key={f.title} className={styles.featureCard}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* How to use */}
      <section className={styles.howTo}>
        <h2 className={styles.sectionTitle}>Cara Pakai</h2>
        <div className={styles.steps}>
          {[
            { n: '01', text: 'Buka TikTok, pilih video yang ingin didownload' },
            { n: '02', text: 'Tap "Share" lalu "Copy Link" untuk menyalin URL' },
            { n: '03', text: 'Paste URL di kolom di atas, klik Download' },
            { n: '04', text: 'Pilih format yang diinginkan dan simpan!' },
          ].map(s => (
            <div key={s.n} className={styles.step}>
              <span className={styles.stepNum}>{s.n}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 TikSave. Dibuat untuk kemudahan. <a href="/api-docs" style={{ color: 'var(--accent)', textDecoration: 'none' }}>API Docs</a></p>
      </footer>
    </main>
  )
}
