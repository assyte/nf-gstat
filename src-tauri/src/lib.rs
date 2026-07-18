mod db;
mod game_detector;
mod process_watcher;
mod minecraft;
mod steam;
mod epic;
mod xbox;
mod playstation;
mod microsoft;

use db::{Veritabani, Oyun, Ayarlar};
use process_watcher::{SurecIzleyici, AktifOyun, SurecEvent};
use minecraft::{MinecraftBilgi, MinecraftDedektoru, MinecraftIstatistikleri, ModLoader};
use steam::{SteamClient, SteamKullanici, SteamOyun, SteamIstatistikleri as SteamIstat, SteamHata};
use epic::{EpicGamesClient, EpicGamesOyun, EpicGamesIstatistikleri as EpicIstat, EpicHata};
use xbox::{XboxClient, XboxKullanici, XboxOyun, XboxIstatistikleri as XboxIstat, XboxHata};
use playstation::{PlayStationClient, PlayStationKullanici, PlayStationOyun, PlayStationIstatistikleri as PSIstat, PlayStationHata};
use microsoft::{MicrosoftStoreClient, MicrosoftStoreOyun, MicrosoftStoreIstatistikleri as MSStoreIstat};
use std::sync::{Arc, Mutex};
use tauri::{State, Manager};

struct AppState {
    veritabani: Arc<Veritabani>,
    izleyici: Arc<SurecIzleyici>,
    minecraft_istatistikleri: Arc<Mutex<MinecraftIstatistikleri>>,
    steam_client: Arc<Mutex<Option<SteamClient>>>,
    epic_client: Arc<Mutex<Option<EpicGamesClient>>>,
    xbox_client: Arc<Mutex<Option<XboxClient>>>,
    playstation_client: Arc<Mutex<Option<PlayStationClient>>>,
    microsoft_client: Arc<Mutex<Option<MicrosoftStoreClient>>>,
}

#[tauri::command]
fn oyun_ekle(state: State<AppState>, oyun_adi: String) -> Result<i64, String> {
    state.veritabani.oyun_ekle(&oyun_adi).map_err(|e| e.to_string())
}

#[tauri::command]
fn sure_guncelle(state: State<AppState>, oyun_adi: String, sure: i64) -> Result<(), String> {
    state.veritabani.sure_guncelle(&oyun_adi, sure).map_err(|e| e.to_string())
}

#[tauri::command]
fn oyunlari_listele(state: State<AppState>) -> Result<Vec<Oyun>, String> {
    state.veritabani.oyunlari_listele().map_err(|e| e.to_string())
}

#[tauri::command]
fn ayarlari_oku(state: State<AppState>) -> Result<Ayarlar, String> {
    state.veritabani.ayarlari_oku().map_err(|e| e.to_string())
}

#[tauri::command]
fn ayarlari_guncelle(state: State<AppState>, dil: String, tema: String) -> Result<(), String> {
    state.veritabani.ayarlari_guncelle(&dil, &tema).map_err(|e| e.to_string())
}

#[tauri::command]
fn aktif_oyunlari_al(state: State<AppState>) -> Result<Vec<AktifOyun>, String> {
    Ok(state.izleyici.aktif_oyunlari_al())
}

#[tauri::command]
fn aktif_oyun_sayisi(state: State<AppState>) -> Result<usize, String> {
    Ok(state.izleyici.aktif_oyun_sayisi())
}

#[tauri::command]
fn minecraft_bilgisi_oku(state: State<AppState>) -> Result<Vec<MinecraftBilgi>, String> {
    let dedektor = MinecraftDedektoru::yeni();
    let sys = sysinfo::System::new_all();
    let sonuclar = dedektor.process_listesini_tara(&sys);
    Ok(sonuclar.into_iter().map(|(_, _, bilgi)| bilgi).collect())
}

#[tauri::command]
fn minecraft_istatistikleri(state: State<AppState>) -> Result<MinecraftIstatistikleri, String> {
    let istatistikler = state.minecraft_istatistikleri.lock().unwrap();
    Ok((*istatistikler).clone())
}

#[tauri::command]
fn mod_loader_adlari() -> Result<Vec<String>, String> {
    Ok(vec![
        "Vanilla".to_string(),
        "Fabric".to_string(),
        "Forge".to_string(),
        "Quilt".to_string(),
        "OptiFine".to_string(),
        "NeoForge".to_string(),
        "LiteLoader".to_string(),
        "Rift".to_string(),
    ])
}

#[tauri::command]
async fn steam_api_key_ayarla(state: State<'_, AppState>, api_key: String) -> Result<(), String> {
    let client = SteamClient::yeni(api_key);
    let mut steam = state.steam_client.lock().unwrap();
    *steam = Some(client);
    Ok(())
}

#[tauri::command]
async fn steam_kullanici_ozeti(state: State<'_, AppState>, steam_id: String) -> Result<SteamKullanici, String> {
    let client = state.steam_client.lock().unwrap().clone().ok_or("Steam API key ayarlanmamış")?;
    client.kullanici_ozeti(&steam_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn steam_oyun_kutuphanesi(state: State<'_, AppState>, steam_id: String) -> Result<Vec<SteamOyun>, String> {
    let client = state.steam_client.lock().unwrap().clone().ok_or("Steam API key ayarlanmamış")?;
    client.oyun_kutuphanesi(&steam_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn steam_son_oynananlar(state: State<'_, AppState>, steam_id: String, sayi: u32) -> Result<Vec<SteamOyun>, String> {
    let client = state.steam_client.lock().unwrap().clone().ok_or("Steam API key ayarlanmamış")?;
    client.son_oynananlar(&steam_id, sayi).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn steam_istatistikler(state: State<'_, AppState>, steam_id: String) -> Result<SteamIstat, String> {
    let client = state.steam_client.lock().unwrap().clone().ok_or("Steam API key ayarlanmamış")?;
    client.istatistikler_hesapla(&steam_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
fn steam_id_gecerli_mi(steam_id: String) -> Result<bool, String> {
    Ok(SteamClient::steam_id_gecerli_mi(&steam_id))
}

#[tauri::command]
async fn epic_token_ayarla(state: State<'_, AppState>, token: String) -> Result<(), String> {
    let mut client = EpicGamesClient::yeni();
    client.token_ayarla(token);
    let mut epic = state.epic_client.lock().unwrap();
    *epic = Some(client);
    Ok(())
}

#[tauri::command]
async fn epic_kutuphane(state: State<'_, AppState>) -> Result<Vec<EpicGamesOyun>, String> {
    let client = state.epic_client.lock().unwrap().clone().ok_or("Epic Games token ayarlanmamış")?;
    client.kutuphane_cek().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn xbox_token_ayarla(state: State<'_, AppState>, access_token: String, user_token: String, xsts_token: String) -> Result<(), String> {
    let mut client = XboxClient::yeni();
    client.token_ayarla(access_token, user_token, xsts_token);
    let mut xbox = state.xbox_client.lock().unwrap();
    *xbox = Some(client);
    Ok(())
}

#[tauri::command]
async fn xbox_kullanici_bilgileri(state: State<'_, AppState>, xuid: String) -> Result<XboxKullanici, String> {
    let client = state.xbox_client.lock().unwrap().clone().ok_or("Xbox token ayarlanmamış")?;
    client.kullanici_bilgileri(&xuid).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn xbox_kutuphane(state: State<'_, AppState>, xuid: String) -> Result<Vec<XboxOyun>, String> {
    let client = state.xbox_client.lock().unwrap().clone().ok_or("Xbox token ayarlanmamış")?;
    client.kutuphane_cek(&xuid).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn xbox_istatistikler(state: State<'_, AppState>, xuid: String) -> Result<XboxIstat, String> {
    let client = state.xbox_client.lock().unwrap().clone().ok_or("Xbox token ayarlanmamış")?;
    client.istatistikler_hesapla(&xuid).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn ps_token_ayarla(state: State<'_, AppState>, access_token: String, npsso: String) -> Result<(), String> {
    let mut client = PlayStationClient::yeni();
    client.token_ayarla(access_token, npsso);
    let mut ps = state.playstation_client.lock().unwrap();
    *ps = Some(client);
    Ok(())
}

#[tauri::command]
async fn ps_kullanici_bilgileri(state: State<'_, AppState>, online_id: String) -> Result<PlayStationKullanici, String> {
    let client = state.playstation_client.lock().unwrap().clone().ok_or("PlayStation token ayarlanmamış")?;
    client.kullanici_bilgileri(&online_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn ps_kutuphane(state: State<'_, AppState>, account_id: String) -> Result<Vec<PlayStationOyun>, String> {
    let client = state.playstation_client.lock().unwrap().clone().ok_or("PlayStation token ayarlanmamış")?;
    client.kutuphane_cek(&account_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn ps_istatistikler(state: State<'_, AppState>, account_id: String) -> Result<PSIstat, String> {
    let client = state.playstation_client.lock().unwrap().clone().ok_or("PlayStation token ayarlanmamış")?;
    client.istatistikler_hesapla(&account_id).await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn ms_store_kutuphane(state: State<'_, AppState>) -> Result<Vec<MicrosoftStoreOyun>, String> {
    let client = state.microsoft_client.lock().unwrap().clone().ok_or("Microsoft Store istemcisi ayarlanmamış")?;
    client.kutuphane_cek().await.map_err(|e| e.to_string())
}

#[tauri::command]
async fn ms_store_istatistikler(state: State<'_, AppState>) -> Result<MSStoreIstat, String> {
    let client = state.microsoft_client.lock().unwrap().clone().ok_or("Microsoft Store istemcisi ayarlanmamış")?;
    client.istatistikler_hesapla().await.map_err(|e| e.to_string())
}

#[tauri::command]
fn platform_ozeti() -> Result<std::collections::HashMap<String, usize>, String> {
    let dedektor = game_detector::OyunDedektoru::yeni();
    Ok(dedektor.platform_ozet())
}

#[tauri::command]
fn tum_platformlar() -> Result<Vec<String>, String> {
    Ok(vec![
        "Minecraft".to_string(),
        "Steam".to_string(),
        "Epic Games".to_string(),
        "Xbox".to_string(),
        "PlayStation".to_string(),
        "Microsoft Store".to_string(),
        "Riot".to_string(),
    ])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let db_path = app_handle.path().app_data_dir().expect("App data dir not found").join("gstat.db");
            
            if let Some(parent) = db_path.parent() {
                std::fs::create_dir_all(parent).ok();
            }
            
            let veritabani = Veritabani::yeni(&db_path).expect("Veritabanı oluşturulamadı");
            let db_arc = Arc::new(veritabani);
            
            let mut izleyici = SurecIzleyici::yeni();
            izleyici.tarama_araligi_ayarla(5);
            
            let izleyici_arc = Arc::new(izleyici);
            let minecraft_ist = Arc::new(Mutex::new(MinecraftIstatistikleri::yeni()));
            let steam_client = Arc::new(Mutex::new(None));
            let epic_client = Arc::new(Mutex::new(None));
            let xbox_client = Arc::new(Mutex::new(None));
            let playstation_client = Arc::new(Mutex::new(None));
            let microsoft_client = Arc::new(Mutex::new(Some(MicrosoftStoreClient::yeni())));
            
            let izleyici_clone = izleyici_arc.clone();
            let db_clone = db_arc.clone();
            
            tauri::async_runtime::spawn(async move {
                izleyici_clone.taramaya_basla(db_clone);
            });
            
            app.manage(AppState {
                veritabani: db_arc,
                izleyici: izleyici_arc,
                minecraft_istatistikleri: minecraft_ist,
                steam_client,
                epic_client,
                xbox_client,
                playstation_client,
                microsoft_client,
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            oyun_ekle,
            sure_guncelle,
            oyunlari_listele,
            ayarlari_oku,
            ayarlari_guncelle,
            aktif_oyunlari_al,
            aktif_oyun_sayisi,
            minecraft_bilgisi_oku,
            minecraft_istatistikleri,
            mod_loader_adlari,
            steam_api_key_ayarla,
            steam_kullanici_ozeti,
            steam_oyun_kutuphanesi,
            steam_son_oynananlar,
            steam_istatistikler,
            steam_id_gecerli_mi,
            epic_token_ayarla,
            epic_kutuphane,
            xbox_token_ayarla,
            xbox_kullanici_bilgileri,
            xbox_kutuphane,
            xbox_istatistikler,
            ps_token_ayarla,
            ps_kullanici_bilgileri,
            ps_kutuphane,
            ps_istatistikler,
            ms_store_kutuphane,
            ms_store_istatistikler,
            platform_ozeti,
            tum_platformlar
        ])
        .run(tauri::generate_context!())
        .expect("hata oluştu");
}
