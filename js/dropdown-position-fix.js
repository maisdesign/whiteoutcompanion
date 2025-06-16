// =====================================================================
// FIX POSIZIONAMENTO DROPDOWN - VERSIONE ACCURATA PER MOBILE
// =====================================================================
// Questo fix risolve i problemi di clipping sostituendo la logica
// di posizionamento esistente con calcoli più precisi e dinamici

console.log('🔧 Caricamento fix posizionamento dropdown accurato...');

/**
 * NUOVO: Calcola posizionamento dinamico accurato per viewport mobile
 * Sostituisce calculateOptimalDropdownPosition con logica più precisa
 */
function calculateAccurateDropdownPosition(marker) {
  const mapWrapper = document.getElementById('map-wrapper');
  const markerRect = marker.getBoundingClientRect();
  const mapRect = mapWrapper.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  console.log('📏 Dimensioni viewport:', { width: viewportWidth, height: viewportHeight });
  console.log('📍 Posizione marker:', { 
    top: markerRect.top, 
    bottom: markerRect.bottom,
    left: markerRect.left,
    right: markerRect.right 
  });

  // ===================================================================
  // 1. VERIFICA SE MARKER È VISIBILE NEL VIEWPORT
  // ===================================================================
  
  const isMarkerVisible = markerRect.top >= 0 && 
                         markerRect.bottom <= viewportHeight &&
                         markerRect.left >= 0 && 
                         markerRect.right <= viewportWidth;
  
  console.log('👁️ Marker visibile nel viewport:', isMarkerVisible);
  
  // Se il marker non è visibile, usa posizionamento relativo classico
  if (!isMarkerVisible) {
    console.log('⚠️ Marker fuori viewport, usando posizionamento relativo');
    return calculateFallbackRelativePosition(marker, markerRect, mapRect, viewportWidth);
  }

  // ===================================================================
  // 2. CALCOLO SPAZIO VERTICALE DISPONIBILE ACCURATO (SOLO SE VISIBILE)
  // ===================================================================
  
  // Spazio sopra il marker nel viewport
  const spaceAboveInViewport = markerRect.top;
  
  // Spazio sotto il marker nel viewport  
  const spaceBelowInViewport = viewportHeight - markerRect.bottom;
  
  // Safe area adjustments per dispositivi con notch
  const safeAreaTop = 44;    // Notch iPhone tipico
  const safeAreaBottom = 34; // Home indicator iPhone
  const isMobile = viewportWidth <= 768;
  
  const adjustedSpaceAbove = isMobile ? 
    Math.max(0, spaceAboveInViewport - safeAreaTop) : 
    spaceAboveInViewport;
    
  const adjustedSpaceBelow = isMobile ? 
    Math.max(0, spaceBelowInViewport - safeAreaBottom) : 
    spaceBelowInViewport;
  
  // ===================================================================
  // 2. STIMA ALTEZZA DROPDOWN DINAMICA
  // ===================================================================
  
  // Calcola altezza approssimativa del dropdown basata sul contenuto
  const headerHeight = 50;
  const optionHeight = isMobile ? 44 : 40; // Apple HIG compliant per mobile
  const totalOptions = (alliances?.length || 0) + 1; // +1 per unassign
  const optionsHeight = totalOptions * optionHeight;
  const padding = 16;
  const scrollbarSpace = 8;
  
  let estimatedDropdownHeight = headerHeight + optionsHeight + padding + scrollbarSpace;
  
  // Applica limiti massimi
  const maxHeightDesktop = 400;
  const maxHeightMobile = isMobile ? 350 : maxHeightDesktop;
  estimatedDropdownHeight = Math.min(estimatedDropdownHeight, maxHeightMobile);
  
  console.log('📊 Stime altezza:', {
    estimated: estimatedDropdownHeight,
    spaceAbove: adjustedSpaceAbove,
    spaceBelow: adjustedSpaceBelow
  });
  
  // ===================================================================
  // 3. DECISIONE POSIZIONAMENTO INTELLIGENTE
  // ===================================================================
  
  let showAbove = false;
  let finalMaxHeight = estimatedDropdownHeight;
  
  // Logica decisionale migliorata
  if (adjustedSpaceBelow >= estimatedDropdownHeight) {
    // Spazio sufficiente sotto - usa sotto
    showAbove = false;
    finalMaxHeight = Math.min(estimatedDropdownHeight, adjustedSpaceBelow - 10);
  } else if (adjustedSpaceAbove >= estimatedDropdownHeight) {
    // Spazio sufficiente sopra - usa sopra  
    showAbove = true;
    finalMaxHeight = Math.min(estimatedDropdownHeight, adjustedSpaceAbove - 10);
  } else {
    // Spazio limitato - scegli il lato con più spazio
    if (adjustedSpaceAbove > adjustedSpaceBelow) {
      showAbove = true;
      finalMaxHeight = adjustedSpaceAbove - 10;
    } else {
      showAbove = false;
      finalMaxHeight = adjustedSpaceBelow - 10;
    }
  }
  
  // Assicura altezza minima
  finalMaxHeight = Math.max(finalMaxHeight, 200);
  
  // ===================================================================
  // 4. CALCOLO POSIZIONAMENTO ORIZZONTALE (RIUTILIZZA LOGICA ESISTENTE)
  // ===================================================================
  
  const markerLeftRelative = markerRect.left - mapRect.left;
  const markerCenterRelative = markerLeftRelative + (markerRect.width / 2);
  const mapWidth = mapRect.width;
  const horizontalPosition = (markerCenterRelative / mapWidth) * 100;
  
  let horizontalAlignment = 'center';
  
  if (horizontalPosition < 15) {
    horizontalAlignment = 'left';
  } else if (horizontalPosition > 85) {
    horizontalAlignment = 'right';
  }
  
  // ===================================================================
  // 5. RISULTATO FINALE CON POSIZIONI DINAMICHE
  // ===================================================================
  
  const result = {
    // Posizionamento verticale DINAMICO
    showAbove: showAbove,
    dynamicPosition: true, // FLAG per indicare posizione dinamica
    spaceAbove: adjustedSpaceAbove,
    spaceBelow: adjustedSpaceBelow,
    calculatedMaxHeight: finalMaxHeight,
    
    // Posizionamento orizzontale
    horizontalAlignment: horizontalAlignment,
    horizontalPosition: horizontalPosition,
    
    // Ottimizzazioni dispositivo
    isMobile: isMobile,
    isSmallMobile: viewportWidth <= 480,
    isLandscape: viewportWidth > viewportHeight,
    
    // CSS classes
    cssClasses: {
      vertical: showAbove ? 'dropdown-above' : 'dropdown-below',
      horizontal: `dropdown-align-${horizontalAlignment}`,
      device: isMobile ? (viewportWidth <= 480 ? 'dropdown-small-mobile' : 'dropdown-mobile') : 'dropdown-desktop',
      orientation: viewportWidth > viewportHeight ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    
    // Posizioni assolute precise (NUOVO)
    absolutePositioning: {
      top: showAbove ? null : markerRect.bottom + 5,
      bottom: showAbove ? viewportHeight - markerRect.top + 5 : null,
      maxHeight: finalMaxHeight
    },
    
    // Debug info migliorata
    debug: {
      markerViewportPosition: {
        top: markerRect.top,
        bottom: markerRect.bottom,
        centerY: markerRect.top + (markerRect.height / 2)
      },
      spaceAnalysis: {
        available: { above: adjustedSpaceAbove, below: adjustedSpaceBelow },
        required: estimatedDropdownHeight,
        decision: showAbove ? 'SOPRA' : 'SOTTO',
        reason: adjustedSpaceBelow >= estimatedDropdownHeight ? 'spazio sotto sufficiente' :
                adjustedSpaceAbove >= estimatedDropdownHeight ? 'spazio sopra sufficiente' :
                adjustedSpaceAbove > adjustedSpaceBelow ? 'più spazio sopra' : 'più spazio sotto'
      }
    }
  };
  
  console.log('🎯 Posizionamento calcolato:', {
    posizione: showAbove ? 'SOPRA' : 'SOTTO',
    altezzaMax: finalMaxHeight,
    spazioSopra: adjustedSpaceAbove,
    spazioSotto: adjustedSpaceBelow,
    motivo: result.debug.spaceAnalysis.reason
  });
  
  return result;
}

/**
 * Calcola posizionamento relativo quando il marker è fuori dal viewport
 * Fallback sicuro per marker non visibili
 */
function calculateFallbackRelativePosition(marker, markerRect, mapRect, viewportWidth) {
  console.log('🔄 Calcolo posizionamento relativo fallback...');
  
  const isMobile = viewportWidth <= 768;
  const isSmallMobile = viewportWidth <= 480;
  
  // Calcola posizione relativa alla mappa (non al viewport)
  const markerTopRelativeToMap = markerRect.top - mapRect.top;
  const mapHeight = mapRect.height;
  
  // Usa la logica originale per determinare sopra/sotto
  const showAbove = markerTopRelativeToMap > mapHeight * 0.6;
  
  // Calcola allineamento orizzontale
  const markerLeftRelative = markerRect.left - mapRect.left;
  const markerCenterRelative = markerLeftRelative + (markerRect.width / 2);
  const mapWidth = mapRect.width;
  const horizontalPosition = (markerCenterRelative / mapWidth) * 100;
  
  let horizontalAlignment = 'center';
  if (horizontalPosition < 15) {
    horizontalAlignment = 'left';
  } else if (horizontalPosition > 85) {
    horizontalAlignment = 'right';
  }
  
  // Altezza appropriata per mobile
  let maxHeight;
  if (isSmallMobile) {
    maxHeight = 280;
  } else if (isMobile) {
    maxHeight = 350;
  } else {
    maxHeight = 400;
  }
  
  const result = {
    // Posizionamento verticale
    showAbove: showAbove,
    dynamicPosition: false, // Usa posizionamento CSS relativo
    spaceAbove: markerTopRelativeToMap,
    spaceBelow: mapHeight - markerTopRelativeToMap,
    calculatedMaxHeight: maxHeight,
    
    // Posizionamento orizzontale
    horizontalAlignment: horizontalAlignment,
    horizontalPosition: horizontalPosition,
    
    // Ottimizzazioni dispositivo
    isMobile: isMobile,
    isSmallMobile: isSmallMobile,
    isLandscape: viewportWidth > viewportHeight,
    
    // CSS classes
    cssClasses: {
      vertical: showAbove ? 'dropdown-above' : 'dropdown-below',
      horizontal: `dropdown-align-${horizontalAlignment}`,
      device: isMobile ? (isSmallMobile ? 'dropdown-small-mobile' : 'dropdown-mobile') : 'dropdown-desktop',
      orientation: viewportWidth > viewportHeight ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    
    // Nessun posizionamento assoluto - usa CSS relativo
    absolutePositioning: null,
    
    // Debug info
    debug: {
      markerViewportPosition: {
        top: markerRect.top,
        bottom: markerRect.bottom,
        isVisible: false
      },
      spaceAnalysis: {
        available: { above: markerTopRelativeToMap, below: mapHeight - markerTopRelativeToMap },
        required: maxHeight,
        decision: showAbove ? 'SOPRA' : 'SOTTO',
        reason: 'fallback relativo (marker fuori viewport)'
      }
    }
  };
  
  console.log('🔄 Posizionamento relativo calcolato:', {
    posizione: showAbove ? 'SOPRA' : 'SOTTO',
    altezzaMax: maxHeight,
    allineamento: horizontalAlignment,
    motivo: 'marker fuori viewport'
  });
  
  return result;
}

/**
 * NUOVO: Applica posizionamento dinamico con posizioni assolute precise
 * Sostituisce applyDropdownPositioning con logica più accurata
 */
function applyAccurateDropdownPositioning(dropdown, positioning) {
  if (!dropdown || !positioning) return;
  
  console.log('🔧 Applicando posizionamento accurato...');
  
  // ===================================================================
  // 1. APPLICA CLASSI CSS (come prima)
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
  // 2. SCEGLI TIPO DI POSIZIONAMENTO BASATO SU VISIBILITÀ MARKER
  // ===================================================================
  
  if (positioning.dynamicPosition && positioning.absolutePositioning) {
    // POSIZIONAMENTO ASSOLUTO per marker visibili
    console.log('📍 Applicando posizionamento assoluto (marker visibile)');
    
    const abs = positioning.absolutePositioning;
    
    // Cambia a posizionamento fisso per viewport accuracy
    dropdown.style.position = 'fixed';
    dropdown.style.zIndex = '2000';
    
    // Applica posizione verticale precisa
    if (abs.top !== null) {
      dropdown.style.top = `${abs.top}px`;
      dropdown.style.bottom = 'auto';
    } else {
      dropdown.style.bottom = `${abs.bottom}px`;
      dropdown.style.top = 'auto';
    }
    
    // Altezza massima dinamica
    dropdown.style.maxHeight = `${abs.maxHeight}px`;
    
    console.log('📍 Posizione assoluta applicata:', {
      top: dropdown.style.top,
      bottom: dropdown.style.bottom,
      maxHeight: dropdown.style.maxHeight
    });
    
  } else {
    // POSIZIONAMENTO RELATIVO per marker fuori viewport
    console.log('🔄 Applicando posizionamento relativo (marker fuori viewport)');
    
    // Mantieni posizionamento CSS relativo standard
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '2000';
    
    // Reset posizioni assolute
    dropdown.style.top = '';
    dropdown.style.bottom = '';
    
    // Applica solo altezza massima
    dropdown.style.maxHeight = `${positioning.calculatedMaxHeight}px`;
    
    console.log('🔄 Posizione relativa applicata:', {
      position: 'absolute (relativo al marker)',
      maxHeight: dropdown.style.maxHeight
    });
  }
  
  // ===================================================================
  // 3. POSIZIONAMENTO ORIZZONTALE (come prima)
  // ===================================================================
  
  if (positioning.horizontalAlignment === 'left') {
    dropdown.style.left = '0';
    dropdown.style.right = 'auto';
    dropdown.style.transform = 'none';
  } else if (positioning.horizontalAlignment === 'right') {
    dropdown.style.right = '0';
    dropdown.style.left = 'auto';
    dropdown.style.transform = 'none';
  } else {
    dropdown.style.left = '50%';
    dropdown.style.right = 'auto';
    dropdown.style.transform = 'translateX(-50%)';
  }
  
  // ===================================================================
  // 4. AGGIORNAMENTO CONTAINER OPZIONI
  // ===================================================================
  
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  if (optionsContainer) {
    const headerHeight = 60;
    const maxOptionsHeight = positioning.calculatedMaxHeight - headerHeight;
    optionsContainer.style.maxHeight = `${maxOptionsHeight}px`;
    optionsContainer.style.overflowY = 'auto';
    
    if (positioning.isMobile) {
      optionsContainer.style.webkitOverflowScrolling = 'touch';
      optionsContainer.style.scrollBehavior = 'smooth';
    }
  }
  
  console.log('✅ Posizionamento accurato applicato');
}

/**
 * Sostituisce la funzione esistente nel sistema marker
 * Questo monkey patch assicura che tutti i dropdown usino il nuovo sistema
 */
function patchMarkerDropdownSystem() {
  console.log('🔧 Patching sistema dropdown marker...');
  
  // Override delle funzioni globali esistenti se presenti
  if (typeof window.calculateOptimalDropdownPosition === 'function') {
    window.calculateOptimalDropdownPosition = calculateAccurateDropdownPosition;
    console.log('✅ calculateOptimalDropdownPosition aggiornata');
  }
  
  if (typeof window.applyDropdownPositioning === 'function') {
    window.applyDropdownPositioning = applyAccurateDropdownPositioning;
    console.log('✅ applyDropdownPositioning aggiornata');
  }
  
  // Aggiungi funzioni al window per accesso globale
  window.calculateAccurateDropdownPosition = calculateAccurateDropdownPosition;
  window.applyAccurateDropdownPositioning = applyAccurateDropdownPositioning;
}

/**
 * Observer migliorato per applicare fix automatico ai dropdown
 */
function setupImprovedDropdownObserver() {
  const dropdownObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.classList && 
            node.classList.contains('marker-dropdown')) {
          
          console.log('🔍 Nuovo dropdown rilevato, applicando fix accurato...');
          
          const marker = node.closest('.marker');
          if (marker) {
            // Applica il posizionamento accurato
            const positioning = calculateAccurateDropdownPosition(marker);
            applyAccurateDropdownPositioning(node, positioning);
            
            console.log('✅ Fix accurato applicato automaticamente');
          }
        }
      });
    });
  });
  
  dropdownObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('👀 Observer dropdown accurato attivato');
}

/**
 * Funzione di test per verificare il fix
 */
window.testAccurateDropdownFix = function() {
  console.log('🧪 Test fix dropdown accurato...');
  
  const marker = document.querySelector('.marker');
  if (marker) {
    console.log('📍 Testando marker:', marker.title);
    
    // Simula click
    marker.click();
    
    setTimeout(() => {
      const dropdown = document.querySelector('.marker-dropdown');
      if (dropdown) {
        console.log('✅ Dropdown trovato, verificando posizionamento...');
        
        const rect = dropdown.getBoundingClientRect();
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        
        const isVisible = {
          top: rect.top >= 0,
          bottom: rect.bottom <= viewport.height,
          left: rect.left >= 0,
          right: rect.right <= viewport.width
        };
        
        const isFullyVisible = Object.values(isVisible).every(v => v);
        
        console.log('📏 Verifica visibilità:', {
          dropdown: { 
            top: rect.top, 
            bottom: rect.bottom, 
            width: rect.width, 
            height: rect.height 
          },
          viewport: viewport,
          visibile: isVisible,
          tuttoVisibile: isFullyVisible,
          positionType: dropdown.style.position,
          classes: dropdown.className
        });
        
        if (!isFullyVisible) {
          console.warn('⚠️ Dropdown parzialmente fuori viewport');
          
          // Verifica se è un problema di posizionamento
          const clippedTop = rect.top < 0;
          const clippedBottom = rect.bottom > viewport.height;
          
          if (clippedTop) {
            console.warn('  🔴 Clipped TOP:', Math.abs(rect.top), 'pixels');
          }
          if (clippedBottom) {
            console.warn('  🔴 Clipped BOTTOM:', rect.bottom - viewport.height, 'pixels');
          }
          
          // Prova a riapplicare il fix
          const marker = dropdown.closest('.marker');
          if (marker) {
            console.log('🔧 Riapplicando fix...');
            const newPositioning = calculateAccurateDropdownPosition(marker);
            applyAccurateDropdownPositioning(dropdown, newPositioning);
          }
        } else {
          console.log('✅ Dropdown completamente visibile nel viewport!');
        }
        
      } else {
        console.log('❌ Dropdown non trovato');
      }
    }, 500);
  }
};

/**
 * Forza fix su tutti i dropdown esistenti
 */
window.forceAccurateFixAllDropdowns = function() {
  console.log('🔧 Forzando fix accurato su tutti i dropdown...');
  
  const dropdowns = document.querySelectorAll('.marker-dropdown');
  let fixedCount = 0;
  
  dropdowns.forEach((dropdown) => {
    const marker = dropdown.closest('.marker');
    if (marker) {
      const positioning = calculateAccurateDropdownPosition(marker);
      applyAccurateDropdownPositioning(dropdown, positioning);
      fixedCount++;
    }
  });
  
  console.log(`✅ Fix accurato applicato a ${fixedCount} dropdown`);
  
  // Verifica risultati
  setTimeout(() => {
    const testDropdown = document.querySelector('.marker-dropdown');
    if (testDropdown) {
      const rect = testDropdown.getBoundingClientRect();
      console.log('📏 Verifica post-fix:', {
        posizione: { top: rect.top, bottom: rect.bottom },
        dimensioni: { width: rect.width, height: rect.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        visibile: rect.top >= 0 && rect.bottom <= window.innerHeight
      });
    }
  }, 100);
};

// ===================================================================
// INIZIALIZZAZIONE AUTOMATICA
// ===================================================================

// Applica patch immediatamente
patchMarkerDropdownSystem();

// Attiva observer migliorato
setupImprovedDropdownObserver();

// Auto-fix per dropdown esistenti
setTimeout(() => {
  const existingDropdowns = document.querySelectorAll('.marker-dropdown');
  if (existingDropdowns.length > 0) {
    console.log('🔧 Dropdown esistenti rilevati, applicando auto-fix accurato...');
    window.forceAccurateFixAllDropdowns();
  }
}, 1000);

console.log('✅ Fix posizionamento dropdown accurato caricato e attivo');

// ===================================================================
// UTILITY PER SVILUPPO E DEBUG
// ===================================================================

window.debugDropdownAccuracy = function() {
  console.log('🔍 === DEBUG ACCURATEZZA DROPDOWN ===');
  
  const dropdowns = document.querySelectorAll('.marker-dropdown');
  console.log(`📊 Dropdown attivi: ${dropdowns.length}`);
  
  dropdowns.forEach((dropdown, i) => {
    const rect = dropdown.getBoundingClientRect();
    const marker = dropdown.closest('.marker');
    const markerRect = marker ? marker.getBoundingClientRect() : null;
    
    console.log(`\n📋 Dropdown ${i + 1}:`);
    console.log(`  Marker: ${marker?.title || 'Unknown'}`);
    console.log(`  Posizione dropdown: top=${rect.top.toFixed(1)}, bottom=${rect.bottom.toFixed(1)}`);
    console.log(`  Dimensioni: ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`);
    console.log(`  Position style: ${dropdown.style.position || 'default'}`);
    console.log(`  Visibile: ${rect.top >= 0 && rect.bottom <= window.innerHeight ? '✅' : '❌'}`);
    
    if (markerRect) {
      const markerVisible = markerRect.top >= 0 && 
                           markerRect.bottom <= window.innerHeight &&
                           markerRect.left >= 0 && 
                           markerRect.right <= window.innerWidth;
      console.log(`  Marker visibile: ${markerVisible ? '✅' : '❌'} (top=${markerRect.top.toFixed(1)}, bottom=${markerRect.bottom.toFixed(1)})`);
    }
    
    // Verifica clipping
    const clippedTop = rect.top < 0;
    const clippedBottom = rect.bottom > window.innerHeight;
    const clippedLeft = rect.left < 0;
    const clippedRight = rect.right > window.innerWidth;
    
    if (clippedTop || clippedBottom || clippedLeft || clippedRight) {
      console.log(`  🔴 Clipping rilevato:`);
      if (clippedTop) console.log(`    - TOP: ${Math.abs(rect.top).toFixed(1)}px fuori`);
      if (clippedBottom) console.log(`    - BOTTOM: ${(rect.bottom - window.innerHeight).toFixed(1)}px fuori`);
      if (clippedLeft) console.log(`    - LEFT: ${Math.abs(rect.left).toFixed(1)}px fuori`);
      if (clippedRight) console.log(`    - RIGHT: ${(rect.right - window.innerWidth).toFixed(1)}px fuori`);
    }
    
    console.log(`  Classi: ${dropdown.className}`);
  });
  
  console.log('\n📱 Viewport:', {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: (window.innerWidth / window.innerHeight).toFixed(2)
  });
  
  console.log('\n📜 Scroll info:', {
    pageYOffset: window.pageYOffset,
    scrollTop: document.documentElement.scrollTop,
    scrollHeight: document.documentElement.scrollHeight
  });
  
  console.log('===================================');
};

// Esegui debug automatico dopo 3 secondi se in development
if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
  setTimeout(() => {
    window.debugDropdownAccuracy();
  }, 3000);
}