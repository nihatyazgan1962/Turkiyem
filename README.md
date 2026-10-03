# 🇹🇷 Türkiyem — İller, İlçeler ve Köyler Rehberi

Türkiye'nin tüm illerini, ilçelerini ve köylerini listeleyen, tam ekran Türk bayrağı animasyonu içeren bir Android uygulamasıdır.

## ✨ Özellikler

- 🗺️ Türkiye'nin tüm illeri (81 il)
- 🏘️ İlçe ve köy listesi (tam veri seti)
- 🔍 İl/İlçe/Köy arama
- 🇹🇷 Tam ekran animasyonlu Türk Bayrağı
- 📊 Nüfus ve coğrafi bilgiler
- 📱 Android APK (Capacitor wrapper)
- 📴 Çevrimdışı çalışma (yerel veri)

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| Veri | turkey-neighbourhoods (npm paketi) |
| Coğrafi Veri | JSON (İller/İlçeler/Köyler klasörleri) |
| Mobil Wrapper | Capacitor 6.x |
| Platform | Android APK |

## 📋 Gereksinimler

- Node.js 18+
- Android Studio
- Java 17+
- Android SDK 21+

## 🚀 Kurulum

```bash
npm install
npx cap sync android
npx cap open android
```

### APK Derleme
```powershell
.\apk_yap.ps1
# veya
.\apk_yap.bat
```

## 📁 Proje Yapısı

```
├── android/          # Android native proje
├── İLLER/            # İl verileri (JSON)
├── İLÇELER/          # İlçe verileri (JSON)
├── KÖYLER/           # Köy verileri (JSON)
└── package.json
```

## 📞 İletişim

<div align="center">

[![E-posta](https://img.shields.io/badge/E--posta-yazganbilisim2026@gmail.com-00b4d8?style=for-the-badge&logo=gmail&logoColor=white&labelColor=0d1117)](mailto:yazganbilisim2026@gmail.com)
[![Diğer Uygulamalarımız](https://img.shields.io/badge/Diğer_Uygulamalarımız-Tüm_Projeler-00b4d8?style=for-the-badge&logo=android&logoColor=white&labelColor=0d1117)](https://github.com/nihatyazgan1962?tab=repositories)

**Yazgan Bilişim**

</div>
