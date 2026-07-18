use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::path::PathBuf;

// ============ Veri Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MicrosoftStoreOyun {
    pub package_full_name: String,
    pub package_family_name: String,
    pub display_name: String,
    pub display_description: Option<String>,
    pub logo_path: Option<String>,
    pub publisher: Option<String>,
    pub version: Option<String>,
    pub install_path: Option<String>,
    pub is_installed: bool,
    pub last_launched: Option<String>,
    pub total_time_played: Option<u64>,
    pub package_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MicrosoftStoreKutuphane {
    pub oyunlar: Vec<MicrosoftStoreOyun>,
    pub toplam_oyun: u32,
    pub yuklu_oyun: u32,
    pub toplam_sure: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MicrosoftStoreIstatistikleri {
    pub toplam_oyun: u32,
    pub yuklu_oyun: u32,
    pub toplam_sure: u64,
    pub en_cok_oynanan: Option<MicrosoftStoreOyun>,
    pub son_oynananlar: Vec<MicrosoftStoreOyun>,
    pub kategoriler: HashMap<String, u32>,
    pub uretici_sayisi: u32,
}

// ============ Hata Modelleri ============

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MicrosoftStoreHata {
    ErisimReddedildi(String),
    OyunBulunamadi(String),
    PowerShellHatasi(String),
    AgHatasi(String),
    ParseHatasi(String),
    WindowsDegil,
}

impl std::fmt::Display for MicrosoftStoreHata {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MicrosoftStoreHata::ErisimReddedildi(e) => write!(f, "Erişim reddedildi: {}", e),
            MicrosoftStoreHata::OyunBulunamadi(name) => write!(f, "Oyun bulunamadı: {}", name),
            MicrosoftStoreHata::PowerShellHatasi(e) => write!(f, "PowerShell hatası: {}", e),
            MicrosoftStoreHata::AgHatasi(e) => write!(f, "Ağ hatası: {}", e),
            MicrosoftStoreHata::ParseHatasi(e) => write!(f, "Parse hatası: {}", e),
            MicrosoftStoreHata::WindowsDegil => write!(f, "Bu özellik sadece Windows'ta çalışır"),
        }
    }
}

// ============ Microsoft Store İstemcisi ============

#[derive(Clone)]
pub struct MicrosoftStoreClient {
    #[cfg(target_os = "windows")]
    powershell_path: String,
}

impl MicrosoftStoreClient {
    pub fn yeni() -> Self {
        MicrosoftStoreClient {
            #[cfg(target_os = "windows")]
            powershell_path: "powershell.exe".to_string(),
        }
    }

    // ============ Oyun İşlemleri ============

    /// Microsoft Store kütüphanesini çeker (PowerShell ile)
    #[cfg(target_os = "windows")]
    pub async fn kutuphane_cek(&self) -> Result<Vec<MicrosoftStoreOyun>, MicrosoftStoreHata> {
        use tokio::process::Command;

        let output = Command::new(&self.powershell_path)
            .args(&[
                "-Command",
                "Get-AppxPackage | Where-Object {$_.IsFramework -eq $false -and $_.SignatureKind -eq 'Store'} | Select-Object PackageFullName, PackageFamilyName, Name, DisplayName, Publisher, Version, InstallLocation | ConvertTo-Json"
            ])
            .output()
            .await
            .map_err(|e| MicrosoftStoreHata::PowerShellHatasi(e.to_string()))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(MicrosoftStoreHata::PowerShellHatasi(stderr.to_string()));
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        let oyunlar: Vec<MicrosoftStoreOyun> = if stdout.trim().is_empty() {
            Vec::new()
        } else {
            serde_json::from_str(&stdout)
                .map_err(|e| MicrosoftStoreHata::ParseHatasi(e.to_string()))?
        };

        Ok(oyunlar)
    }

    /// Windows dışı için boş döndür
    #[cfg(not(target_os = "windows"))]
    pub async fn kutuphane_cek(&self) -> Result<Vec<MicrosoftStoreOyun>, MicrosoftStoreHata> {
        Ok(Vec::new())
    }

    /// Belirli bir oyunun bilgilerini çeker
    #[cfg(target_os = "windows")]
    pub async fn oyun_bilgisi_cek(&self, package_name: &str) -> Result<MicrosoftStoreOyun, MicrosoftStoreHata> {
        use tokio::process::Command;

        let ps_command = format!(
            "Get-AppxPackage '{}' | Select-Object PackageFullName, PackageFamilyName, Name, DisplayName, Publisher, Version, InstallLocation | ConvertTo-Json",
            package_name
        );

        let output = Command::new(&self.powershell_path)
            .args(&["-Command", &ps_command])
            .output()
            .await
            .map_err(|e| MicrosoftStoreHata::PowerShellHatasi(e.to_string()))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(MicrosoftStoreHata::PowerShellHatasi(stderr.to_string()));
        }

        let stdout = String::from_utf8_lossy(&output.stdout);
        serde_json::from_str(stdout.trim())
            .map_err(|e| MicrosoftStoreHata::ParseHatasi(e.to_string()))
    }

    // ============ İstatistikler ============

    /// Microsoft Store istatistiklerini hesaplar
    pub async fn istatistikler_hesapla(&self) -> Result<MicrosoftStoreIstatistikleri, MicrosoftStoreHata> {
        let oyunlar = self.kutuphane_cek().await?;

        let toplam_oyun = oyunlar.len() as u32;
        let yuklu_oyun = oyunlar.iter().filter(|o| o.is_installed).count() as u32;
        let toplam_sure = oyunlar.iter()
            .filter_map(|o| o.total_time_played)
            .sum();

        // En çok oynanan oyunu bul
        let en_cok_oynanan = oyunlar.iter()
            .max_by(|a, b| {
                let a_sure = a.total_time_played.unwrap_or(0);
                let b_sure = b.total_time_played.unwrap_or(0);
                a_sure.cmp(&b_sure)
            })
            .cloned();

        // Kategorilere göre say (üretici bazında)
        let mut kategoriler: HashMap<String, u32> = HashMap::new();
        for oyun in &oyunlar {
            if let Some(publisher) = &oyun.publisher {
                *kategoriler.entry(publisher.clone()).or_insert(0) += 1;
            }
        }

        let uretici_sayisi = kategoriler.len() as u32;

        Ok(MicrosoftStoreIstatistikleri {
            toplam_oyun,
            yuklu_oyun,
            toplam_sure,
            en_cok_oynanan,
            son_oynananlar: oyunlar.into_iter().take(10).collect(),
            kategoriler,
            uretici_sayisi,
        })
    }

    // ============ Yardımcı Fonksiyonlar ============

    /// Microsoft Store oyunlarının yüklü olup olmadığını kontrol eder
    pub fn oyun_yuklu_mu(package_name: &str) -> bool {
        #[cfg(target_os = "windows")]
        {
            let reg_key = windows_registry::LocalMachine;
            let path = format!(
                "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{}",
                package_name
            );
            reg_key.open(path).is_ok()
        }
        #[cfg(not(target_os = "windows"))]
        {
            false
        }
    }

    /// Tüm Microsoft Store oyunlarını listeler
    pub async fn tum_oyunlari_listele() -> Result<Vec<String>, MicrosoftStoreHata> {
        #[cfg(target_os = "windows")]
        {
            use tokio::process::Command;

            let output = Command::new("powershell.exe")
                .args(&[
                    "-Command",
                    "Get-AppxPackage | Where-Object {$_.IsFramework -eq $false -and $_.SignatureKind -eq 'Store'} | Select-Object -ExpandProperty Name"
                ])
                .output()
                .await
                .map_err(|e| MicrosoftStoreHata::PowerShellHatasi(e.to_string()))?;

            let stdout = String::from_utf8_lossy(&output.stdout);
            let oyunlar: Vec<String> = stdout.lines().map(|s| s.to_string()).collect();
            Ok(oyunlar)
        }
        #[cfg(not(target_os = "windows"))]
        {
            Ok(Vec::new())
        }
    }
}

// ============ Microsoft Store Süre İzleyici ============

pub struct MicrosoftStoreSureIzleyici {
    client: Arc<MicrosoftStoreClient>,
    aktif_oyunlar: Arc<Mutex<HashMap<String, MicrosoftStoreAktifOyun>>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct MicrosoftStoreAktifOyun {
    pub package_name: String,
    pub oyun_adi: String,
    #[serde(skip)]
    pub baslama_zamani: std::time::Instant,
    pub suresi: u64,
}

impl MicrosoftStoreSureIzleyici {
    pub fn yeni(client: Arc<MicrosoftStoreClient>) -> Self {
        MicrosoftStoreSureIzleyici {
            client,
            aktif_oyunlar: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn aktif_oyunlari_al(&self) -> Vec<MicrosoftStoreAktifOyun> {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.values().cloned().collect()
    }
}

// Windows registry erişimi için (opsiyonel)
#[cfg(target_os = "windows")]
mod windows_registry {
    use std::path::PathBuf;

    pub struct LocalMachine;

    impl LocalMachine {
        pub fn open(_path: &str) -> Result<PathBuf, ()> {
            // Gerçek implementasyonda Windows registry kullanılabilir
            // Şu an için basit bir kontrol
            Ok(PathBuf::new())
        }
    }
}
