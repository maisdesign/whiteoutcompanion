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
  const newName = prompt('Nuovo nome alleanza:', alliance.name);
  if (newName && newName.trim()) {
    const oldName = alliance.name;
    alliance.name = newName.trim();
    
    facilityData.forEach(f => {
      if (f.Alliance === oldName) {
        f.Alliance = newName.trim();
      }
    });
    
    // Forza aggiornamento completo
    updateAllUI();
    saveData();
  }
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
    
    html += `
      <div style="margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #4facfe;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #4facfe; font-size: 14px;">${type}</strong>
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
            ">
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

function exportPNG() {
  const t = translations[currentLanguage];
  showStatus(t.pngExportInDevelopment || '🖼️ Funzione esportazione PNG in sviluppo', 'info');
}

// === EVENT LISTENERS ===
document.getElementById('alliance-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const t = translations[currentLanguage];
  
  const nameInput = document.getElementById('alliance-name');
  const name = nameInput.value.trim();
  const file = document.getElementById('alliance-icon').files[0];
  
  if (!name) {
    alert(t.enterAllianceName);
    return;
  }
  
  if (alliances.find(a => a.name.toLowerCase() === name.toLowerCase())) {
    alert(t.allianceExists);
    return;
  }
  
  if (alliances.length >= 50) {
    alert(t.maxAlliances);
    return;
  }
  
  const processIcon = (iconData) => {
    alliances.push({ name, icon: iconData });
    
    // Aggiornamento completo UI
    updateAllUI();
    saveData();
    
    nameInput.value = '';
    document.getElementById('alliance-icon').value = '';
    showStatus(`✅ ${t.allianceCreated || 'Alleanza creata'}: "${name}"!`, 'success');
  };
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => processIcon(evt.target.result);
    reader.readAsDataURL(file);
  } else {
    const defaultIcon = "data:image/svg+xml;base64," + btoa(`
      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
        <circle cx='12' cy='12' r='12' fill='${getRandomColor()}'/>
        <text x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'>
          ${name.charAt(0).toUpperCase()}
        </text>
      </svg>
    `);
    processIcon(defaultIcon);
  }
});

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
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== WHITEOUT COMPANION INIT ===');
  
  // Carica i dati salvati
  loadData();
  
  const mapImg = document.getElementById('map');
  if (mapImg && mapImg.complete) {
    initializeMarkers();
  } else if (mapImg) {
    mapImg.onload = initializeMarkers;
    mapImg.onerror = () => {
      console.warn('Map image failed to load, proceeding anyway...');
      initializeMarkers();
    };
  } else {
    console.warn('Map element not found');
    initializeMarkers();
  }
  
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