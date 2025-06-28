// ===================================================================
// APP.JS - COORDINATORE PRINCIPALE (PULITO E OTTIMIZZATO)
// ===================================================================
// Questo file gestisce il coordinamento tra tutti i moduli e espone
// le funzioni globali necessarie per l'interfaccia utente.
// 
// VERSIONE PULITA:
// - Rimosse funzioni wrapper ridondanti
// - Semplificata inizializzazione
// - Consolidata gestione stati
// - Mantenute funzionalità core

console.log('🚀 Avvio App.js - Coordinatore Principale (versione ottimizzata)');

// ===================================================================
// SEZIONE 1: FUNZIONI GLOBALI PER I PULSANTI HTML
// ===================================================================
// Queste funzioni sono chiamate direttamente dai pulsanti nell'HTML
// attraverso gli attributi onclick="nomeFunction()".

/**
 * Gestisce l'export CSV quando l'utente clicca il pulsante
 */
window.exportCSV = function() {
  console.log('📊 Richiesta export CSV...');
  
  if (typeof window.exportCSVFunction === 'function') {
    try {
      window.exportCSVFunction();
      console.log('✅ Export CSV completato con successo');
    } catch (error) {
      console.error('❌ Errore durante export CSV:', error);
      if (typeof showStatus === 'function') {
        showStatus(`❌ Errore export: ${error.message}`, 'error');
      }
    }
  } else {
    console.error('❌ Funzione exportCSVFunction non disponibile');
    if (typeof showStatus === 'function') {
      showStatus('❌ Funzione Export CSV non caricata', 'error');
    }
  }
};

/**
 * Gestisce l'export PNG quando l'utente clicca il pulsante
 */
window.exportPNG = function() {
  console.log('🖼️ Richiesta export PNG...');
  
  if (typeof exportToPNG === 'function') {
    try {
      exportToPNG();
      console.log('✅ Export PNG avviato con successo');
    } catch (error) {
      console.error('❌ Errore durante export PNG:', error);
      if (typeof showStatus === 'function') {
        showStatus(`❌ Errore export: ${error.message}`, 'error');
      }
    }
  } else {
    console.warn('⚠️ Funzione exportToPNG non disponibile');
    if (typeof showStatus === 'function') {
      const t = translations[currentLanguage] || {};
      showStatus(t.pngExportNotAvailable || '❌ Export PNG non disponibile', 'error');
    }
  }
};

/**
 * Gestisce il toggle delle sezioni accordion
 */
window.toggleSection = function(sectionId) {
  console.log('🔄 Toggle sezione:', sectionId);
  
  const content = document.getElementById(`${sectionId}-content`);
  const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
  
  if (!content || !toggle) {
    console.warn('⚠️ Elementi accordion non trovati per:', sectionId);
    return;
  }
  
  if (content.classList.contains('collapsed-content')) {
    content.classList.remove('collapsed-content');
    content.classList.add('expanded-content');
    toggle.textContent = '▼';
    toggle.classList.remove('collapsed');
    console.log('✅ Sezione espansa:', sectionId);
  } else {
    content.classList.remove('expanded-content');
    content.classList.add('collapsed-content');
    toggle.textContent = '▶';
    toggle.classList.add('collapsed');
    console.log('✅ Sezione collassata:', sectionId);
  }
};

// ===================================================================
// SEZIONE 2: GESTIONE IMPORT CSV SEMPLIFICATA
// ===================================================================

/**
 * Configura gli event listener per l'import CSV
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
      if (!file) return;
      
      console.log('📥 Elaborazione file CSV:', file.name, `(${Math.round(file.size/1024)}KB)`);
      
      // Verifica tipo file
      if (!file.name.toLowerCase().endsWith('.csv')) {
        if (typeof showStatus === 'function') {
          showStatus('❌ File deve essere in formato CSV', 'error');
        }
        return;
      }
      
      // Processa il file se la funzione è disponibile
      if (typeof window.importCSVFunction === 'function') {
        try {
          window.importCSVFunction(file);
          console.log('✅ Import CSV avviato con successo');
        } catch (error) {
          console.error('❌ Errore durante import CSV:', error);
          if (typeof showStatus === 'function') {
            showStatus(`❌ Errore import: ${error.message}`, 'error');
          }
        }
      } else {
        console.error('❌ Funzione importCSVFunction non disponibile');
        if (typeof showStatus === 'function') {
          showStatus('❌ Funzione Import CSV non caricata', 'error');
        }
      }
      
      // Reset del campo per permettere il reimport dello stesso file
      event.target.value = '';
    });
    
    console.log('✅ Event listener import CSV configurato');
  } else {
    console.warn('⚠️ Elemento #import-file non trovato');
  }
}

// ===================================================================
// SEZIONE 3: INIZIALIZZAZIONE ACCORDION
// ===================================================================

/**
 * Inizializza tutti gli accordion al caricamento della pagina
 */
function initializeAccordions() {
  console.log('🔧 Inizializzazione accordion...');
  
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
 */
function autoOpenAccordionsIfDataPresent() {
  // Verifica disponibilità dati
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
// SEZIONE 4: INIZIALIZZAZIONE PRINCIPALE
// ===================================================================

/**
 * Inizializzazione principale dell'applicazione
 */
function initializeApp() {
  console.log('🎯 Inizializzazione app principale...');
  
  // Step 1: Inizializza accordion
  initializeAccordions();
  
  // Step 2: Configura import CSV
  setupCSVImportListener();
  
  // Step 3: Controlla apertura automatica accordion (dopo un ritardo)
  setTimeout(autoOpenAccordionsIfDataPresent, 1000);
  
  // Step 4: Messaggio di completamento inizializzazione
  setTimeout(() => {
    console.log('✅ App.js inizializzato completamente');
    
    // Mostra messaggio solo se utilities.js è caricato
    if (typeof showStatus === 'function') {
      const t = translations[currentLanguage] || {};
      const message = t.appReady || '🚀 App pronta per l\'uso';
      showStatus(message, 'success', 3000);
    }
  }, 2000);
}

// ===================================================================
// SEZIONE 5: DEBUG E UTILITÀ
// ===================================================================

/**
 * Forza un aggiornamento completo dell'interfaccia utente
 * Utilizza le funzioni da utilities.js se disponibili
 */
window.forceUIRefresh = function() {
  console.log('🔄 Forzando refresh UI...');
  
  // Usa la funzione da utilities.js se disponibile
  if (typeof window.debugWS !== 'undefined' && typeof window.debugWS.refresh === 'function') {
    window.debugWS.refresh();
  } else {
    // Fallback: aggiorna componenti manualmente
    try {
      if (typeof updateStats === 'function') updateStats();
      if (typeof renderAllianceList === 'function') renderAllianceList();
      if (typeof updateSummaries === 'function') updateSummaries();
      if (typeof updateUILanguage === 'function') updateUILanguage();
      
      console.log('✅ Refresh UI completato (fallback)');
      if (typeof showStatus === 'function') {
        showStatus('🔄 Interfaccia aggiornata', 'success', 2000);
      }
    } catch (error) {
      console.error('❌ Errore durante refresh UI:', error);
      if (typeof showStatus === 'function') {
        showStatus('❌ Errore aggiornamento interfaccia', 'error');
      }
    }
  }
};

/**
 * Verifica stato applicazione (usa sistema debug consolidato)
 */
window.checkAppHealth = function() {
  console.log('🔍 Controllo salute applicazione...');
  
  // Usa la funzione debug consolidata da utilities.js se disponibile
  if (typeof window.debugWS !== 'undefined' && typeof window.debugWS.debug === 'function') {
    return window.debugWS.debug();
  } else {
    // Fallback: verifica base
    const totalFacilities = typeof facilityData !== 'undefined' ? facilityData.length : 0;
    const markersOnPage = document.querySelectorAll('.marker').length;
    const assignedCount = typeof facilityData !== 'undefined' 
      ? facilityData.filter(f => f.Alliance).length 
      : 0;
    
    console.log('📊 Stato base:');
    console.log(`  - Alleanze: ${alliances.length}`);
    console.log(`  - Strutture: ${totalFacilities}`);
    console.log(`  - Marker: ${markersOnPage}`);
    console.log(`  - Assegnate: ${assignedCount}`);
    
    return {
      alliances: alliances.length,
      totalFacilities,
      markersOnPage,
      assignedCount,
      language: typeof currentLanguage !== 'undefined' ? currentLanguage : 'N/A'
    };
  }
};

// ===================================================================
// SEZIONE 6: EVENT LISTENER PRINCIPALE
// ===================================================================

/**
 * Inizializzazione quando il DOM è pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 DOM caricato - Inizializzazione App.js...');
  
  // Inizializza l'applicazione
  initializeApp();
  
  // Debug in modalità sviluppo
  if (window.location.search.includes('debug=true') || window.location.hostname === 'localhost') {
    setTimeout(() => {
      console.log('🔧 Modalità debug attiva');
      if (typeof window.checkAppHealth === 'function') {
        window.checkAppHealth();
      }
    }, 1500);
  }
});

// ===================================================================
// SEZIONE 7: GESTIONE ERRORI GLOBALI
// ===================================================================

/**
 * Cattura errori JavaScript non gestiti per aiutare con il debug
 */
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
// LOG FINALE
// ===================================================================

console.log('📄 App.js caricato completamente (versione ottimizzata) - In attesa del DOM...');

// ===================================================================
// SEZIONE 8: BUGFIX LEGENDA
// ===================================================================
// Funzione per mostrare/nascondere la legenda
function toggleLegend() {
      const legend = document.getElementById('map-legend');
      if (legend.classList.contains('hidden')) {
        legend.classList.remove('hidden');
        legend.style.animation = 'fadeIn 0.3s ease';
      } else {
        legend.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => legend.classList.add('hidden'), 300);
      }
    }
