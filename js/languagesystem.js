// =====================================================================
// LANGUAGESYSTEM.JS - COMPLETE AND ROBUST LANGUAGE SYSTEM
// =====================================================================
// This file manages the entire multilingual system of the application,
// ensuring that every interface string is correctly translated into all
// supported languages without exceptions.
//
// DESIGN PHILOSOPHY:
// - Systematic mapping of ALL interface elements
// - Automatic validation of missing translations
// - Intelligent fallback for strings not found
// - Incremental and verifiable UI updates
// - Robust error handling for translations

console.log('🌐 Loading advanced language system...');

// =====================================================================
// SECTION 1: CONFIGURATION AND CONSTANTS
// =====================================================================

/**
 * Complete map of all DOM elements that require translation
 * Each element is categorized by functionality to facilitate debugging
 * and maintenance of the translation system
 */
const UI_TRANSLATION_MAP = {
  // =================================================================
  // CATEGORY: HEADER AND MAIN NAVIGATION
  // =================================================================
  header: {
    'main-title': { 
      property: 'textContent', 
      translationKey: 'title',
      fallback: '🗺️ Whiteout Survival Companion'
    },
    'main-subtitle': { 
      property: 'textContent', 
      translationKey: 'subtitle',
      fallback: 'Professional alliance management with map calibration'
    }
  },

  // =================================================================
  // CATEGORY: STATISTICS AND COUNTERS
  // =================================================================
  statistics: {
    'alliances-label': { 
      property: 'textContent', 
      translationKey: 'alliances',
      fallback: 'Alliances'
    },
    'assigned-label': { 
      property: 'textContent', 
      translationKey: 'assigned',
      fallback: 'Assigned'
    }
  },

  // =================================================================
  // CATEGORY: ALLIANCE MANAGEMENT
  // =================================================================
  alliances: {
    'alliance-management-title': { 
      property: 'textContent', 
      translationKey: 'allianceManagement',
      fallback: '🏰 Alliance Management'
    },
    'alliance-name': { 
      property: 'placeholder', 
      translationKey: 'allianceName',
      fallback: 'Alliance name...'
    },
    'add-alliance-btn': { 
      property: 'innerHTML', 
      translationKey: 'addAlliance',
      fallback: '✨ Add Alliance'
    }
  },

  // =================================================================
  // CATEGORY: CONTROLS AND MAIN BUTTONS
  // =================================================================
  controls: {
    'export-csv-btn': { 
      property: 'innerHTML', 
      translationKey: 'exportCSV',
      fallback: '📊 Export CSV'
    },
    'export-png-btn': { 
      property: 'innerHTML', 
      translationKey: 'exportPNG',
      fallback: '🖼️ Export PNG'
    },
    'import-csv-btn': { 
      property: 'innerHTML', 
      translationKey: 'importCSV',
      fallback: '📥 Import CSV'
    },
    'language-btn': { 
      property: 'innerHTML', 
      translationKey: 'language',
      fallback: '🌐 Language'
    },
    'reset-btn-text': { 
      property: 'textContent', 
      translationKey: 'resetAssignments',
      fallback: 'Reset Assignments'
    }
  },

  // =================================================================
  // CATEGORY: LANGUAGE SELECTOR
  // =================================================================
  languageSelector: {
    'select-language-title': { 
      property: 'textContent', 
      translationKey: 'selectLanguage',
      fallback: '🌐 Select Language'
    }
  },

  // =================================================================
  // CATEGORY: MAP AND VISUALIZATION
  // =================================================================
  map: {
    'map-title': { 
      property: 'textContent', 
      translationKey: 'interactiveMap',
      fallback: '🗺️ Interactive Map'
    },
    'legend-btn': { 
      property: 'innerHTML', 
      translationKey: 'legend',
      fallback: '🎨 Legend',
      transform: (text) => `🎨 ${text}` // Add icon if not present
    },
    'legend-title': { 
      property: 'textContent', 
      translationKey: 'legendTitle',
      fallback: '🎨 Official Colors and Icons Legend'
    }
  },

  // =================================================================
  // CATEGORY: LEGEND COLORS AND ICONS
  // =================================================================
  legend: {
    'color-castle': { 
      property: 'textContent', 
      translationKey: 'colorCastle',
      fallback: 'Castle (Gold)'
    },
    'color-construction': { 
      property: 'textContent', 
      translationKey: 'colorConstruction',
      fallback: 'Construction (Blue)'
    },
    'color-production': { 
      property: 'textContent', 
      translationKey: 'colorProduction',
      fallback: 'Production (Green)'
    },
    'color-defense': { 
      property: 'textContent', 
      translationKey: 'colorDefense',
      fallback: 'Defense (Teal)'
    },
    'color-gathering': { 
      property: 'textContent', 
      translationKey: 'colorGathering',
      fallback: 'Gathering (Purple)'
    },
    'color-tech': { 
      property: 'textContent', 
      translationKey: 'colorTech',
      fallback: 'Research/Tech (Orange)'
    },
    'color-weapons': { 
      property: 'textContent', 
      translationKey: 'colorWeapons',
      fallback: 'Troop Attack (Red)'
    },
    'color-training': { 
      property: 'textContent', 
      translationKey: 'colorTraining',
      fallback: 'Training (Yellow)'
    },
    'color-expedition': { 
      property: 'textContent', 
      translationKey: 'colorExpedition',
      fallback: 'March/Expedition (Pink)'
    },
    'color-stronghold': { 
      property: 'textContent', 
      translationKey: 'colorStronghold',
      fallback: 'Stronghold (Brown)'
    },
    'color-fortress': { 
      property: 'textContent', 
      translationKey: 'colorFortress',
      fallback: 'Fortress (Dark Gray)'
    }
  },

  // =================================================================
  // CATEGORY: SUMMARIES AND ACCORDION SECTIONS
  // =================================================================
  summaries: {
    'facility-summary-title': { 
      property: 'textContent', 
      translationKey: 'facilitySummary',
      fallback: '📋 Facility Summary'
    },
    'buff-summary-title': { 
      property: 'textContent', 
      translationKey: 'buffSummary',
      fallback: '⚡ Buff Summary'
    },
    'calibration-title': { 
      property: 'textContent', 
      translationKey: 'advancedCalibration',
      fallback: '🔧 Advanced Calibration'
    }
  }
};

/**
 * Advanced configuration for the translation system
 * These parameters control the behavior of the system
 */
const LANGUAGE_SYSTEM_CONFIG = {
  // Enable detailed logging for debug
  enableDetailedLogging: false,
  
  // Show warnings for missing translations
  showMissingTranslationWarnings: true,
  
  // Use English fallback if translation missing
  useFallbackTranslations: true,
  
  // Wait time for DOM updates (ms)
  domUpdateDelay: 50,
  
  // Automatic translation validation on language change
  autoValidateTranslations: true
};

// =====================================================================
// SECTION 2: UTILITY AND VALIDATION FUNCTIONS
// =====================================================================

/**
 * Intelligent logging function that adapts to configured detail level
 * Helps debug translation issues without polluting the console
 * 
 * @param {string} message - Message to log
 * @param {string} level - Log level ('info', 'warn', 'error')
 * @param {*} data - Additional data to show
 */
function logLanguageSystem(message, level = 'info', data = null) {
  if (!LANGUAGE_SYSTEM_CONFIG.enableDetailedLogging && level === 'info') {
    return; // Skip info logs if not in debug mode
  }
  
  const prefix = {
    'info': '🌐',
    'warn': '⚠️',
    'error': '❌'
  }[level] || '📝';
  
  const logFunction = {
    'info': console.log,
    'warn': console.warn, 
    'error': console.error
  }[level] || console.log;
  
  if (data) {
    logFunction(`${prefix} [Languages] ${message}`, data);
  } else {
    logFunction(`${prefix} [Languages] ${message}`);
  }
}

/**
 * Verifies that all necessary translation keys exist
 * for the current language, identifying missing translations
 * 
 * @param {string} languageCode - Language code to verify (eg: 'en', 'it')
 * @returns {Object} Report of missing translations
 */
function validateLanguageTranslations(languageCode) {
  if (!translations[languageCode]) {
    logLanguageSystem(`Language not found: ${languageCode}`, 'error');
    return { isValid: false, missingKeys: [], totalKeys: 0, completeness: 0 };
  }
  
  const translationSet = translations[languageCode];
  const missingKeys = [];
  let totalKeys = 0;
  
  // Scan all UI elements to verify translations
  Object.entries(UI_TRANSLATION_MAP).forEach(([category, elements]) => {
    Object.entries(elements).forEach(([elementId, config]) => {
      totalKeys++;
      
      if (!translationSet[config.translationKey]) {
        missingKeys.push({
          elementId,
          category,
          translationKey: config.translationKey,
          fallback: config.fallback
        });
      }
    });
  });
  
  const completeness = totalKeys > 0 ? Math.round(((totalKeys - missingKeys.length) / totalKeys) * 100) : 100;
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    totalKeys,
    completeness,
    language: languageCode
  };
}

/**
 * Gets translated text for a specific key, with intelligent fallback
 * This function is the heart of the secure translation system
 * 
 * @param {string} translationKey - Translation key
 * @param {string} fallbackText - Fallback text if translation not found
 * @param {Object} options - Additional options for translation
 * @returns {string} Translated text or fallback
 */
function getTranslatedText(translationKey, fallbackText, options = {}) {
  const t = translations[currentLanguage];
  
  // If translations are not available, use fallback
  if (!t) {
    if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
      logLanguageSystem(`Translations not available for language: ${currentLanguage}`, 'warn');
    }
    return fallbackText;
  }
  
  // If key exists, return the translation
  if (t[translationKey]) {
    let translatedText = t[translationKey];
    
    // Apply transformations if specified
    if (options.transform && typeof options.transform === 'function') {
      translatedText = options.transform(translatedText);
    }
    
    // Variable substitutions (eg: {count} → value)
    if (options.variables) {
      Object.entries(options.variables).forEach(([key, value]) => {
        translatedText = translatedText.replace(`{${key}}`, value);
      });
    }
    
    return translatedText;
  }
  
  // Fallback to English if configured
  if (LANGUAGE_SYSTEM_CONFIG.useFallbackTranslations && currentLanguage !== 'en') {
    const englishTranslations = translations['en'];
    if (englishTranslations && englishTranslations[translationKey]) {
      if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
        logLanguageSystem(`Using English fallback for key: ${translationKey}`, 'warn');
      }
      return englishTranslations[translationKey];
    }
  }
  
  // Last fallback: static text
  if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
    logLanguageSystem(`Missing translation for: ${translationKey}, using fallback: ${fallbackText}`, 'warn');
  }
  
  return fallbackText;
}

/**
 * Applies a translation to a specific DOM element
 * Handles different property types (textContent, innerHTML, placeholder, etc.)
 * 
 * @param {HTMLElement} element - DOM element to update
 * @param {Object} config - Translation configuration
 * @returns {boolean} True if translation was applied successfully
 */
function applyTranslationToElement(element, config) {
  if (!element) {
    return false;
  }
  
  try {
    const translatedText = getTranslatedText(
      config.translationKey, 
      config.fallback,
      { transform: config.transform }
    );
    
    // Apply translation to the correct property
    switch (config.property) {
      case 'textContent':
        element.textContent = translatedText;
        break;
      case 'innerHTML':
        element.innerHTML = translatedText;
        break;
      case 'placeholder':
        element.placeholder = translatedText;
        break;
      case 'title':
        element.title = translatedText;
        break;
      case 'alt':
        element.alt = translatedText;
        break;
      default:
        logLanguageSystem(`Unknown property: ${config.property}`, 'warn');
        return false;
    }
    
    logLanguageSystem(`Translated element: ${element.id || element.className} → ${translatedText}`, 'info');
    return true;
    
  } catch (error) {
    logLanguageSystem(`Error applying translation to element: ${error.message}`, 'error', { element, config });
    return false;
  }
}

// =====================================================================
// SECTION 3: SYSTEMATIC UI UPDATE
// =====================================================================

/**
 * Systematically updates all user interface elements
 * This is the main function that ensures every string is translated
 * 
 * @param {boolean} forceUpdate - Force update even if language hasn't changed
 * @returns {Object} Update report with statistics
 */
function updateUILanguageSystematic(forceUpdate = false) {
  logLanguageSystem(`Starting systematic UI update for language: ${currentLanguage}`);
  
  // Verify translations are available
  const t = translations[currentLanguage];
  if (!t) {
    logLanguageSystem(`Translations not available for: ${currentLanguage}`, 'error');
    return { success: false, reason: 'Translations not available' };
  }
  
  // Update statistics
  const updateStats = {
    totalElements: 0,
    successfulUpdates: 0,
    failedUpdates: 0,
    missingElements: [],
    language: currentLanguage,
    categories: {}
  };
  
  // Process each category of elements
  Object.entries(UI_TRANSLATION_MAP).forEach(([category, elements]) => {
    logLanguageSystem(`Processing category: ${category}`, 'info');
    
    const categoryStats = {
      total: 0,
      successful: 0,
      failed: 0,
      missing: []
    };
    
    // Process each element in the category
    Object.entries(elements).forEach(([elementId, config]) => {
      updateStats.totalElements++;
      categoryStats.total++;
      
      const element = document.getElementById(elementId);
      
      if (!element) {
        // Element not found in DOM
        const missingInfo = { elementId, category, config };
        updateStats.missingElements.push(missingInfo);
        categoryStats.missing.push(missingInfo);
        categoryStats.failed++;
        updateStats.failedUpdates++;
        
        logLanguageSystem(`DOM element not found: #${elementId}`, 'warn');
        return;
      }
      
      // Apply translation
      const success = applyTranslationToElement(element, config);
      
      if (success) {
        categoryStats.successful++;
        updateStats.successfulUpdates++;
      } else {
        categoryStats.failed++;
        updateStats.failedUpdates++;
      }
    });
    
    updateStats.categories[category] = categoryStats;
    logLanguageSystem(`Category ${category} completed: ${categoryStats.successful}/${categoryStats.total} successes`);
  });
  
  // Update dynamic components that might not be in the static map
  updateDynamicComponents();
  
  // Final report log
  logLanguageSystem(`UI update completed: ${updateStats.successfulUpdates}/${updateStats.totalElements} successes`);
  
  if (updateStats.missingElements.length > 0) {
    logLanguageSystem(`Missing elements found: ${updateStats.missingElements.length}`, 'warn', 
      updateStats.missingElements.map(m => m.elementId));
  }
  
  return updateStats;
}

/**
 * Updates dynamic components that might not be present
 * in the static map, like runtime-generated summaries
 */
function updateDynamicComponents() {
  logLanguageSystem('Updating dynamic components...');
  
  // Update summaries if functions are available
  if (typeof renderFacilitySummary === 'function') {
    try {
      renderFacilitySummary();
      logLanguageSystem('Facility summary updated');
    } catch (error) {
      logLanguageSystem(`Error updating facility summary: ${error.message}`, 'error');
    }
  }
  
  if (typeof renderBuffSummary === 'function') {
    try {
      renderBuffSummary();
      logLanguageSystem('Buff summary updated');
    } catch (error) {
      logLanguageSystem(`Error updating buff summary: ${error.message}`, 'error');
    }
  }
  
  // Update alliance list if available
  if (typeof renderAllianceList === 'function') {
    try {
      renderAllianceList();
      logLanguageSystem('Alliance list updated');
    } catch (error) {
      logLanguageSystem(`Error updating alliance list: ${error.message}`, 'error');
    }
  }
}

/**
 * Legacy version of updateUILanguage function for compatibility
 * Maintains existing interface while using the new system
 */
function updateUILanguage() {
  return updateUILanguageSystematic();
}

// =====================================================================
// SECTION 4: LANGUAGE SELECTOR MANAGEMENT AND INTERACTIONS
// =====================================================================

/**
 * Shows/hides the language selector with smooth animation
 * Automatically updates language button states
 */
function toggleLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (!selector) {
    logLanguageSystem('Language selector not found in DOM', 'warn');
    return;
  }
  
  if (selector.classList.contains('hidden')) {
    // Show selector
    selector.classList.remove('hidden');
    selector.style.animation = 'fadeIn 0.3s ease';
    
    // Highlight current language
    updateLanguageButtons();
    
    logLanguageSystem('Language selector opened');
  } else {
    // Hide selector
    selector.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      selector.classList.add('hidden');
    }, 300);
    
    logLanguageSystem('Language selector closed');
  }
}

/**
 * Sets a new language chosen by the user
 * Handles the entire language change process with appropriate feedback
 * 
 * @param {string} languageCode - Language code to set
 */
function setLanguage(languageCode) {
  logLanguageSystem(`Language change request: ${currentLanguage} → ${languageCode}`);
  
  // Validate supported language
  if (!SUPPORTED_LANGUAGES.includes(languageCode)) {
    logLanguageSystem(`Unsupported language: ${languageCode}`, 'error');
    const t = translations[currentLanguage] || translations['en'];
    if (typeof showStatus === 'function') {
      showStatus(`❌ ${t.languageNotSupported || 'Language not supported'}: ${languageCode}`, 'error');
    }
    return;
  }
  
  // Validate translations before change
  if (LANGUAGE_SYSTEM_CONFIG.autoValidateTranslations) {
    const validation = validateLanguageTranslations(languageCode);
    if (!validation.isValid) {
      logLanguageSystem(`Incomplete translations for ${languageCode}: ${validation.completeness}%`, 'warn', 
        validation.missingKeys.slice(0, 5)); // Show only first 5 missing keys
    }
  }
  
  // Update global language (use function from utilities.js)
  if (typeof setAppLanguage === 'function') {
    setAppLanguage(languageCode, true); // true = user choice
  } else {
    // Fallback if utilities.js is not loaded
    currentLanguage = languageCode;
    localStorage.setItem('whiteout-language-user-set', languageCode);
  }
  
  // Update UI with small delay to ensure currentLanguage is updated
  setTimeout(() => {
    const updateResult = updateUILanguageSystematic();
    
    // Update language buttons
    updateLanguageButtons();
    
    // Show confirmation message
    const t = translations[currentLanguage];
    const langName = getLanguageDisplayName(currentLanguage);
    const confirmMessage = `${t.languageSet || '🌐 Language set!'} ${langName}`;
    
    if (typeof showStatus === 'function') {
      showStatus(confirmMessage, 'success', 3000);
    }
    
    // Close selector
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.classList.add('hidden');
    }
    
    // Show welcome message if first time
    showFirstTimeLanguageMessage();
    
    logLanguageSystem(`Language change completed: ${languageCode} (${updateResult.successfulUpdates}/${updateResult.totalElements} elements updated)`);
    
  }, LANGUAGE_SYSTEM_CONFIG.domUpdateDelay);
}

/**
 * Updates visual state of language buttons in the selector
 * Highlights current language and resets others
 */
function updateLanguageButtons() {
  logLanguageSystem('Updating language buttons...');
  
  // Reset all buttons
  document.querySelectorAll('[id^="lang-"]').forEach(btn => {
    btn.classList.remove('btn-success');
    btn.classList.add('btn-info');
  });
  
  // Highlight current language button
  const currentBtn = document.getElementById(`lang-${currentLanguage}`);
  if (currentBtn) {
    currentBtn.classList.remove('btn-info');
    currentBtn.classList.add('btn-success');
    logLanguageSystem(`Button highlighted: lang-${currentLanguage}`);
  } else {
    logLanguageSystem(`Button not found for language: lang-${currentLanguage}`, 'warn');
  }
}

/**
 * Shows welcome message for first-time users
 * Provides useful information about using the multilingual system
 */
function showFirstTimeLanguageMessage() {
  const isFirstTime = !localStorage.getItem('whiteout-language-user-set-before');
  
  if (isFirstTime) {
    localStorage.setItem('whiteout-language-user-set-before', 'true');
    
    setTimeout(() => {
      const welcomeMessages = {
        'en': '👋 Welcome! You can always change the language from the 🌐 button.',
        'it': '👋 Benvenuto! Puoi sempre cambiare la lingua dal pulsante 🌐.',
        'es': '👋 ¡Bienvenido! Siempre puedes cambiar el idioma desde el botón 🌐.',
        'fr': '👋 Bienvenue! Vous pouvez toujours changer la langue depuis le bouton 🌐.',
        'de': '👋 Willkommen! Sie können die Sprache jederzeit über die Schaltfläche 🌐 ändern.',
        'pt': '👋 Bem-vindo! Você sempre pode alterar o idioma através do botão 🌐.'
      };
      
      const message = welcomeMessages[currentLanguage] || welcomeMessages['en'];
      
      if (typeof showStatus === 'function') {
        showStatus(message, 'info', 6000);
      }
      
    }, 4000); // Wait for user to orient after language change
  }
}

// =====================================================================
// SECTION 5: INITIALIZATION AND SYSTEM SETUP
// =====================================================================

/**
 * Completely initializes the multilingual system
 * This function must be called after the DOM is completely loaded
 * 
 * @returns {Object} Initialization report
 */
function initializeLanguageSystem() {
  logLanguageSystem('Initializing advanced language system...');
  
  // Check prerequisites
  if (typeof translations === 'undefined') {
    logLanguageSystem('translations.js file not loaded!', 'error');
    return { success: false, reason: 'Translations not available' };
  }
  
  if (typeof currentLanguage === 'undefined') {
    logLanguageSystem('currentLanguage not defined, using default', 'warn');
    currentLanguage = 'en';
  }
  
  // Validate current language
  const validation = validateLanguageTranslations(currentLanguage);
  
  if (!validation.isValid) {
    logLanguageSystem(`Current language (${currentLanguage}) has incomplete translations: ${validation.completeness}%`, 'warn');
    
    if (LANGUAGE_SYSTEM_CONFIG.showMissingTranslationWarnings) {
      console.table(validation.missingKeys.slice(0, 10)); // Show first 10 missing keys in table
    }
  }
  
  // Update initial UI
  const updateResult = updateUILanguageSystematic();
  
  // Update language buttons
  updateLanguageButtons();
  
  // Show auto-detected language message if appropriate
  setTimeout(() => {
    showAutoDetectedLanguageMessage();
  }, 1000);
  
  logLanguageSystem(`Language system initialized: ${currentLanguage} (${getLanguageDisplayName(currentLanguage)})`);
  logLanguageSystem(`Translation completeness: ${validation.completeness}% (${validation.totalKeys - validation.missingKeys.length}/${validation.totalKeys})`);
  
  return {
    success: true,
    language: currentLanguage,
    validation: validation,
    updateResult: updateResult
  };
}

/**
 * Shows informative message when language was auto-detected
 * Helps user understand how language was chosen
 */
function showAutoDetectedLanguageMessage() {
  // Show only if language was auto-detected (not chosen by user)
  const userSetLanguage = localStorage.getItem('whiteout-language-user-set');
  
  if (!userSetLanguage && typeof showWelcomeMessage === 'function') {
    showWelcomeMessage();
  }
}

// =====================================================================
// SECTION 6: DEBUG AND DIAGNOSTIC FUNCTIONS
// =====================================================================

/**
 * Complete debug function for the language system
 * Provides detailed report on translations, coverage and issues
 * 
 * @param {boolean} showDetails - Whether to show details of missing translations
 * @returns {Object} Complete system report
 */
function debugLanguageSystem(showDetails = false) {
  console.log('🔍 === DEBUG LANGUAGE SYSTEM ===');
  
  // General information
  const currentInfo = getCurrentLanguageInfo();
  console.log('📊 Current state:', currentInfo);
  
  // Validation of all languages
  const languageReports = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    languageReports[lang] = validateLanguageTranslations(lang);
  });
  
  console.log('🌍 Translation reports by language:');
  Object.entries(languageReports).forEach(([lang, report]) => {
    const flag = {
      'it': '🇮🇹', 'en': '🇺🇸', 'es': '🇪🇸', 
      'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇵🇹'
    }[lang] || '🏳️';
    
    console.log(`  ${flag} ${lang.toUpperCase()}: ${report.completeness}% (${report.totalKeys - report.missingKeys.length}/${report.totalKeys})`);
    
    if (showDetails && report.missingKeys.length > 0) {
      console.log(`    ❌ Missing:`, report.missingKeys.map(k => k.translationKey));
    }
  });
  
  // Test DOM elements
  const missingElements = [];
  const foundElements = [];
  
  Object.entries(UI_TRANSLATION_MAP).forEach(([category, elements]) => {
    Object.keys(elements).forEach(elementId => {
      const element = document.getElementById(elementId);
      if (element) {
        foundElements.push(elementId);
      } else {
        missingElements.push({ elementId, category });
      }
    });
  });
  
  console.log('🎯 DOM elements:');
  console.log(`  ✅ Found: ${foundElements.length}`);
  console.log(`  ❌ Missing: ${missingElements.length}`);
  
  if (showDetails && missingElements.length > 0) {
    console.log('  📋 Missing elements:', missingElements);
  }
  
  // Current configuration
  console.log('⚙️ Configuration:', LANGUAGE_SYSTEM_CONFIG);
  
  console.log('=== END DEBUG LANGUAGE SYSTEM ===');
  
  return {
    currentLanguage: currentInfo,
    languageReports,
    domElements: { found: foundElements.length, missing: missingElements.length, missingDetails: missingElements },
    config: LANGUAGE_SYSTEM_CONFIG
  };
}

/**
 * Gets complete information about the current language
 * Useful for debug and diagnostics
 * 
 * @returns {Object} Detailed language information
 */
function getCurrentLanguageInfo() {
  return {
    current: currentLanguage,
    displayName: getLanguageDisplayName(currentLanguage),
    isUserSelected: !!localStorage.getItem('whiteout-language-user-set'),
    isAutoDetected: !localStorage.getItem('whiteout-language-user-set'),
    detectedLanguage: typeof detectDeviceLanguage === 'function' ? detectDeviceLanguage() : 'N/A',
    supportedLanguages: SUPPORTED_LANGUAGES.map(lang => ({
      code: lang,
      name: getLanguageDisplayName(lang)
    }))
  };
}

/**
 * Resets all language settings to automatic detection
 * Useful for testing and restoring settings
 * 
 * @returns {string} New automatically detected language
 */
function resetLanguageToAuto() {
  logLanguageSystem('Resetting language to automatic detection...');
  
  // Remove user preferences
  localStorage.removeItem('whiteout-language-user-set');
  localStorage.removeItem('whiteout-language-user-set-before');
  
  // Re-initialize language automatically
  let newLang = 'en'; // fallback
  if (typeof initializeAppLanguage === 'function') {
    newLang = initializeAppLanguage();
  } else if (typeof detectDeviceLanguage === 'function') {
    newLang = detectDeviceLanguage();
    currentLanguage = newLang;
  }
  
  // Update UI
  setTimeout(() => {
    updateUILanguageSystematic();
    updateLanguageButtons();
    
    if (typeof showStatus === 'function') {
      showStatus(`🌍 Language reset to automatic detection: ${getLanguageDisplayName(newLang)}`, 'info', 4000);
    }
  }, LANGUAGE_SYSTEM_CONFIG.domUpdateDelay);
  
  logLanguageSystem(`Language reset: ${newLang}`);
  return newLang;
}

// =====================================================================
// SECTION 7: GLOBAL EXPORTS AND INTEGRATION
// =====================================================================

// Export main functions for use by other modules
window.toggleLanguageSelector = toggleLanguageSelector;
window.setLanguage = setLanguage;
window.updateUILanguage = updateUILanguage;
window.initializeLanguageSystem = initializeLanguageSystem;

// Debug and utility functions (accessible from console)
window.debugLanguageSystem = debugLanguageSystem;
window.getCurrentLanguageInfo = getCurrentLanguageInfo;
window.resetLanguageToAuto = resetLanguageToAuto;
window.validateAllLanguages = () => {
  const results = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    results[lang] = validateLanguageTranslations(lang);
  });
  return results;
};

// Integration with global debugger if available
if (typeof window.debugWS !== 'undefined') {
  window.debugWS.language = {
    current: getCurrentLanguageInfo,
    debug: debugLanguageSystem,
    reset: resetLanguageToAuto,
    set: setLanguage,
    validate: validateLanguageTranslations,
    config: LANGUAGE_SYSTEM_CONFIG,
    map: UI_TRANSLATION_MAP
  };
}

// =====================================================================
// SECTION 8: AUTOMATIC INITIALIZATION
// =====================================================================

/**
 * Auto-initialization when DOM is ready
 * The system starts automatically for maximum compatibility
 */
document.addEventListener('DOMContentLoaded', function() {
  // Brief wait to ensure all modules are loaded
  setTimeout(() => {
    if (typeof currentLanguage !== 'undefined') {
      const initResult = initializeLanguageSystem();
      
      if (initResult.success) {
        logLanguageSystem(`✅ Language system started automatically: ${initResult.language}`);
      } else {
        logLanguageSystem(`❌ Automatic startup error: ${initResult.reason}`, 'error');
      }
    } else {
      logLanguageSystem('❌ currentLanguage not defined, language system not started automatically', 'error');
    }
  }, 200);
});

// =====================================================================
// FINAL LOG AND INTEGRITY CHECK
// =====================================================================

logLanguageSystem('Complete language system loaded successfully');
logLanguageSystem(`Configuration: ${Object.keys(UI_TRANSLATION_MAP).length} categories, ${Object.values(UI_TRANSLATION_MAP).reduce((total, cat) => total + Object.keys(cat).length, 0)} total elements`);

// Integrity check on load
if (typeof translations !== 'undefined' && typeof currentLanguage !== 'undefined') {
  logLanguageSystem(`✅ Prerequisites satisfied for language: ${currentLanguage}`);
} else {
  logLanguageSystem('⚠️ Some prerequisites missing, language system might not work correctly', 'warn');
}

console.log('🌐 LanguageSystem.js loaded completely - Ready for initialization');