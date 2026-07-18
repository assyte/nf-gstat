use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OyunTanimi {
    pub ad: String,
    pub process_adlari: Vec<String>,
    pub kategori: OyunKategorisi,
    pub ikon: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum OyunKategorisi {
    Minecraft,
    Steam,
    EpicGames,
    Xbox,
    PlayStation,
    Microsoft,
    Riot,
    Discord,
    Diger,
}

impl OyunKategorisi {
    pub fn adi(&self) -> &str {
        match self {
            OyunKategorisi::Minecraft => "Minecraft",
            OyunKategorisi::Steam => "Steam",
            OyunKategorisi::EpicGames => "Epic Games",
            OyunKategorisi::Xbox => "Xbox",
            OyunKategorisi::PlayStation => "PlayStation",
            OyunKategorisi::Microsoft => "Microsoft",
            OyunKategorisi::Riot => "Riot",
            OyunKategorisi::Discord => "Discord",
            OyunKategorisi::Diger => "Diğer",
        }
    }

    pub fn ikon(&self) -> &str {
        match self {
            OyunKategorisi::Minecraft => "⛏️",
            OyunKategorisi::Steam => "🎮",
            OyunKategorisi::EpicGames => "🎯",
            OyunKategorisi::Xbox => "🟢",
            OyunKategorisi::PlayStation => "🔵",
            OyunKategorisi::Microsoft => "🪟",
            OyunKategorisi::Riot => "⚔️",
            OyunKategorisi::Discord => "💬",
            OyunKategorisi::Diger => "🎮",
        }
    }
}

#[derive(Clone)]
pub struct OyunDedektoru {
    oyunlar: Vec<OyunTanimi>,
    process_map: HashMap<String, usize>,
}

impl OyunDedektoru {
    pub fn yeni() -> Self {
        let mut dedektor = OyunDedektoru {
            oyunlar: Vec::new(),
            process_map: HashMap::new(),
        };
        dedektor.varsayilan_oyunlari_ekle();
        dedektor
    }

    fn varsayilan_oyunlari_ekle(&mut self) {
        let varsayilan_oyunlar = vec![
            // ============ MINECRAFT ============
            OyunTanimi {
                ad: "Minecraft".to_string(),
                process_adlari: vec![
                    "javaw.exe".to_string(),
                    "java.exe".to_string(),
                    "minecraft.exe".to_string(),
                    "minecraft".to_string(),
                ],
                kategori: OyunKategorisi::Minecraft,
                ikon: Some("⛏️".to_string()),
            },
            // ============ STEAM ============
            OyunTanimi {
                ad: "Steam Client".to_string(),
                process_adlari: vec![
                    "steam.exe".to_string(),
                    "steam".to_string(),
                    "steamwebhelper.exe".to_string(),
                ],
                kategori: OyunKategorisi::Steam,
                ikon: Some("🎮".to_string()),
            },
            // Popüler Steam Oyunları
            OyunTanimi {
                ad: "Counter-Strike 2".to_string(),
                process_adlari: vec![
                    "cs2.exe".to_string(),
                    "cs2".to_string(),
                ],
                kategori: OyunKategorisi::Steam,
                ikon: Some("🔫".to_string()),
            },
            OyunTanimi {
                ad: "Dota 2".to_string(),
                process_adlari: vec![
                    "dota2.exe".to_string(),
                    "dota2".to_string(),
                ],
                kategori: OyunKategorisi::Steam,
                ikon: Some("⚔️".to_string()),
            },
            OyunTanimi {
                ad: "GTA V".to_string(),
                process_adlari: vec![
                    "gta5.exe".to_string(),
                    "gta5".to_string(),
                ],
                kategori: OyunKategorisi::Steam,
                ikon: Some("🚗".to_string()),
            },
            OyunTanimi {
                ad: "Apex Legends".to_string(),
                process_adlari: vec![
                    "r5apex.exe".to_string(),
                    "apex legends".to_string(),
                ],
                kategori: OyunKategorisi::Steam,
                ikon: Some("🎯".to_string()),
            },
            // ============ EPIC GAMES ============
            OyunTanimi {
                ad: "Epic Games Launcher".to_string(),
                process_adlari: vec![
                    "epicgameslauncher.exe".to_string(),
                    "EpicGamesLauncher.exe".to_string(),
                ],
                kategori: OyunKategorisi::EpicGames,
                ikon: Some("🎯".to_string()),
            },
            OyunTanimi {
                ad: "Fortnite".to_string(),
                process_adlari: vec![
                    "fortniteclient-win64-shipping.exe".to_string(),
                    "FortniteClient-Win64-Shipping.exe".to_string(),
                ],
                kategori: OyunKategorisi::EpicGames,
                ikon: Some("🏗️".to_string()),
            },
            OyunTanimi {
                ad: "Rocket League".to_string(),
                process_adlari: vec![
                    "rocketleague.exe".to_string(),
                    "RocketLeague.exe".to_string(),
                ],
                kategori: OyunKategorisi::EpicGames,
                ikon: Some("🚗".to_string()),
            },
            OyunTanimi {
                ad: "Genshin Impact".to_string(),
                process_adlari: vec![
                    "genshinimpact.exe".to_string(),
                    "GenshinImpact.exe".to_string(),
                ],
                kategori: OyunKategorisi::EpicGames,
                ikon: Some("⚔️".to_string()),
            },
            // ============ XBOX ============
            OyunTanimi {
                ad: "Xbox App".to_string(),
                process_adlari: vec![
                    "xbox.exe".to_string(),
                    "XboxApp.exe".to_string(),
                    "Microsoft.XboxApp.exe".to_string(),
                ],
                kategori: OyunKategorisi::Xbox,
                ikon: Some("🟢".to_string()),
            },
            OyunTanimi {
                ad: "Xbox Game Bar".to_string(),
                process_adlari: vec![
                    "gamingservices.exe".to_string(),
                    "GameBar.exe".to_string(),
                ],
                kategori: OyunKategorisi::Xbox,
                ikon: Some("🟢".to_string()),
            },
            OyunTanimi {
                ad: "Forza Horizon 5".to_string(),
                process_adlari: vec![
                    "forzahorizon5.exe".to_string(),
                    "ForzaHorizon5.exe".to_string(),
                ],
                kategori: OyunKategorisi::Xbox,
                ikon: Some("🏎️".to_string()),
            },
            OyunTanimi {
                ad: "Halo Infinite".to_string(),
                process_adlari: vec![
                    "haloinfinite.exe".to_string(),
                    "HaloInfinite.exe".to_string(),
                ],
                kategori: OyunKategorisi::Xbox,
                ikon: Some("🛡️".to_string()),
            },
            OyunTanimi {
                ad: "Sea of Thieves".to_string(),
                process_adlari: vec![
                    "seaofthieves.exe".to_string(),
                    "SeaOfThieves.exe".to_string(),
                ],
                kategori: OyunKategorisi::Xbox,
                ikon: Some("🏴‍☠️".to_string()),
            },
            // ============ PLAYSTATION ============
            OyunTanimi {
                ad: "PlayStation App".to_string(),
                process_adlari: vec![
                    "playstation.exe".to_string(),
                    "PlayStation.exe".to_string(),
                ],
                kategori: OyunKategorisi::PlayStation,
                ikon: Some("🔵".to_string()),
            },
            OyunTanimi {
                ad: "PlayStation Now".to_string(),
                process_adlari: vec![
                    "playstationnow.exe".to_string(),
                    "PlayStationNow.exe".to_string(),
                ],
                kategori: OyunKategorisi::PlayStation,
                ikon: Some("🔵".to_string()),
            },
            // ============ MICROSOFT ============
            OyunTanimi {
                ad: "Microsoft Store".to_string(),
                process_adlari: vec![
                    "msstore.exe".to_string(),
                    "WinStore.App.exe".to_string(),
                ],
                kategori: OyunKategorisi::Microsoft,
                ikon: Some("🪟".to_string()),
            },
            OyunTanimi {
                ad: "Minecraft Launcher".to_string(),
                process_adlari: vec![
                    "minecraftlauncher.exe".to_string(),
                    "MinecraftLauncher.exe".to_string(),
                ],
                kategori: OyunKategorisi::Microsoft,
                ikon: Some("⛏️".to_string()),
            },
            // ============ RIOT ============
            OyunTanimi {
                ad: "Valorant".to_string(),
                process_adlari: vec![
                    "valorant.exe".to_string(),
                    "valorant-win64-shipping.exe".to_string(),
                    "vgtray.exe".to_string(),
                ],
                kategori: OyunKategorisi::Riot,
                ikon: Some("🔫".to_string()),
            },
            OyunTanimi {
                ad: "League of Legends".to_string(),
                process_adlari: vec![
                    "league of legends.exe".to_string(),
                    "leagueclient.exe".to_string(),
                    "lol.exe".to_string(),
                ],
                kategori: OyunKategorisi::Riot,
                ikon: Some("⚔️".to_string()),
            },
            OyunTanimi {
                ad: "Teamfight Tactics".to_string(),
                process_adlari: vec![
                    "teamfight tactics.exe".to_string(),
                    "riot client ux.exe".to_string(),
                ],
                kategori: OyunKategorisi::Riot,
                ikon: Some("♟️".to_string()),
            },
            // ============ DISCORD ============
            OyunTanimi {
                ad: "Discord".to_string(),
                process_adlari: vec![
                    "discord.exe".to_string(),
                    "discord".to_string(),
                    "discordptb.exe".to_string(),
                    "discordcanary.exe".to_string(),
                ],
                kategori: OyunKategorisi::Discord,
                ikon: Some("💬".to_string()),
            },
        ];

        for oyun in varsayilan_oyunlar {
            self.oyun_ekle(oyun);
        }
    }

    pub fn oyun_ekle(&mut self, oyun: OyunTanimi) {
        let index = self.oyunlar.len();
        for process in &oyun.process_adlari {
            self.process_map.insert(process.to_lowercase(), index);
        }
        self.oyunlar.push(oyun);
    }

    pub fn process_ara(&self, process_adi: &str) -> Option<&OyunTanimi> {
        let normalized = process_adi.to_lowercase();
        self.process_map.get(&normalized).and_then(|&idx| self.oyunlar.get(idx))
    }

    pub fn oyunlari_listele(&self) -> &[OyunTanimi] {
        &self.oyunlar
    }

    pub fn kategori_ara(&self, kategori: &OyunKategorisi) -> Vec<&OyunTanimi> {
        self.oyunlar
            .iter()
            .filter(|o| o.kategori == *kategori)
            .collect()
    }

    pub fn platform_ozet(&self) -> HashMap<String, usize> {
        let mut ozet = HashMap::new();
        for oyun in &self.oyunlar {
            let kategori = oyun.kategori.adi().to_string();
            *ozet.entry(kategori).or_insert(0) += 1;
        }
        ozet
    }

    pub fn minecraft_arguman_analiz(&self, argumanlar: &[String]) -> MinecraftBilgi {
        let mut bilgi = MinecraftBilgi::varsayilan();

        for arg in argumanlar {
            let arg_lower = arg.to_lowercase();

            if arg_lower.contains("fabric") {
                bilgi.mod_loader = Some("Fabric".to_string());
            } else if arg_lower.contains("forge") {
                bilgi.mod_loader = Some("Forge".to_string());
            } else if arg_lower.contains("quilt") {
                bilgi.mod_loader = Some("Quilt".to_string());
            } else if arg_lower.contains("optifine") {
                bilgi.mod_loader = Some("OptiFine".to_string());
            } else if arg_lower.starts_with("-dminecraft.jar=") {
                bilgi.mod_paket = Some(arg.split('=').last().unwrap_or("").to_string());
            } else if arg_lower.starts_with("--version") || arg_lower.starts_with("-version") {
                if let Some(ver) = arg.split('=').last() {
                    bilgi.surum = Some(ver.to_string());
                }
            }
        }

        bilgi
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MinecraftBilgi {
    pub mod_loader: Option<String>,
    pub mod_paket: Option<String>,
    pub surum: Option<String>,
}

impl MinecraftBilgi {
    pub fn varsayilan() -> Self {
        MinecraftBilgi {
            mod_loader: None,
            mod_paket: None,
            surum: None,
        }
    }

    pub fn ozet(&self) -> String {
        let mut parcalar = vec!["Minecraft".to_string()];

        if let Some(loader) = &self.mod_loader {
            parcalar.push(format!("({})", loader));
        }

        if let Some(surum) = &self.surum {
            parcalar.push(format!("v{}", surum));
        }

        parcalar.join(" ")
    }
}
