use rusqlite::{Connection, Result, params};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
pub struct Oyun {
    pub id: i64,
    pub oyun_adi: String,
    pub toplam_sure: i64,
    pub son_oynama: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Ayarlar {
    pub dil: String,
    pub tema: String,
}

pub struct Veritabani {
    pub conn: Mutex<Connection>,
}

impl Veritabani {
    pub fn yeni(db_yolu: &PathBuf) -> Result<Self> {
        let conn = Connection::open(db_yolu)?;
        
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS oyunlar (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                oyun_adi TEXT NOT NULL UNIQUE,
                toplam_sure INTEGER DEFAULT 0,
                son_oynama TEXT
            );
            
            CREATE TABLE IF NOT EXISTS ayarlar (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dil TEXT DEFAULT 'tr',
                tema TEXT DEFAULT 'koyu'
            );"
        )?;

        Ok(Veritabani {
            conn: Mutex::new(conn),
        })
    }

    pub fn oyun_ekle(&self, oyun_adi: &str) -> Result<i64> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR IGNORE INTO oyunlar (oyun_adi) VALUES (?1)",
            params![oyun_adi],
        )?;
        Ok(conn.last_insert_rowid())
    }

    pub fn sure_guncelle(&self, oyun_adi: &str, sure: i64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "UPDATE oyunlar SET toplam_sure = toplam_sure + ?1, son_oynama = datetime('now') WHERE oyun_adi = ?2",
            params![sure, oyun_adi],
        )?;
        Ok(())
    }

    pub fn oyunlari_listele(&self) -> Result<Vec<Oyun>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, oyun_adi, toplam_sure, son_oynama FROM oyunlar ORDER BY toplam_sure DESC")?;
        
        let oyunlar = stmt.query_map([], |row| {
            Ok(Oyun {
                id: row.get(0)?,
                oyun_adi: row.get(1)?,
                toplam_sure: row.get(2)?,
                son_oynama: row.get(3)?,
            })
        })?.collect::<Result<Vec<_>>>()?;
        
        Ok(oyunlar)
    }

    pub fn ayarlari_oku(&self) -> Result<Ayarlar> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT dil, tema FROM ayarlar LIMIT 1")?;
        
        let ayarlar = stmt.query_row([], |row| {
            Ok(Ayarlar {
                dil: row.get(0)?,
                tema: row.get(1)?,
            })
        }).unwrap_or(Ayarlar {
            dil: "tr".to_string(),
            tema: "koyu".to_string(),
        });
        
        Ok(ayarlar)
    }

    pub fn ayarlari_guncelle(&self, dil: &str, tema: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO ayarlar (id, dil, tema) VALUES (1, ?1, ?2)",
            params![dil, tema],
        )?;
        Ok(())
    }
}
