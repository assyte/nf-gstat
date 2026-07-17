Günlük Rapor — 2026-07-16 (Perşembe) — Gün 3
✅ Tamamlananlar
- k6 load test senaryoları (auth, accounts, transactions, mix)
- k6 CI workflow (load-test.yml)
- Sentry backend (@sentry/node): GlobalExceptionFilter → 500 hatası
- Sentry frontend (@sentry/react): ErrorBoundary + main.tsx init
- .env.example: Sentry DSN eklendi
- Load test rapor şablonu (reports/performance/load-test-template.md)
- k6 scriptleri (5 adet: auth, accounts, transactions, mix, options)
- Commit: c2c1e55
Günlük Rapor — 2026-07-17 (Cuma) — Gün 4
📍 Bugünkü Hedef
Phase 9: Performance Budget & Accessibility — tamamla + canlıya geçiş.
✅ Dünden Devralınan (16 Temmuz)
- k6 load test senaryoları + CI workflow
- Sentry backend/frontent entegrasyonu
- Load test rapor şablonu
📊 Güncel Durum
Alan	Durum
Build	✅ (23/23)
Lint	✅
Test	✅ (33 backend + 13 frontend = 46 test)
Lighthouse perf threshold	✅ (≥ 80)
Accessibility (WCAG 2.1 AA)	✅ (axe-core + jest-axe)
Web prod	✅ (200)
API prod	✅ (200)
Sentry	✅ Entegre
✅ Tamamlananlar
Performance Budget & Accessibility
- .lighthouserc.js — strict threshold'lar
- Performance ≥ 80 (error), Accessibility ≥ 90 (error)
- Best Practices ≥ 90 (error), SEO ≥ 90 (error)
- Budget: JS ≤ 500KB, CSS ≤ 100KB, Total ≤ 2MB
- lighthouse.yml güncellendi — || true kaldırıldı, ihlal → CI fail
- jest-axe kurulumu + WCAG 2.1 AA audit testleri (5 test)
- reports/accessibility/_template.md rapor şablonu
- Commit: eb1d153 + 3e64c8b
Canlıya Geçiş (Production Deploy)
- GitHub'a push → sunucuda git pull
- docker compose up --build -d (backend + worker yeni imaj)
- Web 200, API 200, PostgreSQL healthy, Redis healthy
- Domain: https://cuzdan.nartforge.com — 200 (0.33s)
Deploy Sonrası Durum
Servis	Port	Durum
piggybank-backend	4085	✅ Up
piggybank-web	8085	✅ Up
piggybank-postgres	15432	✅ Healthy
piggybank-redis	16379	✅ Healthy
piggybank-worker	—	✅ Up
