// =====================================================================
// DROPDOWN POSITION FIX FINAL - SOLUZIONE ROBUSTA DEFINITIVA
// =====================================================================
// Questo fix risolve TUTTI i problemi identificati:
// - Bug getBoundingClientRect 
// - Conflitti tra observer
// - Position fixed non applicato
// - Dropdown che spinge la mappa

console.log('🔧 Caricamento Dropdown Position Fix FINAL - Soluzione Robusta...');

/**
 * VERSIONE ROBUSTA: Validazione parametri e calcolo sicuro
 */
function calculateRobustDropdownPosition(markerElement) {
  // ===================================================================
  // STEP 1: VALIDAZIONE ROBUSTA PARAMETRI
  // ===================================================================
  
  let validMarker = null;
  
  // Prova a ottenere marker valido in vari modi
  if (markerElement && typeof markerElement.getBoundingClientRect === 'function') {
    validMarker = markerElement;
  } else if (markerElement && markerElement.marker && typeof markerElement.marker.getBoundingClientRect === 'function') {
    validMarker = markerElement.marker;
  } else if (markerElement && markerElement.closest) {
    validMarker = markerElement.closest('.marker');
  } else {
    console.warn('⚠️ Marker non valido, cercando dropdown esistente...');
    // Trova dropdown per ottenere marker parent
    const existingDropdown = document.querySelector('.marker-dropdown');
    if (existingDropdown) {
      validMarker = existingDropdown.closest('.marker');
    }
  }
  
  if (!validMarker || typeof validMarker.getBoundingClientRect !== 'function') {
    console.error('❌ Impossibile trovare marker valido, usando posizionamento fallback');
    return calculateFallbackPositioning();
  }
  
  console.log('✅ Marker valido trovato:', validMarker.title || validMarker.className);
  
  // ===================================================================
  // STEP 2: CALCOLI VIEWPORT E DISPOSITIVO
  // ===================================================================
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const markerRect = validMarker.getBoundingClientRect();
  const isMobile = viewport.width <= 768;
  const isSmallMobile = viewport.width <= 480;
  
  console.log('📏 Info dispositivo:', {
    viewport: viewport,
    marker: {
      top: markerRect.top,
      bottom: markerRect.bottom,
      left: markerRect.left,
      right: markerRect.right
    },
    deviceType: isSmallMobile ? 'small-mobile' : (isMobile ? 'mobile' : 'desktop')
  });
  
  // ===================================================================
  // STEP 3: DIMENSIONI DROPDOWN ROBUSTE
  // ===================================================================
  
  // Dimensioni sicure che funzionano sempre
  let dropdownWidth, dropdownHeight;
  
  if (isSmallMobile) {
    dropdownWidth = Math.min(180, viewport.width - 40);
    dropdownHeight = Math.min(280, viewport.height - 120);
  } else if (isMobile) {
    dropdownWidth = Math.min(220, viewport.width - 60);
    dropdownHeight = Math.min(320, viewport.height - 140);
  } else {
    dropdownWidth = Math.min(260, viewport.width - 80);
    dropdownHeight = Math.min(360, viewport.height - 100);
  }
  
  console.log('📐 Dimensioni dropdown calcolate:', {
    width: dropdownWidth,
    height: dropdownHeight
  });
  
  // ===================================================================
  // STEP 4: POSIZIONAMENTO CON GARANZIA VIEWPORT
  // ===================================================================
  
  // Margini di sicurezza per evitare bordi
  const margins = {
    top: isMobile ? 60 : 40,
    bottom: isMobile ? 80 : 40,
    left: 20,
    right: 20
  };
  
  // Area sicura dentro viewport
  const safeArea = {
    top: margins.top,
    bottom: viewport.height - margins.bottom,
    left: margins.left,
    right: viewport.width - margins.right
  };
  
  // Calcolo posizione preferita (sotto il marker)
  let finalTop, finalLeft, showAbove = false;
  
  const preferredTop = markerRect.bottom + 10;
  const preferredBottom = preferredTop + dropdownHeight;
  
  if (preferredBottom <= safeArea.bottom) {
    // Entra sotto
    finalTop = preferredTop;
  } else {
    // Prova sopra
    const aboveTop = markerRect.top - dropdownHeight - 10;
    if (aboveTop >= safeArea.top) {
      finalTop = aboveTop;
      showAbove = true;
    } else {
      // Emergency: centra nella safe area
      finalTop = safeArea.top + Math.max(0, (safeArea.bottom - safeArea.top - dropdownHeight) / 2);
      showAbove = finalTop < markerRect.top;
    }
  }
  
  // Posizionamento orizzontale centrato sul marker
  const markerCenter = markerRect.left + (markerRect.width / 2);
  const preferredLeft = markerCenter - (dropdownWidth / 2);
  finalLeft = Math.max(safeArea.left, Math.min(preferredLeft, safeArea.right - dropdownWidth));
  
  // Final safety clamps - GARANTISCE che sia dentro viewport
  finalTop = Math.max(margins.top, Math.min(finalTop, viewport.height - dropdownHeight - margins.bottom));
  finalLeft = Math.max(margins.left, Math.min(finalLeft, viewport.width - dropdownWidth - margins.right));
  
  const result = {
    // Posizioni finali GARANTITE
    top: finalTop,
    left: finalLeft,
    width: dropdownWidth,
    height: dropdownHeight,
    maxHeight: dropdownHeight,
    
    // Stato
    showAbove: showAbove,
    isMobile: isMobile,
    isSmallMobile: isSmallMobile,
    
    // CSS classes
    cssClasses: {
      vertical: showAbove ? 'dropdown-above' : 'dropdown-below',
      horizontal: 'dropdown-align-center',
      device: isSmallMobile ? 'dropdown-small-mobile' : (isMobile ? 'dropdown-mobile' : 'dropdown-desktop'),
      orientation: viewport.width > viewport.height ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    
    // Debug
    debug: {
      markerValid: true,
      markerRect: markerRect,
      safeArea: safeArea,
      positioning: showAbove ? 'ABOVE' : 'BELOW'
    }
  };
  
  console.log('🎯 Posizionamento robusto calcolato:', {
    position: `${finalTop}px, ${finalLeft}px`,
    size: `${dropdownWidth}px × ${dropdownHeight}px`,
    showAbove: showAbove
  });
  
  return result;
}

/**
 * Posizionamento fallback quando marker non valido
 */
function calculateFallbackPositioning() {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const isMobile = viewport.width <= 768;
  const isSmallMobile = viewport.width <= 480;
  
  // Centra nel viewport
  const width = isSmallMobile ? 180 : (isMobile ? 220 : 260);
  const height = isSmallMobile ? 280 : (isMobile ? 320 : 360);
  
  const top = Math.max(60, (viewport.height - height) / 2);
  const left = Math.max(20, (viewport.width - width) / 2);
  
  console.log('🔄 Usando posizionamento fallback centrato');
  
  return {
    top: top,
    left: left,
    width: width,
    height: height,
    maxHeight: height,
    showAbove: false,
    isMobile: isMobile,
    isSmallMobile: isSmallMobile,
    cssClasses: {
      vertical: 'dropdown-below',
      horizontal: 'dropdown-align-center',
      device: isSmallMobile ? 'dropdown-small-mobile' : (isMobile ? 'dropdown-mobile' : 'dropdown-desktop'),
      orientation: viewport.width > viewport.height ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    debug: {
      markerValid: false,
      fallback: true
    }
  };
}

/**
 * APPLICAZIONE ROBUSTA: Applica posizionamento con controllo totale
 */
function applyRobustDropdownPositioning(dropdown, positioning) {
  if (!dropdown) {
    console.error('❌ applyRobustDropdownPositioning: dropdown non valido');
    return;
  }
  
  if (!positioning) {
    console.warn('⚠️ positioning non valido, ricalcolando...');
    positioning = calculateFallbackPositioning();
  }
  
  console.log('🔧 Applicando posizionamento robusto...');
  
  // ===================================================================
  // STEP 1: RIMUOVI TUTTI GLI STILI CONFLITTUALI
  // ===================================================================
  
  // Reset completo stili posizionamento
  dropdown.style.position = '';
  dropdown.style.top = '';
  dropdown.style.left = '';
  dropdown.style.right = '';
  dropdown.style.bottom = '';
  dropdown.style.transform = '';
  dropdown.style.width = '';
  dropdown.style.height = '';
  dropdown.style.maxWidth = '';
  dropdown.style.maxHeight = '';
  dropdown.style.margin = '';
  dropdown.style.float = '';
  dropdown.style.display = '';
  
  // ===================================================================
  // STEP 2: APPLICA CSS CLASSES
  // ===================================================================
  
  // Rimuovi tutte le classi di posizionamento
  dropdown.classList.remove(
    'dropdown-above', 'dropdown-below',
    'dropdown-align-left', 'dropdown-align-center', 'dropdown-align-right',
    'dropdown-mobile', 'dropdown-small-mobile', 'dropdown-desktop',
    'dropdown-landscape', 'dropdown-portrait'
  );
  
  // Aggiungi nuove classi
  Object.values(positioning.cssClasses).forEach(cssClass => {
    dropdown.classList.add(cssClass);
  });
  
  // ===================================================================
  // STEP 3: APPLICA POSIZIONAMENTO FIXED ROBUSTO
  // ===================================================================
  
  // FORZA position fixed con !important via CSS inline
  dropdown.style.cssText = `
    position: fixed !important;
    top: ${positioning.top}px !important;
    left: ${positioning.left}px !important;
    width: ${positioning.width}px !important;
    max-height: ${positioning.maxHeight}px !important;
    z-index: 9999 !important;
    margin: 0 !important;
    transform: none !important;
    right: auto !important;
    bottom: auto !important;
    float: none !important;
    display: block !important;
  `;
  
  // ===================================================================
  // STEP 4: CONFIGURA CONTAINER OPZIONI
  // ===================================================================
  
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  if (optionsContainer) {
    const headerHeight = 60;
    const maxOptionsHeight = positioning.height - headerHeight;
    
    optionsContainer.style.cssText = `
      max-height: ${Math.max(100, maxOptionsHeight)}px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    `;
    
    if (positioning.isMobile) {
      optionsContainer.style.webkitOverflowScrolling = 'touch';
      optionsContainer.style.touchAction = 'pan-y';
    }
  }
  
  console.log('✅ Posizionamento robusto applicato:', {
    position: dropdown.style.position,
    top: dropdown.style.top,
    left: dropdown.style.left,
    width: dropdown.style.width,
    zIndex: dropdown.style.zIndex
  });
  
  // ===================================================================
  // STEP 5: VERIFICA FINALE E AUTO-CORREZIONE
  // ===================================================================
  
  setTimeout(() => {
    const rect = dropdown.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    const isVisible = rect.top >= 0 && 
                     rect.bottom <= viewport.height && 
                     rect.left >= 0 && 
                     rect.right <= viewport.width;
    
    console.log('🔍 Verifica finale dropdown:', {
      visible: isVisible,
      bounds: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      },
      viewport: viewport
    });
    
    if (!isVisible) {
      console.warn('⚠️ Dropdown ancora non visibile, applicando emergency fix...');
      applyEmergencyFix(dropdown);
    } else {
      console.log('🎉 SUCCESS! Dropdown completamente visibile');
    }
  }, 100);
}

/**
 * Emergency fix per casi estremi
 */
function applyEmergencyFix(dropdown) {
  console.log('🚨 EMERGENCY FIX attivato');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // Posizionamento di emergenza al centro del viewport
  const emergencyWidth = Math.min(200, viewport.width - 40);
  const emergencyHeight = Math.min(300, viewport.height - 80);
  const emergencyTop = Math.max(20, (viewport.height - emergencyHeight) / 2);
  const emergencyLeft = Math.max(20, (viewport.width - emergencyWidth) / 2);
  
  dropdown.style.cssText = `
    position: fixed !important;
    top: ${emergencyTop}px !important;
    left: ${emergencyLeft}px !important;
    width: ${emergencyWidth}px !important;
    height: ${emergencyHeight}px !important;
    max-height: ${emergencyHeight}px !important;
    z-index: 99999 !important;
    margin: 0 !important;
    transform: none !important;
    right: auto !important;
    bottom: auto !important;
    display: block !important;
    background: rgba(20, 25, 40, 0.98) !important;
    border: 2px solid #4facfe !important;
    border-radius: 12px !important;
    overflow: hidden !important;
  `;
  
  console.log('🚨 Emergency fix applicato - dropdown centrato nel viewport');
}

/**
 * SISTEMA UNIFICATO: Gestisce tutti i tipi di chiamate
 */
function handleDropdownPositioning(dropdownOrMarker, markerOrUndefined) {
  console.log('🔄 handleDropdownPositioning chiamato con:', {
    param1: dropdownOrMarker?.className || typeof dropdownOrMarker,
    param2: markerOrUndefined?.className || typeof markerOrUndefined
  });
  
  let dropdown = null;
  let marker = null;
  
  // Determina dropdown e marker dai parametri
  if (dropdownOrMarker && dropdownOrMarker.classList?.contains('marker-dropdown')) {
    // Caso 1: primo parametro è dropdown
    dropdown = dropdownOrMarker;
    marker = markerOrUndefined || dropdown.closest('.marker');
  } else if (dropdownOrMarker && dropdownOrMarker.classList?.contains('marker')) {
    // Caso 2: primo parametro è marker
    marker = dropdownOrMarker;
    dropdown = marker.querySelector('.marker-dropdown');
  } else {
    // Caso 3: trova dropdown automaticamente
    dropdown = document.querySelector('.marker-dropdown');
    marker = dropdown?.closest('.marker');
  }
  
  if (!dropdown) {
    console.warn('⚠️ Dropdown non trovato');
    return;
  }
  
  console.log('✅ Dropdown e marker identificati:', {
    dropdown: dropdown.className,
    marker: marker?.title || marker?.className || 'non trovato'
  });
  
  // Calcola e applica posizionamento
  const positioning = calculateRobustDropdownPosition(marker);
  applyRobustDropdownPositioning(dropdown, positioning);
}

// =====================================================================
// INTEGRAZIONE CON SISTEMA ESISTENTE
// =====================================================================

/**
 * Override delle funzioni globali esistenti
 */
function patchExistingSystem() {
  console.log('🔧 Patching sistema esistente con versione robusta...');
  
  // Override funzioni principali
  window.calculateOptimalDropdownPosition = calculateRobustDropdownPosition;
  window.applyDropdownPositioning = handleDropdownPositioning;
  
  // Funzioni specifiche
  window.calculateRobustDropdownPosition = calculateRobustDropdownPosition;
  window.applyRobustDropdownPositioning = applyRobustDropdownPositioning;
  window.handleDropdownPositioning = handleDropdownPositioning;
  
  console.log('✅ Sistema patchato con versione robusta');
}

/**
 * Observer che gestisce tutti i dropdown automaticamente
 */
function setupRobustObserver() {
  // Disabilita observer esistenti per evitare conflitti
  const existingObservers = window.dropdownObservers || [];
  existingObservers.forEach(observer => {
    try {
      observer.disconnect();
    } catch (e) {
      // Ignore
    }
  });
  
  // Nuovo observer unificato
  const robustObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.classList && 
            node.classList.contains('marker-dropdown')) {
          
          console.log('🔍 Nuovo dropdown rilevato, applicando fix robusto...');
          
          // Usa timeout per assicurarsi che il DOM sia stabile
          setTimeout(() => {
            handleDropdownPositioning(node);
          }, 50);
        }
      });
    });
  });
  
  robustObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Salva observer per riferimento
  window.dropdownObservers = [robustObserver];
  
  console.log('👀 Observer robusto attivato');
}

/**
 * Fix immediato per dropdown esistenti
 */
function fixExistingDropdowns() {
  const existingDropdowns = document.querySelectorAll('.marker-dropdown');
  
  if (existingDropdowns.length > 0) {
    console.log(`🔧 Fixing ${existingDropdowns.length} dropdown esistenti...`);
    
    existingDropdowns.forEach((dropdown, index) => {
      setTimeout(() => {
        handleDropdownPositioning(dropdown);
      }, index * 100); // Stagger per evitare conflitti
    });
  }
}

// =====================================================================
// FUNZIONI DI TEST E DEBUG
// =====================================================================

window.testRobustDropdown = function() {
  console.log('🧪 Test sistema robusto...');
  
  // Chiudi dropdown esistenti
  document.querySelectorAll('.marker-dropdown').forEach(d => d.remove());
  
  // Trova primo marker e simula click
  const marker = document.querySelector('.marker');
  if (marker) {
    console.log('📍 Testando marker:', marker.title);
    marker.click();
    
    setTimeout(() => {
      const dropdown = document.querySelector('.marker-dropdown');
      if (dropdown) {
        console.log('✅ Test completato - verifica che il dropdown sia visibile');
      } else {
        console.log('❌ Dropdown non creato');
      }
    }, 500);
  } else {
    console.log('❌ Nessun marker trovato');
  }
};

window.forceFixAllDropdowns = function() {
  console.log('🔧 Force fix tutti i dropdown...');
  fixExistingDropdowns();
};

window.debugDropdownSystem = function() {
  console.log('🔍 === DEBUG SISTEMA DROPDOWN ===');
  console.log('Viewport:', { width: window.innerWidth, height: window.innerHeight });
  console.log('Marker trovati:', document.querySelectorAll('.marker').length);
  console.log('Dropdown aperti:', document.querySelectorAll('.marker-dropdown').length);
  
  const dropdown = document.querySelector('.marker-dropdown');
  if (dropdown) {
    const rect = dropdown.getBoundingClientRect();
    console.log('Dropdown corrente:', {
      position: dropdown.style.position,
      top: dropdown.style.top,
      left: dropdown.style.left,
      bounds: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      },
      visible: rect.top >= 0 && rect.bottom <= window.innerHeight && 
               rect.left >= 0 && rect.right <= window.innerWidth
    });
  }
  console.log('================================');
};

// =====================================================================
// AUTO-INIZIALIZZAZIONE
// =====================================================================

// Patch sistema immediato
patchExistingSystem();

// Setup observer robusto
setupRobustObserver();

// Fix dropdown esistenti
setTimeout(() => {
  fixExistingDropdowns();
}, 500);

console.log('✅ Dropdown Position Fix FINAL caricato - Sistema robusto attivo');

// Auto-test in development
if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
  setTimeout(() => {
    window.debugDropdownSystem();
  }, 2000);
}