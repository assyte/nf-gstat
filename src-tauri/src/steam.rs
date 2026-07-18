use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use reqwest::Client;
use tokio::sync::mpsc;

// ============ API Yanıt Modelleri ============

#[derive(Debug, Serialize, Deserialize)]
pub struct SteamApiResponse<T> {
    pub response: T,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayerSummaryResponse {
    pub players: Vec<SteamKullanici>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OwnedGamesResponse {
    pub game_count: Option<u32>,
    pub games: Option<Vec<SteamOyun>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecentlyPlayedResponse {
    pub total_count: Option<u32>,
    pub games: Option<Vec<SteamOyun>>,
}

// ============ Veri Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SteamKullanici {
    pub steam_id: String,
    pub kullanici_adi: String,
    pub tam_ad: Option<String>,
    pub avatar_url: Option<String>,
    pub avatar_medium: Option<String>,
    pub avatar_mini: Option<String>,
    pub profil_url: Option<String>,
    pub online_state: Option<String>,
    pub state_message: Option<String>,
    pub profile_state: Option<u32>,
    pub last_logoff: Option<u64>,
    pub time_created: Option<u64>,
    pub country_code: Option<String>,
    pub primary_clan_id: Option<String>,
    pub persona_state: Option<u32>,
    pub comment_permission: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SteamOyun {
    pub app_id: u32,
    pub ad: String,
    pub resim_url: Option<String>,
    pub resim_hash: Option<String>,
    pub oyun_boyutu: Option<u64>,
    pub oyun_suresi_dakika: Option<f64>,
    pub oyun_suresi_2hafta: Option<f64>,
    pub son_oynama: Option<u64>,
    pub platformlar: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SteamIstatistikleri {
    pub toplam_oyun: u32,
    pub toplam_sure_dakika: f64,
    pub en_cok_oynanan: Option<SteamOyun>,
    pub son_oynananlar: Vec<SteamOyun>,
    pub kategoriler: HashMap<String, u32>,
}

// ============ Hata Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SteamHata {
    ApiKeyGecersiz,
    KullaniciBulunamadi(String),
    ProfilGizli(String),
    RateLimited,
    AgHatasi(String),
    ParseHatasi(String),
    Baska(String),
}

impl std::fmt::Display for SteamHata {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            SteamHata::ApiKeyGecersiz => write!(f, "Steam API key geçersiz"),
            SteamHata::KullaniciBulunamadi(id) => write!(f, "Kullanıcı bulunamadı: {}", id),
            SteamHata::ProfilGizli(id) => write!(f, "Profil gizli: {}", id),
            SteamHata::RateLimited => write!(f, "Rate limit aşıldı, lütfen bekleyin"),
            SteamHata::AgHatasi(e) => write!(f, "Ağ hatası: {}", e),
            SteamHata::ParseHatasi(e) => write!(f, "Parse hatası: {}", e),
            SteamHata::Baska(e) => write!(f, "Hata: {}", e),
        }
    }
}

// ============ Rate Limiter ============

pub struct RateLimiter {
    istek_sayisi: u32,
    son_istek_zamani: Instant,
    max_istek: u32,
    sure_araligi: Duration,
}

impl RateLimiter {
    pub fn yeni() -> Self {
        RateLimiter {
            istek_sayisi: 0,
            son_istek_zamani: Instant::now(),
            max_istek: 10,
            sure_araligi: Duration::from_secs(1),
        }
    }

    pub fn bekle(&mut self) {
        let gecen = self.son_istek_zamani.elapsed();

        if self.istek_sayisi >= self.max_istek {
            if gecen < self.sure_araligi {
                let bekleme = self.sure_araligi - gecen;
                std::thread::sleep(bekleme);
            }
            self.istek_sayisi = 0;
            self.son_istek_zamani = Instant::now();
        }
    }

    pub fn istek_yapildi(&mut self) {
        self.istek_sayisi += 1;
    }
}

// ============ Steam İstemcisi ============

#[derive(Clone)]
pub struct SteamClient {
    api_key: String,
    http_client: Client,
    rate_limiter: Arc<Mutex<RateLimiter>>,
    baz_url: String,
}

impl SteamClient {
    pub fn yeni(api_key: String) -> Self {
        let http_client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("HTTP istemcisi oluşturulamadı");

        SteamClient {
            api_key,
            http_client,
            rate_limiter: Arc::new(Mutex::new(RateLimiter::yeni())),
            baz_url: "https://api.steampowered.com".to_string(),
        }
    }

    // API isteği yardımcı fonksiyonu
    async fn api_istegi<T: serde::de::DeserializeOwned>(&self, endpoint: &str, params: &[(&str, &str)]) -> Result<T, SteamHata> {
        // Rate limiting
        {
            let mut limiter = self.rate_limiter.lock().unwrap();
            limiter.bekle();
        }

        let url = format!("{}/{}", self.baz_url, endpoint);

        let mut query_params: Vec<(&str, &str)> = params.to_vec();
        query_params.push(("key", &self.api_key));
        let format_val = "json".to_string();
        query_params.push(("format", &format_val));

        let response = self.http_client
            .get(&url)
            .query(&query_params)
            .send()
            .await
            .map_err(|e| SteamHata::AgHatasi(e.to_string()))?;

        // Rate limiter güncelle
        {
            let mut limiter = self.rate_limiter.lock().unwrap();
            limiter.istek_yapildi();
        }

        // 429 hatası kontrolü
        if response.status().as_u16() == 429 {
            return Err(SteamHata::RateLimited);
        }

        response.json::<T>()
            .await
            .map_err(|e| SteamHata::ParseHatasi(e.to_string()))
    }

    // ============ Kullanıcı İşlemleri ============

    /// Kullanıcı özet bilgilerini çeker
    pub async fn kullanici_ozeti(&self, steam_id: &str) -> Result<SteamKullanici, SteamHata> {
        #[derive(Deserialize)]
        struct Response {
            players: Vec<SteamKullanici>,
        }

        let response: SteamApiResponse<Response> = self.api_istegi(
            "ISteamUser/GetPlayerSummaries/v2/",
            &[("steamids", steam_id)],
        ).await?;

        response.response.players
            .into_iter()
            .next()
            .ok_or_else(|| SteamHata::KullaniciBulunamadi(steam_id.to_string()))
    }

    /// Kullanıcının sahip olduğu oyunları çeker
    pub async fn oyun_kutuphanesi(&self, steam_id: &str) -> Result<Vec<SteamOyun>, SteamHata> {
        #[derive(Deserialize)]
        struct Response {
            game_count: Option<u32>,
            games: Option<Vec<SteamOyun>>,
        }

        let response: SteamApiResponse<Response> = self.api_istegi(
            "IPlayerService/GetOwnedGames/v1/",
            &[
                ("steamid", steam_id),
                ("include_appinfo", "1"),
                ("include_played_free_games", "1"),
            ],
        ).await?;

        Ok(response.response.games.unwrap_or_default())
    }

    /// Son oynanan oyunları çeker
    pub async fn son_oynananlar(&self, steam_id: &str, sayi: u32) -> Result<Vec<SteamOyun>, SteamHata> {
        #[derive(Deserialize)]
        struct Response {
            total_count: Option<u32>,
            games: Option<Vec<SteamOyun>>,
        }

        let sayi_str = sayi.to_string();
        let response: SteamApiResponse<Response> = self.api_istegi(
            "IPlayerService/GetRecentlyPlayedGames/v1/",
            &[
                ("steamid", steam_id),
                ("count", &sayi_str),
            ],
        ).await?;

        Ok(response.response.games.unwrap_or_default())
    }

    // ============ İstatistikler ============

    /// Kullanıcının Steam istatistiklerini hesaplar
    pub async fn istatistikler_hesapla(&self, steam_id: &str) -> Result<SteamIstatistikleri, SteamHata> {
        let oyunlar = self.oyun_kutuphanesi(steam_id).await?;
        let son_oynananlar = self.son_oynananlar(steam_id, 10).await?;

        let toplam_oyun = oyunlar.len() as u32;
        let toplam_sure: f64 = oyunlar.iter()
            .filter_map(|o| o.oyun_suresi_dakika)
            .sum();

        // En çok oynanan oyunu bul
        let en_cok_oynanan = oyunlar.iter()
            .max_by(|a, b| {
                let sure_a = a.oyun_suresi_dakika.unwrap_or(0.0);
                let sure_b = b.oyun_suresi_dakika.unwrap_or(0.0);
                sure_a.partial_cmp(&sure_b).unwrap_or(std::cmp::Ordering::Equal)
            })
            .cloned();

        // Kategorilere göre say
        let mut kategoriler: HashMap<String, u32> = HashMap::new();
        for oyun in &oyunlar {
            if let Some(platformlar) = &oyun.platformlar {
                for platform in platformlar {
                    *kategoriler.entry(platform.clone()).or_insert(0) += 1;
                }
            }
        }

        Ok(SteamIstatistikleri {
            toplam_oyun,
            toplam_sure_dakika: toplam_sure,
            en_cok_oynanan,
            son_oynananlar,
            kategoriler,
        })
    }

    // ============ Yardımcı Fonksiyonlar ============

    /// Steam ID'nin geçerliliğini kontrol eder
    pub fn steam_id_gecerli_mi(steam_id: &str) -> bool {
        // Basit format kontrolü (17 haneli sayı)
        steam_id.len() == 17 && steam_id.chars().all(|c| c.is_ascii_digit())
    }

    /// Steam ID'den vanity URL'i çözer
    pub async fn vanity_url_coz(&self, vanity_name: &str) -> Result<String, SteamHata> {
        #[derive(Deserialize)]
        struct Response {
            steamid: Option<String>,
            success: Option<u32>,
        }

        let response: SteamApiResponse<Response> = self.api_istegi(
            "ISteamUser/ResolveVanityURL/v1/",
            &[("vanityurl", vanity_name)],
        ).await?;

        if response.response.success == Some(1) {
            response.response.steamid
                .ok_or_else(|| SteamHata::KullaniciBulunamadi(vanity_name.to_string()))
        } else {
            Err(SteamHata::KullaniciBulunamadi(vanity_name.to_string()))
        }
    }
}

// ============ Steam Süre İzleyici ============

pub struct SteamSureIzleyici {
    client: Arc<SteamClient>,
    aktif_oyunlar: Arc<Mutex<HashMap<u32, SteamAktifOyun>>>,
    tx: Option<mpsc::UnboundedSender<SteamEvent>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct SteamAktifOyun {
    pub app_id: u32,
    pub oyun_adi: String,
    #[serde(skip)]
    pub baslama_zamani: Instant,
    pub suresi: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SteamEvent {
    OyunBasladi(u32, String),
    OyunBitti(u32, String, u64),
    SureGuncellendi(u32, u64),
}

impl SteamSureIzleyici {
    pub fn yeni(client: Arc<SteamClient>) -> Self {
        SteamSureIzleyici {
            client,
            aktif_oyunlar: Arc::new(Mutex::new(HashMap::new())),
            tx: None,
        }
    }

    pub fn event_kanali_olustur(&mut self) -> mpsc::UnboundedReceiver<SteamEvent> {
        let (tx, rx) = mpsc::unbounded_channel();
        self.tx = Some(tx);
        rx
    }

    pub fn aktif_oyunlari_al(&self) -> Vec<SteamAktifOyun> {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.values().cloned().collect()
    }
}
