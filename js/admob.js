// === ADMOB INTEGRATION ===

// Configurazione AdMob
const ADMOB_CONFIG = {
  // Sostituisci con i tuoi ID AdMob reali
  bannerIds: {
    top: 'ca-app-pub-3940256099942544/6300978111', // Test ID - sostituire con ID reale
    bottom: 'ca-app-pub-3940256099942544/6300978111' // Test ID - sostituire con ID reale
  },
  testDevices: ['YOUR_DEVICE_ID'], // Aggiungi il tuo device ID per test
  showTestAds: true // Imposta a false per ads reali
};

// Stato AdMob
let adMobReady = false;
let isCapacitorApp = false;

// Inizializzazione AdMob
function initializeAdMob() {
  console.log('🎯 Inizializzazione AdMob...');
  
  // Verifica se siamo in un'app Capacitor
  if (typeof window.Capacitor !== 'undefined') {
    isCapacitorApp = true;
    initializeCapacitorAdMob();
  } else {
    // Versione web - nascondi i banner
    console.log('📱 Versione web rilevata - banner nascosti');
    document.body.classList.add('web-version');
    hideAdMobBanners();
  }
}

// Inizializzazione AdMob per Capacitor
async function initializeCapacitorAdMob() {
  try {
    console.log('📱 Inizializzazione AdMob per app mobile...');
    
    // Verifica se il plugin AdMob è disponibile
    if (typeof window.AdMob === 'undefined') {
      console.warn('⚠️ Plugin AdMob non trovato');
      hideAdMobBanners();
      return;
    }
    
    // Inizializza AdMob
    await window.AdMob.initialize({
      testDeviceIds: ADMOB_CONFIG.testDevices,
      initializeForTesting: ADMOB_CONFIG.showTestAds
    });
    
    adMobReady = true;
    console.log('✅ AdMob inizializzato con successo');
    
    // Carica i banner
    await loadTopBanner();
    await loadBottomBanner();
    
  } catch (error) {
    console.error('❌ Errore inizializzazione AdMob:', error);
    hideAdMobBanners();
  }
}

// Carica banner superiore
async function loadTopBanner() {
  if (!adMobReady) return;
  
  try {
    console.log('📊 Caricamento banner superiore...');
    
    await window.AdMob.showBanner({
      adId: ADMOB_CONFIG.bannerIds.top,
      position: 'top',
      margin: 0,
      isTesting: ADMOB_CONFIG.showTestAds
    });
    
    // Marca il banner come caricato
    const topBanner = document.getElementById('top-admob-banner');
    if (topBanner) {
      topBanner.classList.add('loaded');
    }
    
    console.log('✅ Banner superiore caricato');
    
  } catch (error) {
    console.error('❌ Errore caricamento banner superiore:', error);
    hideTopBanner();
  }
}

// Carica banner inferiore
async function loadBottomBanner() {
  if (!adMobReady) return;
  
  try {
    console.log('📊 Caricamento banner inferiore...');
    
    await window.AdMob.showBanner({
      adId: ADMOB_CONFIG.bannerIds.bottom,
      position: 'bottom',
      margin: 0,
      isTesting: ADMOB_CONFIG.showTestAds
    });
    
    // Marca il banner come caricato
    const bottomBanner = document.getElementById('bottom-admob-banner');
    if (bottomBanner) {
      bottomBanner.classList.add('loaded');
    }
    
    console.log('✅ Banner inferiore caricato');
    
  } catch (error) {
    console.error('❌ Errore caricamento banner inferiore:', error);
    hideBottomBanner();
  }
}

// Nascondi tutti i banner
function hideAdMobBanners() {
  hideTopBanner();
  hideBottomBanner();
}

// Nascondi banner superiore
function hideTopBanner() {
  const topBanner = document.getElementById('top-admob-banner');
  if (topBanner) {
    topBanner.style.display = 'none';
  }
}

// Nascondi banner inferiore
function hideBottomBanner() {
  const bottomBanner = document.getElementById('bottom-admob-banner');
  if (bottomBanner) {
    bottomBanner.style.display = 'none';
  }
}

// Mostra banner (per re-show dopo pause)
function showAdMobBanners() {
  if (!isCapacitorApp || !adMobReady) return;
  
  const topBanner = document.getElementById('top-admob-banner');
  const bottomBanner = document.getElementById('bottom-admob-banner');
  
  if (topBanner) topBanner.style.display = 'flex';
  if (bottomBanner) bottomBanner.style.display = 'flex';
  
  // Ricarica i banner
  setTimeout(() => {
    loadTopBanner();
    loadBottomBanner();
  }, 100);
}

// Nascondi banner temporaneamente (per pause/resume app)
function hideAdMobBannersTemporarily() {
  if (!isCapacitorApp) return;
  
  try {
    if (window.AdMob) {
      window.AdMob.hideBanner();
    }
  } catch (error) {
    console.warn('⚠️ Errore nascondendo banner:', error);
  }
}

// Event listeners per il ciclo di vita dell'app
function setupAdMobLifecycleEvents() {
  if (!isCapacitorApp) return;
  
  // App va in background
  document.addEventListener('pause', () => {
    console.log('📱 App in pausa - nascondo banner');
    hideAdMobBannersTemporarily();
  });
  
  // App torna in foreground
  document.addEventListener('resume', () => {
    console.log('📱 App ripresa - mostro banner');
    setTimeout(() => {
      showAdMobBanners();
    }, 1000);
  });
  
  // Gestione orientamento
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      if (adMobReady) {
        console.log('📱 Orientamento cambiato - ricarico banner');
        loadTopBanner();
        loadBottomBanner();
      }
    }, 500);
  });
}

// Funzione per debug AdMob
function debugAdMob() {
  console.log('=== DEBUG ADMOB ===');
  console.log('AdMob Ready:', adMobReady);
  console.log('Is Capacitor App:', isCapacitorApp);
  console.log('AdMob Plugin Available:', typeof window.AdMob !== 'undefined');
  console.log('Capacitor Available:', typeof window.Capacitor !== 'undefined');
  console.log('Config:', ADMOB_CONFIG);
  
  // Verifica stato banner
  const topBanner = document.getElementById('top-admob-banner');
  const bottomBanner = document.getElementById('bottom-admob-banner');
  
  console.log('Top Banner:', topBanner ? 'trovato' : 'non trovato');
  console.log('Bottom Banner:', bottomBanner ? 'trovato' : 'non trovato');
  
  if (topBanner) console.log('Top Banner Classes:', topBanner.className);
  if (bottomBanner) console.log('Bottom Banner Classes:', bottomBanner.className);
}

// Inizializzazione automatica quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM pronto - inizializzazione AdMob...');
  
  // Aspetta un po' per assicurarsi che Capacitor sia pronto
  setTimeout(() => {
    initializeAdMob();
    setupAdMobLifecycleEvents();
  }, 500);
});

// Aggiungi funzioni al debugger globale
if (typeof window.debugWS !== 'undefined') {
  window.debugWS.admob = {
    debug: debugAdMob,
    reload: () => {
      loadTopBanner();
      loadBottomBanner();
    },
    hide: hideAdMobBanners,
    show: showAdMobBanners,
    config: ADMOB_CONFIG
  };
}