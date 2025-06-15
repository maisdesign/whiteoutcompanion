// === APP.JS PULITO - COMPATIBILE CON LE NUOVE FUNZIONI ===

// Questo file è ora ridotto al minimo per evitare conflitti
// Le funzioni principali sono gestite da alliances.js e markers.js

// Inizializzazione minimale se necessaria
console.log('📱 App.js caricato - Modalità compatibilità');

// Export di funzioni globali se richieste da index.html
window.exportCSV = function() {
  if (typeof exportCSV === 'function') {
    exportCSV();
  } else {
    console.error('Funzione exportCSV non trovata');
  }
};

window.exportPNG = function() {
  if (typeof exportPNG === 'function') {
    exportPNG();
  } else {
    console.error('Funzione exportPNG non trovata');
  }
};

// Funzioni accordion per fix immediato
window.toggleSection = function(sectionId) {
  const content = document.getElementById(`${sectionId}-content`);
  const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
  
  if (!content || !toggle) {
    console.warn('Elementi accordion non trovati:', sectionId);
    return;
  }
  
  console.log('🔄 Toggle section:', sectionId);
  
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

// Inizializzazione accordion al caricamento
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Inizializzazione accordion...');
  
  // Assicurati che gli accordion siano configurati correttamente
  const sections = ['facility-summary', 'buff-summary'];
  
  sections.forEach(sectionId => {
    const content = document.getElementById(`${sectionId}-content`);
    const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
    
    if (content && toggle) {
      // NUOVO: Imposta come chiuso di default
      content.classList.remove('expanded-content');
      content.classList.add('collapsed-content');
      toggle.textContent = '▶';
      toggle.classList.add('collapsed');
      
      console.log(`✅ Accordion configurato (chiuso): ${sectionId}`);
    } else {
      console.warn(`⚠️ Accordion incompleto: ${sectionId}`);
    }
  });
  
  // Funzione per aprire automaticamente gli accordion quando ci sono dati
  function checkAndOpenAccordions() {
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
      }
    }
  }
  
  // Controlla dopo che i dati sono stati caricati
  setTimeout(checkAndOpenAccordions, 1000);
});

// Verifica funzioni disponibili
window.checkFunctions = function() {
  const functions = [
    'exportCSV',
    'exportPNG', 
    'toggleSection',
    'renderFacilitySummary',
    'renderBuffSummary',
    'updateAllUI'
  ];
  
  console.log('🔍 Stato funzioni:');
  functions.forEach(funcName => {
    console.log(`  ${funcName}:`, typeof window[funcName] === 'function' ? '✅' : '❌');
  });
};