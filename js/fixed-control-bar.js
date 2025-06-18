// =====================================================================
// FIXED-CONTROL-BAR.JS - SISTEMA BARRA CONTROLLO FISSA (PULITO)
// =====================================================================
// Sistema barra controllo fissa che sostituisce i dropdown marker.
// Funzionalità: creazione barra, gestione eventi, validazione assegnazioni,
// integrazione con sistema traduzioni e salvataggio automatico.
//
// VERSIONE PULITA: 
// - Consolidati event listeners con pattern comuni
// - Ottimizzata integrazione con utilities.js esistente
// - Semplificati commenti mantenendo chiarezza funzionale
// - Ridotte duplicazioni con markers.js e altri moduli
// - Eliminate funzioni utility interne per quelle globali

console.log('🎛️ Caricamento sistema barra controllo fissa ottimizzato...');

// =====================================================================
// STATO E CONFIGURAZIONE
// =====================================================================

let currentSelectedFacility = null;
let currentSelectedMarker = null;
let controlBarVisible = false;

// =====================================================================
// CREAZIONE E GESTIONE BARRA CONTROLLO
// =====================================================================

/**
 * Crea la barra di controllo fissa nell'HTML
 */
function createFixedControlBar() {
  console.log('🏗️ Creazione barra controllo fissa...');
  
  const t = translations[currentLanguage] || translations['en'];
  const mainContent = document.querySelector('.main-content');
  const firstMapContainer = mainContent?.querySelector('.map-container');
  
  if (!firstMapContainer) {
    console.error('❌ Non trovo .map-container per inserire la barra controllo');
    return false;
  }
  
  const controlBar = document.createElement('div');
  controlBar.id = 'fixed-control-bar';
  controlBar.className = 'fixed-control-bar glass-card hidden';
  
  controlBar.innerHTML = `
    <div class="control-bar-header">
      <div class="control-bar-title">
        <span class="facility-info" id="facility-info">
          <span class="facility-icon" id="selected-facility-icon">📍</span>
          <span class="facility-details" id="selected-facility-details">
            ${t.selectFacility || 'Seleziona una facility'}
          </span>
        </span>
      </div>
      <button class="control-bar-close" id="control-bar-close" title="${t.close || 'Chiudi'}">❌</button>
    </div>
    
    <div class="control-bar-content">
      <div class="control-dropdowns">
        <div class="control-dropdown-group">
          <label for="alliance-select">${t.alliance || 'Alleanza'}:</label>
          <select id="alliance-select" class="control-select">
            <option value="">${t.unassigned || 'Non assegnata'}</option>
          </select>
        </div>
        
        <div class="control-dropdown-group">
          <label for="type-display">${t.type || 'Tipo'}:</label>
          <input type="text" id="type-display" class="control-input readonly" readonly>
        </div>
        
        <div class="control-dropdown-group">
          <label for="level-display">${t.level || 'Livello'}:</label>
          <input type="text" id="level-display" class="control-input readonly" readonly>
        </div>
      </div>
      
      <div class="control-actions">
        <button id="assign-facility-btn" class="btn btn-success">✅ ${t.assign || 'Assegna'}</button>
        <button id="cancel-assignment-btn" class="btn btn-warning">❌ ${t.cancel || 'Annulla'}</button>
      </div>
    </div>
    
    <div id="control-validation-warning" class="control-validation-warning hidden">
      <div class="warning-content">
        <span class="warning-icon">⚠️</span>
        <div class="warning-text" id="warning-text"></div>
        <div class="warning-actions">
          <button id="warning-confirm-btn" class="btn btn-danger btn-small">
            ${t.confirmAnyway || 'Conferma Comunque'}
          </button>
          <button id="warning-cancel-btn" class="btn btn-info btn-small">
            ${t.choose_different || 'Scegli Diversa'}
          </button>
        </div>
      </div>
    </div>
  `;
  
  mainContent.insertBefore(controlBar, firstMapContainer);
  setupControlBarEventListeners();
  
  console.log('✅ Barra controllo fissa creata con successo');
  return true;
}

/**
 * Configura event listeners con pattern consolidato
 */
function setupControlBarEventListeners() {
  console.log('🔗 Configurazione event listeners barra controllo...');
  
  // Pattern consolidato per pulsanti principali
  const buttonActions = {
    'control-bar-close': hideControlBar,
    'cancel-assignment-btn': hideControlBar,
    'assign-facility-btn': handleAssignmentAttempt,
    'warning-confirm-btn': confirmAssignmentDespiteWarning,
    'warning-cancel-btn': hideValidationWarning
  };
  
  // Registra tutti i pulsanti con pattern unico
  Object.entries(buttonActions).forEach(([id, handler]) => {
    document.getElementById(id)?.addEventListener('click', handler);
  });
  
  // Dropdown alleanza con auto-aggiornamento
  document.getElementById('alliance-select')?.addEventListener('change', updateAssignButtonState);
  
  // Gestione ESC key globale
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && controlBarVisible) {
      hideControlBar();
    }
  });
  
  console.log('✅ Event listeners configurati');
}

// =====================================================================
// VISUALIZZAZIONE E CONTROLLO BARRA
// =====================================================================

/**
 * Mostra la barra controllo per una facility specifica
 */
function showControlBar(facility, marker) {
  console.log('📊 Mostrando barra controllo per:', facility.Type, facility.Level);
  
  const t = translations[currentLanguage] || translations['en'];
  
  // Verifica alleanze disponibili
  if (!alliances || alliances.length === 0) {
    const message = t.addAtLeastOneAlliance || '⚠️ Aggiungi almeno un\'alleanza prima di assegnare.';
    if (typeof showStatus === 'function') {
      showStatus(message, 'error');
    }
    return;
  }
  
  // Salva stato corrente
  currentSelectedFacility = facility;
  currentSelectedMarker = marker;
  
  // Aggiorna e mostra barra
  updateControlBarContent(facility);
  toggleControlBarVisibility(true);
  
  console.log('✅ Barra controllo mostrata');
}

/**
 * Nasconde la barra controllo
 */
function hideControlBar() {
  console.log('📊 Nascondendo barra controllo...');
  
  toggleControlBarVisibility(false);
  resetControlBarState();
  hideValidationWarning();
  
  console.log('✅ Barra controllo nascosta');
}

/**
 * Gestisce visibilità barra con animazioni
 */
function toggleControlBarVisibility(show) {
  const controlBar = document.getElementById('fixed-control-bar');
  if (!controlBar) return;
  
  if (show) {
    controlBar.classList.remove('hidden');
    controlBar.classList.add('visible');
    controlBarVisible = true;
    
    // Focus per usabilità e scroll per visibilità
    setTimeout(() => {
      document.getElementById('alliance-select')?.focus();
      controlBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  } else {
    controlBar.classList.remove('visible');
    controlBar.classList.add('hidden');
    controlBarVisible = false;
  }
}

/**
 * Reset stato della barra
 */
function resetControlBarState() {
  currentSelectedFacility = null;
  currentSelectedMarker = null;
}

/**
 * Aggiorna contenuto barra con dati facility
 */
function updateControlBarContent(facility) {
  console.log('🔄 Aggiornamento contenuto barra controllo...');
  
  const t = translations[currentLanguage] || translations['en'];
  
  // Aggiorna info facility usando utility esistenti
  updateFacilityInfo(facility, t);
  updateAllianceDropdown(facility, t);
  updateAssignButtonState();
  
  console.log('✅ Contenuto barra controllo aggiornato');
}

/**
 * Aggiorna informazioni facility visualizzate
 */
function updateFacilityInfo(facility, t) {
  const facilityIcon = document.getElementById('selected-facility-icon');
  const facilityDetails = document.getElementById('selected-facility-details');
  const typeDisplay = document.getElementById('type-display');
  const levelDisplay = document.getElementById('level-display');
  
  if (facilityIcon && facilityIcons[facility.Type]) {
    facilityIcon.textContent = facilityIcons[facility.Type];
  }
  
  if (facilityDetails) {
    const coordsText = facility.ingameCoords ? ` (${facility.ingameCoords})` : '';
    facilityDetails.textContent = `${facility.Type} ${facility.Level}${coordsText}`;
  }
  
  if (typeDisplay) typeDisplay.value = facility.Type;
  if (levelDisplay) levelDisplay.value = facility.Level;
}

/**
 * Aggiorna dropdown alleanze con contatori
 */
function updateAllianceDropdown(facility, t) {
  const allianceSelect = document.getElementById('alliance-select');
  if (!allianceSelect) return;
  
  // Clear e ricostruisci opzioni
  allianceSelect.innerHTML = `<option value="">${t.unassigned || 'Non assegnata'}</option>`;
  
  alliances.forEach(alliance => {
    const option = document.createElement('option');
    option.value = alliance.name;
    
    // Aggiungi contatori assegnazioni correnti
    const currentAssignments = facilityData.filter(f => f.Alliance === alliance.name).length;
    option.textContent = currentAssignments > 0 
      ? `${alliance.name} (${currentAssignments} ${t.structures || 'strutture'})`
      : alliance.name;
    
    allianceSelect.appendChild(option);
  });
  
  // Seleziona alleanza corrente se presente
  allianceSelect.value = facility.Alliance || '';
}

/**
 * Aggiorna stato pulsante Assegna in base alla selezione
 */
function updateAssignButtonState() {
  const allianceSelect = document.getElementById('alliance-select');
  const assignBtn = document.getElementById('assign-facility-btn');
  const t = translations[currentLanguage] || translations['en'];
  
  if (!allianceSelect || !assignBtn || !currentSelectedFacility) return;
  
  const selectedAlliance = allianceSelect.value;
  const currentAlliance = currentSelectedFacility.Alliance;
  const hasChange = selectedAlliance !== (currentAlliance || '');
  
  // Configura pulsante in base al tipo di cambio
  if (hasChange) {
    assignBtn.disabled = false;
    assignBtn.classList.remove('disabled');
    
    if (selectedAlliance === '') {
      assignBtn.innerHTML = `🗑️ ${t.remove || 'Rimuovi'}`;
      assignBtn.className = 'btn btn-warning';
    } else {
      assignBtn.innerHTML = `✅ ${t.assign || 'Assegna'}`;
      assignBtn.className = 'btn btn-success';
    }
  } else {
    assignBtn.disabled = true;
    assignBtn.classList.add('disabled');
    assignBtn.innerHTML = `⏹️ ${t.noChange || 'Nessun Cambio'}`;
    assignBtn.className = 'btn btn-info disabled';
  }
}

// =====================================================================
// GESTIONE ASSEGNAZIONI E VALIDAZIONE
// =====================================================================

/**
 * Gestisce tentativo di assegnazione
 */
function handleAssignmentAttempt() {
  if (!currentSelectedFacility) {
    console.warn('⚠️ Nessuna facility selezionata');
    return;
  }
  
  const allianceSelect = document.getElementById('alliance-select');
  if (!allianceSelect) {
    console.error('❌ Dropdown alleanza non trovato');
    return;
  }
  
  const selectedAllianceName = allianceSelect.value || null;
  
  console.log('🎯 Tentativo assegnazione:', {
    facility: `${currentSelectedFacility.Type} ${currentSelectedFacility.Level}`,
    from: currentSelectedFacility.Alliance || 'Non assegnata',
    to: selectedAllianceName || 'Non assegnata'
  });
  
  // Validazione duplicati solo per nuove assegnazioni
  if (selectedAllianceName) {
    checkForDuplicatesAndProceed(selectedAllianceName);
  } else {
    executeAssignment(selectedAllianceName);
  }
}

/**
 * Controlla duplicati e procede
 */
function checkForDuplicatesAndProceed(allianceName) {
  console.log('🔍 Controllo duplicati per:', allianceName);
  
  // Usa la funzione esistente di validazione da markers.js
  if (typeof analyzeAllianceFacilityDuplicates === 'function') {
    const duplicateAnalysis = analyzeAllianceFacilityDuplicates(
      allianceName,
      currentSelectedFacility.Type,
      currentSelectedFacility.Level,
      currentSelectedFacility
    );
    
    if (duplicateAnalysis.hasDuplicate) {
      console.log('⚠️ Duplicati rilevati, mostrando warning...');
      showValidationWarning(allianceName, duplicateAnalysis);
      return;
    }
  }
  
  executeAssignment(allianceName);
}

/**
 * Mostra warning di validazione consolidato
 */
function showValidationWarning(allianceName, duplicateAnalysis) {
  const t = translations[currentLanguage] || translations['en'];
  const warningDiv = document.getElementById('control-validation-warning');
  const warningText = document.getElementById('warning-text');
  
  if (!warningDiv || !warningText) {
    console.error('❌ Elementi warning non trovati');
    executeAssignment(allianceName);
    return;
  }
  
  // Genera messaggio di warning usando utility esistenti
  const warningMessage = buildWarningMessage(allianceName, duplicateAnalysis, t);
  warningText.innerHTML = warningMessage;
  
  // Mostra con animazione
  warningDiv.classList.remove('hidden');
  warningDiv.classList.add('visible');
  warningDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  console.log('⚠️ Warning duplicati mostrato');
}

/**
 * Costruisce messaggio warning usando logiche esistenti
 */
function buildWarningMessage(allianceName, duplicateAnalysis, t) {
  const buffKey = `${currentSelectedFacility.Type}|${currentSelectedFacility.Level}`;
  const buffValue = buffValues[buffKey] || t.unknownBuff || 'Buff sconosciuto';
  const totalDuplicates = duplicateAnalysis.duplicateCount + 1;
  
  // Genera alternative usando funzione esistente da markers.js
  let alternativesText = '';
  if (typeof generateOptimalFacilitySuggestions === 'function') {
    const alternatives = generateOptimalFacilitySuggestions(
      allianceName,
      currentSelectedFacility.Type,
      currentSelectedFacility.Level
    );
    
    if (alternatives.length > 0) {
      const alternativesList = alternatives.slice(0, 2).map(facility => {
        const altBuffKey = `${facility.Type}|${facility.Level}`;
        const altBuffValue = buffValues[altBuffKey] || t.unknownBuff || 'Sconosciuto';
        return `${facility.Type} ${facility.Level} (${altBuffValue})`;
      }).join(', ');
      
      alternativesText = `<br><strong>${t.betterAlternatives || 'Alternative migliori'}:</strong> ${alternativesList}`;
    }
  }
  
  return `
    <strong>${t.duplicateBuffWarning || 'ATTENZIONE: Buff Duplicato!'}</strong><br>
    L'alleanza "<strong>${allianceName}</strong>" avrà <strong>${totalDuplicates}</strong> facility 
    <strong>${currentSelectedFacility.Type} ${currentSelectedFacility.Level}</strong>.<br>
    <strong>${t.wastedBuffs || 'Buff sprecati'}:</strong> ${totalDuplicates - 1}<br>
    <strong>${t.actualBuff || 'Buff effettivo'}:</strong> ${buffValue} (non ${buffValue} × ${totalDuplicates})
    ${alternativesText}
  `;
}

/**
 * Nasconde warning di validazione
 */
function hideValidationWarning() {
  const warningDiv = document.getElementById('control-validation-warning');
  if (warningDiv) {
    warningDiv.classList.remove('visible');
    warningDiv.classList.add('hidden');
  }
}

/**
 * Conferma assegnazione nonostante warning
 */
function confirmAssignmentDespiteWarning() {
  console.log('⚠️ Utente conferma assegnazione nonostante warning');
  
  const allianceSelect = document.getElementById('alliance-select');
  if (allianceSelect) {
    const selectedAllianceName = allianceSelect.value || null;
    executeAssignment(selectedAllianceName);
  }
  
  hideValidationWarning();
}

/**
 * Esegue assegnazione usando sistemi esistenti
 */
function executeAssignment(allianceName) {
  console.log('⚡ Esecuzione assegnazione:', {
    facility: `${currentSelectedFacility.Type} ${currentSelectedFacility.Level}`,
    alliance: allianceName || 'RIMOZIONE'
  });
  
  // Aggiorna dati facility
  currentSelectedFacility.Alliance = allianceName;
  
  // Aggiorna visuale marker usando funzioni esistenti
  if (currentSelectedMarker && typeof renderAllianceIcon === 'function') {
    renderAllianceIcon(currentSelectedFacility);
    
    if (allianceName) {
      currentSelectedMarker.classList.add('assigned');
    } else {
      currentSelectedMarker.classList.remove('assigned');
    }
  }
  
  // Aggiorna UI usando funzioni consolidate da utilities.js
  updateUIAfterAssignment();
  
  // Salva usando sistema esistente
  if (typeof saveData === 'function') saveData();
  
  // Feedback utente
  provideFeedback(allianceName);
  
  // Nascondi barra
  hideControlBar();
  
  console.log('✅ Assegnazione completata');
}

/**
 * Aggiorna UI dopo assegnazione usando sistemi esistenti
 */
function updateUIAfterAssignment() {
  // Usa le funzioni esistenti per aggiornamento UI
  if (typeof updateStats === 'function') updateStats();
  if (typeof renderAllianceList === 'function') renderAllianceList();
  if (typeof renderFacilitySummary === 'function') renderFacilitySummary();
  if (typeof renderBuffSummary === 'function') renderBuffSummary();
}

/**
 * Fornisce feedback usando sistema esistente
 */
function provideFeedback(allianceName) {
  const t = translations[currentLanguage] || translations['en'];
  let message, type;
  
  if (allianceName) {
    message = `✅ ${currentSelectedFacility.Type} ${t.assignedTo || 'assegnata a'} ${allianceName}`;
    type = 'success';
  } else {
    message = `🗑️ ${currentSelectedFacility.Type} ${t.removed || 'rimossa'}`;
    type = 'info';
  }
  
  if (typeof showStatus === 'function') {
    showStatus(message, type);
  }
}

// =====================================================================
// INTEGRAZIONE E INIZIALIZZAZIONE
// =====================================================================

/**
 * Gestisce click marker (integrazione con markers.js)
 */
function handleMarkerClick(facility, marker) {
  console.log('🖱️ Click marker intercettato:', facility.Type, facility.Level);
  
  if (controlBarVisible) {
    hideControlBar();
  }
  
  showControlBar(facility, marker);
}

/**
 * Inizializza sistema barra controllo
 */
function initializeFixedControlBarSystem() {
  console.log('🚀 Inizializzazione sistema barra controllo fissa...');
  
  if (!createFixedControlBar()) {
    console.error('❌ Fallita creazione barra controllo');
    return false;
  }
  
  // Esporta funzioni per integrazione globale
  window.showControlBar = showControlBar;
  window.hideControlBar = hideControlBar;
  window.handleMarkerClick = handleMarkerClick;
  
  console.log('✅ Sistema barra controllo fissa inizializzato');
  return true;
}

// =====================================================================
// AUTO-INIZIALIZZAZIONE
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM caricato - inizializzazione barra controllo...');
  
  setTimeout(() => {
    initializeFixedControlBarSystem();
  }, 500);
});

console.log('✅ Sistema barra controllo fissa caricato - Versione ottimizzata');

// =====================================================================
// FINE FIXED-CONTROL-BAR.JS PULITO
// =====================================================================