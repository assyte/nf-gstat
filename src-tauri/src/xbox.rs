use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use reqwest::Client;

// ============ API Yanıt Modelleri ============

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxKullanici {
    pub xuid: String,
    pub kullanici_adi: String,
    pub tam_ad: Option<String>,
    pub avatar_url: Option<String>,
    pub gamerscore: Option<String>,
    pub gamership: Option<String>,
    pub bio: Option<String>,
    pub avatar: Option<String>,
    pub profil_turu: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XboxOyun {
    pub title_id: Option<String>,
    pub pfn: Option<String>,
    pub last_unlock: Option<String>,
    pub name: String,
    pub title_type: Option<String>,
    pub platform: Option<String>,
    pub achievement: Option<XboxBasari>,
    pub progress: Option<XboxIlerleme>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XboxBasari {
    pub current_achievements: u32,
    pub total_achievements: u32,
    pub current_gamescore: u32,
    pub total_gamescore: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxBasariYaniti {
    pub achievement_summary: Option<XboxBasariOzeti>,
    pub achievements: Option<Vec<XboxBasariDetay>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxBasariOzeti {
    pub current_achievements: u32,
    pub total_achievements: u32,
    pub current_gamescore: u32,
    pub total_gamescore: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxBasariDetay {
    pub name: String,
    pub title_partitions: Option<Vec<String>>,
    pub progress_state: Option<String>,
    pub progression: Option<XboxIlerleme>,
    pub rarity: Option<XboxNadirlik>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XboxIlerleme {
    pub time_unlocked: Option<String>,
    pub requirements: Option<Vec<XboxGereksinim>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XboxGereksinim {
    pub id: String,
    pub current: Option<u32>,
    pub target: Option<u32>,
    #[serde(rename = "type")]
    pub tip: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxNadirlik {
    pub current_category: Option<String>,
    pub current_percentage: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxKutuphane {
    pub oyunlar: Vec<XboxOyun>,
    pub toplam_oyun: u32,
    pub toplam_gamerscore: u32,
    pub toplam_basari: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XboxIstatistikleri {
    pub toplam_oyun: u32,
    pub toplam_gamerscore: u32,
    pub toplam_basari: u32,
    pub basari_orani: f64,
    pub en_cok_oynanan: Option<XboxOyun>,
    pub son_oynananlar: Vec<XboxOyun>,
    pub kategoriler: HashMap<String, u32>,
    pub nadir_basari_sayisi: u32,
}

// ============ Hata Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum XboxHata {
    KimlikDogrulanamadi(String),
    KullaniciBulunamadi(String),
    APIHatasi(String),
    AgHatasi(String),
    ParseHatasi(String),
    YetkiYetersiz(String),
}

impl std::fmt::Display for XboxHata {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            XboxHata::KimlikDogrulanamadi(e) => write!(f, "Kimlik doğrulanamadı: {}", e),
            XboxHata::KullaniciBulunamadi(id) => write!(f, "Kullanıcı bulunamadı: {}", id),
            XboxHata::APIHatasi(e) => write!(f, "API hatası: {}", e),
            XboxHata::AgHatasi(e) => write!(f, "Ağ hatası: {}", e),
            XboxHata::ParseHatasi(e) => write!(f, "Parse hatası: {}", e),
            XboxHata::YetkiYetersiz(e) => write!(f, "Yetki yetersiz: {}", e),
        }
    }
}

// ============ Xbox İstemcisi ============

#[derive(Clone)]
pub struct XboxClient {
    http_client: Client,
    access_token: Option<String>,
    user_token: Option<String>,
    xsts_token: Option<String>,
}

impl XboxClient {
    pub fn yeni() -> Self {
        let http_client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .expect("HTTP istemcisi oluşturulamadı");

        XboxClient {
            http_client,
            access_token: None,
            user_token: None,
            xsts_token: None,
        }
    }

    pub fn token_ayarla(&mut self, access_token: String, user_token: String, xsts_token: String) {
        self.access_token = Some(access_token);
        self.user_token = Some(user_token);
        self.xsts_token = Some(xsts_token);
    }

    // API isteği yardımcı fonksiyonu
    async fn api_istegi<T: serde::de::DeserializeOwned>(&self, url: &str) -> Result<T, XboxHata> {
        let mut request = self.http_client.get(url);

        if let Some(token) = &self.xsts_token {
            request = request.header("Authorization", format!("XBL3.0 x={}", token));
        }

        let response = request
            .send()
            .await
            .map_err(|e| XboxHata::AgHatasi(e.to_string()))?;

        response.json::<T>()
            .await
            .map_err(|e| XboxHata::ParseHatasi(e.to_string()))
    }

    // ============ Kullanıcı İşlemleri ============

    /// Xbox kullanıcı bilgilerini çeker
    pub async fn kullanici_bilgileri(&self, xuid: &str) -> Result<XboxKullanici, XboxHata> {
        let url = format!(
            "https://user.xboxlive.com/users/xuid({})/profile",
            xuid
        );
        self.api_istegi(&url).await
    }

    // ============ Oyun İşlemleri ============

    /// Xbox kütüphanesini çeker
    pub async fn kutuphane_cek(&self, xuid: &str) -> Result<Vec<XboxOyun>, XboxHata> {
        let url = format!(
            "https://titlehub.xboxlive.com/users/xuid({})/titles/titlehistory/decoration/Achievement,Image",
            xuid
        );

        #[derive(Deserialize)]
        struct Response {
            titles: Option<Vec<XboxOyun>>,
        }

        let response: Response = self.api_istegi(&url).await?;
        Ok(response.titles.unwrap_or_default())
    }

    // ============ Başarı İşlemleri ============

    /// Xbox başarımlarını çeker
    pub async fn basarimlar_cek(&self, xuid: &str, title_id: &str) -> Result<Vec<XboxBasariDetay>, XboxHata> {
        let url = format!(
            "https://achievements.xboxlive.com/users/xuid({})/achievements?titleId={}",
            xuid, title_id
        );

        #[derive(Deserialize)]
        struct Response {
            achievements: Option<Vec<XboxBasariDetay>>,
        }

        let response: Response = self.api_istegi(&url).await?;
        Ok(response.achievements.unwrap_or_default())
    }

    // ============ İstatistikler ============

    /// Xbox istatistiklerini hesaplar
    pub async fn istatistikler_hesapla(&self, xuid: &str) -> Result<XboxIstatistikleri, XboxHata> {
        let oyunlar = self.kutuphane_cek(xuid).await?;

        let toplam_oyun = oyunlar.len() as u32;
        let toplam_gamerscore: u32 = oyunlar.iter()
            .filter_map(|o| o.achievement.as_ref().map(|a| a.current_gamescore))
            .sum();
        let toplam_basari: u32 = oyunlar.iter()
            .filter_map(|o| o.achievement.as_ref().map(|a| a.current_achievements))
            .sum();

        let basari_orani = if toplam_basari > 0 {
            (toplam_gamerscore as f64 / (toplam_basari as f64 * 100.0)) * 100.0
        } else {
            0.0
        };

        // En çok oynanan oyunu bul
        let en_cok_oynanan = oyunlar.iter()
            .max_by(|a, b| {
                let a_score = a.achievement.as_ref().map(|x| x.current_gamescore).unwrap_or(0);
                let b_score = b.achievement.as_ref().map(|x| x.current_gamescore).unwrap_or(0);
                a_score.cmp(&b_score)
            })
            .cloned();

        // Kategorilere göre say
        let mut kategoriler: HashMap<String, u32> = HashMap::new();
        for oyun in &oyunlar {
            if let Some(platform) = &oyun.platform {
                *kategoriler.entry(platform.clone()).or_insert(0) += 1;
            }
        }

        Ok(XboxIstatistikleri {
            toplam_oyun,
            toplam_gamerscore,
            toplam_basari,
            basari_orani,
            en_cok_oynanan,
            son_oynananlar: oyunlar.into_iter().take(10).collect(),
            kategoriler,
            nadir_basari_sayisi: 0,
        })
    }
}

// ============ Xbox Süre İzleyici ============

pub struct XboxSureIzleyici {
    client: Arc<XboxClient>,
    aktif_oyunlar: Arc<Mutex<HashMap<String, XboxAktifOyun>>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct XboxAktifOyun {
    pub title_id: String,
    pub oyun_adi: String,
    #[serde(skip)]
    pub baslama_zamani: std::time::Instant,
    pub suresi: u64,
}

impl XboxSureIzleyici {
    pub fn yeni(client: Arc<XboxClient>) -> Self {
        XboxSureIzleyici {
            client,
            aktif_oyunlar: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn aktif_oyunlari_al(&self) -> Vec<XboxAktifOyun> {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.values().cloned().collect()
    }
}
