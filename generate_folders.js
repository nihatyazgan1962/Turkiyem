const fs = require('fs');
const path = require('path');

// Require or read data
const dataJs = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
eval(dataJs + '\nglobalThis.TurkiyeDB = TurkiyeDB;');
const TurkiyeDB = globalThis.TurkiyeDB;

const baseDir = __dirname;
const illerDir = path.join(baseDir, 'İLLER');
const ilcelerDir = path.join(baseDir, 'İLÇELER');
const koylerDir = path.join(baseDir, 'KÖYLER');

[illerDir, ilcelerDir, koylerDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. İLLER KLASÖRÜ
const iller = TurkiyeDB.getIller();
let illerIndexText = `# TÜRKİYE'NİN 81 İLİ SIRALI LİSTESİ\n\n`;
iller.forEach(il => {
  const ilceler = TurkiyeDB.getIlceler(il.plaka);
  illerIndexText += `${il.plaka} - ${il.il} (Bölge: ${il.bolge}, Nüfus: ${il.nufus}, İlçe Sayısı: ${ilceler.length})\n`;
  
  // Her il için kendi detay dosyası
  let ilDetail = `=========================================================\n`;
  ilDetail += `TÜRKİYE CUMHURİYETİ - ${il.plaka} ${il.il.toUpperCase()} İLİ\n`;
  ilDetail += `=========================================================\n\n`;
  ilDetail += `Plaka Kodu    : ${il.plaka}\n`;
  ilDetail += `İl Adı        : ${il.il}\n`;
  ilDetail += `Coğrafi Bölge : ${il.bolge}\n`;
  ilDetail += `Nüfus         : ${il.nufus}\n`;
  ilDetail += `Telefon Kodu  : +90 (${il.telKodu})\n`;
  ilDetail += `İlçe Sayısı   : ${ilceler.length}\n\n`;
  ilDetail += `--- İLÇELERİ ---\n`;
  ilceler.forEach((ilce, idx) => {
    ilDetail += `${idx + 1}. ${ilce.ilceAd} (${ilce.koyler.length} Köy/Mahalle)\n`;
  });
  
  fs.writeFileSync(path.join(illerDir, `${il.plaka}_${il.il}.txt`), ilDetail, 'utf8');
});
fs.writeFileSync(path.join(illerDir, `00_TUM_ILLER_SIRALI_LISTE.txt`), illerIndexText, 'utf8');

// 2. İLÇELER KLASÖRÜ
const allIlceler = TurkiyeDB.getAllIlcelerFlat();
let ilcelerIndexText = `# TÜRKİYE'NİN TÜM İLÇELERİ SIRALI LİSTESİ (${allIlceler.length} İLÇE)\n\n`;
allIlceler.forEach((ilce, idx) => {
  ilcelerIndexText += `${(idx + 1).toString().padStart(3, '0')}. ${ilce.ilceAd} (${ilce.plaka} - ${ilce.ilAd}, ${ilce.bolge}) -> ${ilce.koySayisi} Köy\n`;
});
fs.writeFileSync(path.join(ilcelerDir, `00_TUM_ILCELER_SIRALI_LISTE.txt`), ilcelerIndexText, 'utf8');

// İlçeleri alfabetik harf harf ve il bazlı dosyalara böl
iller.forEach(il => {
  const ilceler = TurkiyeDB.getIlceler(il.plaka);
  let ilceText = `=========================================================\n`;
  ilceText += `${il.plaka} - ${il.il.toUpperCase()} İLİ İLÇELERİ\n`;
  ilceText += `=========================================================\n\n`;
  ilceler.forEach((ilce, idx) => {
    ilceText += `${idx + 1}. ${ilce.ilceAd} -> ${ilce.koyler.length} Köy/Mahalle\n`;
  });
  fs.writeFileSync(path.join(ilcelerDir, `${il.plaka}_${il.il}_Ilceleri.txt`), ilceText, 'utf8');
});

// 3. KÖYLER KLASÖRÜ
iller.forEach(il => {
  const ilceler = TurkiyeDB.getIlceler(il.plaka);
  let koyText = `=================================================================\n`;
  koyText += `${il.plaka} - ${il.il.toUpperCase()} İLİ KÖYLERİ VE MAHALLELERİ\n`;
  koyText += `=================================================================\n\n`;
  
  ilceler.forEach(ilce => {
    koyText += `\n[ ${ilce.ilceAd.toUpperCase()} İLÇESİ KÖYLERİ (${ilce.koyler.length} Adet) ]\n`;
    koyText += `-----------------------------------------------------------------\n`;
    ilce.koyler.forEach((koy, kIdx) => {
      koyText += `  ${(kIdx + 1).toString().padStart(2, ' ')}. ${koy}\n`;
    });
  });
  
  fs.writeFileSync(path.join(koylerDir, `${il.plaka}_${il.il}_Koyleri.txt`), koyText, 'utf8');
});

console.log('Klasörler ve dosyalar başarıyla oluşturuldu: İLLER, İLÇELER, KÖYLER');
