/**
 * ============================================================================
 * WHITEOUT SURVIVAL COMPANION - DATA MODULE
 * ============================================================================
 * 
 * Questo modulo contiene i dati statici per le facility e i buff del gioco
 * Whiteout Survival. I dati sono organizzati per garantire compatibilità
 * completa con tutti i moduli esistenti dell'applicazione.
 * 
 * Struttura dei dati:
 * - facilityData: Array di oggetti che definiscono le facility del gioco
 * - buffValues: Oggetto che mappa i valori dei bonus per tipo e livello
 * 
 * ATTENZIONE: L'ordine degli elementi in facilityData deve essere preservato
 * poiché potrebbe essere significativo per l'applicazione.
 */

// ============================================================================
// DATI DELLE FACILITY
// ============================================================================

/**
 * Array contenente tutte le facility disponibili nel gioco
 * 
 * Struttura di ogni oggetto:
 * - Type: Tipo di facility (Castle, Construction, Production, etc.)
 * - Level: Livello della facility (Lv.1, Lv.2, etc.)
 * - x, y: Coordinate percentuali per il posizionamento sulla mappa (0-100)
 * - ingameCoords: Coordinate del gioco nel formato "X:nnn Y:nnn"
 * 
 * @type {Array<Object>}
 * @readonly
 */
const facilityData = [
    // CASTLE - Struttura principale
    { 
        "Type": "Castle", 
        "Level": "Lv.1", 
        "x": 50.06, 
        "y": 48.79, 
        "ingameCoords": "X:597 Y:597" 
    },

    // CONSTRUCTION - Strutture di base (Lv.1)
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 50.19, 
        "y": 12.48, 
        "ingameCoords": "X:168 Y:168" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 66.19, 
        "y": 70.48, 
        "ingameCoords": "X:537 Y:138" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 87.19, 
        "y": 49.32, 
        "ingameCoords": "X:1068 X:138" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 29.31, 
        "y": 65.37, 
        "ingameCoords": "X:138 Y:666" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 14.19, 
        "y": 50.73, 
        "ingameCoords": "X:138 Y:1038" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 34.06, 
        "y": 28.52, 
        "ingameCoords": "X:666 Y:1068" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 70.19, 
        "y": 32.57, 
        "ingameCoords": "X:1068 Y:567" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.1", 
        "x": 50.19, 
        "y": 86.35, 
        "ingameCoords": "X:138 Y:138" 
    },

    // CONSTRUCTION - Strutture avanzate (Lv.3)
    { 
        "Type": "Construction", 
        "Level": "Lv.3", 
        "x": 56.44, 
        "y": 65.19, 
        "ingameCoords": "X:486 Y:327" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.3", 
        "x": 46.31, 
        "y": 32.57, 
        "ingameCoords": "X:768 Y:867" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.3", 
        "x": 62.19, 
        "y": 40.33, 
        "ingameCoords": "X:867 Y:567" 
    },
    { 
        "Type": "Construction", 
        "Level": "Lv.3", 
        "x": 36.81, 
        "y": 57.96, 
        "ingameCoords": "X:327 Y:666" 
    },

    // PRODUCTION - Strutture di produzione (Lv.1)
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 83.31, 
        "y": 45.45, 
        "ingameCoords": "X:1068 Y:237" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 75.19, 
        "y": 61.49, 
        "ingameCoords": "X:768 Y:138" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 54.06, 
        "y": 82.65, 
        "ingameCoords": "X:237 Y:138" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 42.56, 
        "y": 78.94, 
        "ingameCoords": "X:138 Y:327" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 17.44, 
        "y": 53.73, 
        "ingameCoords": "X:138 Y:957" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 21.81, 
        "y": 42.98, 
        "ingameCoords": "X:327 Y:1038" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 63.19, 
        "y": 25.17, 
        "ingameCoords": "X:1068 Y:747" 
    },
    { 
        "Type": "Production", 
        "Level": "Lv.1", 
        "x": 45.69, 
        "y": 17.06, 
        "ingameCoords": "X:957 Y:1068" 
    },

    // DEFENSE - Strutture difensive (Lv.2)
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 71.19, 
        "y": 65.54, 
        "ingameCoords": "X:666 Y:138" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 56.81, 
        "y": 69.42, 
        "ingameCoords": "X:438 Y:267" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 34.19, 
        "y": 70.48, 
        "ingameCoords": "X:138 Y:537" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 29.19, 
        "y": 57.43, 
        "ingameCoords": "X:237 Y:768" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 30.19, 
        "y": 35.04, 
        "ingameCoords": "X:537 Y:1038" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 41.44, 
        "y": 30.11, 
        "ingameCoords": "X:738 Y:957" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 66.19, 
        "y": 28.34, 
        "ingameCoords": "X:1068 Y:666" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.2", 
        "x": 70.81, 
        "y": 42.1, 
        "ingameCoords": "X:957 Y:438" 
    },

    // DEFENSE - Strutture difensive avanzate (Lv.4)
    { 
        "Type": "Defense", 
        "Level": "Lv.4", 
        "x": 54.06, 
        "y": 36.45, 
        "ingameCoords": "X:816 Y:717" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.4", 
        "x": 37.06, 
        "y": 53.38, 
        "ingameCoords": "X:387 Y:717" 
    },
    { 
        "Type": "Defense", 
        "Level": "Lv.4", 
        "x": 60.56, 
        "y": 61.14, 
        "ingameCoords": "X:588 Y:327" 
    },

    // GATHERING - Strutture di raccolta (Lv.1)
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 82.81, 
        "y": 53.91, 
        "ingameCoords": "X:957 Y:138" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 46.44, 
        "y": 82.65, 
        "ingameCoords": "X:138 Y:237" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 68.06, 
        "y": 72.77, 
        "ingameCoords": "X:537 Y:87" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 26.94, 
        "y": 67.48, 
        "ingameCoords": "X:87 Y:666" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 18.19, 
        "y": 44.39, 
        "ingameCoords": "X:267 Y:1068" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 30.06, 
        "y": 26.93, 
        "ingameCoords": "X:636 Y:1137" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 72.81, 
        "y": 29.93, 
        "ingameCoords": "X:1137 Y:567" 
    },
    { 
        "Type": "Gathering", 
        "Level": "Lv.1", 
        "x": 55.44, 
        "y": 17.59, 
        "ingameCoords": "X:1068 Y:936" 
    },

    // TECH - Strutture tecnologiche (Lv.1)
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 78.94, 
        "y": 50.03, 
        "ingameCoords": "X:957 Y:237" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 66.06, 
        "y": 60.25, 
        "ingameCoords": "X:666 Y:267" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 50.31, 
        "y": 78.77, 
        "ingameCoords": "X:237 Y:237" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 39.44, 
        "y": 65.37, 
        "ingameCoords": "X:267 Y:537" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 21.44, 
        "y": 49.85, 
        "ingameCoords": "X:237 Y:957" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 34.31, 
        "y": 38.75, 
        "ingameCoords": "X:537 Y:936" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 66.06, 
        "y": 39.1, 
        "ingameCoords": "X:936 Y:537" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.1", 
        "x": 50.19, 
        "y": 21.29, 
        "ingameCoords": "X:957 Y:957" 
    },

    // TECH - Strutture tecnologiche avanzate (Lv.3)
    { 
        "Type": "Tech", 
        "Level": "Lv.3", 
        "x": 71.75, 
        "y": 50.03, 
        "ingameCoords": "X:867 Y:327" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.3", 
        "x": 50.25, 
        "y": 71.36, 
        "ingameCoords": "X:327 Y:327" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.3", 
        "x": 28.63, 
        "y": 49.85, 
        "ingameCoords": "X:327 Y:867" 
    },
    { 
        "Type": "Tech", 
        "Level": "Lv.3", 
        "x": 50.13, 
        "y": 28.52, 
        "ingameCoords": "X:867 Y:867" 
    },

    // WEAPONS - Strutture per armi (Lv.2)
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 79.13, 
        "y": 57.43, 
        "ingameCoords": "X:867 Y:138" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 59.13, 
        "y": 77.18, 
        "ingameCoords": "X:366 Y:138" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 38.25, 
        "y": 74.54, 
        "ingameCoords": "X:138 Y:438" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 21, 
        "y": 57.61, 
        "ingameCoords": "X:138 Y:867" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 25, 
        "y": 37.69, 
        "ingameCoords": "X:438 Y:1068" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 79.63, 
        "y": 41.92, 
        "ingameCoords": "X:1068 Y:327" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 58.13, 
        "y": 20.76, 
        "ingameCoords": "X:1068 Y:867" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.2", 
        "x": 42, 
        "y": 20.41, 
        "ingameCoords": "X:867 Y:1068" 
    },

    // WEAPONS - Strutture per armi avanzate (Lv.4)
    { 
        "Type": "Weapons", 
        "Level": "Lv.4", 
        "x": 63.5, 
        "y": 45.27, 
        "ingameCoords": "X:816 Y:486" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.4", 
        "x": 46.13, 
        "y": 62.9, 
        "ingameCoords": "X:387 Y:486" 
    },
    { 
        "Type": "Weapons", 
        "Level": "Lv.4", 
        "x": 38.88, 
        "y": 39.8, 
        "ingameCoords": "X:588 Y:867" 
    },

    // TRAINING - Strutture di addestramento (Lv.2)
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 40.13, 
        "y": 68.72, 
        "ingameCoords": "X:237 Y:486" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 25.62, 
        "y": 62.19, 
        "ingameCoords": "X:138 Y:747" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 31.37, 
        "y": 40.16, 
        "ingameCoords": "X:486 Y:957" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 39.25, 
        "y": 25.52, 
        "ingameCoords": "X:768 Y:1038" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 58.25, 
        "y": 29.93, 
        "ingameCoords": "X:957 Y:747" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 73.25, 
        "y": 35.92, 
        "ingameCoords": "X:1068 Y:486" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 63.88, 
        "y": 72.77, 
        "ingameCoords": "X:486 Y:138" 
    },
    { 
        "Type": "Training", 
        "Level": "Lv.2", 
        "x": 71.13, 
        "y": 57.43, 
        "ingameCoords": "X:768 Y:237" 
    },

    // EXPEDITION - Strutture di spedizione (Lv.3)
    { 
        "Type": "Expedition", 
        "Level": "Lv.3", 
        "x": 67.63, 
        "y": 53.91, 
        "ingameCoords": "X:768" 
    },
    { 
        "Type": "Expedition", 
        "Level": "Lv.3", 
        "x": 40.63, 
        "y": 61.84, 
        "ingameCoords": "X:327 Y:567" 
    },
    { 
        "Type": "Expedition", 
        "Level": "Lv.3", 
        "x": 34.88, 
        "y": 43.68, 
        "ingameCoords": "X:486 Y:867" 
    },
    { 
        "Type": "Expedition", 
        "Level": "Lv.3", 
        "x": 58.13, 
        "y": 36.28, 
        "ingameCoords": "X:867 Y:666" 
    },

    // STRONGHOLD - Fortezze (vari livelli)
    { 
        "Type": "Stronghold", 
        "Level": "Lv.1", 
        "x": 41.75, 
        "y": 41.57, 
        "ingameCoords": "X:597 Y:800" 
    },
    { 
        "Type": "Stronghold", 
        "Level": "Lv.2", 
        "x": 42.25, 
        "y": 57.61, 
        "ingameCoords": "X:400 Y:597" 
    },
    { 
        "Type": "Stronghold", 
        "Level": "Lv.3", 
        "x": 57.63, 
        "y": 57.61, 
        "ingameCoords": "X:597 Y:400" 
    },
    { 
        "Type": "Stronghold", 
        "Level": "Lv.4", 
        "x": 58, 
        "y": 41.39, 
        "ingameCoords": "X:800 Y:597" 
    },

    // FORTRESS - Fortezze progressive (Lv.1-12)
    { 
        "Type": "Fortress", 
        "Level": "Lv.1", 
        "x": 26.63, 
        "y": 54.97, 
        "ingameCoords": "X:240 Y:831" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.2", 
        "x": 35.13, 
        "y": 63.6, 
        "ingameCoords": "X:240 Y:609" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.3", 
        "x": 45.63, 
        "y": 74.01, 
        "ingameCoords": "X:240 Y:351" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.4", 
        "x": 55.38, 
        "y": 73.65, 
        "ingameCoords": "X:369 Y:240" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.5", 
        "x": 64, 
        "y": 64.31, 
        "ingameCoords": "X:591 Y:240" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.6", 
        "x": 74.25, 
        "y": 54.08, 
        "ingameCoords": "X:849 Y:240" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.7", 
        "x": 74.25, 
        "y": 45.45, 
        "ingameCoords": "X:960 Y:351" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.8", 
        "x": 64.13, 
        "y": 35.22, 
        "ingameCoords": "X:960 Y:609" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.9", 
        "x": 55.25, 
        "y": 26.23, 
        "ingameCoords": "X:960 Y:831" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.10", 
        "x": 45.63, 
        "y": 25.35, 
        "ingameCoords": "X:849 Y:960" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.11", 
        "x": 35.88, 
        "y": 34.87, 
        "ingameCoords": "X:609 Y:960" 
    },
    { 
        "Type": "Fortress", 
        "Level": "Lv.12", 
        "x": 26.38, 
        "y": 44.21, 
        "ingameCoords": "X:369 Y:960" 
    }
];

// ============================================================================
// VALORI DEI BUFF
// ============================================================================

/**
 * Mapping dei valori dei bonus per ogni combinazione tipo-livello
 * 
 * La chiave segue il formato: "Tipo|Livello"
 * Il valore rappresenta il bonus percentuale applicato
 * 
 * Nota: Solo alcune combinazioni tipo-livello forniscono buff,
 * come definito dalle meccaniche del gioco.
 * 
 * @type {Object<string, string>}
 * @readonly
 */
const buffValues = {
    // Construction buffs
    "Construction|Lv.1": "+5%",
    "Construction|Lv.3": "+10%",
    
    // Production buffs
    "Production|Lv.1": "+5%",
    
    // Defense buffs
    "Defense|Lv.2": "+8%",
    "Defense|Lv.4": "+10%",
    
    // Gathering buffs
    "Gathering|Lv.1": "+5%",
    
    // Tech buffs
    "Tech|Lv.1": "+5%",
    "Tech|Lv.3": "+10%",
    
    // Weapons buffs
    "Weapons|Lv.2": "+8%",
    "Weapons|Lv.4": "+10%",
    
    // Training buffs
    "Training|Lv.2": "+8%",
    
    // Expedition buffs
    "Expedition|Lv.3": "+15%"
};

// ============================================================================
// VALIDAZIONE DATI (per sviluppo e debug)
// ============================================================================

/**
 * Funzione di utilità per validare l'integrità dei dati
 * Utilizzabile durante lo sviluppo per verificare la correttezza
 * 
 * @returns {Object} Risultato della validazione con statistiche
 */
function validateDataIntegrity() {
    const validation = {
        totalFacilities: facilityData.length,
        facilitiesByType: {},
        facilitiesByLevel: {},
        buffCoverage: {},
        issues: []
    };
    
    // Analizza distribuzione per tipo e livello
    facilityData.forEach((facility, index) => {
        const type = facility.Type;
        const level = facility.Level;
        const key = `${type}|${level}`;
        
        // Conta per tipo
        validation.facilitiesByType[type] = (validation.facilitiesByType[type] || 0) + 1;
        
        // Conta per livello
        validation.facilitiesByLevel[level] = (validation.facilitiesByLevel[level] || 0) + 1;
        
        // Verifica copertura buff
        if (buffValues[key]) {
            validation.buffCoverage[key] = (validation.buffCoverage[key] || 0) + 1;
        }
        
        // Validazione coordinate
        if (facility.x < 0 || facility.x > 100 || facility.y < 0 || facility.y > 100) {
            validation.issues.push(`Facility ${index}: coordinate fuori range (${facility.x}, ${facility.y})`);
        }
        
        // Validazione campi obbligatori
        if (!facility.Type || !facility.Level || !facility.ingameCoords) {
            validation.issues.push(`Facility ${index}: campi mancanti`);
        }
    });
    
    return validation;
}

// Nota: La funzione di validazione è disponibile solo in modalità debug
// e non dovrebbe essere utilizzata nel codice di produzione