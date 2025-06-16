// =====================================================================
// MAPZOOM.JS - SISTEMA DI ZOOM INTELLIGENTE CON GESTIONE TOUCH COOPERATIVA
// =====================================================================
// Questo modulo implementa un sistema di zoom completo per la mappa
// interattiva, ottimizzato per dispositivi touch e compatibile con
// l'architettura esistente di marker e calibrazione.
//
// FILOSOFIA DEL DESIGN:
// - Zoom fluido e responsivo per migliorare l'usabilità mobile
// - Integrazione perfetta con il sistema di marker esistente
// - Supporto per gesture touch native (pinch-to-zoom)
// - Controlli accessibili per utenti con diverse abilità
// - Performance ottimizzate per dispositivi con risorse limitate
// - GESTIONE COOPERATIVA degli eventi touch per evitare conflitti con i marker

console.log('🔍 Caricamento sistema zoom intelligente...');

// =====================================================================
// SEZIONE 1: CONFIGURAZIONE E COSTANTI
// =====================================================================

/**
 * Configurazione del sistema di zoom
 * Questi parametri controllano il comportamento e i limiti del zoom
 */
const ZOOM_CONFIG = {
  // Livelli di zoom
  minZoom: 0.5,    // Zoom minimo (50% della dimensione originale)
  maxZoom: 3.0,    // Zoom massimo (300% della dimensione originale)
  defaultZoom: 1.0, // Zoom di default (100%)
  zoomStep: 0.25,  // Incremento per i pulsanti +/-
  
  // Animazioni
  animationDuration: 300, // Durata animazioni in milliseconi
  easeFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Funzione di easing
  
  // Touch e gesture - OTTIMIZZATI PER COESISTENZA CON MARKER
  pinchSensitivity: 0.005, // Sensibilità del pinch-to-zoom
  doubleTapThreshold: 250, // Ridotto da 300ms per essere più preciso
  markerHitRadius: 25,     // Area intorno ai marker dove NON fare zoom
  minPinchDistance: 50,    // Distanza minima per attivare pinch (evita tocchi accidentali)
  
  // Performance
  throttleDelay: 16, // Throttling per eventi ad alta frequenza (60fps)
  
  // Accessibilità
  enableKeyboardZoom: true, // Zoom con tastiera (+ e -)
  announceZoomChanges: true // Annuncia cambiamenti zoom per screen reader
};

/**
 * Stato globale del sistema di zoom
 * Mantiene traccia dello stato corrente e delle gesture in corso
 */
let zoomState = {
  currentZoom: ZOOM_CONFIG.defaultZoom,
  isZooming: false,
  lastTouchDistance: 0,
  lastTapTime: 0,
  lastTapPosition: { x: 0, y: 0 }, // Posizione dell'ultimo tap
  centerPoint: { x: 50, y: 50 }, // Centro dello zoom in percentuale
  initialMapSize: { width: 0, height: 0 },
  touchStartTarget: null, // Elemento che ha ricevuto il touchstart
  isPinching: false // Flag per distinguere pinch da tap
};

// =====================================================================
// SEZIONE 2: UTILITÀ E FUNZIONI HELPER
// =====================================================================

/**
 * Calcola la distanza tra due punti touch
 * Utilizzata per rilevare le gesture di pinch
 * 
 * @param {Touch} touch1 - Primo punto di contatto
 * @param {Touch} touch2 - Secondo punto di contatto
 * @returns {number} Distanza tra i due punti
 */
function getTouchDistance(touch1, touch2) {
  const deltaX = touch1.clientX - touch2.clientX;
  const deltaY = touch1.clientY - touch2.clientY;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Calcola il punto centrale tra due touch
 * Utilizzato per determinare il centro del pinch-to-zoom
 * 
 * @param {Touch} touch1 - Primo punto di contatto
 * @param {Touch} touch2 - Secondo punto di contatto
 * @param {DOMRect} containerRect - Rettangolo del container
 * @returns {Object} Coordinate del centro in percentuale
 */
function getTouchCenter(touch1, touch2, containerRect) {
  const centerX = (touch1.clientX + touch2.clientX) / 2;
  const centerY = (touch1.clientY + touch2.clientY) / 2;
  
  return {
    x: ((centerX - containerRect.left) / containerRect.width) * 100,
    y: ((centerY - containerRect.top) / containerRect.height) * 100
  };
}

/**
 * Verifica se un tocco è avvenuto vicino a un marker
 * Questa funzione è CRITICA per la coesistenza con i marker
 * 
 * @param {number} x - Coordinata X del tocco
 * @param {number} y - Coordinata Y del tocco
 * @returns {boolean} True se il tocco è vicino a un marker
 */
function isTouchNearMarker(x, y) {
  const markers = document.querySelectorAll('.marker');
  const hitRadius = ZOOM_CONFIG.markerHitRadius;
  
  for (let marker of markers) {
    const rect = marker.getBoundingClientRect();
    const markerCenterX = rect.left + rect.width / 2;
    const markerCenterY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(x - markerCenterX, 2) + Math.pow(y - markerCenterY, 2)
    );
    
    if (distance <= hitRadius) {
      return true;
    }
  }
  
  return false;
}

/**
 * Verifica se l'elemento target è un marker o è contenuto in un marker
 * 
 * @param {Element} element - Elemento da verificare
 * @returns {boolean} True se l'elemento è relativo a un marker
 */
function isMarkerRelatedElement(element) {
  if (!element) return false;
  
  // Verifica se l'elemento stesso è un marker
  if (element.classList && element.classList.contains('marker')) {
    return true;
  }
  
  // Verifica se l'elemento è contenuto in un marker
  return element.closest && element.closest('.marker') !== null;
}

/**
 * Limita un valore tra un minimo e un massimo
 * 
 * @param {number} value - Valore da limitare
 * @param {number} min - Valore minimo
 * @param {number} max - Valore massimo
 * @returns {number} Valore limitato
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Throttling per funzioni chiamate ad alta frequenza
 * Migliora le performance limitando la frequenza di esecuzione
 * 
 * @param {Function} func - Funzione da eseguire
 * @param {number} delay - Ritardo in millisecondi
 * @returns {Function} Funzione throttled
 */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// =====================================================================
// SEZIONE 3: CORE FUNZIONI DI ZOOM
// =====================================================================

/**
 * Applica il livello di zoom alla mappa e aggiorna tutti i componenti correlati
 * Questa è la funzione centrale che coordina tutti gli aspetti del zoom
 * 
 * @param {number} newZoom - Nuovo livello di zoom
 * @param {Object} centerPoint - Punto centrale dello zoom (opzionale)
 * @param {boolean} animate - Se applicare l'animazione
 */
function applyZoom(newZoom, centerPoint = null, animate = true) {
  // Validazione e normalizzazione dell'input
  const clampedZoom = clamp(newZoom, ZOOM_CONFIG.minZoom, ZOOM_CONFIG.maxZoom);
  
  // Se il zoom non è cambiato, non fare nulla
  if (Math.abs(clampedZoom - zoomState.currentZoom) < 0.001) {
    return;
  }
  
  // Aggiorna il centro dello zoom se fornito
  if (centerPoint) {
    zoomState.centerPoint = centerPoint;
  }
  
  // Trova gli elementi necessari
  const mapContainer = document.getElementById('map-wrapper');
  const mapImage = document.getElementById('map');
  
  if (!mapContainer || !mapImage) {
    console.warn('⚠️ Elementi mappa non trovati per applicare zoom');
    return;
  }
  
  // Aggiorna lo stato del zoom
  const previousZoom = zoomState.currentZoom;
  zoomState.currentZoom = clampedZoom;
  zoomState.isZooming = true;
  
  // Calcola le trasformazioni CSS
  const scale = clampedZoom;
  const translateX = (50 - zoomState.centerPoint.x) * (scale - 1);
  const translateY = (50 - zoomState.centerPoint.y) * (scale - 1);
  
  // Applica le trasformazioni al contenitore
  if (animate) {
    mapContainer.style.transition = `transform ${ZOOM_CONFIG.animationDuration}ms ${ZOOM_CONFIG.easeFunction}`;
  } else {
    mapContainer.style.transition = 'none';
  }

  // Applica la trasformazione al contenitore che include sia mappa che marker
  mapContainer.style.transform = `scale(${scale}) translate(${translateX}%, ${translateY}%)`;
  mapContainer.style.transformOrigin = `${zoomState.centerPoint.x}% ${zoomState.centerPoint.y}%`;

  // Reset della trasformazione dell'immagine se era stata applicata precedentemente
  mapImage.style.transform = 'none';
  mapImage.style.transformOrigin = 'initial';

  // Aggiorna i marker per mantenere la precisione visiva
  updateMarkersForZoom(clampedZoom, previousZoom);
  
  // Aggiorna i controlli UI
  updateZoomControls();
  
  // Annuncia il cambiamento per l'accessibilità
  if (ZOOM_CONFIG.announceZoomChanges) {
    announceZoomChange(clampedZoom);
  }
  
  // Emetti evento personalizzato per altri sistemi
  emitZoomEvent('zoomChanged', {
    zoom: clampedZoom,
    previousZoom: previousZoom,
    centerPoint: zoomState.centerPoint
  });
  
  // Reset del flag isZooming dopo l'animazione
  if (animate) {
    setTimeout(() => {
      zoomState.isZooming = false;
    }, ZOOM_CONFIG.animationDuration);
  } else {
    zoomState.isZooming = false;
  }
  
  console.log(`🔍 Zoom applicato: ${Math.round(clampedZoom * 100)}%`);
}

/**
 * Aggiorna la posizione e dimensione dei marker in base al nuovo zoom
 * Mantiene la precisione del posizionamento durante il zoom
 * 
 * @param {number} newZoom - Nuovo livello di zoom
 * @param {number} previousZoom - Livello di zoom precedente
 */
function updateMarkersForZoom(newZoom, previousZoom) {
  const markers = document.querySelectorAll('.marker');
  
  markers.forEach(marker => {
    // Mantieni i border dei marker costanti per migliore leggibilità
    const baseBorderWidth = 2;
    const adjustedBorderWidth = baseBorderWidth / newZoom;
    marker.style.borderWidth = `${adjustedBorderWidth}px`;
    
    // Mantieni le icone facility leggibili
    const facilityIcon = marker.querySelector('.facility-icon');
    if (facilityIcon) {
      const baseFontSize = 8;
      const adjustedFontSize = Math.max(baseFontSize / newZoom, 6);
      facilityIcon.style.fontSize = `${adjustedFontSize}px`;
    }
  });
  
  console.log(`📍 Marker aggiornati per zoom ${Math.round(newZoom * 100)}%: ${markers.length} marker`);
}

/**
 * Aggiorna lo stato visuale dei controlli di zoom
 * Abilita/disabilita i pulsanti in base ai limiti
 */
function updateZoomControls() {
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomLevelDisplay = document.getElementById('zoom-level-display');
  
  if (zoomInBtn) {
    zoomInBtn.disabled = zoomState.currentZoom >= ZOOM_CONFIG.maxZoom;
    zoomInBtn.style.opacity = zoomInBtn.disabled ? '0.5' : '1';
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.disabled = zoomState.currentZoom <= ZOOM_CONFIG.minZoom;
    zoomOutBtn.style.opacity = zoomOutBtn.disabled ? '0.5' : '1';
  }
  
  if (zoomResetBtn) {
    zoomResetBtn.disabled = Math.abs(zoomState.currentZoom - ZOOM_CONFIG.defaultZoom) < 0.01;
    zoomResetBtn.style.opacity = zoomResetBtn.disabled ? '0.5' : '1';
  }
  
  if (zoomLevelDisplay) {
    zoomLevelDisplay.textContent = `${Math.round(zoomState.currentZoom * 100)}%`;
  }
}

// =====================================================================
// SEZIONE 4: CONTROLLI UI E INTERFACCIA
// =====================================================================

/**
 * Crea i controlli di zoom nell'interfaccia utente
 * Genera pulsanti e indicatori per il controllo del zoom
 */
function createZoomControls() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) {
    console.warn('⚠️ Container mappa non trovato per creare controlli zoom');
    return;
  }
  
  // Controlla se i controlli esistono già
  if (document.getElementById('zoom-controls')) {
    console.log('🔍 Controlli zoom già esistenti, aggiorno stato');
    updateZoomControls();
    return;
  }
  
  const controlsHTML = `
    <div id="zoom-controls" class="zoom-controls">
      <button id="zoom-in-btn" class="zoom-btn zoom-in" title="Zoom In (+)" aria-label="Zoom In">
        <span>+</span>
      </button>
      <div id="zoom-level-display" class="zoom-level">
        100%
      </div>
      <button id="zoom-out-btn" class="zoom-btn zoom-out" title="Zoom Out (-)" aria-label="Zoom Out">
        <span>−</span>
      </button>
      <button id="zoom-reset-btn" class="zoom-btn zoom-reset" title="Reset Zoom (1:1)" aria-label="Reset Zoom">
        <span>⌂</span>
      </button>
    </div>
  `;
  
  // Trova la posizione migliore per inserire i controlli
  const mapHeader = mapContainer.querySelector('.map-header');
  if (mapHeader) {
    mapHeader.insertAdjacentHTML('beforeend', controlsHTML);
  } else {
    mapContainer.insertAdjacentHTML('afterbegin', controlsHTML);
  }
  
  // Aggiungi gli stili CSS per i controlli
  addZoomControlsStyles();
  
  // Configura gli event listener
  setupZoomControlsEvents();
  
  console.log('🎮 Controlli zoom creati e configurati');
}

/**
 * Aggiunge gli stili CSS per i controlli di zoom
 * Crea un design moderno e accessibile
 */
function addZoomControlsStyles() {
  const styleId = 'zoom-controls-styles';
  
  // Evita di aggiungere stili duplicati
  if (document.getElementById(styleId)) {
    return;
  }
  
  const styles = `
    <style id="${styleId}">
      .zoom-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 8px 12px;
        margin-left: auto;
        z-index: 1000;
      }
      
      .zoom-btn {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.2s ease;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      .zoom-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }
      
      .zoom-btn:active:not(:disabled) {
        transform: scale(0.95);
      }
      
      .zoom-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .zoom-level {
        min-width: 45px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        user-select: none;
      }
      
      .zoom-reset {
        font-size: 14px;
      }
      
      /* Stili responsivi per dispositivi touch */
      @media (pointer: coarse) {
        .zoom-btn {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }
        
        .zoom-controls {
          gap: 10px;
          padding: 10px 14px;
        }
      }
      
      /* Animazioni per feedback visivo */
      @keyframes zoomPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      .zoom-btn.pulse {
        animation: zoomPulse 0.3s ease;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', styles);
}

/**
 * Configura gli event listener per i controlli di zoom
 * Gestisce click, touch e keyboard input
 */
function setupZoomControlsEvents() {
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      zoomIn();
      zoomInBtn.classList.add('pulse');
      setTimeout(() => zoomInBtn.classList.remove('pulse'), 300);
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      zoomOut();
      zoomOutBtn.classList.add('pulse');
      setTimeout(() => zoomOutBtn.classList.remove('pulse'), 300);
    });
  }
  
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetZoom();
      zoomResetBtn.classList.add('pulse');
      setTimeout(() => zoomResetBtn.classList.remove('pulse'), 300);
    });
  }
}

// =====================================================================
// SEZIONE 5: FUNZIONI PUBBLICHE DI CONTROLLO
// =====================================================================

/**
 * Aumenta il livello di zoom
 */
function zoomIn() {
  const newZoom = zoomState.currentZoom + ZOOM_CONFIG.zoomStep;
  applyZoom(newZoom);
}

/**
 * Diminuisce il livello di zoom
 */
function zoomOut() {
  const newZoom = zoomState.currentZoom - ZOOM_CONFIG.zoomStep;
  applyZoom(newZoom);
}

/**
 * Ripristina il zoom al livello di default
 */
function resetZoom() {
  zoomState.centerPoint = { x: 50, y: 50 }; // Reset anche del centro
  applyZoom(ZOOM_CONFIG.defaultZoom);
}

/**
 * Imposta un livello di zoom specifico
 * 
 * @param {number} zoom - Livello di zoom desiderato
 * @param {Object} center - Punto centrale dello zoom (opzionale)
 */
function setZoom(zoom, center = null) {
  applyZoom(zoom, center);
}

/**
 * Ottiene il livello di zoom corrente
 * 
 * @returns {number} Livello di zoom corrente
 */
function getCurrentZoom() {
  return zoomState.currentZoom;
}

// =====================================================================
// SEZIONE 6: GESTURE TOUCH COOPERATIVE (VERSIONE CORRETTA)
// =====================================================================

/**
 * Configura la gestione delle gesture touch con COOPERAZIONE intelligente
 * Questa versione evita conflitti con i marker implementando logica cooperativa
 */
function setupTouchGestures() {
  const mapWrapper = document.getElementById('map-wrapper');
  if (!mapWrapper) {
    console.warn('⚠️ Map wrapper non trovato per gesture touch');
    return;
  }
  
  // Gestione touch start - LOGICA COOPERATIVA
  const handleTouchStart = (e) => {
    // Salva il target iniziale per decisioni successive
    zoomState.touchStartTarget = e.target;
    
    if (e.touches.length === 2) {
      // PINCH TO ZOOM: Due diti - questa è chiaramente un'intenzione di zoom
      e.preventDefault(); // Sicuro prevenire qui perché è chiaramente zoom
      zoomState.isPinching = true;
      
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      
      // Verifica che la distanza iniziale sia sufficiente per evitare attivazioni accidentali
      if (distance >= ZOOM_CONFIG.minPinchDistance) {
        zoomState.lastTouchDistance = distance;
        
        const rect = mapWrapper.getBoundingClientRect();
        zoomState.centerPoint = getTouchCenter(e.touches[0], e.touches[1], rect);
      }
    } else if (e.touches.length === 1) {
      // SINGLE TOUCH: Potrebbe essere marker click o doppio tap zoom
      zoomState.isPinching = false;
      
      const touch = e.touches[0];
      const now = Date.now();
      
      // Salva posizione del tocco per confronti successivi
      zoomState.lastTapPosition = { x: touch.clientX, y: touch.clientY };
      
      // LOGICA COOPERATIVA CRITICA:
      // Se il tocco è su un marker, NON interferiamo con la sua gestione
      const touchingMarker = isMarkerRelatedElement(zoomState.touchStartTarget) || 
                            isTouchNearMarker(touch.clientX, touch.clientY);
      
      if (touchingMarker) {
        console.log('👆 Touch su marker rilevato, permettendo gestione click normale');
        // NON chiamiamo preventDefault() - lasciamo che il marker gestisca l'evento
        // Non registriamo nemmeno il timestamp per evitare false detection di doppio tap
        return;
      }
      
      // Se non è su un marker, procediamo con la logica del doppio tap
      const timeSinceLastTap = now - zoomState.lastTapTime;
      
      if (timeSinceLastTap < ZOOM_CONFIG.doubleTapThreshold) {
        // DOPPIO TAP RILEVATO su area libera (non marker)
        e.preventDefault(); // Ora è sicuro prevenire perché sappiamo che non è un marker
        
        const rect = mapWrapper.getBoundingClientRect();
        const centerPoint = {
          x: ((touch.clientX - rect.left) / rect.width) * 100,
          y: ((touch.clientY - rect.top) / rect.height) * 100
        };
        
        // Doppio tap: zoom in se non al massimo, altrimenti reset
        const targetZoom = zoomState.currentZoom < ZOOM_CONFIG.maxZoom 
          ? Math.min(zoomState.currentZoom * 2, ZOOM_CONFIG.maxZoom)
          : ZOOM_CONFIG.defaultZoom;
          
        applyZoom(targetZoom, centerPoint);
        
        console.log('🔍 Doppio tap zoom applicato');
      }
      
      // Aggiorna timestamp solo se non era su un marker
      zoomState.lastTapTime = now;
    }
  };
  
  // Gestione touch move - COOPERATIVA
  const handleTouchMove = throttle((e) => {
    // Solo processa se stiamo effettivamente facendo pinch-to-zoom
    if (e.touches.length === 2 && zoomState.isPinching && zoomState.lastTouchDistance > 0) {
      e.preventDefault(); // Sicuro prevenire durante pinch attivo
      
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      
      // Verifica che ci sia stato un movimento significativo
      if (Math.abs(currentDistance - zoomState.lastTouchDistance) > 5) {
        const deltaDistance = currentDistance - zoomState.lastTouchDistance;
        const zoomDelta = deltaDistance * ZOOM_CONFIG.pinchSensitivity;
        
        const newZoom = zoomState.currentZoom + zoomDelta;
        applyZoom(newZoom, null, false); // Senza animazione per fluidità
        
        zoomState.lastTouchDistance = currentDistance;
      }
    }
  }, ZOOM_CONFIG.throttleDelay);
  
  // Gestione touch end - COOPERATIVA
  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      // Fine del pinch o del touch singolo
      zoomState.lastTouchDistance = 0;
      zoomState.isPinching = false;
      zoomState.touchStartTarget = null;
    }
  };
  
  // Aggiungi event listener con gestione cooperativa
  mapWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
  mapWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
  mapWrapper.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  console.log('👆 Gesture touch COOPERATIVE configurate per coesistenza con marker');
}

// =====================================================================
// SEZIONE 7: SUPPORTO KEYBOARD E ACCESSIBILITÀ
// =====================================================================

/**
 * Configura il supporto per controlli da tastiera
 * Migliora l'accessibilità per utenti con diverse abilità
 */
function setupKeyboardControls() {
  if (!ZOOM_CONFIG.enableKeyboardZoom) {
    return;
  }
  
  const handleKeyDown = (e) => {
    // Solo quando il focus è sulla mappa o sui controlli
    const mapArea = document.querySelector('.map-container');
    if (!mapArea || !mapArea.contains(e.target)) {
      return;
    }
    
    switch (e.key) {
      case '+':
      case '=':
        e.preventDefault();
        zoomIn();
        break;
      case '-':
      case '_':
        e.preventDefault();
        zoomOut();
        break;
      case '0':
        e.preventDefault();
        resetZoom();
        break;
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  
  // Rendi la mappa focusable per keyboard
  const mapWrapper = document.getElementById('map-wrapper');
  if (mapWrapper) {
    mapWrapper.setAttribute('tabindex', '0');
    mapWrapper.setAttribute('role', 'application');
    mapWrapper.setAttribute('aria-label', 'Interactive map with zoom controls');
  }
  
  console.log('⌨️ Controlli keyboard configurati per zoom');
}

/**
 * Annuncia i cambiamenti di zoom per screen reader
 * 
 * @param {number} zoom - Nuovo livello di zoom
 */
function announceZoomChange(zoom) {
  const announcement = `Zoom changed to ${Math.round(zoom * 100)} percent`;
  
  // Crea un elemento nascosto per annunci screen reader
  let announcer = document.getElementById('zoom-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'zoom-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);
  }
  
  announcer.textContent = announcement;
}

// =====================================================================
// SEZIONE 8: EVENTI E INTEGRAZIONE
// =====================================================================

/**
 * Emette eventi personalizzati per integrazione con altri sistemi
 * 
 * @param {string} eventName - Nome dell'evento
 * @param {Object} detail - Dettagli dell'evento
 */
function emitZoomEvent(eventName, detail) {
  const event = new CustomEvent(eventName, { detail });
  document.dispatchEvent(event);
}

/**
 * Gestisce eventi da altri sistemi
 * Permette l'integrazione con sistemi di calibrazione e marker
 */
function setupSystemIntegration() {
  // Ascolta eventi di caricamento mappa
  document.addEventListener('mapLoaded', () => {
    console.log('🗺️ Mappa caricata - inizializzando zoom...');
    setTimeout(() => {
      initializeZoomSystem();
    }, 500);
  });
  
  // Ascolta eventi di fallback mappa
  document.addEventListener('mapFallback', () => {
    console.log('🗺️ Mappa fallback - inizializzando zoom...');
    setTimeout(() => {
      initializeZoomSystem();
    }, 500);
  });
  
  // Integrazione con sistema calibrazione
  document.addEventListener('calibrationChanged', (e) => {
    console.log('🔧 Calibrazione cambiata - aggiornando zoom...');
    updateMarkersForZoom(zoomState.currentZoom, zoomState.currentZoom);
  });
}

// =====================================================================
// SEZIONE 9: INIZIALIZZAZIONE E SETUP
// =====================================================================

/**
 * Inizializza completamente il sistema di zoom
 * Configura tutti i componenti e le integrazioni
 */
function initializeZoomSystem() {
  console.log('🔍 Inizializzazione sistema zoom cooperativo...');
  
  // Verifica prerequisiti
  const mapImage = document.getElementById('map');
  const mapWrapper = document.getElementById('map-wrapper');
  
  if (!mapImage || !mapWrapper) {
    console.warn('⚠️ Elementi mappa non trovati per inizializzazione zoom');
    return false;
  }
  
  // Memorizza dimensioni originali della mappa
  zoomState.initialMapSize = {
    width: mapImage.naturalWidth || mapImage.offsetWidth,
    height: mapImage.naturalHeight || mapImage.offsetHeight
  };
  
  // Crea controlli UI
  createZoomControls();
  
  // Configura gesture cooperative e input
  setupTouchGestures();
  setupKeyboardControls();
  
  // Applica zoom iniziale
  applyZoom(ZOOM_CONFIG.defaultZoom, null, false);
  
  console.log('✅ Sistema zoom cooperativo inizializzato con successo');
  
  // Notifica successo
  if (typeof showStatus === 'function') {
    showStatus('🔍 Sistema zoom cooperativo attivato', 'success', 3000);
  }
  
  return true;
}

/**
 * Ottiene informazioni di stato del sistema zoom
 * Utile per debug e diagnostica
 */
function getZoomSystemStatus() {
  return {
    currentZoom: zoomState.currentZoom,
    isZooming: zoomState.isZooming,
    isPinching: zoomState.isPinching,
    centerPoint: { ...zoomState.centerPoint },
    config: { ...ZOOM_CONFIG },
    mapSize: { ...zoomState.initialMapSize },
    controlsPresent: !!document.getElementById('zoom-controls'),
    cooperativeMode: true // Indica che questo è il sistema cooperativo
  };
}

// =====================================================================
// SEZIONE 10: ESPORTAZIONI GLOBALI E AUTO-INIZIALIZZAZIONE
// =====================================================================

// Esporta funzioni pubbliche per uso esterno
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;
window.setZoom = setZoom;
window.getCurrentZoom = getCurrentZoom;
window.initializeZoomSystem = initializeZoomSystem;
window.getZoomSystemStatus = getZoomSystemStatus;

// Integrazione con sistema debug globale
if (typeof window.debugWS !== 'undefined') {
  window.debugWS.zoom = {
    status: getZoomSystemStatus,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    reset: resetZoom,
    setZoom: setZoom,
    getCurrentZoom: getCurrentZoom,
    config: ZOOM_CONFIG,
    isCooperative: true
  };
}

// Setup integrazione eventi
setupSystemIntegration();

// Auto-inizializzazione quando DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 DOM pronto per sistema zoom cooperativo');
  
  setTimeout(() => {
    const mapImage = document.getElementById('map');
    if (mapImage && (mapImage.complete || mapImage.naturalWidth > 0)) {
      console.log('🗺️ Mappa già disponibile - inizializzazione immediata zoom cooperativo');
      initializeZoomSystem();
    } else {
      console.log('⏳ In attesa degli eventi di caricamento mappa...');
    }
  }, 200);
});

console.log('✅ MapZoom.js COOPERATIVO caricato - Sistema zoom pronto per coesistenza con marker');

// =====================================================================
// FINE MAPZOOM.JS COOPERATIVO
// =====================================================================