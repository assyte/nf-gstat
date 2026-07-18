# gStat v1.0.0 Geliştirme Planı

## 📅 Proje Bilgileri
- **Proje Adı:** gStat
- **Başlangıç Tarihi:** 17 Temmuz 2026
- **Hedef Sürüm:** v1.0.0
- **Hedef Tarih:** 24 Temmuz 2026
- **Kalan Gün:** 7 gün

---

## 🎯 v1.0.0 İçin Gerekenler

### Temel Özellikler (MVP)
- [x] Süre takibi (otomatik oyun algılama)
- [x] Minecraft entegrasyonu (mod loader tespiti)
- [ ] Steam API entegrasyonu
- [ ] Riot API entegrasyonu (Valorant, LoL)
- [ ] Discord Rich Presence
- [ ] Sukuna temalı arayüz
- [ ] Çoklu dil desteği (TR/EN)

### Teknik Gereksinimler
- [x] Tauri 2.0 ile masaüstü uygulaması
- [x] SQLite yerel veritabanı
- [x] Cross-platform (Windows, Linux, macOS)
- [ ] Production build
- [ ] Installer paketi

---

## 📊 Kalan Aşamalar

| Aşama | Ad | Süre | Durum | Hedef Tarih |
|-------|-----|------|-------|-------------|
| 4 | Steam API | 2 gün | ⏳ | 18-19 Tem |
| 5 | Riot API | 1 gün | ⏳ | 20 Tem |
| 6 | Discord RPC | 1 gün | ⏳ | 21 Tem |
| 7 | UI/UX | 1 gün | ⏳ | 22 Tem |
| 8 | Test | 1 gün | ⏳ | 23 Tem |
| 9 | Yayına Alma | 1 gün | ⏳ | 24 Tem |

**Toplam Kalan:** 6 aşama, 7 gün

---

## 📋 Detaylı Aşama Planları

### Aşama 4: Steam API Entegrasyonu (2 Gün)
**18-19 Temmuz 2026**

#### 18 Temmuz - Cumartesi
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| `steam.rs` modülü oluştur | 2s | Yüksek | ✅ |
| Steam API key yönetimi | 1s | Yüksek | ✅ |
| Rate limiting mekanizması | 1s | Yüksek | ✅ |
| Kullanıcı profil bilgileri | 2s | Yüksek | ✅ |
| Oyun kütüphanesi çekme | 3s | Yüksek | ✅ |

#### 19 Temmuz - Pazar
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| Çalışan Steam oyununu algılama | 2s | Yüksek | ⏳ |
| Süre senkronizasyonu | 2s | Yüksek | ⏳ |
| Frontend Steam sekmesi | 2s | Orta | ✅ |
| Test ve hata düzeltme | 2s | Yüksek | ⏳ |

**Teslimler:**
- `src-tauri/src/steam.rs` - Steam modülü
- Frontend'de Steam sekmesi

---

### Aşama 5: Riot API Entegrasyonu (1 Gün)
**20 Temmuz 2026**

#### 20 Temmuz - Pazartesi
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| `riot.rs` modülü oluştur | 1s | Yüksek | ⏳ |
| Riot API key yönetimi | 1s | Yüksek | ⏳ |
| Valorant istatistikleri | 2s | Yüksek | ⏳ |
| League of Legends istatistikleri | 2s | Yüksek | ⏳ |
| Maç geçmişi çekme | 1s | Orta | ⏳ |
| KDA, win rate hesaplama | 1s | Orta | ⏳ |

**Teslimler:**
- `src-tauri/src/riot.rs` - Riot modülü
- Frontend'de Riot sekmesi

---

### Aşama 6: Discord RPC (1 Gün)
**21 Temmuz 2026**

#### 21 Temmuz - Salı
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| `discord.rs` modülü oluştur | 1s | Yüksek | ⏳ |
| Discord Rich Presence kurulumu | 2s | Yüksek | ⏳ |
| Aktif oyun bilgisi paylaşma | 2s | Yüksek | ⏳ |
| Özel durum mesajları | 1s | Orta | ⏳ |
| Discord ayarları sayfası | 1s | Orta | ⏳ |
| Test ve hata düzeltme | 1s | Yüksek | ⏳ |

**Teslimler:**
- `src-tauri/src/discord.rs` - Discord RPC modülü
- Discord ayarları sayfası

---

### Aşama 7: UI/UX İyileştirmeleri (1 Gün)
**22 Temmuz 2026**

#### 22 Temmuz - Çarşamba
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| Sukuna teması detaylandırma | 2s | Yüksek | ⏳ |
| Renk paleti optimizasyonu | 1s | Yüksek | ⏳ |
| Animasyonlar ekleme | 2s | Orta | ⏳ |
| Responsive tasarım | 2s | Yüksek | ⏳ |
| Tooltips ve bildirimler | 1s | Düşük | ⏳ |

**Teslimler:**
- Güncellenmiş `App.tsx`
- Yeni UI bileşenleri
- Sukuna teması

---

### Aşama 8: Test ve Optimizasyon (1 Gün)
**23 Temmuz 2026**

#### 23 Temmuz - Perşembe
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| Unit test yazımı | 2s | Yüksek | ⏳ |
| Entegrasyon testleri | 2s | Yüksek | ⏳ |
| Performans testleri | 2s | Yüksek | ⏳ |
| Bellek kullanımı optimizasyonu | 1s | Yüksek | ⏳ |
| Hata ayıklama | 1s | Yüksek | ⏳ |

**Teslimler:**
- Test dosyaları
- Performans raporu
- Hata düzeltmeleri

---

### Aşama 9: Yayına Alma (1 Gün)
**24 Temmuz 2026**

#### 24 Temmuz - Cuma
| Görev | Süre | Öncelik | Durum |
|-------|------|---------|-------|
| Production build oluşturma | 2s | Yüksek | ⏳ |
| Installer paketi hazırlama | 2s | Yüksek | ⏳ |
| README güncelleme | 1s | Yüksek | ⏳ |
| Dokümantasyon tamamlama | 1s | Yüksek | ⏳ |
| GitHub Release oluşturma | 1s | Yüksek | ⏳ |
| Son testler | 1s | Yüksek | ⏳ |

**Teslimler:**
- `.exe` / `.AppImage` / `.dmg` dosyaları
- GitHub Release
- Güncellenmiş dokümantasyon

---

## 🔧 Teknik Gereksinimler

### Yeni Rust Bağımlılıkları
```toml
[dependencies]
# Steam API
reqwest = { version = "0.12", features = ["json"] }

# Discord RPC
discord-rpc = "0.4"

# Test
mockall = "0.12"
```

### Yeni Frontend Bağımlılıkları
```json
{
  "react-router-dom": "^6.26.0",
  "axios": "^1.7.0",
  "react-query": "^5.0.0",
  "framer-motion": "^11.0.0"
}
```

---

## 📈 Hedef Tablo

| Metrik | Hedef |
|--------|-------|
| Aşama Sayısı | 9/9 |
| Tamamlanan Görev | 50+ |
| Toplam Kod | 3000+ satır |
| Dosya Sayısı | 40+ |
| Test Kapsamı | %80+ |
| Build Boyutu | <50MB |
| Bellek Kullanımı | <100MB |

---

## ⚠️ Riskler ve Azaltma

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| API rate limiting | Yüksek | Orta | exponential backoff |
| Ağ hataları | Orta | Yüksek | retry mekanizması |
| Performans sorunları | Orta | Orta | profiling |
| Cross-platform uyumluluk | Düşük | Yüksek | erken test |
| Güvenlik açıkları | Düşük | Yüksek | kod incelemesi |

---

## 🎯 Başarı Kriterleri

### v1.0.0 İçin Zorunlu
- [ ] Tüm API entegrasyonları çalışıyor
- [ ] Sukuna teması uygulanmış
- [ ] Tüm testler geçiyor
- [ ] Production build hazır
- [ ] Cross-platform çalışıyor
- [ ] Dokümantasyon eksiksiz

### Kalite Kriterleri
- [ ] Kod kalitesi yüksek
- [ ] Hata yönetimi uygulanmış
- [ ] Performans optimizasyonu yapılmış
- [ ] Güvenlik standartlarına uygun
- [ ] Kullanıcı deneyimi iyi

---

## 📅 Günlük Hedefler

| Gün | Tarih | Aşama | Hedef | Toplam İlerleme |
|-----|-------|-------|-------|-----------------|
| 1 | 18 Tem | Steam API | Altyapı ✅ | %45 |
| 2 | 19 Tem | Steam API | Tamamlama | %50 |
| 3 | 20 Tem | Riot API | Entegrasyon | %60 |
| 4 | 21 Tem | Discord RPC | Entegrasyon | %70 |
| 5 | 22 Tem | UI/UX | Tema | %80 |
| 6 | 23 Tem | Test | Optimizasyon | %90 |
| 7 | 24 Tem | Yayına Alma | İlk Sürüm | %100 |

---

**Planlayan:** gStat Agent
**Plan Tarihi:** 17 Temmuz 2026
**Hedef Sürüm:** v1.0.0
**Hedef Tarih:** 24 Temmuz 2026
**Toplam Kalan:** 7 gün, ~100 saat
