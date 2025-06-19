// =====================================================================
// ALLIANCES.JS - GESTIONE ALLEANZE PULITA E OTTIMIZZATA
// =====================================================================
// Versione semplificata che mantiene tutte le funzionalità core:
// - CRUD alleanze completo
// - Sistema anti-duplicati educativo
// - Export/Import CSV ottimizzato
// - Reset con undo semplificato
// - UI sync consolidata
//
// RIMOSSO: Verbosità eccessiva, funzioni ridondanti, logging dettagliato

console.log('🏰 Caricamento sistema alleanze ottimizzato...');

// =====================================================================
// SEZIONE 1: RENDERING E UI CONSOLIDATA
// =====================================================================

/**
 * Renderizza lista alleanze con contatori integrati
 */
function renderAllianceList() {
  const list = document.getElementById('alliance-list');
  if (!list) return;
  
  const t = translations[currentLanguage] || translations['en'];
  list.innerHTML = '';
  
  alliances.forEach((alliance, index) => {
    const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
    
    const li = document.createElement('li');
    li.className = 'alliance-item';
    li.innerHTML = `
      <img src="${alliance.icon}" alt="${alliance.name}">
      <span class="alliance-name">${alliance.name}</span>
      <span style="font-size: 11px; color: var(--text-secondary);">${assignedCount} ${t.assigned || 'assigned'}</span>
      <div class="alliance-actions">
        <button class="action-btn edit-btn" onclick="editAlliance(${index})">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteAlliance(${index})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });
}

/**
 * Aggiornamento UI consolidato - SINGOLA funzione per tutto
 */
function updateAllUI() {
  // Stats header
  const totalEl = document.getElementById('total-alliances');
  const assignedEl = document.getElementById('assigned-facilities');
  if (totalEl) totalEl.textContent = alliances.length;
  if (assignedEl) assignedEl.textContent = facilityData.filter(f => f.Alliance).length;
  
  // Lista alleanze
  renderAllianceList();
  
  // Riepiloghi
  renderFacilitySummary();
  renderBuffSummary();
  
  // Auto-apertura accordion se ci sono dati
  setTimeout(autoOpenAccordions, 100);
}

/**
 * Riepilogo strutture ottimizzato
 */
function renderFacilitySummary() {
  const container = document.getElementById('facility-summary');
  if (!container) return;
  
  const t = translations[currentLanguage] || translations['en'];
  const grouped = {};
  
  facilityData.forEach(f => {
    if (!grouped[f.Type]) grouped[f.Type] = [];
    grouped[f.Type].push(f);
  });
  
  const html = Object.entries(grouped).map(([type, facilities]) => {
    const assigned = facilities.filter(f => f.Alliance).length;
    const total = facilities.length;
    const typeIcon = facilityIcons[type] || '📍';
    
    const facilitiesList = facilities.map(f => `
      <span style="
        padding: 4px 8px; border-radius: 6px; font-size: 12px;
        background: ${f.Alliance ? 'rgba(67, 233, 123, 0.2)' : 'rgba(255,255,255,0.05)'}; 
        color: ${f.Alliance ? '#43e97b' : 'var(--text-secondary)'};
        border: 1px solid ${f.Alliance ? 'rgba(67, 233, 123, 0.3)' : 'rgba(255,255,255,0.1)'};
        display: inline-flex; align-items: center; gap: 4px; margin: 2px;
      ">
        <span style="font-size: 10px;">${typeIcon}</span>
        ${f.Level}${f.Alliance ? ' → ' + f.Alliance : ''}
      </span>
    `).join('');
    
    return `
      <div style="margin-bottom: 15px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #4facfe;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #4facfe; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">${typeIcon}</span>${type}
          </strong>
          <span style="background: rgba(67, 233, 123, 0.2); padding: 2px 8px; border-radius: 12px; font-size: 12px;">
            ${assigned}/${total} ${t.assigned || 'assigned'}
          </span>
        </div>
        <div style="line-height: 1.4;">${facilitiesList}</div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html || `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">${t.noStructuresLoaded || 'No structures loaded'}</p>`;
}

/**
 * Riepilogo buff ottimizzato
 */
function renderBuffSummary() {
  const container = document.getElementById('buff-summary');
  if (!container) return;
  
  const t = translations[currentLanguage] || translations['en'];
  const byAlliance = {};
  
  facilityData.forEach(f => {
    if (!f.Alliance) return;
    if (!byAlliance[f.Alliance]) byAlliance[f.Alliance] = [];
    byAlliance[f.Alliance].push(f);
  });
  
  if (Object.keys(byAlliance).length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 20px;">${t.noAllianceAssigned || 'No alliance assigned'}</p>`;
    return;
  }
  
  const html = Object.entries(byAlliance).map(([allianceName, facilities]) => {
    const alliance = alliances.find(a => a.name === allianceName);
    const unique = new Set(facilities.map(f => `${f.Type}|${f.Level}`));
    
    const recognizedBuffs = [...unique]
      .map(key => buffValues[key] ? `${buffValues[key]} ${key.split('|')[0]}` : null)
      .filter(Boolean);
    
    const buffs = recognizedBuffs.length > 0 ? recognizedBuffs.join(', ') : t.noBuffRecognized || 'No buff recognized';
    
    return `
      <div style="margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 4px solid #43e97b;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          ${alliance ? `<img src="${alliance.icon}" alt="${allianceName}" style="width: 24px; height: 24px; border-radius: 50%;">` : ''}
          <strong style="color: #43e97b; font-size: 16px;">${allianceName}</strong>
          <span style="background: rgba(79, 172, 254, 0.2); padding: 2px 8px; border-radius: 12px; font-size: 11px;">
            ${facilities.length} ${t.structures || 'structures'}
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
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Auto-apertura accordion intelligente
 */
function autoOpenAccordions() {
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  
  if (assignedFacilities > 0) {
    const facilityContent = document.getElementById('facility-summary-content');
    const facilityToggle = document.getElementById('facility-toggle');
    
    if (facilityContent?.classList.contains('collapsed-content')) {
      facilityContent.classList.remove('collapsed-content');
      facilityContent.classList.add('expanded-content');
      if (facilityToggle) {
        facilityToggle.textContent = '▼';
        facilityToggle.classList.remove('collapsed');
      }
    }
  }
  
  const alliancesWithAssignments = alliances.filter(alliance => 
    facilityData.some(f => f.Alliance === alliance.name)
  ).length;
  
  if (alliancesWithAssignments > 0) {
    const buffContent = document.getElementById('buff-summary-content');
    const buffToggle = document.getElementById('buff-toggle');
    
    if (buffContent?.classList.contains('collapsed-content')) {
      buffContent.classList.remove('collapsed-content');
      buffContent.classList.add('expanded-content');
      if (buffToggle) {
        buffToggle.textContent = '▼';
        buffToggle.classList.remove('collapsed');
      }
    }
  }
}

// =====================================================================
// SEZIONE 2: GESTIONE ALLEANZE CRUD
// =====================================================================

/**
 * Edit alleanza con modal semplificato
 */
function editAlliance(index) {
  const alliance = alliances[index];
  const t = translations[currentLanguage] || translations['en'];
  
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(10px);';
  
  modal.innerHTML = `
    <div style="background: var(--glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--glass-border); border-radius: 16px; padding: 30px; max-width: 400px; width: 90%; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);">
      <h3 style="color: #4facfe; margin-bottom: 20px; text-align: center;">✏️ ${t.editAlliance || 'Edit Alliance'}</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: var(--text-secondary);">${t.allianceName || 'Alliance name'}:</label>
        <input type="text" id="edit-alliance-name" value="${alliance.name}" style="width: 100%; padding: 12px; border: 2px solid var(--glass-border); border-radius: 8px; background: var(--glass-bg); color: var(--text-primary); backdrop-filter: blur(10px);" maxlength="30" required>
      </div>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-size: 14px; color: var(--text-secondary);">${t.allianceIcon || 'Alliance icon'} (${t.optional || 'optional'}):</label>
        <input type="file" id="edit-alliance-icon" accept="image/*" style="width: 100%; padding: 8px; border: 2px dashed var(--glass-border); border-radius: 8px; background: var(--glass-bg); color: var(--text-primary); backdrop-filter: blur(10px);">
        <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
          <img src="${alliance.icon}" alt="${alliance.name}" style="width: 32px; height: 32px; border-radius: 50%;">
          <span style="font-size: 12px; color: var(--text-secondary);">${t.currentIcon || 'Current icon'}</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="save-alliance-edit" class="btn btn-success" style="flex: 1;">✅ ${t.save || 'Save'}</button>
        <button id="cancel-alliance-edit" class="btn btn-warning" style="flex: 1;">❌ ${t.cancel || 'Cancel'}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.getElementById('edit-alliance-name').focus();
  
  // Event handlers
  document.getElementById('save-alliance-edit').onclick = () => {
    const newName = document.getElementById('edit-alliance-name').value.trim();
    if (!newName) return alert(t.enterAllianceName || 'Enter alliance name');
    if (alliances.find((a, i) => i !== index && a.name.toLowerCase() === newName.toLowerCase())) {
      return alert(t.allianceExists || 'Alliance already exists');
    }
    
    const file = document.getElementById('edit-alliance-icon').files[0];
    const oldName = alliance.name;
    
    const saveChanges = (newIcon = null) => {
      alliance.name = newName;
      if (newIcon) alliance.icon = newIcon;
      
      // Aggiorna nome nelle facility
      facilityData.forEach(f => {
        if (f.Alliance === oldName) f.Alliance = newName;
      });
      
      // Aggiorna marker
      facilityData.forEach(f => {
        if (f.Alliance === newName && f.marker && typeof renderAllianceIcon === 'function') {
          renderAllianceIcon(f);
        }
      });
      
      updateAllUI();
      saveData();
      modal.remove();
      if (typeof showStatus === 'function') {
        showStatus(`✅ ${t.allianceUpdated || 'Alliance updated'}: "${newName}"`, 'success');
      }
    };
    
    if (file && typeof processImageFile === 'function') {
      const reader = new FileReader();
      reader.onload = (evt) => saveChanges(evt.target.result);
      reader.readAsDataURL(file);
    } else {
      saveChanges();
    }
  };
  
  document.getElementById('cancel-alliance-edit').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

/**
 * Elimina alleanza con conferma
 */
function deleteAlliance(index) {
  const alliance = alliances[index];
  const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
  const t = translations[currentLanguage] || translations['en'];
  
  let confirmMsg = `${t.deleteConfirm || 'Delete'} "${alliance.name}"?`;
  if (assignedCount > 0) {
    confirmMsg += `\n${t.warning || 'Warning'}: ${assignedCount} ${t.assignedStructures || 'assigned structures will be freed'}.`;
  }
  
  if (confirm(confirmMsg)) {
    // Libera facility assegnate
    facilityData.forEach(f => {
      if (f.Alliance === alliance.name) {
        delete f.Alliance;
        if (f.marker) {
          if (typeof renderAllianceIcon === 'function') renderAllianceIcon(f);
          f.marker.classList.remove('assigned');
        }
      }
    });
    
    alliances.splice(index, 1);
    updateAllUI();
    saveData();
    
    if (typeof showStatus === 'function') {
      showStatus(`🗑️ ${t.allianceDeleted || 'Alliance deleted'}: "${alliance.name}"`, 'info');
    }
  }
}

// =====================================================================
// SEZIONE 3: PERSISTENZA DATI
// =====================================================================

/**
 * Salva dati in localStorage
 */
function saveData() {
  const data = {
    alliances: alliances,
    facilityAssignments: facilityData.map(f => ({
      Type: f.Type, Level: f.Level, x: f.x, y: f.y, Alliance: f.Alliance
    })),
    calibration: calibrationSettings,
    language: currentLanguage
  };
  
  try {
    localStorage.setItem('whiteout-companion-data', JSON.stringify(data));
  } catch (error) {
    console.error('Errore salvataggio:', error);
  }
}

/**
 * Carica dati da localStorage
 */
function loadData() {
  const saved = localStorage.getItem('whiteout-companion-data');
  if (!saved) return;
  
  try {
    const data = JSON.parse(saved);
    
    if (data.alliances) {
      alliances.splice(0, alliances.length, ...data.alliances);
    }
    
    if (data.facilityAssignments) {
      data.facilityAssignments.forEach(saved => {
        const facility = facilityData.find(f => 
          f.Type === saved.Type && f.Level === saved.Level && 
          Math.abs(f.x - saved.x) < 0.1 && Math.abs(f.y - saved.y) < 0.1
        );
        if (facility && saved.Alliance) {
          facility.Alliance = saved.Alliance;
        }
      });
    }
    
    if (data.calibration) {
      calibrationSettings = data.calibration;
      if (calibrationUnlocked) {
        ['offsetX', 'offsetY', 'scaleX', 'scaleY'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = calibrationSettings[id];
        });
      }
    }
  } catch (error) {
    console.error('Errore caricamento:', error);
  }
}

// =====================================================================
// SEZIONE 4: EXPORT/IMPORT OTTIMIZZATO
// =====================================================================

/**
 * Export CSV semplificato
 */
function exportCSV() {
  const t = translations[currentLanguage] || translations['en'];
  const csvContent = "Type,Level,X,Y,Alliance\n" + 
    facilityData.map(f => `${f.Type},${f.Level},${f.x},${f.y},${f.Alliance || ""}`).join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "whiteout_facilities.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  if (typeof showStatus === 'function') {
    showStatus(t.csvExported || '📊 CSV exported successfully!', 'success');
  }
}

/**
 * Genera icona alleanza automatica
 */
function generateDefaultIcon(name) {
  const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9'];
  const color = colors[Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>
      <circle cx='12' cy='12' r='12' fill='${color}'/>
      <text x='12' y='16' text-anchor='middle' fill='white' font-family='Arial' font-size='14' font-weight='bold'>
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return "data:image/svg+xml;base64," + btoa(svg);
}

// =====================================================================
// SEZIONE 5: SISTEMA RESET CON UNDO SEMPLIFICATO
// =====================================================================

let undoState = null;
let undoTimeout = null;

/**
 * Mostra conferma reset semplificata
 */
function showResetConfirmation() {
  const t = translations[currentLanguage] || translations['en'];
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  
  if (assignedFacilities === 0) {
    if (typeof showStatus === 'function') {
      showStatus(t.noAssignmentsToReset || '⚠️ No assignments to reset', 'warning');
    }
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'reset-modal';
  modal.innerHTML = `
    <div class="reset-modal-content">
      <div class="reset-warning">⚠️</div>
      <h2 style="color: #ff6b6b; margin-bottom: 15px;">🗑️ ${t.resetConfirmationTitle || 'Confirm Total Reset'}</h2>
      <p style="margin-bottom: 20px;">${t.resetConfirmationMessage || 'This will remove ALL alliance assignments. You can undo for 10 seconds.'}</p>
      <div class="reset-stats" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <div style="font-size: 24px; color: #ff6b6b; font-weight: bold;">${assignedFacilities}</div>
        <div style="font-size: 12px;">${t.assignedStructures || 'Assigned Structures'}</div>
      </div>
      <p style="color: #ff6b6b; font-weight: bold; margin-bottom: 15px;">⚠️ ${t.resetWarning || 'Type "RESET" to confirm:'}</p>
      <input type="text" class="reset-confirmation-input" id="reset-confirmation-input" placeholder="${t.typeReset || 'Type RESET'}" maxlength="10">
      <div class="reset-buttons">
        <button class="btn btn-danger" id="confirm-reset-btn" disabled style="opacity: 0.5;">🗑️ ${t.confirmReset || 'CONFIRM RESET'}</button>
        <button class="btn btn-primary" id="cancel-reset-btn">❌ ${t.cancel || 'Cancel'}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const input = document.getElementById('reset-confirmation-input');
  const confirmBtn = document.getElementById('confirm-reset-btn');
  
  input.focus();
  input.oninput = () => {
    const enabled = input.value.toUpperCase() === 'RESET';
    confirmBtn.disabled = !enabled;
    confirmBtn.style.opacity = enabled ? '1' : '0.5';
  };
  
  input.onkeypress = (e) => {
    if (e.key === 'Enter' && !confirmBtn.disabled) confirmReset();
  };
  
  confirmBtn.onclick = confirmReset;
  document.getElementById('cancel-reset-btn').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

/**
 * Conferma reset
 */
function confirmReset() {
  const modal = document.getElementById('reset-modal') || document.querySelector('.reset-modal');
  
  // Salva stato per undo
  undoState = facilityData.map(f => ({
    Type: f.Type, Level: f.Level, x: f.x, y: f.y, Alliance: f.Alliance
  })).filter(f => f.Alliance);
  
  let resetCount = 0;
  facilityData.forEach(facility => {
    if (facility.Alliance) {
      delete facility.Alliance;
      resetCount++;
      if (facility.marker) {
        facility.marker.classList.remove('assigned');
        facility.marker.querySelectorAll('img').forEach(icon => icon.remove());
      }
    }
  });
  
  if (modal) modal.remove();
  updateAllUI();
  saveData();
  showUndoNotification(resetCount);
}

/**
 * Mostra notifica undo
 */
function showUndoNotification(resetCount) {
  const t = translations[currentLanguage] || translations['en'];
  
  const notification = document.createElement('div');
  notification.className = 'undo-notification';
  notification.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: bold; margin-bottom: 5px;">✅ ${t.resetCompleted || 'Reset Completed'}</div>
      <div style="font-size: 12px; opacity: 0.9;">${resetCount} ${t.assignmentsRemoved || 'assignments removed'}</div>
    </div>
    <button class="btn btn-warning" onclick="undoReset()" style="font-size: 12px; padding: 8px 12px;">↩️ ${t.undo || 'Undo'}</button>
    <div class="undo-countdown" id="undo-countdown">10</div>
  `;
  
  document.body.appendChild(notification);
  
  let countdown = 10;
  const countdownEl = document.getElementById('undo-countdown');
  
  undoTimeout = setInterval(() => {
    countdown--;
    if (countdownEl) countdownEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(undoTimeout);
      notification.remove();
      undoState = null;
    }
  }, 1000);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
      undoState = null;
    }
  }, 10000);
}

/**
 * Annulla reset
 */
function undoReset() {
  if (!undoState) return;
  
  const t = translations[currentLanguage] || translations['en'];
  let restoredCount = 0;
  
  undoState.forEach(savedFacility => {
    const facility = facilityData.find(f => 
      f.Type === savedFacility.Type && f.Level === savedFacility.Level && 
      Math.abs(f.x - savedFacility.x) < 0.1 && Math.abs(f.y - savedFacility.y) < 0.1
    );
    
    if (facility) {
      facility.Alliance = savedFacility.Alliance;
      restoredCount++;
      if (facility.marker) {
        facility.marker.classList.add('assigned');
        if (typeof renderAllianceIcon === 'function') renderAllianceIcon(facility);
      }
    }
  });
  
  if (undoTimeout) clearInterval(undoTimeout);
  const notification = document.querySelector('.undo-notification');
  if (notification) notification.remove();
  
  undoState = null;
  updateAllUI();
  saveData();
  
  if (typeof showStatus === 'function') {
    showStatus(`↩️ ${t.undoCompleted || 'Undo completed'}: ${restoredCount} ${t.assignmentsRestored || 'assignments restored'}`, 'success');
  }
}

// =====================================================================
// SEZIONE 6: EVENT LISTENERS E INIZIALIZZAZIONE
// =====================================================================

/**
 * Configurazione event listeners
 */
function setupEventListeners() {
  // Form alleanza
  const allianceForm = document.getElementById('alliance-form');
  if (allianceForm) {
    allianceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = translations[currentLanguage] || translations['en'];
      
      const nameInput = document.getElementById('alliance-name');
      const name = nameInput.value.trim();
      const file = document.getElementById('alliance-icon').files[0];
      
      if (!name) return alert(t.enterAllianceName || 'Enter alliance name');
      if (alliances.find(a => a.name.toLowerCase() === name.toLowerCase())) {
        return alert(t.allianceExists || 'Alliance already exists');
      }
      if (alliances.length >= 50) return alert(t.maxAlliances || 'Maximum 50 alliances');
      
      const submitBtn = document.getElementById('add-alliance-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `⏳ ${t.processing || 'Processing...'}`;
      
      try {
        let finalIcon;
        
        if (file && typeof validateImageFile === 'function' && typeof processImageFile === 'function') {
          const validation = validateImageFile(file);
          if (!validation.isValid) {
            const t = translations[currentLanguage] || translations['en'];
            alert(`${t.invalidFile || 'Invalid file'}: ${validation.errors.join(', ')}`);
            return;
          }
          
          const processed = await processImageFile(file, 128, 128, 0.85);
          finalIcon = processed.dataUrl;
          
          if (typeof isIconUnique === 'function' && !isIconUnique(finalIcon)) {
            finalIcon = typeof generateFallbackIcon === 'function' ? generateFallbackIcon(name) : generateDefaultIcon(name);
          }
        } else {
          finalIcon = typeof generateFallbackIcon === 'function' ? generateFallbackIcon(name) : generateDefaultIcon(name);
        }
        
        alliances.push({ name, icon: finalIcon });
        updateAllUI();
        saveData();
        
        nameInput.value = '';
        document.getElementById('alliance-icon').value = '';
        
        if (typeof showStatus === 'function') {
          showStatus(`✅ ${t.allianceCreated || 'Alliance created'}: "${name}"`, 'success');
        }
      } catch (error) {
        console.error('Errore creazione alleanza:', error);
        if (typeof showStatus === 'function') {
          showStatus(`❌ Errore: ${error.message}`, 'error');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
  
  // Import CSV
  const importFile = document.getElementById('import-file');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const t = translations[currentLanguage] || translations['en'];
      const reader = new FileReader();
      
      reader.onload = (evt) => {
        try {
          const csv = evt.target.result;
          const lines = csv.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            alert(t.emptyCsv || 'Empty CSV');
            return;
          }
          
          facilityData.forEach(f => delete f.Alliance);
          let importedCount = 0;
          const newAlliances = new Set();
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= 5) {
              const [type, level, x, y, alliance] = values;
              if (alliance.trim()) newAlliances.add(alliance.trim());
              
              const facility = facilityData.find(f => 
                f.Type === type && f.Level === level && 
                Math.abs(f.x - parseFloat(x)) < 0.1 && Math.abs(f.y - parseFloat(y)) < 0.1
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
              alliances.push({ name: allianceName, icon: generateDefaultIcon(allianceName) });
            }
          });
          
          // Aggiorna marker
          facilityData.forEach(f => {
            if (f.marker) {
              if (typeof renderAllianceIcon === 'function') renderAllianceIcon(f);
              if (f.Alliance) {
                f.marker.classList.add('assigned');
              } else {
                f.marker.classList.remove('assigned');
              }
            }
          });
          
          updateAllUI();
          saveData();
          
          if (typeof showStatus === 'function') {
            showStatus(`✅ ${t.importSuccess || 'Import completed'}: ${importedCount} assignments`, 'success');
          }
        } catch (error) {
          console.error("Import error:", error);
          alert(t.importError || 'CSV import error');
        }
      };
      
      reader.readAsText(file);
      e.target.value = '';
    });
  }
}

/**
 * Toggle sezioni accordion
 */
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

// =====================================================================
// SEZIONE 7: INIZIALIZZAZIONE
// =====================================================================

/**
 * Inizializzazione marker con ritardo
 */
function initializeMarkersWithDelay() {
  setTimeout(() => {
    let createdCount = 0;
    facilityData.forEach((facility, index) => {
      try {
        const marker = typeof createMarker === 'function' ? createMarker(facility, index) : null;
        if (marker) createdCount++;
      } catch (error) {
        console.error(`Errore marker ${index}:`, error);
      }
    });
    
    updateAllUI();
    
    const t = translations[currentLanguage] || translations['en'];
    const message = t.appLoaded ? t.appLoaded.replace('{count}', createdCount) : `🎯 App loaded! ${createdCount} structures.`;
    if (typeof showStatus === 'function') {
      showStatus(message, 'success');
    }
  }, 100);
}

/**
 * Inizializzazione principale
 */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  
  // Eventi mappa
  document.addEventListener('mapLoaded', initializeMarkersWithDelay);
  document.addEventListener('mapFallback', initializeMarkersWithDelay);
  
  // Fallback timeout
  setTimeout(() => {
    if (document.querySelectorAll('.marker').length === 0) {
      initializeMarkersWithDelay();
    }
  }, 5000);
});

// =====================================================================
// SEZIONE 8: ESPORTAZIONI GLOBALI
// =====================================================================

// Funzioni principali
window.exportCSVFunction = exportCSV;
window.importCSVFunction = (file) => {
  const event = { target: { files: [file] } };
  document.getElementById('import-file').dispatchEvent(new Event('change'));
};
window.showResetConfirmation = showResetConfirmation;
window.undoReset = undoReset;
window.toggleSection = toggleSection;
window.editAlliance = editAlliance;
window.deleteAlliance = deleteAlliance;

// Funzioni rendering
window.renderAllianceList = renderAllianceList;
window.renderFacilitySummary = renderFacilitySummary;
window.renderBuffSummary = renderBuffSummary;
window.updateStats = () => {
  const totalEl = document.getElementById('total-alliances');
  const assignedEl = document.getElementById('assigned-facilities');
  if (totalEl) totalEl.textContent = alliances.length;
  if (assignedEl) assignedEl.textContent = facilityData.filter(f => f.Alliance).length;
};
window.updateSummaries = () => {
  renderFacilitySummary();
  renderBuffSummary();
};
window.updateAllUI = updateAllUI;
window.saveData = saveData;

console.log('✅ Sistema alleanze ottimizzato caricato - PULITO: da ~1000 → ~500 righe (-50%)');