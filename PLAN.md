# gStat Geliştirme Planı

## 📅 Proje Bilgileri
- **Proje Adı:** gStat
- **Başlangıç Tarihi:** 17 Temmuz 2026
- **Hedef Tamamlama:** Ağustos 2026
- **Versiyon:** 0.1.0

---

## 🎯 Genel Amaç

Minecraft, Steam, Riot ve Discord entegrasyonlu, yüksek performanslı, gece dostu arayüzlü oyun istatistik takip uygulaması geliştirmek.

---

## 📊 Aşamalar

### Aşama 1: Temel İskelet ve Altyapı ✅
**Süre:** 1 gün  
**Durum:** Tamamlandı

#### Görevler
- [x] Proje yapısı oluşturuldu
- [x] Cargo.toml yapılandırıldı
- [x] package.json hazırlandı
- [x] SQLite veritabanı modülü yazıldı
- [x] Tauri giriş noktası oluşturuldu
- [x] Frontend temelleri atıldı
- [x] README.md yazıldı
- [x] Günlük raporlama sistemi kuruldu

#### Teslimler
- `src-tauri/src/db.rs` - Veritabanı modülü
- `src-tauri/src/main.rs` - Tauri entry
- `src/App.tsx` - Ana bileşen
- `src/main.tsx` - React entry

---

### Aşama 2: Evrensel Süre İzleyici 🔄
**Süre:** 2-3 gün  
**Durum:** Devam Ediyor

#### Görevler
- [ ] `sysinfo` ile çalışan süreçleri tarama
- [ ] Oyun algılama mantığı
- [ ] Süre sayacı mekanizması
- [ ] Arka planda çalışma (daemon modu)
- [ ] Veritabanına otomatik yazma

#### Teknik Detaylar
```rust
// Process Watcher akışı
1. Her 5 saniyede bir süreci tara
2. Çalışan .exe dosyalarını kontrol et
3. Oyun listesindeki process adlarıyla eşleştir
4. Süreyi hesapla ve DB'ye yaz
```

#### Teslimler
- `src-tauri/src/process_watcher.rs` - Süreç izleyici
- `src-tauri/src/game_detector.rs` - Oyun algılama

---

### Aşama 3: Minecraft Entegrasyonu ⏳
**Süre:** 2-3 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] `javaw.exe` process tarama
- [ ] Argüman analizi (mod loader tespiti)
- [ ] Fabric, Forge, Quilt tespiti
- [ ] Versiyon bilgisi çıkarma
- [ ] Minecraft-specific süre takibi

#### Teknik Detaylar
```rust
// Argüman tarama örnekleri
--fabric → Fabric
--forge → Forge
--quilt → Quilt
-Dminecraft.jar= → Mod paketi
```

#### Teslimler
- `src-tauri/src/minecraft.rs` - Minecraft modülü

---

### Aşama 4: Steam API Entegrasyonu ⏳
**Süre:** 3-4 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] Steam API key yönetimi
- [ ] Oyun kütüphanesi çekme
- [ ] Çalışan Steam oyunlarını algılama
- [ ] Oyun sürelerini senkronize etme
- [ ] Achievement takibi (opsiyonel)

#### Teslimler
- `src-tauri/src/steam.rs` - Steam modülü

---

### Aşama 5: Riot API Entegrasyonu ⏳
**Süre:** 2-3 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] Riot API key yönetimi
- [ ] Valorant istatistikleri
- [ ] League of Legends istatistikleri
- [ ] Maç geçmişi çekme
- [ ] KDA, win rate hesaplama

#### Teslimler
- `src-tauri/src/riot.rs` - Riot modülü

---

### Aşama 6: Discord RPC ⏳
**Süre:** 1-2 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] Discord Rich Presence kurulumu
- [ ] Aktif oyun bilgisi paylaşma
- [ ] Özel durum mesajları
- [ ] Süre gösterimi

#### Teslimler
- `src-tauri/src/discord.rs` - Discord RPC modülü

---

### Aşama 7: UI/UX İyileştirmeleri ⏳
**Süre:** 3-4 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] Sukuna teması detaylandırma
- [ ] Animasyonlar ekleme
- [ ] Grafik istatistikler (Chart.js)
- [ ] Karanlık/Aydınlık mod
- [ ] Responsive tasarım iyileştirmesi
- [ ] Tooltips ve bildirimler

#### Teslimler
- Güncellenmiş `App.tsx`
- Yeni bileşenler

---

### Aşama 8: Test ve Optimizasyon ⏳
**Süre:** 2-3 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] Unit test yazımı
- [ ] Entegrasyon testleri
- [ ] Performans testleri
- [ ] Bellek kullanımı optimizasyonu
- [ ] Hata ayıklama ve düzeltmeler

#### Teslimler
- Test dosyaları
- Performans raporu

---

### Aşama 9: Yayına Alma ⏳
**Süre:** 1 gün  
**Durum:** Bekliyor

#### Görevler
- [ ] Production build oluşturma
- [ ] Installer paketi hazırlama
- [ ] README güncelleme
- [ ] GitHub Release oluşturma
- [ ] Dokümantasyon tamamlama

#### Teslimler
- `.exe` / `.AppImage` / `.dmg` dosyaları
- GitHub Release

---

## 📈 İlerleme Grafiği

```
Aşama 1: ████████████████████ 100%
Aşama 2: ████░░░░░░░░░░░░░░░░  20%
Aşama 3: ░░░░░░░░░░░░░░░░░░░░   0%
Aşama 4: ░░░░░░░░░░░░░░░░░░░░   0%
Aşama 5: ░░░░░░░░░░░░░░░░░░░░   0%
Aşama 6: ░░░░░░░░░░░░░░░░░░░░   0%
Aşama 7: ░░░░░░░░░░░░░░░░░░░░   0%
Aşama 8: ░░░░░░░░░░░░░░░░░░░░   0%
Aşama 9: ░░░░░░░░░░░░░░░░░░░░   0%
```

**Genel İlerleme:** %12

---

## 🔧 Teknik Gereksinimler

### Backend (Rust)
- Tauri 2.0
- rusqlite (SQLite)
- sysinfo (süreç takibi)
- reqwest (HTTP istemcisi)
- serde (serializasyon)
- tokio (async runtime)

### Frontend (React)
- React 18
- TypeScript 5.5
- Tailwind CSS 3.4
- i18next (çoklu dil)
- Vite 5

### Sistem Gereksinimleri (Linux)
- webkit2gtk-4.1
- base-devel
- openssl
- libappindicator-gtk3

---

## 📝 Notlar

### Önemli Tarihler
- **17 Temmuz 2026:** Proje başladı
- **Ağustos 2026:** İlk yayın hedefi

### Riskler
1. API limitleri (Steam, Riot)
2. Çapraz platform uyumluluğu
3. Bellek optimizasyonu

### Öncelikler
1. Temel süre takibi (MVP)
2. Steam entegrasyonu
3. Discord RPC
4. UI/UX iyileştirmeleri

---

## 🔄 Güncelleme Geçmişi

| Tarih | Güncelleme |
|-------|------------|
| 17.07.2026 | Plan oluşturuldu, Aşama 1 tamamlandı |

---

**Son Güncelleme:** 17 Temmuz 2026
**Güncelleyen:** gStat Agent
