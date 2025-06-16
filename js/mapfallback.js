// =====================================================================
// MAPFALLBACK.JS - GESTIONE ROBUSTA CARICAMENTO MAPPA
// =====================================================================
// Questo file gestisce il caricamento della mappa di gioco, fornendo
// fallback intelligenti in caso di errori e garantendo compatibilità
// cross-browser ottimale.

console.log('🗺️ Inizializzazione sistema gestione mappa...');

// =====================================================================
// SEZIONE 1: FUNZIONI DI GESTIONE CARICAMENTO MAPPA
// =====================================================================

/**
 * Gestisce il caricamento riuscito della mappa
 * Viene chiamata quando l'immagine della mappa si carica correttamente
 */
function handleMapLoad() {
  console.log('✅ Mappa caricata con successo');
  
  // Rimuovi eventuali indicatori di caricamento
  const mapWrapper = document.getElementById('map-wrapper');
  if (mapWrapper) {
    mapWrapper.classList.remove('loading');
    mapWrapper.classList.add('loaded');
  }
  
  // Mostra messaggio di stato se disponibile
  if (typeof showStatus === 'function') {
    const t = translations[currentLanguage] || {};
    const message = t.mapLoaded || '🗺️ Map loaded successfully';
    showStatus(message, 'success', 2000);
  }
  
  // Notifica altri sistemi che la mappa è pronta
  triggerMapLoadedEvent();
}

/**
 * Gestisce gli errori di caricamento della mappa
 * Fornisce fallback intelligente quando l'immagine principale non si carica
 */
function handleMapError() {
  console.log('⚠️ Errore caricamento mappa, attivando sistema fallback...');
  
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('❌ Elemento mappa non trovato');
    return;
  }
  
  // Genera mappa SVG di fallback
  const fallbackSVG = generateFallbackMapSVG();
  
  // Converti SVG in URL blob per compatibilità
  const blob = new Blob([fallbackSVG], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  // Sostituisci l'immagine con il fallback
  mapElement.src = url;
  mapElement.classList.add('fallback-map');
  
  // Cleanup dell'URL dopo che l'immagine fallback è caricata
  mapElement.onload = () => {
    URL.revokeObjectURL(url);
    console.log('✅ Mappa fallback caricata e URL pulito');
    
    // Mostra notifica all'utente
    if (typeof showStatus === 'function') {
      const t = translations[currentLanguage] || {};
      const message = t.mapFallbackLoaded || '🗺️ Using backup map visualization';
      showStatus(message, 'info', 4000);
    }
    
    // Notifica che il fallback è attivo
    triggerMapFallbackEvent();
  };
  
  // Gestisci il caso in cui anche il fallback fallisce
  mapElement.onerror = () => {
    console.error('❌ Anche il fallback SVG ha fallito');
    showCriticalMapError();
  };
}

/**
 * Genera una mappa SVG di fallback professionale
 * Crea una visualizzazione di backup quando l'immagine principale non si carica
 * 
 * @returns {string} SVG markup per la mappa fallback
 */
function generateFallbackMapSVG() {
  // Ottieni traduzioni per la lingua corrente
  const t = translations[currentLanguage] || translations['en'] || {};
  
  const fallbackSVG = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Whiteout Survival Map Fallback">
      <defs>
        <!-- Gradiente per background professionale -->
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3c72;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#2a5298;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e3c72;stop-opacity:1" />
        </linearGradient>
        
        <!-- Pattern per texture -->
        <pattern id="gridPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        </pattern>
        
        <!-- Filtro per effetto glow -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background principale -->
      <rect width="100%" height="100%" fill="url(#bgGradient)"/>
      
      <!-- Pattern texture overlay -->
      <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.3"/>
      
      <!-- Titolo principale -->
      <text x="50%" y="35%" font-family="Inter, Arial, sans-serif" font-size="32" font-weight="bold" 
            fill="#ffffff" text-anchor="middle" filter="url(#glow)" dy=".3em">
        🗺️ ${t.interactiveMap || 'Interactive Map'}
      </text>
      
      <!-- Sottotitolo informativo -->
      <text x="50%" y="45%" font-family="Inter, Arial, sans-serif" font-size="16" 
            fill="rgba(255,255,255,0.9)" text-anchor="middle" dy=".3em">
        ${t.mapFallbackSubtitle || 'Backup visualization - Replace with game map (assets/map.png)'}
      </text>
      
      <!-- Icone decorative per i tipi di facility -->
      <g transform="translate(100, 350)">
        <circle cx="0" cy="0" r="25" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        <text x="0" y="0" font-size="20" text-anchor="middle" dy=".3em">🏰</text>
        <text x="0" y="35" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">Castle</text>
      </g>
      
      <g transform="translate(200, 350)">
        <circle cx="0" cy="0" r="20" fill="rgba(79,172,254,0.2)" stroke="rgba(79,172,254,0.5)" stroke-width="2"/>
        <text x="0" y="0" font-size="16" text-anchor="middle" dy=".3em">🔨</text>
        <text x="0" y="30" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">Construction</text>
      </g>
      
      <g transform="translate(300, 350)">
        <circle cx="0" cy="0" r="20" fill="rgba(67,233,123,0.2)" stroke="rgba(67,233,123,0.5)" stroke-width="2"/>
        <text x="0" y="0" font-size="16" text-anchor="middle" dy=".3em">🏭</text>
        <text x="0" y="30" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">Production</text>
      </g>
      
      <g transform="translate(400, 350)">
        <circle cx="0" cy="0" r="20" fill="rgba(255,107,107,0.2)" stroke="rgba(255,107,107,0.5)" stroke-width="2"/>
        <text x="0" y="0" font-size="16" text-anchor="middle" dy=".3em">⚔️</text>
        <text x="0" y="30" font-size="10" fill="rgba(255,255,255,0.7)" text-anchor="middle">Weapons</text>
      </g>
      
      <!-- Informazioni tecniche -->
      <text x="50%" y="85%" font-family="Inter, Arial, sans-serif" font-size="12" 
            fill="rgba(255,255,255,0.6)" text-anchor="middle" dy=".3em">
        ${t.mapFallbackInfo || 'Markers will be positioned when game map loads'}
      </text>
      
      <!-- Indicatore di stato -->
      <g transform="translate(750, 50)">
        <circle cx="0" cy="0" r="8" fill="#ff6b6b">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x="-35" y="0" font-size="10" fill="rgba(255,255,255,0.8)" text-anchor="end" dy=".3em">Fallback</text>
      </g>
    </svg>
  `;
  
  return fallbackSVG;
}

/**
 * Gestisce errori critici quando anche il fallback non funziona
 * Fornisce un'interfaccia minimale per evitare che l'app si blocchi completamente
 */
function showCriticalMapError() {
  console.error('❌ Errore critico: impossibile caricare qualsiasi visualizzazione mappa');
  
  const mapWrapper = document.getElementById('map-wrapper');
  if (mapWrapper) {
    mapWrapper.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 400px;
        background: rgba(255, 107, 107, 0.1);
        border: 2px dashed rgba(255, 107, 107, 0.5);
        border-radius: 12px;
        color: #ff6b6b;
        text-align: center;
        padding: 40px;
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
        <h3 style="margin: 0 0 10px 0; color: #ff6b6b;">Map Loading Error</h3>
        <p style="margin: 0; color: rgba(255, 107, 107, 0.8); font-size: 14px;">
          Unable to load map visualization. Please check your internet connection<br>
          or contact support if the problem persists.
        </p>
      </div>
    `;
  }
  
  // Mostra notifica critica
  if (typeof showStatus === 'function') {
    showStatus('❌ Critical map loading error', 'error', 8000);
  }
}

// =====================================================================
// SEZIONE 2: SISTEMA DI EVENTI E NOTIFICHE
// =====================================================================

/**
 * Notifica altri sistemi che la mappa è stata caricata con successo
 * Permette ad altri componenti di reagire al caricamento della mappa
 */
function triggerMapLoadedEvent() {
  // Crea evento personalizzato
  const mapLoadedEvent = new CustomEvent('mapLoaded', {
    detail: {
      timestamp: new Date().toISOString(),
      mapType: 'original'
    }
  });
  
  // Dispatch dell'evento
  document.dispatchEvent(mapLoadedEvent);
  
  // Callback per sistemi legacy
  if (typeof window.onMapLoaded === 'function') {
    window.onMapLoaded();
  }
}

/**
 * Notifica che è attivo il sistema di fallback
 * Permette ad altri componenti di adattarsi al funzionamento in modalità fallback
 */
function triggerMapFallbackEvent() {
  const mapFallbackEvent = new CustomEvent('mapFallback', {
    detail: {
      timestamp: new Date().toISOString(),
      mapType: 'fallback'
    }
  });
  
  document.dispatchEvent(mapFallbackEvent);
  
  if (typeof window.onMapFallback === 'function') {
    window.onMapFallback();
  }
}

// =====================================================================
// SEZIONE 3: INIZIALIZZAZIONE E SETUP EVENT LISTENERS
// =====================================================================

/**
 * Inizializza il sistema di gestione mappa in modo robusto
 * Sostituisce gli handler inline con event listeners moderni
 */
function initializeMapHandling() {
  console.log('🔧 Inizializzazione gestione mappa...');
  
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.warn('⚠️ Elemento mappa non trovato durante inizializzazione');
    return false;
  }
  
  // Rimuovi eventuali handler inline esistenti per evitare conflitti
  mapElement.onload = null;
  mapElement.onerror = null;
  
  // Aggiungi event listeners moderni
  mapElement.addEventListener('load', handleMapLoad, { once: true });
  mapElement.addEventListener('error', handleMapError, { once: true });
  
  // Se l'immagine è già caricata (cache), attiva immediatamente l'handler
  if (mapElement.complete) {
    if (mapElement.naturalWidth > 0) {
      // Immagine caricata con successo
      setTimeout(handleMapLoad, 0);
    } else {
      // Immagine fallita nel caricamento
      setTimeout(handleMapError, 0);
    }
  }
  
  console.log('✅ Gestione mappa inizializzata con event listeners moderni');
  return true;
}

/**
 * Fornisce informazioni diagnostiche sul sistema mappa
 * Utile per debug e troubleshooting
 */
function getMapSystemStatus() {
  const mapElement = document.getElementById('map');
  
  if (!mapElement) {
    return { status: 'error', reason: 'Map element not found' };
  }
  
  return {
    status: mapElement.complete ? 'loaded' : 'loading',
    src: mapElement.src,
    naturalWidth: mapElement.naturalWidth,
    naturalHeight: mapElement.naturalHeight,
    isFallback: mapElement.classList.contains('fallback-map'),
    hasError: mapElement.naturalWidth === 0 && mapElement.complete
  };
}

// =====================================================================
// SEZIONE 4: ESPORTAZIONI GLOBALI E INTEGRAZIONE
// =====================================================================

// Esporta funzioni per compatibilità e uso esterno
window.handleMapLoad = handleMapLoad;
window.handleMapError = handleMapError;
window.initializeMapHandling = initializeMapHandling;
window.getMapSystemStatus = getMapSystemStatus;

// Integrazione con sistema debug globale
if (typeof window.debugWS !== 'undefined') {
  window.debugWS.map = {
    status: getMapSystemStatus,
    reload: () => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const originalSrc = mapElement.src;
        mapElement.src = '';
        mapElement.src = originalSrc;
      }
    },
    forceFallback: handleMapError,
    init: initializeMapHandling
  };
}

// =====================================================================
// SEZIONE 5: INIZIALIZZAZIONE AUTOMATICA
// =====================================================================

/**
 * Auto-inizializzazione quando il DOM è pronto
 * Garantisce che il sistema sia attivo indipendentemente dall'ordine di caricamento
 */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const success = initializeMapHandling();
    if (success) {
      console.log('🗺️ Sistema gestione mappa auto-inizializzato');
    } else {
      console.warn('⚠️ Auto-inizializzazione mappa fallita, verifica presenza elemento #map');
    }
  }, 100); // Piccolo delay per garantire che l'HTML sia completamente renderizzato
});

// Fallback per inizializzazione immediata se DOM già pronto
if (document.readyState === 'loading') {
  // DOM non ancora caricato, aspetta DOMContentLoaded
} else {
  // DOM già caricato, inizializza immediatamente
  setTimeout(() => {
    if (typeof window.mapHandlingInitialized === 'undefined') {
      initializeMapHandling();
      window.mapHandlingInitialized = true;
    }
  }, 50);
}

console.log('✅ MapFallback.js caricato - Sistema di gestione mappa pronto');

// =====================================================================
// FINE MAPFALLBACK.JS
// =====================================================================