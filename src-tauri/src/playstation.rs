use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use reqwest::Client;

// ============ API Yanıt Modelleri ============

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayStationKullanici {
    pub online_id: String,
    pub account_id: Option<String>,
    pub avatar_url: Option<String>,
    pub plus: Option<bool>,
    pub about_me: Option<String>,
    pub languages_used: Option<Vec<String>>,
    pub trophy_level: Option<u32>,
    pub trophy_points: Option<u32>,
    pub earned_trophies: Option<PlayStationTrophySayisi>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayStationTrophySayisi {
    pub platinum: u32,
    pub gold: u32,
    pub silver: u32,
    pub bronze: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayStationOyun {
    pub np_title_id: String,
    pub trophy_title_name: String,
    pub trophy_title_icon_url: Option<String>,
    pub trophy_title_platform: Option<String>,
    pub trophy_set_synced_time: Option<String>,
    pub earned_trophies: Option<PlayStationTrophySayisi>,
    pub trophy_level: Option<u32>,
    pub hidden_trophy_count: Option<u32>,
    pub progress: Option<u32>,
    pub last_played_time: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayStationTrophyDetay {
    pub trophy_id: u32,
    pub trophy_name: String,
    pub trophy_description: Option<String>,
    pub trophy_type: String,
    pub trophy_grade: Option<String>,
    pub trophy_icon_url: Option<String>,
    pub trophy_rarity: Option<PlayStationNadirlik>,
    pub progress: Option<u32>,
    pub achieved: bool,
    pub earned_date: Option<String>,
    #[serde(default)]
    pub hidden: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayStationNadirlik {
    pub rarity_value: Option<f64>,
    pub rarity_label: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayStationKutuphane {
    pub oyunlar: Vec<PlayStationOyun>,
    pub toplam_oyun: u32,
    pub toplam_trophy: u32,
    pub toplam_platinum: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlayStationIstatistikleri {
    pub toplam_oyun: u32,
    pub toplam_trophy: u32,
    pub trophy_level: u32,
    pub trophy_points: u32,
    pub platinum_sayisi: u32,
    pub gold_sayisi: u32,
    pub silver_sayisi: u32,
    pub bronze_sayisi: u32,
    pub en_cok_oynanan: Option<PlayStationOyun>,
    pub son_oynananlar: Vec<PlayStationOyun>,
    pub kategoriler: HashMap<String, u32>,
    pub trophy_orani: f64,
}

// ============ Hata Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PlayStationHata {
    KimlikDogrulanamadi(String),
    KullaniciBulunamadi(String),
    APIHatasi(String),
    AgHatasi(String),
    ParseHatasi(String),
    PSNArtikErisilmez(String),
}

impl std::fmt::Display for PlayStationHata {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            PlayStationHata::KimlikDogrulanamadi(e) => write!(f, "Kimlik doğrulanamadı: {}", e),
            PlayStationHata::KullaniciBulunamadi(id) => write!(f, "Kullanıcı bulunamadı: {}", id),
            PlayStationHata::APIHatasi(e) => write!(f, "API hatası: {}", e),
            PlayStationHata::AgHatasi(e) => write!(f, "Ağ hatası: {}", e),
            PlayStationHata::ParseHatasi(e) => write!(f, "Parse hatası: {}", e),
            PlayStationHata::PSNArtikErisilmez(e) => write!(f, "PSN artık erişilemez: {}", e),
        }
    }
}

// ============ PlayStation İstemcisi ============

#[derive(Clone)]
pub struct PlayStationClient {
    http_client: Client,
    access_token: Option<String>,
    npsso: Option<String>,
}

impl PlayStationClient {
    pub fn yeni() -> Self {
        let http_client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .expect("HTTP istemcisi oluşturulamadı");

        PlayStationClient {
            http_client,
            access_token: None,
            npsso: None,
        }
    }

    pub fn token_ayarla(&mut self, access_token: String, npsso: String) {
        self.access_token = Some(access_token);
        self.npsso = Some(npsso);
    }

    // API isteği yardımcı fonksiyonu
    async fn api_istegi<T: serde::de::DeserializeOwned>(&self, url: &str) -> Result<T, PlayStationHata> {
        let mut request = self.http_client.get(url);

        if let Some(token) = &self.access_token {
            request = request.header("Authorization", format!("Bearer {}", token));
        }

        let response = request
            .send()
            .await
            .map_err(|e| PlayStationHata::AgHatasi(e.to_string()))?;

        response.json::<T>()
            .await
            .map_err(|e| PlayStationHata::ParseHatasi(e.to_string()))
    }

    // ============ Kullanıcı İşlemleri ============

    /// PlayStation kullanıcı bilgilerini çeker
    pub async fn kullanici_bilgileri(&self, online_id: &str) -> Result<PlayStationKullanici, PlayStationHata> {
        let url = format!(
            "https://us-np.profile.playstation.com/network/user/lookup/v3/users?onlineIds={}",
            online_id
        );
        self.api_istegi(&url).await
    }

    // ============ Trophy İşlemleri ============

    /// PlayStation kütüphanesini (trophy listesi) çeker
    pub async fn kutuphane_cek(&self, account_id: &str) -> Result<Vec<PlayStationOyun>, PlayStationHata> {
        let url = format!(
            "https://us-np.profile.playstation.com/network/user/lookup/v3/users/{}/trophySummary",
            account_id
        );

        #[derive(Deserialize)]
        struct Response {
            trophy_summary_list: Option<Vec<PlayStationOyun>>,
        }

        let response: Response = self.api_istegi(&url).await?;
        Ok(response.trophy_summary_list.unwrap_or_default())
    }

    /// Belirli bir oyunun trophy detaylarını çeker
    pub async fn trophy_detaylari(&self, account_id: &str, np_title_id: &str) -> Result<Vec<PlayStationTrophyDetay>, PlayStationHata> {
        let url = format!(
            "https://us-np.profile.playstation.com/network/user/lookup/v3/users/{}/trophyDetail/{}",
            account_id, np_title_id
        );

        #[derive(Deserialize)]
        struct Response {
            trophy_detail_list: Option<Vec<PlayStationTrophyDetay>>,
        }

        let response: Response = self.api_istegi(&url).await?;
        Ok(response.trophy_detail_list.unwrap_or_default())
    }

    // ============ İstatistikler ============

    /// PlayStation istatistiklerini hesaplar
    pub async fn istatistikler_hesapla(&self, account_id: &str) -> Result<PlayStationIstatistikleri, PlayStationHata> {
        let oyunlar = self.kutuphane_cek(account_id).await?;

        let toplam_oyun = oyunlar.len() as u32;
        let toplam_platinum: u32 = oyunlar.iter()
            .filter_map(|o| o.earned_trophies.as_ref().map(|t| t.platinum))
            .sum();
        let toplam_gold: u32 = oyunlar.iter()
            .filter_map(|o| o.earned_trophies.as_ref().map(|t| t.gold))
            .sum();
        let toplam_silver: u32 = oyunlar.iter()
            .filter_map(|o| o.earned_trophies.as_ref().map(|t| t.silver))
            .sum();
        let toplam_bronze: u32 = oyunlar.iter()
            .filter_map(|o| o.earned_trophies.as_ref().map(|t| t.bronze))
            .sum();
        let toplam_trophy = toplam_platinum + toplam_gold + toplam_silver + toplam_bronze;

        // En çok oynanan oyunu bul
        let en_cok_oynanan = oyunlar.iter()
            .max_by(|a, b| {
                let a_trophy = a.earned_trophies.as_ref().map(|t| t.platinum + t.gold + t.silver + t.bronze).unwrap_or(0);
                let b_trophy = b.earned_trophies.as_ref().map(|t| t.platinum + t.gold + t.silver + t.bronze).unwrap_or(0);
                a_trophy.cmp(&b_trophy)
            })
            .cloned();

        // Kategorilere göre say
        let mut kategoriler: HashMap<String, u32> = HashMap::new();
        for oyun in &oyunlar {
            if let Some(platform) = &oyun.trophy_title_platform {
                *kategoriler.entry(platform.clone()).or_insert(0) += 1;
            }
        }

        // Trophy level ve points hesapla
        let trophy_level = oyunlar.iter()
            .filter_map(|o| o.trophy_level)
            .max()
            .unwrap_or(0);
        let trophy_points = toplam_platinum * 180 + toplam_gold * 90 + toplam_silver * 30 + toplam_bronze * 10;

        // Trophy oranı
        let trophy_orani = if toplam_oyun > 0 {
            (toplam_platinum as f64 / toplam_oyun as f64) * 100.0
        } else {
            0.0
        };

        Ok(PlayStationIstatistikleri {
            toplam_oyun,
            toplam_trophy,
            trophy_level,
            trophy_points,
            platinum_sayisi: toplam_platinum,
            gold_sayisi: toplam_gold,
            silver_sayisi: toplam_silver,
            bronze_sayisi: toplam_bronze,
            en_cok_oynanan,
            son_oynananlar: oyunlar.into_iter().take(10).collect(),
            kategoriler,
            trophy_orani,
        })
    }
}

// ============ PlayStation Süre İzleyici ============

pub struct PlayStationSureIzleyici {
    client: Arc<PlayStationClient>,
    aktif_oyunlar: Arc<Mutex<HashMap<String, PlayStationAktifOyun>>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct PlayStationAktifOyun {
    pub np_title_id: String,
    pub oyun_adi: String,
    #[serde(skip)]
    pub baslama_zamani: std::time::Instant,
    pub suresi: u64,
}

impl PlayStationSureIzleyici {
    pub fn yeni(client: Arc<PlayStationClient>) -> Self {
        PlayStationSureIzleyici {
            client,
            aktif_oyunlar: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn aktif_oyunlari_al(&self) -> Vec<PlayStationAktifOyun> {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.values().cloned().collect()
    }
}
