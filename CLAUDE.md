@AGENTS.md

# Proje Bağlamı

## Proje Özeti
ASTİM Ticaret Merkezi web sitesi — 29 atölye, 3 blok (A/B/C).
Next.js App Router, GitHub JSON (zero-database), NextAuth.js v5, Cloudinary, Resend, Tailwind CSS v4.

## Tasarım Sistemi
- **Tema:** Neo-Brutalism "Industrial Archival"
- **Renkler:** bone `#F4F3F0`, ink `#111111`, orange `#FF4A00`, acid `#DFFF00`
- **Fontlar:** Hanken Grotesk (`--font-hanken`), Inter (`--font-inter`), Space Mono (`--font-space-mono`)

## Branch Yapısı
- `main` → Vercel production
- `feature/backend-auth` → backend (auth, admin panel, atölye yönetimi, mail)
- `feature/ui-redesign` → UI

## MCP Araçları
- **Supabase MCP** — `settings.json`'da kayıtlı, project-ref: `vprsgtanrmcqjufozjuu`
- **Stitch MCP** — `settings.json`'da kayıtlı, `https://stitch.googleapis.com/mcp` üzerinden HTTP transport ile bağlı. UI tasarım revizyonları ve landing page bileşenleri için kullan.

## Önemli Kurallar
- Git push ve screenshot YALNIZCA kullanıcı istediğinde yapılır.
- Popup modal pattern: fixed backdrop, centered panel, scrollable form, İPTAL + KAYDET footer, Escape + backdrop click ile kapanır, `router.refresh()` sonrası.
