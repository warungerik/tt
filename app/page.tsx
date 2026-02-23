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
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>▶</span>
          <span>TikSave</span>
        </div>
        <div className={styles.badge}>Free Downloader</div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroTag}>✦ TikTok Downloader</div>
        <h1 className={styles.heroTitle}>
          Download TikTok<br />
          <span className={styles.heroAccent}>Mudah & Cepat</span>
        </h1>
        <p className={styles.heroSub}>
          Paste link TikTok, download video atau MP3 — gratis tanpa ribet.
        </p>

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
            {loading ? <span className={styles.spinner} /> : 'Download ↓'}
          </button>
        </form>

        {error && (
          <div className={styles.errorBox}>
            <span>⚠</span> {error}
          </div>
        )}
      </section>

      {result && (
        <section className={styles.resultSection}>
          <div className={styles.resultCard}>
            <div className={styles.resultLeft}>
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
                {result.videoUrl && (
                  <button
                    className={`${styles.dlBtn} ${styles.dlBtnPrimary}`}
                    onClick={() => handleDownload(result.videoUrl, 'video')}
                    disabled={!!downloading}
                  >
                    {downloading === 'video' ? <span className={styles.spinnerSm} /> : '↓'}
                    Download Video
                  </button>
                )}
                {result.audioUrl && (
                  <button
                    className={`${styles.dlBtn} ${styles.dlBtnAudio}`}
                    onClick={() => handleDownload(result.audioUrl, 'audio')}
                    disabled={!!downloading}
                  >
                    {downloading === 'audio' ? <span className={styles.spinnerSm} /> : '♫'}
                    Download MP3
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <p>© 2024 TikSave. <a href="/api-docs" style={{ color: 'var(--accent)', textDecoration: 'none' }}>API Docs</a></p>
      </footer>
    </main>
  )
}