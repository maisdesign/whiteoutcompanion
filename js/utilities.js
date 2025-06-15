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

// === EXPORT PNG ===

// Carica html2canvas dinamicamente se non già presente
function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) {
      resolve(window.html2canvas);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => {
      if (window.html2canvas) {
        resolve(window.html2canvas);
      } else {
        reject(new Error('html2canvas failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load html2canvas'));
    document.head.appendChild(script);
  });
}

// Prepara il contenuto per l'export
function prepareExportContent() {
  const t = translations[currentLanguage];
  
  // Crea container temporaneo
  const exportContainer = document.createElement('div');
  exportContainer.style.cssText = `
    position: fixed;
    top: -10000px;
    left: -10000px;
    width: 1200px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
    font-family: 'Inter', Arial, sans-serif;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  `;
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  `;
  header.innerHTML = `
    <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #fff;">
      🗺️ Whiteout Survival Companion
    </h1>
    <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
      ${t.subtitle}
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.7);">
      ${t.exportedOn || 'Esportato il'}: ${new Date().toLocaleString(currentLanguage)}
    </p>
  `;
  
  // Clona la mappa
  const originalMap = document.querySelector('.map-container');
  const mapClone = originalMap.cloneNode(true);
  
  // Rimuovi elementi non necessari dal clone
  const statusElements = mapClone.querySelectorAll('.map-status');
  statusElements.forEach(el => el.remove());
  
  const dropdowns = mapClone.querySelectorAll('.marker-dropdown');
  dropdowns.forEach(el => el.remove());
  
  // Stile per il clone della mappa
  mapClone.style.cssText = `
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  // Assicurati che la legenda sia visibile
  const legend = mapClone.querySelector('#map-legend');
  if (legend) {
    legend.classList.remove('hidden');
    legend.style.display = 'block';
  }
  
  // Statistics
  const stats = createExportStats();
  
  // Assembly
  exportContainer.appendChild(header);
  exportContainer.appendChild(mapClone);
  exportContainer.appendChild(stats);
  
  document.body.appendChild(exportContainer);
  
  return exportContainer;
}

// Crea sezione statistiche per export
function createExportStats() {
  const t = translations[currentLanguage];
  
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  const totalFacilities = facilityData.length;
  const freeFacilities = totalFacilities - assignedFacilities;
  const alliancesWithAssignments = alliances.filter(alliance => 
    facilityData.some(f => f.Alliance === alliance.name)
  ).length;
  
  const statsContainer = document.createElement('div');
  statsContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  statsContainer.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #4facfe; margin-bottom: 5px;">
        ${alliances.length}
      </div>
      <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8);">
        ${t.alliances}
      </div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #43e97b; margin-bottom: 5px;">
        ${assignedFacilities}
      </div>
      <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8);">
        ${t.assigned}
      </div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #ff6b6b; margin-bottom: 5px;">
        ${freeFacilities}
      </div>
      <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8);">
        ${t.free || 'Libere'}
      </div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #ffc107; margin-bottom: 5px;">
        ${alliancesWithAssignments}
      </div>
      <div style="font-size: 12px; color: rgba(255, 255, 255, 0.8);">
        ${t.active || 'Attive'}
      </div>
    </div>
  `;
  
  return statsContainer;
}

// Funzione principale di export PNG
async function exportToPNG() {
  const t = translations[currentLanguage];
  
  try {
    // Mostra loading
    showStatus(`📸 ${t.preparingExport || 'Preparazione export...'}`, 'info');
    
    // Carica html2canvas
    const html2canvas = await loadHtml2Canvas();
    
    // Prepara contenuto
    const exportContainer = prepareExportContent();
    
    // Attendi che le immagini si carichino
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showStatus(`🎨 ${t.renderingImage || 'Rendering immagine...'}`, 'info');
    
    // Genera screenshot
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: null,
      scale: 2, // Alta qualità
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 1200,
      height: exportContainer.scrollHeight
    });
    
    // Cleanup
    document.body.removeChild(exportContainer);
    
    // Genera filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `whiteout-survival-map-${timestamp}.png`;
    
    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      showStatus(`✅ ${t.pngExported || 'PNG esportato'}: ${filename} (${fileSizeMB}MB)`, 'success', 5000);
    }, 'image/png', 0.95);
    
  } catch (error) {
    console.error('Errore export PNG:', error);
    showStatus(`❌ ${t.exportError || 'Errore durante l\'export'}: ${error.message}`, 'error', 5000);
  }
}

// Funzione globale per il pulsante
window.exportPNG = exportToPNG;

// === ESPORTAZIONI GLOBALI ===
// Rendi le funzioni accessibili globalmente per compatibilità

// Funzioni di validazione
window.validateImageFile = validateImageFile;
window.processImageFile = processImageFile;
window.showImageValidationErrors = showImageValidationErrors;

// Funzioni icone
window.generateUniqueAllianceIcon = generateUniqueAllianceIcon;
window.isIconUnique = isIconUnique;
window.generateFallbackIcon = generateFallbackIcon;

// Funzioni export
window.loadHtml2Canvas = loadHtml2Canvas;
window.exportToPNG = exportToPNG;

// Log delle funzioni esportate
console.log('🔧 Funzioni utilities esportate globalmente:', {
  validateImageFile: typeof validateImageFile === 'function',
  processImageFile: typeof processImageFile === 'function',
  generateUniqueAllianceIcon: typeof generateUniqueAllianceIcon === 'function',
  exportToPNG: typeof exportToPNG === 'function',
  loadHtml2Canvas: typeof loadHtml2Canvas === 'function'
});