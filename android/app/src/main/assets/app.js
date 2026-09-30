/**
 * TÜRKİYEM - İLLER > İLÇELER > KÖYLER HİYERARŞİK SİSTEMİ
 * İl, İlçe ve Köyler İçin Özet Bilgi ve Hızlı Arama Motoru
 * Geliştirici: Nihat Yazgan
 */

const app = {
  rawQuery: '',
  searchQuery: '',
  searchTimer: null,
  expandedIller: new Set(),
  expandedIlceler: new Set(),
  fullyExpandedDistricts: new Set(),
  currentInfoData: null,
  settings: {
    wave: true,
    glow: true,
    autoExpand: false
  },

  init: function() {
    this.loadSettings();
    this.initEventListeners();
    this.renderMainTree();
  },

  // Türkçe karakter normalizasyonu (hızlı arama için)
  normalize: function(str) {
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
  },

  // Ayarları localStorage'dan yükle
  loadSettings: function() {
    try {
      const saved = localStorage.getItem('turkiyem_settings');
      if (saved) {
        this.settings = Object.assign(this.settings, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Ayarlar yüklenemedi:', e);
    }
    this.applySettingsToDOM();
  },

  saveSettings: function() {
    try {
      localStorage.setItem('turkiyem_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Ayarlar kaydedilemedi:', e);
    }
  },

  applySettingsToDOM: function() {
    const waveEl = document.getElementById('flagWave');
    const emblemEl = document.getElementById('flagEmblem');
    const toggleWave = document.getElementById('toggleWave');
    const toggleGlow = document.getElementById('toggleGlow');
    const toggleAuto = document.getElementById('toggleAutoExpand');

    if (waveEl) waveEl.style.display = this.settings.wave ? 'block' : 'none';
    if (emblemEl) emblemEl.classList.toggle('no-glow', !this.settings.glow);
    if (toggleWave) toggleWave.checked = this.settings.wave;
    if (toggleGlow) toggleGlow.checked = this.settings.glow;
    if (toggleAuto) toggleAuto.checked = this.settings.autoExpand;
  },

  toggleSetting: function(key) {
    if (key === 'wave') {
      this.settings.wave = document.getElementById('toggleWave').checked;
    } else if (key === 'glow') {
      this.settings.glow = document.getElementById('toggleGlow').checked;
    } else if (key === 'autoExpand') {
      this.settings.autoExpand = document.getElementById('toggleAutoExpand').checked;
    }
    this.saveSettings();
    this.applySettingsToDOM();
  },

  openSettings: function() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('active');
  },

  closeSettings: function() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('active');
  },

  // =========================================================================
  // ÖZET BİLGİ MODAL YÖNETİMİ (İL, İLÇE VE KÖY İÇİN)
  // =========================================================================
  openIlDetail: function(plaka, event) {
    if (event) event.stopPropagation();
    const il = TurkiyeDB.getIlByPlaka(plaka);
    if (!il) return;

    const koyTop = il.ilceler.reduce((a, c) => a + c.koyler.length, 0);

    this.currentInfoData = {
      type: 'il',
      name: il.il,
      query: `${il.il}, Türkiye`,
      search: `${il.il} ili tarihi gezilecek yerler nüfusu`,
      text: `🏛️ İl: ${il.il} (Plaka: ${plaka})\n🧭 Coğrafi Bölge: ${il.bolge} Bölgesi\n🏢 Toplam İlçe: ${il.ilceSayisi} İlçe\n🏡 Toplam Köy: ${koyTop} Köy\n👥 Toplam Nüfus: ${il.nufus} Kişi\n📞 Alan Kodu: ${il.telKodu ? '0' + il.telKodu : '-'}\n📜 Kaynak: TÜRKİYEM Rehberi (Geliştirici: Nihat Yazgan)`
    };

    const gridHtml = `
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏛️ İl Adı & Plaka</div>
        <div class="koy-detail-value">${il.il} (${plaka})</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🧭 Coğrafi Bölge</div>
        <div class="koy-detail-value">${il.bolge} Bölgesi</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏢 Toplam İlçe Sayısı</div>
        <div class="koy-detail-value">${il.ilceSayisi} İlçe</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏡 Toplam Köy Sayısı</div>
        <div class="koy-detail-value" style="color: #34D399;">${koyTop} Köy</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">👥 İl Toplam Nüfusu</div>
        <div class="koy-detail-value">${il.nufus} Kişi</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">📞 Telefon Alan Kodu</div>
        <div class="koy-detail-value">${il.telKodu ? '0' + il.telKodu : '-'}</div>
      </div>
    `;

    const descHtml = `📍 <strong>${il.il}</strong>, Türkiye Cumhuriyeti'nin <strong>${il.bolge} Bölgesi</strong> sınırları içerisinde bulunan; <strong>${il.ilceSayisi} ilçesi</strong> ve <strong>${koyTop} resmi köyü</strong> ile ülkemizin önemli mülki, tarihi ve kültürel merkezlerinden biridir.`;

    this.showDetailModal('🏛️', `${il.il} İli (Plaka: ${plaka})`, `${il.bolge} Bölgesi • ${il.ilceSayisi} İlçe • ${koyTop} Köy`, gridHtml, descHtml);
  },

  openIlceDetail: function(plaka, ilceAd, event) {
    if (event) event.stopPropagation();
    const il = TurkiyeDB.getIlByPlaka(plaka);
    if (!il) return;

    const ilce = il.ilceler.find(c => c.ilceAd === ilceAd);
    const koySayisi = ilce ? ilce.koyler.length : 0;

    this.currentInfoData = {
      type: 'ilce',
      name: ilceAd,
      query: `${ilceAd}, ${il.il}, Türkiye`,
      search: `${ilceAd} ${il.il} ilçesi tarihi gezilecek yerler ve bilgileri`,
      text: `🏢 İlçe: ${ilceAd}\n🏛️ Bağlı Olduğu İl: ${il.il} (Plaka: ${plaka})\n🧭 Coğrafi Bölge: ${il.bolge} Bölgesi\n🏡 Toplam Köy: ${koySayisi} Köy\n📞 İl Alan Kodu: ${il.telKodu ? '0' + il.telKodu : '-'}\n📜 Kaynak: TÜRKİYEM Rehberi (Geliştirici: Nihat Yazgan)`
    };

    const gridHtml = `
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏢 İlçe Adı</div>
        <div class="koy-detail-value">${ilceAd}</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏛️ Bağlı Olduğu İl</div>
        <div class="koy-detail-value">${il.il} (${plaka})</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🧭 Coğrafi Bölge</div>
        <div class="koy-detail-value">${il.bolge} Bölgesi</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏡 Toplam Köy Sayısı</div>
        <div class="koy-detail-value" style="color: #34D399;">${koySayisi} Köy</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">📞 İl Alan Kodu</div>
        <div class="koy-detail-value">${il.telKodu ? '0' + il.telKodu : '-'}</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">📜 Mülki Statü</div>
        <div class="koy-detail-value" style="color: #60A5FA;">T.C. Kaymakamlık</div>
      </div>
    `;

    const descHtml = `📍 <strong>${ilceAd}</strong>, <strong>${il.bolge} Bölgesi</strong> sınırlarında yer alan <strong>${il.il}</strong> ilimize bağlı, toplam <strong>${koySayisi} resmi köy yerleşimine</strong> sahip mülki bir ilçemizdir.`;

    this.showDetailModal('🏢', `${ilceAd} İlçesi`, `${il.il} / ${il.bolge} Bölgesi (Plaka: ${plaka})`, gridHtml, descHtml);
  },

  openKoyDetail: function(plaka, ilceAd, koyAd) {
    const il = TurkiyeDB.getIlByPlaka(plaka);
    if (!il) return;

    this.currentInfoData = {
      type: 'koy',
      name: koyAd,
      query: `${koyAd}, ${ilceAd}, ${il.il}, Türkiye`,
      search: `${koyAd} ${ilceAd} ${il.il} tarihi ve bilgileri`,
      text: `🏡 Köy: ${koyAd}\n🏢 İlçe: ${ilceAd}\n🏛️ İl: ${il.il} (Plaka: ${plaka})\n🧭 Bölge: ${il.bolge} Bölgesi\n📜 Kaynak: TÜRKİYEM Rehberi (Geliştirici: Nihat Yazgan)`
    };

    const gridHtml = `
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏛️ Bağlı Olduğu İl</div>
        <div class="koy-detail-value">${il.il} (${plaka})</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🏢 Bağlı Olduğu İlçe</div>
        <div class="koy-detail-value">${ilceAd}</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">🧭 Coğrafi Bölge</div>
        <div class="koy-detail-value">${il.bolge} Bölgesi</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">📞 İl Alan Kodu</div>
        <div class="koy-detail-value">${il.telKodu ? '0' + il.telKodu : '-'}</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">👥 İl Toplam Nüfusu</div>
        <div class="koy-detail-value">${il.nufus} Kişi</div>
      </div>
      <div class="koy-detail-item">
        <div class="koy-detail-label">📜 Resmi Statü</div>
        <div class="koy-detail-value" style="color: #34D399;">Resmi Köy (NVİ)</div>
      </div>
    `;

    const descHtml = `📍 <strong>${koyAd}</strong>, Türkiye Cumhuriyeti'nin <strong>${il.bolge} Bölgesi</strong> sınırları içerisinde bulunan <strong>${il.il}</strong> ilimizin <strong>${ilceAd}</strong> ilçesine bağlı resmi ve mülki bir köy yerleşimidir.`;

    this.showDetailModal('🏡', koyAd, `${ilceAd} / ${il.il} (Plaka: ${plaka})`, gridHtml, descHtml);
  },

  showDetailModal: function(icon, title, sub, gridHtml, descHtml) {
    const modal = document.getElementById('detailModal');
    const iconEl = document.getElementById('modalIcon');
    const titleEl = document.getElementById('modalTitle');
    const subEl = document.getElementById('modalSub');
    const gridEl = document.getElementById('modalGrid');
    const aciklamaEl = document.getElementById('modalAciklama');
    const copyBtnText = document.getElementById('copyBtnText');

    if (iconEl) iconEl.textContent = icon;
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = sub;
    if (gridEl) gridEl.innerHTML = gridHtml;
    if (aciklamaEl) aciklamaEl.innerHTML = descHtml;
    if (copyBtnText) copyBtnText.textContent = "Kopyala";

    if (modal) modal.classList.add('active');
  },

  closeDetailModal: function() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('active');
    this.currentInfoData = null;
  },

  openInMaps: function() {
    if (!this.currentInfoData) return;
    const query = this.currentInfoData.query;
    
    if (window.Android && typeof window.Android.openMap === 'function') {
      window.Android.openMap(query);
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
    }
  },

  searchOnGoogle: function() {
    if (!this.currentInfoData) return;
    const searchParam = this.currentInfoData.search;
    
    if (window.Android && typeof window.Android.searchWeb === 'function') {
      window.Android.searchWeb(searchParam);
    } else {
      const url = `https://www.google.com/search?q=${encodeURIComponent(searchParam)}`;
      window.open(url, '_blank');
    }
  },

  copyCurrentInfo: function() {
    if (!this.currentInfoData) return;
    const textToCopy = this.currentInfoData.text;
    
    if (window.Android && typeof window.Android.copyText === 'function') {
      window.Android.copyText(textToCopy);
      const copyBtnText = document.getElementById('copyBtnText');
      if (copyBtnText) {
        copyBtnText.textContent = "✅ Kopyalandı!";
        setTimeout(() => { copyBtnText.textContent = "Kopyala"; }, 2000);
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtnText = document.getElementById('copyBtnText');
        if (copyBtnText) {
          copyBtnText.textContent = "✅ Kopyalandı!";
          setTimeout(() => { copyBtnText.textContent = "Kopyala"; }, 2000);
        }
      }).catch(() => {
        alert(textToCopy);
      });
    } else {
      alert(textToCopy);
    }
  },

  initEventListeners: function() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
      // 200ms debounce ile donmayı engeller
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        this.rawQuery = val.trim();
        
        if (clearBtn) {
          clearBtn.style.display = this.rawQuery ? 'flex' : 'none';
        }

        if (this.searchTimer) {
          clearTimeout(this.searchTimer);
        }

        this.searchTimer = setTimeout(() => {
          this.searchQuery = this.normalize(this.rawQuery);
          this.renderMainTree();
        }, 200);
      });
    }

    // Modal dışına tıklayınca kapat
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) this.closeSettings();
      });
    }

    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) this.closeDetailModal();
      });
    }

    // ESC tuşu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSettings();
        this.closeDetailModal();
      }
    });
  },

  clearSearch: function() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.rawQuery = '';
    this.searchQuery = '';
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.renderMainTree();
  },

  // İl aç/kapat
  toggleIl: function(plaka) {
    if (this.expandedIller.has(plaka)) {
      this.expandedIller.delete(plaka);
    } else {
      this.expandedIller.add(plaka);
      if (this.settings.autoExpand) {
        const ilceler = TurkiyeDB.getIlceler(plaka);
        ilceler.forEach(ilce => {
          this.expandedIlceler.add(`${plaka}_${ilce.ilceAd}`);
        });
      }
    }
    this.renderMainTree();
  },

  // İlçe aç/kapat
  toggleIlce: function(plaka, ilceAd) {
    const key = `${plaka}_${ilceAd}`;
    if (this.expandedIlceler.has(key)) {
      this.expandedIlceler.delete(key);
    } else {
      this.expandedIlceler.add(key);
    }
    this.renderMainTree();
  },

  // İlçe içindeki tüm köyleri göster
  showMoreKoyler: function(ilceKey, event) {
    if (event) event.stopPropagation();
    this.fullyExpandedDistricts.add(ilceKey);
    this.renderMainTree();
  },

  // =========================================================================
  // ULTRA HIZLI VE DONMAYAN HİYERARŞİ RENDER
  // =========================================================================
  renderMainTree: function() {
    const container = document.getElementById('illerContainer');
    const statusEl = document.getElementById('searchStatus');
    if (!container) return;

    const allIller = TURKIYE_FULL_DATA;
    const q = this.searchQuery;
    const rawQ = this.rawQuery;

    let filteredData = [];
    let totalMatchedKoy = 0;
    let totalMatchedIlce = 0;

    for (let i = 0; i < allIller.length; i++) {
      const il = allIller[i];
      const ilMatches = !q || (il._s && il._s.includes(q)) || il.plaka.includes(q);

      let matchingIlceler = [];

      for (let j = 0; j < il.ilceler.length; j++) {
        const ilce = il.ilceler[j];
        const ilceMatches = !q || ilMatches || (ilce._s && ilce._s.includes(q));
        
        let matchingKoyler = [];

        if (!q || ilMatches || (ilce._s && ilce._s.includes(q))) {
          matchingKoyler = ilce.koyler;
        } else {
          const ks = ilce._ks || [];
          for (let k = 0; k < ilce.koyler.length; k++) {
            if (ks[k] && ks[k].includes(q)) {
              matchingKoyler.push(ilce.koyler[k]);
            }
          }
        }

        if (ilMatches || (ilce._s && ilce._s.includes(q)) || matchingKoyler.length > 0) {
          totalMatchedKoy += matchingKoyler.length;
          totalMatchedIlce++;
          matchingIlceler.push({
            ilceAd: ilce.ilceAd,
            koyler: matchingKoyler,
            totalKoySayisi: ilce.koyler.length,
            isDirectMatch: !q || (ilce._s && ilce._s.includes(q)) || matchingKoyler.length > 0
          });
        }
      }

      if (ilMatches || matchingIlceler.length > 0) {
        filteredData.push({
          il: il,
          ilceler: matchingIlceler,
          totalIlceSayisi: il.ilceler.length
        });
      }
    }

    // Arama durumu metni
    if (statusEl) {
      if (q) {
        statusEl.innerHTML = `Arama Sonucu: <strong>${filteredData.length} İl</strong>, <strong>${totalMatchedIlce} İlçe</strong> ve <strong>${totalMatchedKoy} Köy</strong> eşleşti.`;
      } else {
        const stats = TurkiyeDB.getStats ? TurkiyeDB.getStats() : { ilSayisi: 81, ilceSayisi: 973, koySayisi: 49467 };
        statusEl.textContent = `${stats.ilSayisi} İl, ${stats.ilceSayisi} İlçe ve ${stats.koySayisi.toLocaleString('tr-TR')} Köy hazır. Genişletmek için bir ile tıklayın.`;
      }
    }

    if (filteredData.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: var(--card-bg); border-radius: 20px; border: 1px solid var(--card-border);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 style="color: #FFFFFF; font-size: 1.2rem; margin-bottom: 6px;">Eşleşen Sonuç Bulunamadı</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">"${rawQ}" aramasına uygun il, ilçe veya köy bulunamadı.</p>
        </div>
      `;
      return;
    }

    // Arama sırasında otomatik genişletme kuralı
    const autoExpandSearchResults = Boolean(q && filteredData.length <= 6);
    const autoExpandDistricts = Boolean(q && totalMatchedIlce <= 10);

    const KOY_LIMIT_PER_DISTRICT = 30;

    let htmlBuffer = '';

    for (let i = 0; i < filteredData.length; i++) {
      const item = filteredData[i];
      const il = item.il;
      const plaka = il.plaka;
      const isExpanded = q ? (autoExpandSearchResults || this.expandedIller.has(plaka)) : this.expandedIller.has(plaka);

      htmlBuffer += `
        <div class="il-item ${isExpanded ? 'active' : ''}" id="ilItem_${plaka}">
          
          <!-- İL BAŞLIĞI -->
          <div class="il-header" onclick="app.toggleIl('${plaka}')">
            <div class="il-title-left">
              <div class="plaka-box">${plaka}</div>
              <div>
                <span class="il-name">${this.highlightMatch(il.il, rawQ)}</span>
                <span class="il-region-badge">${il.bolge}</span>
              </div>
            </div>
            <div class="il-title-right">
              <button class="info-badge-btn" onclick="app.openIlDetail('${plaka}', event)" title="${il.il} İl Bilgisi">ℹ️</button>
              <span class="ilce-counter">🏢 ${il.ilceSayisi} İlçe</span>
              <div class="arrow-icon">▼</div>
            </div>
          </div>

          <!-- İLÇELER KAPSAYICISI -->
          ${isExpanded ? `
            <div class="ilceler-body">
              ${item.ilceler.map(ilce => {
                const ilceKey = `${plaka}_${ilce.ilceAd}`;
                const isIlceExpanded = q ? (autoExpandDistricts || this.expandedIlceler.has(ilceKey)) : this.expandedIlceler.has(ilceKey);
                const isFullyExpanded = this.fullyExpandedDistricts.has(ilceKey);

                // Performans için köy listesini akıllıca sınırla (sayfalama)
                const totalKoys = ilce.koyler.length;
                const visibleKoyler = isFullyExpanded ? ilce.koyler : ilce.koyler.slice(0, KOY_LIMIT_PER_DISTRICT);
                const remainingCount = totalKoys - visibleKoyler.length;
                const safeIlce = ilce.ilceAd.replace(/'/g, "\\'");

                return `
                  <div class="ilce-item ${isIlceExpanded ? 'active' : ''}" id="ilceItem_${plaka}_${ilce.ilceAd}">
                    
                    <!-- İLÇE BAŞLIĞI -->
                    <div class="ilce-header" onclick="app.toggleIlce('${plaka}', '${safeIlce}')">
                      <div class="ilce-name">
                        <span>🏢</span>
                        <span>${this.highlightMatch(ilce.ilceAd, rawQ)}</span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="info-badge-btn" onclick="app.openIlceDetail('${plaka}', '${safeIlce}', event)" title="${ilce.ilceAd} İlçe Bilgisi" style="width: 28px; height: 28px; font-size: 0.85rem;">ℹ️</button>
                        <span class="koy-counter">🏡 ${totalKoys} Köy</span>
                        <span class="ilce-arrow">▼</span>
                      </div>
                    </div>

                    <!-- KÖYLER KAPSAYICISI -->
                    ${isIlceExpanded ? `
                      <div class="koyler-body">
                        ${visibleKoyler.map(koy => {
                          const safeKoy = koy.replace(/'/g, "\\'");
                          return `
                            <div class="koy-pill" onclick="app.openKoyDetail('${plaka}', '${safeIlce}', '${safeKoy}')" title="Köy Bilgisini Gör">
                              <span>🏡</span>
                              <span>${this.highlightMatch(koy, rawQ)}</span>
                            </div>
                          `;
                        }).join('')}

                        ${remainingCount > 0 ? `
                          <div style="width: 100%; text-align: center; margin-top: 10px;">
                            <button onclick="app.showMoreKoyler('${ilceKey}', event)" style="background: rgba(227,10,23,0.18); border: 1px solid rgba(227,10,23,0.4); color: #FFF; padding: 8px 18px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                              ➕ ${remainingCount} Köyü Daha Göster (Toplam ${totalKoys} Köy)
                            </button>
                          </div>
                        ` : ''}
                      </div>
                    ` : ''}

                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}

        </div>
      `;
    }

    container.innerHTML = htmlBuffer;
  },

  // Eşleşen kelimeyi vurgula
  highlightMatch: function(text, rawQ) {
    if (!rawQ || !text) return text;
    const lowerText = this.normalize(text);
    const normQ = this.normalize(rawQ);
    if (!normQ) return text;

    const index = lowerText.indexOf(normQ);
    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + rawQ.length);
    const after = text.substring(index + rawQ.length);

    return `${before}<span class="highlight">${match}</span>${after}`;
  }
};

// Başlat
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
