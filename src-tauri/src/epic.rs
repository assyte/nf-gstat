use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use reqwest::Client;

// ============ API Yanıt Modelleri ============

#[derive(Debug, Serialize, Deserialize)]
pub struct EpicGamesKullanici {
    pub account_id: String,
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub avatar_url: Option<String>,
    pub platform: Option<String>,
    pub created: Option<String>,
    pub last_login: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpicGamesOyun {
    pub catalog_namespace: String,
    pub catalog_item_id: String,
    pub app_name: String,
    pub app_title: String,
    pub app_version: Option<String>,
    pub install_size: Option<u64>,
    pub install_path: Option<String>,
    pub is_installed: bool,
    pub launch_options: Option<String>,
    pub last_played: Option<String>,
    pub total_time_played: Option<u64>,
    pub dlc_install_status: Option<Vec<EpicDLC>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpicDLC {
    pub catalog_item_id: String,
    pub app_name: String,
    pub app_title: String,
    pub is_installed: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpicGamesKutuphane {
    pub oyunlar: Vec<EpicGamesOyun>,
    pub toplam_oyun: u32,
    pub toplam_sure: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EpicGamesIstatistikleri {
    pub toplam_oyun: u32,
    pub yuklu_oyun: u32,
    pub toplam_sure_dakika: u64,
    pub en_cok_oynanan: Option<EpicGamesOyun>,
    pub son_oynananlar: Vec<EpicGamesOyun>,
    pub kategoriler: HashMap<String, u32>,
}

// ============ Hata Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EpicHata {
    KimlikDogrulanamadi,
    KullaniciBulunamadi(String),
    APIHatasi(String),
    AgHatasi(String),
    ParseHatasi(String),
    LisansGerekli(String),
}

impl std::fmt::Display for EpicHata {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            EpicHata::KimlikDogrulanamadi => write!(f, "Kimlik doğrulanamadı"),
            EpicHata::KullaniciBulunamadi(id) => write!(f, "Kullanıcı bulunamadı: {}", id),
            EpicHata::APIHatasi(e) => write!(f, "API hatası: {}", e),
            EpicHata::AgHatasi(e) => write!(f, "Ağ hatası: {}", e),
            EpicHata::ParseHatasi(e) => write!(f, "Parse hatası: {}", e),
            EpicHata::LisansGerekli(oyun) => write!(f, "Lisans gerekli: {}", oyun),
        }
    }
}

// ============ Epic Games İstemcisi ============

#[derive(Clone)]
pub struct EpicGamesClient {
    http_client: Client,
    access_token: Option<String>,
    baz_url: String,
}

impl EpicGamesClient {
    pub fn yeni() -> Self {
        let http_client = Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .expect("HTTP istemcisi oluşturulamadı");

        EpicGamesClient {
            http_client,
            access_token: None,
            baz_url: "https://account-public-service-prod03.ol.epicgames.com".to_string(),
        }
    }

    pub fn token_ayarla(&mut self, token: String) {
        self.access_token = Some(token);
    }

    // API isteği yardımcı fonksiyonu
    async fn api_istegi<T: serde::de::DeserializeOwned>(&self, endpoint: &str) -> Result<T, EpicHata> {
        let url = format!("{}/{}", self.baz_url, endpoint);

        let mut request = self.http_client.get(&url);

        if let Some(token) = &self.access_token {
            request = request.header("Authorization", format!("Bearer {}", token));
        }

        let response = request
            .send()
            .await
            .map_err(|e| EpicHata::AgHatasi(e.to_string()))?;

        response.json::<T>()
            .await
            .map_err(|e| EpicHata::ParseHatasi(e.to_string()))
    }

    // ============ Kullanıcı İşlemleri ============

    /// Epic Games kullanıcı bilgilerini çeker
    pub async fn kullanici_bilgileri(&self) -> Result<EpicGamesKullanici, EpicHata> {
        self.api_istegi("account/api/public/account").await
    }

    // ============ Oyun İşlemleri ============

    /// Epic Games kütüphanesini çeker (Yerel dosya taraması ile)
    pub async fn kutuphane_cek(&self) -> Result<Vec<EpicGamesOyun>, EpicHata> {
        // Epic Games launcher data dosyasını oku
        let mut oyunlar = Vec::new();

        // Windows için Epic Games manifest konumu
        let manifest_konum = if cfg!(target_os = "windows") {
            std::env::var("LOCALAPPDATA")
                .ok()
                .map(|d| std::path::PathBuf::from(d).join("Epic GamesLauncher").join("Saved").join("Data").join("Manifests"))
        } else {
            None
        };

        if let Some(path) = manifest_konum {
            if let Ok(entries) = std::fs::read_dir(&path) {
                for entry in entries.flatten() {
                    if let Ok(icerik) = std::fs::read_to_string(entry.path()) {
                        if let Ok(manifest) = serde_json::from_str::<EpicManifest>(&icerik) {
                            oyunlar.push(EpicGamesOyun {
                                catalog_namespace: manifest.catalog_namespace,
                                catalog_item_id: manifest.catalog_item_id,
                                app_name: manifest.app_name,
                                app_title: manifest.app_title,
                                app_version: manifest.app_version,
                                install_size: Some(manifest.install_size),
                                install_path: Some(manifest.install_location),
                                is_installed: manifest.is_installed,
                                launch_options: manifest.launch_options,
                                last_played: None,
                                total_time_played: None,
                                dlc_install_status: None,
                            });
                        }
                    }
                }
            }
        }

        Ok(oyunlar)
    }

    // ============ Yardımcı Fonksiyonlar ============

    /// Epic Games manifest yapısı
    pub fn manifest_konumu_bul() -> Option<std::path::PathBuf> {
        std::env::var("LOCALAPPDATA")
            .ok()
            .map(|d| {
                std::path::PathBuf::from(d)
                    .join("Epic GamesLauncher")
                    .join("Saved")
                    .join("Data")
                    .join("Manifests")
            })
    }
}

// Epic Games Manifest Yapısı
#[derive(Debug, Deserialize)]
struct EpicManifest {
    #[serde(rename = "CatalogNamespace")]
    catalog_namespace: String,
    #[serde(rename = "CatalogItemId")]
    catalog_item_id: String,
    #[serde(rename = "AppName")]
    app_name: String,
    #[serde(rename = "AppTitle")]
    app_title: String,
    #[serde(rename = "AppVersionString")]
    app_version: Option<String>,
    #[serde(rename = "InstallSize")]
    install_size: u64,
    #[serde(rename = "InstallLocation")]
    install_location: String,
    #[serde(rename = "IsInstalled")]
    is_installed: bool,
    #[serde(rename = "LaunchOptions")]
    launch_options: Option<String>,
}

// ============ Epic Games Süre İzleyici ============

pub struct EpicSureIzleyici {
    client: Arc<EpicGamesClient>,
    aktif_oyunlar: Arc<Mutex<HashMap<String, EpicAktifOyun>>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct EpicAktifOyun {
    pub app_name: String,
    pub app_title: String,
    #[serde(skip)]
    pub baslama_zamani: std::time::Instant,
    pub suresi: u64,
}

impl EpicSureIzleyici {
    pub fn yeni(client: Arc<EpicGamesClient>) -> Self {
        EpicSureIzleyici {
            client,
            aktif_oyunlar: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn aktif_oyunlari_al(&self) -> Vec<EpicAktifOyun> {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.values().cloned().collect()
    }
}
