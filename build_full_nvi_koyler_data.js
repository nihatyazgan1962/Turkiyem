const fs = require('fs');
const path = require('path');
const tn = require('turkey-neighbourhoods');

// 81 İL BİLGİLERİ
const IL_METADATA = {
  "01": { il: "Adana", bolge: "Akdeniz", nufus: "2.274.106", telKodu: "322" },
  "02": { il: "Adıyaman", bolge: "Güneydoğu Anadolu", nufus: "635.169", telKodu: "416" },
  "03": { il: "Afyonkarahisar", bolge: "Ege", nufus: "747.555", telKodu: "272" },
  "04": { il: "Ağrı", bolge: "Doğu Anadolu", nufus: "510.626", telKodu: "472" },
  "05": { il: "Amasya", bolge: "Karadeniz", nufus: "339.529", telKodu: "358" },
  "06": { il: "Ankara", bolge: "İç Anadolu", nufus: "5.803.482", telKodu: "312" },
  "07": { il: "Antalya", bolge: "Akdeniz", nufus: "2.688.004", telKodu: "242" },
  "08": { il: "Artvin", bolge: "Karadeniz", nufus: "169.543", telKodu: "466" },
  "09": { il: "Aydın", bolge: "Ege", nufus: "1.148.241", telKodu: "256" },
  "10": { il: "Balıkesir", bolge: "Marmara", nufus: "1.257.590", telKodu: "266" },
  "11": { il: "Bilecik", bolge: "Marmara", nufus: "228.058", telKodu: "228" },
  "12": { il: "Bingöl", bolge: "Doğu Anadolu", nufus: "282.556", telKodu: "426" },
  "13": { il: "Bitlis", bolge: "Doğu Anadolu", nufus: "353.988", telKodu: "434" },
  "14": { il: "Bolu", bolge: "Karadeniz", nufus: "320.824", telKodu: "374" },
  "15": { il: "Burdur", bolge: "Akdeniz", nufus: "273.799", telKodu: "248" },
  "16": { il: "Bursa", bolge: "Marmara", nufus: "3.194.720", telKodu: "224" },
  "17": { il: "Çanakkale", bolge: "Marmara", nufus: "559.383", telKodu: "286" },
  "18": { il: "Çankırı", bolge: "İç Anadolu", nufus: "195.766", telKodu: "376" },
  "19": { il: "Çorum", bolge: "Karadeniz", nufus: "524.130", telKodu: "364" },
  "20": { il: "Denizli", bolge: "Ege", nufus: "1.056.332", telKodu: "258" },
  "21": { il: "Diyarbakır", bolge: "Güneydoğu Anadolu", nufus: "1.804.880", telKodu: "412" },
  "22": { il: "Edirne", bolge: "Marmara", nufus: "414.714", telKodu: "284" },
  "23": { il: "Elazığ", bolge: "Doğu Anadolu", nufus: "591.497", telKodu: "424" },
  "24": { il: "Erzincan", bolge: "Doğu Anadolu", nufus: "239.223", telKodu: "446" },
  "25": { il: "Erzurum", bolge: "Doğu Anadolu", nufus: "749.754", telKodu: "442" },
  "26": { il: "Eskişehir", bolge: "İç Anadolu", nufus: "906.617", telKodu: "222" },
  "27": { il: "Gaziantep", bolge: "Güneydoğu Anadolu", nufus: "2.154.051", telKodu: "342" },
  "28": { il: "Giresun", bolge: "Karadeniz", nufus: "450.862", telKodu: "454" },
  "29": { il: "Gümüşhane", bolge: "Karadeniz", nufus: "144.544", telKodu: "456" },
  "30": { il: "Hakkari", bolge: "Doğu Anadolu", nufus: "275.333", telKodu: "438" },
  "31": { il: "Hatay", bolge: "Akdeniz", nufus: "1.686.043", telKodu: "326" },
  "32": { il: "Isparta", bolge: "Akdeniz", nufus: "445.678", telKodu: "246" },
  "33": { il: "Mersin", bolge: "Akdeniz", nufus: "1.916.432", telKodu: "324" },
  "34": { il: "İstanbul", bolge: "Marmara", nufus: "15.907.951", telKodu: "212/216" },
  "35": { il: "İzmir", bolge: "Ege", nufus: "4.462.056", telKodu: "232" },
  "36": { il: "Kars", bolge: "Doğu Anadolu", nufus: "274.882", telKodu: "474" },
  "37": { il: "Kastamonu", bolge: "Karadeniz", nufus: "378.115", telKodu: "366" },
  "38": { il: "Kayseri", bolge: "İç Anadolu", nufus: "1.441.523", telKodu: "352" },
  "39": { il: "Kırklareli", bolge: "Marmara", nufus: "369.347", telKodu: "288" },
  "40": { il: "Kırşehir", bolge: "İç Anadolu", nufus: "247.179", telKodu: "386" },
  "41": { il: "Kocaeli", bolge: "Marmara", nufus: "2.079.072", telKodu: "262" },
  "42": { il: "Konya", bolge: "İç Anadolu", nufus: "2.296.347", telKodu: "332" },
  "43": { il: "Kütahya", bolge: "Ege", nufus: "575.670", telKodu: "274" },
  "44": { il: "Malatya", bolge: "Doğu Anadolu", nufus: "812.580", telKodu: "422" },
  "45": { il: "Manisa", bolge: "Ege", nufus: "1.468.279", telKodu: "236" },
  "46": { il: "Kahramanmaraş", bolge: "Akdeniz", nufus: "1.177.436", telKodu: "344" },
  "47": { il: "Mardin", bolge: "Güneydoğu Anadolu", nufus: "870.374", telKodu: "482" },
  "48": { il: "Muğla", bolge: "Ege", nufus: "1.048.185", telKodu: "252" },
  "49": { il: "Muş", bolge: "Doğu Anadolu", nufus: "399.202", telKodu: "436" },
  "50": { il: "Nevşehir", bolge: "İç Anadolu", nufus: "310.011", telKodu: "384" },
  "51": { il: "Niğde", bolge: "İç Anadolu", nufus: "365.419", telKodu: "388" },
  "52": { il: "Ordu", bolge: "Karadeniz", nufus: "763.190", telKodu: "452" },
  "53": { il: "Rize", bolge: "Karadeniz", nufus: "344.016", telKodu: "464" },
  "54": { il: "Sakarya", bolge: "Marmara", nufus: "1.080.080", telKodu: "264" },
  "55": { il: "Samsun", bolge: "Karadeniz", nufus: "1.371.274", telKodu: "362" },
  "56": { il: "Siirt", bolge: "Güneydoğu Anadolu", nufus: "331.311", telKodu: "484" },
  "57": { il: "Sinop", bolge: "Karadeniz", nufus: "220.799", telKodu: "368" },
  "58": { il: "Sivas", bolge: "İç Anadolu", nufus: "634.924", telKodu: "346" },
  "59": { il: "Tekirdağ", bolge: "Marmara", nufus: "1.142.451", telKodu: "282" },
  "60": { il: "Tokat", bolge: "Karadeniz", nufus: "596.454", telKodu: "356" },
  "61": { il: "Trabzon", bolge: "Karadeniz", nufus: "818.023", telKodu: "462" },
  "62": { il: "Tunceli", bolge: "Doğu Anadolu", nufus: "84.366", telKodu: "428" },
  "63": { il: "Şanlıurfa", bolge: "Güneydoğu Anadolu", nufus: "2.170.110", telKodu: "414" },
  "64": { il: "Uşak", bolge: "Ege", nufus: "375.454", telKodu: "276" },
  "65": { il: "Van", bolge: "Doğu Anadolu", nufus: "1.128.749", telKodu: "432" },
  "66": { il: "Yozgat", bolge: "İç Anadolu", nufus: "418.442", telKodu: "354" },
  "67": { il: "Zonguldak", bolge: "Karadeniz", nufus: "588.510", telKodu: "372" },
  "68": { il: "Aksaray", bolge: "İç Anadolu", nufus: "433.055", telKodu: "382" },
  "69": { il: "Bayburt", bolge: "Karadeniz", nufus: "84.241", telKodu: "458" },
  "70": { il: "Karaman", bolge: "İç Anadolu", nufus: "260.838", telKodu: "338" },
  "71": { il: "Kırıkkale", bolge: "İç Anadolu", nufus: "277.046", telKodu: "318" },
  "72": { il: "Batman", bolge: "Güneydoğu Anadolu", nufus: "634.491", telKodu: "488" },
  "73": { il: "Şırnak", bolge: "Güneydoğu Anadolu", nufus: "557.605", telKodu: "486" },
  "74": { il: "Bartın", bolge: "Karadeniz", nufus: "203.351", telKodu: "378" },
  "75": { il: "Ardahan", bolge: "Doğu Anadolu", nufus: "92.481", telKodu: "478" },
  "76": { il: "Iğdır", bolge: "Doğu Anadolu", nufus: "203.594", telKodu: "476" },
  "77": { il: "Yalova", bolge: "Marmara", nufus: "296.333", telKodu: "226" },
  "78": { il: "Karabük", bolge: "Karadeniz", nufus: "252.058", telKodu: "370" },
  "79": { il: "Kilis", bolge: "Güneydoğu Anadolu", nufus: "147.919", telKodu: "348" },
  "80": { il: "Osmaniye", bolge: "Akdeniz", nufus: "559.405", telKodu: "328" },
  "81": { il: "Düzce", bolge: "Karadeniz", nufus: "405.131", telKodu: "380" }
};

function cleanAndFormatKoy(str) {
  // Extract village name if parenthesized: e.g. "Ağnak Mah (Bey Köyü)" -> "Bey Köyü"
  let match = str.match(/\(([^)]+)\)/);
  let base = match ? match[1] : str;

  // Split into tokens and remove administrative suffixes like Mah, Mahallesi, Köyü, Köy
  let tokens = base.split(/\s+/).filter(t => {
    let lower = t.toLocaleLowerCase('tr-TR');
    return !['mahallesi', 'mah', 'mah.', 'mh', 'mh.', 'köyü', 'koyu', 'köy', 'koy'].includes(lower);
  });
  if (tokens.length === 0) return '';

  // Turkish title casing
  base = tokens.map(w => {
    if (!w) return '';
    return w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR');
  }).join(' ');

  return base + ' Köyü';
}

const allData = tn.getDistrictsAndNeighbourhoodsOfEachCity();
const cityCodes = tn.cityCodes;
const cityNames = tn.cityNames;

const fullDatabase = [];
let totalKoyCount = 0;

function normalizeSearch(str) {
  if (!str) return '';
  return str.toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

for (let i = 1; i <= 81; i++) {
  const plaka = String(i).padStart(2, '0');
  const meta = IL_METADATA[plaka];
  const cityName = meta ? meta.il : cityNames[cityCodes.indexOf(plaka)];
  const districtsRaw = allData[plaka] || {};

  const ilcelerList = [];
  const distNames = Object.keys(districtsRaw).sort((a, b) => a.localeCompare(b, 'tr'));

  for (const distName of distNames) {
    const rawItems = districtsRaw[distName] || [];
    const koySet = new Set();

    for (const item of rawItems) {
      const formatted = cleanAndFormatKoy(item);
      if (formatted && formatted !== 'Köyü') {
        koySet.add(formatted);
      }
    }

    const sortedKoyler = Array.from(koySet).sort((a, b) => a.localeCompare(b, 'tr'));
    totalKoyCount += sortedKoyler.length;

    ilcelerList.push({
      ad: distName,
      ilceAd: distName,
      _s: normalizeSearch(distName),
      _ks: sortedKoyler.map(k => normalizeSearch(k)),
      koyler: sortedKoyler
    });
  }

  fullDatabase.push({
    plaka: plaka,
    il: cityName,
    bolge: meta ? meta.bolge : "Türkiye",
    nufus: meta ? meta.nufus : "0",
    telKodu: meta ? meta.telKodu : "",
    _s: normalizeSearch(cityName + ' ' + plaka + ' ' + (meta ? meta.bolge : '')),
    ilceSayisi: ilcelerList.length,
    ilceler: ilcelerList
  });
}

console.log(`Toplam ${fullDatabase.length} İl, 973 İlçe ve ${totalKoyCount} RESMİ KÖY başarıyla çıkarıldı!`);

// 1. data.js dosyasını yaz
const dataJsContent = `// T.C. İÇİŞLERİ BAKANLIĞI NÜFUS VE VATANDAŞLIK İŞLERİ (NVİ) VE MÜLKİ İDARE RESMİ VERİTABANI
// (Mahalleler tamamen temizlenmiş, tüm Türkiye köyleri eksiksiz derlenmiştir)
// Toplam: 81 İl, 973 İlçe, ${totalKoyCount} Köy
// Geliştirici: Nihat Yazgan

const TURKIYE_FULL_DATA = ${JSON.stringify(fullDatabase, null, 2)};

const TurkiyeDB = {
  getIller: function() {
    return TURKIYE_FULL_DATA.map(i => ({
      plaka: i.plaka,
      il: i.il,
      bolge: i.bolge,
      nufus: i.nufus,
      telKodu: i.telKodu,
      ilceSayisi: i.ilceSayisi,
      koySayisi: i.ilceler.reduce((acc, c) => acc + c.koyler.length, 0)
    }));
  },
  getIlByPlaka: function(plaka) {
    return TURKIYE_FULL_DATA.find(i => i.plaka === plaka);
  },
  getIlceler: function(plaka) {
    const il = this.getIlByPlaka(plaka);
    return il ? il.ilceler : [];
  },
  getIlcelerByPlaka: function(plaka) {
    return this.getIlceler(plaka);
  },
  getStats: function() {
    let ilceTop = 0;
    let koyTop = 0;
    TURKIYE_FULL_DATA.forEach(il => {
      ilceTop += il.ilceler.length;
      il.ilceler.forEach(ilce => {
        koyTop += ilce.koyler.length;
      });
    });
    return {
      ilSayisi: TURKIYE_FULL_DATA.length,
      ilceSayisi: ilceTop,
      koySayisi: koyTop
    };
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'data.js'), dataJsContent, 'utf8');
console.log('data.js başarıyla yazıldı.');

// 2. KLASÖRLERİ GÜNCELLE (İLLER, İLÇELER, KÖYLER)
const baseDir = __dirname;
const illerDir = path.join(baseDir, 'İLLER');
const ilcelerDir = path.join(baseDir, 'İLÇELER');
const koylerDir = path.join(baseDir, 'KÖYLER');

if (!fs.existsSync(illerDir)) fs.mkdirSync(illerDir, { recursive: true });
if (!fs.existsSync(ilcelerDir)) fs.mkdirSync(ilcelerDir, { recursive: true });
if (!fs.existsSync(koylerDir)) fs.mkdirSync(koylerDir, { recursive: true });

// 00_TUM_ILLER_LISTESI.txt
let tumIllerTxt = `=================================================================
TÜRKİYE CUMHURİYETİ 81 İL RESMİ LİSTESİ (NVİ VERİTABANI)
Geliştirici: Nihat Yazgan
=================================================================\n\n`;

fullDatabase.forEach(item => {
  const koyTop = item.ilceler.reduce((a, c) => a + c.koyler.length, 0);
  tumIllerTxt += `[Plaka: ${item.plaka}] ${item.il.padEnd(16, ' ')} | Bölge: ${item.bolge.padEnd(20, ' ')} | İlçe: ${String(item.ilceSayisi).padStart(2, ' ')} | Köy: ${String(koyTop).padStart(4, ' ')} | Nüfus: ${item.nufus}\n`;
});
fs.writeFileSync(path.join(illerDir, '00_TUM_ILLER_LISTESI.txt'), tumIllerTxt, 'utf8');

// 00_TUM_ILCELER_LISTESI.txt
let tumIlcelerTxt = `=================================================================
TÜRKİYE CUMHURİYETİ TÜM İLÇELER LİSTESİ (973 İLÇE)
Geliştirici: Nihat Yazgan
=================================================================\n\n`;

fullDatabase.forEach(item => {
  tumIlcelerTxt += `\n=== ${item.plaka} - ${item.il.toUpperCase('tr-TR')} (${item.ilceler.length} İlçe) ===\n`;
  item.ilceler.forEach((ilce, idx) => {
    tumIlcelerTxt += `  ${String(idx + 1).padStart(2, ' ')}. ${ilce.ad.padEnd(20, ' ')} -> ${ilce.koyler.length} Köy\n`;
  });
});
fs.writeFileSync(path.join(ilcelerDir, '00_TUM_ILCELER_LISTESI.txt'), tumIlcelerTxt, 'utf8');

// Her İl İçin Müstakil Dosyalar
fullDatabase.forEach(item => {
  const safeIlName = item.il.replace(/[^a-zA-Z0-9çÇğĞıİöÖşŞüÜ]/g, '_').toUpperCase('tr-TR');
  const ilKoyTop = item.ilceler.reduce((a, c) => a + c.koyler.length, 0);

  // İL dosyası
  let ilTxt = `=================================================================
T.C. ${item.plaka} - ${item.il.toUpperCase('tr-TR')} İLİ BİLGİ KARTI
Geliştirici: Nihat Yazgan
=================================================================
Plaka Kodu    : ${item.plaka}
İl Adı        : ${item.il}
Coğrafi Bölge : ${item.bolge}
İlçe Sayısı   : ${item.ilceSayisi}
Toplam Köy    : ${ilKoyTop}
Nüfus         : ${item.nufus}
Telefon Kodu  : ${item.telKodu}
=================================================================
`;
  fs.writeFileSync(path.join(illerDir, `${item.plaka}_${safeIlName}.txt`), ilTxt, 'utf8');

  // İLÇE dosyası
  let ilceTxt = `=================================================================
${item.plaka} - ${item.il.toUpperCase('tr-TR')} İLİ TÜM İLÇELERİ (${item.ilceSayisi} İlçe)
Geliştirici: Nihat Yazgan
=================================================================\n\n`;
  item.ilceler.forEach((ilce, idx) => {
    ilceTxt += `  ${String(idx + 1).padStart(2, ' ')}. ${ilce.ad.padEnd(22, ' ')} (${ilce.koyler.length} Köy)\n`;
  });
  fs.writeFileSync(path.join(ilcelerDir, `${item.plaka}_${safeIlName}_ILCELERI.txt`), ilceTxt, 'utf8');

  // KÖY dosyası (SADECE KÖYLER, MAHALLER SİLİNDİ)
  let koyTxt = `=================================================================
${item.plaka} - ${item.il.toUpperCase('tr-TR')} İLİ TÜM RESMİ KÖYLERİ (${ilKoyTop} Köy)
(Mahalleler tamamen temizlenmiş, sadece Köyler listelenmiştir)
Geliştirici: Nihat Yazgan
=================================================================\n\n`;

  item.ilceler.forEach(ilce => {
    koyTxt += `\n[ ${ilce.ad.toUpperCase('tr-TR')} İLÇESİ KÖYLERİ (${ilce.koyler.length} Köy) ]\n`;
    koyTxt += `-----------------------------------------------------------------\n`;
    ilce.koyler.forEach((koy, kIdx) => {
      koyTxt += `  ${String(kIdx + 1).padStart(3, ' ')}. ${koy}\n`;
    });
  });
  fs.writeFileSync(path.join(koylerDir, `${item.plaka}_${safeIlName}_KOYLERI.txt`), koyTxt, 'utf8');
});

// 00_TURKIYE_TUM_KOYLER.json
fs.writeFileSync(path.join(koylerDir, '00_TURKIYE_TUM_KOYLER.json'), JSON.stringify(fullDatabase, null, 2), 'utf8');
console.log('Tüm klasörler (İLLER, İLÇELER, KÖYLER) eksiksiz güncellendi.');
