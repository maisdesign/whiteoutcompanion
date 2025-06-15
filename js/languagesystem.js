// === SISTEMA LINGUE AGGIORNATO ===
function toggleLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (selector.classList.contains('hidden')) {
    selector.classList.remove('hidden');
    selector.style.animation = 'fadeIn 0.3s ease';
    
    // Evidenzia la lingua corrente quando si apre il selettore
    updateLanguageButtons();
  } else {
    selector.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => selector.classList.add('hidden'), 300);
  }
}

function setLanguage(lang) {
  console.log(`🌐 Cambio lingua utente: ${currentLanguage} → ${lang}`);
  
  // Usa la nuova funzione con flag userChoice=true
  setAppLanguage(lang, true);
  
  // Aggiorna UI
  updateUILanguage();
  
  // Mostra messaggio di conferma
  const t = translations[currentLanguage];
  const langName = getLanguageDisplayName(currentLanguage);
  showStatus(`${t.languageSet} ${langName}`, 'success', 3000);
  
  // Chiudi il selettore
  document.getElementById('language-selector').classList.add('hidden');
  
  // Aggiorna i pulsanti lingua
  updateLanguageButtons();
  
  // Mostra messaggio di benvenuto se è la prima volta
  const isFirstLanguageSelection = !localStorage.getItem('whiteout-language-user-set-before');
  if (isFirstLanguageSelection) {
    localStorage.setItem('whiteout-language-user-set-before', 'true');
    setTimeout(() => {
      const welcomeMessages = {
        'en': '👋 Welcome! You can always change the language from the 🌐 button.',
        'it': '👋 Benvenuto! Puoi sempre cambiare la lingua dal pulsante 🌐.',
        'es': '👋 ¡Bienvenido! Siempre puedes cambiar el idioma desde el botón 🌐.',
        'fr': '👋 Bienvenue! Vous pouvez toujours changer la langue depuis le bouton 🌐.',
        'de': '👋 Willkommen! Sie können die Sprache jederzeit über die Schaltfläche 🌐 ändern.',
        'pt': '👋 Bem-vindo! Você sempre pode alterar o idioma através do botão 🌐.'
      };
      
      const message = welcomeMessages[currentLanguage] || welcomeMessages['en'];
      showStatus(message, 'info', 6000);
    }, 4000);
  }
}

function updateLanguageButtons() {
  // Reset di tutti i pulsanti
  document.querySelectorAll('[id^="lang-"]').forEach(btn => {
    btn.classList.remove('btn-success');
    btn.classList.add('btn-info');
  });
  
  // Evidenzia il pulsante della lingua corrente
  const currentBtn = document.getElementById(`lang-${currentLanguage}`);
  if (currentBtn) {
    currentBtn.classList.remove('btn-info');
    currentBtn.classList.add('btn-success');
  }
  
  console.log(`🎨 Pulsante lingua evidenziato: ${currentLanguage}`);
}

function updateUILanguage() {
  const t = translations[currentLanguage];
  
  // Verifica che le traduzioni esistano
  if (!t) {
    console.error(`❌ Traduzioni mancanti per lingua: ${currentLanguage}`);
    return;
  }
  
  console.log(`🔄 Aggiornamento UI per lingua: ${currentLanguage}`);
  
  // Titoli principali
  const mainTitle = document.getElementById('main-title');
  const mainSubtitle = document.getElementById('main-subtitle');
  if (mainTitle) mainTitle.textContent = t.title;
  if (mainSubtitle) mainSubtitle.textContent = t.subtitle;
  
  // Stats e form
  const alliancesLabel = document.getElementById('alliances-label');
  const assignedLabel = document.getElementById('assigned-label');
  const allianceManagementTitle = document.getElementById('alliance-management-title');
  const allianceName = document.getElementById('alliance-name');
  const addAllianceBtn = document.getElementById('add-alliance-btn');
  
  if (alliancesLabel) alliancesLabel.textContent = t.alliances;
  if (assignedLabel) assignedLabel.textContent = t.assigned;
  if (allianceManagementTitle) allianceManagementTitle.textContent = t.allianceManagement;
  if (allianceName) allianceName.placeholder = t.allianceName;
  if (addAllianceBtn) addAllianceBtn.innerHTML = t.addAlliance;
  
  // Pulsanti controlli
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const exportPngBtn = document.getElementById('export-png-btn');
  const importCsvBtn = document.getElementById('import-csv-btn');
  const languageBtn = document.getElementById('language-btn');
  
  if (exportCsvBtn) exportCsvBtn.innerHTML = t.exportCSV;
  if (exportPngBtn) exportPngBtn.innerHTML = t.exportPNG;
  if (importCsvBtn) importCsvBtn.innerHTML = t.importCSV;
  if (languageBtn) languageBtn.innerHTML = t.language;
  
  // Selettore lingua
  const selectLanguageTitle = document.getElementById('select-language-title');
  if (selectLanguageTitle) selectLanguageTitle.textContent = t.selectLanguage;
  
  // Mappa
  const mapTitle = document.getElementById('map-title');
  const legendBtn = document.getElementById('legend-btn');
  const legendTitle = document.getElementById('legend-title');
  
  if (mapTitle) mapTitle.textContent = t.interactiveMap;
  if (legendBtn) legendBtn.innerHTML = `🎨 ${t.legend}`;
  if (legendTitle) legendTitle.textContent = t.legendTitle;
  
  // Colori legenda
  const colorElements = [
    'castle', 'construction', 'production', 'defense', 'gathering', 
    'tech', 'weapons', 'training', 'expedition', 'stronghold', 'fortress'
  ];
  
  colorElements.forEach(color => {
    const element = document.getElementById(`color-${color}`);
    if (element && t[`color${color.charAt(0).toUpperCase() + color.slice(1)}`]) {
      element.textContent = t[`color${color.charAt(0).toUpperCase() + color.slice(1)}`];
    }
  });
  
  // Riepiloghi
  const facilitySummaryTitle = document.getElementById('facility-summary-title');
  const buffSummaryTitle = document.getElementById('buff-summary-title');
  const calibrationTitle = document.getElementById('calibration-title');
  
  if (facilitySummaryTitle) facilitySummaryTitle.textContent = t.facilitySummary;
  if (buffSummaryTitle) buffSummaryTitle.textContent = t.buffSummary;
  if (calibrationTitle) calibrationTitle.textContent = t.advancedCalibration;
  
  // Aggiorna i riepiloghi con la nuova lingua
  if (typeof updateSummaries === 'function') {
    updateSummaries();
  }
  
  console.log(`✅ UI aggiornata per lingua: ${currentLanguage}`);
}

// Funzione per inizializzare la lingua all'avvio dell'app
function initializeLanguageSystem() {
  console.log('🔧 Inizializzazione sistema lingua UI...');
  
  // La lingua è già stata impostata in utilities.js con initializeAppLanguage()
  console.log(`🎯 Lingua attiva: ${currentLanguage} (${getLanguageDisplayName(currentLanguage)})`);
  
  // Aggiorna UI con la lingua corrente
  updateUILanguage();
  
  // Aggiorna i pulsanti lingua
  updateLanguageButtons();
  
  // Mostra messaggio di benvenuto se lingua auto-rilevata
  setTimeout(() => {
    showWelcomeMessage();
  }, 1000);
}

// Funzione per ottenere informazioni sulla lingua corrente
function getCurrentLanguageInfo() {
  return {
    current: currentLanguage,
    displayName: getLanguageDisplayName(currentLanguage),
    isUserSelected: !!localStorage.getItem('whiteout-language-user-set'),
    isAutoDetected: !localStorage.getItem('whiteout-language-user-set'),
    detectedLanguage: detectDeviceLanguage(),
    supportedLanguages: SUPPORTED_LANGUAGES.map(lang => ({
      code: lang,
      name: getLanguageDisplayName(lang)
    }))
  };
}

// Funzione per resettare la lingua (per debug/test)
function resetLanguageToAuto() {
  console.log('🔄 Reset lingua a rilevamento automatico...');
  
  // Rimuovi le preferenze dell'utente
  localStorage.removeItem('whiteout-language-user-set');
  localStorage.removeItem('whiteout-language-user-set-before');
  
  // Rileva di nuovo automaticamente
  const newLang = initializeAppLanguage();
  
  // Aggiorna UI
  updateUILanguage();
  updateLanguageButtons();
  
  // Mostra messaggio
  showStatus(`🌍 Lingua resettata a rilevamento automatico: ${getLanguageDisplayName(newLang)}`, 'info', 4000);
  
  return newLang;
}

// Aggiungi funzioni al debugger globale
if (typeof window !== 'undefined' && window.debugWS) {
  window.debugWS.language = {
    current: getCurrentLanguageInfo,
    reset: resetLanguageToAuto,
    set: setLanguage,
    detect: detectDeviceLanguage,
    supported: SUPPORTED_LANGUAGES
  };
}