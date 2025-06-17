// =====================================================================
// DROPDOWN POSITION FIX V3 - SOLUZIONE DINAMICA POST-RENDER
// =====================================================================
// Questo fix risolve il problema delle dimensioni reali vs stimate
// utilizzando un approccio in due fasi:
// 1. Posizionamento iniziale con dimensioni stimate
// 2. Riposizionamento dinamico con dimensioni reali misurate

console.log('🔧 Caricamento Dropdown Position Fix V3 - Fix Dinamico Post-Render...');

/**
 * FASE 1: Calcola posizionamento iniziale con dimensioni stimate
 * Questo è simile alla V2 ma preparato per il riposizionamento dinamico
 */
function calculateInitialDropdownPosition(marker) {
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

  // Device detection
  const isMobile = viewportWidth <= 768;
  const isSmallMobile = viewportWidth <= 480;
  
  // Dimensioni stimate conservative (più piccole per sicurezza)
  const estimatedDimensions = calculateConservativeDropdownSize(isMobile, isSmallMobile);
  
  console.log('📐 Dimensioni stimate (conservative):', estimatedDimensions);

  // Margini di sicurezza aumentati per fase iniziale
  const SAFETY_MARGINS = {
    top: isMobile ? 70 : 50,      // Margini più ampi per fase 1
    bottom: isMobile ? 90 : 50,   
    left: isMobile ? 25 : 20,
    right: isMobile ? 25 : 20
  };
  
  const safeViewport = {
    top: SAFETY_MARGINS.top,
    bottom: viewportHeight - SAFETY_MARGINS.bottom,
    left: SAFETY_MARGINS.left,
    right: viewportWidth - SAFETY_MARGINS.right,
    width: viewportWidth - SAFETY_MARGINS.left - SAFETY_MARGINS.right,
    height: viewportHeight - SAFETY_MARGINS.top - SAFETY_MARGINS.bottom
  };
  
  console.log('🛡️ Safe viewport area (fase 1):', safeViewport);

  // Calcolo posizione iniziale con dimensioni conservative
  const initialHeight = Math.min(estimatedDimensions.height, safeViewport.height * 0.8); // Max 80% safe area
  const initialWidth = Math.min(estimatedDimensions.width, safeViewport.width * 0.9);   // Max 90% safe area
  
  // Posizionamento verticale iniziale (preferenza sotto)
  let initialTop, showAbove;
  const idealTopBelow = markerRect.bottom + 10;
  const idealBottomBelow = idealTopBelow + initialHeight;
  
  if (idealBottomBelow <= safeViewport.bottom) {
    // Entra sotto
    showAbove = false;
    initialTop = idealTopBelow;
  } else {
    // Prova sopra
    const idealTopAbove = markerRect.top - initialHeight - 10;
    if (idealTopAbove >= safeViewport.top) {
      showAbove = true;
      initialTop = idealTopAbove;
    } else {
      // Emergency: scegli lato con più spazio e clamp
      const spaceBelow = safeViewport.bottom - markerRect.bottom;
      const spaceAbove = markerRect.top - safeViewport.top;
      
      if (spaceBelow >= spaceAbove) {
        showAbove = false;
        initialTop = Math.max(safeViewport.top, safeViewport.bottom - initialHeight);
      } else {
        showAbove = true;
        initialTop = safeViewport.top;
      }
    }
  }
  
  // Posizionamento orizzontale
  const markerCenterX = markerRect.left + (markerRect.width / 2);
  const idealLeft = markerCenterX - (initialWidth / 2);
  const clampedLeft = Math.max(safeViewport.left, 
                              Math.min(idealLeft, safeViewport.right - initialWidth));
  
  const result = {
    // Fase 1: Posizioni iniziali
    phase: 1,
    position: 'fixed',
    top: initialTop,
    left: clampedLeft,
    width: initialWidth,
    height: initialHeight,
    maxHeight: initialHeight,
    
    // Info per fase 2
    showAbove: showAbove,
    safeViewport: safeViewport,
    markerRect: markerRect,
    
    // Device info
    isMobile: isMobile,
    isSmallMobile: isSmallMobile,
    isLandscape: viewportWidth > viewportHeight,
    
    // CSS classes
    cssClasses: {
      vertical: showAbove ? 'dropdown-above' : 'dropdown-below',
      horizontal: 'dropdown-align-center', // Sempre center in fase 1
      device: isMobile ? (isSmallMobile ? 'dropdown-small-mobile' : 'dropdown-mobile') : 'dropdown-desktop',
      orientation: viewportWidth > viewportHeight ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    
    debug: {
      phase: 'INITIAL_POSITIONING',
      estimated: estimatedDimensions,
      safeArea: safeViewport,
      positioning: showAbove ? 'ABOVE' : 'BELOW'
    }
  };
  
  console.log('🎯 Posizionamento iniziale (Fase 1):', {
    top: initialTop,
    height: initialHeight,
    showAbove: showAbove,
    phase: 'initial'
  });
  
  return result;
}

/**
 * FASE 2: Riposizionamento dinamico basato su dimensioni reali
 * Questa funzione viene chiamata dopo che il dropdown è stato renderizzato
 */
function calculateDynamicDropdownReposition(dropdown, initialPositioning) {
  if (!dropdown || !initialPositioning) {
    console.warn('⚠️ calculateDynamicDropdownReposition: parametri mancanti');
    return null;
  }
  
  // Misura dimensioni reali del dropdown
  const realRect = dropdown.getBoundingClientRect();
  const realWidth = realRect.width;
  const realHeight = realRect.height;
  
  console.log('📏 Dimensioni reali misurate:', {
    width: realWidth,
    height: realHeight,
    currentTop: realRect.top,
    currentBottom: realRect.bottom
  });
  
  // Verifica se il dropdown è ancora dentro il safe viewport
  const safeViewport = initialPositioning.safeViewport;
  const isCurrentlyCompliant = realRect.top >= safeViewport.top && 
                              realRect.bottom <= safeViewport.bottom &&
                              realRect.left >= safeViewport.left && 
                              realRect.right <= safeViewport.right;
  
  console.log('🔍 Compliance check fase 2:', {
    compliant: isCurrentlyCompliant,
    currentBounds: {
      top: realRect.top,
      bottom: realRect.bottom,
      left: realRect.left,
      right: realRect.right
    },
    safeBounds: safeViewport
  });
  
  if (isCurrentlyCompliant) {
    console.log('✅ Dropdown già compliant, nessun riposizionamento necessario');
    return {
      phase: 2,
      reposition: false,
      reason: 'already_compliant',
      finalPositioning: initialPositioning
    };
  }
  
  // RIPOSIZIONAMENTO NECESSARIO
  console.log('🔧 Riposizionamento necessario, ricalcolando...');
  
  const markerRect = initialPositioning.markerRect;
  let newTop, newLeft, newShowAbove;
  
  // Riposizionamento verticale con dimensioni reali
  const idealTopBelow = markerRect.bottom + 10;
  const idealBottomBelow = idealTopBelow + realHeight;
  
  if (idealBottomBelow <= safeViewport.bottom) {
    // Entra sotto con dimensioni reali
    newShowAbove = false;
    newTop = idealTopBelow;
  } else {
    // Prova sopra con dimensioni reali
    const idealTopAbove = markerRect.top - realHeight - 10;
    if (idealTopAbove >= safeViewport.top) {
      newShowAbove = true;
      newTop = idealTopAbove;
    } else {
      // Emergency clamping con dimensioni reali
      const spaceBelow = safeViewport.bottom - markerRect.bottom - 10;
      const spaceAbove = markerRect.top - safeViewport.top - 10;
      
      if (spaceBelow >= spaceAbove && spaceBelow >= 100) {
        // Sotto con altezza ridotta
        newShowAbove = false;
        newTop = markerRect.bottom + 10;
        realHeight = Math.min(realHeight, spaceBelow);
      } else if (spaceAbove >= 100) {
        // Sopra con altezza ridotta
        newShowAbove = true;
        newTop = safeViewport.top;
        realHeight = Math.min(realHeight, spaceAbove);
      } else {
        // Caso estremo: centra nel safe viewport
        newShowAbove = false;
        newTop = safeViewport.top + (safeViewport.height - realHeight) / 2;
        newTop = Math.max(safeViewport.top, newTop);
      }
    }
  }
  
  // Riposizionamento orizzontale con dimensioni reali
  const markerCenterX = markerRect.left + (markerRect.width / 2);
  const idealLeft = markerCenterX - (realWidth / 2);
  newLeft = Math.max(safeViewport.left, 
                    Math.min(idealLeft, safeViewport.right - realWidth));
  
  // Final safety clamp
  newTop = Math.max(safeViewport.top, 
                   Math.min(newTop, safeViewport.bottom - realHeight));
  
  const result = {
    phase: 2,
    reposition: true,
    reason: 'size_mismatch_correction',
    
    // Nuove posizioni
    position: 'fixed',
    top: newTop,
    left: newLeft,
    width: realWidth,
    height: realHeight,
    maxHeight: realHeight,
    
    // Info aggiuntive
    showAbove: newShowAbove,
    
    // Update CSS classes se necessario
    cssClasses: {
      ...initialPositioning.cssClasses,
      vertical: newShowAbove ? 'dropdown-above' : 'dropdown-below'
    },
    
    debug: {
      phase: 'DYNAMIC_REPOSITION',
      sizeDifference: {
        widthDiff: realWidth - initialPositioning.width,
        heightDiff: realHeight - initialPositioning.height
      },
      newPositioning: newShowAbove ? 'ABOVE' : 'BELOW',
      correction: 'real_dimensions_used'
    }
  };
  
  console.log('🎯 Riposizionamento dinamico (Fase 2):', {
    newTop: newTop,
    newHeight: realHeight,
    correction: `${realHeight - initialPositioning.height}px altezza aggiuntiva`,
    phase: 'dynamic'
  });
  
  return result;
}

/**
 * Applica il posizionamento (fase 1 o 2)
 */
function applyDynamicDropdownPositioning(dropdown, positioning) {
  if (!dropdown || !positioning) {
    console.warn('⚠️ applyDynamicDropdownPositioning: parametri mancanti');
    return;
  }
  
  console.log(`🔧 Applicando posizionamento Fase ${positioning.phase}...`);
  
  // Applica CSS classes
  dropdown.classList.remove(
    'dropdown-above', 'dropdown-below',
    'dropdown-align-left', 'dropdown-align-center', 'dropdown-align-right',
    'dropdown-mobile', 'dropdown-small-mobile', 'dropdown-desktop',
    'dropdown-landscape', 'dropdown-portrait'
  );
  
  Object.values(positioning.cssClasses).forEach(cssClass => {
    dropdown.classList.add(cssClass);
  });
  
  // Applica posizionamento
  dropdown.style.position = positioning.position;
  dropdown.style.zIndex = '2000';
  dropdown.style.top = `${positioning.top}px`;
  dropdown.style.left = `${positioning.left}px`;
  dropdown.style.width = `${positioning.width}px`;
  dropdown.style.maxHeight = `${positioning.maxHeight}px`;
  
  // Reset conflitti
  dropdown.style.bottom = 'auto';
  dropdown.style.right = 'auto';
  dropdown.style.transform = 'none';
  
  // Aggiorna container opzioni
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  if (optionsContainer) {
    const headerHeight = 60;
    const maxOptionsHeight = positioning.height - headerHeight;
    optionsContainer.style.maxHeight = `${Math.max(100, maxOptionsHeight)}px`;
    optionsContainer.style.overflowY = 'auto';
    
    if (positioning.isMobile) {
      optionsContainer.style.webkitOverflowScrolling = 'touch';
      optionsContainer.style.scrollBehavior = 'smooth';
    }
  }
  
  console.log('✅ Posizionamento applicato:', {
    phase: positioning.phase,
    position: `${positioning.top}px, ${positioning.left}px`,
    size: `${positioning.width}px × ${positioning.height}px`
  });
}

/**
 * Processo completo in due fasi
 */
function applyTwoPhaseDropdownPositioning(dropdown, marker) {
  if (!dropdown || !marker) {
    console.warn('⚠️ applyTwoPhaseDropdownPositioning: parametri mancanti');
    return;
  }
  
  console.log('🚀 Avvio processo two-phase positioning...');
  
  // FASE 1: Posizionamento iniziale
  const initialPositioning = calculateInitialDropdownPosition(marker);
  applyDynamicDropdownPositioning(dropdown, initialPositioning);
  
  // FASE 2: Riposizionamento dinamico dopo render
  setTimeout(() => {
    console.log('⏰ Fase 2: Avvio riposizionamento dinamico...');
    
    const dynamicPositioning = calculateDynamicDropdownReposition(dropdown, initialPositioning);
    
    if (dynamicPositioning && dynamicPositioning.reposition) {
      console.log('🔄 Applicando correzione dimensioni reali...');
      applyDynamicDropdownPositioning(dropdown, dynamicPositioning);
      
      // Verifica finale dopo riposizionamento
      setTimeout(() => {
        const finalCompliance = verifyDropdownViewportCompliance(dropdown);
        console.log('✅ Verifica finale two-phase:', {
          compliant: finalCompliance.fullyVisible,
          result: finalCompliance.fullyVisible ? '🎉 SUCCESS' : '⚠️ NEEDS_REVIEW'
        });
        
        if (!finalCompliance.fullyVisible) {
          console.warn('⚠️ Dropdown ancora non compliant dopo two-phase, applicando emergency fix...');
          applyEmergencyDropdownFix(dropdown);
        }
      }, 50);
    } else {
      console.log('✅ Fase 2 completata: nessuna correzione necessaria');
    }
  }, 100); // Attendi che il DOM si stabilizzi
}

/**
 * Emergency fix per casi estremi
 */
function applyEmergencyDropdownFix(dropdown) {
  console.log('🚨 Applicando emergency fix...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const rect = dropdown.getBoundingClientRect();
  
  // Emergency clamping alle dimensioni viewport
  let newTop = Math.max(10, Math.min(rect.top, viewport.height - rect.height - 10));
  let newLeft = Math.max(10, Math.min(rect.left, viewport.width - rect.width - 10));
  
  // Se ancora troppo alto, riduci altezza
  if (rect.height > viewport.height - 40) {
    dropdown.style.maxHeight = `${viewport.height - 40}px`;
    dropdown.style.height = 'auto';
    
    const optionsContainer = dropdown.querySelector('.dropdown-options');
    if (optionsContainer) {
      optionsContainer.style.maxHeight = `${viewport.height - 100}px`;
    }
  }
  
  dropdown.style.top = `${newTop}px`;
  dropdown.style.left = `${newLeft}px`;
  
  console.log('🚨 Emergency fix applicato:', {
    newPosition: `${newTop}px, ${newLeft}px`,
    maxHeight: dropdown.style.maxHeight
  });
}

/**
 * Dimensioni conservative per fase 1
 */
function calculateConservativeDropdownSize(isMobile, isSmallMobile) {
  // Usa stime più conservative per ridurre rischio overflow
  const allianceCount = Math.max(1, Math.min(10, 
    (typeof alliances !== 'undefined') ? alliances.length : 3));
  
  let baseWidth, baseHeight;
  
  if (isSmallMobile) {
    baseWidth = 140;   // Più conservative
    baseHeight = 45;   
  } else if (isMobile) {
    baseWidth = 180;
    baseHeight = 55;
  } else {
    baseWidth = 220;
    baseHeight = 55;
  }
  
  const headerHeight = baseHeight;
  const optionHeight = isMobile ? 40 : 36;  // Più compatte
  const totalOptions = allianceCount + 1;
  const contentHeight = totalOptions * optionHeight;
  const padding = 12;
  
  let totalHeight = headerHeight + contentHeight + padding;
  
  // Limiti ancora più conservative
  const maxHeight = isSmallMobile ? 240 : (isMobile ? 280 : 320);
  totalHeight = Math.min(totalHeight, maxHeight);
  
  return {
    width: baseWidth,
    height: totalHeight,
    conservative: true
  };
}

/**
 * Funzioni di utilità (riutilizzate da V2)
 */
function isMarkerInViewport(markerRect, viewportWidth, viewportHeight) {
  return markerRect.top >= 0 && 
         markerRect.bottom <= viewportHeight &&
         markerRect.left >= 0 && 
         markerRect.right <= viewportWidth;
}

function verifyDropdownViewportCompliance(dropdown) {
  if (!dropdown) return { fullyVisible: false };
  
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
  
  return {
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
  };
}

// =====================================================================
// INTEGRAZIONE E OVERRIDE SISTEMA ESISTENTE
// =====================================================================

function patchWithTwoPhaseSystem() {
  console.log('🔧 Patching con sistema two-phase...');
  
  // Override funzioni principali
  window.calculateOptimalDropdownPosition = calculateInitialDropdownPosition;
  window.applyDropdownPositioning = applyTwoPhaseDropdownPositioning;
  
  // Esporta nuove funzioni
  window.calculateInitialDropdownPosition = calculateInitialDropdownPosition;
  window.calculateDynamicDropdownReposition = calculateDynamicDropdownReposition;
  window.applyTwoPhaseDropdownPositioning = applyTwoPhaseDropdownPositioning;
  window.verifyDropdownViewportCompliance = verifyDropdownViewportCompliance;
  
  console.log('✅ Sistema two-phase attivato');
}

// Observer per applicazione automatica
function setupTwoPhaseObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.classList && 
            node.classList.contains('marker-dropdown')) {
          
          console.log('🔍 Dropdown rilevato, applicando two-phase fix...');
          
          const marker = node.closest('.marker');
          if (marker) {
            applyTwoPhaseDropdownPositioning(node, marker);
            console.log('✅ Two-phase fix applicato automaticamente');
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('👀 Observer two-phase attivato');
}

// Funzioni di test
window.testTwoPhaseDropdown = function() {
  console.log('🧪 Test Two-Phase Dropdown System...');
  
  const marker = document.querySelector('.marker');
  if (!marker) {
    console.log('❌ Nessun marker trovato per test');
    return;
  }
  
  console.log('📍 Testando marker:', marker.title);
  marker.click();
  
  setTimeout(() => {
    const dropdown = document.querySelector('.marker-dropdown');
    if (dropdown) {
      console.log('✅ Test completato, verifica i log per dettagli two-phase');
    } else {
      console.log('❌ Dropdown non creato');
    }
  }, 1000);
};

window.forceApplyTwoPhaseFix = function() {
  console.log('🔧 Forzando two-phase fix su tutti i dropdown...');
  
  const dropdowns = document.querySelectorAll('.marker-dropdown');
  let fixedCount = 0;
  
  dropdowns.forEach((dropdown) => {
    const marker = dropdown.closest('.marker');
    if (marker) {
      applyTwoPhaseDropdownPositioning(dropdown, marker);
      fixedCount++;
    }
  });
  
  console.log(`✅ Two-phase fix applicato a ${fixedCount} dropdown`);
};

// Auto-inizializzazione
patchWithTwoPhaseSystem();
setupTwoPhaseObserver();

// Auto-fix dropdown esistenti
setTimeout(() => {
  const existingDropdowns = document.querySelectorAll('.marker-dropdown');
  if (existingDropdowns.length > 0) {
    console.log('🔧 Dropdown esistenti rilevati, applicando auto-fix two-phase...');
    window.forceApplyTwoPhaseFix();
  }
}, 1000);

console.log('✅ Dropdown Position Fix V3 (Two-Phase) caricato - Sistema dinamico attivo');