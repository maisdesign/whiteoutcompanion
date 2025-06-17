// =====================================================================
// FIXED-CONTROL-BAR.JS - SISTEMA BARRA CONTROLLO FISSA
// =====================================================================
// Questo file implementa il nuovo sistema di barra controllo fissa che
// sostituisce i dropdown problematici sui marker. La barra appare in alto
// quando si clicca un marker e permette di assegnare facility in modo
// molto più robusto e user-friendly.

console.log('🎛️ Caricamento sistema barra controllo fissa...');

// =====================================================================
// SEZIONE 1: STATO E CONFIGURAZIONE
// =====================================================================

let currentSelectedFacility = null;
let currentSelectedMarker = null;
let controlBarVisible = false;

// =====================================================================
// SEZIONE 2: CREAZIONE BARRA CONTROLLO
// =====================================================================

/**
 * Crea la barra di controllo fissa nell'HTML
 * Viene chiamata una sola volta all'inizializzazione
 */
function createFixedControlBar() {
  console.log('🏗️ Creazione barra controllo fissa...');
  
  const t = translations[currentLanguage] || translations['en'];
  
  // Trova il punto di inserimento (dopo i controlli esistenti)
  const mainContent = document.querySelector('.main-content');
  const firstMapContainer = mainContent.querySelector('.map-container');
  
  if (!firstMapContainer) {
    console.error('❌ Non trovo .map-container per inserire la barra controllo');
    return false;
  }
  
  // Crea l'elemento barra controllo
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
      <button class="control-bar-close" id="control-bar-close" title="${t.close || 'Chiudi'}">
        ❌
      </button>
    </div>
    
    <div class="control-bar-content">
      <div class="control-dropdowns">
        
        <!-- Dropdown Alliance -->
        <div class="control-dropdown-group">
          <label for="alliance-select">${t.alliance || 'Alleanza'}:</label>
          <select id="alliance-select" class="control-select">
            <option value="">${t.unassigned || 'Non assegnata'}</option>
          </select>
        </div>
        
        <!-- Dropdown Type (readonly per info) -->
        <div class="control-dropdown-group">
          <label for="type-display">${t.type || 'Tipo'}:</label>
          <input type="text" id="type-display" class="control-input readonly" readonly>
        </div>
        
        <!-- Dropdown Level (readonly per info) -->
        <div class="control-dropdown-group">
          <label for="level-display">${t.level || 'Livello'}:</label>
          <input type="text" id="level-display" class="control-input readonly" readonly>
        </div>
        
      </div>
      
      <div class="control-actions">
        <button id="assign-facility-btn" class="btn btn-success">
          ✅ ${t.assign || 'Assegna'}
        </button>
        <button id="cancel-assignment-btn" class="btn btn-warning">
          ❌ ${t.cancel || 'Annulla'}
        </button>
      </div>
    </div>
    
    <!-- Validation Warning Area -->
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
  
  // Inserisci prima del primo map-container
  mainContent.insertBefore(controlBar, firstMapContainer);
  
  // Configura event listeners
  setupControlBarEventListeners();
  
  console.log('✅ Barra controllo fissa creata con successo');
  return true;
}

// =====================================================================
// SEZIONE 3: EVENT LISTENERS
// =====================================================================

/**
 * Configura tutti gli event listener della barra controllo
 */
function setupControlBarEventListeners() {
  console.log('🔗 Configurazione event listeners barra controllo...');
  
  // Pulsante chiudi
  document.getElementById('control-bar-close')?.addEventListener('click', hideControlBar);
  
  // Pulsante annulla
  document.getElementById('cancel-assignment-btn')?.addEventListener('click', hideControlBar);
  
  // Pulsante assegna
  document.getElementById('assign-facility-btn')?.addEventListener('click', handleAssignmentAttempt);
  
  // Dropdown alleanza - aggiorna pulsante quando cambia
  document.getElementById('alliance-select')?.addEventListener('change', updateAssignButtonState);
  
  // Warning buttons
  document.getElementById('warning-confirm-btn')?.addEventListener('click', confirmAssignmentDespiteWarning);
  document.getElementById('warning-cancel-btn')?.addEventListener('click', hideValidationWarning);
  
  // ESC key per chiudere
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && controlBarVisible) {
      hideControlBar();
    }
  });
  
  console.log('✅ Event listeners configurati');
}

// =====================================================================
// SEZIONE 4: VISUALIZZAZIONE E CONTROLLO BARRA
// =====================================================================

/**
 * Mostra la barra controllo per una facility specifica
 * Questa è la funzione principale chiamata dal click sui marker
 */
function showControlBar(facility, marker) {
  console.log('📊 Mostrando barra controllo per:', facility.Type, facility.Level);
  
  const t = translations[currentLanguage] || translations['en'];
  
  // Verifica che ci siano alleanze disponibili
  if (!alliances || alliances.length === 0) {
    const message = t.addAtLeastOneAlliance || '⚠️ Aggiungi almeno un\'alleanza prima di assegnare.';
    if (typeof showStatus === 'function') {
      showStatus(message, 'error');
    } else {
      alert(message);
    }
    return;
  }
  
  // Salva riferimenti
  currentSelectedFacility = facility;
  currentSelectedMarker = marker;
  
  // Aggiorna contenuto della barra
  updateControlBarContent(facility);
  
  // Mostra la barra
  const controlBar = document.getElementById('fixed-control-bar');
  if (controlBar) {
    controlBar.classList.remove('hidden');
    controlBar.classList.add('visible');
    controlBarVisible = true;
    
    // Focus sul dropdown alleanza per usabilità
    setTimeout(() => {
      const allianceSelect = document.getElementById('alliance-select');
      if (allianceSelect) {
        allianceSelect.focus();
      }
    }, 100);
    
    // Scroll per assicurarsi che sia visibile
    controlBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  console.log('✅ Barra controllo mostrata');
}

/**
 * Nasconde la barra controllo
 */
function hideControlBar() {
  console.log('📊 Nascondendo barra controllo...');
  
  const controlBar = document.getElementById('fixed-control-bar');
  if (controlBar) {
    controlBar.classList.remove('visible');
    controlBar.classList.add('hidden');
  }
  
  // Reset stato
  currentSelectedFacility = null;
  currentSelectedMarker = null;
  controlBarVisible = false;
  
  // Nascondi anche warning se visibile
  hideValidationWarning();
  
  console.log('✅ Barra controllo nascosta');
}

/**
 * Aggiorna il contenuto della barra con i dati della facility
 */
function updateControlBarContent(facility) {
  console.log('🔄 Aggiornamento contenuto barra controllo...');
  
  const t = translations[currentLanguage] || translations['en'];
  
  // Aggiorna info facility
  const facilityIcon = document.getElementById('selected-facility-icon');
  const facilityDetails = document.getElementById('selected-facility-details');
  const typeDisplay = document.getElementById('type-display');
  const levelDisplay = document.getElementById('level-display');
  const allianceSelect = document.getElementById('alliance-select');
  
  if (facilityIcon && facilityIcons[facility.Type]) {
    facilityIcon.textContent = facilityIcons[facility.Type];
  }
  
  if (facilityDetails) {
    const coordsText = facility.ingameCoords ? ` (${facility.ingameCoords})` : '';
    facilityDetails.textContent = `${facility.Type} ${facility.Level}${coordsText}`;
  }
  
  if (typeDisplay) {
    typeDisplay.value = facility.Type;
  }
  
  if (levelDisplay) {
    levelDisplay.value = facility.Level;
  }
  
  // Aggiorna dropdown alleanze
  if (allianceSelect) {
    // Clear existing options
    allianceSelect.innerHTML = '';
    
    // Add unassigned option
    const unassignedOption = document.createElement('option');
    unassignedOption.value = '';
    unassignedOption.textContent = t.unassigned || 'Non assegnata';
    allianceSelect.appendChild(unassignedOption);
    
    // Add alliance options
    alliances.forEach(alliance => {
      const option = document.createElement('option');
      option.value = alliance.name;
      option.textContent = alliance.name;
      
      // Aggiungi info sulle assegnazioni correnti
      const currentAssignments = facilityData.filter(f => f.Alliance === alliance.name).length;
      if (currentAssignments > 0) {
        option.textContent += ` (${currentAssignments} ${t.structures || 'strutture'})`;
      }
      
      allianceSelect.appendChild(option);
    });
    
    // Seleziona l'alleanza corrente se assegnata
    if (facility.Alliance) {
      allianceSelect.value = facility.Alliance;
    } else {
      allianceSelect.value = '';
    }
  }
  
  // Aggiorna stato pulsante
  updateAssignButtonState();
  
  console.log('✅ Contenuto barra controllo aggiornato');
}

/**
 * Aggiorna lo stato del pulsante Assegna in base alla selezione
 */
function updateAssignButtonState() {
  const allianceSelect = document.getElementById('alliance-select');
  const assignBtn = document.getElementById('assign-facility-btn');
  const t = translations[currentLanguage] || translations['en'];
  
  if (!allianceSelect || !assignBtn || !currentSelectedFacility) return;
  
  const selectedAlliance = allianceSelect.value;
  const currentAlliance = currentSelectedFacility.Alliance;
  
  // Abilita pulsante solo se c'è un cambio di stato
  if (selectedAlliance !== (currentAlliance || '')) {
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
// SEZIONE 5: GESTIONE ASSEGNAZIONI
// =====================================================================

/**
 * Gestisce il tentativo di assegnazione quando si clicca "Assegna"
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
  
  // Se si sta assegnando a un'alleanza, verifica duplicati
  if (selectedAllianceName) {
    checkForDuplicatesAndProceed(selectedAllianceName);
  } else {
    // Rimozione diretta senza controlli
    executeAssignment(selectedAllianceName);
  }
}

/**
 * Controlla duplicati e procede con l'assegnazione
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
  
  // Nessun duplicato, procedi direttamente
  executeAssignment(allianceName);
}

/**
 * Mostra il warning di validazione nella barra controllo
 */
function showValidationWarning(allianceName, duplicateAnalysis) {
  const t = translations[currentLanguage] || translations['en'];
  const warningDiv = document.getElementById('control-validation-warning');
  const warningText = document.getElementById('warning-text');
  
  if (!warningDiv || !warningText) {
    console.error('❌ Elementi warning non trovati');
    executeAssignment(allianceName); // Fallback
    return;
  }
  
  // Calcola dettagli warning
  const buffKey = `${currentSelectedFacility.Type}|${currentSelectedFacility.Level}`;
  const buffValue = buffValues[buffKey] || t.unknownBuff || 'Buff sconosciuto';
  const totalDuplicates = duplicateAnalysis.duplicateCount + 1;
  
  // Genera alternative se disponibili
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
  
  warningText.innerHTML = `
    <strong>${t.duplicateBuffWarning || 'ATTENZIONE: Buff Duplicato!'}</strong><br>
    L'alleanza "<strong>${allianceName}</strong>" avrà <strong>${totalDuplicates}</strong> facility 
    <strong>${currentSelectedFacility.Type} ${currentSelectedFacility.Level}</strong>.<br>
    <strong>${t.wastedBuffs || 'Buff sprecati'}:</strong> ${totalDuplicates - 1}<br>
    <strong>${t.actualBuff || 'Buff effettivo'}:</strong> ${buffValue} (non ${buffValue} × ${totalDuplicates})
    ${alternativesText}
  `;
  
  // Mostra warning
  warningDiv.classList.remove('hidden');
  warningDiv.classList.add('visible');
  
  // Scroll per essere sicuri che sia visibile
  warningDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  console.log('⚠️ Warning duplicati mostrato');
}

/**
 * Nasconde il warning di validazione
 */
function hideValidationWarning() {
  const warningDiv = document.getElementById('control-validation-warning');
  if (warningDiv) {
    warningDiv.classList.remove('visible');
    warningDiv.classList.add('hidden');
  }
}

/**
 * Conferma l'assegnazione nonostante il warning
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
 * Esegue l'assegnazione effettiva usando il sistema esistente
 */
function executeAssignment(allianceName) {
  console.log('⚡ Esecuzione assegnazione:', {
    facility: `${currentSelectedFacility.Type} ${currentSelectedFacility.Level}`,
    alliance: allianceName || 'RIMOZIONE'
  });
  
  // Usa la funzione esistente da markers.js
  if (typeof assignFacilityToAllianceWithValidation === 'function') {
    // Passa il flag per saltare la validazione duplicati (già fatta)
    currentSelectedFacility.Alliance = allianceName;
    
    // Aggiorna visualmente il marker
    if (currentSelectedMarker && typeof renderAllianceIcon === 'function') {
      renderAllianceIcon(currentSelectedFacility);
      
      if (allianceName) {
        currentSelectedMarker.classList.add('assigned');
      } else {
        currentSelectedMarker.classList.remove('assigned');
      }
    }
    
    // Aggiorna UI generale
    if (typeof updateStats === 'function') updateStats();
    if (typeof renderAllianceList === 'function') renderAllianceList();
    if (typeof renderFacilitySummary === 'function') renderFacilitySummary();
    if (typeof renderBuffSummary === 'function') renderBuffSummary();
    
    // Salva dati
    if (typeof saveData === 'function') saveData();
    
    // Feedback utente
    const t = translations[currentLanguage] || translations['en'];
    let message;
    if (allianceName) {
      message = `✅ ${currentSelectedFacility.Type} ${t.assignedTo || 'assegnata a'} ${allianceName}`;
    } else {
      message = `🗑️ ${currentSelectedFacility.Type} ${t.removed || 'rimossa'}`;
    }
    
    if (typeof showStatus === 'function') {
      showStatus(message, 'success');
    }
    
  } else {
    console.error('❌ Funzione assignFacilityToAllianceWithValidation non disponibile');
  }
  
  // Nascondi la barra controllo
  hideControlBar();
  
  console.log('✅ Assegnazione completata');
}

// =====================================================================
// SEZIONE 6: INTEGRAZIONE CON SISTEMA ESISTENTE
// =====================================================================

/**
 * Sostituisce la funzione di click sui marker per usare la barra controllo
 * Questa funzione viene chiamata da markers.js modificato
 */
function handleMarkerClick(facility, marker) {
  console.log('🖱️ Click marker intercettato:', facility.Type, facility.Level);
  
  // Chiudi eventuali barre aperte
  if (controlBarVisible) {
    hideControlBar();
  }
  
  // Mostra la barra controllo per questa facility
  showControlBar(facility, marker);
}

/**
 * Inizializza il sistema barra controllo
 * Chiamata all'avvio dell'app
 */
function initializeFixedControlBarSystem() {
  console.log('🚀 Inizializzazione sistema barra controllo fissa...');
  
  // Crea la barra controllo
  if (!createFixedControlBar()) {
    console.error('❌ Fallita creazione barra controllo');
    return false;
  }
  
  // Esporta funzioni globalmente per integrazione
  window.showControlBar = showControlBar;
  window.hideControlBar = hideControlBar;
  window.handleMarkerClick = handleMarkerClick;
  
  console.log('✅ Sistema barra controllo fissa inizializzato');
  return true;
}

// =====================================================================
// SEZIONE 7: AUTO-INIZIALIZZAZIONE
// =====================================================================

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM caricato - inizializzazione barra controllo...');
  
  // Aspetta un po' per essere sicuri che gli altri moduli siano caricati
  setTimeout(() => {
    initializeFixedControlBarSystem();
  }, 500);
});

// =====================================================================
// FINE FIXED-CONTROL-BAR.JS
// =====================================================================

console.log('✅ Sistema barra controllo fissa caricato');