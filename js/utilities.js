// === STATO ===
    const alliances = [];
    let calibrationSettings = { offsetX: 0, offsetY: 0.7, scaleX: 1.0, scaleY: 1.0 };
    let calibrationUnlocked = false;
    let currentLanguage = 'it';

    // === FUNZIONI UTILITIES ===
    function getRandomColor() {
      const colors = ['#d7263d', '#0074d9', '#2ecc71', '#ff851b', '#7fdbff', '#b10dc9'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function showStatus(message, type = 'info') {
      const statusEl = document.getElementById('map-status');
      statusEl.textContent = message;
      statusEl.style.background = type === 'success' ? 'rgba(67, 233, 123, 0.2)' :
                                  type === 'error' ? 'rgba(220, 53, 69, 0.2)' :
                                  'rgba(79, 172, 254, 0.2)';
    }