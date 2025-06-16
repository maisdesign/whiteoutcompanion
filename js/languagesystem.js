// =====================================================================
// LANGUAGESYSTEM.JS - SISTEMA LINGUE COMPLETO E ROBUSTO
// =====================================================================
// Questo file gestisce tutto il sistema multilingua dell'applicazione,
// garantendo che ogni stringa dell'interfaccia sia tradotta correttamente
// in tutte le lingue supportate, senza eccezioni.
//
// FILOSOFIA DEL DESIGN:
// - Mappatura sistematica di TUTTI gli elementi dell'interfaccia
// - Validazione automatica delle traduzioni mancanti
// - Fallback intelligente per stringhe non trovate
// - Aggiornamento incrementale e verificabile dell'UI
// - Gestione robusta degli errori di traduzione

console.log('🌐 Caricamento sistema lingue avanzato...');

// =====================================================================
// SEZIONE 1: CONFIGURAZIONE E COSTANTI
// =====================================================================

/**
 * Mappa completa di tutti gli elementi DOM che richiedono traduzione
 * Ogni elemento è categorizzato per funzionalità per facilitare il debug
 * e la manutenzione del sistema di traduzioni
 */
const UI_TRANSLATION_MAP = {
  // =================================================================
  // CATEGORIA: HEADER E NAVIGAZIONE PRINCIPALE
  // =================================================================
  header: {
    'main-title': { 
      property: 'textContent', 
      translationKey: 'title',
      fallback: '🗺️ Whiteout Survival Companion'
    },
    'main-subtitle': { 
      property: 'textContent', 
      translationKey: 'subtitle',
      fallback: 'Professional alliance management with map calibration'
    }
  },

  // =================================================================
  // CATEGORIA: STATISTICHE E CONTATORI
  // =================================================================
  statistics: {
    'alliances-label': { 
      property: 'textContent', 
      translationKey: 'alliances',
      fallback: 'Alliances'
    },
    'assigned-label': { 
      property: 'textContent', 
      translationKey: 'assigned',
      fallback: 'Assigned'
    }
  },

  // =================================================================
  // CATEGORIA: GESTIONE ALLEANZE
  // =================================================================
  alliances: {
    'alliance-management-title': { 
      property: 'textContent', 
      translationKey: 'allianceManagement',
      fallback: '🏰 Alliance Management'
    },
    'alliance-name': { 
      property: 'placeholder', 
      translationKey: 'allianceName',
      fallback: 'Alliance name...'
    },
    'add-alliance-btn': { 
      property: 'innerHTML', 
      translationKey: 'addAlliance',
      fallback: '✨ Add Alliance'
    }
  },

  // =================================================================
  // CATEGORIA: CONTROLLI E PULSANTI PRINCIPALI
  // =================================================================
  controls: {
    'export-csv-btn': { 
      property: 'innerHTML', 
      translationKey: 'exportCSV',
      fallback: '📊 Export CSV'
    },
    'export-png-btn': { 
      property: 'innerHTML', 
      translationKey: 'exportPNG',
      fallback: '🖼️ Export PNG'
    },
    'import-csv-btn': { 
      property: 'innerHTML', 
      translationKey: 'importCSV',
      fallback: '📥 Import CSV'
    },
    'language-btn': { 
      property: 'innerHTML', 
      translationKey: 'language',
      fallback: '🌐 Language'
    },
    'reset-btn-text': { 
      property: 'textContent', 
      translationKey: 'resetAssignments',
      fallback: 'Reset Assignments'
    }
  },

  // =================================================================
  // CATEGORIA: SELETTORE LINGUE
  // =================================================================
  languageSelector: {
    'select-language-title': { 
      property: 'textContent', 
      translationKey: 'selectLanguage',
      fallback: '🌐 Select Language'
    }
  },

  // =================================================================
  // CATEGORIA: MAPPA E VISUALIZZAZIONE
  // =================================================================
  map: {
    'map-title': { 
      property: 'textContent', 
      translationKey: 'interactiveMap',
      fallback: '🗺️ Interactive Map'
    },
    'legend-btn': { 
      property: 'innerHTML', 
      translationKey: 'legend',
      fallback: '🎨 Legend',
      transform: (text) => `🎨 ${text}` // Aggiunge icona se non presente
    },
    'legend-title': { 
      property: 'textContent', 
      translationKey: 'legendTitle',
      fallback: '🎨 Official Colors and Icons Legend'
    }
  },

  // =================================================================
  // CATEGORIA: LEGENDA COLORI E ICONE
  // =================================================================
  legend: {
    'color-castle': { 
      property: 'textContent', 
      translationKey: 'colorCastle',
      fallback: 'Castle (Gold)'
    },
    'color-construction': { 
      property: 'textContent', 
      translationKey: 'colorConstruction',
      fallback: 'Construction (Blue)'
    },
    'color-production': { 
      property: 'textContent', 
      translationKey: 'colorProduction',
      fallback: 'Production (Green)'
    },
    'color-defense': { 
      property: 'textContent', 
      translationKey: 'colorDefense',
      fallback: 'Defense (Teal)'
    },
    'color-gathering': { 
      property: 'textContent', 
      translationKey: 'colorGathering',
      fallback: 'Gathering (Purple)'
    },
    'color-tech': { 
      property: 'textContent', 
      translationKey: 'colorTech',
      fallback: 'Research/Tech (Orange)'
    },
    'color-weapons': { 
      property: 'textContent', 
      translationKey: 'colorWeapons',
      fallback: 'Troop Attack (Red)'
    },
    'color-training': { 
      property: 'textContent', 
      translationKey: 'colorTraining',
      fallback: 'Training (Yellow)'
    },
    'color-expedition': { 
      property: 'textContent', 
      translationKey: 'colorExpedition',
      fallback: 'March/Expedition (Pink)'
    },
    'color-stronghold': { 
      property: 'textContent', 
      translationKey: 'colorStronghold',
      fallback: 'Stronghold (Brown)'
    },
    'color-fortress': { 
      property: 'textContent', 
      translationKey: 'colorFortress',
      fallback: 'Fortress (Dark Gray)'
    }
  },

  // =================================================================
  // CATEGORIA: RIEPILOGHI E SEZIONI ACCORDION
  // =================================================================
  summaries: {
    'facility-summary-title': { 
      property: 'textContent', 
      translationKey: 'facilitySummary',
      fallback: '📋 Facility Summary'
    },
    'buff-summary-title': { 
      property: 'textContent', 
      translationKey: 'buffSummary',
      fallback: '⚡ Buff Summary'
    },
    'calibration-title': { 
      property: 'textContent', 
      translationKey: 'advancedCalibration',
      fallback: '🔧 Advanced Calibration'
    }
  }
};

/**
 * Configurazione avanzata per il sistema di traduzioni
 * Questi parametri controllano il comportamento del sistema
 */
const LANGUAGE_SYSTEM_CONFIG = {
  // Abilita logging dettagliato per debug
  enableDetailedLogging: false,
  
  // Mostra warning per traduzioni mancanti
  showMissingTranslationWarnings: true,
  
  // Usa fallback in inglese se traduzione mancante
  useFallbackTranslations: true,
  
  // Tempo di attesa per aggiornamenti DOM (ms)
  domUpdateDelay: 50,
  
  // Validazione automatica traduzioni al cambio lingua
  autoValidateTranslations: true
};

// =====================================================================
// SEZIONE 2: FUNZIONI DI UTILITÀ E VALIDAZIONE
// =====================================================================

/**
 * Funzione di logging intelligente che si adatta al livello di dettaglio configurato
 * Aiuta a debuggare problemi di traduzione senza inquinare la console
 * 
 * @param {string} message - Messaggio da loggare
 * @param {string} level - Livello di log ('info', 'warn', 'error')
 * @param {*} data - Dati aggiuntivi da mostrare
 */
function logLanguageSystem(message, level = 'info', data = null) {
  if (!LANGUAGE_SYSTEM_CONFIG.enableDetailedLogging && level === 'info') {
    return; // Skippa i log info se non in modalità debug
  }
  
  const prefix = {
    'info': '🌐',
    'warn': '⚠️',
    'error': '❌'
  }[level] || '📝';
  
  const logFunction = {
    'info': console.log,
    'warn': console.warn, 
    'error': console.error
  }[level] || console.log;
  
  if (data) {
    logFunction(`${prefix} [Lingue] ${message}`, data);
  } else {
    logFunction(`${prefix} [Lingue] ${message}`);
  }
}

/**
 * Verifica che tutte le chiavi di traduzione necessarie esistano
 * per la lingua corrente, identificando traduzioni mancanti
 * 
 * @param {string} languageCode - Codice lingua da verificare (es: 'en', 'it')
 * @returns {Object} Report delle traduzioni mancanti
 */
function validateLanguageTranslations(languageCode) {
  if (!translations[languageCode]) {
    logLanguageSystem(`Lingua non trovata: ${languageCode}`, 'error');
    return { isValid: false, missingKeys: [], totalKeys: 0, completeness: 0 };
  }
  
  const translationSet = translations[languageCode];
  const missingKeys = [];
  let totalKeys = 0;
  
  // Scansiona tutti gli elementi dell'UI per verificare le traduzioni
  Object.entries(UI_TRANSLATION_MAP).forEach(([category, elements]) => {
    Object.entries(elements).forEach(([elementId, config]) => {
      totalKeys++;
      
      if (!translationSet[config.translationKey]) {
        missingKeys.push({
          elementId,
          category,
          translationKey: config.translationKey,
          fallback: config.fallback
        });
      }
    });
  });
  
  const completeness = totalKeys > 0 ? Math.round(((totalKeys - missingKeys.length) / totalKeys) * 100) : 100;
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    totalKeys,
    completeness,
    language: languageCode
  };
}

/**
 * Ottiene il testo tradotto per una chiave specifica, con fallback intelligente
 * Questa funzione è il cuore del sistema di traduzioni sicure
 * 
 * @param {string} translationKey - Chiave di traduzione
 * @param {string} fallbackText - Testo di fallback se traduzione non trovata
 * @param {Object} options - Opzioni aggiuntive per la traduzione
 * @returns {string} Testo tradotto o fallback
 */
function getTranslatedText(translationKey, fallbackText, options = {}) {
  const t = translations[currentLanguage];
  
  // Se le traduzioni non sono disponibili, usa fallback
  if (!t) {
    if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
      logLanguageSystem(`Traduzioni non disponibili per lingua: ${currentLanguage}`, 'warn');
    }
    return fallbackText;
  }
  
  // Se la chiave esiste, restituisci la traduzione
  if (t[translationKey]) {
    let translatedText = t[translationKey];
    
    // Applica trasformazioni se specificate
    if (options.transform && typeof options.transform === 'function') {
      translatedText = options.transform(translatedText);
    }
    
    // Sostituzioni di variabili (es: {count} → valore)
    if (options.variables) {
      Object.entries(options.variables).forEach(([key, value]) => {
        translatedText = translatedText.replace(`{${key}}`, value);
      });
    }
    
    return translatedText;
  }
  
  // Fallback a inglese se configurato
  if (LANGUAGE_SYSTEM_CONFIG.useFallbackTranslations && currentLanguage !== 'en') {
    const englishTranslations = translations['en'];
    if (englishTranslations && englishTranslations[translationKey]) {
      if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
        logLanguageSystem(`Usando fallback inglese per chiave: ${translationKey}`, 'warn');
      }
      return englishTranslations[translationKey];
    }
  }
  
  // Ultimo fallback: testo statico
  if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
    logLanguageSystem(`Traduzione mancante per: ${translationKey}, usando fallback: ${fallbackText}`, 'warn');
  }
  
  return fallbackText;
}

/**
 * Applica una traduzione a un elemento DOM specifico
 * Gestisce diversi tipi di proprietà (textContent, innerHTML, placeholder, etc.)
 * 
 * @param {HTMLElement} element - Elemento DOM da aggiornare
 * @param {Object} config - Configurazione traduzione
 * @returns {boolean} True se la traduzione è stata applicata con successo
 */
function applyTranslationToElement(element, config) {
  if (!element) {
    return false;
  }
  
  try {
    const translatedText = getTranslatedText(
      config.translationKey, 
      config.fallback,
      { transform: config.transform }
    );
    
    // Applica la traduzione alla proprietà corretta
    switch (config.property) {
      case 'textContent':
        element.textContent = translatedText;
        break;
      case 'innerHTML':
        element.innerHTML = translatedText;
        break;
      case 'placeholder':
        element.placeholder = translatedText;
        break;
      case 'title':
        element.title = translatedText;
        break;
      case 'alt':
        element.alt = translatedText;
        break;
      default:
        logLanguageSystem(`Proprietà sconosciuta: ${config.property}`, 'warn');
        return false;
    }
    
    logLanguageSystem(`Tradotto elemento: ${element.id || element.className} → ${translatedText}`, 'info');
    return true;
    
  } catch (error) {
    logLanguageSystem(`Errore applicando traduzione a elemento: ${error.message}`, 'error', { element, config });
    return false;
  }
}

// =====================================================================
// SEZIONE 3: AGGIORNAMENTO SISTEMATICO DELL'UI
// =====================================================================

/**
 * Aggiorna sistematicamente tutti gli elementi dell'interfaccia utente
 * Questa è la funzione principale che garantisce che ogni stringa sia tradotta
 * 
 * @param {boolean} forceUpdate - Forza l'aggiornamento anche se la lingua non è cambiata
 * @returns {Object} Report dell'aggiornamento con statistiche
 */
function updateUILanguageSystematic(forceUpdate = false) {
  logLanguageSystem(`Avvio aggiornamento sistematico UI per lingua: ${currentLanguage}`);
  
  // Verifica che le traduzioni siano disponibili
  const t = translations[currentLanguage];
  if (!t) {
    logLanguageSystem(`Traduzioni non disponibili per: ${currentLanguage}`, 'error');
    return { success: false, reason: 'Traduzioni non disponibili' };
  }
  
  // Statistiche dell'aggiornamento
  const updateStats = {
    totalElements: 0,
    successfulUpdates: 0,
    failedUpdates: 0,
    missingElements: [],
    language: currentLanguage,
    categories: {}
  };
  
  // Processa ogni categoria di elementi
  Object.entries(UI_TRANSLATION_MAP).forEach(([category, elements]) => {
    logLanguageSystem(`Processando categoria: ${category}`, 'info');
    
    const categoryStats = {
      total: 0,
      successful: 0,
      failed: 0,
      missing: []
    };
    
    // Processa ogni elemento della categoria
    Object.entries(elements).forEach(([elementId, config]) => {
      updateStats.totalElements++;
      categoryStats.total++;
      
      const element = document.getElementById(elementId);
      
      if (!element) {
        // Elemento non trovato nel DOM
        const missingInfo = { elementId, category, config };
        updateStats.missingElements.push(missingInfo);
        categoryStats.missing.push(missingInfo);
        categoryStats.failed++;
        updateStats.failedUpdates++;
        
        logLanguageSystem(`Elemento DOM non trovato: #${elementId}`, 'warn');
        return;
      }
      
      // Applica la traduzione
      const success = applyTranslationToElement(element, config);
      
      if (success) {
        categoryStats.successful++;
        updateStats.successfulUpdates++;
      } else {
        categoryStats.failed++;
        updateStats.failedUpdates++;
      }
    });
    
    updateStats.categories[category] = categoryStats;
    logLanguageSystem(`Categoria ${category} completata: ${categoryStats.successful}/${categoryStats.total} successi`);
  });
  
  // Aggiorna componenti dinamici che potrebbero non essere nella mappa statica
  updateDynamicComponents();
  
  // Log del report finale
  logLanguageSystem(`Aggiornamento UI completato: ${updateStats.successfulUpdates}/${updateStats.totalElements} successi`);
  
  if (updateStats.missingElements.length > 0) {
    logLanguageSystem(`Elementi mancanti trovati: ${updateStats.missingElements.length}`, 'warn', 
      updateStats.missingElements.map(m => m.elementId));
  }
  
  return updateStats;
}

/**
 * Aggiorna componenti dinamici che potrebbero non essere presenti
 * nella mappa statica, come riepiloghi generati runtime
 */
function updateDynamicComponents() {
  logLanguageSystem('Aggiornamento componenti dinamici...');
  
  // Aggiorna riepiloghi se le funzioni sono disponibili
  if (typeof renderFacilitySummary === 'function') {
    try {
      renderFacilitySummary();
      logLanguageSystem('Riepilogo strutture aggiornato');
    } catch (error) {
      logLanguageSystem(`Errore aggiornando riepilogo strutture: ${error.message}`, 'error');
    }
  }
  
  if (typeof renderBuffSummary === 'function') {
    try {
      renderBuffSummary();
      logLanguageSystem('Riepilogo buff aggiornato');
    } catch (error) {
      logLanguageSystem(`Errore aggiornando riepilogo buff: ${error.message}`, 'error');
    }
  }
  
  // Aggiorna lista alleanze se disponibile
  if (typeof renderAllianceList === 'function') {
    try {
      renderAllianceList();
      logLanguageSystem('Lista alleanze aggiornata');
    } catch (error) {
      logLanguageSystem(`Errore aggiornando lista alleanze: ${error.message}`, 'error');
    }
  }
}

/**
 * Versione legacy della funzione updateUILanguage per compatibilità
 * Mantiene l'interfaccia esistente mentre utilizza il nuovo sistema
 */
function updateUILanguage() {
  return updateUILanguageSystematic();
}

// =====================================================================
// SEZIONE 4: GESTIONE SELETTORE LINGUE E INTERAZIONI
// =====================================================================

/**
 * Mostra/nasconde il selettore di lingue con animazione fluida
 * Aggiorna automaticamente lo stato dei pulsanti lingua
 */
function toggleLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (!selector) {
    logLanguageSystem('Selettore lingua non trovato nel DOM', 'warn');
    return;
  }
  
  if (selector.classList.contains('hidden')) {
    // Mostra il selettore
    selector.classList.remove('hidden');
    selector.style.animation = 'fadeIn 0.3s ease';
    
    // Evidenzia la lingua corrente
    updateLanguageButtons();
    
    logLanguageSystem('Selettore lingua aperto');
  } else {
    // Nascondi il selettore
    selector.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      selector.classList.add('hidden');
    }, 300);
    
    logLanguageSystem('Selettore lingua chiuso');
  }
}

/**
 * Imposta una nuova lingua scelta dall'utente
 * Gestisce tutto il processo di cambio lingua con feedback appropriato
 * 
 * @param {string} languageCode - Codice della lingua da impostare
 */
function setLanguage(languageCode) {
  logLanguageSystem(`Richiesta cambio lingua: ${currentLanguage} → ${languageCode}`);
  
  // Validazione lingua supportata
  if (!SUPPORTED_LANGUAGES.includes(languageCode)) {
    logLanguageSystem(`Lingua non supportata: ${languageCode}`, 'error');
    const t = translations[currentLanguage] || translations['en'];
    if (typeof showStatus === 'function') {
      showStatus(`❌ ${t.languageNotSupported || 'Language not supported'}: ${languageCode}`, 'error');
    }
    return;
  }
  
  // Validazione traduzioni prima del cambio
  if (LANGUAGE_SYSTEM_CONFIG.autoValidateTranslations) {
    const validation = validateLanguageTranslations(languageCode);
    if (!validation.isValid) {
      logLanguageSystem(`Traduzioni incomplete per ${languageCode}: ${validation.completeness}%`, 'warn', 
        validation.missingKeys.slice(0, 5)); // Mostra solo prime 5 chiavi mancanti
    }
  }
  
  // Aggiorna lingua globale (usa la funzione da utilities.js)
  if (typeof setAppLanguage === 'function') {
    setAppLanguage(languageCode, true); // true = scelta utente
  } else {
    // Fallback se utilities.js non è caricato
    currentLanguage = languageCode;
    localStorage.setItem('whiteout-language-user-set', languageCode);
  }
  
  // Aggiorna UI con piccolo ritardo per garantire che currentLanguage sia aggiornato
  setTimeout(() => {
    const updateResult = updateUILanguageSystematic();
    
    // Aggiorna pulsanti lingua
    updateLanguageButtons();
    
    // Mostra messaggio di conferma
    const t = translations[currentLanguage];
    const langName = getLanguageDisplayName(currentLanguage);
    const confirmMessage = `${t.languageSet || '🌐 Language set!'} ${langName}`;
    
    if (typeof showStatus === 'function') {
      showStatus(confirmMessage, 'success', 3000);
    }
    
    // Chiudi il selettore
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.classList.add('hidden');
    }
    
    // Mostra messaggio di benvenuto se è la prima volta
    showFirstTimeLanguageMessage();
    
    logLanguageSystem(`Cambio lingua completato: ${languageCode} (${updateResult.successfulUpdates}/${updateResult.totalElements} elementi aggiornati)`);
    
  }, LANGUAGE_SYSTEM_CONFIG.domUpdateDelay);
}

/**
 * Aggiorna lo stato visuale dei pulsanti lingua nel selettore
 * Evidenzia la lingua corrente e resetla le altre
 */
function updateLanguageButtons() {
  logLanguageSystem('Aggiornamento pulsanti lingua...');
  
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
    logLanguageSystem(`Pulsante evidenziato: lang-${currentLanguage}`);
  } else {
    logLanguageSystem(`Pulsante non trovato per lingua: lang-${currentLanguage}`, 'warn');
  }
}

/**
 * Mostra messaggio di benvenuto per utenti al primo utilizzo
 * Fornisce informazioni utili sull'uso del sistema multilingua
 */
function showFirstTimeLanguageMessage() {
  const isFirstTime = !localStorage.getItem('whiteout-language-user-set-before');
  
  if (isFirstTime) {
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
      
      if (typeof showStatus === 'function') {
        showStatus(message, 'info', 6000);
      }
      
    }, 4000); // Attende che l'utente si orienti dopo il cambio lingua
  }
}

// =====================================================================
// SEZIONE 5: INIZIALIZZAZIONE E SETUP DEL SISTEMA
// =====================================================================

/**
 * Inizializza completamente il sistema multilingua
 * Questa funzione deve essere chiamata dopo che il DOM è completamente caricato
 * 
 * @returns {Object} Report dell'inizializzazione
 */
function initializeLanguageSystem() {
  logLanguageSystem('Inizializzazione sistema lingua avanzato...');
  
  // Verifica prerequisiti
  if (typeof translations === 'undefined') {
    logLanguageSystem('File translations.js non caricato!', 'error');
    return { success: false, reason: 'Traduzioni non disponibili' };
  }
  
  if (typeof currentLanguage === 'undefined') {
    logLanguageSystem('currentLanguage non definito, uso default', 'warn');
    currentLanguage = 'en';
  }
  
  // Validazione lingua corrente
  const validation = validateLanguageTranslations(currentLanguage);
  
  if (!validation.isValid) {
    logLanguageSystem(`Lingua corrente (${currentLanguage}) ha traduzioni incomplete: ${validation.completeness}%`, 'warn');
    
    if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
      console.table(validation.missingKeys.slice(0, 10)); // Mostra prime 10 chiavi mancanti in tabella
    }
  }
  
  // Aggiorna UI iniziale
  const updateResult = updateUILanguageSystematic();
  
  // Aggiorna pulsanti lingua
  updateLanguageButtons();
  
  // Mostra messaggio di lingua auto-rilevata se appropriato
  setTimeout(() => {
    showAutoDetectedLanguageMessage();
  }, 1000);
  
  logLanguageSystem(`Sistema lingua inizializzato: ${currentLanguage} (${getLanguageDisplayName(currentLanguage)})`);
  logLanguageSystem(`Completezza traduzioni: ${validation.completeness}% (${validation.totalKeys - validation.missingKeys.length}/${validation.totalKeys})`);
  
  return {
    success: true,
    language: currentLanguage,
    validation: validation,
    updateResult: updateResult
  };
}

/**
 * Mostra messaggio informativo quando la lingua è stata rilevata automaticamente
 * Aiuta l'utente a capire come è stata scelta la lingua
 */
function showAutoDetectedLanguageMessage() {
  // Mostra solo se la lingua è stata rilevata automaticamente (non scelta dall'utente)
  const userSetLanguage = localStorage.getItem('whiteout-language-user-set');
  
  if (!userSetLanguage && typeof showWelcomeMessage === 'function') {
    showWelcomeMessage();
  }
}

// =====================================================================
// SEZIONE 6: FUNZIONI DI DEBUG E DIAGNOSTICA
// =====================================================================

/**
 * Funzione di debug completa per il sistema lingue
 * Fornisce report dettagliato su traduzioni, copertura e problemi
 * 
 * @param {boolean} showDetails - Se mostrare dettagli delle traduzioni mancanti
 * @returns {Object} Report completo del sistema
 */
function debugLanguageSystem(showDetails = false) {
  console.log('🔍 === DEBUG SISTEMA LINGUE ===');
  
  // Informazioni generali
  const currentInfo = getCurrentLanguageInfo();
  console.log('📊 Stato attuale:', currentInfo);
  
  // Validazione di tutte le lingue
  const languageReports = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    languageReports[lang] = validateLanguageTranslations(lang);
  });
  
  console.log('🌍 Report traduzioni per lingua:');
  Object.entries(languageReports).forEach(([lang, report]) => {
    const flag = {
      'it': '🇮🇹', 'en': '🇺🇸', 'es': '🇪🇸', 
      'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇵🇹'
    }[lang] || '🏳️';
    
    console.log(`  ${flag} ${lang.toUpperCase()}: ${report.completeness}% (${report.totalKeys - report.missingKeys.length}/${report.totalKeys})`);
    
    if (showDetails && report.missingKeys.length > 0) {
      console.log(`    ❌ Mancanti:`, report.missingKeys.map(k => k.translationKey));
    }
  });
  
  // Test elementi DOM
  const missingElements = [];
  const foundElements = [];
  
  Object.entries(UI_TRANSLATION_MAP).forEach(([category, elements]) => {
    Object.keys(elements).forEach(elementId => {
      const element = document.getElementById(elementId);
      if (element) {
        foundElements.push(elementId);
      } else {
        missingElements.push({ elementId, category });
      }
    });
  });
  
  console.log('🎯 Elementi DOM:');
  console.log(`  ✅ Trovati: ${foundElements.length}`);
  console.log(`  ❌ Mancanti: ${missingElements.length}`);
  
  if (showDetails && missingElements.length > 0) {
    console.log('  📋 Elementi mancanti:', missingElements);
  }
  
  // Configurazione attuale
  console.log('⚙️ Configurazione:', LANGUAGE_SYSTEM_CONFIG);
  
  console.log('=== FINE DEBUG SISTEMA LINGUE ===');
  
  return {
    currentLanguage: currentInfo,
    languageReports,
    domElements: { found: foundElements.length, missing: missingElements.length, missingDetails: missingElements },
    config: LANGUAGE_SYSTEM_CONFIG
  };
}

/**
 * Ottiene informazioni complete sulla lingua corrente
 * Utile per debug e diagnostica
 * 
 * @returns {Object} Informazioni dettagliate sulla lingua
 */
function getCurrentLanguageInfo() {
  return {
    current: currentLanguage,
    displayName: getLanguageDisplayName(currentLanguage),
    isUserSelected: !!localStorage.getItem('whiteout-language-user-set'),
    isAutoDetected: !localStorage.getItem('whiteout-language-user-set'),
    detectedLanguage: typeof detectDeviceLanguage === 'function' ? detectDeviceLanguage() : 'N/A',
    supportedLanguages: SUPPORTED_LANGUAGES.map(lang => ({
      code: lang,
      name: getLanguageDisplayName(lang)
    }))
  };
}

/**
 * Resetta tutte le impostazioni lingua a rilevamento automatico
 * Utile per testing e ripristino delle impostazioni
 * 
 * @returns {string} Nuova lingua rilevata automaticamente
 */
function resetLanguageToAuto() {
  logLanguageSystem('Reset lingua a rilevamento automatico...');
  
  // Rimuovi preferenze utente
  localStorage.removeItem('whiteout-language-user-set');
  localStorage.removeItem('whiteout-language-user-set-before');
  
  // Re-inizializza lingua automaticamente
  let newLang = 'en'; // fallback
  if (typeof initializeAppLanguage === 'function') {
    newLang = initializeAppLanguage();
  } else if (typeof detectDeviceLanguage === 'function') {
    newLang = detectDeviceLanguage();
    currentLanguage = newLang;
  }
  
  // Aggiorna UI
  setTimeout(() => {
    updateUILanguageSystematic();
    updateLanguageButtons();
    
    if (typeof showStatus === 'function') {
      showStatus(`🌍 Lingua resettata a rilevamento automatico: ${getLanguageDisplayName(newLang)}`, 'info', 4000);
    }
  }, LANGUAGE_SYSTEM_CONFIG.domUpdateDelay);
  
  logLanguageSystem(`Lingua resettata: ${newLang}`);
  return newLang;
}

// =====================================================================
// SEZIONE 7: ESPORTAZIONI GLOBALI E INTEGRAZIONE
// =====================================================================

// Esporta funzioni principali per uso da altri moduli
window.toggleLanguageSelector = toggleLanguageSelector;
window.setLanguage = setLanguage;
window.updateUILanguage = updateUILanguage;
window.initializeLanguageSystem = initializeLanguageSystem;

// Funzioni di debug e utilità (accessibili da console)
window.debugLanguageSystem = debugLanguageSystem;
window.getCurrentLanguageInfo = getCurrentLanguageInfo;
window.resetLanguageToAuto = resetLanguageToAuto;
window.validateAllLanguages = () => {
  const results = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    results[lang] = validateLanguageTranslations(lang);
  });
  return results;
};

// Integrazione con il debugger globale se disponibile
if (typeof window.debugWS !== 'undefined') {
  window.debugWS.language = {
    current: getCurrentLanguageInfo,
    debug: debugLanguageSystem,
    reset: resetLanguageToAuto,
    set: setLanguage,
    validate: validateLanguageTranslations,
    config: LANGUAGE_SYSTEM_CONFIG,
    map: UI_TRANSLATION_MAP
  };
}

// =====================================================================
// SEZIONE 8: INIZIALIZZAZIONE AUTOMATICA
// =====================================================================

/**
 * Auto-inizializzazione quando il DOM è pronto
 * Il sistema si avvia automaticamente per massima compatibilità
 */
document.addEventListener('DOMContentLoaded', function() {
  // Attesa breve per assicurarsi che tutti i moduli siano caricati
  setTimeout(() => {
    if (typeof currentLanguage !== 'undefined') {
      const initResult = initializeLanguageSystem();
      
      if (initResult.success) {
        logLanguageSystem(`✅ Sistema lingua avviato automaticamente: ${initResult.language}`);
      } else {
        logLanguageSystem(`❌ Errore avvio automatico: ${initResult.reason}`, 'error');
      }
    } else {
      logLanguageSystem('❌ currentLanguage non definito, sistema lingua non avviato automaticamente', 'error');
    }
  }, 200);
});

// =====================================================================
// LOG FINALE E VERIFICA INTEGRITÀ
// =====================================================================

logLanguageSystem('Sistema lingue completo caricato con successo');
logLanguageSystem(`Configurazione: ${Object.keys(UI_TRANSLATION_MAP).length} categorie, ${Object.values(UI_TRANSLATION_MAP).reduce((total, cat) => total + Object.keys(cat).length, 0)} elementi totali`);

// Verifica integrità al caricamento
if (typeof translations !== 'undefined' && typeof currentLanguage !== 'undefined') {
  logLanguageSystem(`✅ Prerequisiti soddisfatti per lingua: ${currentLanguage}`);
} else {
  logLanguageSystem('⚠️ Alcuni prerequisiti mancanti, sistema lingua potrebbe non funzionare correttamente', 'warn');
}

console.log('🌐 LanguageSystem.js caricato completamente - Pronto per inizializzazione');