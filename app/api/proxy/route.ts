import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Allowed domains for proxying (security)
const ALLOWED_DOMAINS = [
  'tikwm.com',
  'tiktokcdn.com',
  'tiktokcdn-us.com',
  'tiktok.com',
  'p16-sign.tiktokcdn-us.com',
  'p19-sign.tiktokcdn-us.com',
  'p77-sign.tiktokcdn-us.com',
  'v19.tiktokcdn.com',
  'v19-webapp.tiktok.com',
]

function isAllowedDomain(url: string): boolean {
  try {
    const u = new URL(url)
    return ALLOWED_DOMAINS.some(d => u.hostname.endsWith(d))
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  if (!isAllowedDomain(targetUrl)) {
    return NextResponse.json({ error: 'Domain tidak diizinkan' }, { status: 403 })
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/',
      },
    })

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const data = await response.arrayBuffer()

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Proxy error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
