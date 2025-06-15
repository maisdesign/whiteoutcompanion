// === MARKER ===
    function createMarker(facility, index) {
      const mapWrapper = document.getElementById('map-wrapper');
      if (!mapWrapper) return;

      if (facility.marker) {
        facility.marker.remove();
      }

      const marker = document.createElement('div');
      marker.className = `marker ${facility.Type.toLowerCase()}`;
      
      const pos = applyMarkerPosition(facility);
      marker.style.left = `calc(${pos.x}% - 6px)`;
      marker.style.top = `calc(${pos.y}% - 6px)`;
      
      marker.title = `${facility.Type} ${facility.Level}${facility.ingameCoords ? ' (' + facility.ingameCoords + ')' : ''}`;
      marker.onclick = () => showDropdown(facility, marker, index);
      
      mapWrapper.appendChild(marker);
      facility.marker = marker;

      if (facility.Alliance) {
        renderAllianceIcon(facility);
        marker.classList.add('assigned');
      }
      
      return marker;
    }

    function recreateAllMarkers() {
      document.querySelectorAll('.marker').forEach(marker => marker.remove());
      
      facilityData.forEach(facility => {
        facility.marker = null;
      });
      
      let createdCount = 0;
      facilityData.forEach((facility, index) => {
        const marker = createMarker(facility, index);
        if (marker) createdCount++;
      });
      
      showStatus(`📍 ${createdCount} marker aggiornati`, 'info');
    }

    function showDropdown(facility, marker, index) {
  const t = translations[currentLanguage];
  if (alliances.length === 0) {
    showStatus(t.addAtLeastOneAlliance, 'error');
    return;
  }

  closeAllDropdowns();

  const dropdown = document.createElement('div');
  dropdown.className = 'marker-dropdown';
  
  const mapWrapper = document.getElementById('map-wrapper');
  const markerRect = marker.getBoundingClientRect();
  const mapRect = mapWrapper.getBoundingClientRect();
  
  const markerTopRelative = markerRect.top - mapRect.top;
  const mapHeight = mapRect.height;
  
  if (markerTopRelative > mapHeight * 0.6) {
    dropdown.classList.add('dropdown-above');
  }
  
  // Header con coordinate (fisso)
  const header = document.createElement('div');
  header.className = 'dropdown-header';
  const coordsText = facility.ingameCoords ? ` - ${facility.ingameCoords}` : '';
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${facility.Type} ${facility.Level}${coordsText}</span>
      <span style="font-size: 11px; opacity: 0.8;">${alliances.length + 1} opzioni</span>
    </div>
  `;
  dropdown.appendChild(header);
  
  // Container scrollabile per le opzioni
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'dropdown-options';
  
  // Opzione per rimuovere assegnazione
  const unassignOption = document.createElement('div');
  unassignOption.className = 'dropdown-option unassign';
  unassignOption.innerHTML = `
    <span style="font-size: 16px;">❌</span>
    <span>${t.unassigned}</span>
  `;
  if (!facility.Alliance) {
    unassignOption.classList.add('selected');
  }
  unassignOption.onclick = (e) => {
    e.stopPropagation();
    assignFacilityToAlliance(facility, marker, null);
    dropdown.remove();
  };
  optionsContainer.appendChild(unassignOption);
  
  // Separatore
  if (alliances.length > 0) {
    const separator = document.createElement('div');
    separator.style.cssText = `
      height: 1px;
      background: rgba(79, 172, 254, 0.3);
      margin: 5px 0;
    `;
    optionsContainer.appendChild(separator);
  }
  
  // Opzioni per le alleanze
  alliances.forEach((alliance, idx) => {
    const option = document.createElement('div');
    option.className = 'dropdown-option';
    if (facility.Alliance === alliance.name) {
      option.classList.add('selected');
    }
    
    // Calcola assegnazioni attuali
    const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
    
    option.innerHTML = `
      <img src="${alliance.icon}" alt="${alliance.name}" class="alliance-icon-small">
      <div style="flex: 1; display: flex; flex-direction: column;">
        <span style="font-weight: 500;">${alliance.name}</span>
        <span style="font-size: 11px; opacity: 0.7;">${assignedCount} strutture</span>
      </div>
    `;
    
    option.onclick = (e) => {
      e.stopPropagation();
      assignFacilityToAlliance(facility, marker, alliance.name);
      dropdown.remove();
    };
    
    // Evidenzia se è l'alleanza attualmente selezionata
    if (facility.Alliance === alliance.name) {
      option.style.background = 'linear-gradient(135deg, rgba(67, 233, 123, 0.3), rgba(67, 233, 123, 0.2))';
    }
    
    optionsContainer.appendChild(option);
  });
  
  dropdown.appendChild(optionsContainer);
  
  // Indicatore scroll se necessario
  if (alliances.length > 6) {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'dropdown-scroll-indicator';
    scrollIndicator.innerHTML = '⬇️';
    scrollIndicator.title = 'Scrolla per vedere tutte le alleanze';
    dropdown.appendChild(scrollIndicator);
    
    // Nascondi indicatore quando scroll raggiunge il bottom
    optionsContainer.addEventListener('scroll', () => {
      const isAtBottom = optionsContainer.scrollTop + optionsContainer.clientHeight >= optionsContainer.scrollHeight - 5;
      scrollIndicator.style.display = isAtBottom ? 'none' : 'block';
    });
  }
  
  marker.appendChild(dropdown);
  
  // Auto-chiusura dopo 12 secondi
  setTimeout(() => {
    if (dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }, 12000);
  
  // Gestione click fuori
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick, { once: true });
  }, 100);
  
  function handleOutsideClick(e) {
    if (!dropdown.contains(e.target) && dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }
  
  // Focus sul container per permettere navigazione con tastiera
  optionsContainer.tabIndex = 0;
  optionsContainer.focus();
  
  // Navigazione con tastiera
  optionsContainer.addEventListener('keydown', (e) => {
    const options = optionsContainer.querySelectorAll('.dropdown-option');
    let currentIndex = Array.from(options).findIndex(opt => opt.classList.contains('keyboard-focus'));
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < options.length - 1) {
          options[currentIndex]?.classList.remove('keyboard-focus');
          options[currentIndex + 1]?.classList.add('keyboard-focus');
          options[currentIndex + 1]?.scrollIntoView({ block: 'nearest' });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex]?.classList.remove('keyboard-focus');
          options[currentIndex - 1]?.classList.add('keyboard-focus');
          options[currentIndex - 1]?.scrollIntoView({ block: 'nearest' });
        }
        break;
      case 'Enter':
        e.preventDefault();
        options[currentIndex]?.click();
        break;
      case 'Escape':
        dropdown.remove();
        break;
    }
  });
  
  // Evidenzia prima opzione per navigazione keyboard
  if (optionsContainer.firstElementChild) {
    optionsContainer.firstElementChild.classList.add('keyboard-focus');
  }
}

// Stile per focus keyboard
const keyboardFocusStyle = `
  .dropdown-option.keyboard-focus {
    background: rgba(79, 172, 254, 0.4) !important;
    border-color: rgba(79, 172, 254, 0.8) !important;
    outline: 2px solid rgba(79, 172, 254, 0.6);
    outline-offset: -2px;
  }
`;

// Aggiungi lo stile al documento
if (!document.getElementById('keyboard-focus-style')) {
  const style = document.createElement('style');
  style.id = 'keyboard-focus-style';
  style.textContent = keyboardFocusStyle;
  document.head.appendChild(style);
}

    function assignFacilityToAlliance(facility, marker, allianceName) {
      facility.Alliance = allianceName;
      
      renderAllianceIcon(facility);
      
      if (allianceName) {
        marker.classList.add('assigned');
        showStatus(`✅ ${facility.Type} assegnata a ${allianceName}`, 'success');
      } else {
        marker.classList.remove('assigned');
        showStatus(`❌ ${facility.Type} rimossa`, 'info');
      }
      
      updateStats();
      updateSummaries();
      saveData();
    }

    function closeAllDropdowns() {
      document.querySelectorAll('.marker-dropdown').forEach(dropdown => {
        dropdown.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
          if (dropdown.parentNode) {
            dropdown.remove();
          }
        }, 200);
      });
    }

    function renderAllianceIcon(facility) {
      if (!facility.marker) return;
      
      facility.marker.querySelectorAll('img').forEach(e => e.remove());
      
      const alliance = alliances.find(a => a.name === facility.Alliance);
      if (alliance) {
        const icon = document.createElement('img');
        icon.src = alliance.icon;
        icon.alt = `${facility.Alliance} icon`;
        facility.marker.appendChild(icon);
      }
    }