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
      // Assicurati che abbiano le classi corrette
      if (!content.classList.contains('expanded-content') && !content.classList.contains('collapsed-content')) {
        content.classList.add('expanded-content');
        toggle.textContent = '▼';
      }
      console.log(`✅ Accordion configurato: ${sectionId}`);
    } else {
      console.warn(`⚠️ Accordion incompleto: ${sectionId}`);
    }
  });
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