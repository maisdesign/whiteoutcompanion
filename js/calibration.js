// === CALIBRAZIONE ===
    function checkCalibrationPassword() {
      const password = document.getElementById('calibration-password').value;
      if (password === 'calibration') {
        calibrationUnlocked = true;
        document.getElementById('password-section').classList.add('hidden');
        document.getElementById('calibration-controls-section').classList.remove('hidden');
        showStatus(translations[currentLanguage].calibrationUnlocked, 'success');
      } else {
        showStatus(translations[currentLanguage].wrongPassword, 'error');
        document.getElementById('calibration-password').value = '';
      }
    }

    function updateCalibrationFromInputs() {
      if (!calibrationUnlocked) return;
      calibrationSettings.offsetX = parseFloat(document.getElementById('offsetX').value) || 0;
      calibrationSettings.offsetY = parseFloat(document.getElementById('offsetY').value) || 0;
      calibrationSettings.scaleX = parseFloat(document.getElementById('scaleX').value) || 1;
      calibrationSettings.scaleY = parseFloat(document.getElementById('scaleY').value) || 1;
    }

    function applyMarkerPosition(facility) {
      const adjustedX = (facility.x * calibrationSettings.scaleX) + calibrationSettings.offsetX;
      const adjustedY = (facility.y * calibrationSettings.scaleY) + calibrationSettings.offsetY;
      return { x: adjustedX, y: adjustedY };
    }

    function highlightCastle() {
      if (!calibrationUnlocked) return;
      const castle = facilityData.find(f => f.Type === "Castle");
      if (castle && castle.marker) {
        castle.marker.style.backgroundColor = 'red';
        castle.marker.style.width = '20px';
        castle.marker.style.height = '20px';
        castle.marker.style.zIndex = '1000';
        castle.marker.style.border = '3px solid yellow';
        showStatus('🏰 Castello evidenziato in rosso.', 'info');
        
        setTimeout(() => {
          if (castle.marker) {
            castle.marker.style.backgroundColor = '';
            castle.marker.style.width = '';
            castle.marker.style.height = '';
            castle.marker.style.zIndex = '';
            castle.marker.style.border = '';
          }
        }, 5000);
      }
    }

    function testCurrentCalibration() {
      if (!calibrationUnlocked) return;
      updateCalibrationFromInputs();
      recreateAllMarkers();
      showStatus('🎯 Calibrazione testata.', 'info');
    }

    function applyCalibration() {
      if (!calibrationUnlocked) return;
      updateCalibrationFromInputs();
      recreateAllMarkers();
      localStorage.setItem('whiteout-calibration', JSON.stringify(calibrationSettings));
      showStatus('✅ Calibrazione applicata!', 'success');
    }

    function resetCalibration() {
      if (!calibrationUnlocked) return;
      calibrationSettings = { offsetX: 0, offsetY: 0.7, scaleX: 1.0, scaleY: 1.0 };
      
      document.getElementById('offsetX').value = calibrationSettings.offsetX;
      document.getElementById('offsetY').value = calibrationSettings.offsetY;
      document.getElementById('scaleX').value = calibrationSettings.scaleX;
      document.getElementById('scaleY').value = calibrationSettings.scaleY;
      
      recreateAllMarkers();
      showStatus('🔄 Calibrazione resettata', 'info');
    }

    function debugMarkers() {
      if (!calibrationUnlocked) return;
      console.log('=== DEBUG MARKERS ===');
      console.log('Total facilities:', facilityData.length);
      console.log('Calibration settings:', calibrationSettings);
      
      const markersOnPage = document.querySelectorAll('.marker').length;
      console.log('Markers on page:', markersOnPage);
      
      showStatus(`🔍 Debug: ${markersOnPage} marker su ${facilityData.length} strutture.`, 'info');
    }

    function toggleCalibration() {
      const content = document.getElementById('calibration-content');
      const toggle = document.querySelector('.calibration-toggle');
      
      if (content.classList.contains('collapsed-content')) {
        content.classList.remove('collapsed-content');
        content.classList.add('expanded-content');
        toggle.textContent = '▼';
      } else {
        content.classList.remove('expanded-content');
        content.classList.add('collapsed-content');
        toggle.textContent = '▶';
        if (!calibrationUnlocked) {
          document.getElementById('password-section').classList.remove('hidden');
          document.getElementById('calibration-controls-section').classList.add('hidden');
          document.getElementById('calibration-password').value = '';
        }
      }
    }

    function toggleLegend() {
      const legend = document.getElementById('map-legend');
      if (legend.classList.contains('hidden')) {
        legend.classList.remove('hidden');
        legend.style.animation = 'fadeIn 0.3s ease';
      } else {
        legend.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => legend.classList.add('hidden'), 300);
      }
    }