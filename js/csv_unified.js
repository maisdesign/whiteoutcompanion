// =====================================================================
// CSV-UNIFIED.JS - UNIFIED CSV EXPORT/IMPORT SYSTEM
// =====================================================================
// This file gradually replaces the 3+ existing CSV implementations
// with a single robust, testable and compatible version.
//
// DESIGN PHILOSOPHY:
// - Total backward compatibility with existing code
// - Robust error handling
// - Optimized performance
// - Detailed logging for debug
// - Support for CSV special characters

console.log('📊 Loading CSV System Unified v1.0...');

/**
 * Unified CSV management system
 * Replaces exportCSVFixed, exportCSV, exportCSVFunction with a single implementation
 */
class UnifiedCSVSystem {
  
  constructor() {
    this.version = '1.0.0';
    this.initialized = false;
    this.translations = null;
    this.currentLanguage = 'en';
    
    // Bind methods for use as callbacks
    this.exportCSV = this.exportCSV.bind(this);
    this.importCSV = this.importCSV.bind(this);
    
    console.log('📊 UnifiedCSVSystem v' + this.version + ' created');
  }

  /**
   * Enhanced system initialization with robust data detection
   */
  /**
 * FIXED: Enhanced system initialization with CORRECT data detection
 */
initialize() {
  if (this.initialized) return true;
  
  try {
    // Connect translation system if available
    this.translations = window.translations || {};
    this.currentLanguage = window.currentLanguage || 'en';
    
    // FIXED: Check prerequisites using direct access like existing code
    if (typeof facilityData === 'undefined' || !facilityData || facilityData.length === 0) {
      console.warn('⚠️ facilityData not yet available, initialization postponed');
      console.log('🔍 Debug info:', {
        facilityDataType: typeof facilityData,
        facilityDataLength: (typeof facilityData !== 'undefined' && facilityData) ? facilityData.length : 'N/A',
        alliancesType: typeof alliances,
        alliancesLength: (typeof alliances !== 'undefined' && alliances) ? alliances.length : 'N/A'
      });
      return false;
    }
    
    this.initialized = true;
    console.log('✅ UnifiedCSVSystem initialized with', facilityData.length, 'facilities');
    return true;
    
  } catch (error) {
    console.error('❌ CSV System initialization error:', error);
    return false;
  }
}

  /**
   * Smart facility data finder - checks multiple possible locations
   */
  findFacilityData() {
    // Method 1: Direct global variable
    if (window.facilityData && Array.isArray(window.facilityData) && window.facilityData.length > 0) {
      console.log('✅ Found facilityData via window.facilityData');
      return window.facilityData;
    }
    
    // Method 2: Check for markers with data
    const markers = document.querySelectorAll('.marker');
    if (markers.length > 0) {
      console.log('✅ Found', markers.length, 'markers, attempting data extraction');
      
      // Try to extract data from markers
      const extractedData = [];
      markers.forEach((marker, index) => {
        try {
          // Check if marker has data attributes or stored data
          const facilityInfo = {
            Type: marker.getAttribute('data-type') || marker.classList.toString().match(/\b(construction|production|defense|gathering|tech|weapons|training|expedition|stronghold|fortress)\b/i)?.[0] || 'Unknown',
            Level: marker.getAttribute('data-level') || '1',
            x: parseFloat(marker.style.left) || 0,
            y: parseFloat(marker.style.top) || 0,
            Alliance: marker.getAttribute('data-alliance') || ''
          };
          
          // Only add if we have meaningful position data
          if (facilityInfo.x > 0 || facilityInfo.y > 0) {
            extractedData.push(facilityInfo);
          }
        } catch (error) {
          console.warn('⚠️ Error extracting data from marker', index, error);
        }
      });
      
      if (extractedData.length > 0) {
        console.log('✅ Extracted data from', extractedData.length, 'markers');
        return extractedData;
      }
    }
    
    // Method 3: Check other possible global data locations
    const possibleDataVars = [
      'structureData', 'facilitiesData', 'mapData', 'gameData',
      'whiteoutData', 'facilityList', 'structures'
    ];
    
    for (const varName of possibleDataVars) {
      if (window[varName] && Array.isArray(window[varName]) && window[varName].length > 0) {
        console.log('✅ Found data via window.' + varName);
        return window[varName];
      }
    }
    
    // Method 4: Check if data is embedded in DOM
    const dataScripts = document.querySelectorAll('script[type="application/json"]');
    for (const script of dataScripts) {
      try {
        const data = JSON.parse(script.textContent);
        if (Array.isArray(data) && data.length > 0 && data[0].Type) {
          console.log('✅ Found data in JSON script tag');
          return data;
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
    
    console.log('❌ No facility data found in any location');
    return null;
  }

  /**
 * FIXED: Main CSV export with CORRECT data access
 */
exportCSV() {
  console.log('📤 Starting unified CSV export...');
  
  // Ensure it's initialized
  if (!this.initialized && !this.initialize()) {
    this.showStatus('❌ CSV system not initialized', 'error');
    return false;
  }
  
  const t = this.translations[this.currentLanguage] || this.translations['en'] || {};
  
  try {
    // FIXED: Check data availability using direct access like existing code
    if (typeof facilityData === 'undefined' || !facilityData || facilityData.length === 0) {
      const message = t.noDataToExport || '❌ No data to export';
      this.showStatus(message, 'error');
      return false;
    }
    
    // Generate CSV content
    const csvContent = this.generateCSVContent(facilityData);
    
    // Execute download
    const success = this.downloadCSV(csvContent);
    
    if (success) {
      // Show success statistics
      const stats = this.getExportStats(facilityData);
      const message = `✅ ${t.csvExported || 'CSV exported'}: ${stats.total} structures (${stats.assigned} assigned)`;
      this.showStatus(message, 'success');
      
      console.log('✅ CSV export completed:', stats);
      return true;
    } else {
      throw new Error('Download failed');
    }
    
  } catch (error) {
    console.error('❌ CSV export error:', error);
    const message = `❌ Export error: ${error.message}`;
    this.showStatus(message, 'error');
    return false;
  }
}

  /**
   * CSV import with robust parsing
   */
  importCSV(file) {
    console.log('📥 Starting CSV import:', file.name);
    
    const t = this.translations[this.currentLanguage] || this.translations['en'] || {};
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvText = event.target.result;
          const result = this.parseAndProcessCSV(csvText);
          
          if (result.success) {
            const message = `✅ ${t.importSuccess || 'Import completed'}: ${result.importedCount} assignments`;
            this.showStatus(message, 'success');
            
            // Update UI if functions available
            this.refreshUI();
            
            resolve(result);
          } else {
            throw new Error(result.error || 'Import failed');
          }
          
        } catch (error) {
          console.error('❌ CSV import error:', error);
          const message = `❌ ${t.importError || 'Import error'}: ${error.message}`;
          this.showStatus(message, 'error');
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('File read error');
        console.error('❌ CSV file read error');
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Generate CSV content with correct escaping
   */
  generateCSVContent(facilityData) {
    // Fixed header
    const headers = ['Type', 'Level', 'X', 'Y', 'Alliance'];
    
    // Safe CSV escape function
    const escapeCSV = (value) => {
      if (value === null || value === undefined || value === '') return '';
      
      const str = String(value);
      // If contains special characters, wrap in quotes and escape internal quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // Generate data rows
    const rows = facilityData.map(facility => {
      return [
        escapeCSV(facility.Type),
        escapeCSV(facility.Level),
        parseFloat(facility.x || 0).toFixed(2),
        parseFloat(facility.y || 0).toFixed(2),
        escapeCSV(facility.Alliance)
      ].join(',');
    });
    
    // Combine header and rows
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Download CSV file with cross-browser support
   */
  downloadCSV(csvContent) {
    try {
      // BOM for Excel UTF-8 support
      const csvWithBOM = '\ufeff' + csvContent;
      
      // Create blob
      const blob = new Blob([csvWithBOM], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `whiteout_facilities_${timestamp}.csv`;
      
      // Download with IE support
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        // Modern browsers
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }
      
      return true;
    } catch (error) {
      console.error('❌ CSV download error:', error);
      return false;
    }
  }

  /**
   * Parse CSV with robust error handling
   */
  parseAndProcessCSV(csvText) {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return { success: false, error: 'Empty or invalid CSV' };
      }
      
      // Parse header
      const headers = this.parseCSVLine(lines[0]);
      const expectedHeaders = ['Type', 'Level', 'X', 'Y', 'Alliance'];
      
      // Validate header
      const headerCheck = this.validateHeaders(headers, expectedHeaders);
      if (!headerCheck.valid) {
        return { success: false, error: `Invalid headers: ${headerCheck.error}` };
      }
      
      // Parse data
      let importedCount = 0;
      const errors = [];
      
      for (let i = 1; i < lines.length; i++) {
        try {
          const values = this.parseCSVLine(lines[i]);
          const rowData = {};
          
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });
          
          // Apply assignment if valid
          if (this.applyFacilityAssignment(rowData)) {
            importedCount++;
          }
          
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }
      
      return {
        success: true,
        importedCount,
        errors,
        totalProcessed: lines.length - 1
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Parse CSV line with quote handling
   */
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Double quote escape
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim()); // Last field
    return result;
  }

  /**
   * Validate CSV headers
   */
  validateHeaders(actual, expected) {
    const missing = expected.filter(h => !actual.includes(h));
    const extra = actual.filter(h => !expected.includes(h));
    
    if (missing.length > 0) {
      return { valid: false, error: `Missing columns: ${missing.join(', ')}` };
    }
    
    return { valid: true, extra };
  }

  /**
 * FIXED: Apply facility assignment using direct access
 */
applyFacilityAssignment(rowData) {
  // FIXED: Use direct access like existing code
  if (typeof facilityData === 'undefined' || !facilityData) {
    console.warn('⚠️ facilityData not available for assignment');
    return false;
  }
  
  // Find matching facility
  const facility = facilityData.find(f => 
    f.Type === rowData.Type &&
    f.Level === rowData.Level &&
    Math.abs(f.x - parseFloat(rowData.X)) < 0.1 &&
    Math.abs(f.y - parseFloat(rowData.Y)) < 0.1
  );
  
  if (facility && rowData.Alliance) {
    // Assign alliance
    facility.Alliance = rowData.Alliance;
    
    // FIXED: Create alliance if doesn't exist using direct access
    // Create alliance if doesn't exist using direct access
if (typeof alliances !== 'undefined' && alliances && !alliances.find(a => a.name === rowData.Alliance)) {
  // Use existing icon generation function instead of just random color
  const iconFunction = typeof generateDefaultIcon === 'function' ? generateDefaultIcon : 
                      (typeof window.generateDefaultIcon === 'function' ? window.generateDefaultIcon : 
                      this.generateFallbackIcon);
  
  alliances.push({
    name: rowData.Alliance,
    icon: iconFunction(rowData.Alliance)  // ← Generate proper colored icon with initial
  });
  
  console.log('✅ Created alliance with icon:', rowData.Alliance);
}
    
    return true;
  }
  
  return false;
}

  /**
   * Export statistics
   */
  getExportStats(facilityData) {
    return {
      total: facilityData.length,
      assigned: facilityData.filter(f => f.Alliance && f.Alliance.trim() !== '').length,
      unassigned: facilityData.filter(f => !f.Alliance || f.Alliance.trim() === '').length
    };
  }

  /**
 * Fallback icon generator (matches existing system)
 */
generateFallbackIcon(name) {
  const colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
    '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
  ];
  
  const colorIndex = Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
  const color = colors[colorIndex];
  
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
      <circle cx='16' cy='16' r='16' fill='${color}'/>
      <text x='16' y='20' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-size='18' font-weight='bold'>
        ${name.charAt(0).toUpperCase()}
      </text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

  /**
   * Refresh UI after import
   */
  refreshUI() {
  try {
    // CRITICAL: Update individual marker visuals after import
    if (typeof facilityData !== 'undefined' && facilityData) {
      facilityData.forEach(facility => {
        if (facility.marker) {
          // Update alliance icon on marker
          if (typeof renderAllianceIcon === 'function') {
            renderAllianceIcon(facility);
          } else if (typeof renderAllianceIconOnMarker === 'function') {
            renderAllianceIconOnMarker(facility);
          }
          
          // Update CSS classes
          if (facility.Alliance) {
            facility.marker.classList.add('assigned');
          } else {
            facility.marker.classList.remove('assigned');
          }
        }
      });
      console.log('✅ Individual markers updated with alliance icons');
    }
    
    // Update all UI components
    if (typeof updateAllUI === 'function') updateAllUI();
    if (typeof updateStats === 'function') updateStats();
    if (typeof renderAllianceList === 'function') renderAllianceList();
    if (typeof updateSummaries === 'function') updateSummaries();
    
    // CRITICAL: Save data to localStorage (this was missing!)
    if (typeof saveData === 'function') {
      saveData();
      console.log('💾 Data saved to localStorage after CSV import');
    } else {
      console.warn('⚠️ saveData function not available - data will not persist');
    }
    
  } catch (error) {
    console.warn('⚠️ UI refresh error:', error);
  }
}

  /**
   * Show status messages
   */
  showStatus(message, type = 'info', duration = 5000) {
    if (typeof window.showStatus === 'function') {
      window.showStatus(message, type, duration);
    } else {
      // Fallback console
      const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
      console.log(`${emoji} ${message}`);
    }
  }


  /**
   * Setup event listener for import file
   */
  setupImportListener() {
    const importInput = document.getElementById('import-file');
    
    if (!importInput) {
      console.warn('⚠️ Element #import-file not found');
      return false;
    }
    
    // Remove existing listeners
    const newInput = importInput.cloneNode(true);
    importInput.parentNode.replaceChild(newInput, importInput);
    
    // Add new listener
    newInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      console.log('📁 File selected:', file.name);
      
      // Check extension
      if (!file.name.toLowerCase().endsWith('.csv')) {
        this.showStatus('❌ Select a valid CSV file', 'error');
        event.target.value = '';
        return;
      }
      
      // Start import
      this.importCSV(file).finally(() => {
        event.target.value = ''; // Reset to allow reimport
      });
    });
    
    console.log('✅ Import listener configured');
    return true;
  }
}

// =====================================================================
// INITIALIZATION AND GLOBAL EXPORTS
// =====================================================================

// Create global instance
const unifiedCSVSystem = new UnifiedCSVSystem();

// Export functions for TOTAL compatibility with existing code
window.exportCSV = () => unifiedCSVSystem.exportCSV();
window.exportCSVFunction = () => unifiedCSVSystem.exportCSV();
window.exportCSVFixed = () => unifiedCSVSystem.exportCSV();

// Import function for compatibility
window.importCSVFunction = (file) => unifiedCSVSystem.importCSV(file);
window.importCSVFixed = (file) => unifiedCSVSystem.importCSV(file);

// Setup import listener
window.setupCSVImportFixed = () => unifiedCSVSystem.setupImportListener();

// Export instance for advanced use
window.unifiedCSVSystem = unifiedCSVSystem;

// =====================================================================
// ENHANCED SMART INITIALIZATION WITH EVENT-BASED DETECTION
// =====================================================================

/**
 * Enhanced smart initialization with event-based detection
 */
function enhancedSmartInitialization() {
  const maxRetries = 5; // Reduced since we have better detection
  let retryCount = 0;
  
  function tryInitialize() {
    retryCount++;
    console.log(`🔄 Enhanced CSV initialization attempt: ${retryCount}/${maxRetries}`);
    
    if (unifiedCSVSystem.initialize()) {
      unifiedCSVSystem.setupImportListener();
      console.log('✅ CSV System Unified ready!');
      return true;
    }
    
    if (retryCount < maxRetries) {
      const delay = 1000 * retryCount; // 1s, 2s, 3s, 4s, 5s
      console.log(`⏳ Retry in ${delay}ms...`);
      setTimeout(tryInitialize, delay);
    } else {
      console.warn('⚠️ CSV System: initialization failed, will use lazy loading');
    }
    
    return false;
  }
  
  return tryInitialize();
}

// Listen for custom events that might indicate data is ready
document.addEventListener('dataLoaded', () => {
  console.log('🔄 Data loaded event detected, trying CSV initialization...');
  enhancedSmartInitialization();
});

document.addEventListener('markersCreated', () => {
  console.log('🔄 Markers created event detected, trying CSV initialization...');
  enhancedSmartInitialization();
});

// Auto-initialization with enhanced timing
document.addEventListener('DOMContentLoaded', () => {
  // First attempt after DOM ready
  setTimeout(() => {
    console.log('🔄 Enhanced CSV initialization starting...');
    enhancedSmartInitialization();
  }, 2000); // Wait 2 seconds for app to stabilize
});

// Backup: lazy initialization on first use
const originalExportCSV = unifiedCSVSystem.exportCSV;
unifiedCSVSystem.exportCSV = function() {
  // If not yet initialized, try now
  if (!this.initialized) {
    console.log('🔄 Lazy CSV System initialization...');
    this.initialize();
  }
  
  return originalExportCSV.call(this);
};

// Event listener for window load (later timing)
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!unifiedCSVSystem.initialized) {
      console.log('🔄 Post window.load initialization attempt...');
      enhancedSmartInitialization();
    }
  }, 3000); // Longer delay for window load
});

console.log('📊 CSV System Unified loaded with enhanced smart initialization');