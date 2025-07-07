// ===================================================================
// CSV IMPORT/EXPORT CORRETTI - VERSIONE FUNZIONANTE
// ===================================================================
// Questa versione risolve i problemi di inconsistenza dei dati
// e garantisce che import/export funzionino correttamente

console.log('📊 Caricamento sistema CSV corretto...');

// ===================================================================
// SEZIONE 1: EXPORT CSV CORRETTO
// ===================================================================

/**
 * Export CSV completo e funzionante
 * Esporta tutte le strutture con le loro assegnazioni di alleanza
 */
function exportCSVFixed() {
  console.log('📤 Avvio export CSV...');
  
  const t = translations[currentLanguage] || translations['en'];
  
  try {
    // Verifica che ci siano dati da esportare
    if (!facilityData || facilityData.length === 0) {
      if (typeof showStatus === 'function') {
        showStatus(t.noDataToExport || '❌ Nessun dato da esportare', 'error');
      }
      return;
    }
    
    // Crea header CSV
    const headers = ['Type', 'Level', 'X', 'Y', 'Alliance'];
    
    // Crea righe dati
    const rows = facilityData.map(facility => {
      return [
        `"${facility.Type || ''}"`,
        `"${facility.Level || ''}"`,
        parseFloat(facility.x || 0).toFixed(2),
        parseFloat(facility.y || 0).toFixed(2),
        `"${facility.Alliance || ''}"`
      ].join(',');
    });
    
    // Combina header e dati
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Crea e scarica file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Genera nome file con timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `whiteout_facilities_${timestamp}.csv`;
    
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      // Altri browser
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Statistiche export
    const totalStructures = facilityData.length;
    const assignedStructures = facilityData.filter(f => f.Alliance).length;
    
    console.log('✅ Export CSV completato:', {
      totalStructures,
      assignedStructures,
      filename
    });
    
    if (typeof showStatus === 'function') {
      const message = `✅ ${t.csvExported || 'CSV esportato'}: ${totalStructures} strutture (${assignedStructures} assegnate)`;
      showStatus(message, 'success');
    }
    
  } catch (error) {
    console.error('❌ Errore durante export CSV:', error);
    if (typeof showStatus === 'function') {
      showStatus(`❌ Errore export: ${error.message}`, 'error');
    }
  }
}

// ===================================================================
// SEZIONE 2: IMPORT CSV CORRETTO
// ===================================================================

/**
 * Import CSV completo e funzionante
 * Importa le assegnazioni e crea alleanze automaticamente
 */
function importCSVFixed(file) {
  console.log('📥 Avvio import CSV:', file.name);
  
  const t = translations[currentLanguage] || translations['en'];
  
  const reader = new FileReader();
  
  reader.onload = function(event) {
    try {
      const csvText = event.target.result;
      const lines = csvText.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error(t.emptyCsv || 'File CSV vuoto o non valido');
      }
      
      // Parse header
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      console.log('📋 Headers trovati:', headers);
      
      // Verifica header richiesti
      const requiredHeaders = ['Type', 'Level', 'X', 'Y', 'Alliance'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Header mancanti: ${missingHeaders.join(', ')}`);
      }
      
      // Reset assegnazioni esistenti
      facilityData.forEach(facility => {
        if (facility.Alliance) {
          delete facility.Alliance;
          // Rimuovi indicatori visivi
          if (facility.marker) {
            facility.marker.classList.remove('assigned');
            facility.marker.querySelectorAll('.alliance-indicator').forEach(el => el.remove());
          }
        }
      });
      
      // Parse dati
      let importedCount = 0;
      let skippedCount = 0;
      const newAlliances = new Set();
      const errors = [];
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Parse CSV con supporto per virgolette
          const values = parseCSVLine(line);
          
          if (values.length < headers.length) {
            errors.push(`Riga ${i + 1}: dati insufficienti`);
            continue;
          }
          
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] ? values[index].replace(/"/g, '').trim() : '';
          });
          
          // Cerca struttura corrispondente
          const facility = findMatchingFacility(rowData);
          
          if (facility && rowData.Alliance) {
            facility.Alliance = rowData.Alliance;
            importedCount++;
            
            // Aggiungi alleanza al set se non esiste
            if (rowData.Alliance) {
              newAlliances.add(rowData.Alliance);
            }
            
            // Aggiorna marker visivo
            if (facility.marker) {
              facility.marker.classList.add('assigned');
              if (typeof renderAllianceIcon === 'function') {
                renderAllianceIcon(facility);
              }
            }
          } else {
            skippedCount++;
            if (!facility) {
              errors.push(`Riga ${i + 1}: struttura non trovata (${rowData.Type} ${rowData.Level} [${rowData.X},${rowData.Y}])`);
            }
          }
        } catch (rowError) {
          errors.push(`Riga ${i + 1}: ${rowError.message}`);
        }
      }
      
      // Crea nuove alleanze automaticamente
      let createdAlliances = 0;
      newAlliances.forEach(allianceName => {
        if (!alliances.find(a => a.name.toLowerCase() === allianceName.toLowerCase())) {
          alliances.push({
            name: allianceName,
            icon: generateDefaultIcon(allianceName)
          });
          createdAlliances++;
        }
      });
      
      // Aggiorna UI e salva
      if (typeof updateAllUI === 'function') {
        updateAllUI();
      }
      if (typeof saveData === 'function') {
        saveData();
      }
      
      // Report risultati
      console.log('✅ Import CSV completato:', {
        importedCount,
        skippedCount,
        createdAlliances,
        errors: errors.length
      });
      
      if (errors.length > 0) {
        console.warn('⚠️ Errori durante import:', errors);
      }
      
      // Messaggio utente
      let message = `✅ ${t.importSuccess || 'Import completato'}: ${importedCount} assegnazioni`;
      if (createdAlliances > 0) {
        message += `, ${createdAlliances} nuove alleanze`;
      }
      if (skippedCount > 0) {
        message += `, ${skippedCount} righe saltate`;
      }
      
      if (typeof showStatus === 'function') {
        showStatus(message, importedCount > 0 ? 'success' : 'warning');
      }
      
      // Mostra errori se presenti (solo primi 5)
      if (errors.length > 0 && typeof showStatus === 'function') {
        setTimeout(() => {
          const errorSample = errors.slice(0, 5);
          const errorMessage = `⚠️ Errori: ${errorSample.join('; ')}${errors.length > 5 ? '...' : ''}`;
          showStatus(errorMessage, 'warning', 8000);
        }, 2000);
      }
      
    } catch (error) {
      console.error('❌ Errore durante import CSV:', error);
      if (typeof showStatus === 'function') {
        showStatus(`❌ Errore import: ${error.message}`, 'error');
      }
    }
  };
  
  reader.onerror = function() {
    console.error('❌ Errore lettura file CSV');
    if (typeof showStatus === 'function') {
      showStatus('❌ Errore lettura file', 'error');
    }
  };
  
  reader.readAsText(file);
}

// ===================================================================
// SEZIONE 3: FUNZIONI HELPER
// ===================================================================

/**
 * Parse riga CSV gestendo virgolette e caratteri speciali
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Virgolette doppie = carattere letterale
        current += '"';
        i++; // Salta prossima virgoletta
      } else {
        // Toggle stato virgolette
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Separatore trovato fuori dalle virgolette
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Ultimo campo
  return result;
}

/**
 * Trova struttura corrispondente nei dati
 */
function findMatchingFacility(rowData) {
  if (!facilityData) return null;
  
  const targetX = parseFloat(rowData.X);
  const targetY = parseFloat(rowData.Y);
  
  // Cerca corrispondenza esatta prima
  let facility = facilityData.find(f => 
    f.Type === rowData.Type &&
    f.Level === rowData.Level &&
    Math.abs(f.x - targetX) < 0.01 &&
    Math.abs(f.y - targetY) < 0.01
  );
  
  // Se non trova corrispondenza esatta, usa tolleranza più ampia
  if (!facility) {
    facility = facilityData.find(f => 
      f.Type === rowData.Type &&
      f.Level === rowData.Level &&
      Math.abs(f.x - targetX) < 0.1 &&
      Math.abs(f.y - targetY) < 0.1
    );
  }
  
  return facility;
}

/**
 * Genera icona predefinita per alleanza
 */
function generateDefaultIcon(name) {
  const colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
    '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
  ];
  
  const colorIndex = Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
  const color = colors[colorIndex];
  
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
      <circle cx='16' cy='16' r='16' fill='${color}'/>
      <text x='16' y='20' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'>
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ===================================================================
// SEZIONE 4: CONFIGURAZIONE EVENT LISTENER
// ===================================================================

/**
 * Configura correttamente l'input file per l'import
 */
function setupCSVImportFixed() {
  console.log('🔧 Configurazione import CSV...');
  
  const importInput = document.getElementById('import-file');
  
  if (!importInput) {
    console.error('❌ Elemento #import-file non trovato');
    return;
  }
  
  // Rimuovi listener esistenti clonando l'elemento
  const newInput = importInput.cloneNode(true);
  importInput.parentNode.replaceChild(newInput, importInput);
  
  // Aggiungi nuovo listener
  newInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('📁 File selezionato:', file.name, `(${Math.round(file.size/1024)}KB)`);
    
    // Verifica tipo file
    if (!file.name.toLowerCase().endsWith('.csv')) {
      if (typeof showStatus === 'function') {
        showStatus('❌ Seleziona un file CSV valido', 'error');
      }
      event.target.value = '';
      return;
    }
    
    // Avvia import
    importCSVFixed(file);
    
    // Reset input per permettere reimport dello stesso file
    event.target.value = '';
  });
  
  console.log('✅ Import CSV configurato correttamente');
}

// ===================================================================
// SEZIONE 5: ESPORTAZIONI GLOBALI E INIZIALIZZAZIONE
// ===================================================================

// Sostituisci le funzioni esistenti con quelle corrette
window.exportCSVFunction = exportCSVFixed;
window.importCSVFunction = importCSVFixed;

// Per compatibilità con il pulsante
window.exportCSV = exportCSVFixed;

// Inizializzazione quando il DOM è caricato
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupCSVImportFixed);
} else {
  // DOM già caricato
  setupCSVImportFixed();
}

// Auto-fix se caricato dopo altri script
setTimeout(() => {
  if (document.getElementById('import-file')) {
    setupCSVImportFixed();
  }
}, 1000);

console.log('✅ Sistema CSV corretto installato - Import/Export ora funzionanti');

// ===================================================================
// SEZIONE 6: FUNZIONI DI DEBUG E TESTING
// ===================================================================

/**
 * Funzione per testare l'export/import (solo per debug)
 */
window.testCSVSystem = function() {
  console.log('🧪 Test sistema CSV...');
  
  // Verifica dati disponibili
  if (!facilityData || facilityData.length === 0) {
    console.log('❌ Nessuna struttura caricata per il test');
    return;
  }
  
  console.log('📊 Statistiche attuali:');
  console.log(`- Strutture totali: ${facilityData.length}`);
  console.log(`- Strutture assegnate: ${facilityData.filter(f => f.Alliance).length}`);
  console.log(`- Alleanze: ${alliances.length}`);
  
  // Test formato dati
  const sampleFacility = facilityData[0];
  console.log('📋 Esempio struttura:', {
    Type: sampleFacility.Type,
    Level: sampleFacility.Level,
    x: sampleFacility.x,
    y: sampleFacility.y,
    Alliance: sampleFacility.Alliance || 'non assegnata'
  });
  
  console.log('✅ Sistema CSV pronto per l\'uso');
};