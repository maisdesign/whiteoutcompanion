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
      
      if (markerTopRelative > mapHeight * 0.5) {
        dropdown.classList.add('dropdown-above');
      }
      
      // Header con coordinate
      const header = document.createElement('div');
      header.className = 'dropdown-header';
      const coordsText = facility.ingameCoords ? ` - ${facility.ingameCoords}` : '';
      header.textContent = `${facility.Type} ${facility.Level}${coordsText}`;
      dropdown.appendChild(header);
      
      // Opzione per rimuovere assegnazione
      const unassignOption = document.createElement('div');
      unassignOption.className = 'dropdown-option unassign';
      unassignOption.innerHTML = t.unassigned;
      if (!facility.Alliance) {
        unassignOption.classList.add('selected');
      }
      unassignOption.onclick = (e) => {
        e.stopPropagation();
        assignFacilityToAlliance(facility, marker, null);
        dropdown.remove();
      };
      dropdown.appendChild(unassignOption);
      
      // Opzioni per le alleanze
      alliances.forEach(alliance => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        if (facility.Alliance === alliance.name) {
          option.classList.add('selected');
        }
        
        option.innerHTML = `
          <img src="${alliance.icon}" alt="${alliance.name}" class="alliance-icon-small">
          <span>${alliance.name}</span>
        `;
        
        option.onclick = (e) => {
          e.stopPropagation();
          assignFacilityToAlliance(facility, marker, alliance.name);
          dropdown.remove();
        };
        
        dropdown.appendChild(option);
      });
      
      marker.appendChild(dropdown);
      
      setTimeout(() => {
        if (dropdown.parentNode) {
          dropdown.remove();
        }
      }, 8000);
      
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick, { once: true });
      }, 100);
      
      function handleOutsideClick(e) {
        if (!dropdown.contains(e.target) && dropdown.parentNode) {
          dropdown.remove();
        }
      }
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