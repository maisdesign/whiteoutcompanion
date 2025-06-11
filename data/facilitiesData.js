// ===== WHITEOUT SURVIVAL - COORDINATE FACILITY CORRETTE =====
// Basate sulla mappa ufficiale del gioco, disposizione a cerchi concentrici

const facilityData = [
  
  // ===== CENTRO - STRONGHOLD (Castello principale) =====
  { "Type": "Stronghold", "Level": "Lv.1", "x": 50, "y": 50 },
  
  // ===== ANELLO 1 - FORTRESS (Primo anello difensivo) =====
  { "Type": "Fortress", "Level": "Lv.1", "x": 45, "y": 45 },
  { "Type": "Fortress", "Level": "Lv.2", "x": 55, "y": 45 },
  { "Type": "Fortress", "Level": "Lv.3", "x": 55, "y": 55 },
  { "Type": "Fortress", "Level": "Lv.4", "x": 45, "y": 55 },
  
  // ===== ANELLO 2 - EXPEDITION & CORE FACILITIES =====
  { "Type": "Expedition", "Level": "Lv.3", "x": 42, "y": 42 },
  { "Type": "Expedition", "Level": "Lv.3", "x": 58, "y": 42 },
  { "Type": "Expedition", "Level": "Lv.3", "x": 58, "y": 58 },
  { "Type": "Expedition", "Level": "Lv.3", "x": 42, "y": 58 },
  
  // ===== ANELLO 3 - DEFENSE FACILITIES (Difese principali) =====
  { "Type": "Defense", "Level": "Lv.4", "x": 38, "y": 38 },
  { "Type": "Defense", "Level": "Lv.4", "x": 50, "y": 35 },
  { "Type": "Defense", "Level": "Lv.4", "x": 62, "y": 38 },
  { "Type": "Defense", "Level": "Lv.4", "x": 65, "y": 50 },
  { "Type": "Defense", "Level": "Lv.4", "x": 62, "y": 62 },
  { "Type": "Defense", "Level": "Lv.4", "x": 50, "y": 65 },
  { "Type": "Defense", "Level": "Lv.4", "x": 38, "y": 62 },
  { "Type": "Defense", "Level": "Lv.4", "x": 35, "y": 50 },
  
  // ===== ANELLO 4 - WEAPONS FACILITIES (Armamenti) =====
  { "Type": "Weapons", "Level": "Lv.4", "x": 35, "y": 35 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 50, "y": 30 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 65, "y": 35 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 70, "y": 50 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 65, "y": 65 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 50, "y": 70 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 35, "y": 65 },
  { "Type": "Weapons", "Level": "Lv.4", "x": 30, "y": 50 },
  
  // Weapons Lv.2 (anello intermedio)
  { "Type": "Weapons", "Level": "Lv.2", "x": 40, "y": 32 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 60, "y": 32 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 68, "y": 40 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 68, "y": 60 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 60, "y": 68 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 40, "y": 68 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 32, "y": 60 },
  { "Type": "Weapons", "Level": "Lv.2", "x": 32, "y": 40 },
  
  // ===== ANELLO 5 - TECH FACILITIES (Ricerca) =====
  { "Type": "Tech", "Level": "Lv.3", "x": 30, "y": 30 },
  { "Type": "Tech", "Level": "Lv.3", "x": 50, "y": 25 },
  { "Type": "Tech", "Level": "Lv.3", "x": 70, "y": 30 },
  { "Type": "Tech", "Level": "Lv.3", "x": 75, "y": 50 },
  { "Type": "Tech", "Level": "Lv.3", "x": 70, "y": 70 },
  { "Type": "Tech", "Level": "Lv.3", "x": 50, "y": 75 },
  { "Type": "Tech", "Level": "Lv.3", "x": 30, "y": 70 },
  { "Type": "Tech", "Level": "Lv.3", "x": 25, "y": 50 },
  
  // Tech Lv.1 (anello intermedio)
  { "Type": "Tech", "Level": "Lv.1", "x": 37, "y": 28 },
  { "Type": "Tech", "Level": "Lv.1", "x": 63, "y": 28 },
  { "Type": "Tech", "Level": "Lv.1", "x": 72, "y": 37 },
  { "Type": "Tech", "Level": "Lv.1", "x": 72, "y": 63 },
  { "Type": "Tech", "Level": "Lv.1", "x": 63, "y": 72 },
  { "Type": "Tech", "Level": "Lv.1", "x": 37, "y": 72 },
  { "Type": "Tech", "Level": "Lv.1", "x": 28, "y": 63 },
  { "Type": "Tech", "Level": "Lv.1", "x": 28, "y": 37 },
  
  // ===== ANELLO 6 - TRAINING FACILITIES (Addestramento) =====
  { "Type": "Training", "Level": "Lv.2", "x": 25, "y": 25 },
  { "Type": "Training", "Level": "Lv.2", "x": 45, "y": 20 },
  { "Type": "Training", "Level": "Lv.2", "x": 55, "y": 20 },
  { "Type": "Training", "Level": "Lv.2", "x": 75, "y": 25 },
  { "Type": "Training", "Level": "Lv.2", "x": 80, "y": 45 },
  { "Type": "Training", "Level": "Lv.2", "x": 80, "y": 55 },
  { "Type": "Training", "Level": "Lv.2", "x": 75, "y": 75 },
  { "Type": "Training", "Level": "Lv.2", "x": 55, "y": 80 },
  { "Type": "Training", "Level": "Lv.2", "x": 45, "y": 80 },
  { "Type": "Training", "Level": "Lv.2", "x": 25, "y": 75 },
  { "Type": "Training", "Level": "Lv.2", "x": 20, "y": 55 },
  { "Type": "Training", "Level": "Lv.2", "x": 20, "y": 45 },
  
  // ===== ANELLO 7 - DEFENSE FACILITIES Lv.2 =====
  { "Type": "Defense", "Level": "Lv.2", "x": 32, "y": 25 },
  { "Type": "Defense", "Level": "Lv.2", "x": 50, "y": 22 },
  { "Type": "Defense", "Level": "Lv.2", "x": 68, "y": 25 },
  { "Type": "Defense", "Level": "Lv.2", "x": 75, "y": 32 },
  { "Type": "Defense", "Level": "Lv.2", "x": 78, "y": 50 },
  { "Type": "Defense", "Level": "Lv.2", "x": 75, "y": 68 },
  { "Type": "Defense", "Level": "Lv.2", "x": 68, "y": 75 },
  { "Type": "Defense", "Level": "Lv.2", "x": 50, "y": 78 },
  { "Type": "Defense", "Level": "Lv.2", "x": 32, "y": 75 },
  { "Type": "Defense", "Level": "Lv.2", "x": 25, "y": 68 },
  { "Type": "Defense", "Level": "Lv.2", "x": 22, "y": 50 },
  { "Type": "Defense", "Level": "Lv.2", "x": 25, "y": 32 },
  
  // ===== ANELLO 8 - PRODUCTION FACILITIES =====
  { "Type": "Production", "Level": "Lv.1", "x": 20, "y": 20 },
  { "Type": "Production", "Level": "Lv.1", "x": 40, "y": 15 },
  { "Type": "Production", "Level": "Lv.1", "x": 60, "y": 15 },
  { "Type": "Production", "Level": "Lv.1", "x": 80, "y": 20 },
  { "Type": "Production", "Level": "Lv.1", "x": 85, "y": 40 },
  { "Type": "Production", "Level": "Lv.1", "x": 85, "y": 60 },
  { "Type": "Production", "Level": "Lv.1", "x": 80, "y": 80 },
  { "Type": "Production", "Level": "Lv.1", "x": 60, "y": 85 },
  { "Type": "Production", "Level": "Lv.1", "x": 40, "y": 85 },
  { "Type": "Production", "Level": "Lv.1", "x": 20, "y": 80 },
  { "Type": "Production", "Level": "Lv.1", "x": 15, "y": 60 },
  { "Type": "Production", "Level": "Lv.1", "x": 15, "y": 40 },
  
  // ===== ANELLO 9 - GATHERING FACILITIES =====
  { "Type": "Gathering", "Level": "Lv.1", "x": 27, "y": 18 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 50, "y": 12 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 73, "y": 18 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 82, "y": 27 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 88, "y": 50 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 82, "y": 73 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 73, "y": 82 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 50, "y": 88 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 27, "y": 82 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 18, "y": 73 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 12, "y": 50 },
  { "Type": "Gathering", "Level": "Lv.1", "x": 18, "y": 27 },
  
  // ===== ANELLO 10 - CONSTRUCTION FACILITIES (Anello esterno) =====
  { "Type": "Construction", "Level": "Lv.1", "x": 15, "y": 15 },
  { "Type": "Construction", "Level": "Lv.1", "x": 35, "y": 10 },
  { "Type": "Construction", "Level": "Lv.1", "x": 50, "y": 8 },
  { "Type": "Construction", "Level": "Lv.1", "x": 65, "y": 10 },
  { "Type": "Construction", "Level": "Lv.1", "x": 85, "y": 15 },
  { "Type": "Construction", "Level": "Lv.1", "x": 90, "y": 35 },
  { "Type": "Construction", "Level": "Lv.1", "x": 92, "y": 50 },
  { "Type": "Construction", "Level": "Lv.1", "x": 90, "y": 65 },
  { "Type": "Construction", "Level": "Lv.1", "x": 85, "y": 85 },
  { "Type": "Construction", "Level": "Lv.1", "x": 65, "y": 90 },
  { "Type": "Construction", "Level": "Lv.1", "x": 50, "y": 92 },
  { "Type": "Construction", "Level": "Lv.1", "x": 35, "y": 90 },
  { "Type": "Construction", "Level": "Lv.1", "x": 15, "y": 85 },
  { "Type": "Construction", "Level": "Lv.1", "x": 10, "y": 65 },
  { "Type": "Construction", "Level": "Lv.1", "x": 8, "y": 50 },
  { "Type": "Construction", "Level": "Lv.1", "x": 10, "y": 35 },
  
  // Construction Lv.3 (posizioni intermedie strategiche)
  { "Type": "Construction", "Level": "Lv.3", "x": 22, "y": 22 },
  { "Type": "Construction", "Level": "Lv.3", "x": 50, "y": 18 },
  { "Type": "Construction", "Level": "Lv.3", "x": 78, "y": 22 },
  { "Type": "Construction", "Level": "Lv.3", "x": 82, "y": 50 },
  { "Type": "Construction", "Level": "Lv.3", "x": 78, "y": 78 },
  { "Type": "Construction", "Level": "Lv.3", "x": 50, "y": 82 },
  { "Type": "Construction", "Level": "Lv.3", "x": 22, "y": 78 },
  { "Type": "Construction", "Level": "Lv.3", "x": 18, "y": 50 }
];

// Esporta per uso globale
if (typeof window !== 'undefined') {
  window.facilityData = facilityData;
}

// Supporto CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = facilityData;
}
