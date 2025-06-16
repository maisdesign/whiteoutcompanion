// Gestione fallback mappa
function handleMapLoad() {
  console.log('✅ Mappa caricata con successo');
}

function handleMapError() {
  console.log('⚠️ Errore caricamento mappa, usando fallback...');
  const mapElement = document.getElementById('map');
  
  // Crea un SVG fallback più semplice
  const fallbackSVG = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3c72;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a5298;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="50%" y="45%" font-family="Inter, Arial, sans-serif" font-size="24" fill="#fff" text-anchor="middle" dy=".3em">
        🗺️ Mappa del Gioco
      </text>
      <text x="50%" y="55%" font-family="Inter, Arial, sans-serif" font-size="14" fill="#ccc" text-anchor="middle" dy=".3em">
        Sostituire con la mappa vera (assets/map.png)
      </text>
    </svg>
  `;
  
  const blob = new Blob([fallbackSVG], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  mapElement.src = url;
  
  // Cleanup dell'URL dopo che l'immagine è caricata
  mapElement.onload = () => URL.revokeObjectURL(url);
}
