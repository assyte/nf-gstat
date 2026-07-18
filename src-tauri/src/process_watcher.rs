use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use sysinfo::System;
use tokio::sync::mpsc;
use serde::{Deserialize, Serialize};

use crate::db::Veritabani;
use crate::game_detector::{OyunDedektoru, OyunKategorisi, MinecraftBilgi};

#[derive(Debug, Clone, Serialize)]
pub struct AktifOyun {
    pub oyun_adi: String,
    pub process_adi: String,
    pub pid: u32,
    #[serde(skip)]
    pub baslama_zamani: Instant,
    pub suresi: u64,
    pub kategori: OyunKategorisi,
    pub minecraft_bilgi: Option<MinecraftBilgi>,
}

pub struct SurecIzleyici {
    dedektor: OyunDedektoru,
    aktif_oyunlar: Arc<Mutex<HashMap<u32, AktifOyun>>>,
    tx: Option<mpsc::UnboundedSender<SurecEvent>>,
    tarama_araligi: Duration,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SurecEvent {
    OyunBasladi(String, u32),
    OyunBitti(String, u32, u64),
    SureGuncellendi(String, u64),
}

impl SurecIzleyici {
    pub fn yeni() -> Self {
        SurecIzleyici {
            dedektor: OyunDedektoru::yeni(),
            aktif_oyunlar: Arc::new(Mutex::new(HashMap::new())),
            tx: None,
            tarama_araligi: Duration::from_secs(5),
        }
    }

    pub fn tarama_araligi_ayarla(&mut self, saniye: u64) {
        self.tarama_araligi = Duration::from_secs(saniye);
    }

    pub fn event_kanali_olustur(&mut self) -> mpsc::UnboundedReceiver<SurecEvent> {
        let (tx, rx) = mpsc::unbounded_channel();
        self.tx = Some(tx);
        rx
    }

    pub fn taramaya_basla(&self, db: Arc<Veritabani>) {
        let aktif_oyunlar = self.aktif_oyunlar.clone();
        let dedektor_ref = Arc::new(self.dedektor.clone());
        let tx = self.tx.clone();
        let aralik = self.tarama_araligi;

        tokio::spawn(async move {
            let mut sys = System::new_all();
            let mut son_kayitlar: HashMap<u32, Instant> = HashMap::new();

            loop {
                sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);

                let mevcut_oyunlar = tarama_yap(&sys, &dedektor_ref);

                {
                    let mut aktif = aktif_oyunlar.lock().unwrap();

                    // Yeni başlayan oyunlar
                    for (pid, oyun) in &mevcut_oyunlar {
                        if !aktif.contains_key(pid) {
                            println!("🎮 Oyun başladı: {} (PID: {})", oyun.oyun_adi, pid);
                            
                            let yeni_oyun = AktifOyun {
                                oyun_adi: oyun.oyun_adi.clone(),
                                process_adi: oyun.process_adi.clone(),
                                pid: *pid,
                                baslama_zamani: Instant::now(),
                                suresi: 0,
                                kategori: oyun.kategori.clone(),
                                minecraft_bilgi: oyun.minecraft_bilgi.clone(),
                            };

                            aktif.insert(*pid, yeni_oyun);
                            son_kayitlar.insert(*pid, Instant::now());

                            if let Some(tx) = &tx {
                                let _ = tx.send(SurecEvent::OyunBasladi(oyun.oyun_adi.clone(), *pid));
                            }
                        }
                    }

                    // Biten oyunlar
                    let biten_pidler: Vec<u32> = aktif.keys()
                        .filter(|pid| !mevcut_oyunlar.contains_key(pid))
                        .copied()
                        .collect();

                    for pid in biten_pidler {
                        if let Some(oyun) = aktif.remove(&pid) {
                            let gecen_sure = oyun.baslama_zamani.elapsed().as_secs();
                            
                            // Veritabanına kaydet
                            if gecen_sure > 0 {
                                let _ = db.oyun_ekle(&oyun.oyun_adi);
                                let _ = db.sure_guncelle(&oyun.oyun_adi, gecen_sure as i64);
                                
                                println!("🏁 Oyun bitti: {} - Süre: {} saniye", oyun.oyun_adi, gecen_sure);
                                
                                if let Some(tx) = &tx {
                                    let _ = tx.send(SurecEvent::OyunBitti(oyun.oyun_adi, pid, gecen_sure));
                                }
                            }
                            
                            son_kayitlar.remove(&pid);
                        }
                    }

                    // Süre güncellemeleri
                    for (pid, oyun) in aktif.iter_mut() {
                        if let Some(baslangic) = son_kayitlar.get(pid) {
                            let gecen = baslangic.elapsed().as_secs();
                            if gecen >= 60 {
                                oyun.suresi += gecen;
                                son_kayitlar.insert(*pid, Instant::now());

                                if let Some(tx) = &tx {
                                    let _ = tx.send(SurecEvent::SureGuncellendi(oyun.oyun_adi.clone(), oyun.suresi));
                                }
                            }
                        }
                    }
                }

                tokio::time::sleep(aralik).await;
            }
        });
    }

    pub fn aktif_oyunlari_al(&self) -> Vec<AktifOyun> {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.values().cloned().collect()
    }

    pub fn aktif_oyun_sayisi(&self) -> usize {
        let aktif = self.aktif_oyunlar.lock().unwrap();
        aktif.len()
    }

    pub fn oyun_dedektoru(&self) -> &OyunDedektoru {
        &self.dedektor
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaramaSonucu {
    pub oyun_adi: String,
    pub process_adi: String,
    pub pid: u32,
    pub kategori: OyunKategorisi,
    pub minecraft_bilgi: Option<MinecraftBilgi>,
}

fn tarama_yap(sys: &System, dedektor: &OyunDedektoru) -> HashMap<u32, TaramaSonucu> {
    let mut sonuclar = HashMap::new();

    for (pid, process) in sys.processes() {
        let process_adi = process.name().to_string_lossy().to_string();
        
        if let Some(oyun) = dedektor.process_ara(&process_adi) {
            let mut minecraft_bilgi = None;

            // Minecraft için argüman taraması
            if oyun.kategori == OyunKategorisi::Minecraft {
                let argumanlar: Vec<String> = process.cmd().iter()
                    .map(|s| s.to_string_lossy().to_string())
                    .collect();
                minecraft_bilgi = Some(dedektor.minecraft_arguman_analiz(&argumanlar));
            }

            sonuclar.insert(pid.as_u32(), TaramaSonucu {
                oyun_adi: oyun.ad.clone(),
                process_adi,
                pid: pid.as_u32(),
                kategori: oyun.kategori.clone(),
                minecraft_bilgi,
            });
        }
    }

    sonuclar
}
