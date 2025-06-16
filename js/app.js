// ===================================================================
// APP.JS - COORDINATORE PRINCIPALE WHITEOUT SURVIVAL COMPANION
// ===================================================================
// Questo file gestisce il coordinamento tra tutti i moduli e espone
// le funzioni globali necessarie per l'interfaccia utente.
// Non implementa logica specifica, ma fa da "direttore d'orchestra"
// tra i vari componenti specializzati.

console.log('🚀 Avvio App.js - Coordinatore Principale');

// ===================================================================
// SEZIONE 1: FUNZIONI GLOBALI PER I PULSANTI HTML
// ===================================================================
// Queste funzioni sono chiamate direttamente dai pulsanti nell'HTML
// attraverso gli attributi onclick="nomeFunction()". Ogni funzione
// controlla se il modulo specifico è caricato prima di procedere.

/**
 * Gestisce l'export CSV quando l'utente clicca il pulsante
 * Verifica che la funzione specifica sia disponibile prima di chiamarla
 */
window.exportCSV = function() {
  console.log('📊 Richiesta export CSV...');
  
  // Verifica che alliances.js abbia esposto la funzione
  if (typeof window.exportCSVFunction === 'function') {
    try {
      window.exportCSVFunction();
      console.log('✅ Export CSV completato con successo');
    } catch (error) {
      console.error('❌ Errore durante export CSV:', error);
      const t = translations[currentLanguage] || {};
      showStatusSafely(`❌ ${t.exportError || 'Errore durante export'}: ${error.message}`, 'error');
    }
  } else {
    // Se la funzione non è disponibile, informiamo l'utente
    console.error('❌ Funzione exportCSVFunction non disponibile');
    showStatusSafely('❌ Funzione Export CSV non caricata correttamente', 'error');
    
    // Debug: mostra quali funzioni CSV sono disponibili
    const csvFunctions = Object.keys(window).filter(key => key.toLowerCase().includes('csv'));
    console.log('🔍 Funzioni CSV disponibili:', csvFunctions);
  }
};

/**
 * Gestisce l'export PNG quando l'utente clicca il pulsante
 * Usa la funzione avanzata da utilities.js se disponibile
 */
window.exportPNG = function() {
  console.log('🖼️ Richiesta export PNG...');
  
  // Verifica che utilities.js abbia esposto la funzione exportToPNG
  if (typeof exportToPNG === 'function') {
    try {
      exportToPNG();
      console.log('✅ Export PNG avviato con successo');
    } catch (error) {
      console.error('❌ Errore durante export PNG:', error);
      const t = translations[currentLanguage] || {};
      showStatusSafely(`❌ ${t.exportError || 'Errore durante export'}: ${error.message}`, 'error');
    }
  } else {
    // Fallback: informa che la funzione non è disponibile
    console.warn('⚠️ Funzione exportToPNG non disponibile');
    const t = translations[currentLanguage] || {};
    showStatusSafely(t.pngExportNotAvailable || '❌ Export PNG non disponibile', 'error');
  }
};

/**
 * Gestisce il toggle delle sezioni accordion (Riepilogo Strutture, Buff, ecc.)
 * Questa funzione è chiamata quando l'utente clicca sui titoli delle sezioni
 */
window.toggleSection = function(sectionId) {
  console.log('🔄 Toggle sezione:', sectionId);
  
  // Trova gli elementi della sezione
  const content = document.getElementById(`${sectionId}-content`);
  const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
  
  // Verifica che gli elementi esistano
  if (!content || !toggle) {
    console.warn('⚠️ Elementi accordion non trovati per:', sectionId);
    return;
  }
  
  // Gestisce il toggle tra stato aperto e chiuso
  if (content.classList.contains('collapsed-content')) {
    // Apri la sezione
    content.classList.remove('collapsed-content');
    content.classList.add('expanded-content');
    toggle.textContent = '▼';
    toggle.classList.remove('collapsed');
    console.log('✅ Sezione espansa:', sectionId);
  } else {
    // Chiudi la sezione
    content.classList.remove('expanded-content');
    content.classList.add('collapsed-content');
    toggle.textContent = '▶';
    toggle.classList.add('collapsed');
    console.log('✅ Sezione collassata:', sectionId);
  }
};

// ===================================================================
// SEZIONE 2: GESTIONE IMPORT CSV
// ===================================================================
// L'import CSV è più complesso perché richiede la gestione di file
// e l'elaborazione di dati. Questa sezione gestisce l'intero processo.

/**
 * Elabora il file CSV caricato dall'utente
 * Questa funzione è chiamata dall'event listener sull'input file
 */
function processImportedCSV(file) {
  console.log('📥 Elaborazione file CSV:', file.name, `(${Math.round(file.size/1024)}KB)`);
  
  // Verifica che il file sia del tipo corretto
  if (!file.name.toLowerCase().endsWith('.csv')) {
    const t = translations[currentLanguage] || {};
    showStatusSafely('❌ File deve essere in formato CSV', 'error');
    return;
  }
  
  // Verifica che il modulo di import sia disponibile
  if (typeof window.importCSVFunction === 'function') {
    try {
      window.importCSVFunction(file);
      console.log('✅ Import CSV avviato con successo');
    } catch (error) {
      console.error('❌ Errore durante import CSV:', error);
      const t = translations[currentLanguage] || {};
      showStatusSafely(`❌ ${t.importError || 'Errore durante import'}: ${error.message}`, 'error');
    }
  } else {
    console.error('❌ Funzione importCSVFunction non disponibile');
    showStatusSafely('❌ Funzione Import CSV non caricata correttamente', 'error');
  }
}

// ===================================================================
// SEZIONE 3: INIZIALIZZAZIONE ACCORDION
// ===================================================================
// Gli accordion (sezioni pieghevoli) devono essere inizializzati
// correttamente al caricamento della pagina

/**
 * Inizializza tutti gli accordion al caricamento della pagina
 * Li imposta nello stato chiuso di default
 */
function initializeAccordions() {
  console.log('🔧 Inizializzazione accordion...');
  
  // Lista delle sezioni accordion presenti nell'app
  const accordionSections = ['facility-summary', 'buff-summary'];
  
  accordionSections.forEach(sectionId => {
    const content = document.getElementById(`${sectionId}-content`);
    const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
    
    if (content && toggle) {
      // Imposta stato iniziale: chiuso
      content.classList.remove('expanded-content');
      content.classList.add('collapsed-content');
      toggle.textContent = '▶';
      toggle.classList.add('collapsed');
      
      console.log(`✅ Accordion inizializzato (chiuso): ${sectionId}`);
    } else {
      console.warn(`⚠️ Accordion incompleto: ${sectionId}`);
    }
  });
}

/**
 * Controlla se ci sono dati e apre automaticamente gli accordion pertinenti
 * Questa funzione viene chiamata dopo che i dati sono stati caricati
 */
function autoOpenAccordionsIfDataPresent() {
  // Attende che i dati siano disponibili
  if (typeof facilityData === 'undefined' || typeof alliances === 'undefined') {
    console.log('⏳ Dati non ancora disponibili, rimando controllo accordion...');
    setTimeout(autoOpenAccordionsIfDataPresent, 500);
    return;
  }
  
  console.log('🔍 Controllo automatico apertura accordion...');
  
  // Apri facility summary se ci sono strutture assegnate
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  if (assignedFacilities > 0) {
    const facilityContent = document.getElementById('facility-summary-content');
    const facilityToggle = document.getElementById('facility-toggle');
    
    if (facilityContent && facilityToggle) {
      facilityContent.classList.remove('collapsed-content');
      facilityContent.classList.add('expanded-content');
      facilityToggle.textContent = '▼';
      facilityToggle.classList.remove('collapsed');
      console.log('📋 Auto-apertura facility summary:', assignedFacilities, 'strutture assegnate');
    }
  }
  
  // Apri buff summary se ci sono alleanze con assegnazioni
  const alliancesWithAssignments = alliances.filter(alliance => 
    facilityData.some(f => f.Alliance === alliance.name)
  ).length;
  
  if (alliancesWithAssignments > 0) {
    const buffContent = document.getElementById('buff-summary-content');
    const buffToggle = document.getElementById('buff-toggle');
    
    if (buffContent && buffToggle) {
      buffContent.classList.remove('collapsed-content');
      buffContent.classList.add('expanded-content');
      buffToggle.textContent = '▼';
      buffToggle.classList.remove('collapsed');
      console.log('⚡ Auto-apertura buff summary:', alliancesWithAssignments, 'alleanze attive');
    }
  }
}

// ===================================================================
// SEZIONE 4: FUNZIONI DI UTILITÀ E DIAGNOSTICA
// ===================================================================
// Queste funzioni aiutano con il debug e la manutenzione dell'app

/**
 * Versione sicura di showStatus che non va in errore se la funzione non esiste
 * Fornisce sempre un feedback all'utente, anche in caso di problemi
 */
function showStatusSafely(message, type = 'info', duration = 4000) {
  // Prova a usare la funzione avanzata da utilities.js
  if (typeof showStatus === 'function') {
    showStatus(message, type, duration);
  } else {
    // Fallback: usa console e alert per feedback critico
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Per errori critici, mostra anche un alert
    if (type === 'error') {
      alert(message);
    }
  }
}

/**
 * Verifica lo stato di salute dell'applicazione
 * Utile per diagnosticare problemi durante lo sviluppo
 */
window.checkAppHealth = function() {
  console.log('🔍 === CONTROLLO SALUTE APPLICAZIONE ===');
  
  // Verifica disponibilità moduli principali
  const modules = {
    'utilities.js': typeof showStatus === 'function',
    'alliances.js': typeof window.exportCSVFunction === 'function',
    'markers.js': typeof createMarker === 'function',
    'translations.js': typeof translations !== 'undefined',
    'data.js': typeof facilityData !== 'undefined'
  };
  
  console.log('📦 Moduli caricati:');
  Object.entries(modules).forEach(([module, loaded]) => {
    console.log(`  ${loaded ? '✅' : '❌'} ${module}`);
  });
  
  // Verifica elementi DOM critici
  const criticalElements = [
    'alliance-list', 'total-alliances', 'assigned-facilities',
    'facility-summary', 'buff-summary', 'map-wrapper', 'import-file'
  ];
  
  console.log('🎯 Elementi DOM critici:');
  criticalElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`  ${element ? '✅' : '❌'} #${id}`);
  });
  
  // Verifica stato dati
  if (typeof facilityData !== 'undefined' && typeof alliances !== 'undefined') {
    const assignedCount = facilityData.filter(f => f.Alliance).length;
    console.log('📊 Stato dati:');
    console.log(`  - Alleanze totali: ${alliances.length}`);
    console.log(`  - Strutture totali: ${facilityData.length}`);
    console.log(`  - Strutture assegnate: ${assignedCount}`);
    console.log(`  - Lingua corrente: ${typeof currentLanguage !== 'undefined' ? currentLanguage : 'N/A'}`);
  }
  
  console.log('=== FINE CONTROLLO SALUTE ===');
  
  return modules;
};

/**
 * Forza un aggiornamento completo dell'interfaccia utente
 * Utile quando qualcosa sembra "bloccato"
 */
window.forceUIRefresh = function() {
  console.log('🔄 Forzando refresh completo UI...');
  
  try {
    // Aggiorna statistiche se la funzione è disponibile
    if (typeof updateStats === 'function') {
      updateStats();
      console.log('  ✅ Statistiche aggiornate');
    }
    
    // Aggiorna lista alleanze se la funzione è disponibile
    if (typeof renderAllianceList === 'function') {
      renderAllianceList();
      console.log('  ✅ Lista alleanze aggiornata');
    }
    
    // Aggiorna riepiloghi se la funzione è disponibile
    if (typeof updateSummaries === 'function') {
      updateSummaries();
      console.log('  ✅ Riepiloghi aggiornati');
    } else {
      // Fallback: aggiorna riepiloghi individualmente
      if (typeof renderFacilitySummary === 'function') {
        renderFacilitySummary();
        console.log('  ✅ Riepilogo strutture aggiornato');
      }
      if (typeof renderBuffSummary === 'function') {
        renderBuffSummary();
        console.log('  ✅ Riepilogo buff aggiornato');
      }
    }
    
    // Aggiorna lingua se la funzione è disponibile
    if (typeof updateUILanguage === 'function') {
      updateUILanguage();
      console.log('  ✅ Lingua UI aggiornata');
    }
    
    console.log('✅ Refresh UI completato con successo');
    showStatusSafely('🔄 Interfaccia aggiornata', 'success', 2000);
    
  } catch (error) {
    console.error('❌ Errore durante refresh UI:', error);
    showStatusSafely('❌ Errore durante aggiornamento interfaccia', 'error');
  }
};

// ===================================================================
// SEZIONE 5: INIZIALIZZAZIONE PRINCIPALE
// ===================================================================
// Questa sezione gestisce l'avvio dell'applicazione quando il DOM è pronto

/**
 * Configura gli event listener per l'import CSV
 * Deve essere chiamata dopo che il DOM è completamente caricato
 */
function setupCSVImportListener() {
  console.log('🔧 Configurazione event listener import CSV...');
  
  const importFileInput = document.getElementById('import-file');
  
  if (importFileInput) {
    // Rimuovi eventuali listener esistenti per evitare duplicati
    const newInput = importFileInput.cloneNode(true);
    importFileInput.parentNode.replaceChild(newInput, importFileInput);
    
    // Aggiungi il nuovo event listener
    newInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        processImportedCSV(file);
      }
      // Reset del campo per permettere il reimport dello stesso file
      event.target.value = '';
    });
    
    console.log('✅ Event listener import CSV configurato correttamente');
  } else {
    console.warn('⚠️ Elemento #import-file non trovato - import CSV non disponibile');
  }
}

/**
 * Esegue test di verifica delle funzionalità critiche
 * Aiuta a identificare problemi durante lo sviluppo
 */
function runStartupTests() {
  console.log('🧪 Esecuzione test di avvio...');
  
  // Test funzioni globali
  const globalFunctions = [
    'exportCSV', 'exportPNG', 'toggleSection', 
    'checkAppHealth', 'forceUIRefresh'
  ];
  
  globalFunctions.forEach(funcName => {
    const available = typeof window[funcName] === 'function';
    console.log(`  ${available ? '✅' : '❌'} window.${funcName}`);
  });
  
  // Test funzioni moduli
  const moduleFunctions = [
    { name: 'exportCSVFunction', source: 'alliances.js' },
    { name: 'importCSVFunction', source: 'alliances.js' },
    { name: 'exportToPNG', source: 'utilities.js' },
    { name: 'showStatus', source: 'utilities.js' }
  ];
  
  moduleFunctions.forEach(({ name, source }) => {
    const available = typeof window[name] === 'function';
    console.log(`  ${available ? '✅' : '❌'} ${name} (da ${source})`);
  });
  
  // Test variabili globali critiche
  const globalVars = [
    'facilityData', 'alliances', 'currentLanguage', 'translations'
  ];
  
  globalVars.forEach(varName => {
    const available = typeof window[varName] !== 'undefined';
    console.log(`  ${available ? '✅' : '❌'} ${varName}`);
  });
  
  console.log('🧪 Test di avvio completati');
}

// ===================================================================
// SEZIONE 6: EVENT LISTENER PRINCIPALE
// ===================================================================
// Questa è la parte che si attiva quando la pagina è completamente caricata

document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 DOM caricato - Inizializzazione App.js...');
  
  // Step 1: Inizializza accordion
  initializeAccordions();
  
  // Step 2: Configura import CSV
  setupCSVImportListener();
  
  // Step 3: Controlla apertura automatica accordion (dopo un ritardo)
  setTimeout(autoOpenAccordionsIfDataPresent, 1000);
  
  // Step 4: Esegui test se in modalità debug
  if (window.location.search.includes('debug=true') || window.location.hostname === 'localhost') {
    setTimeout(runStartupTests, 1500);
  }
  
  // Step 5: Messaggio di completamento inizializzazione
  setTimeout(() => {
    console.log('✅ App.js inizializzato completamente');
    
    // Mostra messaggio solo se utilities.js è caricato
    if (typeof showStatus === 'function') {
      const t = translations[currentLanguage] || {};
      const message = t.appReady || '🚀 App pronta per l\'uso';
      showStatus(message, 'success', 3000);
    }
  }, 2000);
});

// ===================================================================
// SEZIONE 7: GESTIONE ERRORI GLOBALI
// ===================================================================
// Cattura errori JavaScript non gestiti per aiutare con il debug

window.addEventListener('error', function(event) {
  console.error('❌ Errore JavaScript non gestito:', {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    error: event.error
  });
  
  // In produzione, potresti voler inviare questi errori a un servizio di logging
});

// ===================================================================
// FINE FILE APP.JS
// ===================================================================

console.log('📄 App.js caricato completamente - In attesa del DOM...');