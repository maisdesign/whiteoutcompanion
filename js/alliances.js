// === GESTIONE ALLEANZE ===
function renderAllianceList() {
  const list = document.getElementById('alliance-list');
  if (!list) return;
  
  list.innerHTML = '';
  
  alliances.forEach((alliance, index) => {
    const li = document.createElement('li');
    li.className = 'alliance-item';
    
    const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
    const t = translations[currentLanguage];
    
    li.innerHTML = `
      <img src="${alliance.icon}" alt="${alliance.name}">
      <span class="alliance-name">${alliance.name}</span>
      <span style="font-size: 11px; color: var(--text-secondary);">${assignedCount} ${t.assigned}</span>
      <div class="alliance-actions">
        <button class="action-btn edit-btn" onclick="editAlliance(${index})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteAlliance(${index})">🗑️</button>
      </div>
    `;
    
    list.appendChild(li);
  });
}

function editAlliance(index) {
  const alliance = alliances[index];
  const t = translations[currentLanguage];
  
  // Crea un modal per la modifica
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  `;
  
  modalContent.innerHTML = `
    <h3 style="color: #4facfe; margin-bottom: 20px; text-align: center;">
      ✏️ ${t.editAlliance || 'Modifica Alleanza'}
    </h3>
    
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-size: 14px; color: var(--text-secondary);">
        ${t.allianceName || 'Nome alleanza'}:
      </label>
      <input type="text" id="edit-alliance-name" value="${alliance.name}" 
             style="width: 100%; padding: 12px; border: 2px solid var(--glass-border); border-radius: 8px; 
                    background: var(--glass-bg); color: var(--text-primary); backdrop-filter: blur(10px);"
             maxlength="30" required>
    </div>
    
    <div style="margin-bottom: 20px;">
      <label style="display: block; margin-bottom: 5px; font-size: 14px; color: var(--text-secondary);">
        ${t.allianceIcon || 'Icona alleanza'} (${t.optional || 'opzionale'}):
      </label>
      <input type="file" id="edit-alliance-icon" accept="image/*"
             style="width: 100%; padding: 8px; border: 2px dashed var(--glass-border); border-radius: 8px; 
                    background: var(--glass-bg); color: var(--text-primary); backdrop-filter: blur(10px);">
      <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
        <img src="${alliance.icon}" alt="${alliance.name}" style="width: 32px; height: 32px; border-radius: 50%;">
        <span style="font-size: 12px; color: var(--text-secondary);">${t.currentIcon || 'Icona attuale'}</span>
      </div>
    </div>
    
    <div style="display: flex; gap: 10px; justify-content: center;">
      <button id="save-alliance-edit" class="btn btn-success" style="flex: 1;">
        ✅ ${t.save || 'Salva'}
      </button>
      <button id="cancel-alliance-edit" class="btn btn-warning" style="flex: 1;">
        ❌ ${t.cancel || 'Annulla'}
      </button>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Focus sul campo nome
  const nameInput = document.getElementById('edit-alliance-name');
  nameInput.focus();
  nameInput.select();
  
  // Event listeners
  document.getElementById('save-alliance-edit').onclick = () => {
    const newName = nameInput.value.trim();
    
    if (!newName) {
      alert(t.enterAllianceName || 'Inserisci un nome per l\'alleanza');
      return;
    }
    
    // Verifica nome duplicato (escluso quello corrente)
    if (alliances.find((a, i) => i !== index && a.name.toLowerCase() === newName.toLowerCase())) {
      alert(t.allianceExists || 'Alleanza già esistente');
      return;
    }
    
    const fileInput = document.getElementById('edit-alliance-icon');
    const file = fileInput.files[0];
    
    const saveChanges = (newIcon = null) => {
      const oldName = alliance.name;
      alliance.name = newName;
      
      if (newIcon) {
        alliance.icon = newIcon;
      }
      
      // Aggiorna il nome nelle facility assegnate
      facilityData.forEach(f => {
        if (f.Alliance === oldName) {
          f.Alliance = newName;
        }
      });
      
      // Aggiorna tutte le icone sui marker
      facilityData.forEach(f => {
        if (f.Alliance === newName && f.marker) {
          renderAllianceIcon(f);
        }
      });
      
      updateAllUI();
      saveData();
      modal.remove();
      
      showStatus(`✅ ${t.allianceUpdated || 'Alleanza aggiornata'}: "${newName}"!`, 'success');
    };
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => saveChanges(evt.target.result);
      reader.readAsDataURL(file);
    } else {
      saveChanges();
    }
  };
  
  document.getElementById('cancel-alliance-edit').onclick = () => {
    modal.remove();
  };
  
  // Chiudi con ESC o click fuori
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function deleteAlliance(index) {
  const alliance = alliances[index];
  const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
  const t = translations[currentLanguage];
  
  let confirmMsg = `Eliminare "${alliance.name}"?`;
  if (assignedCount > 0) {
    confirmMsg += `\nAttenzione: ${assignedCount} strutture assegnate verranno liberate.`;
  }
  
  if (confirm(confirmMsg)) {
    facilityData.forEach(f => {
      if (f.Alliance === alliance.name) {
        delete f.Alliance;
        if (f.marker) {
          renderAllianceIcon(f);
          f.marker.classList.remove('assigned');
        }
      }
    });
    
    alliances.splice(index, 1);
    
    // Forza aggiornamento completo
    updateAllUI();
    saveData();
  }
}

// === AGGIORNAMENTI UI MIGLIORATI ===
function updateStats() {
  const totalAlliancesEl = document.getElementById('total-alliances');
  const assignedFacilitiesEl = document.getElementById('assigned-facilities');
  
  if (totalAlliancesEl) {
    totalAlliancesEl.textContent = alliances.length;
  }
  
  if (assignedFacilitiesEl) {
    assignedFacilitiesEl.textContent = facilityData.filter(f => f.Alliance).length;
  }
}

function updateSummaries() {
  renderFacilitySummary();
  renderBuffSummary();
}

// Nuova funzione per aggiornamento completo UI
function updateAllUI() {
  console.log('🔄 Aggiornamento completo UI...');
  
  // Aggiorna statistiche
  updateStats();
  
  // Aggiorna lista alleanze
  renderAllianceList();
  
  // Aggiorna riepiloghi
  updateSummaries();
  
  // NUOVO: Controlla se aprire automaticamente gli accordion
  setTimeout(checkAndOpenAccordions, 100);
  
  console.log('✅ UI aggiornata completamente');
}

function renderFacilitySummary() {
  const container = document.getElementById('facility-summary');
  if (!container) {
    console.warn('Container facility-summary non trovato');
    return;
  }
  
  const t = translations[currentLanguage];
  
  // Raggruppa per tipo
  const grouped = {};
  facilityData.forEach(f => {
    if (!grouped[f.Type]) grouped[f.Type] = [];
    grouped[f.Type].push(f);
  });
  
  let html = '';
  Object.entries(grouped).forEach(([type, facilities]) => {
    const assigned = facilities.filter(f => f.Alliance).length;
    const total = facilities.length;
    const typeIcon = facilityIcons[type] || '📍';
    
    html += `
      <div style="margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #4facfe;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #4facfe; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">${typeIcon}</span>
            ${type}
          </strong>
          <span style="background: rgba(67, 233, 123, 0.2); padding: 2px 8px; border-radius: 12px; font-size: 12px;">
            ${assigned}/${total} ${t.assigned}
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 5px; font-size: 12px;">
          ${facilities.map(f => 
            `<span style="
              padding: 4px 8px; 
              border-radius: 6px; 
              background: ${f.Alliance ? 'rgba(67, 233, 123, 0.2)' : 'rgba(255,255,255,0.05)'}; 
              color: ${f.Alliance ? '#43e97b' : 'var(--text-secondary)'};
              border: 1px solid ${f.Alliance ? 'rgba(67, 233, 123, 0.3)' : 'rgba(255,255,255,0.1)'};
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="font-size: 10px;">${typeIcon}</span>
              ${f.Level}${f.Alliance ? ' → ' + f.Alliance : ''}
            </span>`
          ).join('')}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">${t.noStructuresLoaded}</p>`;
  
  console.log('📋 Riepilogo strutture aggiornato:', Object.keys(grouped).length, 'tipi');
}

function renderBuffSummary() {
  const container = document.getElementById('buff-summary');
  if (!container) {
    console.warn('Container buff-summary non trovato');
    return;
  }
  
  const t = translations[currentLanguage];
  const byAlliance = {};

  // Raggruppa per alleanza
  facilityData.forEach(f => {
    if (!f.Alliance) return;
    if (!byAlliance[f.Alliance]) byAlliance[f.Alliance] = [];
    byAlliance[f.Alliance].push(f);
  });

  let html = '';
  
  if (Object.keys(byAlliance).length === 0) {
    html = `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">${t.noAllianceAssigned}</p>`;
  } else {
    Object.entries(byAlliance).forEach(([allianceName, facilities]) => {
      const alliance = alliances.find(a => a.name === allianceName);
      const unique = new Set(facilities.map(f => `${f.Type}|${f.Level}`));
      
      // Calcola buff riconosciuti
      const recognizedBuffs = [...unique]
        .map(key => {
          const buffValue = buffValues[key];
          return buffValue ? `${buffValue} ${key.split('|')[0]}` : null;
        })
        .filter(Boolean);
      
      const buffs = recognizedBuffs.length > 0 ? recognizedBuffs.join(', ') : t.noBuffRecognized;

      html += `
        <div style="margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #43e97b;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            ${alliance ? `<img src="${alliance.icon}" alt="${allianceName}" style="width: 24px; height: 24px; border-radius: 50%;">` : ''}
            <strong style="color: #43e97b; font-size: 16px;">${allianceName}</strong>
            <span style="background: rgba(79, 172, 254, 0.2); padding: 2px 8px; border-radius: 12px; font-size: 11px;">
              ${facilities.length} ${t.structures}
            </span>
          </div>
          <div style="margin-bottom: 8px; font-size: 14px; color: ${recognizedBuffs.length > 0 ? '#43e97b' : 'var(--text-secondary)'};">
            <strong>Buff:</strong> ${buffs}
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            <strong>Strutture:</strong> ${[...unique].join(', ')}
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = html;
  
  console.log('⚡ Riepilogo buff aggiornato:', Object.keys(byAlliance).length, 'alleanze');
}

function toggleSection(sectionId) {
  const content = document.getElementById(`${sectionId}-content`);
  const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
  
  if (!content || !toggle) return;
  
  if (content.classList.contains('collapsed-content')) {
    content.classList.remove('collapsed-content');
    content.classList.add('expanded-content');
    toggle.textContent = '▼';
    toggle.classList.remove('collapsed');
  } else {
    content.classList.remove('expanded-content');
    content.classList.add('collapsed-content');
    toggle.textContent = '▶';
    toggle.classList.add('collapsed');
  }
}

// === PERSISTENZA DATI ===
function saveData() {
  const data = {
    alliances: alliances,
    facilityAssignments: facilityData.map(f => ({
      Type: f.Type,
      Level: f.Level,
      x: f.x,
      y: f.y,
      Alliance: f.Alliance
    })),
    calibration: calibrationSettings,
    language: currentLanguage
  };
  
  try {
    localStorage.setItem('whiteout-companion-data', JSON.stringify(data));
    console.log('💾 Dati salvati:', data);
  } catch (error) {
    console.error('Errore nel salvare i dati:', error);
  }
}

function loadData() {
  const saved = localStorage.getItem('whiteout-companion-data');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      
      if (data.alliances) {
        alliances.splice(0, alliances.length, ...data.alliances);
      }
      
      if (data.facilityAssignments) {
        data.facilityAssignments.forEach(saved => {
          const facility = facilityData.find(f => 
            f.Type === saved.Type && 
            f.Level === saved.Level && 
            Math.abs(f.x - saved.x) < 0.1 && 
            Math.abs(f.y - saved.y) < 0.1
          );
          if (facility && saved.Alliance) {
            facility.Alliance = saved.Alliance;
          }
        });
      }
      
      if (data.calibration) {
        calibrationSettings = data.calibration;
        if (calibrationUnlocked) {
          const offsetX = document.getElementById('offsetX');
          const offsetY = document.getElementById('offsetY');
          const scaleX = document.getElementById('scaleX');
          const scaleY = document.getElementById('scaleY');
          
          if (offsetX) offsetX.value = calibrationSettings.offsetX;
          if (offsetY) offsetY.value = calibrationSettings.offsetY;
          if (scaleX) scaleX.value = calibrationSettings.scaleX;
          if (scaleY) scaleY.value = calibrationSettings.scaleY;
        }
      }
      
      // RIMOSSO: Non gestiamo più la lingua qui, è gestita in utilities.js
      // La lingua viene inizializzata automaticamente all'avvio
      
      console.log('📂 Dati caricati:', data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  
  // RIMOSSO: Non serve più questo fallback
  // La lingua è già stata inizializzata in utilities.js
}

// === FUNZIONI EXPORT ===
function exportCSV() {
  const t = translations[currentLanguage];
  const csvContent = "Type,Level,X,Y,Alliance\n" + 
    facilityData.map(f => `${f.Type},${f.Level},${f.x},${f.y},${f.Alliance || ""}`).join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "whiteout_facilities.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  showStatus(t.csvExported || '📊 CSV esportato con successo!', 'success');
}

/* NON PIÙ NECESSARIO: Ora gestito in app.js

function exportPNG() {
  // Chiama la nuova implementazione da utilities.js
  if (typeof exportToPNG === 'function') {
    exportToPNG();
  } else {
    const t = translations[currentLanguage];
    showStatus(t.pngExportNotAvailable || '❌ Funzione export PNG non disponibile', 'error');
  }
}
  */

// === EVENT LISTENERS ===
document.getElementById('alliance-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const t = translations[currentLanguage];
  
  const nameInput = document.getElementById('alliance-name');
  const name = nameInput.value.trim();
  const file = document.getElementById('alliance-icon').files[0];
  
  if (!name) {
    alert(t.enterAllianceName);
    return;
  }
  
  // Verifica unicità nome
  if (alliances.find(a => a.name.toLowerCase() === name.toLowerCase())) {
    alert(t.allianceExists);
    return;
  }
  
  if (alliances.length >= 50) {
    alert(t.maxAlliances);
    return;
  }
  
  // Disabilita form durante processamento
  const submitBtn = document.getElementById('add-alliance-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `⏳ ${t.processing || 'Elaborazione...'}`;
  
  try {
    let finalIcon;
    
    if (file && typeof validateImageFile === 'function' && typeof processImageFile === 'function') {
      // Valida file solo se le funzioni sono disponibili
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        if (typeof showImageValidationErrors === 'function') {
          showImageValidationErrors(validation.errors);
        } else {
          alert('File non valido: ' + validation.errors.join(', '));
        }
        return;
      }
      
      // Mostra progress
      showStatus(`🔄 ${t.processingImage || 'Elaborazione immagine...'}`, 'info', 2000);
      
      // Processa immagine
      const processed = await processImageFile(file, 128, 128, 0.85);
      finalIcon = processed.dataUrl;
      
      // Verifica unicità icona
      if (typeof isIconUnique === 'function' && !isIconUnique(finalIcon)) {
        showStatus(`⚠️ ${t.iconAlreadyUsed || 'Icona già utilizzata, generazione automatica...'}`, 'warning', 3000);
        finalIcon = typeof generateFallbackIcon === 'function' ? generateFallbackIcon(name) : generateDefaultIcon(name);
      }
      
      // Mostra info ottimizzazione
      if (processed.originalSize > processed.processedSize) {
        const savedKB = Math.round((processed.originalSize - processed.processedSize) / 1024);
        showStatus(`✨ ${t.imageOptimized || 'Immagine ottimizzata'}: -${savedKB}KB`, 'success', 3000);
      }
      
    } else {
      // Genera icona automatica (fallback se funzioni avanzate non disponibili)
      finalIcon = typeof generateFallbackIcon === 'function' 
        ? generateFallbackIcon(name) 
        : generateDefaultIcon(name);
    }
    
    // Crea alleanza
    alliances.push({ name, icon: finalIcon });
    
    // Aggiornamento completo UI
    updateAllUI();
    saveData();
    
    // Reset form
    nameInput.value = '';
    document.getElementById('alliance-icon').value = '';
    
    showStatus(`✅ ${t.allianceCreated || 'Alleanza creata'}: "${name}"!`, 'success');
    
  } catch (error) {
    console.error('Errore creazione alleanza:', error);
    if (typeof showImageValidationErrors === 'function') {
      showImageValidationErrors([error.message]);
    } else {
      showStatus(`❌ Errore: ${error.message}`, 'error');
    }
  } finally {
    // Riabilita form
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Funzione fallback per generare icona di default (semplice)
function generateDefaultIcon(name) {
  const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
      <circle cx='12' cy='12' r='12' fill='${color}'/>
      <text x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'>
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return "data:image/svg+xml;base64," + btoa(svg);
};

// Import CSV
document.getElementById('import-file')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const t = translations[currentLanguage];
  
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const csv = evt.target.result;
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert(t.emptyCsv);
        return;
      }
      
      // Reset assegnazioni
      facilityData.forEach(f => delete f.Alliance);
      
      let importedCount = 0;
      const newAlliances = new Set();
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 5) {
          const [type, level, x, y, alliance] = values;
          
          if (alliance.trim()) {
            newAlliances.add(alliance.trim());
          }
          
          const facility = facilityData.find(f => 
            f.Type === type && 
            f.Level === level && 
            Math.abs(f.x - parseFloat(x)) < 0.1 && 
            Math.abs(f.y - parseFloat(y)) < 0.1
          );
          
          if (facility && alliance.trim()) {
            facility.Alliance = alliance.trim();
            importedCount++;
          }
        }
      }
      
      // Crea nuove alleanze
      newAlliances.forEach(allianceName => {
        if (!alliances.find(a => a.name.toLowerCase() === allianceName.toLowerCase())) {
          const defaultIcon = "data:image/svg+xml;base64," + btoa(`
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
              <circle cx='12' cy='12' r='12' fill='${getRandomColor()}'/>
              <text x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'>
                ${allianceName.charAt(0).toUpperCase()}
              </text>
            </svg>
          `);
          alliances.push({ name: allianceName, icon: defaultIcon });
        }
      });
      
      // Aggiorna tutti i marker
      facilityData.forEach(f => {
        if (f.marker) {
          renderAllianceIcon(f);
          if (f.Alliance) {
            f.marker.classList.add('assigned');
          } else {
            f.marker.classList.remove('assigned');
          }
        }
      });
      
      // Aggiornamento completo UI
      updateAllUI();
      saveData();
      
      showStatus(`✅ ${t.importSuccess || 'Importazione completata'}: ${importedCount} assegnazioni!`, 'success');
      
    } catch (error) {
      console.error("Import error:", error);
      alert(t.importError);
    }
  };
  
  reader.readAsText(file);
  e.target.value = '';
});

// Auto-apply calibration
['offsetX', 'offsetY', 'scaleX', 'scaleY'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('blur', () => {
      if (calibrationUnlocked) {
        updateCalibrationFromInputs();
        recreateAllMarkers();
      }
    });
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && calibrationUnlocked) {
        updateCalibrationFromInputs();
        recreateAllMarkers();
      }
    });
  }
});

// Password input enter key
document.getElementById('calibration-password')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    checkCalibrationPassword();
  }
});

// Close dropdowns when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!e.target.closest('.marker') && !e.target.closest('.marker-dropdown')) {
    setTimeout(() => {
      closeAllDropdowns();
    }, 50);
  }
});

// === INIZIALIZZAZIONE ===
// Funzione helper per inizializzazione marker con piccolo ritardo
function initializeMarkersWithDelay() {
  // Piccolo ritardo per assicurarsi che la mappa sia completamente renderizzata
  setTimeout(() => {
    console.log('🎯 Avvio inizializzazione marker...');
    
    let createdCount = 0;
    facilityData.forEach((facility, index) => {
      try {
        const marker = createMarker(facility, index);
        if (marker) createdCount++;
      } catch (error) {
        console.error(`Errore creando marker per facility ${index}:`, error, facility);
      }
    });
    
    console.log(`✅ Inizializzazione marker completata: ${createdCount}/${facilityData.length} marker creati`);
    
    // Aggiorna l'interfaccia
    updateAllUI();
    
    // Mostra messaggio di successo
    const t = translations[currentLanguage] || translations['en'];
    const message = t.appLoaded ? t.appLoaded.replace('{count}', createdCount) : `🎯 App loaded! ${createdCount} structures.`;
    if (typeof showStatus === 'function') {
      showStatus(message, 'success');
    }
    
  }, 100); // 100ms di ritardo
};
// Inizializza al caricamento del DOM

document.addEventListener('DOMContentLoaded', () => {
  console.log('=== WHITEOUT COMPANION INIT ===');
  
  // Carica i dati salvati
  loadData();
  
  // NUOVO: Ascolta gli eventi del sistema mappa moderno
  document.addEventListener('mapLoaded', () => {
    console.log('📍 Evento mapLoaded ricevuto - inizializzazione marker...');
    initializeMarkersWithDelay();
  });
  
  document.addEventListener('mapFallback', () => {
    console.log('📍 Evento mapFallback ricevuto - inizializzazione marker...');
    initializeMarkersWithDelay();
  });
  
  // Fallback robusto: se dopo 5 secondi non abbiamo marker, forza l'inizializzazione
  setTimeout(() => {
    const existingMarkers = document.querySelectorAll('.marker').length;
    if (existingMarkers === 0) {
      console.log('⏰ Timeout fallback - inizializzazione marker di emergenza...');
      initializeMarkersWithDelay();
    }
  }, 5000);
  
  function initializeMarkers() {
    console.log('Initializing markers...');
    
    let createdCount = 0;
    facilityData.forEach((facility, index) => {
      try {
        const marker = createMarker(facility, index);
        if (marker) createdCount++;
      } catch (error) {
        console.error(`Error creating marker for facility ${index}:`, error, facility);
      }
    });
    
    console.log(`Created ${createdCount} markers out of ${facilityData.length} facilities`);
    
    // Aggiornamento completo UI
    updateAllUI();
    
    // NUOVO: Inizializza il sistema lingua
    if (typeof initializeLanguageSystem === 'function') {
      initializeLanguageSystem();
    } else {
      // Fallback se la funzione non è ancora caricata
      setTimeout(() => {
        if (typeof initializeLanguageSystem === 'function') {
          initializeLanguageSystem();
        } else {
          // Fallback finale
          updateUILanguage();
          updateLanguageButtons();
        }
      }, 100);
    }
    
    // Messaggio di caricamento completato (ora localizzato)
    setTimeout(() => {
      const t = translations[currentLanguage] || translations['en'];
      const message = t.appLoaded ? t.appLoaded.replace('{count}', createdCount) : `🎯 App loaded! ${createdCount} structures.`;
      showStatus(message, 'success');
    }, 500);
    
    console.log('📊 Stato finale inizializzazione:');
    console.log('  - Calibrazione caricata:', calibrationSettings);
    console.log('  - Alleanze caricate:', alliances.length);
    console.log('  - Strutture totali:', facilityData.length);
    console.log('  - Marker creati:', createdCount);
    console.log('  - Lingua attiva:', currentLanguage);
    console.log('  - Lingua rilevata browser:', detectDeviceLanguage());
  }
});

// === AUTO-APERTURA ACCORDION ===
function checkAndOpenAccordions() {
  // Apri facility summary se ci sono strutture assegnate
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  if (assignedFacilities > 0) {
    const facilityContent = document.getElementById('facility-summary-content');
    const facilityToggle = document.getElementById('facility-toggle');
    if (facilityContent && facilityToggle && facilityContent.classList.contains('collapsed-content')) {
      facilityContent.classList.remove('collapsed-content');
      facilityContent.classList.add('expanded-content');
      facilityToggle.textContent = '▼';
      facilityToggle.classList.remove('collapsed');
      console.log('📋 Auto-apertura facility summary per dati presenti');
    }
  }
  
  // Apri buff summary se ci sono alleanze con assegnazioni
  const alliancesWithAssignments = alliances.filter(alliance => 
    facilityData.some(f => f.Alliance === alliance.name)
  ).length;
  if (alliancesWithAssignments > 0) {
    const buffContent = document.getElementById('buff-summary-content');
    const buffToggle = document.getElementById('buff-toggle');
    if (buffContent && buffToggle && buffContent.classList.contains('collapsed-content')) {
      buffContent.classList.remove('collapsed-content');
      buffContent.classList.add('expanded-content');
      buffToggle.textContent = '▼';
      buffToggle.classList.remove('collapsed');
      console.log('⚡ Auto-apertura buff summary per dati presenti');
    }
  }
}

// Modifica la funzione updateAllUI esistente per includere il check accordion:
// Trova la funzione updateAllUI e aggiungi questa riga alla fine:

// Nella funzione updateAllUI esistente, aggiungi questa riga dopo updateSummaries():
// setTimeout(checkAndOpenAccordions, 100);

// === SISTEMA RESET ASSEGNAZIONI ===
let undoState = null;
let undoTimeout = null;

function showResetConfirmation() {
  const t = translations[currentLanguage];
  
  // Conta assegnazioni attuali
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  const totalFacilities = facilityData.length;
  const alliancesWithAssignments = alliances.filter(alliance => 
    facilityData.some(f => f.Alliance === alliance.name)
  ).length;
  
  if (assignedFacilities === 0) {
    showStatus(t.noAssignmentsToReset || '⚠️ Nessuna assegnazione da resettare', 'warning');
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'reset-modal';
  modal.id = 'reset-modal';
  
  modal.innerHTML = `
    <div class="reset-modal-content">
      <div class="reset-warning">⚠️</div>
      
      <h2 style="color: #ff6b6b; margin-bottom: 15px; font-size: 24px;">
        ${t.resetConfirmationTitle || '🗑️ Conferma Reset Totale'}
      </h2>
      
      <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">
        ${t.resetConfirmationMessage || 'Questa azione rimuoverà TUTTE le assegnazioni di alleanze dalle strutture. Sarà possibile annullare per 10 secondi.'}
      </p>
      
      <div class="reset-stats">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
          <div>
            <div style="font-size: 24px; color: #ff6b6b; font-weight: bold;">${assignedFacilities}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${t.assignedStructures || 'Strutture Assegnate'}</div>
          </div>
          <div>
            <div style="font-size: 24px; color: #4facfe; font-weight: bold;">${alliancesWithAssignments}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${t.alliancesAffected || 'Alleanze Coinvolte'}</div>
          </div>
          <div>
            <div style="font-size: 24px; color: #43e97b; font-weight: bold;">${totalFacilities - assignedFacilities}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${t.willRemainFree || 'Rimarranno Libere'}</div>
          </div>
        </div>
      </div>
      
      <p style="color: #ff6b6b; font-weight: bold; margin-bottom: 15px;">
        ${t.resetWarning || '⚠️ Per confermare, digita "RESET" qui sotto:'}
      </p>
      
      <input type="text" class="reset-confirmation-input" id="reset-confirmation-input" 
             placeholder="${t.typeReset || 'Digita RESET'}" maxlength="10">
      
      <div class="reset-buttons">
        <button class="btn btn-danger" id="confirm-reset-btn" disabled style="opacity: 0.5;">
          🗑️ ${t.confirmReset || 'CONFERMA RESET'}
        </button>
        <button class="btn btn-primary" id="cancel-reset-btn">
          ❌ ${t.cancel || 'Annulla'}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Focus sull'input
  const input = document.getElementById('reset-confirmation-input');
  const confirmBtn = document.getElementById('confirm-reset-btn');
  
  input.focus();
  
  // Abilita pulsante solo quando si digita "RESET"
  input.addEventListener('input', () => {
    const value = input.value.toUpperCase();
    if (value === 'RESET') {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.background = 'linear-gradient(135deg, #ff5252 0%, #c82333 100%)';
    } else {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #dc3545 100%)';
    }
  });
  
  // Enter per confermare
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !confirmBtn.disabled) {
      confirmReset();
    }
  });
  
  // Event listeners
  confirmBtn.onclick = confirmReset;
  document.getElementById('cancel-reset-btn').onclick = () => modal.remove();
  
  // Chiudi con ESC o click fuori
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function confirmReset() {
  const t = translations[currentLanguage];
  const modal = document.getElementById('reset-modal');
  
  console.log('🗑️ Avvio reset totale assegnazioni...');
  
  // Salva stato per undo
  saveUndoState();
  
  let resetCount = 0;
  
  // Reset di tutte le assegnazioni
  facilityData.forEach(facility => {
    if (facility.Alliance) {
      delete facility.Alliance;
      resetCount++;
      
      // Aggiorna marker visualmente
      if (facility.marker) {
        facility.marker.classList.remove('assigned');
        // Rimuovi icona alleanza
        const allianceIcons = facility.marker.querySelectorAll('img');
        allianceIcons.forEach(icon => icon.remove());
      }
    }
  });
  
  // Chiudi modal
  modal.remove();
  
  // Aggiorna UI
  updateAllUI();
  saveData();
  
  // Mostra notifica di successo con undo
  showUndoNotification(resetCount);
  
  console.log(`✅ Reset completato: ${resetCount} assegnazioni rimosse`);
}

function saveUndoState() {
  // Salva lo stato attuale delle assegnazioni
  undoState = facilityData.map(f => ({
    Type: f.Type,
    Level: f.Level,
    x: f.x,
    y: f.y,
    Alliance: f.Alliance
  })).filter(f => f.Alliance); // Solo quelle assegnate
  
  console.log('💾 Stato undo salvato:', undoState.length, 'assegnazioni');
}

function showUndoNotification(resetCount) {
  const t = translations[currentLanguage];
  
  // Rimuovi notifica precedente se esiste
  const existingNotification = document.getElementById('undo-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = 'undo-notification';
  notification.id = 'undo-notification';
  
  notification.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: bold; margin-bottom: 5px;">
        ✅ ${t.resetCompleted || 'Reset Completato'}
      </div>
      <div style="font-size: 12px; opacity: 0.9;">
        ${resetCount} ${t.assignmentsRemoved || 'assegnazioni rimosse'}
      </div>
    </div>
    <button class="btn btn-warning" onclick="undoReset()" style="font-size: 12px; padding: 8px 12px;">
      ↩️ ${t.undo || 'Annulla'}
    </button>
    <div class="undo-countdown" id="undo-countdown">10</div>
  `;
  
  document.body.appendChild(notification);
  
  // Countdown 10 secondi
  let countdown = 10;
  const countdownEl = document.getElementById('undo-countdown');
  
  undoTimeout = setInterval(() => {
    countdown--;
    if (countdownEl) {
      countdownEl.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearUndoState();
      notification.remove();
    }
  }, 1000);
  
  // Auto-rimozione dopo 10 secondi
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
      clearUndoState();
    }
  }, 10000);
}

function undoReset() {
  const t = translations[currentLanguage];
  
  if (!undoState) {
    showStatus(t.undoNotAvailable || '❌ Annullamento non disponibile', 'error');
    return;
  }
  
  console.log('↩️ Ripristino assegnazioni precedenti...');
  
  let restoredCount = 0;
  
  // Ripristina le assegnazioni salvate
  undoState.forEach(savedFacility => {
    const facility = facilityData.find(f => 
      f.Type === savedFacility.Type && 
      f.Level === savedFacility.Level && 
      Math.abs(f.x - savedFacility.x) < 0.1 && 
      Math.abs(f.y - savedFacility.y) < 0.1
    );
    
    if (facility) {
      facility.Alliance = savedFacility.Alliance;
      restoredCount++;
      
      // Aggiorna marker visualmente
      if (facility.marker) {
        facility.marker.classList.add('assigned');
        renderAllianceIcon(facility);
      }
    }
  });
  
  // Pulisci stato undo
  clearUndoState();
  
  // Rimuovi notifica
  const notification = document.getElementById('undo-notification');
  if (notification) {
    notification.remove();
  }
  
  // Aggiorna UI
  updateAllUI();
  saveData();
  
  showStatus(`↩️ ${t.undoCompleted || 'Annullamento completato'}: ${restoredCount} ${t.assignmentsRestored || 'assegnazioni ripristinate'}`, 'success');
  
  console.log(`✅ Undo completato: ${restoredCount} assegnazioni ripristinate`);
}

function clearUndoState() {
  if (undoTimeout) {
    clearInterval(undoTimeout);
    undoTimeout = null;
  }
  undoState = null;
  console.log('🧹 Stato undo pulito');
}

// Funzione globale per il pulsante HTML
window.showResetConfirmation = showResetConfirmation;
window.undoReset = undoReset;

// Esponi la funzione exportCSV globalmente
window.exportCSVFunction = exportCSV;

// Esponi altre funzioni chiave che potrebbero essere necessarie
window.importCSVFunction = function(file) {
  // Usa il codice esistente dell'event listener per import
  const reader = new FileReader();
  const t = translations[currentLanguage];
  
  reader.onload = (evt) => {
    try {
      const csv = evt.target.result;
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert(t.emptyCsv || 'CSV vuoto o non valido');
        return;
      }
      
      // Reset assegnazioni
      facilityData.forEach(f => delete f.Alliance);
      
      let importedCount = 0;
      const newAlliances = new Set();
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 5) {
          const [type, level, x, y, alliance] = values;
          
          if (alliance.trim()) {
            newAlliances.add(alliance.trim());
          }
          
          const facility = facilityData.find(f => 
            f.Type === type && 
            f.Level === level && 
            Math.abs(f.x - parseFloat(x)) < 0.1 && 
            Math.abs(f.y - parseFloat(y)) < 0.1
          );
          
          if (facility && alliance.trim()) {
            facility.Alliance = alliance.trim();
            importedCount++;
          }
        }
      }
      
      // Crea nuove alleanze
      newAlliances.forEach(allianceName => {
        if (!alliances.find(a => a.name.toLowerCase() === allianceName.toLowerCase())) {
          const defaultIcon = "data:image/svg+xml;base64," + btoa(`
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
              <circle cx='12' cy='12' r='12' fill='${getRandomColor()}'/>
              <text x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'>
                ${allianceName.charAt(0).toUpperCase()}
              </text>
            </svg>
          `);
          alliances.push({ name: allianceName, icon: defaultIcon });
        }
      });
      
      // Aggiorna tutti i marker
      facilityData.forEach(f => {
        if (f.marker) {
          renderAllianceIcon(f);
          if (f.Alliance) {
            f.marker.classList.add('assigned');
          } else {
            f.marker.classList.remove('assigned');
          }
        }
      });
      
      // Aggiornamento completo UI
      updateAllUI();
      saveData();
      
      showStatus(`✅ ${t.importSuccess || 'Importazione completata'}: ${importedCount} assegnazioni!`, 'success');
      
    } catch (error) {
      console.error("Import error:", error);
      alert(t.importError || 'Errore nell\'importazione del CSV');
    }
  };
  
  reader.readAsText(file);
};

// Debug: verifica che le funzioni siano esposte
console.log('✅ Funzioni CSV esposte globalmente:', {
  exportCSV: typeof window.exportCSVFunction === 'function',
  importCSV: typeof window.importCSVFunction === 'function'
});