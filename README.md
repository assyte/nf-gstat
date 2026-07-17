# gStat - Game Statistics Tracker

<div align="center">

![gStat Logo](https://via.placeholder.com/150x50/1a1a1a/dc2626?text=gStat)

**Sukuna konseptli, gece dostu, yüksek performanslı oyun istatistik takipçisi.**

[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri)](https://tauri.app)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06b6d4?logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 🎮 Özellikler

### Temel Özellikler
- **Evrensel Süre İzleyici** - Çalışan tüm oyun süreçlerini otomatik algılama
- **Minecraft Desteği** - `javaw.exe` argüman taraması ile mod/fabric tespiti
- **Steam API** - Oyun kütüphanesi ve otomatik tespit
- **Riot API** - Valorant, League of Legends istatistikleri
- **Discord RPC** - Aktif oyun bilgisini Discord'da gösterme

### Arayüz
- **Sukuna Konsepti** - Siyah ve koyu kırmızı renk paleti
- **Gece Dostu** - Düşük parlaklık, göz yorgunluğunu azaltan tasarım
- **Çoklu Dil** - Türkçe ve İngilizce desteği (i18next)
- **Responsive** - Masaüstü ve mobil uyumlu

### Teknik
- **Yüksek Performans** - Rust tabanlı Tauri motoru
- **Yerel Veritabanı** - SQLite ile hızlı veri erişimi
- **Düşük Kaynak Kullanımı** - ~50MB RAM, minimal CPU

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Motor** | Tauri 2.0 (Rust) |
| **Frontend** | React 18, TypeScript 5.5 |
| **Stil** | Tailwind CSS 3.4 |
| **Veritabanı** | SQLite (rusqlite) |
| **Süreç Takibi** | sysinfo |
| **API İstemcisi** | reqwest |
| **Dil Desteği** | i18next |

---

## 🚀 Kurulum

### Ön Gereksinimler

- **Rust** (1.75+)
- **Node.js** (18+)
- **npm** veya **yarn**

#### Linux (Arch/Garuda) İçin Ek Gereksinimler

```bash
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file \
  appmenu-gtk-module libappindicator-gtk-dev librsvg libxss glib2 gtk3 \
  openssl
```

### Kurulum Adımları

```bash
# 1. Depoyu klonlayın
git clone https://github.com/NartForge/nf-gstat.git
cd nf-gstat

# 2. Bağımlılıkları yükleyin
npm install

# 3. Geliştirme modunu başlatın
npm run tauri dev
```

### Production Build

```bash
npm run tauri build
```

---

## 📁 Proje Yapısı

```
nf-gstat/
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs         # Tauri giriş noktası
│   │   ├── lib.rs          # Library entry
│   │   └── db.rs           # SQLite veritabanı modülü
│   ├── Cargo.toml          # Rust bağımlılıkları
│   └── tauri.conf.json     # Tauri yapılandırması
├── src/                    # React frontend
│   ├── main.tsx            # Uygulama giriş noktası
│   ├── App.tsx             # Ana bileşen
│   └── index.css           # Global stiller
├── reports/                # Günlük raporlar
│   └── daily/              # Günlük rapor klasörü
├── PLAN.md                 # Geliştirme planı
└── package.json            # Node.js bağımlılıkları
```

---

## 📊 Geliştirme Aşamaları

| Aşama | Açıklama | Durum |
|-------|----------|-------|
| **Aşama 1** | Temel iskelet ve altyapı | ✅ Tamamlandı |
| **Aşama 2** | Evrensel Süre İzleyici | 🔄 Devam Ediyor |
| **Aşama 3** | Minecraft Entegrasyonu | ⏳ Bekliyor |
| **Aşama 4** | Steam API Entegrasyonu | ⏳ Bekliyor |
| **Aşama 5** | Riot API Entegrasyonu | ⏳ Bekliyor |
| **Aşama 6** | Discord RPC | ⏳ Bekliyor |
| **Aşama 7** | UI/UX İyileştirmeleri | ⏳ Bekliyor |
| **Aşama 8** | Test ve Optimizasyon | ⏳ Bekliyor |
| **Aşama 9** | Yayına Alma | ⏳ Bekliyor |

---

## 📝 Günlük Raporlar

Günlük geliştirme raporları `reports/daily/` klasöründe tutulur.

Örnek rapor yapısı:
- Tarih
- Tamamlanan görevler
- Devam eden çalışmalar
- Sonraki adımlar
- Karşılaşılan sorunlar

---

## 🤲 Katkıda Bulunma

1. Fork oluşturun
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır. Detaylı bilgi için `LICENSE` dosyasına bakın.

---

## 🙏 Teşekkürler

- [Tauri](https://tauri.app) - Muhteşem masaüstü uygulama çerçevesi
- [React](https://react.dev) - UI kütüphanesi
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [SQLite](https://www.sqlite.org) - Hafif veritabanı motoru

---

<div align="center">

**gStat** © 2026 [NartForge](https://github.com/NartForge)

*Sukuna'nın gözü senin üzerinde.* 👁️

</div>
