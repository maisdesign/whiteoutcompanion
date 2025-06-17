// =====================================================================
// UTILITIES.JS - PULITO E OTTIMIZZATO
// =====================================================================
// File utilitario semplificato contenente solo funzionalità core:
// - Gestione stato applicazione
// - Sistema notifiche showStatus
// - Validazione immagini semplificata
// - Export PNG
// - Funzioni debug consolidate
//
// RIMOSSO:
// - Funzioni lingua duplicate (gestite da languagesystem.js)
// - Over-engineering validazione immagini
// - Funzioni debug ridondanti

console.log('🔧 Caricamento utilities core...');

// =====================================================================
// SEZIONE 1: STATO APPLICAZIONE
// =====================================================================

const alliances = [];
let calibrationSettings = { offsetX: 0, offsetY: 0.7, scaleX: 1.0, scaleY: 1.0 };
let calibrationUnlocked = false;

// Variabile lingua corrente (gestita da languagesystem.js)
let currentLanguage = 'en';

// =====================================================================
// SEZIONE 2: SISTEMA NOTIFICHE
// =====================================================================

/**
 * Mostra notifiche di stato all'utente con stili appropriati
 */
function showStatus(message, type = 'info', duration = 4000) {
  console.log(`📱 Status [${type}]:`, message);
  
  let statusEl = document.getElementById('map-status') || createTemporaryStatusElement();
  
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.opacity = '1';
    
    // Applica colori in base al tipo
    const styles = {
      success: { bg: 'rgba(67, 233, 123, 0.2)', border: 'rgba(67, 233, 123, 0.5)', color: '#43e97b' },
      error: { bg: 'rgba(220, 53, 69, 0.2)', border: 'rgba(220, 53, 69, 0.5)', color: '#ff6b6b' },
      warning: { bg: 'rgba(255, 193, 7, 0.2)', border: 'rgba(255, 193, 7, 0.5)', color: '#ffc107' },
      info: { bg: 'rgba(79, 172, 254, 0.2)', border: 'rgba(79, 172, 254, 0.5)', color: '#4facfe' }
    };
    
    const style = styles[type] || styles.info;
    Object.assign(statusEl.style, {
      background: style.bg,
      borderColor: style.border,
      color: style.color
    });
    
    // Auto-hide dopo durata specificata
    if (duration > 0) {
      setTimeout(() => {
        if (statusEl) {
          statusEl.style.opacity = '0';
          setTimeout(() => {
            if (statusEl?.id === 'temp-status') {
              statusEl.remove();
            } else if (statusEl) {
              statusEl.style.display = 'none';
            }
          }, 300);
        }
      }, duration);
    }
  }
}

/**
 * Crea elemento di stato temporaneo se necessario
 */
function createTemporaryStatusElement() {
  const tempStatus = document.createElement('div');
  tempStatus.id = 'temp-status';
  tempStatus.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10000;
    padding: 12px 20px; border-radius: 8px; border: 1px solid;
    font-size: 14px; font-weight: 500; max-width: 400px;
    backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease; font-family: 'Inter', sans-serif;
  `;
  document.body.appendChild(tempStatus);
  return tempStatus;
}

// =====================================================================
// SEZIONE 3: UTILITÀ SEMPLICI
// =====================================================================

function getRandomColor() {
  const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// =====================================================================
// SEZIONE 4: VALIDAZIONE IMMAGINI SEMPLIFICATA
// =====================================================================

const IMAGE_CONFIG = {
  maxSizeBytes: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

/**
 * Valida file immagine (versione semplificata)
 */
function validateImageFile(file) {
  const errors = [];
  
  if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
    errors.push('Formato non supportato. Usa JPG, PNG, GIF o WebP.');
  }
  
  if (file.size > IMAGE_CONFIG.maxSizeBytes) {
    errors.push('File troppo grande. Massimo 2MB.');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Processa immagine (versione semplificata)
 */
function processImageFile(file, maxSize = 128, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Ridimensiona mantenendo proporzioni
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve({
          dataUrl: canvas.toDataURL('image/jpeg', quality),
          originalSize: file.size,
          processedSize: Math.round(canvas.toDataURL('image/jpeg', quality).length * 0.75)
        });
      };
      img.onerror = () => reject(new Error('Errore elaborazione immagine'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Errore lettura file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Genera icona alleanza automatica (versione semplificata)
 */
function generateFallbackIcon(name) {
  const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9'];
  const color = colors[Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
      <circle cx='16' cy='16' r='16' fill='${color}'/>
      <text x='16' y='21' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'>
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return "data:image/svg+xml;base64," + btoa(svg);
}

/**
 * Verifica unicità icona
 */
function isIconUnique(iconData) {
  return !alliances.some(alliance => alliance.icon === iconData);
}

/**
 * Mostra errori validazione immagini
 */
function showImageValidationErrors(errors) {
  const message = errors.join('\n');
  showStatus(`❌ ${message}`, 'error', 6000);
}

// =====================================================================
// SEZIONE 5: EXPORT PNG
// =====================================================================

/**
 * Carica html2canvas dinamicamente
 */
function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) {
      resolve(window.html2canvas);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => window.html2canvas ? resolve(window.html2canvas) : reject(new Error('html2canvas failed to load'));
    script.onerror = () => reject(new Error('Failed to load html2canvas'));
    document.head.appendChild(script);
  });
}

/**
 * Prepara contenuto per export
 */
function prepareExportContent() {
  const exportContainer = document.createElement('div');
  exportContainer.style.cssText = `
    position: fixed; top: -10000px; left: -10000px; width: 1200px;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white; font-family: 'Inter', Arial, sans-serif; padding: 30px;
    border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  `;
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = 'text-align: center; margin-bottom: 30px; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 12px;';
  header.innerHTML = `
    <h1 style="margin: 0 0 10px 0; font-size: 28px;">🗺️ Whiteout Survival Companion</h1>
    <p style="margin: 0; font-size: 16px;">Professional alliance management</p>
    <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.7;">Esportato il: ${new Date().toLocaleString()}</p>
  `;
  
  // Clona mappa
  const originalMap = document.querySelector('.map-container');
  if (!originalMap) throw new Error('Map container not found');
  
  const mapClone = originalMap.cloneNode(true);
  mapClone.style.cssText = 'background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;';
  
  // Rimuovi elementi non necessari
  mapClone.querySelectorAll('.map-status, .marker-dropdown').forEach(el => el.remove());
  
  // Assicura legenda visibile
  const legend = mapClone.querySelector('#map-legend');
  if (legend) {
    legend.classList.remove('hidden');
    legend.style.display = 'block';
  }
  
  // Statistiche
  const stats = createExportStats();
  
  exportContainer.appendChild(header);
  exportContainer.appendChild(mapClone);
  exportContainer.appendChild(stats);
  document.body.appendChild(exportContainer);
  
  return exportContainer;
}

/**
 * Crea statistiche per export
 */
function createExportStats() {
  const assignedFacilities = facilityData ? facilityData.filter(f => f.Alliance).length : 0;
  const totalFacilities = facilityData ? facilityData.length : 0;
  
  const statsContainer = document.createElement('div');
  statsContainer.style.cssText = `
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;
    background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 12px;
  `;
  
  statsContainer.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #4facfe;">${alliances.length}</div>
      <div style="font-size: 12px; opacity: 0.8;">Alleanze</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #43e97b;">${assignedFacilities}</div>
      <div style="font-size: 12px; opacity: 0.8;">Assegnate</div>
    </div>
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #ff6b6b;">${totalFacilities - assignedFacilities}</div>
      <div style="font-size: 12px; opacity: 0.8;">Libere</div>
    </div>
  `;
  
  return statsContainer;
}

/**
 * Funzione principale export PNG
 */
async function exportToPNG() {
  try {
    showStatus('📸 Preparazione export...', 'info');
    
    const html2canvas = await loadHtml2Canvas();
    const exportContainer = prepareExportContent();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    showStatus('🎨 Rendering immagine...', 'info');
    
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
      width: 1200,
      height: exportContainer.scrollHeight
    });
    
    document.body.removeChild(exportContainer);
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `whiteout-survival-map-${timestamp}.png`;
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      showStatus(`✅ PNG esportato: ${filename} (${fileSizeMB}MB)`, 'success', 5000);
    }, 'image/png', 0.95);
    
  } catch (error) {
    console.error('Errore export PNG:', error);
    showStatus(`❌ Errore export: ${error.message}`, 'error', 5000);
  }
}

// =====================================================================
// SEZIONE 6: DEBUG E MANUTENZIONE CONSOLIDATE
// =====================================================================

/**
 * Sistema debug completo consolidato
 */
function debugApp() {
  console.log('🔍 === DEBUG WHITEOUT COMPANION ===');
  
  // Verifica elementi DOM
  const requiredElements = ['alliance-list', 'total-alliances', 'assigned-facilities', 'facility-summary', 'buff-summary', 'map-wrapper'];
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  const foundElements = requiredElements.filter(id => document.getElementById(id));
  
  console.log('📊 Elementi DOM:');
  console.log('  ✅ Trovati:', foundElements.length, '/', requiredElements.length);
  if (missingElements.length > 0) console.log('  ❌ Mancanti:', missingElements);
  
  // Stato dati
  const assignedFacilities = typeof facilityData !== 'undefined' ? facilityData.filter(f => f.Alliance).length : 0;
  const totalFacilities = typeof facilityData !== 'undefined' ? facilityData.length : 0;
  const markersOnPage = document.querySelectorAll('.marker').length;
  
  console.log('📋 Stato dati:');
  console.log('  - Alleanze:', alliances.length);
  console.log('  - Strutture totali:', totalFacilities);
  console.log('  - Strutture assegnate:', assignedFacilities);
  console.log('  - Marker sulla pagina:', markersOnPage);
  console.log('  - Lingua corrente:', currentLanguage);
  console.log('  - Calibrazione sbloccata:', calibrationUnlocked);
  
  // Pulizia automatica stati inconsistenti
  let cleanupCount = 0;
  
  // Rimuovi dropdown orfani
  document.querySelectorAll('.marker-dropdown').forEach(dropdown => {
    if (!dropdown.parentNode || !dropdown.closest('.marker')) {
      dropdown.remove();
      cleanupCount++;
    }
  });
  
  // Pulisci alleanze inesistenti dalle facility
  if (typeof facilityData !== 'undefined') {
    facilityData.forEach(facility => {
      if (facility.Alliance && !alliances.find(a => a.name === facility.Alliance)) {
        console.warn(`⚠️ Rimossa alleanza inesistente: ${facility.Type} → ${facility.Alliance}`);
        delete facility.Alliance;
        cleanupCount++;
      }
    });
  }
  
  if (cleanupCount > 0) {
    console.log(`🧹 Pulizia completata: ${cleanupCount} elementi corretti`);
  }
  
  console.log('=== FINE DEBUG ===');
  
  return {
    domHealth: { found: foundElements.length, missing: missingElements.length, total: requiredElements.length },
    dataHealth: { alliances: alliances.length, totalFacilities, assignedFacilities, markersOnPage },
    language: currentLanguage,
    cleanupPerformed: cleanupCount > 0
  };
}

/**
 * Forza refresh completo UI
 */
function forceUIRefresh() {
  console.log('🔄 Refresh completo UI...');
  
  try {
    // Refresh components se disponibili
    if (typeof updateStats === 'function') updateStats();
    if (typeof renderAllianceList === 'function') renderAllianceList();
    if (typeof updateSummaries === 'function') updateSummaries();
    if (typeof updateUILanguage === 'function') updateUILanguage();
    
    console.log('✅ Refresh UI completato');
    showStatus('🔄 Interfaccia aggiornata', 'success', 2000);
  } catch (error) {
    console.error('❌ Errore refresh UI:', error);
    showStatus('❌ Errore aggiornamento interfaccia', 'error');
  }
}

// =====================================================================
// SEZIONE 7: ESPORTAZIONI GLOBALI
// =====================================================================

// Funzioni principali
window.showStatus = showStatus;
window.getRandomColor = getRandomColor;
window.exportToPNG = exportToPNG;

// Funzioni validazione immagini
window.validateImageFile = validateImageFile;
window.processImageFile = processImageFile;
window.generateFallbackIcon = generateFallbackIcon;
window.isIconUnique = isIconUnique;
window.showImageValidationErrors = showImageValidationErrors;

// Debug consolidato
window.debugWS = {
  debug: debugApp,
  refresh: forceUIRefresh,
  showStatus: showStatus,
  exportPNG: exportToPNG,
  // Info utili
  info: () => ({
    alliances: alliances.length,
    calibration: calibrationSettings,
    language: currentLanguage,
    unlocked: calibrationUnlocked
  })
};

console.log('✅ Utilities core caricato - Versione pulita e ottimizzata');