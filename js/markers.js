// === ICONE FACILITY ===
const facilityIcons = {
  'Castle': '🏰',
  'Construction': '🔨',
  'Production': '🏭',
  'Defense': '🛡️',
  'Gathering': '⛏️',
  'Tech': '🔬',
  'Weapons': '⚔️',
  'Training': '🎯',
  'Expedition': '🚁',
  'Stronghold': '🏛️',
  'Fortress': '🏯'
};

// === UTILITY FUNCTIONS PER DISPOSITIVI TOUCH ===

// Verifica se siamo su un dispositivo touch con potenziali problemi di scroll
function isTouchDeviceWithScrollIssues() {
  return (
    'ontouchstart' in window &&
    /Android/i.test(navigator.userAgent) &&
    window.innerWidth < 768
  );
}

// Verifica se il dispositivo supporta scrollbar personalizzate
function supportsCustomScrollbars() {
  const testElement = document.createElement('div');
  testElement.style.cssText = '-webkit-overflow-scrolling: touch';
  return testElement.style.webkitOverflowScrolling === 'touch';
}

// === MARKER AGGIORNATO ===
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
  
  // Aggiungi icona facility
  const facilityIcon = document.createElement('span');
  facilityIcon.className = 'facility-icon';
  facilityIcon.textContent = facilityIcons[facility.Type] || '📍';
  marker.appendChild(facilityIcon);
  
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
  
  const t = translations[currentLanguage];
  showStatus(`📍 ${createdCount} ${t.markersUpdated || 'marker aggiornati'}`, 'info');
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
      <span style="font-size: 11px; opacity: 0.8;">${alliances.length + 1} ${t.options || 'opzioni'}</span>
    </div>
  `;
  dropdown.appendChild(header);
  
  // Container scrollabile per le opzioni - MIGLIORATO PER TOUCH
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'dropdown-options';
  
  // Aggiungi attributi per migliorare l'esperienza touch
  if (isTouchDeviceWithScrollIssues()) {
    optionsContainer.style.cssText += `
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      overscroll-behavior: contain;
      touch-action: pan-y;
    `;
  }
  
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
  
  // Determina quante alleanze mostrare per ottimizzare l'esperienza touch
  const maxVisibleAlliances = isTouchDeviceWithScrollIssues() ? 
    Math.min(alliances.length, 8) : alliances.length;
  
  // Opzioni per le alleanze
  alliances.slice(0, maxVisibleAlliances).forEach((alliance, idx) => {
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
        <span style="font-size: 11px; opacity: 0.7;">${assignedCount} ${t.structures || 'strutture'}</span>
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
  
  // Se ci sono più alleanze di quelle mostrate, aggiungi opzione "Mostra tutte"
  if (alliances.length > maxVisibleAlliances) {
    const showAllOption = document.createElement('div');
    showAllOption.className = 'dropdown-option show-all-option';
    showAllOption.style.cssText = `
      border-top: 1px solid rgba(79, 172, 254, 0.3);
      margin-top: 5px;
      padding-top: 8px;
      color: #4facfe;
      font-style: italic;
    `;
    showAllOption.innerHTML = `
      <span style="font-size: 16px;">👁️</span>
      <span>${t.showAll || `Mostra tutte (${alliances.length - maxVisibleAlliances} in più)`}</span>
    `;
    showAllOption.onclick = (e) => {
      e.stopPropagation();
      // Ricrea il dropdown con tutte le alleanze
      dropdown.remove();
      showDropdownComplete(facility, marker, index);
    };
    optionsContainer.appendChild(showAllOption);
  }
  
  dropdown.appendChild(optionsContainer);
  
  // Gestione scroll migliorata con indicatori visivi
  setupScrollHandling(dropdown, optionsContainer, alliances.length, t);
  
  marker.appendChild(dropdown);
  
  // Auto-chiusura dopo 15 secondi (più tempo per dispositivi touch)
  const autoCloseTime = isTouchDeviceWithScrollIssues() ? 15000 : 12000;
  setTimeout(() => {
    if (dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }, autoCloseTime);
  
  // Gestione click fuori migliorata
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick, { once: true });
    document.addEventListener('touchstart', handleOutsideClick, { once: true });
  }, 100);
  
  function handleOutsideClick(e) {
    if (!dropdown.contains(e.target) && dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }
  
  // Focus migliorato per accessibilità
  setupKeyboardNavigation(optionsContainer);
}

// Funzione separata per mostrare dropdown completo (quando utente clicca "Mostra tutte")
function showDropdownComplete(facility, marker, index) {
  const t = translations[currentLanguage];
  
  closeAllDropdowns();

  const dropdown = document.createElement('div');
  dropdown.className = 'marker-dropdown dropdown-complete';
  
  const mapWrapper = document.getElementById('map-wrapper');
  const markerRect = marker.getBoundingClientRect();
  const mapRect = mapWrapper.getBoundingClientRect();
  
  const markerTopRelative = markerRect.top - mapRect.top;
  const mapHeight = mapRect.height;
  
  if (markerTopRelative > mapHeight * 0.6) {
    dropdown.classList.add('dropdown-above');
  }
  
  // Header
  const header = document.createElement('div');
  header.className = 'dropdown-header';
  const coordsText = facility.ingameCoords ? ` - ${facility.ingameCoords}` : '';
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span>${facility.Type} ${facility.Level}${coordsText}</span>
      <span style="font-size: 11px; opacity: 0.8;">${alliances.length + 1} ${t.options || 'opzioni'}</span>
    </div>
  `;
  dropdown.appendChild(header);
  
  // Container scrollabile con tutte le alleanze
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'dropdown-options dropdown-options-complete';
  
  // Opzione rimuovi assegnazione
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
  const separator = document.createElement('div');
  separator.style.cssText = `
    height: 1px;
    background: rgba(79, 172, 254, 0.3);
    margin: 5px 0;
  `;
  optionsContainer.appendChild(separator);
  
  // Tutte le alleanze
  alliances.forEach((alliance, idx) => {
    const option = document.createElement('div');
    option.className = 'dropdown-option';
    if (facility.Alliance === alliance.name) {
      option.classList.add('selected');
    }
    
    const assignedCount = facilityData.filter(f => f.Alliance === alliance.name).length;
    
    option.innerHTML = `
      <img src="${alliance.icon}" alt="${alliance.name}" class="alliance-icon-small">
      <div style="flex: 1; display: flex; flex-direction: column;">
        <span style="font-weight: 500;">${alliance.name}</span>
        <span style="font-size: 11px; opacity: 0.7;">${assignedCount} ${t.structures || 'strutture'}</span>
      </div>
    `;
    
    option.onclick = (e) => {
      e.stopPropagation();
      assignFacilityToAlliance(facility, marker, alliance.name);
      dropdown.remove();
    };
    
    if (facility.Alliance === alliance.name) {
      option.style.background = 'linear-gradient(135deg, rgba(67, 233, 123, 0.3), rgba(67, 233, 123, 0.2))';
    }
    
    optionsContainer.appendChild(option);
  });
  
  dropdown.appendChild(optionsContainer);
  
  // Setup scroll handling per versione completa
  setupScrollHandling(dropdown, optionsContainer, alliances.length, t, true);
  
  marker.appendChild(dropdown);
  
  // Auto-chiusura
  setTimeout(() => {
    if (dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }, 15000);
  
  // Gestione click fuori
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick, { once: true });
    document.addEventListener('touchstart', handleOutsideClick, { once: true });
  }, 100);
  
  function handleOutsideClick(e) {
    if (!dropdown.contains(e.target) && dropdown.parentNode) {
      dropdown.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => dropdown.remove(), 300);
    }
  }
  
  setupKeyboardNavigation(optionsContainer);
}

// Funzione per configurare la gestione dello scroll migliorata
function setupScrollHandling(dropdown, optionsContainer, totalAlliances, translations, isComplete = false) {
  const t = translations;
  const isTouch = isTouchDeviceWithScrollIssues();
  const needsScrollIndicator = totalAlliances > (isComplete ? 6 : 4);
  
  if (needsScrollIndicator) {
    // Indicatore scroll migliorato
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'dropdown-scroll-indicator';
    scrollIndicator.innerHTML = isTouch ? '⬇️ Scorri' : '⬇️';
    scrollIndicator.title = t.scrollToSeeAll || 'Scrolla per vedere tutte le alleanze';
    
    // Stile migliorato per dispositivi touch
    if (isTouch) {
      scrollIndicator.style.cssText += `
        font-size: 10px;
        padding: 4px 8px;
        background: rgba(79, 172, 254, 0.8);
        border-radius: 12px;
        color: white;
        bottom: 4px;
        right: 4px;
        z-index: 1000;
      `;
    }
    
    dropdown.appendChild(scrollIndicator);
    
    // Gestione scroll migliorata
    let scrollTimeout;
    let isScrolling = false;
    
    optionsContainer.addEventListener('scroll', () => {
      const isAtBottom = optionsContainer.scrollTop + optionsContainer.clientHeight >= 
                        optionsContainer.scrollHeight - 10; // Margine più ampio
      
      // Mostra/nascondi indicatore
      scrollIndicator.style.display = isAtBottom ? 'none' : 'block';
      
      // Feedback visivo durante scroll
      if (!isScrolling) {
        isScrolling = true;
        optionsContainer.classList.add('scrolling');
        
        // Clear timeout precedente
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // Rimuovi classe dopo scroll
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
          optionsContainer.classList.remove('scrolling');
        }, 200);
      }
    });
    
    // Touch feedback per dispositivi touch
    if (isTouch) {
      optionsContainer.addEventListener('touchstart', (e) => {
        optionsContainer.classList.add('touch-active');
        // Previeni scroll della pagina principale quando si tocca il dropdown
        e.stopPropagation();
      }, { passive: false });
      
      optionsContainer.addEventListener('touchend', () => {
        setTimeout(() => {
          optionsContainer.classList.remove('touch-active');
        }, 150);
      });
      
      // Gestione migliorata del momentum scrolling
      optionsContainer.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: true });
    }
    
    // Nascondi indicatore automaticamente dopo qualche secondo
    setTimeout(() => {
      if (scrollIndicator && scrollIndicator.parentNode) {
        scrollIndicator.style.opacity = '0.6';
      }
    }, 3000);
  }
}

// Funzione per configurare la navigazione da tastiera
function setupKeyboardNavigation(optionsContainer) {
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
          options[currentIndex + 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex]?.classList.remove('keyboard-focus');
          options[currentIndex - 1]?.classList.add('keyboard-focus');
          options[currentIndex - 1]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
      case 'Enter':
        e.preventDefault();
        options[currentIndex]?.click();
        break;
      case 'Escape':
        document.querySelector('.marker-dropdown')?.remove();
        break;
    }
  });
  
  // Evidenzia prima opzione per navigazione keyboard
  if (optionsContainer.firstElementChild?.nextElementSibling) {
    // Salta il separatore e vai alla prima alleanza
    const firstAllianceOption = optionsContainer.querySelector('.dropdown-option:not(.unassign)');
    if (firstAllianceOption) {
      firstAllianceOption.classList.add('keyboard-focus');
    }
  }
}

// FUNZIONE CHIAVE MIGLIORATA: assignFacilityToAlliance
function assignFacilityToAlliance(facility, marker, allianceName) {
  console.log('🔄 Assegnazione struttura:', facility.Type, facility.Level, '→', allianceName || 'RIMOSSA');
  
  const t = translations[currentLanguage];
  const previousAlliance = facility.Alliance;
  
  // Aggiorna l'assegnazione
  facility.Alliance = allianceName;
  
  // Aggiorna icona alleanza sul marker
  renderAllianceIcon(facility);
  
  // Aggiorna classe CSS del marker
  if (allianceName) {
    marker.classList.add('assigned');
    showStatus(`✅ ${facility.Type} ${t.assignedTo || 'assegnata a'} ${allianceName}`, 'success');
  } else {
    marker.classList.remove('assigned');
    showStatus(`❌ ${facility.Type} ${t.removed || 'rimossa'}`, 'info');
  }
  
  // AGGIORNAMENTO COMPLETO DELL'UI - QUESTA È LA PARTE CRUCIALE
  console.log('🔄 Forzando aggiornamento completo UI...');
  
  // Usa setTimeout per assicurarsi che l'aggiornamento avvenga dopo che il DOM si è stabilizzato
  setTimeout(() => {
    // Aggiorna statistiche
    updateStats();
    
    // Aggiorna lista alleanze con contatori
    renderAllianceList();
    
    // Aggiorna entrambi i riepiloghi
    renderFacilitySummary();
    renderBuffSummary();
    
    console.log('✅ UI aggiornata completamente dopo assegnazione');
  }, 50);
  
  // Salva i dati
  saveData();
  
  console.log('💾 Dati salvati dopo assegnazione');
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
    `;
    facility.marker.appendChild(icon);
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
  
  /* Stili aggiuntivi per migliorare l'esperienza touch */
  .dropdown-options.scrolling {
    background: rgba(20, 25, 40, 0.99);
  }
  
  .dropdown-options.touch-active {
    user-select: none;
    -webkit-user-select: none;
  }
  
  .dropdown-options.touch-active .dropdown-option {
    pointer-events: none;
  }
  
  .dropdown-options.touch-active .dropdown-option:hover {
    background: rgba(255, 255, 255, 0.02);
    transform: none;
  }
  
  /* Miglioramenti per scorrimento fluido su touch */
  @media (pointer: coarse) {
    .dropdown-options {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      overscroll-behavior: contain;
    }
    
    .dropdown-scroll-indicator {
      font-size: 10px !important;
      padding: 4px 8px !important;
      background: rgba(79, 172, 254, 0.8) !important;
      border-radius: 12px !important;
      color: white !important;
      animation: pulseGently 2s infinite;
    }
    
    @keyframes pulseGently {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
  }
  
  /* Opzione "Mostra tutte" */
  .show-all-option {
    background: rgba(79, 172, 254, 0.1) !important;
    border-color: rgba(79, 172, 254, 0.3) !important;
  }
  
  .show-all-option:hover {
    background: rgba(79, 172, 254, 0.2) !important;
    border-color: rgba(79, 172, 254, 0.5) !important;
  }
`;

// Aggiungi lo stile al documento se non esiste già
if (!document.getElementById('keyboard-focus-style')) {
  const style = document.createElement('style');
  style.id = 'keyboard-focus-style';
  style.textContent = keyboardFocusStyle;
  document.head.appendChild(style);
}