// =====================================================================
// DROPDOWN POSITION FIX V2 - SOLUZIONE DEFINITIVA ANTI-CLIPPING
// =====================================================================
// Questo fix risolve TUTTI i problemi di clipping sui dropdown mobile:
// - Bug viewport calculation
// - Viewport clamping automatico
// - Posizionamento robusto per tutti i casi
// - Margini di sicurezza garantiti

console.log('🔧 Caricamento Dropdown Position Fix V2 - Soluzione Anti-Clipping...');

/**
 * NUOVA VERSIONE: Calcola posizionamento con garanzia viewport visibility
 * Questa funzione GARANTISCE che il dropdown rimanga sempre visibile
 */
function calculateViewportSafeDropdownPosition(marker) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const markerRect = marker.getBoundingClientRect();
  
  console.log('📏 Viewport:', { width: viewportWidth, height: viewportHeight });
  console.log('📍 Marker rect:', { 
    top: markerRect.top, 
    bottom: markerRect.bottom,
    left: markerRect.left,
    right: markerRect.right,
    visible: isMarkerInViewport(markerRect, viewportWidth, viewportHeight)
  });

  // ===================================================================
  // 1. CALCOLO DIMENSIONI DROPDOWN STIMATE
  // ===================================================================
  
  const isMobile = viewportWidth <= 768;
  const isSmallMobile = viewportWidth <= 480;
  
  // Stima dimensioni dropdown basata su device e numero alleanze
  const estimatedDropdownDimensions = calculateEstimatedDropdownSize(isMobile, isSmallMobile);
  
  console.log('📐 Dimensioni stimate dropdown:', estimatedDropdownDimensions);

  // ===================================================================
  // 2. MARGINI DI SICUREZZA VIEWPORT
  // ===================================================================
  
  // Margini che garantiscono che il dropdown non tocchi mai i bordi
  const SAFETY_MARGINS = {
    top: isMobile ? 60 : 40,      // Considera status bar, notch
    bottom: isMobile ? 80 : 40,   // Considera home indicator, navigation
    left: isMobile ? 20 : 15,
    right: isMobile ? 20 : 15
  };
  
  // Area "safe" del viewport dove può apparire il dropdown
  const safeViewport = {
    top: SAFETY_MARGINS.top,
    bottom: viewportHeight - SAFETY_MARGINS.bottom,
    left: SAFETY_MARGINS.left,
    right: viewportWidth - SAFETY_MARGINS.right,
    width: viewportWidth - SAFETY_MARGINS.left - SAFETY_MARGINS.right,
    height: viewportHeight - SAFETY_MARGINS.top - SAFETY_MARGINS.bottom
  };
  
  console.log('🛡️ Safe viewport area:', safeViewport);

  // ===================================================================
  // 3. CALCOLO POSIZIONE VERTICALE CON CLAMPING GARANTITO
  // ===================================================================
  
  let dropdownTop, dropdownBottom, showAbove;
  const dropdownHeight = Math.min(estimatedDropdownDimensions.height, safeViewport.height);
  
  // Posizione ideale sotto il marker
  const idealTopPosition = markerRect.bottom + 5;
  const idealBottomPosition = idealTopPosition + dropdownHeight;
  
  // Posizione ideale sopra il marker  
  const idealAboveBottomPosition = markerRect.top - 5;
  const idealAboveTopPosition = idealAboveBottomPosition - dropdownHeight;
  
  // DECISION LOGIC con priority al rimanere nel safe viewport
  if (idealBottomPosition <= safeViewport.bottom) {
    // Dropdown sotto: entra perfettamente nel viewport
    showAbove = false;
    dropdownTop = idealTopPosition;
    dropdownBottom = idealBottomPosition;
  } else if (idealAboveTopPosition >= safeViewport.top) {
    // Dropdown sopra: entra perfettamente nel viewport
    showAbove = true;
    dropdownTop = idealAboveTopPosition;
    dropdownBottom = idealAboveBottomPosition;
  } else {
    // EMERGENCY CLAMPING: Nessuna posizione ideale funziona
    // Scegli il lato con più spazio e forza dentro il viewport
    
    const spaceBelow = safeViewport.bottom - markerRect.bottom;
    const spaceAbove = markerRect.top - safeViewport.top;
    
    if (spaceBelow >= spaceAbove) {
      // Più spazio sotto - clamp al bottom del safe viewport
      showAbove = false;
      dropdownBottom = safeViewport.bottom;
      dropdownTop = dropdownBottom - dropdownHeight;
      
      // Se ancora fuori sopra, clamp anche sopra
      if (dropdownTop < safeViewport.top) {
        dropdownTop = safeViewport.top;
        dropdownBottom = dropdownTop + dropdownHeight;
      }
    } else {
      // Più spazio sopra - clamp al top del safe viewport
      showAbove = true;
      dropdownTop = safeViewport.top;
      dropdownBottom = dropdownTop + dropdownHeight;
      
      // Se ancora fuori sotto, clamp anche sotto
      if (dropdownBottom > safeViewport.bottom) {
        dropdownBottom = safeViewport.bottom;
        dropdownTop = dropdownBottom - dropdownHeight;
      }
    }
  }
  
  // FINAL SAFETY CHECK: Garantisce che rimanga nel viewport
  dropdownTop = Math.max(safeViewport.top, Math.min(dropdownTop, safeViewport.bottom - dropdownHeight));
  dropdownBottom = dropdownTop + dropdownHeight;
  
  console.log('📍 Posizione verticale calcolata:', {
    showAbove,
    top: dropdownTop,
    bottom: dropdownBottom,
    height: dropdownHeight,
    withinSafeArea: dropdownTop >= safeViewport.top && dropdownBottom <= safeViewport.bottom
  });

  // ===================================================================
  // 4. CALCOLO POSIZIONE ORIZZONTALE CON CLAMPING
  // ===================================================================
  
  const dropdownWidth = Math.min(estimatedDropdownDimensions.width, safeViewport.width);
  
  // Posizione ideale centrata sul marker
  const markerCenterX = markerRect.left + (markerRect.width / 2);
  const idealLeft = markerCenterX - (dropdownWidth / 2);
  const idealRight = idealLeft + dropdownWidth;
  
  let dropdownLeft, horizontalAlignment;
  
  if (idealLeft >= safeViewport.left && idealRight <= safeViewport.right) {
    // Posizione centrata funziona perfettamente
    dropdownLeft = idealLeft;
    horizontalAlignment = 'center';
  } else if (idealLeft < safeViewport.left) {
    // Troppo a sinistra - clamp a sinistra
    dropdownLeft = safeViewport.left;
    horizontalAlignment = 'left';
  } else {
    // Troppo a destra - clamp a destra
    dropdownLeft = safeViewport.right - dropdownWidth;
    horizontalAlignment = 'right';
  }
  
  console.log('📍 Posizione orizzontale calcolata:', {
    left: dropdownLeft,
    width: dropdownWidth,
    alignment: horizontalAlignment,
    withinSafeArea: dropdownLeft >= safeViewport.left && (dropdownLeft + dropdownWidth) <= safeViewport.right
  });

  // ===================================================================
  // 5. RISULTATO FINALE CON GARANZIE VIEWPORT
  // ===================================================================
  
  const result = {
    // Posizioni assolute GARANTITE dentro viewport
    position: 'fixed', // SEMPRE fixed per controllo totale
    top: dropdownTop,
    left: dropdownLeft,
    width: dropdownWidth,
    height: dropdownHeight,
    maxHeight: dropdownHeight,
    
    // Informazioni per CSS classes
    showAbove: showAbove,
    horizontalAlignment: horizontalAlignment,
    isMobile: isMobile,
    isSmallMobile: isSmallMobile,
    isLandscape: viewportWidth > viewportHeight,
    
    // CSS classes da applicare
    cssClasses: {
      vertical: showAbove ? 'dropdown-above' : 'dropdown-below',
      horizontal: `dropdown-align-${horizontalAlignment}`,
      device: isMobile ? (isSmallMobile ? 'dropdown-small-mobile' : 'dropdown-mobile') : 'dropdown-desktop',
      orientation: viewportWidth > viewportHeight ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    
    // Garanzie di visibilità
    guarantees: {
      fullyVisible: true,
      withinViewport: true,
      safeMargins: SAFETY_MARGINS,
      clampingApplied: idealLeft < safeViewport.left || idealRight > safeViewport.right || 
                      idealTopPosition < safeViewport.top || idealBottomPosition > safeViewport.bottom
    },
    
    // Debug info
    debug: {
      markerPosition: {
        top: markerRect.top,
        bottom: markerRect.bottom,
        centerX: markerCenterX,
        visible: isMarkerInViewport(markerRect, viewportWidth, viewportHeight)
      },
      calculations: {
        idealPositions: {
          below: { top: idealTopPosition, bottom: idealBottomPosition },
          above: { top: idealAboveTopPosition, bottom: idealAboveBottomPosition }
        },
        finalPositions: {
          top: dropdownTop,
          bottom: dropdownBottom,
          left: dropdownLeft,
          right: dropdownLeft + dropdownWidth
        }
      }
    }
  };
  
  console.log('🎯 Posizionamento GARANTITO calcolato:', {
    fullyVisible: result.guarantees.fullyVisible,
    clampingUsed: result.guarantees.clampingApplied,
    position: `${dropdownTop.toFixed(0)}px-${dropdownBottom.toFixed(0)}px (${dropdownHeight.toFixed(0)}px tall)`
  });
  
  return result;
}

/**
 * Verifica se un marker è visibile nel viewport
 */
function isMarkerInViewport(markerRect, viewportWidth, viewportHeight) {
  return markerRect.top >= 0 && 
         markerRect.bottom <= viewportHeight &&
         markerRect.left >= 0 && 
         markerRect.right <= viewportWidth;
}

/**
 * Calcola dimensioni stimate del dropdown basate su device e contenuto
 */
function calculateEstimatedDropdownSize(isMobile, isSmallMobile) {
  // Calcola numero alleanze disponibili (se esiste la variabile globale)
  const allianceCount = (typeof alliances !== 'undefined') ? alliances.length : 5;
  
  // Dimensioni base per device
  let baseWidth, baseHeight;
  
  if (isSmallMobile) {
    baseWidth = 160;   // Più stretto per schermi piccoli
    baseHeight = 50;   // Header più compatto
  } else if (isMobile) {
    baseWidth = 200;
    baseHeight = 60;
  } else {
    baseWidth = 240;
    baseHeight = 60;
  }
  
  // Altezza basata sul contenuto
  const headerHeight = baseHeight;
  const optionHeight = isMobile ? 44 : 40;  // Apple HIG compliant
  const totalOptions = allianceCount + 1;  // +1 per "unassign"
  const contentHeight = totalOptions * optionHeight;
  const padding = 16;
  
  let totalHeight = headerHeight + contentHeight + padding;
  
  // Applica limiti massimi per device
  const maxHeight = isSmallMobile ? 280 : (isMobile ? 350 : 400);
  totalHeight = Math.min(totalHeight, maxHeight);
  
  return {
    width: baseWidth,
    height: totalHeight,
    estimatedFromContent: true
  };
}

/**
 * NUOVA VERSIONE: Applica posizionamento con garanzie viewport
 */
function applyViewportSafeDropdownPositioning(dropdown, positioning) {
  if (!dropdown || !positioning) {
    console.warn('⚠️ applyViewportSafeDropdownPositioning: parametri mancanti');
    return;
  }
  
  console.log('🔧 Applicando posizionamento SAFE al viewport...');
  
  // ===================================================================
  // 1. APPLICA CSS CLASSES (come prima)
  // ===================================================================
  
  dropdown.classList.remove(
    'dropdown-above', 'dropdown-below',
    'dropdown-align-left', 'dropdown-align-center', 'dropdown-align-right',
    'dropdown-mobile', 'dropdown-small-mobile', 'dropdown-desktop',
    'dropdown-landscape', 'dropdown-portrait'
  );
  
  Object.values(positioning.cssClasses).forEach(cssClass => {
    dropdown.classList.add(cssClass);
  });
  
  // ===================================================================
  // 2. APPLICA POSIZIONAMENTO ASSOLUTO GARANTITO
  // ===================================================================
  
  // SEMPRE fixed per controllo totale del viewport
  dropdown.style.position = 'fixed';
  dropdown.style.zIndex = '2000';
  
  // Applica coordinate precise GARANTITE dentro viewport
  dropdown.style.top = `${positioning.top}px`;
  dropdown.style.left = `${positioning.left}px`;
  dropdown.style.width = `${positioning.width}px`;
  dropdown.style.maxHeight = `${positioning.maxHeight}px`;
  
  // Reset coordinate che potrebbero confliggere
  dropdown.style.bottom = 'auto';
  dropdown.style.right = 'auto';
  dropdown.style.transform = 'none';
  
  console.log('📍 Posizioni applicate:', {
    position: dropdown.style.position,
    top: dropdown.style.top,
    left: dropdown.style.left,
    width: dropdown.style.width,
    maxHeight: dropdown.style.maxHeight
  });
  
  // ===================================================================
  // 3. AGGIORNA CONTAINER OPZIONI PER SCROLLING
  // ===================================================================
  
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  if (optionsContainer) {
    const headerHeight = 60;
    const maxOptionsHeight = positioning.height - headerHeight;
    
    optionsContainer.style.maxHeight = `${maxOptionsHeight}px`;
    optionsContainer.style.overflowY = 'auto';
    
    if (positioning.isMobile) {
      optionsContainer.style.webkitOverflowScrolling = 'touch';
      optionsContainer.style.scrollBehavior = 'smooth';
      optionsContainer.style.overscrollBehavior = 'contain';
    }
    
    console.log('📋 Container opzioni aggiornato:', {
      maxHeight: optionsContainer.style.maxHeight
    });
  }
  
  // ===================================================================
  // 4. AGGIUNGE ATTRIBUTI DEBUG (se richiesto)
  // ===================================================================
  
  if (window.location.search.includes('debug=true')) {
    dropdown.setAttribute('data-debug-guaranteed', 'viewport-safe');
    dropdown.setAttribute('data-debug-clamping', positioning.guarantees.clampingApplied ? 'applied' : 'none');
    dropdown.title = `Debug: ${positioning.top.toFixed(0)}px-${(positioning.top + positioning.height).toFixed(0)}px`;
  }
  
  console.log('✅ Posizionamento viewport-safe applicato con successo');
}

/**
 * Funzione di test per verificare che il dropdown rimanga nel viewport
 */
function verifyDropdownViewportCompliance(dropdown) {
  if (!dropdown) return false;
  
  const rect = dropdown.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const compliance = {
    withinTop: rect.top >= 0,
    withinBottom: rect.bottom <= viewport.height,
    withinLeft: rect.left >= 0,
    withinRight: rect.right <= viewport.width,
    fullyVisible: false
  };
  
  compliance.fullyVisible = compliance.withinTop && compliance.withinBottom && 
                           compliance.withinLeft && compliance.withinRight;
  
  console.log('✅ Verifica compliance viewport:', {
    dropdown: {
      top: rect.top.toFixed(1),
      bottom: rect.bottom.toFixed(1),
      left: rect.left.toFixed(1),
      right: rect.right.toFixed(1),
      width: rect.width.toFixed(1),
      height: rect.height.toFixed(1)
    },
    viewport: viewport,
    compliance: compliance,
    result: compliance.fullyVisible ? '✅ FULLY VISIBLE' : '❌ CLIPPED'
  });
  
  return compliance;
}

// =====================================================================
// OVERRIDE FUNZIONI ESISTENTI CON VERSIONI SAFE
// =====================================================================

// Sostituisce le funzioni esistenti con le versioni safe
function patchWithViewportSafeMethods() {
  console.log('🔧 Patching con metodi viewport-safe...');
  
  // Override funzioni globali
  if (typeof window.calculateOptimalDropdownPosition === 'function') {
    window.calculateOptimalDropdownPosition = calculateViewportSafeDropdownPosition;
    console.log('✅ calculateOptimalDropdownPosition → viewport-safe version');
  }
  
  if (typeof window.applyDropdownPositioning === 'function') {
    window.applyDropdownPositioning = applyViewportSafeDropdownPositioning;
    console.log('✅ applyDropdownPositioning → viewport-safe version');
  }
  
  // Aggiunge nuove funzioni
  window.calculateViewportSafeDropdownPosition = calculateViewportSafeDropdownPosition;
  window.applyViewportSafeDropdownPositioning = applyViewportSafeDropdownPositioning;
  window.verifyDropdownViewportCompliance = verifyDropdownViewportCompliance;
  
  console.log('✅ Tutte le funzioni dropdown sono ora viewport-safe');
}

// =====================================================================
// OBSERVER MIGLIORATO CON VERIFICA AUTOMATICA
// =====================================================================

function setupViewportSafeDropdownObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.classList && 
            node.classList.contains('marker-dropdown')) {
          
          console.log('🔍 Dropdown rilevato, applicando fix viewport-safe...');
          
          const marker = node.closest('.marker');
          if (marker) {
            // Applica posizionamento viewport-safe
            const positioning = calculateViewportSafeDropdownPosition(marker);
            applyViewportSafeDropdownPositioning(node, positioning);
            
            // Verifica compliance dopo applicazione
            setTimeout(() => {
              const compliance = verifyDropdownViewportCompliance(node);
              if (!compliance.fullyVisible) {
                console.warn('⚠️ Dropdown ancora non conforme, debug necessario');
              }
            }, 100);
            
            console.log('✅ Fix viewport-safe applicato automaticamente');
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('👀 Observer viewport-safe attivato');
}

// =====================================================================
// FUNZIONI DI TEST E DEBUG
// =====================================================================

window.testViewportSafeDropdown = function() {
  console.log('🧪 Test Viewport-Safe Dropdown System...');
  
  const marker = document.querySelector('.marker');
  if (!marker) {
    console.log('❌ Nessun marker trovato per test');
    return;
  }
  
  console.log('📍 Testando marker:', marker.title);
  
  // Simula click
  marker.click();
  
  setTimeout(() => {
    const dropdown = document.querySelector('.marker-dropdown');
    if (dropdown) {
      console.log('✅ Dropdown creato, verificando compliance...');
      
      const compliance = verifyDropdownViewportCompliance(dropdown);
      
      if (compliance.fullyVisible) {
        console.log('🎉 SUCCESS! Dropdown completamente visibile nel viewport');
      } else {
        console.log('❌ FAIL! Dropdown ancora tagliato:', compliance);
        
        // Tenta fix manuale
        console.log('🔧 Tentando fix manuale...');
        const marker = dropdown.closest('.marker');
        if (marker) {
          const newPositioning = calculateViewportSafeDropdownPosition(marker);
          applyViewportSafeDropdownPositioning(dropdown, newPositioning);
          
          setTimeout(() => {
            const retestCompliance = verifyDropdownViewportCompliance(dropdown);
            console.log('🔄 Risultato dopo fix manuale:', 
              retestCompliance.fullyVisible ? '✅ RISOLTO' : '❌ ANCORA PROBLEMI');
          }, 100);
        }
      }
    } else {
      console.log('❌ Dropdown non creato');
    }
  }, 500);
};

window.forceViewportSafeFixAllDropdowns = function() {
  console.log('🔧 Forzando fix viewport-safe su tutti i dropdown...');
  
  const dropdowns = document.querySelectorAll('.marker-dropdown');
  let fixedCount = 0;
  let compliantCount = 0;
  
  dropdowns.forEach((dropdown) => {
    const marker = dropdown.closest('.marker');
    if (marker) {
      const positioning = calculateViewportSafeDropdownPosition(marker);
      applyViewportSafeDropdownPositioning(dropdown, positioning);
      fixedCount++;
      
      // Verifica compliance
      setTimeout(() => {
        const compliance = verifyDropdownViewportCompliance(dropdown);
        if (compliance.fullyVisible) {
          compliantCount++;
        }
      }, 50);
    }
  });
  
  setTimeout(() => {
    console.log(`✅ Fix viewport-safe applicato a ${fixedCount} dropdown`);
    console.log(`🎯 Dropdown conformi al viewport: ${compliantCount}/${fixedCount}`);
  }, 200);
};

// =====================================================================
// AUTO-INIZIALIZZAZIONE
// =====================================================================

// Applica patch immediatamente
patchWithViewportSafeMethods();

// Attiva observer
setupViewportSafeDropdownObserver();

// Auto-fix per dropdown esistenti
setTimeout(() => {
  const existingDropdowns = document.querySelectorAll('.marker-dropdown');
  if (existingDropdowns.length > 0) {
    console.log('🔧 Dropdown esistenti rilevati, applicando auto-fix viewport-safe...');
    window.forceViewportSafeFixAllDropdowns();
  }
}, 1000);

console.log('✅ Dropdown Position Fix V2 caricato - Garanzia Anti-Clipping attiva');

// =====================================================================
// UTILITY DI DEBUG VIEWPORT
// =====================================================================

window.debugViewportInfo = function() {
  console.log('🔍 === DEBUG VIEWPORT INFO ===');
  console.log('📱 Viewport:', {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: (window.innerWidth / window.innerHeight).toFixed(2),
    type: window.innerWidth <= 480 ? 'small mobile' : 
          window.innerWidth <= 768 ? 'mobile' : 'desktop'
  });
  
  const markers = document.querySelectorAll('.marker');
  console.log(`📍 Marker totali: ${markers.length}`);
  
  let visibleMarkers = 0;
  markers.forEach((marker, i) => {
    const rect = marker.getBoundingClientRect();
    const visible = isMarkerInViewport(rect, window.innerWidth, window.innerHeight);
    if (visible) visibleMarkers++;
    
    if (i < 5) { // Log primi 5 per evitare spam
      console.log(`  Marker ${i + 1}: ${visible ? '👁️' : '🙈'} ${rect.top.toFixed(0)},${rect.left.toFixed(0)}`);
    }
  });
  
  console.log(`👁️ Marker visibili nel viewport: ${visibleMarkers}/${markers.length}`);
  
  const dropdowns = document.querySelectorAll('.marker-dropdown');
  console.log(`📋 Dropdown aperti: ${dropdowns.length}`);
  
  dropdowns.forEach((dropdown, i) => {
    const compliance = verifyDropdownViewportCompliance(dropdown);
    console.log(`  Dropdown ${i + 1}: ${compliance.fullyVisible ? '✅' : '❌'} visible`);
  });
  
  console.log('===============================');
};