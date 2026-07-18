use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use sysinfo::System;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MinecraftBilgi {
    pub surum: Option<String>,
    pub mod_loader: Option<ModLoader>,
    pub mod_paket: Option<String>,
    pub fabric_surum: Option<String>,
    pub forge_surum: Option<String>,
    pub quilt_surum: Option<String>,
    pub optifine_surum: Option<String>,
    pub java_surum: Option<String>,
    pub vm_argumanlari: Vec<String>,
    pub classpath: Option<String>,
    pub main_class: Option<String>,
    pub window_title: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ModLoader {
    Vanilla,
    Fabric,
    Forge,
    Quilt,
    OptiFine,
    NeoForge,
    LiteLoader,
    Rift,
    Other(String),
}

impl ModLoader {
    pub fn adi(&self) -> &str {
        match self {
            ModLoader::Vanilla => "Vanilla",
            ModLoader::Fabric => "Fabric",
            ModLoader::Forge => "Forge",
            ModLoader::Quilt => "Quilt",
            ModLoader::OptiFine => "OptiFine",
            ModLoader::NeoForge => "NeoForge",
            ModLoader::LiteLoader => "LiteLoader",
            ModLoader::Rift => "Rift",
            ModLoader::Other(name) => name,
        }
    }

    pub fn ikon(&self) -> &str {
        match self {
            ModLoader::Vanilla => "🎮",
            ModLoader::Fabric => "🧵",
            ModLoader::Forge => "🔨",
            ModLoader::Quilt => "🪡",
            ModLoader::OptiFine => "🔍",
            ModLoader::NeoForge => "⚡",
            ModLoader::LiteLoader => "💡",
            ModLoader::Rift => "🌀",
            ModLoader::Other(_) => "❓",
        }
    }
}

impl MinecraftBilgi {
    pub fn yeni() -> Self {
        MinecraftBilgi {
            surum: None,
            mod_loader: Some(ModLoader::Vanilla),
            mod_paket: None,
            fabric_surum: None,
            forge_surum: None,
            quilt_surum: None,
            optifine_surum: None,
            java_surum: None,
            vm_argumanlari: Vec::new(),
            classpath: None,
            main_class: None,
            window_title: None,
        }
    }

    pub fn ozet(&self) -> String {
        let mut parcalar = vec!["Minecraft".to_string()];

        if let Some(surum) = &self.surum {
            parcalar.push(surum.clone());
        }

        if let Some(loader) = &self.mod_loader {
            if *loader != ModLoader::Vanilla {
                parcalar.push(format!("({})", loader.adi()));
            }
        }

        parcalar.join(" ")
    }

    pub fn detayli_ozet(&self) -> String {
        let mut satirlar = vec![self.ozet()];

        if let Some(fabric) = &self.fabric_surum {
            satirlar.push(format!("  Fabric: {}", fabric));
        }
        if let Some(forge) = &self.forge_surum {
            satirlar.push(format!("  Forge: {}", forge));
        }
        if let Some(quilt) = &self.quilt_surum {
            satirlar.push(format!("  Quilt: {}", quilt));
        }
        if let Some(optifine) = &self.optifine_surum {
            satirlar.push(format!("  OptiFine: {}", optifine));
        }
        if let Some(java) = &self.java_surum {
            satirlar.push(format!("  Java: {}", java));
        }

        satirlar.join("\n")
    }
}

pub struct MinecraftDedektoru {
    process_adlari: Vec<String>,
    arguman_desenleri: HashMap<String, String>,
}

impl MinecraftDedektoru {
    pub fn yeni() -> Self {
        let mut arguman_desenleri = HashMap::new();

        // Mod loader tespiti için desenler
        arguman_desenleri.insert("--fabric".to_string(), "fabric".to_string());
        arguman_desenleri.insert("--forge".to_string(), "forge".to_string());
        arguman_desenleri.insert("--quilt".to_string(), "quilt".to_string());
        arguman_desenleri.insert("--optifine".to_string(), "optifine".to_string());
        arguman_desenleri.insert("--liteloader".to_string(), "liteloader".to_string());
        arguman_desenleri.insert("--rift".to_string(), "rift".to_string());
        arguman_desenleri.insert("--neoforge".to_string(), "neoforge".to_string());

        MinecraftDedektoru {
            process_adlari: vec![
                "javaw.exe".to_string(),
                "java.exe".to_string(),
                "java".to_string(),
                "minecraft".to_string(),
                "minecraft.exe".to_string(),
                "minecraft-launcher".to_string(),
                "minecraft-launcher.exe".to_string(),
            ],
            arguman_desenleri,
        }
    }

    pub fn minecraft_mi(&self, process_adi: &str) -> bool {
        let normalized = process_adi.to_lowercase();
        self.process_adlari.iter().any(|p| normalized.contains(&p.to_lowercase()))
    }

    pub fn argumanlari_analiz_et(&self, argumanlar: &[String]) -> MinecraftBilgi {
        let mut bilgi = MinecraftBilgi::yeni();
        let mut vm_argumanlari = Vec::new();

        let arguman_str = argumanlar.join(" ");

        // Mod loader tespiti
        bilgi.mod_loader = Some(self.mod_loader_tespit(&arguman_str));

        // Versiyon tespiti
        bilgi.surum = self.versiyon_tespit(argumanlar);

        // Fabric versiyonu
        if arguman_str.contains("fabric") {
            bilgi.fabric_surum = self.fabric_versiyonu_tespit(argumanlar);
        }

        // Forge versiyonu
        if arguman_str.contains("forge") {
            bilgi.forge_surum = self.forge_versiyonu_tespit(argumanlar);
        }

        // Quilt versiyonu
        if arguman_str.contains("quilt") {
            bilgi.quilt_surum = self.quilt_versiyonu_tespit(argumanlar);
        }

        // OptiFine versiyonu
        if arguman_str.contains("optifine") {
            bilgi.optifine_surum = self.optifine_versiyonu_tespit(argumanlar);
        }

        // Java versiyonu
        bilgi.java_surum = self.java_versiyonu_tespit(argumanlar);

        // Main class
        bilgi.main_class = self.main_class_tespit(argumanlar);

        // Classpath
        bilgi.classpath = self.classpath_tespit(argumanlar);

        // VM argümanları
        for arg in argumanlar {
            if arg.starts_with("-X") || arg.starts_with("-D") {
                vm_argumanlari.push(arg.clone());
            }
        }
        bilgi.vm_argumanlari = vm_argumanlari;

        bilgi
    }

    fn mod_loader_tespit(&self, arguman_str: &str) -> ModLoader {
        if arguman_str.contains("--fabric") || arguman_str.contains("net.fabricmc") {
            ModLoader::Fabric
        } else if arguman_str.contains("--forge") || arguman_str.contains("net.minecraftforge") {
            ModLoader::Forge
        } else if arguman_str.contains("--quilt") || arguman_str.contains("org.quiltmc") {
            ModLoader::Quilt
        } else if arguman_str.contains("--optifine") || arguman_str.contains("optifine.OptiFine") {
            ModLoader::OptiFine
        } else if arguman_str.contains("--neoforge") || arguman_str.contains("net.neoforged") {
            ModLoader::NeoForge
        } else if arguman_str.contains("--liteloader") {
            ModLoader::LiteLoader
        } else if arguman_str.contains("--rift") {
            ModLoader::Rift
        } else {
            ModLoader::Vanilla
        }
    }

    fn versiyon_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for arg in argumanlar {
            // --version=1.20.1 formatı
            if let Some(ver) = arg.strip_prefix("--version=") {
                return Some(ver.to_string());
            }
            // --version 1.20.1 formatı
            if arg == "--version" {
                // Bir sonraki argüman versiyon olabilir
                continue;
            }
            // -Dminecraft.jar=1.20.1.jar formatı
            if let Some(jar) = arg.strip_prefix("-Dminecraft.jar=") {
                if let Some(ver) = jar.strip_suffix(".jar") {
                    return Some(ver.to_string());
                }
            }
            // minecraft-1.20.1.jar formatı
            if let Some(ver) = arg.strip_prefix("minecraft-") {
                if let Some(ver) = ver.strip_suffix(".jar") {
                    return Some(ver.to_string());
                }
            }
        }
        None
    }

    fn fabric_versiyonu_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for arg in argumanlar {
            if let Some(ver) = arg.strip_prefix("--fabric-version=") {
                return Some(ver.to_string());
            }
            if arg.contains("fabric-loader") {
                if let Some(start) = arg.find("fabric-loader-") {
                    let part = &arg[start + 14..];
                    if let Some(end) = part.find('-') {
                        return Some(part[..end].to_string());
                    }
                }
            }
        }
        None
    }

    fn forge_versiyonu_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for arg in argumanlar {
            if let Some(ver) = arg.strip_prefix("--forge-version=") {
                return Some(ver.to_string());
            }
            if arg.contains("forge") && arg.contains('-') {
                if let Some(start) = arg.find("forge-") {
                    let part = &arg[start + 6..];
                    if let Some(end) = part.find('-') {
                        return Some(part[..end].to_string());
                    }
                }
            }
        }
        None
    }

    fn quilt_versiyonu_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for arg in argumanlar {
            if let Some(ver) = arg.strip_prefix("--quilt-version=") {
                return Some(ver.to_string());
            }
            if arg.contains("quilt-loader") {
                if let Some(start) = arg.find("quilt-loader-") {
                    let part = &arg[start + 13..];
                    if let Some(end) = part.find('-') {
                        return Some(part[..end].to_string());
                    }
                }
            }
        }
        None
    }

    fn optifine_versiyonu_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for arg in argumanlar {
            if let Some(ver) = arg.strip_prefix("--optifine-version=") {
                return Some(ver.to_string());
            }
            if arg.contains("OptiFine") {
                if let Some(start) = arg.find("OptiFine_") {
                    let part = &arg[start + 9..];
                    return Some(part.to_string());
                }
            }
        }
        None
    }

    fn java_versiyonu_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for arg in argumanlar {
            if arg.contains("java") && arg.contains('-') {
                // java-17.0.1.jar formatı
                if let Some(start) = arg.find("java-") {
                    let part = &arg[start + 5..];
                    if let Some(end) = part.find('.') {
                        return Some(part[..end].to_string());
                    }
                }
            }
            // -version:17 formatı
            if let Some(ver) = arg.strip_prefix("-version:") {
                return Some(ver.to_string());
            }
        }
        None
    }

    fn main_class_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for (i, arg) in argumanlar.iter().enumerate() {
            if arg == "--mainClass" || arg == "-mainClass" {
                if let Some(class) = argumanlar.get(i + 1) {
                    return Some(class.clone());
                }
            }
            if let Some(class) = arg.strip_prefix("--mainClass=") {
                return Some(class.to_string());
            }
            if let Some(class) = arg.strip_prefix("-mainClass=") {
                return Some(class.to_string());
            }
        }
        None
    }

    fn classpath_tespit(&self, argumanlar: &[String]) -> Option<String> {
        for (i, arg) in argumanlar.iter().enumerate() {
            if arg == "--classpath" || arg == "-classpath" || arg == "-cp" {
                if let Some(cp) = argumanlar.get(i + 1) {
                    return Some(cp.clone());
                }
            }
            if let Some(cp) = arg.strip_prefix("--classpath=") {
                return Some(cp.to_string());
            }
            if let Some(cp) = arg.strip_prefix("-classpath=") {
                return Some(cp.to_string());
            }
            if let Some(cp) = arg.strip_prefix("-cp=") {
                return Some(cp.to_string());
            }
        }
        None
    }

    pub fn process_listesini_tara(&self, sys: &System) -> Vec<(u32, String, MinecraftBilgi)> {
        let mut sonuclar = Vec::new();

        for (pid, process) in sys.processes() {
            let process_adi = process.name().to_string_lossy().to_string();

            if self.minecraft_mi(&process_adi) {
                let argumanlar: Vec<String> = process.cmd().iter()
                    .map(|s| s.to_string_lossy().to_string())
                    .collect();

                let bilgi = self.argumanlari_analiz_et(&argumanlar);
                sonuclar.push((pid.as_u32(), process_adi, bilgi));
            }
        }

        sonuclar
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MinecraftIstatistikleri {
    pub toplam_oturum: u32,
    pub toplam_sure: u64,
    pub en_cok_kullanilan_mod_loader: Option<ModLoader>,
    pub mod_loader_kullanimi: HashMap<String, u32>,
    pub son_oturumlar: Vec<MinecraftOturumu>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MinecraftOturumu {
    pub baslama_zamani: String,
    pub sure: u64,
    pub mod_loader: ModLoader,
    pub surum: Option<String>,
}

impl MinecraftIstatistikleri {
    pub fn yeni() -> Self {
        MinecraftIstatistikleri {
            toplam_oturum: 0,
            toplam_sure: 0,
            en_cok_kullanilan_mod_loader: None,
            mod_loader_kullanimi: HashMap::new(),
            son_oturumlar: Vec::new(),
        }
    }

    pub fn oturum_ekle(&mut self, oturum: MinecraftOturumu) {
        self.toplam_oturum += 1;
        self.toplam_sure += oturum.sure;

        let loader_adi = oturum.mod_loader.adi().to_string();
        *self.mod_loader_kullanimi.entry(loader_adi).or_insert(0) += 1;

        // En çok kullanılan loader'ı güncelle
        let mut max_count = 0;
        let mut max_loader = None;
        for (loader, count) in &self.mod_loader_kullanimi {
            if *count > max_count {
                max_count = *count;
                max_loader = Some(match loader.as_str() {
                    "Fabric" => ModLoader::Fabric,
                    "Forge" => ModLoader::Forge,
                    "Quilt" => ModLoader::Quilt,
                    "OptiFine" => ModLoader::OptiFine,
                    "NeoForge" => ModLoader::NeoForge,
                    _ => ModLoader::Vanilla,
                });
            }
        }
        self.en_cok_kullanilan_mod_loader = max_loader;

        self.son_oturumlar.push(oturum);
        if self.son_oturumlar.len() > 10 {
            self.son_oturumlar.remove(0);
        }
    }
}
