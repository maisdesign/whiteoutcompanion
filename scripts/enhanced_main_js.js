// ===== ENHANCED MAIN.JS WITH MODERN UI =====

// Enhanced global variables
const alliances = [];
let showOnlyAssigned = false;
let isEditingAlliance = false;
let editingAllianceIndex = -1;
let currentMapZoom = 1;
let mapOffsetX = 0;
let mapOffsetY = 0;

// Statistics tracking
let statsData = {
  totalAlliances: 0,
  assignedFacilities: 0,
  totalBuffs: 0,
  completionRate: 0
};

// Enhanced utility functions
function getReadableRandomColor() {
  const colors = [
    'linear-gradient(135deg, #d7263d 0%, #e14eca 100%)',
    'linear-gradient(135deg, #0074d9 0%, #007bff 100%)',
    'linear-gradient(135deg, #2ecc71 0%, #28a745 100%)',
    'linear-gradient(135deg, #ff851b 0%, #fd7e14 100%)',
    'linear-gradient(135deg, #7fdbff 0%, #6f42c1 100%)',
    'linear-gradient(135deg, #b10dc9 0%, #e83e8c 100%)',
    'linear-gradient(135deg, #f39c12 0%, #ffc107 100%)',
    'linear-gradient(135deg, #9b59b6 0%, #6f42c1 100%)',
    'linear-gradient(135deg, #e74c3c 0%, #dc3545 100%)',
    'linear-gradient(135deg, #1abc9c 0%, #20c997 100%)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Enhanced toast notification system
function showToast(message, type = 'info', duration = 3000) {
  if (window.pwaManager) {
    window.pwaManager.showToast(message, type, duration);
  } else {
    // Fallback for basic toast
    console.log(`${type.toUpperCase()}: ${message}`);
  }
}

// Enhanced render function with performance optimization
let renderTimeout;
function safeRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(() => {
    renderFacilitySummary();
    renderBuffSummary();
    updateStatistics();
    saveToLocalStorage();
  }, 100);
}

// Enhanced statistics calculation
function updateStatistics() {
  const totalAlliances = alliances.length;
  const assignedFacilities = facilityData.filter(f => f.Alliance).length;
  const totalFacilities = facilityData.length;
  const completionRate = totalFacilities > 0 ? Math.round((assignedFacilities / totalFacilities) * 100) : 0;
  
  // Calculate total buff percentage (simplified)
  const buffCount = assignedFacilities * 5; // Rough estimate
  
  statsData = {
    totalAlliances,
    assignedFacilities,
    totalBuffs: buffCount,
    completionRate
  };
  
  // Update UI elements
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const elements = {
    'total-alliances': statsData.totalAlliances,
    'assigned-facilities': statsData.assignedFacilities,
    'total-buffs': `+${statsData.totalBuffs}%`,
    'completion-rate': `${statsData.completionRate}%`
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
      // Add animation on change
      element.style.animation = 'bounce 0.6s ease';
      setTimeout(() => element.style.animation = '', 600);
    }
  });
}

// Enhanced tooltip system
function getMarkerTooltip(facility) {
  let tooltip = `${t(facility.Type)} ${facility.Level}`;
  if (facility.Alliance) {
    tooltip += ` → ${facility.Alliance}`;
  }
  return tooltip;
}

// Enhanced map interaction
function toggleMapView() {
  const map = document.getElementById('map');
  if (!map) return;
  
  if (currentMapZoom === 1) {
    currentMapZoom = 1.5;
    map.style.transform = `scale(${currentMapZoom})`;
    showToast('Map zoomed in 🔍', 'info');
  } else {
    currentMapZoom = 1;
    map.style.transform = 'scale(1)';
    showToast('Map reset 🗺️', 'info');
  }
}

function resetMapZoom() {
  const map = document.getElementById('map');
  if (!map) return;
  
  currentMapZoom = 1;
  mapOffsetX = 0;
  mapOffsetY = 0;
  map.style.transform = 'scale(1)';
  showToast('Map view reset 🔄', 'info');
}

// Enhanced section toggle with animation
function toggleSection(sectionId) {
  const content = document.getElementById(`${sectionId}-content`) || 
                 document.getElementById(`${sectionId.replace('-summary', '')}-content`);
  const toggle = document.getElementById(`${sectionId.replace('-summary', '')}-toggle`);
  
  if (content && toggle) {
    const isVisible = content.style.display !== 'none';
    
    if (isVisible) {
      // Collapse with animation
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease';
      
      setTimeout(() => {
        content.style.maxHeight = '0px';
        setTimeout(() => {
          content.style.display = 'none';
          content.style.maxHeight = '';
          content.style.overflow = '';
          content.style.transition = '';
        }, 300);
      }, 10);
      
      toggle.textContent = '▶';
      toggle.classList.add('collapsed');
    } else {
      // Expand with animation
      content.style.display = 'block';
      content.style.maxHeight = '0px';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease';
      
      setTimeout(() => {
        content.style.maxHeight = content.scrollHeight + 'px';
        setTimeout(() => {
          content.style.maxHeight = '';
          content.style.overflow = '';
          content.style.transition = '';
        }, 300);
      }, 10);
      
      toggle.textContent = '▼';
      toggle.classList.remove('collapsed');
    }
    
    // Save state
    try {
      const collapsedState = JSON.parse(localStorage.getItem('whiteout-collapsed-sections') || '{}');
      collapsedState[sectionId] = isVisible;
      localStorage.setItem('whiteout-collapsed-sections', JSON.stringify(collapsedState));
    } catch (error) {
      console.error('Error saving collapsed state:', error);
    }
  }
}

// Enhanced DOM initialization
document.addEventListener("DOMContentLoaded", () => {
  const map = document.getElementById("map");
  const mapContainer = document.getElementById("map-container");
  const allianceList = document.getElementById("alliance-list");
  const allianceForm = document.getElementById("alliance-form");
  const summary = document.getElementById("summary");

  // Initialize modern UI components
  initializeModernUI();
  
  // Initialize language system
  initLanguage();
  
  // Load data from localStorage
  loadFromLocalStorage();

  // Enhanced alliance form handler
  allianceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleAllianceSubmission();
  });

  function handleAllianceSubmission() {
    const nameInput = document.getElementById("alliance-name");
    const name = nameInput.value.trim();
    const file = document.getElementById("alliance-icon").files[0];
    
    if (!name) {
      showToast(t('maxAlliances'), 'error');
      return;
    }

    // Check premium limits
    if (!window.monetization?.isPremium && alliances.length >= 10) {
      if (window.monetization) {
        window.monetization.unlockPremiumFeature(
          'Unlimited Alliances', 
          'alert("Free version limited to 10 alliances")'
        );
      } else {
        showToast('Free version limited to 10 alliances. Upgrade for unlimited!', 'warning');
      }
      return;
    }

    // Handle editing existing alliance
    if (isEditingAlliance && editingAllianceIndex >= 0) {
      handleAllianceEdit(name, file);
      return;
    }

    // Check for duplicate names
    const existingAlliance = alliances.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (existingAlliance) {
      handleExistingAllianceUpdate(existingAlliance, file);
      return;
    }

    // Create new alliance
    createNewAlliance(name, file);
  }

  function handleAllianceEdit(name, file) {
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
      showToast(`Alliance "${alliance.name}" updated successfully! ✨`, 'success');
    }
  }

  function handleExistingAllianceUpdate(existingAlliance, file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        existingAlliance.icon = evt.target.result;
        refreshUI();
        facilityData.forEach(f => {
          if (f.Alliance === existingAlliance.name && f.marker) {
            renderAllianceIcon(f);
          }
        });
        showToast(`Icon updated for "${existingAlliance.name}" 🎨`, 'success');
      };
      reader.readAsDataURL(file);
    }
    document.getElementById("alliance-form").reset();
  }

  function createNewAlliance(name, file) {
    if (alliances.length >= 100) {
      showToast(t('maxAlliances'), 'error');
      return;
    }

    const processIcon = (iconData) => {
      const newAlliance = { name, icon: iconData };
      alliances.push(newAlliance);
      refreshUI();
      showToast(`Alliance "${name}" created successfully! 🏰`, 'success');
      
      // Add celebration animation
      const allianceCards = document.querySelectorAll('.alliance-item');
      const newCard = allianceCards[allianceCards.length - 1];
      if (newCard) {
        newCard.style.animation = 'slideUp 0.5s ease';
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => processIcon(evt.target.result);
      reader.readAsDataURL(file);
    } else {
      const gradient = getReadableRandomColor();
      const defaultIcon = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
          <defs>
            <linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
              <stop offset='0%' style='stop-color:#667eea'/>
              <stop offset='100%' style='stop-color:#764ba2'/>
            </linearGradient>
          </defs>
          <circle cx='20' cy='20' r='20' fill='url(#grad)'/>
          <text x='20' y='28' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'>
            ${name.charAt(0).toUpperCase()}
          </text>
        </svg>
      `)}`;
      processIcon(defaultIcon);
    }

    document.getElementById("alliance-form").reset();
  }

  // Enhanced UI refresh function
  function refreshUI() {
    renderAllianceList();
    renderFacilitySummary();
    renderBuffSummary();
    updateStatistics();
    setTimeout(restoreCollapsedState, 100);
    saveToLocalStorage();
  }

  function resetForm() {
    isEditingAlliance = false;
    editingAllianceIndex = -1;
    const submitBtn = document.querySelector('#alliance-form button[type="submit"]');
    submitBtn.textContent = t('addAlliance');
    submitBtn.className = 'btn-primary';
    
    // Remove cancel button if exists
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
      cancelBtn.remove();
    }
    
    // Clear form
    document.getElementById("alliance-form").reset();
    
    // Refresh UI
    setTimeout(() => refreshUI(), 50);
  }

  // Enhanced alliance list rendering
  function renderAllianceList() {
    allianceList.innerHTML = "";
    
    alliances.forEach((alliance, index) => {
      const li = document.createElement("li");
      li.className = "alliance-item fade-in";
      li.style.animationDelay = `${index * 0.1}s`;
      
      // Count assigned facilities for this alliance
      const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
      const totalFacilities = facilityData.length;
      
      li.innerHTML = `
        <div class="alliance-content">
          <div class="alliance-icon" style="background: ${alliance.icon.startsWith('data:image/svg') ? 'transparent' : 'none'}">
            ${alliance.icon.startsWith('data:image/svg') ? 
              `<img src="${alliance.icon}" width="40" height="40" alt="${alliance.name}" style="border-radius: 50%;">` :
              `<img src="${alliance.icon}" width="40" height="40" alt="${alliance.name}" style="border-radius: 50%;">`
            }
          </div>
          <div class="alliance-info">
            <div class="alliance-name">${alliance.name}</div>
            <div class="alliance-count">${assignedCount}/${totalFacilities} ${t('assigned') || 'assigned'}</div>
          </div>
          <div class="alliance-actions">
            <button class="action-btn edit-btn" onclick="editAlliance(${index})" title="${t('editAlliance') || 'Edit'}">✏️</button>
            <button class="action-btn delete-btn" onclick="deleteAlliance(${index})" title="${t('deleteAlliance') || 'Delete'}">🗑️</button>
          </div>
        </div>
      `;
      
      allianceList.appendChild(li);
    });
    
    // Update premium status indicator
    updatePremiumStatus();
  }

  function updatePremiumStatus() {
    const premiumBadge = document.getElementById('premium-status');
    const donationBtn = document.getElementById('donation-btn');
    
    if (window.monetization?.isPremium) {
      if (premiumBadge) premiumBadge.style.display = 'block';
      if (donationBtn) donationBtn.style.display = 'none';
    } else {
      if (premiumBadge) premiumBadge.style.display = 'none';
      if (donationBtn) {
        donationBtn.style.display = 'block';
        donationBtn.onclick = () => window.monetization?.handlePurchase();
      }
    }
  }

  // Initialize modern UI components
  function initializeModernUI() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      const originalClick = button.onclick;
      button.addEventListener('click', function(e) {
        // Add loading state
        if (!button.classList.contains('loading')) {
          button.classList.add('loading');
          const originalText = button.textContent;
          button.textContent = '⏳ Loading...';
          
          setTimeout(() => {
            button.classList.remove('loading');
            button.textContent = originalText;
          }, 500);
        }
      });
    });
    
    // Setup enhanced scroll behavior
    setupSmoothScrolling();
    
    // Initialize intersection observer for animations
    setupScrollAnimations();
    
    // Setup map interactions
    setupMapInteractions();
  }

  function setupSmoothScrolling() {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  function setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Observe all sections
      document.querySelectorAll('.summary-section, .stat-card').forEach(el => {
        observer.observe(el);
      });
    }
  }

  function setupMapInteractions() {
    const mapWrapper = document.querySelector('.map-wrapper');
    if (!mapWrapper) return;

    let isDragging = false;
    let startX, startY, initialX, initialY;

    // Mouse events for desktop
    mapWrapper.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events for mobile
    mapWrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    mapWrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    mapWrapper.addEventListener('touchend', endDrag);

    function startDrag(e) {
      if (currentMapZoom <= 1) return;
      isDragging = true;
      startX = e.clientX || e.touches[0].clientX;
      startY = e.clientY || e.touches[0].clientY;
      initialX = mapOffsetX;
      initialY = mapOffsetY;
      mapWrapper.style.cursor = 'grabbing';
    }

    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        startDrag(e.touches[0]);
      }
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (clientX && clientY) {
        mapOffsetX = initialX + (clientX - startX);
        mapOffsetY = initialY + (clientY - startY);
        
        const map = document.getElementById('map');
        if (map) {
          map.style.transform = `scale(${currentMapZoom}) translate(${mapOffsetX}px, ${mapOffsetY}px)`;
        }
      }
    }

    function handleTouchMove(e) {
      if (e.touches.length === 1) {
        drag(e.touches[0]);
      }
    }

    function endDrag() {
      isDragging = false;
      mapWrapper.style.cursor = 'grab';
    }

    // Zoom with mouse wheel
    mapWrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      currentMapZoom = Math.max(0.5, Math.min(3, currentMapZoom + delta));
      
      const map = document.getElementById('map');
      if (map) {
        map.style.transform = `scale(${currentMapZoom}) translate(${mapOffsetX}px, ${mapOffsetY}px)`;
      }
    });
  }

  // Enhanced marker creation
  function createMarker(facility, index) {
    const marker = document.createElement("div");
    marker.className = "marker";
    marker.style.left = `calc(${facility.x}% - 6px)`;
    marker.style.top = `calc(${facility.y}% - 6px)`;
    marker.title = getMarkerTooltip(facility);
    marker.onclick = () => showDropdown(facility, marker, index);
    
    // Add animation delay for staggered loading
    marker.style.animationDelay = `${index * 0.01}s`;
    marker.classList.add('fade-in');
    
    mapContainer.appendChild(marker);
    facility.marker = marker;
    
    // Render alliance icon immediately if facility has alliance assigned
    if (facility.Alliance) {
      renderAllianceIcon(facility);
      marker.classList.add('assigned');
    }
  }

  // Enhanced dropdown with better UX
  function showDropdown(facility, marker, index) {
    if (alliances.length === 0) {
      showToast(t('addAllianceFirst'), 'warning');
      return;
    }

    // Close any existing dropdowns
    closeAllDropdowns();

    const dropdown = document.createElement("select");
    dropdown.className = "marker-dropdown";
    dropdown.setAttribute('aria-label', `${t(facility.Type)} ${facility.Level} alliance selector`);
    
    // Build options
    let options = `<option value="">${t('selectAlliance')}</option>`;
    alliances.forEach(alliance => {
      const selected = facility.Alliance === alliance.name ? 'selected' : '';
      options += `<option value="${alliance.name}" ${selected}>${alliance.name}</option>`;
    });
    dropdown.innerHTML = options;
    
    let isChanging = false;
    
    dropdown.onchange = () => {
      isChanging = true;
      const oldAlliance = facility.Alliance;
      facility.Alliance = dropdown.value;
      
      // Update marker appearance
      renderAllianceIcon(facility);
      marker.title = getMarkerTooltip(facility);
      
      if (dropdown.value) {
        marker.classList.add('assigned');
      } else {
        marker.classList.remove('assigned');
      }
      
      // Show feedback
      if (dropdown.value) {
        showToast(`Assigned to ${dropdown.value} ✅`, 'success', 2000);
      } else if (oldAlliance) {
        showToast(`Removed from ${oldAlliance} ❌`, 'info', 2000);
      }
      
      // Use debounced render
      safeRender();
      
      // Remove dropdown with animation
      dropdown.style.animation = 'fadeOut 0.2s ease';
      setTimeout(() => dropdown.remove(), 200);
    };

    // Enhanced interaction handling
    dropdown.onmousedown = dropdown.onclick = (e) => e.stopPropagation();
    
    dropdown.onblur = () => {
      if (!isChanging) {
        setTimeout(() => {
          if (dropdown.parentNode && !isChanging) {
            dropdown.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => dropdown.remove(), 200);
          }
        }, 300);
      }
    };
    
    marker.appendChild(dropdown);
    dropdown.focus();
    
    // Expand dropdown
    setTimeout(() => {
      if (dropdown.parentNode) {
        dropdown.size = Math.min(alliances.length + 1, 6);
      }
    }, 50);
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.marker-dropdown').forEach(dropdown => {
      dropdown.style.animation = 'fadeOut 0.2s ease';
      setTimeout(() => dropdown.remove(), 200);
    });
  }

  // Enhanced alliance icon rendering
  function renderAllianceIcon(facility) {
    if (!facility.marker) return;
    
    // Remove existing icons
    facility.marker.querySelectorAll("img").forEach(e => e.remove());
    
    const alliance = alliances.find(a => a.name === facility.Alliance);
    if (alliance) {
      const icon = document.createElement("img");
      icon.src = alliance.icon;
      icon.alt = `${facility.Alliance} icon`;
      icon.className = 'alliance-marker-icon';
      icon.style.cssText = `
        position: absolute;
        left: 50%;
        top: 0;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -100%);
        z-index: 11;
        pointer-events: none;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.9);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background: white;
        animation: bounceIn 0.5s ease;
      `;
      facility.marker.appendChild(icon);
    }
  }

  // Global function implementations
  window.renderAllianceList = renderAllianceList;
  window.renderAllianceIcon = renderAllianceIcon;
  window.refreshUI = refreshUI;
  window.safeRender = safeRender;
  window.updateStatistics = updateStatistics;

  // Enhanced edit alliance function
  window.editAlliance = function(index) {
    const alliance = alliances[index];
    const nameInput = document.getElementById("alliance-name");
    const submitBtn = document.querySelector('#alliance-form button[type="submit"]');
    
    isEditingAlliance = true;
    editingAllianceIndex = index;
    
    nameInput.value = alliance.name;
    nameInput.focus();
    
    submitBtn.textContent = `${t('updateAlliance') || 'Update'} "${alliance.name}"`;
    submitBtn.className = 'btn-primary editing';
    
    // Add cancel button with enhanced styling
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
    
    showToast(`Editing "${alliance.name}" ✏️`, 'info');
  };

  // Enhanced delete alliance function
  window.deleteAlliance = function(index) {
    const alliance = alliances[index];
    const assignedFacilities = facilityData.filter(f => f.Alliance === alliance.name);
    
    // Create custom confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content glass-card';
    modalContent.style.cssText = `
      max-width: 400px;
      width: 90%;
      padding: 24px;
      text-align: center;
    `;
    
    modalContent.innerHTML = `
      <h3 style="color: #dc3545; margin-bottom: 16px;">🗑️ Delete Alliance</h3>
      <p style="margin-bottom: 16px;">Are you sure you want to delete "<strong>${alliance.name}</strong>"?</p>
      ${assignedFacilities.length > 0 ? 
        `<p style="color: #ffc107; margin-bottom: 20px;">
          ⚠️ This alliance is assigned to ${assignedFacilities.length} facilities.<br>
          These assignments will be removed.
        </p>` : ''
      }
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="confirmDelete()" class="btn-primary" style="background: #dc3545;">
          Delete
        </button>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-secondary">
          Cancel
        </button>
      </div>
    `;
    
    window.confirmDelete = function() {
      // Remove alliance
      alliances.splice(index, 1);
      
      // Remove assignments
      assignedFacilities.forEach(f => {
        delete f.Alliance;
        if (f.marker) {
          renderAllianceIcon(f);
          f.marker.title = getMarkerTooltip(f);
          f.marker.classList.remove('assigned');
        }
      });
      
      refreshUI();
      modal.remove();
      showToast(`"${alliance.name}" deleted successfully 🗑️`, 'success');
    };
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };

  // Create markers for all facilities with staggered animation
  facilityData.forEach((f, i) => {
    setTimeout(() => createMarker(f, i), i * 10);
  });

  // Initial UI setup
  refreshUI();

  // Setup CSV import with enhanced feedback
  const importFile = document.getElementById("import-file");
  if (importFile) {
    importFile.addEventListener("change", handleCSVImportEnhanced);
  }

  // Enhanced CSV import handler
  function handleCSVImportEnhanced(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showToast('Importing data... 📥', 'info', 1000);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        handleCSVImport(evt); // Call original function
        showToast('Import completed successfully! 🎉', 'success');
      } catch (error) {
        console.error('Import error:', error);
        showToast('Import failed. Please check file format. ❌', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }

  // Close dropdowns when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.marker')) {
      closeAllDropdowns();
    }
  });

  // Enhanced localStorage functions with better error handling
  window.saveToLocalStorage = function() {
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
        theme: document.body.className,
        mapSettings: {
          zoom: currentMapZoom,
          offsetX: mapOffsetX,
          offsetY: mapOffsetY
        },
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('whiteout-companion-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      showToast('Failed to save data locally ⚠️', 'warning');
    }
  };

  window.loadFromLocalStorage = function() {
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
              Math.abs(f.x - saved.x) < 0.1 && 
              Math.abs(f.y - saved.y) < 0.1
            );
            if (facility && saved.Alliance) {
              facility.Alliance = saved.Alliance;
            }
          });
        }
        
        // Restore other settings
        if (data.showOnlyAssigned !== undefined) {
          showOnlyAssigned = data.showOnlyAssigned;
        }
        
        if (data.language && translations[data.language]) {
          setLanguage(data.language);
        }
        
        if (data.theme) {
          document.body.className = data.theme;
        }
        
        if (data.mapSettings) {
          currentMapZoom = data.mapSettings.zoom || 1;
          mapOffsetX = data.mapSettings.offsetX || 0;
          mapOffsetY = data.mapSettings.offsetY || 0;
        }
        
        console.log('Data loaded successfully from localStorage');
        
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        showToast('Failed to load saved data ⚠️', 'warning');
      }
    }
  };

  // Enhanced restore collapsed state
  window.restoreCollapsedState = function() {
    try {
      const collapsedState = JSON.parse(localStorage.getItem('whiteout-collapsed-sections') || '{}');
      
      Object.entries(collapsedState).forEach(([sectionId, isCollapsed]) => {
        if (isCollapsed) {
          toggleSection(sectionId);
        }
      });
    } catch (error) {
      console.error('Error restoring collapsed state:', error);
    }
  };
});

// Enhanced CSS animation definitions
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes bounceIn {
    0% { transform: translate(-50%, -100%) scale(0); }
    50% { transform: translate(-50%, -100%) scale(1.2); }
    100% { transform: translate(-50%, -100%) scale(1); }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
      