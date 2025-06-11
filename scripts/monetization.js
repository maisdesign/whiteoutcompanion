// ===== MONETIZATION SYSTEM =====

class MonetizationManager {
  constructor() {
    this.isPremium = this.checkPremiumStatus();
    this.adBlockPositions = [
      'banner-top',
      'banner-bottom', 
      'interstitial',
      'rewarded'
    ];
    this.init();
  }

  init() {
    this.loadAdMob();
    this.setupDonationButton();
    this.showAdsIfNeeded();
    this.trackUsage();
  }

  // ===== GOOGLE ADMOB INTEGRATION =====
  async loadAdMob() {
    if (this.isPremium) return;
    
    try {
      // Initialize AdMob (Capacitor plugin)
      if (window.Capacitor) {
        const { AdMob } = await import('@capacitor-community/admob');
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: ['YOUR_TEST_DEVICE_ID'],
          initializeForTesting: true
        });
        this.adMob = AdMob;
      }
      
      // Web fallback with Google AdSense
      this.loadAdSense();
    } catch (error) {
      console.log('AdMob not available, using web ads');
      this.loadAdSense();
    }
  }

  loadAdSense() {
    if (this.isPremium) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    // Initialize AdSense
    (window.adsbygoogle = window.adsbygoogle || []).push({
      google_ad_client: "ca-pub-YOUR_PUBLISHER_ID",
      enable_page_level_ads: true
    });
  }

  // ===== BANNER ADS =====
  showBannerAd(position = 'banner-bottom') {
    if (this.isPremium) return;

    if (this.adMob) {
      this.showMobileBanner(position);
    } else {
      this.showWebBanner(position);
    }
  }

  async showMobileBanner(position) {
    try {
      await this.adMob.showBanner({
        adId: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_BANNER_AD_UNIT_ID',
        adSize: 'ADAPTIVE_BANNER',
        position: position === 'banner-top' ? 'TOP_CENTER' : 'BOTTOM_CENTER',
        margin: 0,
        isTesting: true // Remove in production
      });
    } catch (error) {
      console.error('Banner ad failed:', error);
    }
  }

  showWebBanner(position) {
    const adContainer = document.getElementById(position);
    if (!adContainer) return;

    adContainer.innerHTML = `
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
           data-ad-slot="YOUR_BANNER_SLOT_ID"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    `;
    
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  // ===== INTERSTITIAL ADS =====
  async showInterstitialAd() {
    if (this.isPremium) return;
    
    if (this.adMob) {
      try {
        await this.adMob.prepareInterstitial({
          adId: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_INTERSTITIAL_AD_UNIT_ID',
          isTesting: true
        });
        
        await this.adMob.showInterstitial();
      } catch (error) {
        console.error('Interstitial ad failed:', error);
      }
    }
  }

  // ===== REWARDED ADS =====
  async showRewardedAd(onReward) {
    if (this.isPremium) {
      onReward?.();
      return;
    }

    if (this.adMob) {
      try {
        await this.adMob.prepareRewardVideoAd({
          adId: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_REWARDED_AD_UNIT_ID',
          isTesting: true
        });
        
        const result = await this.adMob.showRewardVideoAd();
        if (result.rewarded) {
          onReward?.();
        }
      } catch (error) {
        console.error('Rewarded ad failed:', error);
        onReward?.(); // Give reward anyway as fallback
      }
    } else {
      // Web fallback - simulate reward
      if (confirm('Watch an ad to unlock this feature?')) {
        onReward?.();
      }
    }
  }

  // ===== DONATION/PREMIUM SYSTEM =====
  setupDonationButton() {
    const donationButton = document.createElement('button');
    donationButton.className = 'btn-primary donation-btn';
    donationButton.innerHTML = this.isPremium ? 
      '⭐ Premium Active' : 
      '❤️ Remove Ads - $2.99';
    
    donationButton.onclick = () => this.handlePurchase();
    
    // Add to UI
    const controlsDiv = document.getElementById('controls');
    if (controlsDiv) {
      controlsDiv.appendChild(donationButton);
    }
  }

  async handlePurchase() {
    if (this.isPremium) return;

    try {
      // For mobile apps with Capacitor
      if (window.Capacitor) {
        await this.handleMobilePurchase();
      } else {
        // Web donation via PayPal/Stripe
        await this.handleWebDonation();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      this.showToast('Purchase failed. Please try again.', 'error');
    }
  }

  async handleMobilePurchase() {
    const { CapacitorPurchases } = await import('@revenuecat/purchases-capacitor');
    
    try {
      await CapacitorPurchases.configure({
        apiKey: 'YOUR_REVENUECAT_API_KEY'
      });
      
      const offerings = await CapacitorPurchases.getOfferings();
      const premium = offerings.current?.availablePackages?.find(
        pkg => pkg.identifier === 'remove_ads'
      );
      
      if (premium) {
        const result = await CapacitorPurchases.purchasePackage({
          aPackage: premium
        });
        
        if (result.purchaserInfo.entitlements.active['premium']?.isActive) {
          this.setPremiumStatus(true);
          this.hideAllAds();
          this.showToast('Premium activated! Ads removed.', 'success');
        }
      }
    } catch (error) {
      if (!error.userCancelled) {
        throw error;
      }
    }
  }

  async handleWebDonation() {
    // PayPal integration
    const paypalScript = document.createElement('script');
    paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
    document.head.appendChild(paypalScript);
    
    paypalScript.onload = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '2.99',
                currency_code: 'USD'
              },
              description: 'Whiteout Companion - Remove Ads'
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            this.setPremiumStatus(true);
            this.hideAllAds();
            this.showToast(`Thank you ${details.payer.name.given_name}! Ads removed.`, 'success');
          });
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          this.showToast('Payment failed. Please try again.', 'error');
        }
      }).render('#paypal-button-container');
    };
  }

  // ===== PREMIUM STATUS MANAGEMENT =====
  checkPremiumStatus() {
    return localStorage.getItem('whiteout-premium') === 'true';
  }

  setPremiumStatus(isPremium) {
    this.isPremium = isPremium;
    localStorage.setItem('whiteout-premium', isPremium.toString());
    
    if (isPremium) {
      localStorage.setItem('whiteout-premium-date', new Date().toISOString());
    }
  }

  hideAllAds() {
    // Remove all ad containers
    document.querySelectorAll('.ad-container, .adsbygoogle').forEach(ad => {
      ad.style.display = 'none';
    });
    
    // Hide mobile banners
    if (this.adMob) {
      this.adMob.hideBanner();
    }
  }

  // ===== USAGE TRACKING =====
  trackUsage() {
    const usage = JSON.parse(localStorage.getItem('whiteout-usage') || '{}');
    const today = new Date().toDateString();
    
    usage[today] = (usage[today] || 0) + 1;
    usage.totalSessions = (usage.totalSessions || 0) + 1;
    
    localStorage.setItem('whiteout-usage', JSON.stringify(usage));
    
    // Show interstitial after every 5 sessions for free users
    if (!this.isPremium && usage.totalSessions % 5 === 0) {
      setTimeout(() => this.showInterstitialAd(), 2000);
    }
  }

  // ===== PREMIUM FEATURES =====
  unlockPremiumFeature(featureName, fallbackAction) {
    if (this.isPremium) {
      return true;
    }
    
    // Offer rewarded ad or purchase
    const modal = this.createPremiumModal(featureName, fallbackAction);
    document.body.appendChild(modal);
    return false;
  }

  createPremiumModal(featureName, fallbackAction) {
    const modal = document.createElement('div');
    modal.className = 'premium-modal';
    modal.innerHTML = `
      <div class="modal-content glass-card">
        <h3>⭐ Premium Feature</h3>
        <p>${featureName} is a premium feature.</p>
        <div class="modal-actions">
          <button class="btn-primary" onclick="monetization.handlePurchase()">
            Upgrade to Premium - $2.99
          </button>
          <button class="btn-secondary" onclick="monetization.showRewardedAd(() => { ${fallbackAction}; this.parentElement.parentElement.parentElement.remove(); })">
            Watch Ad to Unlock Once
          </button>
          <button class="btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    return modal;
  }

  // ===== UTILITY METHODS =====
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }
}

// Initialize monetization system
const monetization = new MonetizationManager();

// Export for global access
window.monetization = monetization;

// ===== USAGE EXAMPLES =====

// Show banner ad when app loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    monetization.showBannerAd('banner-bottom');
  }, 1000);
});

// Premium feature gates
function exportAdvancedAnalytics() {
  if (monetization.unlockPremiumFeature('Advanced Analytics Export', 'exportBasicAnalytics()')) {
    // Premium analytics code
    console.log('Exporting advanced analytics...');
  }
}

function unlimitedAlliances() {
  if (alliances.length >= 10 && !monetization.isPremium) {
    monetization.unlockPremiumFeature('Unlimited Alliances', 'alert("Free version limited to 10 alliances")');
    return false;
  }
  return true;
}