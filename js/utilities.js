// === STATO ===
const alliances = [];
let calibrationSettings = { offsetX: 0, offsetY: 0.7, scaleX: 1.0, scaleY: 1.0 };
let calibrationUnlocked = false;

// === SISTEMA DI RILEVAMENTO LINGUA AUTOMATICO ===

// Lingue supportate dall'app
const SUPPORTED_LANGUAGES = ['it', 'en', 'es', 'fr', 'de', 'pt'];
const DEFAULT_LANGUAGE = 'en'; // Inglese come fallback

// Variabile lingua corrente (inizializzata dinamicamente)
let currentLanguage = DEFAULT_LANGUAGE;

// Funzione per rilevare la lingua del dispositivo
function detectDeviceLanguage() {
  console.log('🌐 Rilevamento lingua dispositivo...');
  
  // Ottieni le lingue preferite del browser
  const browserLanguages = [
    navigator.language,           // Lingua principale (es: "en-US", "it-IT")
    ...(navigator.languages || []), // Array di lingue preferite
    navigator.userLanguage        // Fallback per IE
  ].filter(Boolean); // Rimuovi valori null/undefined
  
  console.log('📱 Lingue browser rilevate:', browserLanguages);
  
  // Cerca la prima lingua supportata
  for (const browserLang of browserLanguages) {
    // Estrai il codice lingua (es: "en-US" → "en")
    const langCode = browserLang.toLowerCase().split('-')[0];
    
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      console.log(`✅ Lingua supportata trovata: ${langCode} (da ${browserLang})`);
      return langCode;
    }
  }
  
  console.log(`⚠️ Nessuna lingua supportata trovata, uso default: ${DEFAULT_LANGUAGE}`);
  return DEFAULT_LANGUAGE;
}

// Funzione per inizializzare la lingua dell'app
function initializeAppLanguage() {
  console.log('🔧 Inizializzazione lingua app...');
  
  // 1. Controlla se c'è una lingua salvata dall'utente (priorità massima)
  const userSetLanguage = localStorage.getItem('whiteout-language-user-set');
  if (userSetLanguage && SUPPORTED_LANGUAGES.includes(userSetLanguage)) {
    console.log(`👤 Lingua scelta dall'utente: ${userSetLanguage}`);
    currentLanguage = userSetLanguage;
    return userSetLanguage;
  }
  
  // 2. Controlla lingua salvata automaticamente
  const savedLanguage = localStorage.getItem('whiteout-language');
  if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    console.log(`💾 Lingua salvata trovata: ${savedLanguage}`);
    currentLanguage = savedLanguage;
    return savedLanguage;
  }
  
  // 3. Se non c'è lingua salvata, rileva automaticamente
  const detectedLanguage = detectDeviceLanguage();
  
  // 4. Salva la lingua rilevata per la prossima volta
  localStorage.setItem('whiteout-language', detectedLanguage);
  currentLanguage = detectedLanguage;
  console.log(`🎯 Lingua inizializzata: ${detectedLanguage}`);
  
  return detectedLanguage;
}

// Funzione per ottenere il nome della lingua in formato leggibile
function getLanguageDisplayName(langCode) {
  const languageNames = {
    'en': '🇺🇸 English',
    'it': '🇮🇹 Italiano', 
    'es': '🇪🇸 Español',
    'fr': '🇫🇷 Français',
    'de': '🇩🇪 Deutsch',
    'pt': '🇵🇹 Português'
  };
  
  return languageNames[langCode] || `${langCode.toUpperCase()}`;
}

// Funzione per forzare una lingua specifica
function setAppLanguage(langCode, userChoice = false) {
  if (!SUPPORTED_LANGUAGES.includes(langCode)) {
    console.warn(`⚠️ Lingua non supportata: ${langCode}, uso ${DEFAULT_LANGUAGE}`);
    langCode = DEFAULT_LANGUAGE;
  }
  
  currentLanguage = langCode;
  
  // Salva sempre in localStorage normale
  localStorage.setItem('whiteout-language', langCode);
  
  // Se è una scelta dell'utente, salvala separatamente con priorità
  if (userChoice) {
    localStorage.setItem('whiteout-language-user-set', langCode);
    console.log(`👤 Lingua scelta dall'utente: ${langCode}`);
  }
  
  console.log(`🌐 Lingua impostata: ${langCode} (${getLanguageDisplayName(langCode)})`);
  return langCode;
}

// Funzione per mostrare un messaggio di benvenuto localizzato
function showWelcomeMessage() {
  const langName = getLanguageDisplayName(currentLanguage);
  
  const welcomeMessages = {
    'en': `🌍 Language auto-detected: ${langName}`,
    'it': `🌍 Lingua rilevata automaticamente: ${langName}`,
    'es': `🌍 Idioma detectado automáticamente: ${langName}`,
    'fr': `🌍 Langue détectée automatiquement: ${langName}`,
    'de': `🌍 Sprache automatisch erkannt: ${langName}`,
    'pt': `🌍 Idioma detectado automaticamente: ${langName}`
  };
  
  const message = welcomeMessages[currentLanguage] || welcomeMessages['en'];
  
  // Mostra il messaggio solo se la lingua è stata rilevata automaticamente
  const userSetLanguage = localStorage.getItem('whiteout-language-user-set');
  if (!userSetLanguage) {
    setTimeout(() => {
      showStatus(message, 'info', 5000);
    }, 2000);
  }
}

// === FUNZIONI UTILITIES ESISTENTI ===
function getRandomColor() {
  const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function showStatus(message, type = 'info', duration = 4000) {
  console.log(`📱 Status [${type}]:`, message);
  
  // Cerca diversi possibili container per i messaggi
  let statusEl = document.getElementById('map-status');
  
  // Se non esiste, prova a crearne uno temporaneo
  if (!statusEl) {
    statusEl = createTemporaryStatusElement();
  }
  
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.opacity = '1';
    
    // Applica colori in base al tipo
    switch(type) {
      case 'success':
        statusEl.style.background = 'rgba(67, 233, 123, 0.2)';
        statusEl.style.borderColor = 'rgba(67, 233, 123, 0.5)';
        statusEl.style.color = '#43e97b';
        break;
      case 'error':
        statusEl.style.background = 'rgba(220, 53, 69, 0.2)';
        statusEl.style.borderColor = 'rgba(220, 53, 69, 0.5)';
        statusEl.style.color = '#ff6b6b';
        break;
      case 'warning':
        statusEl.style.background = 'rgba(255, 193, 7, 0.2)';
        statusEl.style.borderColor = 'rgba(255, 193, 7, 0.5)';
        statusEl.style.color = '#ffc107';
        break;
      default: // info
        statusEl.style.background = 'rgba(79, 172, 254, 0.2)';
        statusEl.style.borderColor = 'rgba(79, 172, 254, 0.5)';
        statusEl.style.color = '#4facfe';
    }
    
    // Auto-hide dopo la durata specificata
    if (duration > 0) {
      setTimeout(() => {
        if (statusEl) {
          statusEl.style.opacity = '0';
          setTimeout(() => {
            if (statusEl && statusEl.id === 'temp-status') {
              statusEl.remove();
            } else if (statusEl) {
              statusEl.style.display = 'none';
            }
          }, 300);
        }
      }, duration);
    }
  }
  
  // Fallback: usa console se non riesce a mostrare visualmente
  if (!statusEl) {
    console.warn('Status element not found, using console only');
  }
}

function createTemporaryStatusElement() {
  // Crea un elemento di stato temporaneo se non esiste
  const tempStatus = document.createElement('div');
  tempStatus.id = 'temp-status';
  tempStatus.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 12px 20px;
    border-radius: 8px;
    border: 1px solid;
    font-size: 14px;
    font-weight: 500;
    max-width: 400px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  `;
  
  document.body.appendChild(tempStatus);
  return tempStatus;
}

// Funzione di utilità per verificare se un elemento DOM esiste
function checkDOMElement(id, context = 'generale') {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`⚠️ Elemento DOM mancante [${context}]: #${id}`);
    return false;
  }
  return element;
}

// Funzione per verificare la salute dell'app
function checkAppHealth() {
  console.log('🔍 Controllo salute app...');
  
  const requiredElements = [
    'alliance-list',
    'total-alliances', 
    'assigned-facilities',
    'facility-summary',
    'buff-summary',
    'map-wrapper'
  ];
  
  const missingElements = [];
  const foundElements = [];
  
  requiredElements.forEach(id => {
    if (checkDOMElement(id, 'health-check')) {
      foundElements.push(id);
    } else {
      missingElements.push(id);
    }
  });
  
  console.log('✅ Elementi trovati:', foundElements);
  if (missingElements.length > 0) {
    console.warn('❌ Elementi mancanti:', missingElements);
  }
  
  console.log('📊 Stato dati:');
  console.log('  - Alleanze:', alliances.length);
  console.log('  - Strutture totali:', facilityData.length);
  console.log('  - Strutture assegnate:', facilityData.filter(f => f.Alliance).length);
  console.log('  - Lingua corrente:', currentLanguage);
  console.log('  - Lingua rilevata browser:', detectDeviceLanguage());
  console.log('  - Calibrazione sbloccata:', calibrationUnlocked);
  
  return {
    missingElements,
    foundElements,
    dataHealth: {
      alliances: alliances.length,
      totalFacilities: facilityData.length,
      assignedFacilities: facilityData.filter(f => f.Alliance).length,
      language: currentLanguage,
      detectedLanguage: detectDeviceLanguage()
    }
  };
}

// Funzione per forzare il refresh dell'UI
function forceUIRefresh() {
  console.log('🔄 Forzando refresh completo UI...');
  
  try {
    // Aggiorna statistiche
    if (typeof updateStats === 'function') {
      updateStats();
    }
    
    // Aggiorna lista alleanze  
    if (typeof renderAllianceList === 'function') {
      renderAllianceList();
    }
    
    // Aggiorna riepiloghi
    if (typeof updateSummaries === 'function') {
      updateSummaries();
    }
    
    // Aggiorna lingua
    if (typeof updateUILanguage === 'function') {
      updateUILanguage();
    }
    
    console.log('✅ Refresh UI completato');
    showStatus('🔄 Interfaccia aggiornata', 'success', 2000);
    
  } catch (error) {
    console.error('❌ Errore durante refresh UI:', error);
    showStatus('❌ Errore aggiornamento interfaccia', 'error');
  }
}

// Funzione per debug facilitato
function debugInfo() {
  console.log('=== DEBUG INFO ===');
  const health = checkAppHealth();
  
  console.log('🔧 Calibrazione:', calibrationSettings);
  console.log('🌐 Traduzioni disponibili:', Object.keys(translations));
  console.log('🗣️ Info lingua:');
  console.log('  - Lingua corrente:', currentLanguage);
  console.log('  - Lingua rilevata:', detectDeviceLanguage());
  console.log('  - Lingua utente salvata:', localStorage.getItem('whiteout-language-user-set'));
  console.log('  - Lingua auto salvata:', localStorage.getItem('whiteout-language'));
  
  // Mostra alcune strutture di esempio
  console.log('📋 Prime 3 strutture:', facilityData.slice(0, 3));
  
  // Mostra alleanze
  console.log('🏰 Alleanze:', alliances.map(a => ({ name: a.name, icon: a.icon.substring(0, 50) + '...' })));
  
  // Conta marker sulla pagina
  const markersOnPage = document.querySelectorAll('.marker').length;
  console.log('📍 Marker sulla pagina:', markersOnPage);
  
  // Verifica dropdown aperti
  const openDropdowns = document.querySelectorAll('.marker-dropdown').length;
  console.log('📋 Dropdown aperti:', openDropdowns);
  
  return health;
}

// Funzione per ripulire eventuali stati inconsistenti
function cleanupInconsistentState() {
  console.log('🧹 Pulizia stato inconsistente...');
  
  // Rimuovi dropdown orfani
  document.querySelectorAll('.marker-dropdown').forEach(dropdown => {
    if (!dropdown.parentNode || !dropdown.closest('.marker')) {
      dropdown.remove();
    }
  });
  
  // Verifica coerenza dati alleanze
  facilityData.forEach(facility => {
    if (facility.Alliance && !alliances.find(a => a.name === facility.Alliance)) {
      console.warn(`⚠️ Struttura con alleanza inesistente: ${facility.Type} → ${facility.Alliance}`);
      delete facility.Alliance;
    }
  });
  
  console.log('✅ Pulizia completata');
}

// Inizializza la lingua al caricamento del file
console.log('🌐 Inizializzazione sistema lingua...');
initializeAppLanguage();

// Aggiungi funzioni globali per debug (solo in sviluppo)
if (typeof window !== 'undefined') {
  window.debugWS = {
    health: checkAppHealth,
    refresh: forceUIRefresh,
    debug: debugInfo,
    cleanup: cleanupInconsistentState,
    showStatus: showStatus,
    setLanguage: setAppLanguage,
    detectLanguage: detectDeviceLanguage,
    getLanguageInfo: () => ({
      current: currentLanguage,
      detected: detectDeviceLanguage(),
      userSet: localStorage.getItem('whiteout-language-user-set'),
      autoSaved: localStorage.getItem('whiteout-language')
    })
  };
}