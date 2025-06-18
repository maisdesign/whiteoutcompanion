// =====================================================================
// MARKERS.JS - GESTIONE MARKER E VALIDAZIONE INTELLIGENTE (PULITO)
// =====================================================================
// Sistema pulito che gestisce:
// - Creazione e posizionamento marker sulla mappa
// - Validazione intelligente per evitare conflitti di buff
// - Integrazione con il nuovo sistema barra controllo fissa
// 
// RIMOSSO: Tutto il sistema dropdown obsoleto sostituito dalla barra controllo

console.log('🗺️ Caricamento sistema marker pulito...');

// =====================================================================
// SEZIONE 1: CONFIGURAZIONE ICONE E COSTANTI
// =====================================================================

/**
 * Mapping delle icone per ogni tipo di facility nel gioco
 * Ogni icona è scelta per essere immediatamente riconoscibile
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
 */
const TOUCH_CONFIG = {
  minMarkerSize: 16,           // Dimensione minima tocco confortevole
  markerHitRadius: 25,         // Area intorno ai marker per touch
  momentumScrolling: true      // Abilita scroll fluido
};

// =====================================================================
// SEZIONE 2: UTILITÀ PER DISPOSITIVI TOUCH
// =====================================================================

/**
 * Rileva se stiamo operando su un dispositivo touch con potenziali
 * problemi di scrolling (tipicamente Android su schermi piccoli)
 */
function isTouchDeviceWithScrollIssues() {
  return (
    'ontouchstart' in window &&
    /Android/i.test(navigator.userAgent) &&
    window.innerWidth < 768
  );
}

/**
 * Applica ottimizzazioni specifiche per il dispositivo corrente
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

/**
 * Analizza se un'alleanza possiede già facility dello stesso tipo e livello
 * 
 * Questa funzione implementa una regola fondamentale di Whiteout Survival:
 * i buff non si sommano per facility identiche.
 */
function analyzeAllianceFacilityDuplicates(allianceName, facilityType, facilityLevel, excludeFacility = null) {
  // Raccogliamo tutte le facility già controllate da questa alleanza
  const allianceFacilities = facilityData.filter(facility => {
    // Escludiamo la facility che stiamo modificando (utile durante editing)
    if (excludeFacility && facility === excludeFacility) {
      return false;
    }
    
    return facility.Alliance === allianceName;
  });
  
  // Cerchiamo facility che abbiano esattamente lo stesso tipo e livello
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

/**
 * Crea un marker visuale per una facility sulla mappa
 * 
 * Ogni marker è un elemento DOM posizionato precisamente sulla mappa
 * che rappresenta una facility del gioco. Usa il NUOVO sistema barra controllo.
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
  
  // Configura evento click per NUOVO sistema barra controllo
  marker.onclick = (event) => {
    event.stopPropagation();
    
    // Usa il nuovo sistema barra controllo fissa
    if (typeof handleMarkerClick === 'function') {
      handleMarkerClick(facility, marker);
    } else {
      // Fallback: mostra messaggio se sistema non disponibile
      console.warn('⚠️ Sistema barra controllo non disponibile');
      const t = translations[currentLanguage] || {};
      if (typeof showStatus === 'function') {
        showStatus(t.addAtLeastOneAlliance || '⚠️ Sistema controllo non pronto', 'warning');
      }
    }
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
// SEZIONE 5: ASSEGNAZIONE FACILITY CON VALIDAZIONE INTELLIGENTE
// =====================================================================

/**
 * Assegna una facility a un'alleanza con validazione completa
 * 
 * Questa è la funzione centrale che orchestra tutto il processo:
 * 1. Valida per prevenire conflitti di buff
 * 2. Educa l'utente sui problemi rilevati
 * 3. Rispetta la decisione finale dell'utente
 * 4. Aggiorna tutti i sistemi correlati
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
  
  // VALIDAZIONE: Controlla facility duplicate solo per nuove assegnazioni
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
  
  // ESECUZIONE: Procedi con l'assegnazione dopo validazione
  facility.Alliance = allianceName;
  
  // AGGIORNAMENTO VISUALE: Aggiorna immediatamente l'interfaccia
  updateFacilityMarkerVisuals(facility, marker);
  
  // FEEDBACK UTENTE: Mostra messaggio di conferma appropriato
  provideFeedbackToUser(facility, allianceName, previousAlliance, t);
  
  // SINCRONIZZAZIONE: Aggiorna tutti i componenti dell'UI
  synchronizeAllUIComponents();
  
  // PERSISTENZA: Salva lo stato aggiornato
  persistDataChanges();
  
  console.log('✅ Assegnazione completata con successo');
}

/**
 * Aggiorna la visualizzazione del marker dopo l'assegnazione
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
// SEZIONE 6: GESTIONE ICONE ALLEANZE SUI MARKER
// =====================================================================

/**
 * Renderizza l'icona dell'alleanza sul marker della facility
 * L'icona appare sopra il marker per identificazione rapida
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
// SEZIONE 7: ANALISI E OTTIMIZZAZIONE BUFF
// =====================================================================

/**
 * Analizza l'efficienza complessiva dei buff per tutte le alleanze
 * Identifica sprechi e opportunità di ottimizzazione
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
// SEZIONE 8: INIZIALIZZAZIONE DEL SISTEMA MARKER
// =====================================================================

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
  
  return successfulCreations === facilityData.length;
}

// =====================================================================
// SEZIONE 9: FUNZIONI ESPORTATE E UTILITY
// =====================================================================

// Esporta funzioni principali per uso da altri moduli
window.createMarker = createInteractiveFacilityMarker;
window.recreateAllMarkers = recreateAllMapMarkers;
window.renderAllianceIcon = renderAllianceIconOnMarker;
window.assignFacilityToAllianceWithValidation = assignFacilityToAllianceWithValidation;

// Esporta funzioni di validazione per uso con barra controllo
window.analyzeAllianceFacilityDuplicates = analyzeAllianceFacilityDuplicates;
window.generateOptimalFacilitySuggestions = generateOptimalFacilitySuggestions;

/**
 * Funzione di debug per il sistema marker
 */
window.debugMarkerSystem = function() {
  const totalFacilities = typeof facilityData !== 'undefined' ? facilityData.length : 0;
  const markersOnPage = document.querySelectorAll('.marker').length;
  const assignedFacilities = typeof facilityData !== 'undefined' 
    ? facilityData.filter(f => f.Alliance).length 
    : 0;
  
  console.log('🔍 === DEBUG SISTEMA MARKER ===');
  console.log(`📊 Facility totali: ${totalFacilities}`);
  console.log(`📍 Marker sulla pagina: ${markersOnPage}`);
  console.log(`🎯 Facility assegnate: ${assignedFacilities}`);
  console.log(`📱 Dispositivo touch: ${isTouchDeviceWithScrollIssues()}`);
  console.log('✅ Sistema barra controllo integrato');
  
  return {
    totalFacilities,
    markersOnPage,
    assignedFacilities,
    isTouch: isTouchDeviceWithScrollIssues(),
    newControlSystem: true
  };
};

console.log('✅ Sistema marker pulito caricato - Integrato con barra controllo fissa');