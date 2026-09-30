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

## 👨‍💻 Geliştirici

**Nihat Yazgan** — Yazgan Bilişim  
GitHub: [@nihatyazgan1962](https://github.com/nihatyazgan1962)
