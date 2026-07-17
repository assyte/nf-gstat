mod db;

use db::{Veritabani, Oyun, Ayarlar};
use std::sync::Arc;
use tauri::State;

struct AppState {
    veritabani: Arc<Veritabani>,
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
            app.manage(AppState {
                veritabani: Arc::new(veritabani),
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            oyun_ekle,
            sure_guncelle,
            oyunlari_listele,
            ayarlari_oku,
            ayarlari_guncelle
        ])
        .run(tauri::generate_context!())
        .expect("hata oluştu");
}
