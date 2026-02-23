import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TikSave — TikTok Downloader',
  description: 'Download TikTok videos without watermark, free & fast.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
