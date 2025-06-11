// ===== PWA SERVICE WORKER REGISTRATION =====

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  async init() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        this.setupUpdateNotification();
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Setup PWA install prompt
    this.setupInstallPrompt();
    
    // Check if already installed
    this.checkInstallStatus();
    
    // Setup offline indicator
    this.setupOfflineIndicator();
  }

  setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e;
      // Show install button
      this.showInstallButton();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.isInstalled = true;
      this.hideInstallButton();
      this.showToast('App installed successfully! 🎉', 'success');
    });
  }

  showInstallButton() {
    // Create install button if it doesn't exist
    let installBtn = document.getElementById('install-btn');
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'install-btn';
      installBtn.className = 'btn-secondary';
      installBtn.innerHTML = '📱 Install App';
      installBtn.onclick = () => this.installApp();
      
      // Add to controls
      const controls = document.getElementById('controls');
      if (controls) {
        controls.appendChild(installBtn);
      }
    }
    installBtn.style.display = 'block';
  }

  hideInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    // Show the prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    this.deferredPrompt = null;
  }

  checkInstallStatus() {
    // Check if running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      this.isInstalled = true;
      this.hideInstallButton();
      
      // Add installed class for styling
      document.body.classList.add('pwa-installed');
    }
  }

  setupUpdateNotification() {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // New service worker has taken control
      this.showUpdateNotification();
    });

    // Listen for updates
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            this.showUpdateAvailable();
          }
        });
      });
    });
  }

  showUpdateAvailable() {
    const updateToast = document.createElement('div');
    updateToast.className = 'toast info';
    updateToast.innerHTML = `
      <div>
        <strong>Update Available!</strong>
        <p>A new version is ready.</p>
        <button onclick="pwaManager.applyUpdate()" class="btn-primary" style="margin-top: 8px; width: auto; padding: 6px 12px;">
          Update Now
        </button>
      </div>
    `;
    
    this.showToast(updateToast, 'manual'); // Don't auto-remove
  }

  async applyUpdate() {
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }

  showUpdateNotification() {
    this.showToast('App updated successfully! 🔄', 'success');
  }

  setupOfflineIndicator() {
    const showOffline = () => {
      this.showToast('You are offline. Some features may be limited. 📱', 'warning', 5000);
    };

    const showOnline = () => {
      this.showToast('Back online! All features restored. 🌐', 'success');
    };

    window.addEventListener('online', showOnline);
    window.addEventListener('offline', showOffline);

    // Check initial status
    if (!navigator.onLine) {
      setTimeout(showOffline, 1000);
    }
  }

  // Utility method for showing toasts
  showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
    
    const toast = typeof message === 'string' ? this.createToastElement(message, type) : message;
    toastContainer.appendChild(toast);

    // Auto-remove unless specified otherwise
    if (duration !== 'manual') {
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = 'slideInRight 0.3s ease reverse';
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
    }
  }

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    return toast;
  }

  // Background sync for offline data
  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await registration.sync.register('background-sync');
        console.log('Background sync registered');
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  // Push notifications setup
  async setupPushNotifications() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('Push notifications not supported');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Push notifications enabled');
      // Setup push subscription here if needed
    }
  }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Make it globally accessible
window.pwaManager = pwaManager;

// ===== ENHANCED LOADING EXPERIENCE =====

class LoadingManager {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.appContainer = document.getElementById('app-container');
    this.loadingSteps = [
      'Loading interface...',
      'Initializing components...',
      'Loading translations...',
      'Setting up features...',
      'Almost ready...'
    ];
    this.currentStep = 0;
    this.init();
  }

  init() {
    this.showLoadingSteps();
    this.preloadCriticalResources();
  }

  showLoadingSteps() {
    const loadingText = this.loadingScreen.querySelector('p');
    if (!loadingText) return;

    const interval = setInterval(() => {
      if (this.currentStep < this.loadingSteps.length) {
        loadingText.textContent = this.loadingSteps[this.currentStep];
        this.currentStep++;
      } else {
        clearInterval(interval);
        this.hideLoadingScreen();
      }
    }, 600);
  }

  async preloadCriticalResources() {
    // Preload critical images
    const criticalImages = [
      'assets/map.png',
      'assets/icons/icon-192x192.png'
    ];

    const imagePromises = criticalImages.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Don't fail if image doesn't load
        img.src = src;
      });
    });

    await Promise.all(imagePromises);
  }

  hideLoadingScreen() {
    if (this.loadingScreen && this.appContainer) {
      this.loadingScreen.style.opacity = '0';
      this.appContainer.style.opacity = '1';
      
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
        // Trigger app initialization
        if (typeof window.initializeApp === 'function') {
          window.initializeApp();
        }
      }, 500);
    }
  }
}

// Initialize Loading Manager
const loadingManager = new LoadingManager();

// ===== PERFORMANCE MONITORING =====

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.trackUserInteractions();
    this.monitorMemoryUsage();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        this.metrics.pageLoad = {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          totalTime: perfData.loadEventEnd - perfData.fetchStart
        };
        
        console.log('Page Load Metrics:', this.metrics.pageLoad);
      }, 100);
    });
  }

  trackUserInteractions() {
    let interactionCount = 0;
    
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, () => {
        interactionCount++;
        this.metrics.interactions = interactionCount;
      }, { passive: true });
    });
  }

  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        };
      }, 30000); // Check every 30 seconds
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize Performance Monitor
const performanceMonitor = new PerformanceMonitor();

// ===== APP INITIALIZATION =====

window.initializeApp = function() {
  // Initialize tooltips
  initializeTooltips();
  
  // Setup FAB menu
  setupFABMenu();
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Initialize touch gestures for mobile
  setupTouchGestures();
  
  // Setup theme toggle
  setupThemeToggle();
  
  console.log('App initialized successfully');
};

function initializeTooltips() {
  // Add tooltips to interactive elements
  const elementsWithTooltips = document.querySelectorAll('[title]');
  elementsWithTooltips.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(event) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = event.target.title;
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  
  document.body.appendChild(tooltip);
  
  // Position tooltip
  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
  
  // Show tooltip
  setTimeout(() => tooltip.style.opacity = '1', 10);
  
  // Store reference for cleanup
  event.target._tooltip = tooltip;
}

function hideTooltip(event) {
  const tooltip = event.target._tooltip;
  if (tooltip) {
    tooltip.style.opacity = '0';
    setTimeout(() => tooltip.remove(), 200);
    delete event.target._tooltip;
  }
}

function setupFABMenu() {
  const fab = document.getElementById('fab');
  if (!fab) return;
  
  let isMenuOpen = false;
  const menuItems = [
    { icon: '📊', action: 'exportCSV', label: 'Export CSV' },
    { icon: '🖼️', action: 'exportPNG', label: 'Export PNG' },
    { icon: '🎨', action: 'toggleTheme', label: 'Toggle Theme' },
    { icon: '⚙️', action: 'showSettings', label: 'Settings' }
  ];
  
  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMenuOpen) {
      closeFABMenu();
    } else {
      openFABMenu();
    }
  });
  
  function openFABMenu() {
    isMenuOpen = true;
    fab.style.transform = 'rotate(45deg)';
    
    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('button');
      menuItem.className = 'fab-menu-item';
      menuItem.innerHTML = item.icon;
      menuItem.title = item.label;
      menuItem.style.cssText = `
        position: absolute;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        bottom: ${80 + (index * 60)}px;
        right: 4px;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
        z-index: 999;
      `;
      
      menuItem.addEventListener('click', () => {
        executeAction(item.action);
        closeFABMenu();
      });
      
      document.body.appendChild(menuItem);
      
      // Animate in
      setTimeout(() => {
        menuItem.style.opacity = '1';
        menuItem.style.transform = 'scale(1)';
      }, index * 50);
    });
  }
  
  function closeFABMenu() {
    isMenuOpen = false;
    fab.style.transform = 'rotate(0deg)';
    
    document.querySelectorAll('.fab-menu-item').forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0)';
        setTimeout(() => item.remove(), 200);
      }, index * 30);
    });
  }
  
  function executeAction(action) {
    switch (action) {
      case 'exportCSV':
        if (typeof exportCSV === 'function') exportCSV();
        break;
      case 'exportPNG':
        if (typeof exportPNG === 'function') exportPNG();
        break;
      case 'toggleTheme':
        toggleTheme();
        break;
      case 'showSettings':
        showSettingsModal();
        break;
    }
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', () => {
    if (isMenuOpen) closeFABMenu();
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+E: Export CSV
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      if (typeof exportCSV === 'function') exportCSV();
    }
    
    // Ctrl+S: Save (trigger localStorage save)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage();
        pwaManager.showToast('Data saved! 💾', 'success');
      }
    }
    
    // Ctrl+I: Import
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      const importInput = document.getElementById('import-file');
      if (importInput) importInput.click();
    }
    
    // F: Focus search/filter
    if (e.key === 'f' && !e.ctrlKey && !e.altKey) {
      const activeElement = document.activeElement;
      if (activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const allianceInput = document.getElementById('alliance-name');
        if (allianceInput) allianceInput.focus();
      }
    }
  });
}

function setupTouchGestures() {
  if (!('ontouchstart' in window)) return;
  
  let startX, startY, startTime;
  
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Swipe detection
      if (Math.abs(deltaX) > 100 && Math.abs(deltaY) < 50 && deltaTime < 300) {
        if (deltaX > 0) {
          // Swipe right - could open sidebar on mobile
          console.log('Swipe right detected');
        } else {
          // Swipe left - could close sidebar on mobile
          console.log('Swipe left detected');
        }
      }
    }
  }, { passive: true });
}

function setupThemeToggle() {
  // Theme toggle functionality
  window.toggleTheme = function() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('whiteout-theme', 'light');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('whiteout-theme', 'dark');
    }
    
    pwaManager.showToast(`Switched to ${isDark ? 'light' : 'dark'} theme 🎨`, 'info');
  };
  
  // Load saved theme
  const savedTheme = localStorage.getItem('whiteout-theme');
  if (savedTheme) {
    document.body.className = savedTheme + '-theme';
  }
}

function showSettingsModal() {
  // Create settings modal
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
  `;
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content glass-card';
  modalContent.style.cssText = `
    max-width: 500px;
    width: 90%;
    padding: 24px;
    max-height: 80vh;
    overflow-y: auto;
  `;
  
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 20px;">⚙️ Settings</h3>
    
    <div style="margin-bottom: 20px;">
      <h4>Theme</h4>
      <button onclick="toggleTheme()" class="btn-secondary">Toggle Theme</button>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>Performance</h4>
      <p>Memory Usage: ${performanceMonitor.getMetrics().memory ? 
        performanceMonitor.getMetrics().memory.used + ' MB' : 'N/A'}</p>
      <p>Interactions: ${performanceMonitor.getMetrics().interactions || 0}</p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4>Data</h4>
      <button onclick="clearAllData()" class="btn-secondary" style="background: #dc3545;">
        Clear All Data
      </button>
    </div>
    
    <div style="text-align: right;">
      <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn-primary">
        Close
      </button>
    </div>
  `;
  
  window.clearAllData = function() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      location.reload();
    }
  };
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}