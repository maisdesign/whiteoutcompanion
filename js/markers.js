// =====================================================================
// MARKERS.JS - GESTIONE COMPLETA MARKER E VALIDAZIONE INTELLIGENTE
// =====================================================================
// Questo file gestisce tutto ciò che riguarda i marker sulla mappa:
// - Creazione e posizionamento visuale dei marker
// - Dropdown per assegnazione alleanze
// - Validazione intelligente per evitare conflitti di buff
// - Ottimizzazione esperienza utente su dispositivi touch
// 
// FILOSOFIA DEL DESIGN:
// Ogni marker rappresenta una facility del gioco Whiteout Survival.
// Il sistema previene assegnazioni subottimali educando l'utente
// sulle meccaniche di buff del gioco, trasformando errori in
// opportunità di apprendimento strategico.

console.log('🗺️ Caricamento sistema marker intelligente...');

// =====================================================================
// SEZIONE 1: CONFIGURAZIONE ICONE E COSTANTI
// =====================================================================
// Le icone facility rappresentano visualmente ogni tipo di struttura
// sulla mappa. Questo mapping è fondamentale per l'esperienza utente.

/**
 * Mapping delle icone per ogni tipo di facility nel gioco
 * Ogni icona è scelta per essere immediatamente riconoscibile
 * e coerente con la funzione della facility nel gioco
 */
const facilityIcons = {
  'Castle': '🏰',      // Il castello è il cuore della base
  'Construction': '🔨', // Velocità costruzione edifici
  'Production': '🏭',  // Produzione risorse
  'Defense': '🛡️',     // Difesa della base
  'Gathering': '⛏️',   // Raccolta risorse dalla mappa
  'Tech': '🔬',        // Ricerca e tecnologie
  'Weapons': '⚔️',     // Forza attacco truppe
  'Training': '🎯',    // Velocità addestramento
  'Expedition': '🚁',  // Velocità marcia truppe
  'Stronghold': '🏛️',  // Roccaforti territoriali
  'Fortress': '🏯'     // Fortezze strategiche
};

/**
 * Configurazione per ottimizzazione touch devices
 * Questi parametri migliorano l'esperienza su smartphone e tablet
 */
const TOUCH_CONFIG = {
  minMarkerSize: 16,           // Dimensione minima tocco confortevole
  scrollThreshold: 8,          // Numero massimo alleanze prima scroll
  dropdownMaxHeight: 320,      // Altezza massima dropdown touch
  momentumScrolling: true      // Abilita scroll fluido
};

// =====================================================================
// SEZIONE 2: UTILITÀ PER DISPOSITIVI TOUCH
// =====================================================================
// Queste funzioni rilevando le caratteristiche del dispositivo per
// ottimizzare automaticamente l'esperienza utente

/**
 * Rileva se stiamo operando su un dispositivo touch con potenziali
 * problemi di scrolling (tipicamente Android su schermi piccoli)
 * 
 * @returns {boolean} True se il dispositivo potrebbe avere problemi di scroll
 */
function isTouchDeviceWithScrollIssues() {
  return (
    'ontouchstart' in window &&
    /Android/i.test(navigator.userAgent) &&
    window.innerWidth < 768
  );
}

/**
 * Verifica se il browser supporta scrollbar personalizzate
 * Importante per sapere se possiamo applicare stili CSS avanzati
 * 
 * @returns {boolean} True se supporta scrollbar personalizzate
 */
function supportsCustomScrollbars() {
  const testElement = document.createElement('div');
  testElement.style.cssText = '-webkit-overflow-scrolling: touch';
  return testElement.style.webkitOverflowScrolling === 'touch';
}

/**
 * Applica ottimizzazioni specifiche per il dispositivo corrente
 * Questa funzione adatta l'interfaccia alle capacità del device
 */
function applyTouchOptimizations() {
  if (isTouchDeviceWithScrollIssues()) {
    console.log('📱 Applicando ottimizzazioni per dispositivo touch');
    
    // Aggiungi classe CSS per ottimizzazioni touch
    document.body.classList.add('touch-optimized');
    
    // Riduce animazioni per migliori performance
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
  }
}

// =====================================================================
// SEZIONE 3: SISTEMA DI VALIDAZIONE FACILITY DUPLICATE
// =====================================================================
// Questa è la sezione più importante del file: implementa la logica
// per prevenire assegnazioni di facility duplicate che sprecherebbero
// i buff nel gioco Whiteout Survival.

/**
 * Analizza se un'alleanza possiede già facility dello stesso tipo e livello
 * 
 * Questa funzione implementa una regola fondamentale di Whiteout Survival:
 * i buff non si sommano per facility identiche. È come avere più chiavi
 * identiche per la stessa porta: solo una serve, le altre sono inutili.
 * 
 * @param {string} allianceName - Nome dell'alleanza da analizzare
 * @param {string} facilityType - Tipo facility (es: "Construction")  
 * @param {string} facilityLevel - Livello facility (es: "Lv.1")
 * @param {Object} excludeFacility - Facility da escludere (per editing)
 * @returns {Object} Dettagli completi sulla situazione duplicate
 */
function analyzeAllianceFacilityDuplicates(allianceName, facilityType, facilityLevel, excludeFacility = null) {
  // Prima, raccogliamo tutte le facility già controllate da questa alleanza
  const allianceFacilities = facilityData.filter(facility => {
    // Escludiamo la facility che stiamo modificando (utile durante editing)
    if (excludeFacility && facility === excludeFacility) {
      return false;
    }
    
    return facility.Alliance === allianceName;
  });
  
  // Ora cerchiamo facility che abbiano esattamente lo stesso tipo e livello
  // Queste sono le "duplicate" che causano spreco di buff
  const exactDuplicates = allianceFacilities.filter(facility => 
    facility.Type === facilityType && facility.Level === facilityLevel
  );
  
  // Calcoliamo statistiche utili per feedback intelligente
  const facilityTypeGroups = {};
  allianceFacilities.forEach(facility => {
    const key = `${facility.Type}|${facility.Level}`;
    if (!facilityTypeGroups[key]) {
      facilityTypeGroups[key] = [];
    }
    facilityTypeGroups[key].push(facility);
  });
  
  return {
    hasDuplicate: exactDuplicates.length > 0,
    duplicateCount: exactDuplicates.length,
    existingDuplicates: exactDuplicates,
    allAllianceFacilities: allianceFacilities,
    facilityTypeDistribution: facilityTypeGroups,
    totalAllianceFacilities: allianceFacilities.length
  };
}

/**
 * Genera suggerimenti intelligenti per ottimizzare le assegnazioni
 * 
 * Invece di dire solo "questo è sbagliato", aiutiamo l'utente trovando
 * alternative migliori che massimizzano i buff disponibili.
 * 
 * @param {string} allianceName - Nome dell'alleanza
 * @param {string} currentType - Tipo facility che si sta assegnando
 * @param {string} currentLevel - Livello facility che si sta assegnando
 * @returns {Array} Lista di facility alternative consigliate
 */
function generateOptimalFacilitySuggestions(allianceName, currentType, currentLevel) {
  // Trova tutte le facility non ancora assegnate
  const availableFacilities = facilityData.filter(facility => !facility.Alliance);
  
  // Trova facility già controllate da questa alleanza per evitare duplicati
  const allianceAnalysis = analyzeAllianceFacilityDuplicates(allianceName, currentType, currentLevel);
  const existingTypes = new Set(
    Object.keys(allianceAnalysis.facilityTypeDistribution)
  );
  
  // Cerca facility disponibili che non creerebbero duplicati
  const optimalAlternatives = availableFacilities.filter(facility => {
    const facilityKey = `${facility.Type}|${facility.Level}`;
    const currentKey = `${currentType}|${currentLevel}`;
    
    // Esclude la facility identica a quella che stiamo assegnando
    if (facilityKey === currentKey) {
      return false;
    }
    
    // Esclude facility che creerebbero altri duplicati
    return !existingTypes.has(facilityKey);
  });
  
  // Ordina per valore del buff (se conosciuto) per suggerire le migliori
  optimalAlternatives.sort((a, b) => {
    const buffA = buffValues[`${a.Type}|${a.Level}`] || '0%';
    const buffB = buffValues[`${b.Type}|${b.Level}`] || '0%';
    
    // Estrae il numero dal valore percentuale per ordinamento
    const numA = parseInt(buffA.match(/\d+/)?.[0] || '0');
    const numB = parseInt(buffB.match(/\d+/)?.[0] || '0');
    
    return numB - numA; // Ordine decrescente (migliori per primi)
  });
  
  return optimalAlternatives.slice(0, 5); // Restituisce le 5 migliori alternative
}

/**
 * Costruisce e mostra l'alert educativo per facility duplicate
 * 
 * Questo non è un semplice warning, ma un vero sistema educativo che:
 * 1. Spiega il problema nel contesto del gioco
 * 2. Mostra calcoli concreti dei buff
 * 3. Suggerisce alternative migliori
 * 4. Rispetta la scelta finale dell'utente
 * 
 * @param {string} allianceName - Nome dell'alleanza
 * @param {string} facilityType - Tipo facility
 * @param {string} facilityLevel - Livello facility  
 * @param {Object} analysis - Risultato dell'analisi duplicati
 * @returns {boolean} True se l'utente conferma l'assegnazione
 */
function displayEducationalDuplicateAlert(allianceName, facilityType, facilityLevel, analysis) {
  const t = translations[currentLanguage] || translations['en'];
  
  // Calcola i numeri concreti per l'educazione dell'utente
  const buffKey = `${facilityType}|${facilityLevel}`;
  const singleBuffValue = buffValues[buffKey] || t.unknownBuff || 'Buff sconosciuto';
  const totalDuplicatesAfterAssignment = analysis.duplicateCount + 1;
  
  // Genera suggerimenti alternativi intelligenti
  const alternatives = generateOptimalFacilitySuggestions(allianceName, facilityType, facilityLevel);
  const alternativesText = alternatives.length > 0 
    ? alternatives.slice(0, 3).map(facility => {
        const altBuffKey = `${facility.Type}|${facility.Level}`;
        const altBuffValue = buffValues[altBuffKey] || t.unknownBuff || 'Buff sconosciuto';
        return `• ${facility.Type} ${facility.Level} (${altBuffValue})`;
      }).join('\n')
    : `• ${t.noAlternativesAvailable || 'Nessuna alternativa disponibile al momento'}`;
  
  // Costruisce il messaggio educativo completo
  const educationalMessage = `
🚫 ${t.duplicateFacilityWarning || 'ATTENZIONE: Buff Duplicato Rilevato!'}

📋 ${t.situation || 'Situazione'}:
• ${t.alliance || 'Alleanza'}: "${allianceName}"
• ${t.facility || 'Facility'}: ${facilityType} ${facilityLevel}
• ${t.alreadyPresent || 'Già presenti'}: ${analysis.duplicateCount}

⚠️ ${t.gameplayProblem || 'PROBLEMA DEL GAMEPLAY'}:
${t.duplicateFacilityExplanation || 'In Whiteout Survival i buff NON si sommano per facility identiche!'}

🔢 ${t.buffCalculation || 'Calcolo Buff'}:
• ${t.theoreticalBuff || 'Buff teorico'}: ${singleBuffValue} × ${totalDuplicatesAfterAssignment} = ?
• ${t.actualBuff || 'Buff REALE'}: ${singleBuffValue} × 1 = ${singleBuffValue}
• ${t.wastedBuffs || 'Buff sprecati'}: ${totalDuplicatesAfterAssignment - 1}

💡 ${t.betterStrategy || 'STRATEGIA MIGLIORE'}:
${t.diversifyFacilities || 'Diversifica i tipi di facility per massimizzare i buff!'}

🤔 ${t.moreEffectiveAlternatives || 'Alternative più efficaci'}:
${alternativesText}

❓ ${t.continueAnyway || 'Vuoi continuare comunque con questa assegnazione?'}
${t.notRecommended || '(Non raccomandata per ottimizzazione strategica)'}
  `.trim();
  
  // Mostra l'alert e cattura la decisione dell'utente
  const userDecision = confirm(educationalMessage);
  
  // Log per analytics e debug
  console.log('🎓 Alert educativo mostrato:', {
    alliance: allianceName,
    facility: `${facilityType} ${facilityLevel}`,
    duplicatesFound: analysis.duplicateCount,
    userConfirmed: userDecision,
    alternativesOffered: alternatives.length
  });
  
  return userDecision;
}

// =====================================================================
// SEZIONE 4: CREAZIONE E GESTIONE MARKER
// =====================================================================
// Questa sezione gestisce la creazione visuale dei marker sulla mappa
// e la loro sincronizzazione con i dati delle facility

/**
 * Crea un marker visuale per una facility sulla mappa
 * 
 * Ogni marker è un elemento DOM posizionato precisamente sulla mappa
 * che rappresenta una facility del gioco. Include icona del tipo,
 * colori ufficiali del gioco, e gestione eventi per interazione.
 * 
 * @param {Object} facility - Dati della facility
 * @param {number} index - Indice della facility nell'array
 * @returns {HTMLElement|null} Elemento DOM del marker creato
 */
function createInteractiveFacilityMarker(facility, index) {
  const mapWrapper = document.getElementById('map-wrapper');
  if (!mapWrapper) {
    console.warn('⚠️ Map wrapper non trovato, impossibile creare marker');
    return null;
  }

  // Rimuovi marker esistente se presente (per aggiornamenti)
  if (facility.marker) {
    facility.marker.remove();
  }

  // Crea l'elemento marker
  const marker = document.createElement('div');
  marker.className = `marker ${facility.Type.toLowerCase()}`;
  
  // Applica calibrazione per posizionamento preciso
  const adjustedPosition = applyMapCalibration(facility);
  marker.style.left = `calc(${adjustedPosition.x}% - 6px)`;
  marker.style.top = `calc(${adjustedPosition.y}% - 6px)`;
  
  // Configura tooltip informativo
  const coordinatesText = facility.ingameCoords ? ` (${facility.ingameCoords})` : '';
  marker.title = `${facility.Type} ${facility.Level}${coordinatesText}`;
  
  // Configura evento click per apertura dropdown
  marker.onclick = (event) => {
    event.stopPropagation(); // Previene chiusura accidentale
    displayFacilityAssignmentDropdown(facility, marker, index);
  };
  
  // Aggiungi icona rappresentativa della facility
  const facilityIcon = document.createElement('span');
  facilityIcon.className = 'facility-icon';
  facilityIcon.textContent = facilityIcons[facility.Type] || '📍';
  marker.appendChild(facilityIcon);
  
  // Inserisci nella mappa
  mapWrapper.appendChild(marker);
  facility.marker = marker;

  // Se già assegnata, mostra icona alleanza e stile
  if (facility.Alliance) {
    renderAllianceIconOnMarker(facility);
    marker.classList.add('assigned');
  }
  
  return marker;
}

/**
 * Applica le impostazioni di calibrazione alla posizione del marker
 * La calibrazione permette di aggiustare la posizione dei marker
 * per allinearli perfettamente con la mappa di gioco
 * 
 * @param {Object} facility - Dati facility con coordinate
 * @returns {Object} Coordinate calibrate {x, y}
 */
function applyMapCalibration(facility) {
  // Applica trasformazioni di calibrazione se disponibili
  const adjustedX = (facility.x * calibrationSettings.scaleX) + calibrationSettings.offsetX;
  const adjustedY = (facility.y * calibrationSettings.scaleY) + calibrationSettings.offsetY;
  
  return { x: adjustedX, y: adjustedY };
}

/**
 * Ricrea tutti i marker sulla mappa
 * Utile dopo cambiamenti di calibrazione o aggiornamenti di massa
 */
function recreateAllMapMarkers() {
  console.log('🔄 Ricreazione completa marker...');
  
  // Rimuovi tutti i marker esistenti
  document.querySelectorAll('.marker').forEach(marker => marker.remove());
  
  // Reset riferimenti nei dati
  facilityData.forEach(facility => {
    facility.marker = null;
  });
  
  // Ricrea tutti i marker
  let successfullyCreated = 0;
  facilityData.forEach((facility, index) => {
    const marker = createInteractiveFacilityMarker(facility, index);
    if (marker) successfullyCreated++;
  });
  
  const t = translations[currentLanguage] || {};
  const statusMessage = `📍 ${successfullyCreated} ${t.markersUpdated || 'marker aggiornati'}`;
  
  // Usa showStatus in modo sicuro
  if (typeof showStatus === 'function') {
    showStatus(statusMessage, 'info');
  } else {
    console.log(statusMessage);
  }
  
  console.log(`✅ Ricreazione completata: ${successfullyCreated}/${facilityData.length} marker`);
}

// =====================================================================
// SEZIONE 5: SISTEMA DROPDOWN PER ASSEGNAZIONI
// =====================================================================
// I dropdown permettono agli utenti di assegnare facility alle alleanze
// con un'interfaccia intuitiva e ottimizzata per tutti i dispositivi

/**
 * Mostra il dropdown per assegnare una facility a un'alleanza
 * 
 * Il dropdown è un'interfaccia contestuale che appare accanto al marker
 * cliccato, mostrando tutte le alleanze disponibili e opzioni di gestione.
 * Include ottimizzazioni per dispositivi touch e gestione intelligente
 * dello spazio disponibile.
 * 
 * @param {Object} facility - Dati della facility
 * @param {HTMLElement} marker - Elemento DOM del marker 
 * @param {number} index - Indice della facility
 */
function displayFacilityAssignmentDropdown(facility, marker, index) {
  const t = translations[currentLanguage] || translations['en'];
  
  // Verifica che ci siano alleanze disponibili
  if (alliances.length === 0) {
    const message = t.addAtLeastOneAlliance || '⚠️ Aggiungi almeno un\'alleanza prima di assegnare.';
    if (typeof showStatus === 'function') {
      showStatus(message, 'error');
    } else {
      alert(message);
    }
    return;
  }

  // Chiudi eventuali dropdown aperti
  closeAllAssignmentDropdowns();

  // Crea il container principale del dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'marker-dropdown';
  
  // Calcola posizionamento intelligente (sopra o sotto il marker)
  const optimalPosition = calculateOptimalDropdownPosition(marker);
  if (optimalPosition.showAbove) {
    dropdown.classList.add('dropdown-above');
  }
  
  // Crea header informativo (sempre visibile)
  const header = createDropdownHeader(facility, alliances.length + 1, t);
  dropdown.appendChild(header);
  
  // Crea container scrollabile per le opzioni
  const optionsContainer = createDropdownOptionsContainer(facility, t);
  dropdown.appendChild(optionsContainer);
  
  // Configura gestione scroll avanzata se necessario
  if (alliances.length > TOUCH_CONFIG.scrollThreshold) {
    setupAdvancedScrollHandling(dropdown, optionsContainer, alliances.length, t);
  }
  
  // Attacca il dropdown al marker
  marker.appendChild(dropdown);
  
  // Configura auto-chiusura e gestione eventi
  setupDropdownEventHandlers(dropdown);
  
  // Configura accessibilità keyboard
  setupDropdownKeyboardNavigation(optionsContainer);
  
  console.log('📋 Dropdown aperto per:', facility.Type, facility.Level);
}

/**
 * Calcola il posizionamento ottimale per il dropdown considerando
 * TUTTI gli aspetti: verticale (sopra/sotto) + orizzontale (sinistra/destra) + mobile
 * 
 * @param {HTMLElement} marker - Elemento marker di riferimento
 * @returns {Object} Informazioni complete sul posizionamento ottimale
 */
function calculateOptimalDropdownPosition(marker) {
  const mapWrapper = document.getElementById('map-wrapper');
  const markerRect = marker.getBoundingClientRect();
  const mapRect = mapWrapper.getBoundingClientRect();
  
  // ===================================================================
  // 1. CALCOLO POSIZIONAMENTO VERTICALE (LA TUA LOGICA ESISTENTE)
  // ===================================================================
  
  const markerTopRelative = markerRect.top - mapRect.top;
  const mapHeight = mapRect.height;
  
  // Se il marker è nella parte bassa della mappa, mostra dropdown sopra
  const showAbove = markerTopRelative > mapHeight * 0.6;
  const availableSpaceVertical = showAbove ? markerTopRelative : (mapHeight - markerTopRelative);
  
  // ===================================================================
  // 2. CALCOLO POSIZIONAMENTO ORIZZONTALE (NUOVA LOGICA)
  // ===================================================================
  
  const markerLeftRelative = markerRect.left - mapRect.left;
  const markerCenterRelative = markerLeftRelative + (markerRect.width / 2);
  const mapWidth = mapRect.width;
  
  // Calcola percentuale posizione orizzontale del marker
  const horizontalPosition = (markerCenterRelative / mapWidth) * 100;
  
  let horizontalAlignment = 'center'; // default
  let availableSpaceHorizontal = {
    left: markerLeftRelative,
    right: mapWidth - (markerLeftRelative + markerRect.width),
    center: Math.min(markerLeftRelative, mapWidth - (markerLeftRelative + markerRect.width))
  };
  
  // ===================================================================
  // 3. DECISIONI INTELLIGENTI BASATE SU DISPOSITIVO
  // ===================================================================
  
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;
  
  // Dimensioni stimate del dropdown (basate sui breakpoint CSS)
  let estimatedDropdownWidth;
  if (isSmallMobile) {
    estimatedDropdownWidth = 170; // Media tra 140-200px
  } else if (isMobile) {
    estimatedDropdownWidth = 200; // Media tra 160-240px  
  } else {
    estimatedDropdownWidth = 240; // Media tra 200-280px
  }
  
  // Margine di sicurezza
  const safetyMargin = isMobile ? 20 : 10;
  const requiredSpace = (estimatedDropdownWidth / 2) + safetyMargin;
  
  // ===================================================================
  // 4. LOGICA POSIZIONAMENTO ORIZZONTALE INTELLIGENTE
  // ===================================================================
  
  if (horizontalPosition < 15) {
    // Marker molto a sinistra - allinea dropdown a sinistra
    horizontalAlignment = 'left';
  } else if (horizontalPosition > 85) {
    // Marker molto a destra - allinea dropdown a destra  
    horizontalAlignment = 'right';
  } else if (availableSpaceHorizontal.left < requiredSpace) {
    // Poco spazio a sinistra - allinea a sinistra
    horizontalAlignment = 'left';
  } else if (availableSpaceHorizontal.right < requiredSpace) {
    // Poco spazio a destra - allinea a destra
    horizontalAlignment = 'right';
  } else {
    // Spazio sufficiente da entrambi i lati - mantieni centrato
    horizontalAlignment = 'center';
  }
  
  // ===================================================================
  // 5. CALCOLO ALTEZZA MASSIMA DINAMICA
  // ===================================================================
  
  let maxHeight;
  
  if (isMobile) {
    // Su mobile, considera anche l'orientamento
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
      // In landscape mobile, spazio limitato verticalmente
      maxHeight = Math.min(250, availableSpaceVertical - 20);
    } else {
      // In portrait mobile, più spazio verticale disponibile
      maxHeight = Math.min(
        isSmallMobile ? 280 : 350, 
        availableSpaceVertical - 30
      );
    }
  } else {
    // Desktop - usa spazio disponibile con generoso buffer
    maxHeight = Math.min(400, availableSpaceVertical - 40);
  }
  
  // ===================================================================
  // 6. ADJUSTMENTS PER NOTCH E SAFE AREAS (iPhone X+)
  // ===================================================================
  
  let safeAreaAdjustments = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  
  if (isMobile && CSS.supports('padding', 'env(safe-area-inset-top)')) {
    // Stima safe area (valori tipici iPhone X+)
    const estimatedNotchHeight = 44; // iPhone notch tipico
    const estimatedHomeIndicator = 34; // iPhone home indicator
    
    if (showAbove) {
      safeAreaAdjustments.top = estimatedNotchHeight;
    } else {
      safeAreaAdjustments.bottom = estimatedHomeIndicator;
    }
    
    safeAreaAdjustments.left = 10; // Bordi curvi laterali
    safeAreaAdjustments.right = 10;
  }
  
  // ===================================================================
  // 7. RISULTATO FINALE COMPRENSIVO
  // ===================================================================
  
  const result = {
    // Posizionamento verticale (la tua logica esistente)
    showAbove: showAbove,
    availableSpace: availableSpaceVertical,
    
    // Nuovo: Posizionamento orizzontale
    horizontalAlignment: horizontalAlignment,
    horizontalPosition: horizontalPosition,
    availableSpaceHorizontal: availableSpaceHorizontal,
    
    // Nuovo: Ottimizzazioni dispositivo
    isMobile: isMobile,
    isSmallMobile: isSmallMobile,
    isLandscape: window.innerWidth > window.innerHeight,
    
    // Nuovo: Dimensioni calcolate
    estimatedDropdownWidth: estimatedDropdownWidth,
    maxHeight: maxHeight,
    
    // Nuovo: Safe area adjustments
    safeAreaAdjustments: safeAreaAdjustments,
    
    // Nuovo: CSS classes da applicare
    cssClasses: {
      vertical: showAbove ? 'dropdown-above' : 'dropdown-below',
      horizontal: `dropdown-align-${horizontalAlignment}`,
      device: isMobile ? (isSmallMobile ? 'dropdown-small-mobile' : 'dropdown-mobile') : 'dropdown-desktop',
      orientation: window.innerWidth > window.innerHeight ? 'dropdown-landscape' : 'dropdown-portrait'
    },
    
    // Debug info (utile per troubleshooting)
    debug: {
      markerPosition: {
        x: horizontalPosition.toFixed(1) + '%',
        y: ((markerTopRelative / mapHeight) * 100).toFixed(1) + '%'
      },
      spacesAvailable: {
        top: markerTopRelative,
        bottom: mapHeight - markerTopRelative,
        left: availableSpaceHorizontal.left,
        right: availableSpaceHorizontal.right
      },
      dropdownWillFit: {
        vertically: availableSpaceVertical >= maxHeight,
        horizontally: availableSpaceHorizontal[horizontalAlignment] >= (estimatedDropdownWidth / 2)
      }
    }
  };
  
  console.log('📍 Calcolo posizione dropdown:', {
    marker: marker.title || 'Unknown',
    position: result.debug.markerPosition,
    vertical: showAbove ? 'sopra' : 'sotto',
    horizontal: horizontalAlignment,
    device: result.cssClasses.device
  });
  
  return result;
}

/**
 * Applica il posizionamento calcolato al dropdown
 * Questa funzione utilizza il risultato di calculateOptimalDropdownPosition
 * 
 * @param {HTMLElement} dropdown - Elemento dropdown da posizionare
 * @param {Object} positioning - Risultato di calculateOptimalDropdownPosition
 */
function applyDropdownPositioning(dropdown, positioning) {
  if (!dropdown || !positioning) return;
  
  // ===================================================================
  // 1. APPLICA CLASSI CSS
  // ===================================================================
  
  // Rimuovi classi precedenti
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
  // 2. APPLICA STILI INLINE PER OTTIMIZZAZIONI SPECIFICHE
  // ===================================================================
  
  // Altezza massima dinamica
  dropdown.style.maxHeight = `${positioning.maxHeight}px`;
  
  // Larghezza su mobile
  if (positioning.isMobile) {
    dropdown.style.maxWidth = `${positioning.estimatedDropdownWidth}px`;
    
    // Safe area adjustments
    if (positioning.safeAreaAdjustments.left > 0) {
      dropdown.style.marginLeft = `${positioning.safeAreaAdjustments.left}px`;
    }
    if (positioning.safeAreaAdjustments.right > 0) {
      dropdown.style.marginRight = `${positioning.safeAreaAdjustments.right}px`;
    }
  }
  
  // ===================================================================
  // 3. POSIZIONAMENTO PRECISION ADJUSTMENTS
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
    // center - mantieni il comportamento di default del CSS
    dropdown.style.left = '50%';
    dropdown.style.right = 'auto';
    dropdown.style.transform = 'translateX(-50%)';
  }
  
  // ===================================================================
  // 4. AGGIORNAMENTO CONTAINER OPZIONI SE NECESSARIO
  // ===================================================================
  
  const optionsContainer = dropdown.querySelector('.dropdown-options');
  if (optionsContainer && positioning.isMobile) {
    // Altezza massima per il container scrollabile
    const headerHeight = 60; // Stima altezza header
    const maxOptionsHeight = positioning.maxHeight - headerHeight;
    optionsContainer.style.maxHeight = `${maxOptionsHeight}px`;
    
    // Ottimizzazioni scroll per dispositivo
    if (positioning.isSmallMobile) {
      optionsContainer.style.overflowY = 'auto';
      optionsContainer.style.webkitOverflowScrolling = 'touch';
    }
  }
  
  console.log('✅ Posizionamento dropdown applicato:', positioning.cssClasses);
}

/**
 * Funzione helper per debug del posizionamento
 * Utile durante lo sviluppo per verificare i calcoli
 * 
 * @param {HTMLElement} marker - Marker da analizzare
 */
function debugDropdownPositioning(marker) {
  const positioning = calculateOptimalDropdownPosition(marker);
  
  console.log('🔍 === DEBUG POSIZIONAMENTO DROPDOWN ===');
  console.log('Marker:', marker.title || marker.className);
  console.log('Posizione:', positioning.debug.markerPosition);
  console.log('Spazi disponibili:', positioning.debug.spacesAvailable);
  console.log('Dropdown fit check:', positioning.debug.dropdownWillFit);
  console.log('Decisioni:', {
    vertical: positioning.showAbove ? 'SOPRA' : 'SOTTO',
    horizontal: positioning.horizontalAlignment.toUpperCase(),
    device: positioning.cssClasses.device
  });
  console.log('Classi CSS:', positioning.cssClasses);
  console.log('===========================================');
  
  return positioning;
}

// Esporta le funzioni per uso globale
window.calculateOptimalDropdownPosition = calculateOptimalDropdownPosition;
window.applyDropdownPositioning = applyDropdownPositioning;
window.debugDropdownPositioning = debugDropdownPositioning;

/**
 * Crea l'header informativo del dropdown
 * Mostra dettagli facility e numero opzioni disponibili
 * 
 * @param {Object} facility - Dati facility
 * @param {number} totalOptions - Numero totale opzioni
 * @param {Object} t - Traduzioni correnti
 * @returns {HTMLElement} Elemento header creato
 */
function createDropdownHeader(facility, totalOptions, t) {
  const header = document.createElement('div');
  header.className = 'dropdown-header';
  
  const coordinatesText = facility.ingameCoords ? ` - ${facility.ingameCoords}` : '';
  const optionsText = t.options || 'opzioni';
  
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${facility.Type} ${facility.Level}${coordinatesText}</span>
      <span style="font-size: 11px; opacity: 0.8;">${totalOptions} ${optionsText}</span>
    </div>
  `;
  
  return header;
}

/**
 * Crea il container delle opzioni con tutte le alleanze disponibili
 * Include opzione per rimuovere assegnazione e lista alleanze
 * 
 * @param {Object} facility - Dati facility
 * @param {Object} t - Traduzioni correnti  
 * @returns {HTMLElement} Container opzioni creato
 */
function createDropdownOptionsContainer(facility, t) {
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'dropdown-options';
  
  // Applica ottimizzazioni touch se necessario
  if (isTouchDeviceWithScrollIssues()) {
    optionsContainer.style.cssText += `
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      overscroll-behavior: contain;
      touch-action: pan-y;
    `;
  }
  
  // Aggiunge opzione "rimuovi assegnazione"
  const unassignOption = createUnassignOption(facility, t);
  optionsContainer.appendChild(unassignOption);
  
  // Aggiunge separatore se ci sono alleanze
  if (alliances.length > 0) {
    const separator = createOptionsSeparator();
    optionsContainer.appendChild(separator);
  }
  
  // Aggiunge opzione per ogni alleanza
  alliances.forEach((alliance, index) => {
    const allianceOption = createAllianceOption(facility, alliance, t);
    optionsContainer.appendChild(allianceOption);
  });
  
  return optionsContainer;
}

/**
 * Crea l'opzione per rimuovere l'assegnazione corrente
 * 
 * @param {Object} facility - Dati facility
 * @param {Object} t - Traduzioni correnti
 * @returns {HTMLElement} Opzione unassign creata
 */
function createUnassignOption(facility, t) {
  const unassignOption = document.createElement('div');
  unassignOption.className = 'dropdown-option unassign';
  
  // Evidenzia se attualmente non assegnata
  if (!facility.Alliance) {
    unassignOption.classList.add('selected');
  }
  
  unassignOption.innerHTML = `
    <span style="font-size: 16px;">❌</span>
    <span>${t.unassigned || 'Non assegnata'}</span>
  `;
  
  unassignOption.onclick = (event) => {
    event.stopPropagation();
    assignFacilityToAllianceWithValidation(facility, facility.marker, null);
    closeAllAssignmentDropdowns();
  };
  
  return unassignOption;
}

/**
 * Crea un separatore visuale tra sezioni del dropdown
 * 
 * @returns {HTMLElement} Elemento separatore
 */
function createOptionsSeparator() {
  const separator = document.createElement('div');
  separator.style.cssText = `
    height: 1px;
    background: rgba(79, 172, 254, 0.3);
    margin: 5px 0;
  `;
  return separator;
}

/**
 * Crea un'opzione per una specifica alleanza
 * Include icona, nome, e statistiche assegnazioni
 * 
 * @param {Object} facility - Dati facility
 * @param {Object} alliance - Dati alleanza
 * @param {Object} t - Traduzioni correnti
 * @returns {HTMLElement} Opzione alleanza creata
 */
function createAllianceOption(facility, alliance, t) {
  const option = document.createElement('div');
  option.className = 'dropdown-option';
  
  // Evidenzia se attualmente assegnata a questa alleanza
  if (facility.Alliance === alliance.name) {
    option.classList.add('selected');
  }
  
  // Calcola statistiche assegnazioni correnti
  const currentAssignments = facilityData.filter(f => f.Alliance === alliance.name).length;
  const structuresText = t.structures || 'strutture';
  
  option.innerHTML = `
    <img src="${alliance.icon}" alt="${alliance.name}" class="alliance-icon-small">
    <div style="flex: 1; display: flex; flex-direction: column;">
      <span style="font-weight: 500;">${alliance.name}</span>
      <span style="font-size: 11px; opacity: 0.7;">${currentAssignments} ${structuresText}</span>
    </div>
  `;
  
  // Configura evento click con validazione
  option.onclick = (event) => {
    event.stopPropagation();
    assignFacilityToAllianceWithValidation(facility, facility.marker, alliance.name);
    closeAllAssignmentDropdowns();
  };
  
  return option;
}

/**
 * Configura gestione scroll avanzata per dropdown con molte opzioni
 * Include indicatori visivi e ottimizzazioni touch
 * 
 * @param {HTMLElement} dropdown - Container principale dropdown
 * @param {HTMLElement} optionsContainer - Container opzioni scrollabile
 * @param {number} totalAlliances - Numero totale alleanze
 * @param {Object} t - Traduzioni correnti
 */
function setupAdvancedScrollHandling(dropdown, optionsContainer, totalAlliances, t) {
  const isTouch = isTouchDeviceWithScrollIssues();
  
  // Crea indicatore scroll se necessario
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'dropdown-scroll-indicator';
  scrollIndicator.innerHTML = isTouch ? '⬇️ Scorri' : '⬇️';
  scrollIndicator.title = t.scrollToSeeAll || 'Scrolla per vedere tutte le alleanze';
  
  // Stile ottimizzato per touch
  if (isTouch) {
    scrollIndicator.style.cssText += `
      font-size: 10px;
      padding: 4px 8px;
      background: rgba(79, 172, 254, 0.8);
      border-radius: 12px;
      color: white;
      bottom: 4px;
      right: 4px;
      z-index: 1000;
    `;
  }
  
  dropdown.appendChild(scrollIndicator);
  
  // Gestione dinamica dell'indicatore
  let scrollTimeout;
  optionsContainer.addEventListener('scroll', () => {
    const isAtBottom = optionsContainer.scrollTop + optionsContainer.clientHeight >= 
                      optionsContainer.scrollHeight - 10;
    
    // Mostra/nascondi indicatore
    scrollIndicator.style.display = isAtBottom ? 'none' : 'block';
    
    // Feedback visivo durante scroll
    optionsContainer.classList.add('scrolling');
    
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      optionsContainer.classList.remove('scrolling');
    }, 200);
  });
  
  // Ottimizzazioni specifiche per touch
  if (isTouch) {
    setupTouchScrollOptimizations(optionsContainer);
  }
}

/**
 * Configura ottimizzazioni specifiche per scroll touch
 * Migliora l'esperienza su dispositivi mobili
 * 
 * @param {HTMLElement} optionsContainer - Container da ottimizzare
 */
function setupTouchScrollOptimizations(optionsContainer) {
  optionsContainer.addEventListener('touchstart', (event) => {
    optionsContainer.classList.add('touch-active');
    event.stopPropagation();
  }, { passive: false });
  
  optionsContainer.addEventListener('touchend', () => {
    setTimeout(() => {
      optionsContainer.classList.remove('touch-active');
    }, 150);
  });
  
  optionsContainer.addEventListener('touchmove', (event) => {
    event.stopPropagation();
  }, { passive: true });
}

/**
 * Configura gli event handler per gestione dropdown
 * Include auto-chiusura e click fuori area
 * 
 * @param {HTMLElement} dropdown - Dropdown da configurare
 */
function setupDropdownEventHandlers(dropdown) {
  // Auto-chiusura dopo timeout (più tempo per touch)
  const autoCloseTime = isTouchDeviceWithScrollIssues() ? 15000 : 12000;
  
  setTimeout(() => {
    if (dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }, autoCloseTime);
  
  // Gestione click fuori dropdown
  setTimeout(() => {
    const handleOutsideClick = (event) => {
      if (!dropdown.contains(event.target) && dropdown.parentNode) {
        dropdown.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => dropdown.remove(), 300);
      }
    };
    
    document.addEventListener('click', handleOutsideClick, { once: true });
    document.addEventListener('touchstart', handleOutsideClick, { once: true });
  }, 100);
}

/**
 * Configura navigazione da tastiera per accessibilità
 * Permette di usare frecce e Enter per navigare
 * 
 * @param {HTMLElement} optionsContainer - Container da rendere accessibile
 */
function setupDropdownKeyboardNavigation(optionsContainer) {
  optionsContainer.tabIndex = 0;
  optionsContainer.focus();
  
  optionsContainer.addEventListener('keydown', (event) => {
    const options = optionsContainer.querySelectorAll('.dropdown-option');
    let currentIndex = Array.from(options).findIndex(opt => opt.classList.contains('keyboard-focus'));
    
    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) {
          options[currentIndex]?.classList.remove('keyboard-focus');
          options[currentIndex + 1]?.classList.add('keyboard-focus');
          options[currentIndex + 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex]?.classList.remove('keyboard-focus');
          options[currentIndex - 1]?.classList.add('keyboard-focus');
          options[currentIndex - 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        options[currentIndex]?.click();
        break;
        
      case 'Escape':
        closeAllAssignmentDropdowns();
        break;
    }
  });
  
  // Evidenzia prima opzione per navigazione keyboard
  const firstOption = optionsContainer.querySelector('.dropdown-option:not(.unassign)');
  if (firstOption) {
    firstOption.classList.add('keyboard-focus');
  }
}

/**
 * Chiude tutti i dropdown aperti sulla mappa
 * Utile per prevenire dropdown multipli aperti simultaneamente
 */
function closeAllAssignmentDropdowns() {
  document.querySelectorAll('.marker-dropdown').forEach(dropdown => {
    dropdown.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => {
      if (dropdown.parentNode) {
        dropdown.remove();
      }
    }, 200);
  });
}

// =====================================================================
// SEZIONE 6: ASSEGNAZIONE FACILITY CON VALIDAZIONE INTELLIGENTE
// =====================================================================
// Questa è la funzione principale che gestisce l'assegnazione delle
// facility alle alleanze, includendo tutta la logica di validazione

/**
 * Assegna una facility a un'alleanza con validazione completa
 * 
 * Questa è la funzione centrale che orchestra tutto il processo:
 * 1. Valida per prevenire conflitti di buff
 * 2. Educa l'utente sui problemi rilevati
 * 3. Rispetta la decisione finale dell'utente
 * 4. Aggiorna tutti i sistemi correlati
 * 
 * @param {Object} facility - Dati della facility da assegnare
 * @param {HTMLElement} marker - Elemento visuale del marker
 * @param {string|null} allianceName - Nome alleanza (null per rimuovere)
 */
function assignFacilityToAllianceWithValidation(facility, marker, allianceName) {
  console.log('🔄 Processo assegnazione facility:', {
    facility: `${facility.Type} ${facility.Level}`,
    from: facility.Alliance || 'Non assegnata',
    to: allianceName || 'RIMOZIONE',
    coordinates: facility.ingameCoords
  });
  
  const t = translations[currentLanguage] || translations['en'];
  const previousAlliance = facility.Alliance;
  
  // VALIDAZIONE CRITICAL PATH: Controlla facility duplicate solo per nuove assegnazioni
  if (allianceName) {
    const duplicateAnalysis = analyzeAllianceFacilityDuplicates(
      allianceName, 
      facility.Type, 
      facility.Level, 
      facility
    );
    
    if (duplicateAnalysis.hasDuplicate) {
      console.log('⚠️ Conflitto buff rilevato:', {
        alliance: allianceName,
        facility: `${facility.Type} ${facility.Level}`,
        existingDuplicates: duplicateAnalysis.duplicateCount,
        totalAfterAssignment: duplicateAnalysis.duplicateCount + 1
      });
      
      // Mostra alert educativo e cattura decisione utente
      const userConfirmedDespiteWarning = displayEducationalDuplicateAlert(
        allianceName, 
        facility.Type, 
        facility.Level, 
        duplicateAnalysis
      );
      
      if (!userConfirmedDespiteWarning) {
        // L'utente ha scelto saggiamente di annullare
        console.log('✅ Assegnazione annullata dall\'utente per ottimizzazione strategica');
        const cancelMessage = t.assignmentCancelled || 'Assegnazione annullata per evitare conflitto buff';
        
        if (typeof showStatus === 'function') {
          showStatus(`❌ ${cancelMessage}`, 'warning', 4000);
        }
        
        return; // Exit point: assegnazione annullata
      } else {
        // L'utente ha confermato nonostante l'avvertimento
        console.log('⚠️ Assegnazione confermata nonostante conflitto buff');
        const warningMessage = t.duplicateAssignmentConfirmed || 'Buff duplicato assegnato (non ottimale)';
        
        if (typeof showStatus === 'function') {
          showStatus(`⚠️ ${warningMessage}`, 'warning', 5000);
        }
      }
    }
  }
  
  // ESECUZIONE ASSEGNAZIONE: Procedi con l'assegnazione dopo validazione
  facility.Alliance = allianceName;
  
  // AGGIORNAMENTO VISUALE: Aggiorna immediatamente l'interfaccia
  updateFacilityMarkerVisuals(facility, marker);
  
  // FEEDBACK UTENTE: Mostra messaggio di conferma appropriato
  provideFeedbackToUser(facility, allianceName, previousAlliance, t);
  
  // SINCRONIZZAZIONE SISTEMI: Aggiorna tutti i componenti dell'UI
  synchronizeAllUIComponents();
  
  // PERSISTENZA: Salva lo stato aggiornato
  persistDataChanges();
  
  console.log('✅ Assegnazione completata con successo');
}

/**
 * Aggiorna la visualizzazione del marker dopo l'assegnazione
 * Include icona alleanza e stato CSS appropriato
 * 
 * @param {Object} facility - Dati facility aggiornati
 * @param {HTMLElement} marker - Elemento marker da aggiornare
 */
function updateFacilityMarkerVisuals(facility, marker) {
  // Aggiorna icona alleanza
  renderAllianceIconOnMarker(facility);
  
  // Aggiorna classe CSS per stile visuale
  if (facility.Alliance) {
    marker.classList.add('assigned');
  } else {
    marker.classList.remove('assigned');
  }
}

/**
 * Fornisce feedback appropriato all'utente dopo l'assegnazione
 * Messaggi diversi per assegnazione vs rimozione
 * 
 * @param {Object} facility - Facility modificata
 * @param {string|null} allianceName - Nome alleanza (null se rimossa)
 * @param {string|null} previousAlliance - Alleanza precedente
 * @param {Object} t - Traduzioni correnti
 */
function provideFeedbackToUser(facility, allianceName, previousAlliance, t) {
  let feedbackMessage;
  let feedbackType;
  
  if (allianceName) {
    // Caso: assegnazione a nuova alleanza
    const assignedToText = t.assignedTo || 'assegnata a';
    feedbackMessage = `✅ ${facility.Type} ${assignedToText} ${allianceName}`;
    feedbackType = 'success';
  } else {
    // Caso: rimozione assegnazione
    const removedText = t.removed || 'rimossa';
    feedbackMessage = `❌ ${facility.Type} ${removedText}`;
    feedbackType = 'info';
  }
  
  if (typeof showStatus === 'function') {
    showStatus(feedbackMessage, feedbackType);
  } else {
    console.log(`[${feedbackType.toUpperCase()}] ${feedbackMessage}`);
  }
}

/**
 * Sincronizza tutti i componenti dell'UI dopo modifiche
 * Usa setTimeout per evitare problemi di timing con il DOM
 */
function synchronizeAllUIComponents() {
  setTimeout(() => {
    // Aggiorna statistiche header
    if (typeof updateStats === 'function') {
      updateStats();
    }
    
    // Aggiorna lista alleanze con contatori
    if (typeof renderAllianceList === 'function') {
      renderAllianceList();
    }
    
    // Aggiorna riepiloghi facility e buff
    if (typeof renderFacilitySummary === 'function') {
      renderFacilitySummary();
    }
    
    if (typeof renderBuffSummary === 'function') {
      renderBuffSummary();
    }
    
    console.log('🔄 Sincronizzazione UI completata');
  }, 50);
}

/**
 * Salva le modifiche in persistenza locale
 * Utilizza la funzione saveData se disponibile
 */
function persistDataChanges() {
  if (typeof saveData === 'function') {
    saveData();
    console.log('💾 Modifiche salvate in persistenza');
  } else {
    console.warn('⚠️ Funzione saveData non disponibile - modifiche non persistenti');
  }
}

// =====================================================================
// SEZIONE 7: GESTIONE ICONE ALLEANZE SUI MARKER
// =====================================================================
// Sistema per mostrare visualmente quale alleanza controlla ogni facility

/**
 * Renderizza l'icona dell'alleanza sul marker della facility
 * L'icona appare sopra il marker per identificazione rapida
 * 
 * @param {Object} facility - Facility con assegnazione alleanza
 */
function renderAllianceIconOnMarker(facility) {
  if (!facility.marker) {
    console.warn('⚠️ Tentativo di renderizzare icona su marker inesistente');
    return;
  }
  
  // Rimuovi eventuali icone alleanza esistenti
  facility.marker.querySelectorAll('img').forEach(icon => icon.remove());
  
  // Se assegnata a un'alleanza, mostra la sua icona
  if (facility.Alliance) {
    const alliance = alliances.find(alliance => alliance.name === facility.Alliance);
    
    if (alliance) {
      const allianceIcon = document.createElement('img');
      allianceIcon.src = alliance.icon;
      allianceIcon.alt = `${facility.Alliance} icon`;
      allianceIcon.style.cssText = `
        position: absolute;
        left: 50%;
        top: 0;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -100%);
        z-index: 11;
        pointer-events: none;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.9);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background: white;
      `;
      
      facility.marker.appendChild(allianceIcon);
    } else {
      console.warn('⚠️ Alleanza non trovata per facility:', facility.Alliance);
    }
  }
}

// =====================================================================
// SEZIONE 8: ANALISI E OTTIMIZZAZIONE BUFF
// =====================================================================
// Strumenti avanzati per analizzare l'efficienza delle assegnazioni

/**
 * Analizza l'efficienza complessiva dei buff per tutte le alleanze
 * Identifica sprechi e opportunità di ottimizzazione
 * 
 * @returns {Object} Report dettagliato sull'efficienza buff
 */
function generateBuffEfficiencyReport() {
  const report = {
    analysis: {
      totalAlliances: alliances.length,
      alliancesWithIssues: 0,
      totalWastedBuffs: 0,
      optimizationOpportunities: 0
    },
    allianceDetails: [],
    recommendations: []
  };
  
  // Analizza ogni alleanza individualmente
  alliances.forEach(alliance => {
    const allianceFacilities = facilityData.filter(f => f.Alliance === alliance.name);
    
    // Raggruppa facility per tipo|livello per identificare duplicati
    const facilityTypeGroups = {};
    allianceFacilities.forEach(facility => {
      const typeKey = `${facility.Type}|${facility.Level}`;
      if (!facilityTypeGroups[typeKey]) {
        facilityTypeGroups[typeKey] = [];
      }
      facilityTypeGroups[typeKey].push(facility);
    });
    
    // Identifica gruppi con duplicati (spreco di buff)
    const duplicateGroups = Object.entries(facilityTypeGroups)
      .filter(([typeKey, facilities]) => facilities.length > 1);
    
    const wastedBuffsCount = duplicateGroups.reduce(
      (total, [typeKey, facilities]) => total + (facilities.length - 1), 
      0
    );
    
    // Aggiorna statistiche globali
    if (duplicateGroups.length > 0) {
      report.analysis.alliancesWithIssues++;
      report.analysis.totalWastedBuffs += wastedBuffsCount;
    }
    
    // Dettagli per questa alleanza
    const allianceAnalysis = {
      name: alliance.name,
      totalFacilities: allianceFacilities.length,
      uniqueBuffTypes: Object.keys(facilityTypeGroups).length,
      duplicateGroups: duplicateGroups.length,
      wastedBuffs: wastedBuffsCount,
      efficiency: allianceFacilities.length > 0 
        ? Math.round((Object.keys(facilityTypeGroups).length / allianceFacilities.length) * 100)
        : 0,
      duplicateDetails: duplicateGroups.map(([typeKey, facilities]) => ({
        facilityType: typeKey,
        count: facilities.length,
        wastedBuffs: facilities.length - 1,
        buffValue: buffValues[typeKey] || 'Sconosciuto'
      }))
    };
    
    report.allianceDetails.push(allianceAnalysis);
  });
  
  // Genera raccomandazioni basate sull'analisi
  report.recommendations = generateOptimizationRecommendations(report);
  
  return report;
}

/**
 * Genera raccomandazioni specifiche per ottimizzare le assegnazioni
 * 
 * @param {Object} report - Report efficienza da cui derivare raccomandazioni
 * @returns {Array} Lista di raccomandazioni actionable
 */
function generateOptimizationRecommendations(report) {
  const recommendations = [];
  
  // Raccomandazioni per alleanze con problemi gravi
  report.allianceDetails
    .filter(alliance => alliance.wastedBuffs > 2)
    .forEach(alliance => {
      recommendations.push({
        priority: 'high',
        type: 'duplicate_reduction',
        alliance: alliance.name,
        message: `Alleanza "${alliance.name}" ha ${alliance.wastedBuffs} buff sprecati. Considera di riassegnare facility duplicate.`,
        details: alliance.duplicateDetails
      });
    });
  
  // Raccomandazioni per alleanze inefficienti
  report.allianceDetails
    .filter(alliance => alliance.efficiency < 50 && alliance.totalFacilities > 1)
    .forEach(alliance => {
      recommendations.push({
        priority: 'medium',
        type: 'efficiency_improvement',
        alliance: alliance.name,
        message: `Alleanza "${alliance.name}" ha efficienza buff del ${alliance.efficiency}%. Diversifica i tipi di facility.`,
        currentEfficiency: alliance.efficiency
      });
    });
  
  // Raccomandazione generale se tutto è ottimale
  if (report.analysis.totalWastedBuffs === 0) {
    recommendations.push({
      priority: 'info',
      type: 'optimal_configuration',
      message: '🎉 Configurazione ottimale! Nessun buff sprecato rilevato.',
      details: 'Tutte le alleanze hanno assegnazioni buff efficienti.'
    });
  }
  
  return recommendations;
}

/**
 * Funzione di utilità per debug: mostra report ottimizzazione in console
 * Accessibile globalmente per troubleshooting
 */
window.showBuffOptimizationReport = function() {
  const report = generateBuffEfficiencyReport();
  
  console.log('📊 === REPORT OTTIMIZZAZIONE BUFF ===');
  console.log(`🏰 Alleanze totali: ${report.analysis.totalAlliances}`);
  console.log(`⚠️ Alleanze con problemi: ${report.analysis.alliancesWithIssues}`);
  console.log(`💥 Buff sprecati totali: ${report.analysis.totalWastedBuffs}`);
  console.log('');
  
  if (report.analysis.alliancesWithIssues === 0) {
    console.log('✅ Perfetto! Nessun conflitto di buff rilevato.');
  } else {
    console.log('📋 Dettaglio problemi per alleanza:');
    
    report.allianceDetails
      .filter(analysis => analysis.duplicateGroups > 0)
      .forEach(analysis => {
        console.log(`\n🏰 ${analysis.name}:`);
        console.log(`  • Facility totali: ${analysis.totalFacilities}`);
        console.log(`  • Efficienza buff: ${analysis.efficiency}%`);
        console.log(`  • Buff sprecati: ${analysis.wastedBuffs}`);
        console.log(`  • Problemi:`);
        
        analysis.duplicateDetails.forEach(detail => {
          console.log(`    - ${detail.facilityType}: ${detail.count} copie (${detail.wastedBuffs} sprecate, buff: ${detail.buffValue})`);
        });
      });
  }
  
  console.log('\n💡 Raccomandazioni:');
  report.recommendations.forEach(rec => {
    const priority = rec.priority.toUpperCase();
    console.log(`  [${priority}] ${rec.message}`);
  });
  
  console.log('\n=== FINE REPORT ===');
  return report;
};

// =====================================================================
// SEZIONE 9: GESTIONE EVENTI GLOBALI E INIZIALIZZAZIONE
// =====================================================================
// Event handler per integrazione con il resto dell'applicazione

/**
 * Event handler per chiusura dropdown quando si clicca altrove
 * Previene l'accumulo di dropdown aperti
 */
document.addEventListener('click', function(event) {
  // Chiudi dropdown solo se il click è fuori da marker e dropdown
  if (!event.target.closest('.marker') && !event.target.closest('.marker-dropdown')) {
    setTimeout(() => {
      closeAllAssignmentDropdowns();
    }, 50);
  }
});

/**
 * Inizializzazione del sistema marker
 * Questa funzione deve essere chiamata dopo il caricamento dei dati
 */
function initializeMarkerSystem() {
  console.log('🚀 Inizializzazione sistema marker...');
  
  // Applica ottimizzazioni per il dispositivo corrente
  applyTouchOptimizations();
  
  // Verifica che i dati necessari siano disponibili
  if (typeof facilityData === 'undefined' || !Array.isArray(facilityData)) {
    console.error('❌ facilityData non disponibile per inizializzazione marker');
    return false;
  }
  
  if (typeof alliances === 'undefined' || !Array.isArray(alliances)) {
    console.warn('⚠️ alliances non ancora disponibili, marker creati senza assegnazioni');
  }
  
  // Crea tutti i marker
  let successfulCreations = 0;
  facilityData.forEach((facility, index) => {
    try {
      const marker = createInteractiveFacilityMarker(facility, index);
      if (marker) {
        successfulCreations++;
      }
    } catch (error) {
      console.error(`❌ Errore creazione marker per facility ${index}:`, error, facility);
    }
  });
  
  // Report inizializzazione
  console.log(`✅ Sistema marker inizializzato: ${successfulCreations}/${facilityData.length} marker creati`);
  
  // Aggiungi stili CSS necessari per keyboard navigation se non presenti
  addKeyboardNavigationStyles();
  
  return successfulCreations === facilityData.length;
}

/**
 * Aggiunge stili CSS per navigazione keyboard se non già presenti
 * Garantisce accessibilità anche se il CSS principale non è caricato
 */
function addKeyboardNavigationStyles() {
  if (!document.getElementById('marker-keyboard-styles')) {
    const style = document.createElement('style');
    style.id = 'marker-keyboard-styles';
    style.textContent = `
      .dropdown-option.keyboard-focus {
        background: rgba(79, 172, 254, 0.4) !important;
        border-color: rgba(79, 172, 254, 0.8) !important;
        outline: 2px solid rgba(79, 172, 254, 0.6);
        outline-offset: -2px;
      }
      
      .dropdown-options.scrolling {
        background: rgba(20, 25, 40, 0.99);
      }
      
      .dropdown-options.touch-active {
        user-select: none;
        -webkit-user-select: none;
      }
      
      @media (pointer: coarse) {
        .dropdown-options {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior: contain;
        }
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Stili navigazione keyboard aggiunti');
  }
}

// =====================================================================
// FUNZIONI ESPORTATE GLOBALMENTE
// =====================================================================
// Esposizione di funzioni chiave per integrazione con altri moduli

// Esporta funzioni principali per uso da altri moduli
window.createMarker = createInteractiveFacilityMarker;
window.recreateAllMarkers = recreateAllMapMarkers;
window.renderAllianceIcon = renderAllianceIconOnMarker;
window.closeAllDropdowns = closeAllAssignmentDropdowns;

// Funzione di utilità per debugging e maintenance
window.debugMarkerSystem = function() {
  const totalFacilities = typeof facilityData !== 'undefined' ? facilityData.length : 0;
  const markersOnPage = document.querySelectorAll('.marker').length;
  const openDropdowns = document.querySelectorAll('.marker-dropdown').length;
  const assignedFacilities = typeof facilityData !== 'undefined' 
    ? facilityData.filter(f => f.Alliance).length 
    : 0;
  
  console.log('🔍 === DEBUG SISTEMA MARKER ===');
  console.log(`📊 Facility totali: ${totalFacilities}`);
  console.log(`📍 Marker sulla pagina: ${markersOnPage}`);
  console.log(`📋 Dropdown aperti: ${openDropdowns}`);
  console.log(`🎯 Facility assegnate: ${assignedFacilities}`);
  console.log(`📱 Dispositivo touch: ${isTouchDeviceWithScrollIssues()}`);
  console.log(`🖱️ Scrollbar personalizzate: ${supportsCustomScrollbars()}`);
  
  return {
    totalFacilities,
    markersOnPage,
    openDropdowns,
    assignedFacilities,
    isTouch: isTouchDeviceWithScrollIssues(),
    customScrollbars: supportsCustomScrollbars()
  };
};

console.log('✅ Sistema marker caricato completamente - Pronto per inizializzazione');

// =====================================================================
// FINE MARKERS.JS
// =====================================================================