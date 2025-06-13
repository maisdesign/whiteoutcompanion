const alliances = [];
let showOnlyAssigned = false;
let isEditingAlliance = false;
let editingAllianceIndex = -1;

// ===== CALIBRAZIONE COORDINATE =====
let calibrationSettings = {
  offsetX: 0,    // Aggiusta questi valori per allineare i marker
  offsetY: -2,   // Valore iniziale suggerito dalla screenshot
  scaleX: 1.0,
  scaleY: 1.0
};

// Global utility functions
function getReadableRandomColor() {
  const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Debounced render function to prevent excessive re-renders
let renderTimeout;
function safeRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(() => {
    renderFacilitySummary();
    renderBuffSummary();
    saveToLocalStorage();
  }, 100);
}

// Enhanced tooltip with alliance info
function getMarkerTooltip(facility) {
  let tooltip = `${t(facility.Type)} ${facility.Level}`;
  if (facility.Alliance) {
    tooltip += ` → ${facility.Alliance}`;
  }
  return tooltip;
}

// ===== FUNZIONI DI CALIBRAZIONE =====
function highlightCastle() {
  const castle = facilityData.find(f => f.Type === "Castle");
  if (castle && castle.marker) {
    castle.marker.style.backgroundColor = 'red';
    castle.marker.style.width = '20px';
    castle.marker.style.height = '20px';
    castle.marker.style.zIndex = '1000';
    castle.marker.style.border = '3px solid yellow';
    console.log('🏰 Castle position:', castle.x, castle.y);
    console.log('🎯 Check if the red marker is exactly on the castle in the map');
  } else {
    console.log('❌ Castle not found or marker not created yet');
  }
}

function testCalibration(offsetX = 0, offsetY = 0, scaleX = 1.0, scaleY = 1.0) {
  console.log(`🔧 Testing calibration: offsetX=${offsetX}, offsetY=${offsetY}, scaleX=${scaleX}, scaleY=${scaleY}`);
  
  // Aggiorna le impostazioni di calibrazione
  calibrationSettings = { offsetX, offsetY, scaleX, scaleY };
  
  // Rimuovi tutti i marker esistenti
  document.querySelectorAll('.marker').forEach(marker => marker.remove());
  
  // Ricrea i marker con i nuovi valori usando la funzione interna
  facilityData.forEach((facility, index) => {
    // Funzione createMarker inline per testCalibration
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;
    
    const marker = document.createElement("div");
    marker.className = "marker";
    
    // Applica calibrazione di test
    const adjustedX = (facility.x * scaleX) + offsetX;
    const adjustedY = (facility.y * scaleY) + offsetY;
    
    marker.style.left = `calc(${adjustedX}% - 6px)`;
    marker.style.top = `calc(${adjustedY}% - 6px)`;
    
    marker.title = getMarkerTooltip(facility);
    marker.onclick = () => showDropdown(facility, marker, index);
    mapContainer.appendChild(marker);
    facility.marker = marker;
    
    // Render alliance icon immediately if facility has alliance assigned
    if (facility.Alliance) {
      renderAllianceIcon(facility);
    }
  });
  
  // Evidenzia il castello per vedere se è allineato
  setTimeout(() => {
    highlightCastle();
  }, 100);
}

function autoCalibrate() {
  console.log("=== 🎯 CALIBRAZIONE AUTOMATICA ===");
  console.log("Prova questi valori uno alla volta:");
  console.log("testCalibration(0, -3);    // ⬆️ Sposta tutto in alto");
  console.log("testCalibration(0, 2);     // ⬇️ Sposta tutto in basso");
  console.log("testCalibration(-2, 0);    // ⬅️ Sposta tutto a sinistra");
  console.log("testCalibration(2, 0);     // ➡️ Sposta tutto a destra");
  console.log("testCalibration(-1, -2);   // ↖️ Alto-sinistra");
  console.log("testCalibration(1, 1);     // ↘️ Basso-destra");
  console.log("");
  console.log("🏰 Quando il castello rosso è perfettamente allineato:");
  console.log("applyFinalCalibration(offsetX, offsetY);");
}

function applyFinalCalibration(finalOffsetX, finalOffsetY, finalScaleX = 1.0, finalScaleY = 1.0) {
  console.log(`✅ Applying final calibration: ${finalOffsetX}, ${finalOffsetY}, ${finalScaleX}, ${finalScaleY}`);
  
  // Aggiorna le impostazioni permanenti
  calibrationSettings = {
    offsetX: finalOffsetX,
    offsetY: finalOffsetY,
    scaleX: finalScaleX,
    scaleY: finalScaleY
  };
  
  // Ricrea tutti i marker usando la stessa logica di testCalibration
  document.querySelectorAll('.marker').forEach(marker => marker.remove());
  
  facilityData.forEach((facility, index) => {
    const mapContainer = document.getElementById("map-container");
    if (!mapContainer) return;
    
    const marker = document.createElement("div");
    marker.className = "marker";
    
    // Applica calibrazione finale
    const adjustedX = (facility.x * finalScaleX) + finalOffsetX;
    const adjustedY = (facility.y * finalScaleY) + finalOffsetY;
    
    marker.style.left = `calc(${adjustedX}% - 6px)`;
    marker.style.top = `calc(${adjustedY}% - 6px)`;
    
    marker.title = getMarkerTooltip(facility);
    marker.onclick = () => showDropdown(facility, marker, index);
    mapContainer.appendChild(marker);
    facility.marker = marker;
    
    if (facility.Alliance) {
      renderAllianceIcon(facility);
    }
  });
  
  // Salva le impostazioni nel localStorage per la prossima volta
  localStorage.setItem('whiteout-calibration', JSON.stringify(calibrationSettings));
  
  console.log("🎉 Calibrazione applicata e salvata!");
  
  // Aggiorna anche il riferimento alla funzione createMarker locale
  window.currentCalibration = calibrationSettings;
}

// Carica calibrazione salvata
function loadCalibration() {
  const saved = localStorage.getItem('whiteout-calibration');
  if (saved) {
    try {
      calibrationSettings = JSON.parse(saved);
      console.log('📋 Calibrazione caricata:', calibrationSettings);
    } catch (error) {
      console.error('❌ Errore caricamento calibrazione:', error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const map = document.getElementById("map");
  const mapContainer = document.getElementById("map-container");
  const allianceList = document.getElementById("alliance-list");
  const allianceForm = document.getElementById("alliance-form");
  const summary = document.getElementById("summary");

  // Initialize language system
  initLanguage();
  
  // Load calibration settings
  loadCalibration();
  
  // Load data from localStorage
  loadFromLocalStorage();

  allianceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("alliance-name");
    const name = nameInput.value.trim();
    const file = document.getElementById("alliance-icon").files[0];
    
    if (!name) {
      alert(t('maxAlliances'));
      return;
    }

    // Handle editing existing alliance
    if (isEditingAlliance && editingAllianceIndex >= 0) {
      const alliance = alliances[editingAllianceIndex];
      const oldName = alliance.name;
      alliance.name = name;
      
      // Update facility assignments if name changed
      if (oldName !== name) {
        facilityData.forEach(f => {
          if (f.Alliance === oldName) {
            f.Alliance = name;
          }
        });
      }
      
      // Update icon if provided
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          alliance.icon = evt.target.result;
          finishAllianceUpdate();
        };
        reader.readAsDataURL(file);
      } else {
        finishAllianceUpdate();
      }
      
      function finishAllianceUpdate() {
        refreshUI();
        // Update all markers with this alliance
        facilityData.forEach(f => {
          if (f.Alliance === alliance.name && f.marker) {
            renderAllianceIcon(f);
          }
        });
        resetForm();
      }
      
      allianceForm.reset();
      return;
    }

    // Check for duplicate names (only when not editing)
    const existingAlliance = alliances.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (existingAlliance) {
      // Update existing alliance icon only
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          existingAlliance.icon = evt.target.result;
          refreshUI();
          // Update all markers with this alliance
          facilityData.forEach(f => {
            if (f.Alliance === existingAlliance.name && f.marker) {
              renderAllianceIcon(f);
            }
          });
        };
        reader.readAsDataURL(file);
      }
      allianceForm.reset();
      return;
    }

    if (alliances.length >= 100) {
      alert(t('maxAlliances'));
      return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
      const icon = evt.target.result;
      alliances.push({ name, icon });
      refreshUI();
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      const defaultIcon = "data:image/svg+xml;base64," + btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='10' fill='${getReadableRandomColor()}'/></svg>`);
      alliances.push({ name, icon: defaultIcon });
      refreshUI();
    }

    allianceForm.reset();
  });

  // Centralized UI refresh function
  function refreshUI() {
    renderAllianceList();
    renderFacilitySummary();
    renderBuffSummary();
    setTimeout(restoreCollapsedState, 100);
    saveToLocalStorage();
  }

  function resetForm() {
    isEditingAlliance = false;
    editingAllianceIndex = -1;
    const submitBtn = document.querySelector('#alliance-form button[type="submit"]');
    submitBtn.textContent = t('addAlliance');
    submitBtn.className = '';
    
    // Remove cancel button if exists
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
      cancelBtn.remove();
    }
    
    // Refresh UI to ensure consistency after form reset
    setTimeout(() => refreshUI(), 50);
  }

  function renderAllianceList() {
    allianceList.innerHTML = "";
    alliances.forEach((a, index) => {
      const li = document.createElement("li");
      li.className = "alliance-item";
      li.innerHTML = `
        <img src="${a.icon}" width="20" height="20" alt="Alliance icon"/> 
        <span class="alliance-name">${a.name}</span>
        <div class="alliance-actions">
          <button class="edit-btn" onclick="editAlliance(${index})" title="${t('editAlliance') || 'Edit'}">✏️</button>
          <button class="delete-btn" onclick="deleteAlliance(${index})" title="${t('deleteAlliance') || 'Delete'}">🗑️</button>
        </div>
      `;
      allianceList.appendChild(li);
    });
  }

  // ===== FUNZIONE CREATEMARKER CALIBRATA =====
  function createMarker(facility, index) {
    const marker = document.createElement("div");
    marker.className = "marker";
    
    // Applica calibrazione
    const adjustedX = (facility.x * calibrationSettings.scaleX) + calibrationSettings.offsetX;
    const adjustedY = (facility.y * calibrationSettings.scaleY) + calibrationSettings.offsetY;
    
    marker.style.left = `calc(${adjustedX}% - 6px)`;
    marker.style.top = `calc(${adjustedY}% - 6px)`;
    
    marker.title = getMarkerTooltip(facility);
    marker.onclick = () => showDropdown(facility, marker, index);
    mapContainer.appendChild(marker);
    facility.marker = marker;
    
    // Render alliance icon immediately if facility has alliance assigned
    if (facility.Alliance) {
      renderAllianceIcon(facility);
    }
  }

  function showDropdown(facility, marker, index) {
    if (alliances.length === 0) {
      alert(t('addAllianceFirst'));
      return;
    }

    // Close any existing dropdowns to prevent conflicts
    closeAllDropdowns();

    const dropdown = document.createElement("select");
    dropdown.className = "marker-dropdown";
    dropdown.setAttribute('aria-label', `${t(facility.Type)} ${facility.Level} alliance selector`);
    dropdown.innerHTML = `<option value="">${t('selectAlliance')}</option>` +
      alliances.map(a => `<option value="${a.name}" ${facility.Alliance === a.name ? "selected" : ""}>${a.name}</option>`).join("");
    
    let isChanging = false;
    
    dropdown.onchange = () => {
      isChanging = true;
      facility.Alliance = dropdown.value;
      renderAllianceIcon(facility);
      // Update tooltip
      marker.title = getMarkerTooltip(facility);
      
      // Use debounced render for better performance
      safeRender();
      
      // Remove dropdown after a short delay to allow selection
      setTimeout(() => dropdown.remove(), 100);
    };

    // Prevent dropdown from closing when interacting with it
    dropdown.onmousedown = (e) => {
      e.stopPropagation();
    };
    
    dropdown.onclick = (e) => {
      e.stopPropagation();
    };

    // Close dropdown when clicking elsewhere, but with longer delay
    dropdown.onblur = () => {
      // Only close if we're not in the middle of changing
      if (!isChanging) {
        setTimeout(() => {
          if (dropdown.parentNode && !isChanging) {
            dropdown.remove();
          }
        }, 300);
      }
    };
    
    marker.appendChild(dropdown);
    dropdown.focus();
    
    // Also open the dropdown programmatically on some browsers
    setTimeout(() => {
      if (dropdown.parentNode) {
        dropdown.size = Math.min(alliances.length + 1, 8); // Show multiple options
      }
    }, 50);
  }

  // Close all active dropdowns
  function closeAllDropdowns() {
    document.querySelectorAll('.marker-dropdown').forEach(dropdown => dropdown.remove());
  }

  function renderAllianceIcon(facility) {
    if (!facility.marker) return; // Safety check
    facility.marker.querySelectorAll("img").forEach(e => e.remove());
    const found = alliances.find(a => a.name === facility.Alliance);
    if (found) {
      const icon = document.createElement("img");
      icon.src = found.icon;
      icon.alt = `${facility.Alliance} icon`;
      icon.style.position = "absolute";
      icon.style.left = "50%";
      icon.style.top = "0";
      icon.style.width = "20px";
      icon.style.height = "20px";
      icon.style.transform = "translate(-50%, -100%)";
      icon.style.zIndex = "10";
      icon.style.pointerEvents = "none";
      icon.style.borderRadius = "50%";
      icon.style.border = "1px solid rgba(255,255,255,0.8)";
      icon.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";
      facility.marker.appendChild(icon);
    }
  }

  function renderFacilitySummary() {
    if (!summary) return;
    
    summary.innerHTML = `
      <div class="summary-header collapsible-header" onclick="toggleSection('facility-summary')">
        <h3 data-i18n="facility-summary">${t('facilitySummary')}</h3>
        <div class="summary-controls">
          <label class="filter-toggle" onclick="event.stopPropagation()">
            <input type="checkbox" id="show-only-assigned" ${showOnlyAssigned ? 'checked' : ''}>
            <span>${t('showOnlyAssigned') || 'Show only assigned'}</span>
          </label>
          <span class="section-toggle" id="facility-toggle">▼</span>
        </div>
      </div>
      <div id="facility-summary-content" class="collapsible-content">
      </div>
    `;
    
    // Create accordion container
    const accordion = document.createElement("div");
    accordion.className = "facility-accordion";
    
    // Add accordion to content area
    const contentArea = document.getElementById('facility-summary-content');
    
    // Add event listener for filter toggle
    const filterCheckbox = document.getElementById('show-only-assigned');
    if (filterCheckbox) {
      filterCheckbox.addEventListener('change', (e) => {
        showOnlyAssigned = e.target.checked;
        renderFacilitySummary();
        saveToLocalStorage();
      });
    }
    
    // Group facilities by type and level
    const groupedFacilities = {};
    facilityData.forEach((f, i) => {
      if (!groupedFacilities[f.Type]) {
        groupedFacilities[f.Type] = {};
      }
      if (!groupedFacilities[f.Type][f.Level]) {
        groupedFacilities[f.Type][f.Level] = [];
      }
      groupedFacilities[f.Type][f.Level].push({...f, index: i});
    });
    
    // Create accordion sections for each facility type
    Object.entries(groupedFacilities).forEach(([type, levels]) => {
      const section = document.createElement("div");
      section.className = "accordion-section";
      
      // Calculate total and assigned counts for this type
      const totalCount = Object.values(levels).reduce((sum, facilities) => sum + facilities.length, 0);
      const assignedCount = Object.values(levels).reduce((sum, facilities) => 
        sum + facilities.filter(f => f.Alliance).length, 0);
      
      const header = document.createElement("div");
      header.className = "accordion-header";
      header.innerHTML = `
        <strong>${t(type)}</strong>
        <span class="facility-count">(${assignedCount}/${totalCount} ${t('assigned') || 'assigned'})</span>
        <span class="accordion-toggle">▼</span>
      `;
      
      const content = document.createElement("div");
      content.className = "accordion-content";
      content.style.display = "none";
      
      // Create sub-accordion for each level within this type
      Object.entries(levels).forEach(([level, facilities]) => {
        // Sort facilities by coordinates
        facilities.sort((a, b) => {
          if (a.x !== b.x) return a.x - b.x;
          return a.y - b.y;
        });
        
        const levelSection = document.createElement("div");
        levelSection.className = "level-section";
        
        const assignedInLevel = facilities.filter(f => f.Alliance).length;
        
        const levelHeader = document.createElement("div");
        levelHeader.className = "level-header";
        levelHeader.innerHTML = `
          <strong>${level}</strong>
          <span class="level-count">(${assignedInLevel}/${facilities.length} ${t('assigned') || 'assigned'})</span>
          <span class="level-toggle">▼</span>
        `;
        
        const levelContent = document.createElement("div");
        levelContent.className = "level-content";
        levelContent.style.display = "none";
        
        const table = document.createElement("table");
        table.className = "facility-table";
        table.innerHTML = `
          <thead>
            <tr>
              <th>${t('position')}</th>
              <th>${t('alliance')}</th>
            </tr>
          </thead>
        `;
        
        const tbody = document.createElement("tbody");
        facilities.forEach(f => {
          // Apply filter
          if (showOnlyAssigned && !f.Alliance) return;
          
          const row = document.createElement("tr");
          row.className = f.Alliance ? 'assigned' : 'unassigned';
          row.innerHTML = `
            <td>(${f.x}, ${f.y})</td>
            <td>
              <select data-index="${f.index}">
                <option value="">--</option>
                ${alliances.map(a => `<option value="${a.name}" ${f.Alliance === a.name ? 'selected' : ''}>${a.name}</option>`).join("")}
              </select>
            </td>
          `;
          tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        levelContent.appendChild(table);
        levelSection.appendChild(levelHeader);
        levelSection.appendChild(levelContent);
        content.appendChild(levelSection);
        
        // Level toggle functionality
        levelHeader.addEventListener("click", () => {
          const isVisible = levelContent.style.display !== "none";
          levelContent.style.display = isVisible ? "none" : "block";
          levelHeader.querySelector(".level-toggle").textContent = isVisible ? "▼" : "▲";
        });
      });
      
      section.appendChild(header);
      section.appendChild(content);
      accordion.appendChild(section);
      
      // Type toggle functionality
      header.addEventListener("click", () => {
        const isVisible = content.style.display !== "none";
        content.style.display = isVisible ? "none" : "block";
        header.querySelector(".accordion-toggle").textContent = isVisible ? "▼" : "▲";
      });
    });
    
    if (contentArea) {
      contentArea.appendChild(accordion);
    }

    // Add event listeners for alliance changes
    summary.querySelectorAll("select").forEach(sel => {
      sel.addEventListener("change", e => {
        const idx = parseInt(e.target.dataset.index);
        if (facilityData[idx]) {
          facilityData[idx].Alliance = e.target.value;
          
          // Update the row styling
          const row = e.target.closest('tr');
          if (row) {
            row.className = e.target.value ? 'assigned' : 'unassigned';
          }
          
          // Update marker icon and tooltip
          renderAllianceIcon(facilityData[idx]);
          if (facilityData[idx].marker) {
            facilityData[idx].marker.title = getMarkerTooltip(facilityData[idx]);
          }
          
          // Update counts in real-time
          updateFacilityCounts();
          
          // Use debounced render for better performance
          safeRender();
        }
      });
    });
  }

  // Function to update facility counts in real-time
  function updateFacilityCounts() {
    document.querySelectorAll('.accordion-section').forEach(section => {
      const header = section.querySelector('.accordion-header');
      const typeText = header.querySelector('strong').textContent;
      
      // Find corresponding type in data
      const typeKey = Object.keys(translations.en).find(key => 
        translations[currentLanguage] && translations[currentLanguage][key] === typeText
      ) || typeText;
      
      // Calculate counts for this type
      const typeFacilities = facilityData.filter(f => f.Type === typeKey);
      const totalCount = typeFacilities.length;
      const assignedCount = typeFacilities.filter(f => f.Alliance).length;
      
      // Update header count
      const countSpan = header.querySelector('.facility-count');
      if (countSpan) {
        countSpan.textContent = `(${assignedCount}/${totalCount} ${t('assigned') || 'assigned'})`;
      }
      
      // Update level counts
      section.querySelectorAll('.level-section').forEach(levelSection => {
        const levelHeader = levelSection.querySelector('.level-header');
        const levelText = levelHeader.querySelector('strong').textContent;
        
        const levelFacilities = typeFacilities.filter(f => f.Level === levelText);
        const levelTotal = levelFacilities.length;
        const levelAssigned = levelFacilities.filter(f => f.Alliance).length;
        
        const levelCountSpan = levelHeader.querySelector('.level-count');
        if (levelCountSpan) {
          levelCountSpan.textContent = `(${levelAssigned}/${levelTotal} ${t('assigned') || 'assigned'})`;
        }
      });
    });
  }

  // LocalStorage functions
  function saveToLocalStorage() {
    try {
      const data = {
        alliances: alliances,
        facilityAssignments: facilityData.map(f => ({
          Type: f.Type,
          Level: f.Level,
          x: f.x,
          y: f.y,
          Alliance: f.Alliance
        })),
        showOnlyAssigned: showOnlyAssigned,
        language: currentLanguage,
        calibration: calibrationSettings
      };
      localStorage.setItem('whiteout-companion-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('whiteout-companion-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Restore alliances
        if (data.alliances) {
          alliances.splice(0, alliances.length, ...data.alliances);
        }
        
        // Restore facility assignments
        if (data.facilityAssignments) {
          data.facilityAssignments.forEach(saved => {
            const facility = facilityData.find(f => 
              f.Type === saved.Type && 
              f.Level === saved.Level && 
              f.x === saved.x && 
              f.y === saved.y
            );
            if (facility && saved.Alliance) {
              facility.Alliance = saved.Alliance;
            }
          });
        }
        
        // Restore filter state
        if (data.showOnlyAssigned !== undefined) {
          showOnlyAssigned = data.showOnlyAssigned;
        }
        
        // Restore language
        if (data.language && translations[data.language]) {
          setLanguage(data.language);
        }
        
        // Restore calibration
        if (data.calibration) {
          calibrationSettings = data.calibration;
        }
        
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }

  // Edit Alliance function - Enhanced
  function editAlliance(index) {
    const alliance = alliances[index];
    const nameInput = document.getElementById("alliance-name");
    const submitBtn = document.querySelector('#alliance-form button[type="submit"]');
    
    // Enter edit mode
    isEditingAlliance = true;
    editingAllianceIndex = index;
    
    // Pre-fill form with current alliance name
    nameInput.value = alliance.name;
    nameInput.focus();
    
    // Change submit button appearance
    submitBtn.textContent = `${t('updateAlliance') || 'Update'} "${alliance.name}"`;
    submitBtn.className = 'editing';
    
    // Add cancel button
    let cancelBtn = document.getElementById('cancel-edit');
    if (!cancelBtn) {
      cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.id = 'cancel-edit';
      cancelBtn.textContent = t('cancel') || 'Cancel';
      cancelBtn.className = 'cancel-btn';
      cancelBtn.onclick = resetForm;
      submitBtn.parentNode.appendChild(cancelBtn);
    }
  }

  // Delete Alliance function with enhanced modal
  function deleteAlliance(index) {
    const alliance = alliances[index];
    const assignedFacilities = facilityData.filter(f => f.Alliance === alliance.name);
    
    let confirmMessage = `${t('confirmDelete') || 'Are you sure you want to delete'} "${alliance.name}"?`;
    if (assignedFacilities.length > 0) {
      confirmMessage += `\n\n${t('warningAssigned') || 'Warning: This alliance is assigned to'} ${assignedFacilities.length} ${t('facilities') || 'facilities'}. ${t('assignmentsWillBeRemoved') || 'These assignments will be removed'}.`;
    }
    
    if (confirm(confirmMessage)) {
      // Remove alliance
      alliances.splice(index, 1);
      
      // Remove assignments from facilities
      assignedFacilities.forEach(f => {
        delete f.Alliance;
        if (f.marker) {
          renderAllianceIcon(f);
          f.marker.title = getMarkerTooltip(f);
        }
      });
      
      refreshUI();
    }
  }

  // Make functions globally accessible
  window.renderAllianceList = renderAllianceList;
  window.renderFacilitySummary = renderFacilitySummary;
  window.renderAllianceIcon = renderAllianceIcon;
  window.editAlliance = editAlliance;
  window.deleteAlliance = deleteAlliance;
  window.updateFacilityCounts = updateFacilityCounts;
  window.saveToLocalStorage = saveToLocalStorage;
  window.refreshUI = refreshUI;
  window.safeRender = safeRender;
  window.loadFromLocalStorage = loadFromLocalStorage;
  
  // Esponi le funzioni di calibrazione globalmente
  window.highlightCastle = highlightCastle;
  window.testCalibration = testCalibration;
  window.autoCalibrate = autoCalibrate;
  window.applyFinalCalibration = applyFinalCalibration;
  window.showDropdown = showDropdown;
  window.closeAllDropdowns = closeAllDropdowns;

  // Create markers for all facilities
  facilityData.forEach((f, i) => {
    createMarker(f, i);
  });

  refreshUI();

  // Setup CSV import functionality
  const importFile = document.getElementById("import-file");
  if (importFile) {
    importFile.addEventListener("change", handleCSVImport);
  }

  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.marker')) {
      closeAllDropdowns();
    }
  });
  
  // ===== CALIBRAZIONE LOG =====
  console.log("🎯 ===== WHITEOUT COMPANION - CALIBRAZIONE COORDINATE =====");
  console.log("📋 Comandi disponibili:");
  console.log("   highlightCastle() - Evidenzia il castello per test");
  console.log("   autoCalibrate() - Mostra comandi di calibrazione");
  console.log("   testCalibration(x, y) - Testa offset specifici");
  console.log("   applyFinalCalibration(x, y) - Applica calibrazione finale");
  console.log("");
  console.log("🏰 INIZIA CON: highlightCastle()");
  console.log("📝 Calibrazione corrente:", calibrationSettings);
});

// Fixed and improved renderBuffSummary function
function renderBuffSummary() {
  const container = document.getElementById("buff-summary");
  if (!container) return;

  container.innerHTML = `
    <div class="summary-header collapsible-header" onclick="toggleSection('buff-summary')">
      <h3 data-i18n="buff-summary">${t('buffSummary')}</h3>
      <span class="section-toggle" id="buff-toggle">▼</span>
    </div>
    <div id="buff-summary-content" class="collapsible-content">
    </div>
  `;

  const contentArea = document.getElementById('buff-summary-content');
  const byAlliance = {};

  facilityData.forEach(f => {
    if (!f.Alliance) return;
    if (!byAlliance[f.Alliance]) byAlliance[f.Alliance] = [];
    byAlliance[f.Alliance].push(f);
  });

  for (const [alliance, facilities] of Object.entries(byAlliance)) {
    const wrapper = document.createElement("div");
    wrapper.className = "buff-block";

    const keys = facilities.map(f => `${f.Type}|${f.Level}`);
    const unique = new Set(keys);
    const duplicates = keys.filter((item, i) => keys.indexOf(item) !== i);
    const alert = [...new Set(duplicates)];

    const summaryBuffs = [...unique]
      .map(key => {
        const label = buffValues[key];
        const type = key.split("|")[0];
        return label ? `${label} ${t(type)}` : null;
      })
      .filter(Boolean)
      .join(", ");

    const header = document.createElement("div");
    header.className = "buff-header";
    header.innerHTML = `
      <strong>${alliance}</strong> → ${summaryBuffs}
      ${alert.length > 0 ? `<span class='alert'>${t('duplicates')} ${alert.join(", ")}</span>` : ""}
      <button class="toggle-btn">${t('details')}</button>
    `;

    const details = document.createElement("div");
    details.className = "buff-details";
    details.style.display = "none";

    // Raggruppamento per tipo e livello
    const grouped = {};
    facilities.forEach(f => {
      if (!grouped[f.Type]) grouped[f.Type] = {};
      if (!grouped[f.Type][f.Level]) grouped[f.Type][f.Level] = [];
      grouped[f.Type][f.Level].push(f);
    });

    for (const [type, levels] of Object.entries(grouped)) {
      const typeBlock = document.createElement("div");
      const typeHeader = document.createElement("div");
      typeHeader.innerHTML = `<strong>${t(type)}</strong>`;
      typeHeader.className = "accordion-subheader";
      const typeList = document.createElement("div");
      typeList.style.display = "none";

      for (const [level, entries] of Object.entries(levels)) {
        const lvlBlock = document.createElement("div");
        const lvlHeader = document.createElement("div");
        lvlHeader.innerHTML = `<span>${level}</span>`;
        lvlHeader.className = "accordion-subsubheader";
        const lvlList = document.createElement("ul");
        
        // Sort entries by coordinates
        entries.sort((a, b) => {
          if (a.x !== b.x) return a.x - b.x;
          return a.y - b.y;
        });
        
        entries.forEach(f => {
          const li = document.createElement("li");
          const key = `${f.Type}|${f.Level}`;
          const isDup = alert.includes(key);
          li.innerHTML = `<span${isDup ? " class='duplicate'" : ""}>@ (${f.x}, ${f.y})</span>`;
          lvlList.appendChild(li);
        });
        lvlBlock.appendChild(lvlHeader);
        lvlBlock.appendChild(lvlList);
        typeList.appendChild(lvlBlock);

        lvlHeader.addEventListener("click", () => {
          lvlList.style.display = lvlList.style.display === "none" ? "block" : "none";
        });
      }

      typeBlock.appendChild(typeHeader);
      typeBlock.appendChild(typeList);
      details.appendChild(typeBlock);

      typeHeader.addEventListener("click", () => {
        typeList.style.display = typeList.style.display === "none" ? "block" : "none";
      });
    }

    wrapper.appendChild(header);

    const buffTable = document.createElement("ul");
    [...unique].forEach(key => {
      const percent = (buffValues[key] || "?");
      const [type, level] = key.split("|");
      const li = document.createElement("li");
      li.innerHTML = `<strong>${t(type)}</strong> ${level} → <span>${percent}</span>`;
      buffTable.appendChild(li);
    });
    wrapper.appendChild(buffTable);

    wrapper.appendChild(details);
    contentArea.appendChild(wrapper);

    header.querySelector(".toggle-btn").addEventListener("click", () => {
      details.style.display = details.style.display === "none" ? "block" : "none";
    });
  }
}

// Toggle section function
function toggleSection(sectionId) {
  const content = document.getElementById(`${sectionId}-content`);
  const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
  
  if (content && toggle) {
    const isVisible = content.style.display !== 'none';
    content.style.display = isVisible ? 'none' : 'block';
    toggle.textContent = isVisible ? '▶' : '▼';
    
    // Save state to localStorage
    try {
      const collapsedState = JSON.parse(localStorage.getItem('whiteout-collapsed-sections') || '{}');
      collapsedState[sectionId] = isVisible;
      localStorage.setItem('whiteout-collapsed-sections', JSON.stringify(collapsedState));
    } catch (error) {
      console.error('Error saving collapsed state:', error);
    }
  }
}

// Restore collapsed state
function restoreCollapsedState() {
  try {
    const collapsedState = JSON.parse(localStorage.getItem('whiteout-collapsed-sections') || '{}');
    
    Object.entries(collapsedState).forEach(([sectionId, isCollapsed]) => {
      const content = document.getElementById(`${sectionId}-content`);
      const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
      
      if (content && toggle && isCollapsed) {
        content.style.display = 'none';
        toggle.textContent = '▶';
      }
    });
  } catch (error) {
    console.error('Error restoring collapsed state:', error);
  }
}

// Export CSV function
function exportCSV() {
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
}

// Export PNG function - Bonus feature for sharing map screenshots
function exportPNG() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;
  
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const mapImg = document.getElementById('map');
  
  // Set canvas size to match map
  canvas.width = mapImg.naturalWidth || mapImg.width;
  canvas.height = mapImg.naturalHeight || mapImg.height;
  
  // Draw map background
  ctx.drawImage(mapImg, 0, 0, canvas.width, canvas.height);
  
  // Add alliance markers and labels
  facilityData.forEach(facility => {
    if (facility.Alliance && facility.marker) {
      // Calculate relative position with calibration
      const adjustedX = (facility.x * calibrationSettings.scaleX) + calibrationSettings.offsetX;
      const adjustedY = (facility.y * calibrationSettings.scaleY) + calibrationSettings.offsetY;
      
      const x = (adjustedX / 100) * canvas.width;
      const y = (adjustedY / 100) * canvas.height;
      
      // Draw facility marker
      ctx.fillStyle = '#0074d9';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw alliance name
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x - 30, y - 25, 60, 15);
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(facility.Alliance, x, y - 15);
    }
  });
  
  // Download image
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whiteout_map_with_alliances.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Import CSV function
function handleCSVImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const csv = evt.target.result;
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert("CSV file appears to be empty or invalid.");
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      console.log("CSV Headers:", headers);
      
      // Validate headers
      const expectedHeaders = ['Type', 'Level', 'X', 'Y', 'Alliance'];
      const hasValidHeaders = expectedHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );
      
      if (!hasValidHeaders) {
        alert("CSV file doesn't have the expected format. Expected headers: Type, Level, X, Y, Alliance");
        return;
      }
      
      // Clear existing assignments
      facilityData.forEach(f => delete f.Alliance);
      
      // Collect unique alliance names from CSV
      const csvAllianceNames = new Set();
      
      let importedCount = 0;
      
      // First pass: collect alliance names and import assignments
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 5) {
          const [type, level, x, y, alliance] = values;
          
          if (alliance.trim()) {
            csvAllianceNames.add(alliance.trim());
          }
          
          // Find matching facility
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
      
      // Create missing alliances with readable colors
      const missingAlliances = [];
      csvAllianceNames.forEach(allianceName => {
        const exists = alliances.find(a => a.name.toLowerCase() === allianceName.toLowerCase());
        if (!exists) {
          const randomColor = getReadableRandomColor();
          const defaultIcon = "data:image/svg+xml;base64," + btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='10' fill='${randomColor}'/></svg>`);
          alliances.push({ name: allianceName, icon: defaultIcon });
          missingAlliances.push(allianceName);
        }
      });
      
      // Update UI and markers
      facilityData.forEach(f => {
        if (f.marker) {
          if (typeof window.renderAllianceIcon === 'function') {
            window.renderAllianceIcon(f);
          }
          f.marker.title = getMarkerTooltip(f);
        }
      });
      
      // Use centralized refresh function
      if (typeof window.refreshUI === 'function') {
        window.refreshUI();
      } else {
        // Fallback for compatibility
        if (typeof window.renderAllianceList === 'function') window.renderAllianceList();
        if (typeof window.renderFacilitySummary === 'function') window.renderFacilitySummary();
        if (typeof renderBuffSummary === 'function') renderBuffSummary();
        setTimeout(restoreCollapsedState, 100);
        if (typeof window.saveToLocalStorage === 'function') window.saveToLocalStorage();
      }
      
      let message = `Import completed! ${importedCount} facility assignments imported successfully.`;
      if (missingAlliances.length > 0) {
        message += `\n\nCreated ${missingAlliances.length} new alliance(s) with colorful icons: ${missingAlliances.join(', ')}`;
        message += `\nYou can update their icons by editing them.`;
      }
      
      alert(message);
      
    } catch (error) {
      console.error("Import error:", error);
      alert("Error importing CSV: " + error.message);
    }
  };
  
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}
