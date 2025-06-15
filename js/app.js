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

// FIX: Rimuovi la ricorsione infinita
window.exportPNG = function() {
  // Chiama direttamente la funzione da utilities.js
  if (typeof exportToPNG === 'function') {
    exportToPNG();
  } else {
    const t = translations[currentLanguage] || { pngExportNotAvailable: 'PNG export not available' };
    console.warn('exportToPNG function not available');
    if (typeof showStatus === 'function') {
      showStatus(t.pngExportNotAvailable || '❌ PNG export not available', 'error');
    } else {
      alert('PNG export not available');
    }
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
    // Verifica che le variabili necessarie esistano
    if (typeof facilityData === 'undefined' || typeof alliances === 'undefined') {
      console.warn('⚠️ Dati non ancora caricati, rimando controllo accordion');
      setTimeout(checkAndOpenAccordions, 500);
      return;
    }
    
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

// === INIZIALIZZAZIONE FUNZIONALITÀ AVANZATE (CON CONTROLLI) ===
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inizializzazione funzionalità avanzate...');
  
  // Ritarda l'inizializzazione per assicurarsi che utilities.js sia caricato
  setTimeout(() => {
    // Aggiungi validazione file in tempo reale (solo se disponibile)
    if (typeof validateImageFile === 'function') {
      initializeFileValidation();
    } else {
      console.warn('⚠️ validateImageFile non disponibile, validazione file disabilitata');
    }
    
    // Aggiungi tooltip informativi
    initializeTooltips();
    
    // Verifica dipendenze export PNG
    checkExportDependencies();
  }, 100);
});

function initializeFileValidation() {
  if (typeof validateImageFile !== 'function') {
    console.warn('⚠️ validateImageFile non disponibile');
    return;
  }
  
  const fileInputs = document.querySelectorAll('input[type="file"]');
  
  fileInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const validation = validateImageFile(file);
        const parent = input.parentElement;
        
        // Rimuovi messaggi precedenti
        const existingMessage = parent.querySelector('.validation-message');
        if (existingMessage) {
          existingMessage.remove();
        }
        
        // Crea messaggio di validazione
        const message = document.createElement('div');
        message.className = 'validation-message';
        
        if (validation.isValid) {
          message.classList.add('success');
          const sizeKB = Math.round(file.size / 1024);
          message.textContent = `✅ File valido (${sizeKB}KB)`;
          input.classList.add('file-input-valid');
          input.classList.remove('file-input-invalid');
        } else {
          message.classList.add('error');
          const t = translations[currentLanguage] || {};
          const errorMessages = validation.errors.map(error => {
            switch(error) {
              case 'formatNotSupported': return t.formatNotSupported || 'Formato non supportato';
              case 'fileTooLarge': return t.fileTooLarge || 'File troppo grande';
              case 'invalidExtension': return t.invalidExtension || 'Estensione non valida';
              default: return error;
            }
          }).join(', ');
          message.textContent = `❌ ${errorMessages}`;
          input.classList.add('file-input-invalid');
          input.classList.remove('file-input-valid');
        }
        
        parent.appendChild(message);
      } catch (error) {
        console.error('Errore validazione file:', error);
      }
    });
  });
}

function initializeTooltips() {
  const t = translations[currentLanguage] || {};
  
  // Tooltip per file input
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    if (!input.nextElementSibling?.classList.contains('file-info-tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.className = 'file-info-tooltip';
      tooltip.textContent = t.fileTooltip || 'JPG, PNG, GIF, WebP - Max 2MB';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(tooltip);
    }
  });
}

function checkExportDependencies() {
  // Precarica html2canvas se non presente e loadHtml2Canvas è disponibile
  if (!window.html2canvas && typeof loadHtml2Canvas === 'function') {
    console.log('📦 Precaricamento html2canvas...');
    loadHtml2Canvas().then(() => {
      console.log('✅ html2canvas caricato');
    }).catch(error => {
      console.warn('⚠️ html2canvas non disponibile:', error);
    });
  }
}

// Verifica funzioni disponibili
window.checkFunctions = function() {
  const functions = [
    'exportCSV',
    'exportPNG', 
    'toggleSection',
    'renderFacilitySummary',
    'renderBuffSummary',
    'updateAllUI',
    'validateImageFile',
    'exportToPNG'
  ];
  
  console.log('🔍 Stato funzioni:');
  functions.forEach(funcName => {
    const exists = typeof window[funcName] === 'function';
    console.log(`  ${funcName}:`, exists ? '✅' : '❌');
  });
};

// Funzione di verifica health per le nuove funzionalità (con controlli sicurezza)
function checkAdvancedFeaturesHealth() {
  const features = {
    imageValidation: typeof validateImageFile === 'function',
    imageProcessing: typeof processImageFile === 'function',
    pngExport: typeof exportToPNG === 'function',
    iconGeneration: typeof generateUniqueAllianceIcon === 'function',
    html2canvas: typeof window.html2canvas !== 'undefined'
  };
  
  console.log('🔍 Stato funzionalità avanzate:', features);
  
  const working = Object.values(features).filter(Boolean).length;
  const total = Object.keys(features).length;
  
  console.log(`✅ ${working}/${total} funzionalità avanzate operative`);
  
  return features;
}

// Aggiungi al debugger globale (con controlli)
if (typeof window.debugWS !== 'undefined') {
  window.debugWS.advanced = {
    health: checkAdvancedFeaturesHealth,
    validateImage: typeof validateImageFile === 'function' ? validateImageFile : null,
    processImage: typeof processImageFile === 'function' ? processImageFile : null,
    generateIcon: typeof generateUniqueAllianceIcon === 'function' ? generateUniqueAllianceIcon : null,
    exportPNG: typeof exportToPNG === 'function' ? exportToPNG : null
  };
}

// Auto-test delle funzionalità al caricamento (solo in debug)
if (window.location.search.includes('debug=true')) {
  setTimeout(() => {
    console.log('🧪 Auto-test funzionalità avanzate...');
    checkAdvancedFeaturesHealth();
  }, 2000);
}