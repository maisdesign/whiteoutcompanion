// === STATO ===
const alliances = [];
let calibrationSettings = { offsetX: 0, offsetY: 0.7, scaleX: 1.0, scaleY: 1.0 };
let calibrationUnlocked = false;
let currentLanguage = 'it';

// === FUNZIONI UTILITIES ===
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
  console.log('  - Calibrazione sbloccata:', calibrationUnlocked);
  
  return {
    missingElements,
    foundElements,
    dataHealth: {
      alliances: alliances.length,
      totalFacilities: facilityData.length,
      assignedFacilities: facilityData.filter(f => f.Alliance).length,
      language: currentLanguage
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

// Aggiungi funzioni globali per debug (solo in sviluppo)
if (typeof window !== 'undefined') {
  window.debugWS = {
    health: checkAppHealth,
    refresh: forceUIRefresh,
    debug: debugInfo,
    cleanup: cleanupInconsistentState,
    showStatus: showStatus
  };
}