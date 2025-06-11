// ===== WHITEOUT SURVIVAL FACILITY DATA - COORDINATE CORRETTE =====

const facilityData = [
  // ===== CONSTRUCTION FACILITIES =====
  // Anello esterno
  { "Type": "Construction", "Level": "Lv.1", "x": 50, "y": 10 },
  { "Type": "Construction", "Level": "Lv.1", "x": 75, "y": 25 },
  { "Type": "Construction", "Level": "Lv.1", "x": 90, "y": 50 },
  { "Type": "Construction", "Level": "Lv.1", "x": 75, "y": 75 },
  { "Type": "Construction", "Level": "Lv.1", "x": 50, "y": 90 },
  { "Type": "Construction", "Level": "Lv.1", "x": 25, "y": 75 },
  { "Type": "Construction", "Level": "Lv.1", "x": 10, "y": 50 },
  { "Type": "Construction", "Level": "Lv.1", "x": 25, "y": 25 },
  
  // Anello intermedio
  { "Type": "Construction", "Level": "Lv.3", "x": 35, "y": 35 },
  { "Type": "Construction", "Level": "Lv.3", "x": 65, "y": 35 },
  { "Type": "Construction", "Level": "Lv.3", "x": 65, "y": 65 },
  { "Type": "Construction", "Level": "Lv.3", "x": 35, "y": 65 },

  // ===== PRODUCTION FACILITIES =====
  { "Type": "Production", "Level": "Lv.1", "x": 45, "y": 15 },
  { "Type": "Production", "Level": "Lv.1", "x": 70, "y": 30 },
  { "Type": "Production", "Level": "Lv.1", "x": 85, "y": 45 },
  { "Type": "Production", "Level": "Lv.1", "x": 85, "y": 55 },
  { "Type": "Production", "Level": "Lv.1", "x": 70, "y": 70 },
  { "Type": "Production", "Level": "Lv.1", "x": 55, "y": 85 },
  { "Type": "Production", "Level": "Lv.1", "x": 30, "y": 70 },
  { "Type": "Production", "Level": "Lv.1", "x": 15, "y": 45 },

  // ===== DEFENSE FACILITIES =====
  { "Type": "Defense", "Level": "Lv.2", "x": 42, "y": 25 },
  { "Type": "Defense", "Level": "Lv.2", "x": 58, "y": 25 },
  { "Type": "Defense", "Level": "Lv.2", "x": 75, "y": 42 },
  { "Type": "Defense", "Level": "Lv.2", "x": 75, "y": 58 },
  { "Type": "Defense", "Level": "Lv.2", "x": 58, "y": 75 },
  { "Type": "Defense", "Level": "Lv.2", "x": 42, "y": 75 },
  { "Type": "Defense", "Level": "Lv.2", "x": 25, "y": 58 },
  { "Type": "Defense", "Level": "Lv.2", "x": 25, "y": 42 },

  // Defense Lv.4 (più vicino al centro)
  { "Type": "Defense", "Level": "Lv.4", "x": 40, "y": 40 },
  { "Type": "Defense", "Level": "Lv.4", "x": 60, "y": 40 },
  { "Type": "Defense", "Level": "Lv.4", "x": 60, "y": 60 },
  { "Type": "Defense", "Level": "Lv.4", "x": 40, "y": 60 },

  // ===== GATHERING FACILITIES =====
  { "Type": "Gathering", "Level": "Lv.1", "x": 55, "y": 15 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 80, "y": 35 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 85, "y": 65 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 65, "y": 85 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 35, "y": 85 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 15, "y": 65 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 15, "y": 35 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 35, "y": 15 },

  // ===== TECH FACILITIES =====
  { "Type": "Tech", "Level": "Lv.1", "x": 50, "y": 20 },
  { "Type": "Tech", "Level": "Lv.1", "x": 65, "y": 30 },
  { "Type": "Tech", "Level": "Lv.1", "x": 80, "y": 50 },
  { "Type": "Tech", "Level": "Lv.1", "x": 65, "y": 70 },
  { "Type": "Tech", "Level": "Lv.1", "x": 50, "y": 80 },
  { "Type": "Tech", "Level": "Lv.1", "x": 35, "y": 70 },
  { "Type": "Tech", "Level": "Lv.1", "x": 20, "y": 50 },
  { "Type": "Tech", "Level": "Lv.1", "x": 35, "y": 30 },

  // Tech Lv.3 (posizioni strategiche)
  { "Type": "Tech", "Level": "Lv.3", "x": 50, "y": 30 },
  { "Type": "Tech", "Level": "Lv.3", "x": 70, "y": 50 },
  { "Type": "Tech", "Level": "Lv.3", "x": 50, "y": 70 },
  { "Type": "Tech", "Level": "Lv.3", "x": 30, "y": 50 },

  // ===== WEAPONS FACILITIES =====
  { "Type": "Weapons", "Level": "Lv.2", "x": 38, "y": 20 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 62, "y": 20 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 80, "y": 38 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 80, "y": 62 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 62, "y": 80 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 38, "y": 80 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 20, "y": 62 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 20, "y": 38 },

  // Weapons Lv.4 (elite positions)
  { "Type": "Weapons", "Level": "Lv.4", "x": 45, "y": 35 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 55, "y": 35 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 65, "y": 45 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 65, "y": 55 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 55, "y": 65 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 45, "y": 65 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 35, "y": 55 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 35, "y": 45 },

  // ===== TRAINING FACILITIES =====
  { "Type": "Training", "Level": "Lv.2", "x": 30, "y": 35 },
  { "Type": "Training", "Level": "Lv.2", "x": 40, "y": 30 },
  { "Type": "Training", "Level": "Lv.2", "x": 60, "y": 30 },
  { "Type": "Training", "Level": "Lv.2", "x": 70, "y": 35 },
  { "Type": "Training", "Level": "Lv.2", "x": 70, "y": 65 },
  { "Type": "Training", "Level": "Lv.2", "x": 60, "y": 70 },
  { "Type": "Training", "Level": "Lv.2", "x": 40, "y": 70 },
  { "Type": "Training", "Level": "Lv.2", "x": 30, "y": 65 },

  // ===== EXPEDITION FACILITIES =====
  { "Type": "Expedition", "Level": "Lv.3", "x": 45, "y": 45 },
  { "Type": "Expedition", "Level": "Lv.3", "x": 55, "y": 45 },
  { "Type": "Expedition", "Level": "Lv.3", "x": 55, "y": 55 },
  { "Type": "Expedition", "Level": "Lv.3", "x": 45, "y": 55 },

  // ===== STRONGHOLD (Centro comando) =====
  { "Type": "Stronghold", "Level": "Lv.1", "x": 48, "y": 48 },
  { "Type": "Stronghold", "Level": "Lv.2", "x": 52, "y": 48 },
  { "Type": "Stronghold", "Level": "Lv.3", "x": 52, "y": 52 },
  { "Type": "Stronghold", "Level": "Lv.4", "x": 48, "y": 52 },

  // ===== FORTRESS (Anelli concentrici dal centro) =====
  // Anello 1 (più interno)
  { "Type": "Fortress", "Level": "Lv.1", "x": 47, "y": 44 },
  { "Type": "Fortress", "Level": "Lv.2", "x": 53, "y": 44 },
  { "Type": "Fortress", "Level": "Lv.3", "x": 56, "y": 50 },
  { "Type": "Fortress", "Level": "Lv.4", "x": 53, "y": 56 },
  { "Type": "Fortress", "Level": "Lv.5", "x": 47, "y": 56 },
  { "Type": "Fortress", "Level": "Lv.6", "x": 44, "y": 50 },

  // Anello 2 (intermedio)
  { "Type": "Fortress", "Level": "Lv.7", "x": 44, "y": 41 },
  { "Type": "Fortress", "Level": "Lv.8", "x": 50, "y": 38 },
  { "Type": "Fortress", "Level": "Lv.9", "x": 56, "y": 41 },
  { "Type": "Fortress", "Level": "Lv.10", "x": 59, "y": 50 },
  { "Type": "Fortress", "Level": "Lv.11", "x": 56, "y": 59 },
  { "Type": "Fortress", "Level": "Lv.12", "x": 50, "y": 62 },
  { "Type": "Fortress", "Level": "Lv.13", "x": 44, "y": 59 },
  { "Type": "Fortress", "Level": "Lv.14", "x": 41, "y": 50 }
];

// Esporta i dati per uso globale
if (typeof window !== 'undefined') {
  window.facilityData = facilityData;
}

// Supporto per Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = facilityData;
}
