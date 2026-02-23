import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

function isValidTikTokUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return ['www.tiktok.com', 'tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'm.tiktok.com'].includes(u.hostname)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL tidak boleh kosong' }, { status: 400 })
    }

    const trimmedUrl = url.trim()

    if (!isValidTikTokUrl(trimmedUrl)) {
      return NextResponse.json({ error: 'URL tidak valid. Masukkan link TikTok yang benar.' }, { status: 400 })
    }

    // Use tikwm.com API (free, reliable, no watermark)
    const apiUrl = 'https://tikwm.com/api/'
    const formData = new URLSearchParams()
    formData.append('url', trimmedUrl)
    formData.append('hd', '1')

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error('Gagal menghubungi API')
    }

    const data = await response.json()

    if (data.code !== 0 || !data.data) {
      throw new Error(data.msg || 'Video tidak ditemukan atau tidak dapat diakses')
    }

    const video = data.data

    return NextResponse.json({
      title: video.title || 'TikTok Video',
      author: video.author?.unique_id || video.author?.nickname || 'unknown',
      thumbnail: video.cover || video.origin_cover || '',
      duration: video.duration || 0,
      videoUrl: video.play || '',
      videoNoWatermark: video.hdplay || video.play || '',
      audioUrl: video.music || video.music_info?.play || '',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan server'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
