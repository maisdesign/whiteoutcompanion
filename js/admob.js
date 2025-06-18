/**
 * ========================================================================
 * ADMOB INTEGRATION MODULE - Versione Ottimizzata
 * ========================================================================
 * 
 * Modulo per l'integrazione avanzata degli annunci AdMob con architettura
 * moderna e gestione robusta degli stati asincroni. Implementa pattern
 * di programmazione difensiva e ottimizzazioni delle performance.
 * 
 * CARATTERISTICHE PRINCIPALI:
 * • Compatibilità universale: Capacitor + Web Browser
 * • Gestione intelligente del ciclo di vita dell'applicazione
 * • Sistema di fallback robusto per ambienti non supportati
 * • Inizializzazione autonoma con pattern dependency-free
 * • Sistema di debug integrato per sviluppo e troubleshooting
 * 
 * ARCHITETTURA:
 * Il modulo segue un pattern di isolamento funzionale dove ogni componente
 * ha responsabilità specifiche e ben definite. La gestione degli stati
 * asincroni è ottimizzata per ridurre race conditions e migliorare la
 * robustezza complessiva del sistema.
 * ========================================================================
 */

// ========================================================================
// CONFIGURAZIONE E COSTANTI GLOBALI
// ========================================================================

/**
 * Configurazione centralizzata AdMob con valori di fallback sicuri.
 * Questa struttura permette modifiche rapide senza toccare la logica
 * e fornisce un punto di controllo unico per tutti i parametri critici.
 */
const ADMOB_CONFIG = Object.freeze({
  // ID banner AdMob - Sostituire con ID reali in produzione
  bannerIds: Object.freeze({
    top: 'ca-app-pub-0198329042214907/7233197538',
    bottom: 'ca-app-pub-0198329042214907/698580'
  }),
  
  // Dispositivi di test per sviluppo
  testDevices: Object.freeze(['abd4101b-dd65-4eb4-a73c-aae0c9fd5436']),
  
  // Flag di controllo per modalità test
  showTestAds: true,
  
  // Configurazione ambiente produzione
  production: Object.freeze({
    enableLogging: false,        // Disabilita logging in produzione
    retryAttempts: 2,           // Tentativi massimi per operazioni fallite
    debounceDelay: 300          // Delay per debounce eventi sistema
  }),
  
  // Timing per operazioni asincrone (ottimizzazione performance)
  delays: Object.freeze({
    initialization: 500,
    reloadAfterResume: 1000,
    orientationChange: 500,
    bannerReload: 100
  }),
  
  // Selettori DOM (centralizzati per manutenibilità)
  selectors: Object.freeze({
    topBanner: 'top-admob-banner',
    bottomBanner: 'bottom-admob-banner',
    webVersionClass: 'web-version'
  })
});

// ========================================================================
// GESTIONE DELLO STATO GLOBALE
// ========================================================================

/**
 * Stato del modulo AdMob gestito tramite oggetto immutabile per ridurre
 * side effects e migliorare la prevedibilità del comportamento.
 */
const AdMobState = (() => {
  let state = {
    isReady: false,
    isCapacitorApp: false,
    isInitializing: false,
    bannersLoaded: { top: false, bottom: false }
  };

  return Object.freeze({
    get: (key) => key ? state[key] : { ...state },
    
    update: (updates) => {
      state = { ...state, ...updates };
      return state;
    },
    
    reset: () => {
      state = {
        isReady: false,
        isCapacitorApp: false,
        isInitializing: false,
        bannersLoaded: { top: false, bottom: false }
      };
      return state;
    }
  });
})();

// ========================================================================
// UTILITÀ E HELPER FUNCTIONS
// ========================================================================

/**
 * Helper per la gestione sicura degli elementi DOM con pattern null-safe.
 * Riduce il boilerplate e centralizza la logica di accesso al DOM.
 */
const DOMHelpers = Object.freeze({
  /**
   * Ottiene un elemento DOM in modo sicuro con logging automatico
   * @param {string} id - ID dell'elemento
   * @param {boolean} logWarning - Se loggare warning se non trovato
   * @returns {HTMLElement|null}
   */
  getElement: (id, logWarning = true) => {
    const element = document.getElementById(id);
    if (!element && logWarning) {
      console.warn(`⚠️ Elemento DOM non trovato: ${id}`);
    }
    return element;
  },

  /**
   * Applica classi CSS in modo sicuro con verifica esistenza elemento
   * @param {string} id - ID dell'elemento
   * @param {string|string[]} classes - Classi da aggiungere
   */
  addClasses: (id, classes) => {
    const element = DOMHelpers.getElement(id, false);
    if (element) {
      const classList = Array.isArray(classes) ? classes : [classes];
      element.classList.add(...classList);
    }
  },

  /**
   * Gestisce la visibilità degli elementi con transizioni fluide
   * @param {string} id - ID dell'elemento
   * @param {boolean} visible - Stato di visibilità desiderato
   * @param {string} displayType - Tipo di display quando visibile
   */
  setVisibility: (id, visible, displayType = 'flex') => {
    const element = DOMHelpers.getElement(id, false);
    if (element) {
      element.style.display = visible ? displayType : 'none';
    }
  }
});

/**
 * Sistema di logging avanzato con controllo granulare per ambienti diversi.
 * La configurazione del logging è fondamentale per bilanciare le esigenze
 * di debugging in sviluppo con le performance in produzione.
 */
const Logger = Object.freeze({
  /**
   * Verifica se il logging è abilitato per l'ambiente corrente
   * @private
   */
  _isEnabled: () => {
    // In sviluppo il logging è sempre attivo per facilitare il debug
    if (ADMOB_CONFIG.showTestAds) return true;
    
    // In produzione rispetta la configurazione esplicita
    return ADMOB_CONFIG.production.enableLogging;
  },
  
  info: (message, data = null) => {
    if (Logger._isEnabled()) {
      console.log(`🎯 AdMob: ${message}`, data || '');
    }
  },
  
  success: (message, data = null) => {
    if (Logger._isEnabled()) {
      console.log(`✅ AdMob: ${message}`, data || '');
    }
  },
  
  warning: (message, data = null) => {
    if (Logger._isEnabled()) {
      console.warn(`⚠️ AdMob: ${message}`, data || '');
    }
  },
  
  error: (message, error = null) => {
    // Gli errori sono sempre loggati, anche in produzione, per debugging critici
    console.error(`❌ AdMob: ${message}`, error || '');
  }
});

/**
 * Detector per ambiente di esecuzione con caching intelligente.
 * Evita ripetute verifiche del tipo di ambiente migliorando le performance.
 */
const EnvironmentDetector = (() => {
  let detectionCache = null;
  
  return Object.freeze({
    /**
     * Rileva il tipo di ambiente con caching per performance ottimali
     * @returns {Object} Informazioni sull'ambiente rilevato
     */
    detect: () => {
      if (detectionCache) return detectionCache;
      
      const hasCapacitor = typeof window.Capacitor !== 'undefined';
      const hasAdMob = typeof window.AdMob !== 'undefined';
      
      detectionCache = Object.freeze({
        isCapacitor: hasCapacitor,
        isWeb: !hasCapacitor,
        hasAdMobPlugin: hasAdMob,
        canShowAds: hasCapacitor && hasAdMob
      });
      
      Logger.info(`Ambiente rilevato: ${hasCapacitor ? 'Capacitor' : 'Web Browser'}`);
      
      return detectionCache;
    },
    
    /**
     * Resetta la cache per forzare nuova detection (utile per testing)
     */
    resetCache: () => {
      detectionCache = null;
    }
  });
})();

// ========================================================================
// CORE INITIALIZATION SYSTEM
// ========================================================================

/**
 * Sistema di inizializzazione modulare con gestione degli errori robusta.
 * Implementa pattern fail-safe per garantire funzionamento anche in
 * condizioni di errore o ambienti non supportati.
 */
const InitializationSystem = Object.freeze({
  /**
   * Inizializzazione principale del modulo AdMob
   * @returns {Promise<boolean>} Success status dell'inizializzazione
   */
  initialize: async () => {
    if (AdMobState.get('isInitializing')) {
      Logger.warning('Inizializzazione già in corso, saltando...');
      return false;
    }

    AdMobState.update({ isInitializing: true });
    Logger.info('Avvio inizializzazione sistema AdMob...');

    try {
      const environment = EnvironmentDetector.detect();
      AdMobState.update({ isCapacitorApp: environment.isCapacitor });

      if (environment.isWeb) {
        return InitializationSystem._handleWebEnvironment();
      } else if (environment.canShowAds) {
        return await InitializationSystem._handleCapacitorEnvironment();
      } else {
        return InitializationSystem._handleUnsupportedEnvironment();
      }
    } catch (error) {
      Logger.error('Errore critico durante inizializzazione', error);
      return InitializationSystem._handleInitializationFailure();
    } finally {
      AdMobState.update({ isInitializing: false });
    }
  },

  /**
   * Gestione ambiente web con ottimizzazioni specifiche
   * @private
   */
  _handleWebEnvironment: () => {
    Logger.info('Configurazione per ambiente web browser');
    document.body.classList.add(ADMOB_CONFIG.selectors.webVersionClass);
    BannerManager.hideAll();
    return true;
  },

  /**
   * Gestione ambiente Capacitor con inizializzazione AdMob
   * @private
   */
  _handleCapacitorEnvironment: async () => {
    Logger.info('Configurazione per ambiente Capacitor mobile');
    
    try {
      await window.AdMob.initialize({
        testDeviceIds: ADMOB_CONFIG.testDevices,
        initializeForTesting: ADMOB_CONFIG.showTestAds
      });

      AdMobState.update({ isReady: true });
      Logger.success('AdMob inizializzato con successo');

      // Caricamento sequenziale dei banner per stabilità
      await BannerManager.loadAll();
      
      return true;
    } catch (error) {
      Logger.error('Errore inizializzazione AdMob Capacitor', error);
      return InitializationSystem._handleInitializationFailure();
    }
  },

  /**
   * Gestione ambiente non supportato con fallback graceful
   * @private
   */
  _handleUnsupportedEnvironment: () => {
    Logger.warning('Ambiente non supportato per AdMob - attivazione fallback');
    BannerManager.hideAll();
    return false;
  },

  /**
   * Gestione fallimento inizializzazione con recovery automatico
   * @private
   */
  _handleInitializationFailure: () => {
    Logger.warning('Attivazione modalità fallback per errore inizializzazione');
    BannerManager.hideAll();
    AdMobState.reset();
    return false;
  }
});

// ========================================================================
// BANNER MANAGEMENT SYSTEM
// ========================================================================

/**
 * Sistema di gestione banner avanzato con pattern retry e resilienza per
 * ambienti di produzione instabili. Include meccanismi automatici di recupero
 * da fallimenti temporanei e gestione ottimizzata delle risorse di rete.
 */
const BannerManager = Object.freeze({
  /**
   * Carica tutti i banner in sequenza con gestione errori per-banner
   * @returns {Promise<Object>} Risultati del caricamento
   */
  loadAll: async () => {
    if (!AdMobState.get('isReady')) {
      Logger.warning('AdMob non pronto per caricamento banner');
      return { top: false, bottom: false };
    }

    Logger.info('Avvio caricamento sequenziale banner...');

    const results = {
      top: await BannerManager._loadBannerWithRetry('top'),
      bottom: await BannerManager._loadBannerWithRetry('bottom')
    };

    AdMobState.update({ bannersLoaded: results });
    
    const successCount = Object.values(results).filter(Boolean).length;
    Logger.info(`Caricamento completato: ${successCount}/2 banner attivi`);

    return results;
  },

  /**
   * Carica un singolo banner con sistema di retry automatico per gestire
   * instabilità di rete e problemi temporanei dell'SDK AdMob.
   * @private
   * @param {string} position - Posizione del banner ('top' | 'bottom')
   * @returns {Promise<boolean>} Success status
   */
  _loadBannerWithRetry: async (position) => {
    const maxAttempts = ADMOB_CONFIG.production.retryAttempts;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const success = await BannerManager._loadBanner(position, attempt);
      
      if (success) {
        // Successo al primo tentativo o dopo retry
        if (attempt > 1) {
          Logger.success(`Banner ${position} caricato al tentativo ${attempt}/${maxAttempts}`);
        }
        return true;
      }
      
      // Fallimento - valuta se continuare i tentativi
      if (attempt < maxAttempts) {
        const backoffDelay = attempt * 1000; // Backoff esponenziale
        Logger.warning(`Tentativo ${attempt} fallito per banner ${position}, retry in ${backoffDelay}ms`);
        await BannerManager._delay(backoffDelay);
      } else {
        Logger.error(`Banner ${position} fallito dopo ${maxAttempts} tentativi`);
      }
    }
    
    return false;
  },

  /**
   * Carica un singolo banner - implementazione base
   * @private
   * @param {string} position - Posizione del banner
   * @param {number} attempt - Numero del tentativo corrente (per logging)
   * @returns {Promise<boolean>} Success status
   */
  _loadBanner: async (position, attempt = 1) => {
    const { bannerIds, showTestAds } = ADMOB_CONFIG;
    const elementId = ADMOB_CONFIG.selectors[`${position}Banner`];

    try {
      if (attempt === 1) {
        Logger.info(`Caricamento banner ${position}...`);
      }

      await window.AdMob.showBanner({
        adId: bannerIds[position],
        position,
        margin: 0,
        isTesting: showTestAds
      });

      // Aggiornamento stato visuale con classe loaded
      DOMHelpers.addClasses(elementId, 'loaded');
      
      if (attempt === 1) {
        Logger.success(`Banner ${position} caricato correttamente`);
      }
      
      return true;
    } catch (error) {
      Logger.error(`Errore caricamento banner ${position} (tentativo ${attempt})`, error);
      BannerManager._hideBanner(position);
      return false;
    }
  },

  /**
   * Utility per introdurre delay controllati nelle operazioni asincrone
   * @private
   * @param {number} ms - Millisecondi di attesa
   * @returns {Promise<void>}
   */
  _delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Nasconde tutti i banner con aggiornamento stato
   */
  hideAll: () => {
    Logger.info('Nascondimento di tutti i banner AdMob');
    BannerManager._hideBanner('top');
    BannerManager._hideBanner('bottom');
    AdMobState.update({ 
      bannersLoaded: { top: false, bottom: false }
    });
  },

  /**
   * Mostra tutti i banner con ricaricamento automatico
   */
  showAll: () => {
    if (!AdMobState.get('isCapacitorApp') || !AdMobState.get('isReady')) {
      Logger.warning('Impossibile mostrare banner: ambiente non supportato');
      return;
    }

    Logger.info('Attivazione di tutti i banner AdMob');
    
    const { selectors } = ADMOB_CONFIG;
    DOMHelpers.setVisibility(selectors.topBanner, true);
    DOMHelpers.setVisibility(selectors.bottomBanner, true);

    // Ricaricamento differito per stabilità
    setTimeout(() => {
      BannerManager.loadAll();
    }, ADMOB_CONFIG.delays.bannerReload);
  },

  /**
   * Nasconde un banner specifico
   * @private
   * @param {string} position - Posizione del banner
   */
  _hideBanner: (position) => {
    const elementId = ADMOB_CONFIG.selectors[`${position}Banner`];
    DOMHelpers.setVisibility(elementId, false);
  },

  /**
   * Nascondimento temporaneo per gestione ciclo di vita app
   */
  hideTemporarily: () => {
    if (!AdMobState.get('isCapacitorApp')) return;

    try {
      if (window.AdMob) {
        window.AdMob.hideBanner();
        Logger.info('Banner nascosti temporaneamente');
      }
    } catch (error) {
      Logger.warning('Errore nascondimento temporaneo banner', error);
    }
  }
});

// ========================================================================
// LIFECYCLE MANAGEMENT SYSTEM
// ========================================================================

/**
 * Sistema di gestione del ciclo di vita dell'applicazione con tecniche avanzate
 * di debouncing per eventi di sistema. Questo approccio risolve problematiche
 * specifiche degli ambienti mobili dove gli eventi possono essere generati
 * in modo inconsistente o duplicato.
 */
const LifecycleManager = Object.freeze({
  // Variabili private per gestione debounce
  _orientationTimeout: null,
  
  /**
   * Configura tutti i listener per gli eventi del ciclo di vita
   */
  setupEventListeners: () => {
    if (!AdMobState.get('isCapacitorApp')) {
      Logger.info('Gestione ciclo di vita non necessaria per ambiente web');
      return;
    }

    Logger.info('Configurazione listener ciclo di vita applicazione...');

    // Gestione pausa applicazione
    document.addEventListener('pause', LifecycleManager._handleAppPause);
    
    // Gestione ripresa applicazione  
    document.addEventListener('resume', LifecycleManager._handleAppResume);
    
    // Gestione cambio orientamento con debounce per stabilità
    window.addEventListener('orientationchange', LifecycleManager._handleOrientationChangeDebounced);

    Logger.success('Listener ciclo di vita configurati con debounce avanzato');
  },

  /**
   * Gestione pausa applicazione con ottimizzazioni performance
   * @private
   */
  _handleAppPause: () => {
    Logger.info('Applicazione in pausa - ottimizzazione banner');
    BannerManager.hideTemporarily();
  },

  /**
   * Gestione ripresa applicazione con ricaricamento intelligente
   * @private  
   */
  _handleAppResume: () => {
    Logger.info('Applicazione ripresa - riattivazione banner');
    setTimeout(() => {
      BannerManager.showAll();
    }, ADMOB_CONFIG.delays.reloadAfterResume);
  },

  /**
   * Gestione cambio orientamento con debounce per prevenire eventi multipli.
   * Il debounce è essenziale perché i dispositivi mobili spesso generano
   * più eventi orientationchange in rapida successione durante la rotazione.
   * Questo può causare chiamate multiple non necessarie all'API AdMob.
   * @private
   */
  _handleOrientationChangeDebounced: () => {
    // Cancella qualsiasi timeout precedente per implementare il debounce
    if (LifecycleManager._orientationTimeout) {
      clearTimeout(LifecycleManager._orientationTimeout);
    }
    
    // Imposta nuovo timeout con delay configurabile
    LifecycleManager._orientationTimeout = setTimeout(() => {
      LifecycleManager._handleOrientationChange();
      LifecycleManager._orientationTimeout = null; // Cleanup per memory management
    }, ADMOB_CONFIG.production.debounceDelay);
    
    Logger.info('Cambio orientamento rilevato - attesa stabilizzazione...');
  },

  /**
   * Implementazione effettiva della gestione cambio orientamento.
   * Separata dalla versione debounced per chiarezza architetturale.
   * @private
   */
  _handleOrientationChange: () => {
    if (!AdMobState.get('isReady')) return;

    Logger.info('Orientamento stabilizzato - adattamento banner');
    BannerManager.loadAll();
  }
});

// ========================================================================
// PUBLIC API - INTERFACCIA PUBBLICA
// ========================================================================

/**
 * Inizializzazione principale del modulo AdMob.
 * Mantiene compatibilità totale con versione precedente.
 * @returns {Promise<boolean>} Success status
 */
const initializeAdMob = () => InitializationSystem.initialize();

/**
 * Nasconde tutti i banner AdMob.
 * Interfaccia pubblica per controllo esterno.
 */
const hideAdMobBanners = () => BannerManager.hideAll();

/**
 * Mostra tutti i banner AdMob.
 * Interfaccia pubblica per controllo esterno.
 */
const showAdMobBanners = () => BannerManager.showAll();

/**
 * Sistema di debug avanzato per sviluppo e troubleshooting.
 * Fornisce informazioni complete sullo stato del modulo.
 */
const debugAdMob = () => {
  const state = AdMobState.get();
  const environment = EnvironmentDetector.detect();
  
  console.group('=== 🔍 DEBUG ADMOB AVANZATO ===');
  
  console.log('📊 Stato Modulo:', {
    isReady: state.isReady,
    isCapacitorApp: state.isCapacitorApp,
    isInitializing: state.isInitializing,
    bannersLoaded: state.bannersLoaded
  });
  
  console.log('🌍 Ambiente:', environment);
  console.log('⚙️ Configurazione:', ADMOB_CONFIG);
  
  // Verifica stato elementi DOM
  const { selectors } = ADMOB_CONFIG;
  const topElement = DOMHelpers.getElement(selectors.topBanner, false);
  const bottomElement = DOMHelpers.getElement(selectors.bottomBanner, false);
  
  console.log('🏗️ Elementi DOM:', {
    topBanner: {
      found: !!topElement,
      classes: topElement?.className || 'N/A',
      visible: topElement?.style.display !== 'none'
    },
    bottomBanner: {
      found: !!bottomElement,
      classes: bottomElement?.className || 'N/A', 
      visible: bottomElement?.style.display !== 'none'
    }
  });
  
  console.groupEnd();
};

// ========================================================================
// AUTO-INITIALIZATION & INTEGRATION
// ========================================================================

/**
 * Sistema di inizializzazione automatica con timing ottimizzato.
 * Garantisce che tutti i sistemi siano pronti prima dell'avvio.
 */
document.addEventListener('DOMContentLoaded', () => {
  Logger.info('DOM pronto - programmazione inizializzazione AdMob...');
  
  // Ritardo ottimizzato per garantire che Capacitor sia completamente caricato
  setTimeout(async () => {
    await InitializationSystem.initialize();
    LifecycleManager.setupEventListeners();
    Logger.success('Sistema AdMob completamente inizializzato e operativo');
  }, ADMOB_CONFIG.delays.initialization);
});

/**
 * Integrazione con sistema di debug globale dell'applicazione.
 * Estende le funzionalità di debug esistenti in modo non invasivo.
 */
(() => {
  // Verifica esistenza sistema debug globale senza forzarne la creazione
  if (typeof window.debugWS !== 'undefined') {
    window.debugWS.admob = Object.freeze({
      debug: debugAdMob,
      reload: () => BannerManager.loadAll(),
      hide: hideAdMobBanners,
      show: showAdMobBanners,
      state: () => AdMobState.get(),
      config: ADMOB_CONFIG,
      resetEnvironmentCache: () => EnvironmentDetector.resetCache()
    });
    
    Logger.info('Estensioni debug integrate nel sistema globale');
  }
})();

/**
 * ========================================================================
 * FINE MODULO ADMOB OTTIMIZZATO
 * ========================================================================
 * 
 * Questo modulo implementa pattern avanzati di JavaScript moderno mantenendo
 * compatibilità totale con la versione precedente. Le ottimizzazioni includono:
 * 
 * • Gestione dello stato immutabile per ridurre side effects
 * • Pattern modulari con responsabilità ben definite  
 * • Sistema di logging categorizzato per debug efficace
 * • Gestione errori robusta con fallback automatici
 * • Ottimizzazioni performance tramite caching intelligente
 * • Documentazione completa per manutenibilità a lungo termine
 * 
 * L'interfaccia pubblica rimane identica garantendo drop-in compatibility.
 * ========================================================================
 */