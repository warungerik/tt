'use client'

import styles from '../page.module.css'
import Link from 'next/link'

export default function ApiDocs() {
    const domain = "https://tt-alpha-smoky.vercel.app"

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>▶</span>
                        <span>TikSave API</span>
                    </div>
                </Link>
                <div className={styles.badge}>v1.0 Documentation</div>
            </header>

            <section className={styles.hero} style={{ padding: '40px 0' }}>
                <h1 className={styles.heroTitle}>API <span className={styles.heroAccent}>Docs</span></h1>
                <p className={styles.heroSub}>Integrasikan fitur download TikTok ke aplikasi Anda sendiri.</p>
            </section>

            <section className={styles.howTo}>
                <h2 className={styles.sectionTitle}>1. Fetch Video Data</h2>
                <div className={styles.step} style={{ marginBottom: '20px' }}>
                    <p><strong>Endpoint:</strong> <code>POST /api/download</code></p>
                    <p><strong>Content-Type:</strong> <code>application/json</code></p>
                    <pre className={styles.errorBox} style={{ background: '#1a1a1a', marginTop: '10px' }}>
                        {`{
  "url": "https://www.tiktok.com/@user/video/..."
}`}
                    </pre>
                </div>

                <h2 className={styles.sectionTitle}>2. Contoh Implementasi PHP</h2>
                <div className={styles.step}>
                    <pre className={styles.errorBox} style={{ background: '#1a1a1a', fontSize: '0.8rem', overflowX: 'auto' }}>
                        {`<?php
$url = "${domain}/api/download";
$payload = json_encode(["url" => "LINK_TIKTOK"]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$res = curl_exec($ch);
echo $res; // Output: JSON video data
?>`}
                    </pre>
                </div>

                <h2 className={styles.sectionTitle} style={{ marginTop: '40px' }}>3. Proxy Download</h2>
                <div className={styles.step}>
                    <p>Gunakan ini untuk melewati batasan CORS saat download file:</p>
                    <code className={styles.errorBox} style={{ display: 'block', wordBreak: 'break-all' }}>
                        {domain}/api/proxy?url=[LINK_MEDIA]
                    </code>
                </div>
            </section>

            <footer className={styles.footer}>
                <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Kembali ke Beranda</Link>
            </footer>
        </main>
    )
}