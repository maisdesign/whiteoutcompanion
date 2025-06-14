// === SISTEMA LINGUE ===
    function toggleLanguageSelector() {
      const selector = document.getElementById('language-selector');
      if (selector.classList.contains('hidden')) {
        selector.classList.remove('hidden');
        selector.style.animation = 'fadeIn 0.3s ease';
      } else {
        selector.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => selector.classList.add('hidden'), 300);
      }
    }

    function setLanguage(lang) {
      currentLanguage = lang;
      updateUILanguage();
      localStorage.setItem('whiteout-language', lang);
      showStatus(translations[lang].languageSet, 'success');
      
      document.getElementById('language-selector').classList.add('hidden');
      
      document.querySelectorAll('[id^="lang-"]').forEach(btn => {
        btn.classList.remove('btn-success');
        btn.classList.add('btn-info');
      });
      const currentBtn = document.getElementById(`lang-${lang}`);
      if (currentBtn) {
        currentBtn.classList.remove('btn-info');
        currentBtn.classList.add('btn-success');
      }
    }

    function updateUILanguage() {
      const t = translations[currentLanguage];
      
      // Titoli principali
      document.getElementById('main-title').textContent = t.title;
      document.getElementById('main-subtitle').textContent = t.subtitle;
      
      // Stats e form
      document.getElementById('alliances-label').textContent = t.alliances;
      document.getElementById('assigned-label').textContent = t.assigned;
      document.getElementById('alliance-management-title').textContent = t.allianceManagement;
      document.getElementById('alliance-name').placeholder = t.allianceName;
      document.getElementById('add-alliance-btn').innerHTML = t.addAlliance;
      
      // Pulsanti controlli
      document.getElementById('export-csv-btn').innerHTML = t.exportCSV;
      document.getElementById('export-png-btn').innerHTML = t.exportPNG;
      document.getElementById('import-csv-btn').innerHTML = t.importCSV;
      document.getElementById('language-btn').innerHTML = t.language;
      
      // Selettore lingua
      document.getElementById('select-language-title').textContent = t.selectLanguage;
      
      // Mappa
      document.getElementById('map-title').textContent = t.interactiveMap;
      document.getElementById('legend-btn').innerHTML = `🎨 ${t.legend}`;
      document.getElementById('legend-title').textContent = t.legendTitle;
      
      // Colori legenda
      document.getElementById('color-castle').textContent = t.colorCastle;
      document.getElementById('color-construction').textContent = t.colorConstruction;
      document.getElementById('color-production').textContent = t.colorProduction;
      document.getElementById('color-defense').textContent = t.colorDefense;
      document.getElementById('color-gathering').textContent = t.colorGathering;
      document.getElementById('color-tech').textContent = t.colorTech;
      document.getElementById('color-weapons').textContent = t.colorWeapons;
      document.getElementById('color-training').textContent = t.colorTraining;
      document.getElementById('color-expedition').textContent = t.colorExpedition;
      document.getElementById('color-stronghold').textContent = t.colorStronghold;
      document.getElementById('color-fortress').textContent = t.colorFortress;
      
      // Riepiloghi
      document.getElementById('facility-summary-title').textContent = t.facilitySummary;
      document.getElementById('buff-summary-title').textContent = t.buffSummary;
      document.getElementById('calibration-title').textContent = t.advancedCalibration;
      
      // Aggiorna i riepiloghi
      updateSummaries();
    }