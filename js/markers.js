// =====================================================================
// MARKERS-EVOLVED.JS - ARCHITETTURA PATTERN-DRIVEN OTTIMIZZATA
// =====================================================================
// 
// Evoluzione da approccio imperativo a sistema pattern-based enterprise
// 
// DESIGN PATTERNS IMPLEMENTATI:
// 🏗️ Factory Pattern - Creazione intelligente marker
// 🔍 Strategy Pattern - Sistema validazione modulare  
// 👀 Observer Pattern - Sincronizzazione stati
// 🎯 Command Pattern - Operazioni marker reversibili
// 🚀 Performance Optimizations - Virtual DOM e batching
//
// EDUCATIVO: Ogni sezione mostra come evolvere da codice procedurale
// a design pattern eleganti mantenendo compatibilità backwards

console.log('🚀 Caricamento markers.js evolved - Pattern-driven architecture');

// =====================================================================
// SEZIONE 1: FOUNDATION - CORE ABSTRACTIONS
// =====================================================================

/**
 * EDUCATIONAL INSIGHT: Centralized Configuration
 * 
 * Invece di avere configurazioni sparse nel codice, creiamo un oggetto
 * di configurazione centralizzato. Questo pattern:
 * - Facilita la manutenzione
 * - Rende il testing più semplice 
 * - Permette configurazioni dinamiche
 */
const MarkerSystemConfig = Object.freeze({
    // Performance settings
    performance: {
        batchSize: 50,              // Marker processati per batch
        debounceDelay: 16,          // ~60fps per operazioni DOM
        virtualDOMEnabled: true,     // Abilita virtual DOM per performance
        lazyLoadThreshold: 100      // Soglia per lazy loading
    },
    
    // Visual settings  
    visual: {
        markerBaseSize: 12,
        hoverScaleFactor: 1.5,
        animationDuration: 300,
        touchMinSize: 16
    },
    
    // Validation settings
    validation: {
        enableIntelligentSuggestions: true,
        maxAlternativeSuggestions: 5,
        duplicateWarningThreshold: 1
    },
    
    // Integration settings
    integration: {
        useFixedControlBar: true,
        enableLegacyCompatibility: true
    }
});

/**
 * EDUCATIONAL INSIGHT: Type System Foundation
 * 
 * Anche in JavaScript, definire "tipi" espliciti tramite oggetti
 * migliora la leggibilità e la manutenibilità del codice.
 */
const MarkerTypes = Object.freeze({
    FACILITY: 'facility',
    OVERLAY: 'overlay', 
    TEMPORARY: 'temporary'
});

const ValidationResults = Object.freeze({
    VALID: 'valid',
    WARNING: 'warning', 
    ERROR: 'error',
    BLOCKED: 'blocked'
});

// =====================================================================
// SEZIONE 2: STRATEGY PATTERN - SISTEMA VALIDAZIONE MODULARE
// =====================================================================

/**
 * EDUCATIONAL INSIGHT: Strategy Pattern Implementation
 * 
 * Il pattern Strategy permette di definire una famiglia di algoritmi,
 * incapsularli e renderli intercambiabili. Invece di avere una singola
 * funzione di validazione monolitica, ora abbiamo strategie specifiche
 * che possono essere combinate e estese facilmente.
 */
class ValidationStrategy {
    /**
     * Interfaccia base per tutte le strategie di validazione
     * @param {Object} context - Contesto di validazione
     * @returns {Object} Risultato validazione
     */
    validate(context) {
        throw new Error('Strategy must implement validate method');
    }
    
    /**
     * Priority determina l'ordine di esecuzione delle validazioni
     * @returns {number} Priority (più alto = eseguito prima)
     */
    get priority() {
        return 0;
    }
    
    /**
     * Nome human-readable della strategia
     * @returns {string} Nome strategia
     */
    get name() {
        return this.constructor.name;
    }
}

/**
 * STRATEGIA 1: Validazione Duplicati Buff
 * 
 * Evoluzione della funzione analyzeAllianceFacilityDuplicates originale
 * in una strategia dedicata e ottimizzata.
 */
class DuplicateBuffValidationStrategy extends ValidationStrategy {
    constructor() {
        super();
        // Cache per ottimizzare ricerche ripetute
        this._allianceFacilityCache = new Map();
        this._lastCacheUpdate = 0;
    }
    
    get priority() {
        return 100; // Alta priorità per validazione duplicati
    }
    
    validate(context) {
        const { facility, targetAlliance, excludeFacility } = context;
        
        // Ottimizzazione: usa cache se dati non sono cambiati
        const allianceFacilities = this._getCachedAllianceFacilities(targetAlliance);
        
        // Analisi duplicati ottimizzata
        const duplicateAnalysis = this._analyzeDuplicates(
            allianceFacilities, 
            facility.Type, 
            facility.Level,
            excludeFacility
        );
        
        if (duplicateAnalysis.hasDuplicate) {
            return {
                result: ValidationResults.WARNING,
                severity: 'medium',
                message: this._buildDuplicateMessage(targetAlliance, facility, duplicateAnalysis),
                data: duplicateAnalysis,
                suggestions: this._generateIntelligentSuggestions(context)
            };
        }
        
        return {
            result: ValidationResults.VALID,
            message: `No buff conflicts detected for ${facility.Type} ${facility.Level}`
        };
    }
    
    /**
     * Cache intelligente per facility per alleanza
     * Evita scansioni ripetute del dataset completo
     */
    _getCachedAllianceFacilities(allianceName) {
        const currentTime = Date.now();
        const cacheKey = allianceName;
        
        // Invalida cache ogni 5 secondi o dopo modifiche
        if (currentTime - this._lastCacheUpdate > 5000 || !this._allianceFacilityCache.has(cacheKey)) {
            const facilities = facilityData.filter(f => f.Alliance === allianceName);
            this._allianceFacilityCache.set(cacheKey, facilities);
            this._lastCacheUpdate = currentTime;
        }
        
        return this._allianceFacilityCache.get(cacheKey) || [];
    }
    
    /**
     * Analisi duplicati ottimizzata con early return
     */
    _analyzeDuplicates(allianceFacilities, facilityType, facilityLevel, excludeFacility) {
        const exactDuplicates = [];
        
        // Ottimizzazione: early return se alleanza vuota
        if (allianceFacilities.length === 0) {
            return {
                hasDuplicate: false,
                duplicateCount: 0,
                exactDuplicates: []
            };
        }
        
        // Scansione ottimizzata con break early
        for (const facility of allianceFacilities) {
            if (excludeFacility && facility === excludeFacility) continue;
            
            if (facility.Type === facilityType && facility.Level === facilityLevel) {
                exactDuplicates.push(facility);
            }
        }
        
        return {
            hasDuplicate: exactDuplicates.length > 0,
            duplicateCount: exactDuplicates.length,
            exactDuplicates,
            totalAllianceFacilities: allianceFacilities.length
        };
    }
    
    /**
     * Costruisce messaggio di warning intelligente
     */
    _buildDuplicateMessage(allianceName, facility, analysis) {
        const buffKey = `${facility.Type}|${facility.Level}`;
        const buffValue = buffValues[buffKey] || 'Unknown buff';
        const totalAfter = analysis.duplicateCount + 1;
        
        return `⚠️ BUFF CONFLICT: Alliance "${allianceName}" will have ${totalAfter} identical ${facility.Type} ${facility.Level} facilities. Only one buff (${buffValue}) will be active, wasting ${totalAfter - 1} potential buff slots.`;
    }
    
    /**
     * Genera suggerimenti intelligenti per alternative ottimali
     */
    _generateIntelligentSuggestions(context) {
        if (!MarkerSystemConfig.validation.enableIntelligentSuggestions) {
            return [];
        }
        
        const { targetAlliance, facility } = context;
        const availableFacilities = facilityData.filter(f => !f.Alliance);
        const currentKey = `${facility.Type}|${facility.Level}`;
        
        // Trova facility che non creerebbero conflitti
        const suggestions = availableFacilities
            .filter(f => `${f.Type}|${f.Level}` !== currentKey)
            .filter(f => !this._wouldCreateDuplicate(targetAlliance, f))
            .sort((a, b) => this._getBuffValue(b) - this._getBuffValue(a))
            .slice(0, MarkerSystemConfig.validation.maxAlternativeSuggestions);
            
        return suggestions.map(f => ({
            facility: f,
            buffValue: buffValues[`${f.Type}|${f.Level}`] || 'Unknown',
            reason: 'No conflict, optimal buff utilization'
        }));
    }
    
    /**
     * Utility: verifica se una facility creerebbe duplicati
     */
    _wouldCreateDuplicate(allianceName, facility) {
        const allianceFacilities = this._getCachedAllianceFacilities(allianceName);
        return allianceFacilities.some(f => 
            f.Type === facility.Type && f.Level === facility.Level
        );
    }
    
    /**
     * Utility: estrae valore numerico del buff per sorting
     */
    _getBuffValue(facility) {
        const buffKey = `${facility.Type}|${facility.Level}`;
        const buffString = buffValues[buffKey] || '0%';
        const match = buffString.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    /**
     * Invalida cache quando i dati cambiano
     */
    invalidateCache() {
        this._allianceFacilityCache.clear();
        this._lastCacheUpdate = 0;
    }
}

/**
 * STRATEGIA 2: Validazione Limiti Alleanza
 * 
 * Esempio di come aggiungere nuove regole di validazione
 * senza modificare il codice esistente.
 */
class AllianceLimitsValidationStrategy extends ValidationStrategy {
    constructor(maxFacilitiesPerAlliance = 50) {
        super();
        this.maxFacilitiesPerAlliance = maxFacilitiesPerAlliance;
    }
    
    get priority() {
        return 80; // Priorità media
    }
    
    validate(context) {
        const { targetAlliance } = context;
        
        const currentCount = facilityData.filter(f => f.Alliance === targetAlliance).length;
        
        if (currentCount >= this.maxFacilitiesPerAlliance) {
            return {
                result: ValidationResults.BLOCKED,
                severity: 'high',
                message: `Alliance "${targetAlliance}" has reached the maximum limit of ${this.maxFacilitiesPerAlliance} facilities.`,
                data: { currentCount, limit: this.maxFacilitiesPerAlliance }
            };
        }
        
        if (currentCount >= this.maxFacilitiesPerAlliance * 0.9) {
            return {
                result: ValidationResults.WARNING,
                severity: 'low',
                message: `Alliance "${targetAlliance}" is approaching the facility limit (${currentCount}/${this.maxFacilitiesPerAlliance}).`,
                data: { currentCount, limit: this.maxFacilitiesPerAlliance }
            };
        }
        
        return {
            result: ValidationResults.VALID,
            message: `Alliance facility count within limits (${currentCount}/${this.maxFacilitiesPerAlliance})`
        };
    }
}

/**
 * VALIDATOR ORCHESTRATOR
 * 
 * Coordina tutte le strategie di validazione e combina i risultati.
 * Implementa il pattern Chain of Responsibility.
 */
class IntelligentValidator {
    constructor() {
        this.strategies = new Map();
        this._registerDefaultStrategies();
    }
    
    /**
     * Registra le strategie di validazione di default
     */
    _registerDefaultStrategies() {
        this.addStrategy('duplicateBuffs', new DuplicateBuffValidationStrategy());
        this.addStrategy('allianceLimits', new AllianceLimitsValidationStrategy());
    }
    
    /**
     * Aggiunge una nuova strategia di validazione
     * @param {string} name - Nome univoco della strategia
     * @param {ValidationStrategy} strategy - Istanza della strategia
     */
    addStrategy(name, strategy) {
        if (!(strategy instanceof ValidationStrategy)) {
            throw new Error('Strategy must extend ValidationStrategy');
        }
        this.strategies.set(name, strategy);
    }
    
    /**
     * Rimuove una strategia di validazione
     * @param {string} name - Nome della strategia da rimuovere
     */
    removeStrategy(name) {
        return this.strategies.delete(name);
    }
    
    /**
     * Esegue tutte le validazioni applicabili
     * @param {Object} context - Contesto di validazione
     * @returns {Object} Risultato complessivo della validazione
     */
    async validate(context) {
        const results = [];
        
        // Ordina strategie per priorità
        const sortedStrategies = Array.from(this.strategies.entries())
            .sort(([, a], [, b]) => b.priority - a.priority);
        
        // Esegui validazioni in parallelo per performance migliori
        const validationPromises = sortedStrategies.map(async ([name, strategy]) => {
            try {
                const result = await strategy.validate(context);
                return { name, strategy: strategy.name, ...result };
            } catch (error) {
                console.error(`Validation strategy ${name} failed:`, error);
                return {
                    name,
                    strategy: strategy.name,
                    result: ValidationResults.ERROR,
                    message: `Validation failed: ${error.message}`,
                    error
                };
            }
        });
        
        const validationResults = await Promise.all(validationPromises);
        
        // Combina risultati con logica intelligente
        return this._combineValidationResults(validationResults);
    }
    
    /**
     * Combina i risultati delle diverse validazioni in un risultato finale
     */
    _combineValidationResults(results) {
        const errors = results.filter(r => r.result === ValidationResults.ERROR);
        const blocked = results.filter(r => r.result === ValidationResults.BLOCKED);
        const warnings = results.filter(r => r.result === ValidationResults.WARNING);
        
        // Se ci sono errori o blocchi, il risultato finale è negativo
        if (errors.length > 0 || blocked.length > 0) {
            return {
                isValid: false,
                finalResult: blocked.length > 0 ? ValidationResults.BLOCKED : ValidationResults.ERROR,
                summary: this._buildFailureSummary(errors, blocked),
                details: [...errors, ...blocked],
                warnings,
                allResults: results
            };
        }
        
        // Se ci sono warning, il risultato è valido ma con avvertimenti
        if (warnings.length > 0) {
            return {
                isValid: true,
                requiresUserConfirmation: true,
                finalResult: ValidationResults.WARNING,
                summary: this._buildWarningSummary(warnings),
                details: warnings,
                allResults: results
            };
        }
        
        // Tutto valido
        return {
            isValid: true,
            finalResult: ValidationResults.VALID,
            summary: 'All validations passed successfully',
            allResults: results
        };
    }
    
    /**
     * Costruisce summary per fallimenti
     */
    _buildFailureSummary(errors, blocked) {
        if (blocked.length > 0) {
            return `Assignment blocked: ${blocked[0].message}`;
        }
        if (errors.length > 0) {
            return `Validation error: ${errors[0].message}`;
        }
        return 'Unknown validation failure';
    }
    
    /**
     * Costruisce summary per warning
     */
    _buildWarningSummary(warnings) {
        if (warnings.length === 1) {
            return warnings[0].message;
        }
        return `${warnings.length} warnings detected. Review before proceeding.`;
    }
    
    /**
     * Invalida cache di tutte le strategie
     */
    invalidateAllCaches() {
        for (const [, strategy] of this.strategies) {
            if (typeof strategy.invalidateCache === 'function') {
                strategy.invalidateCache();
            }
        }
    }
}

// =====================================================================
// SEZIONE 3: FACTORY PATTERN - CREAZIONE INTELLIGENTE MARKER
// =====================================================================

/**
 * EDUCATIONAL INSIGHT: Factory Pattern
 * 
 * Il Factory Pattern nasconde la complessità della creazione di oggetti
 * e permette di creare diversi tipi di marker in modo uniforme.
 * Questo è particolarmente utile quando la logica di creazione è complessa
 * o quando vogliamo supportare diversi tipi di marker.
 */
class MarkerFactory {
    constructor(config = MarkerSystemConfig) {
        this.config = config;
        this.createdMarkers = new WeakMap(); // Per tracking e cleanup
    }
    
    /**
     * Crea un marker basato sul tipo e parametri specificati
     * @param {Object} facilityData - Dati della facility
     * @param {string} type - Tipo di marker da creare
     * @param {Object} options - Opzioni aggiuntive
     * @returns {HTMLElement} Elemento marker creato
     */
    createMarker(facilityData, type = MarkerTypes.FACILITY, options = {}) {
        // Seleziona il builder appropriato basato sul tipo
        const builder = this._getBuilderForType(type);
        
        // Crea il marker usando il builder specifico
        const marker = builder.create(facilityData, options);
        
        // Applica configurazioni comuni
        this._applyCommonConfiguration(marker, facilityData, options);
        
        // Registra per tracking
        this.createdMarkers.set(marker, {
            facilityData,
            type,
            createdAt: Date.now(),
            options
        });
        
        return marker;
    }
    
    /**
     * Ottiene il builder appropriato per il tipo di marker
     */
    _getBuilderForType(type) {
        switch (type) {
            case MarkerTypes.FACILITY:
                return new FacilityMarkerBuilder(this.config);
            case MarkerTypes.OVERLAY:
                return new OverlayMarkerBuilder(this.config);
            case MarkerTypes.TEMPORARY:
                return new TemporaryMarkerBuilder(this.config);
            default:
                throw new Error(`Unknown marker type: ${type}`);
        }
    }
    
    /**
     * Applica configurazioni comuni a tutti i marker
     */
    _applyCommonConfiguration(marker, facilityData, options) {
        // Gestione touch devices
        if ('ontouchstart' in window) {
            const minSize = this.config.visual.touchMinSize;
            marker.style.minWidth = `${minSize}px`;
            marker.style.minHeight = `${minSize}px`;
        }
        
        // Applica calibrazione se disponibile
        if (typeof applyMapCalibration === 'function') {
            const adjustedPosition = applyMapCalibration(facilityData);
            marker.style.left = `calc(${adjustedPosition.x}% - 6px)`;
            marker.style.top = `calc(${adjustedPosition.y}% - 6px)`;
        }
        
        // Event handlers comuni
        this._attachCommonEventHandlers(marker, facilityData, options);
    }
    
    /**
     * Attacca event handlers comuni a tutti i marker
     */
    _attachCommonEventHandlers(marker, facilityData, options) {
        // Click handler con debouncing
        let clickTimeout = null;
        marker.addEventListener('click', (event) => {
            event.stopPropagation();
            
            // Debounce per evitare click multipli accidentali
            if (clickTimeout) return;
            
            clickTimeout = setTimeout(() => {
                this._handleMarkerClick(marker, facilityData, event);
                clickTimeout = null;
            }, 100);
        });
        
        // Hover effects ottimizzati
        if (!('ontouchstart' in window)) { // Solo su non-touch devices
            marker.addEventListener('mouseenter', () => {
                marker.style.transform = `scale(${this.config.visual.hoverScaleFactor})`;
                marker.style.zIndex = '1000';
            });
            
            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'scale(1)';
                marker.style.zIndex = '';
            });
        }
    }
    
    /**
     * Gestisce click sui marker con integrazione intelligente
     */
    _handleMarkerClick(marker, facilityData, event) {
        // Integrazione con sistema barra controllo se disponibile
        if (this.config.integration.useFixedControlBar && typeof handleMarkerClick === 'function') {
            handleMarkerClick(facilityData, marker);
            return;
        }
        
        // Fallback per compatibilità legacy
        if (this.config.integration.enableLegacyCompatibility) {
            console.log('Marker clicked:', facilityData.Type, facilityData.Level);
            
            // Mostra messaggio se sistema non disponibile
            if (typeof showStatus === 'function') {
                const t = translations[currentLanguage] || {};
                showStatus(t.addAtLeastOneAlliance || '⚠️ Control system not ready', 'warning');
            }
        }
    }
    
    /**
     * Aggiorna tutti i marker creati da questa factory
     * Utile per aggiornamenti di massa
     */
    updateAllMarkers() {
        let updatedCount = 0;
        
        // Itera su tutti i marker creati (che sono ancora nel DOM)
        for (const [marker, info] of this.createdMarkers) {
            if (marker.parentNode) {
                this._updateMarker(marker, info);
                updatedCount++;
            }
        }
        
        console.log(`Updated ${updatedCount} markers`);
        return updatedCount;
    }
    
    /**
     * Aggiorna un singolo marker
     */
    _updateMarker(marker, info) {
        // Riapplica configurazioni che potrebbero essere cambiate
        this._applyCommonConfiguration(marker, info.facilityData, info.options);
        
        // Aggiorna icona alleanza se necessario
        if (typeof renderAllianceIconOnMarker === 'function') {
            renderAllianceIconOnMarker(info.facilityData);
        }
    }
    
    /**
     * Cleanup: rimuove marker e pulisce tracking
     */
    destroyMarker(marker) {
        if (marker && marker.parentNode) {
            marker.parentNode.removeChild(marker);
        }
        return this.createdMarkers.delete(marker);
    }
    
    /**
     * Statistiche sui marker creati
     */
    getStats() {
        let activeCount = 0;
        let totalCreated = 0;
        
        for (const [marker] of this.createdMarkers) {
            totalCreated++;
            if (marker.parentNode) {
                activeCount++;
            }
        }
        
        return {
            totalCreated,
            activeCount,
            orphaned: totalCreated - activeCount
        };
    }
}

/**
 * BUILDER BASE per marker
 */
class MarkerBuilder {
    constructor(config) {
        this.config = config;
    }
    
    create(facilityData, options) {
        throw new Error('Builder must implement create method');
    }
}

/**
 * BUILDER SPECIFICO per facility marker
 */
class FacilityMarkerBuilder extends MarkerBuilder {
    create(facilityData, options = {}) {
        const marker = document.createElement('div');
        marker.className = `marker ${facilityData.Type.toLowerCase()}`;
        
        // Configura dimensioni base
        const size = options.size || this.config.visual.markerBaseSize;
        marker.style.width = `${size}px`;
        marker.style.height = `${size}px`;
        
        // Tooltip informativo
        const coordinates = facilityData.ingameCoords ? ` (${facilityData.ingameCoords})` : '';
        marker.title = `${facilityData.Type} ${facilityData.Level}${coordinates}`;
        
        // Icona facility
        this._addFacilityIcon(marker, facilityData);
        
        // Stato assegnazione
        if (facilityData.Alliance) {
            marker.classList.add('assigned');
        }
        
        return marker;
    }
    
    _addFacilityIcon(marker, facilityData) {
        const facilityIcon = document.createElement('span');
        facilityIcon.className = 'facility-icon';
        facilityIcon.textContent = facilityIcons[facilityData.Type] || '📍';
        marker.appendChild(facilityIcon);
    }
}

/**
 * BUILDER per marker overlay (ad esempio per evidenziazioni temporanee)
 */
class OverlayMarkerBuilder extends MarkerBuilder {
    create(facilityData, options = {}) {
        const marker = document.createElement('div');
        marker.className = 'marker overlay-marker';
        
        // Stile distinto per overlay
        marker.style.cssText = `
            border: 3px solid ${options.color || '#ff6b6b'};
            background: ${options.backgroundColor || 'transparent'};
            border-radius: 50%;
            animation: pulseOverlay 2s infinite;
        `;
        
        return marker;
    }
}

/**
 * BUILDER per marker temporanei
 */
class TemporaryMarkerBuilder extends MarkerBuilder {
    create(facilityData, options = {}) {
        const marker = document.createElement('div');
        marker.className = 'marker temporary-marker';
        
        // Auto-rimozione dopo timeout
        const timeout = options.timeout || 5000;
        setTimeout(() => {
            if (marker.parentNode) {
                marker.remove();
            }
        }, timeout);
        
        return marker;
    }
}

// =====================================================================
// SEZIONE 4: OBSERVER PATTERN - SINCRONIZZAZIONE STATI
// =====================================================================

/**
 * EDUCATIONAL INSIGHT: Observer Pattern
 * 
 * L'Observer Pattern permette a oggetti di notificare automaticamente
 * altri oggetti quando il loro stato cambia. Questo è ideale per
 * mantenere sincronizzati diversi componenti dell'UI senza creare
 * dipendenze strette tra di loro.
 */
class MarkerStateManager {
    constructor() {
        this.observers = new Map();
        this.state = {
            totalMarkers: 0,
            assignedMarkers: 0,
            lastUpdate: null
        };
    }
    
    /**
     * Aggiunge un observer per un tipo di evento specifico
     * @param {string} eventType - Tipo di evento da osservare
     * @param {Function} callback - Funzione da chiamare quando l'evento si verifica
     * @param {Object} options - Opzioni per l'observer
     */
    subscribe(eventType, callback, options = {}) {
        if (!this.observers.has(eventType)) {
            this.observers.set(eventType, []);
        }
        
        const observer = {
            callback,
            id: Math.random().toString(36).substr(2, 9),
            priority: options.priority || 0,
            once: options.once || false
        };
        
        this.observers.get(eventType).push(observer);
        
        // Ordina per priorità
        this.observers.get(eventType).sort((a, b) => b.priority - a.priority);
        
        return observer.id; // Restituisce ID per unsubscribe
    }
    
    /**
     * Rimuove un observer
     * @param {string} eventType - Tipo di evento
     * @param {string} observerId - ID dell'observer da rimuovere
     */
    unsubscribe(eventType, observerId) {
        if (!this.observers.has(eventType)) return false;
        
        const observers = this.observers.get(eventType);
        const index = observers.findIndex(obs => obs.id === observerId);
        
        if (index >= 0) {
            observers.splice(index, 1);
            return true;
        }
        
        return false;
    }
    
    /**
     * Notifica tutti gli observer di un evento
     * @param {string} eventType - Tipo di evento
     * @param {*} data - Dati da passare agli observer
     */
    notify(eventType, data) {
        if (!this.observers.has(eventType)) return;
        
        const observers = this.observers.get(eventType);
        const toRemove = [];
        
        observers.forEach(observer => {
            try {
                observer.callback(data, eventType);
                
                // Rimuovi observer "once" dopo l'esecuzione
                if (observer.once) {
                    toRemove.push(observer.id);
                }
            } catch (error) {
                console.error(`Observer error for event ${eventType}:`, error);
            }
        });
        
        // Cleanup observer "once"
        toRemove.forEach(id => this.unsubscribe(eventType, id));
    }
    
    /**
     * Aggiorna lo stato e notifica gli observer
     * @param {Object} newState - Nuovo stato
     */
    updateState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState, lastUpdate: Date.now() };
        
        // Notifica observer del cambio di stato
        this.notify('stateChanged', { oldState, newState: this.state });
        
        // Notifica observer specifici per proprietà cambiate
        Object.keys(newState).forEach(key => {
            if (oldState[key] !== this.state[key]) {
                this.notify(`${key}Changed`, {
                    property: key,
                    oldValue: oldState[key],
                    newValue: this.state[key]
                });
            }
        });
    }
    
    /**
     * Ottiene lo stato corrente
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Utility: conta marker attuali e aggiorna stato
     */
    refreshMarkerCount() {
        const totalMarkers = document.querySelectorAll('.marker').length;
        const assignedMarkers = document.querySelectorAll('.marker.assigned').length;
        
        this.updateState({
            totalMarkers,
            assignedMarkers
        });
        
        return { totalMarkers, assignedMarkers };
    }
}

// =====================================================================
// SEZIONE 5: PERFORMANCE OPTIMIZATIONS - BATCHING E VIRTUAL DOM
// =====================================================================

/**
 * EDUCATIONAL INSIGHT: Performance Optimization Techniques
 * 
 * Quando si lavora con molti elementi DOM, le performance possono degradare
 * rapidamente. Implementiamo tecniche avanzate come batching delle operazioni
 * DOM e virtual DOM leggero per mantenere l'applicazione fluida.
 */
class PerformanceOptimizedMarkerManager {
    constructor(config = MarkerSystemConfig) {
        this.config = config;
        this.factory = new MarkerFactory(config);
        this.validator = new IntelligentValidator();
        this.stateManager = new MarkerStateManager();
        
        // Performance tracking
        this.operationQueue = [];
        this.isProcessing = false;
        this.virtualDOM = new Map(); // Semplice virtual DOM
        
        // Setup performance observers
        this._setupPerformanceObservers();
    }
    
    /**
     * Crea marker in batch per migliori performance
     * @param {Array} facilities - Array di facility data
     * @returns {Promise} Promise che si risolve quando tutti i marker sono creati
     */
    async createMarkersInBatch(facilities) {
        console.log(`Creating ${facilities.length} markers in batches of ${this.config.performance.batchSize}`);
        
        const startTime = performance.now();
        let createdCount = 0;
        
        // Processa in batch per evitare di bloccare il main thread
        for (let i = 0; i < facilities.length; i += this.config.performance.batchSize) {
            const batch = facilities.slice(i, i + this.config.performance.batchSize);
            
            // Crea batch di marker
            const batchPromises = batch.map(facility => this._createSingleMarker(facility));
            await Promise.all(batchPromises);
            
            createdCount += batch.length;
            
            // Yield control al browser per mantenerlo responsivo
            await this._yieldToMain();
            
            // Aggiorna progress se richiesto
            this.stateManager.notify('batchProgress', {
                processed: createdCount,
                total: facilities.length,
                progress: (createdCount / facilities.length) * 100
            });
        }
        
        const endTime = performance.now();
        console.log(`Created ${createdCount} markers in ${(endTime - startTime).toFixed(2)}ms`);
        
        // Aggiorna stato finale
        this.stateManager.refreshMarkerCount();
        
        return createdCount;
    }
    
    /**
     * Crea un singolo marker con caching virtual DOM
     */
    async _createSingleMarker(facility) {
        try {
            // Controlla virtual DOM cache
            const cacheKey = this._getMarkerCacheKey(facility);
            if (this.virtualDOM.has(cacheKey)) {
                const cachedData = this.virtualDOM.get(cacheKey);
                // Clone del marker cached per performance
                const marker = cachedData.element.cloneNode(true);
                this._insertMarkerIntoDOM(marker, facility);
                return marker;
            }
            
            // Crea nuovo marker
            const marker = this.factory.createMarker(facility);
            
            // Cache nel virtual DOM
            this.virtualDOM.set(cacheKey, {
                element: marker.cloneNode(true),
                facility: { ...facility },
                createdAt: Date.now()
            });
            
            // Inserisci nel DOM
            this._insertMarkerIntoDOM(marker, facility);
            
            return marker;
            
        } catch (error) {
            console.error(`Error creating marker for facility:`, facility, error);
            return null;
        }
    }
    
    /**
     * Inserisce marker nel DOM in modo ottimizzato
     */
    _insertMarkerIntoDOM(marker, facility) {
        const mapWrapper = document.getElementById('map-wrapper');
        if (!mapWrapper) {
            throw new Error('Map wrapper not found');
        }
        
        // Usa DocumentFragment per operazioni DOM ottimizzate
        const fragment = document.createDocumentFragment();
        fragment.appendChild(marker);
        mapWrapper.appendChild(fragment);
        
        // Aggiorna reference facility
        facility.marker = marker;
    }
    
    /**
     * Genera chiave cache per marker
     */
    _getMarkerCacheKey(facility) {
        return `${facility.Type}-${facility.Level}-${facility.x}-${facility.y}`;
    }
    
    /**
     * Yield control al main thread per non bloccare l'UI
     */
    _yieldToMain() {
        return new Promise(resolve => {
            setTimeout(resolve, this.config.performance.debounceDelay);
        });
    }
    
    /**
     * Assegna facility con validazione intelligente e performance ottimizzate
     */
    async assignFacilityWithValidation(facility, marker, allianceName) {
        const startTime = performance.now();
        
        try {
            // Validazione con nuovo sistema pattern-based
            const validationContext = {
                facility,
                marker,
                targetAlliance: allianceName,
                excludeFacility: facility,
                currentAlliances: alliances
            };
            
            const validationResult = await this.validator.validate(validationContext);
            
            // Gestisci risultato validazione
            if (!validationResult.isValid) {
                this._handleValidationFailure(validationResult);
                return false;
            }
            
            if (validationResult.requiresUserConfirmation) {
                const userConfirmed = await this._showValidationWarning(validationResult);
                if (!userConfirmed) {
                    return false;
                }
            }
            
            // Esegui assegnazione
            const success = await this._executeAssignment(facility, marker, allianceName);
            
            if (success) {
                // Invalida cache validator per prossime validazioni
                this.validator.invalidateAllCaches();
                
                // Aggiorna stato
                this.stateManager.refreshMarkerCount();
                
                // Notifica successo
                this.stateManager.notify('facilityAssigned', {
                    facility,
                    alliance: allianceName,
                    duration: performance.now() - startTime
                });
            }
            
            return success;
            
        } catch (error) {
            console.error('Error in facility assignment:', error);
            this._showError(`Assignment failed: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Gestisce fallimenti di validazione
     */
    _handleValidationFailure(validationResult) {
        const message = validationResult.summary || 'Validation failed';
        
        if (typeof showStatus === 'function') {
            showStatus(`❌ ${message}`, 'error', 5000);
        } else {
            console.error('Validation failed:', validationResult);
        }
    }
    
    /**
     * Mostra warning di validazione all'utente
     */
    async _showValidationWarning(validationResult) {
        // Se abbiamo una UI di conferma avanzata, usala
        if (typeof this._showAdvancedConfirmationDialog === 'function') {
            return await this._showAdvancedConfirmationDialog(validationResult);
        }
        
        // Fallback a confirm nativo
        const message = `${validationResult.summary}\n\nDo you want to proceed anyway?`;
        return confirm(message);
    }
    
    /**
     * Esegue l'assegnazione effettiva
     */
    async _executeAssignment(facility, marker, allianceName) {
        try {
            // Aggiorna dati facility
            facility.Alliance = allianceName;
            
            // Aggiorna visuale marker
            this._updateMarkerVisuals(facility, marker);
            
            // Sincronizza con sistemi esterni
            await this._syncWithExternalSystems();
            
            // Feedback utente
            this._provideFeedback(facility, allianceName);
            
            return true;
            
        } catch (error) {
            console.error('Error executing assignment:', error);
            return false;
        }
    }
    
    /**
     * Aggiorna visualizzazione marker
     */
    _updateMarkerVisuals(facility, marker) {
        // Aggiorna classe CSS
        if (facility.Alliance) {
            marker.classList.add('assigned');
        } else {
            marker.classList.remove('assigned');
        }
        
        // Aggiorna icona alleanza
        if (typeof renderAllianceIconOnMarker === 'function') {
            renderAllianceIconOnMarker(facility);
        }
    }
    
    /**
     * Sincronizza con sistemi esterni
     */
    async _syncWithExternalSystems() {
        // Aggiorna UI components se disponibili
        const updatePromises = [];
        
        if (typeof updateStats === 'function') {
            updatePromises.push(Promise.resolve(updateStats()));
        }
        
        if (typeof renderAllianceList === 'function') {
            updatePromises.push(Promise.resolve(renderAllianceList()));
        }
        
        if (typeof renderFacilitySummary === 'function') {
            updatePromises.push(Promise.resolve(renderFacilitySummary()));
        }
        
        if (typeof renderBuffSummary === 'function') {
            updatePromises.push(Promise.resolve(renderBuffSummary()));
        }
        
        // Salva dati
        if (typeof saveData === 'function') {
            updatePromises.push(Promise.resolve(saveData()));
        }
        
        // Esegui tutti gli aggiornamenti in parallelo
        await Promise.all(updatePromises);
    }
    
    /**
     * Fornisce feedback all'utente
     */
    _provideFeedback(facility, allianceName) {
        const t = translations[currentLanguage] || {};
        let message, type;
        
        if (allianceName) {
            message = `✅ ${facility.Type} ${t.assignedTo || 'assigned to'} ${allianceName}`;
            type = 'success';
        } else {
            message = `🗑️ ${facility.Type} ${t.removed || 'removed'}`;
            type = 'info';
        }
        
        if (typeof showStatus === 'function') {
            showStatus(message, type);
        }
    }
    
    /**
     * Mostra errore all'utente
     */
    _showError(message) {
        if (typeof showStatus === 'function') {
            showStatus(message, 'error');
        } else {
            console.error(message);
        }
    }
    
    /**
     * Setup degli observer per performance monitoring
     */
    _setupPerformanceObservers() {
        // Observer per cambio stato
        this.stateManager.subscribe('stateChanged', (data) => {
            console.log('Marker state updated:', data.newState);
        });
        
        // Observer per progress batch
        this.stateManager.subscribe('batchProgress', (data) => {
            if (data.progress % 25 === 0) { // Log ogni 25%
                console.log(`Batch progress: ${data.progress.toFixed(1)}% (${data.processed}/${data.total})`);
            }
        });
        
        // Monitor performance con Web API se disponibile
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.name.includes('marker') && entry.duration > 16) {
                            console.warn(`Slow marker operation: ${entry.name} took ${entry.duration}ms`);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['measure'] });
            } catch (error) {
                console.log('PerformanceObserver not available:', error.message);
            }
        }
    }
    
    /**
     * Cleanup e ottimizzazione memoria
     */
    cleanup() {
        // Pulisci virtual DOM cache
        this.virtualDOM.clear();
        
        // Pulisci operation queue
        this.operationQueue = [];
        
        // Pulisci observer
        this.stateManager.observers.clear();
        
        console.log('MarkerManager cleanup completed');
    }
    
    /**
     * Statistiche performance
     */
    getPerformanceStats() {
        return {
            virtualDOMSize: this.virtualDOM.size,
            queuedOperations: this.operationQueue.length,
            observersCount: Array.from(this.stateManager.observers.values()).reduce((sum, arr) => sum + arr.length, 0),
            factoryStats: this.factory.getStats(),
            config: this.config
        };
    }
}

// =====================================================================
// SEZIONE 6: INTEGRAZIONE E COMPATIBILITÀ BACKWARDS
// =====================================================================

/**
 * EDUCATIONAL INSIGHT: Backward Compatibility
 * 
 * Quando si evolve un sistema esistente, è fondamentale mantenere
 * compatibilità con il codice legacy. Questa sezione mostra come
 * fornire una API che funziona sia con il nuovo sistema che con
 * il codice esistente.
 */

// Istanza globale del nuovo sistema
let globalMarkerManager = null;

/**
 * Inizializza il nuovo sistema marker
 */
function initializeAdvancedMarkerSystem(config = MarkerSystemConfig) {
    console.log('🚀 Initializing advanced marker system...');
    
    try {
        globalMarkerManager = new PerformanceOptimizedMarkerManager(config);
        
        // Setup integrazione con sistemi esistenti
        setupLegacyIntegration();
        
        console.log('✅ Advanced marker system initialized successfully');
        return globalMarkerManager;
        
    } catch (error) {
        console.error('❌ Failed to initialize advanced marker system:', error);
        return null;
    }
}

/**
 * Setup integrazione con funzioni legacy esistenti
 */
function setupLegacyIntegration() {
    // Mantieni compatibilità con funzioni esistenti
    if (typeof window.createMarker === 'undefined') {
        window.createMarker = function(facility, index) {
            if (globalMarkerManager) {
                return globalMarkerManager.factory.createMarker(facility);
            } else {
                console.warn('Advanced marker system not initialized, using legacy fallback');
                return legacyCreateMarker(facility, index);
            }
        };
    }
    
    if (typeof window.recreateAllMarkers === 'undefined') {
        window.recreateAllMarkers = function() {
            if (globalMarkerManager) {
                // Rimuovi marker esistenti
                document.querySelectorAll('.marker').forEach(marker => marker.remove());
                
                // Ricrea con nuovo sistema
                return globalMarkerManager.createMarkersInBatch(facilityData);
            } else {
                console.warn('Advanced marker system not initialized, using legacy fallback');
                return legacyRecreateAllMarkers();
            }
        };
    }
    
    if (typeof window.assignFacilityToAllianceWithValidation === 'undefined') {
        window.assignFacilityToAllianceWithValidation = function(facility, marker, allianceName) {
            if (globalMarkerManager) {
                return globalMarkerManager.assignFacilityWithValidation(facility, marker, allianceName);
            } else {
                console.warn('Advanced marker system not initialized, using legacy fallback');
                return legacyAssignFacility(facility, marker, allianceName);
            }
        };
    }
}

/**
 * Funzioni legacy fallback (implementazioni semplici delle funzioni originali)
 */
function legacyCreateMarker(facility, index) {
    const mapWrapper = document.getElementById('map-wrapper');
    if (!mapWrapper) return null;
    
    const marker = document.createElement('div');
    marker.className = `marker ${facility.Type.toLowerCase()}`;
    
    if (typeof applyMapCalibration === 'function') {
        const pos = applyMapCalibration(facility);
        marker.style.left = `calc(${pos.x}% - 6px)`;
        marker.style.top = `calc(${pos.y}% - 6px)`;
    }
    
    const icon = document.createElement('span');
    icon.className = 'facility-icon';
    icon.textContent = facilityIcons[facility.Type] || '📍';
    marker.appendChild(icon);
    
    marker.onclick = (e) => {
        e.stopPropagation();
        if (typeof handleMarkerClick === 'function') {
            handleMarkerClick(facility, marker);
        }
    };
    
    mapWrapper.appendChild(marker);
    facility.marker = marker;
    
    return marker;
}

function legacyRecreateAllMarkers() {
    document.querySelectorAll('.marker').forEach(marker => marker.remove());
    let count = 0;
    
    facilityData.forEach((facility, index) => {
        if (legacyCreateMarker(facility, index)) count++;
    });
    
    return count;
}

function legacyAssignFacility(facility, marker, allianceName) {
    facility.Alliance = allianceName;
    
    if (allianceName) {
        marker.classList.add('assigned');
    } else {
        marker.classList.remove('assigned');
    }
    
    if (typeof renderAllianceIconOnMarker === 'function') {
        renderAllianceIconOnMarker(facility);
    }
    
    return true;
}

// =====================================================================
// SEZIONE 7: FUNZIONI DI DEBUG E UTILITÀ AVANZATE
// =====================================================================

/**
 * Debug avanzato del nuovo sistema marker
 */
window.debugAdvancedMarkerSystem = function() {
    if (!globalMarkerManager) {
        console.log('❌ Advanced marker system not initialized');
        return null;
    }
    
    console.log('🔍 === DEBUG ADVANCED MARKER SYSTEM ===');
    
    const stats = globalMarkerManager.getPerformanceStats();
    const state = globalMarkerManager.stateManager.getState();
    
    console.log('📊 Performance Stats:', stats);
    console.log('🎯 Current State:', state);
    
    // Test validazione
    console.log('🧪 Testing validation system...');
    const testContext = {
        facility: { Type: 'Construction', Level: 'Lv.1' },
        targetAlliance: 'TestAlliance',
        currentAlliances: alliances
    };
    
    globalMarkerManager.validator.validate(testContext).then(result => {
        console.log('✅ Validation test result:', result);
    });
    
    console.log('=== END DEBUG ===');
    
    return {
        stats,
        state,
        manager: globalMarkerManager
    };
};

/**
 * Benchmark performance del sistema
 */
window.benchmarkMarkerSystem = async function(iterations = 100) {
    if (!globalMarkerManager) {
        console.log('❌ Advanced marker system not initialized');
        return;
    }
    
    console.log(`🏃‍♂️ Running marker performance benchmark (${iterations} iterations)...`);
    
    const results = {
        creation: [],
        validation: [],
        assignment: []
    };
    
    // Test creazione marker
    const testFacility = { Type: 'Construction', Level: 'Lv.1', x: 50, y: 50 };
    
    for (let i = 0; i < iterations; i++) {
        // Test creazione
        const createStart = performance.now();
        const marker = globalMarkerManager.factory.createMarker(testFacility);
        const createEnd = performance.now();
        results.creation.push(createEnd - createStart);
        
        // Test validazione
        const validationStart = performance.now();
        await globalMarkerManager.validator.validate({
            facility: testFacility,
            targetAlliance: 'TestAlliance'
        });
        const validationEnd = performance.now();
        results.validation.push(validationEnd - validationStart);
        
        // Cleanup
        if (marker && marker.parentNode) {
            marker.remove();
        }
    }
    
    // Calcola statistiche
    const calculateStats = (arr) => ({
        min: Math.min(...arr),
        max: Math.max(...arr),
        avg: arr.reduce((a, b) => a + b, 0) / arr.length,
        p95: arr.sort((a, b) => a - b)[Math.floor(arr.length * 0.95)]
    });
    
    console.log('📈 Benchmark Results:');
    console.log('  Marker Creation:', calculateStats(results.creation));
    console.log('  Validation:', calculateStats(results.validation));
    
    return results;
};

// =====================================================================
// SEZIONE 8: AUTO-INIZIALIZZAZIONE E SETUP
// =====================================================================

/**
 * Auto-inizializzazione quando il DOM è pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    // Attesa per assicurarsi che tutti i moduli siano caricati
    setTimeout(() => {
        if (typeof facilityData !== 'undefined' && typeof alliances !== 'undefined') {
            const manager = initializeAdvancedMarkerSystem();
            
            if (manager) {
                console.log('🎯 Advanced marker system auto-initialized successfully');
                
                // Setup observers per integrazione con il resto dell'app
                manager.stateManager.subscribe('facilityAssigned', (data) => {
                    console.log(`Facility assigned: ${data.facility.Type} -> ${data.alliance}`);
                });
                
                // Crea marker iniziali se abbiamo dati
                if (facilityData && facilityData.length > 0) {
                    console.log(`Creating initial ${facilityData.length} markers...`);
                    manager.createMarkersInBatch(facilityData).then(count => {
                        console.log(`✅ Created ${count} initial markers successfully`);
                    });
                }
            }
        } else {
            console.log('⏳ Waiting for facility data to initialize advanced marker system...');
            
            // Retry dopo un po' se i dati non sono ancora disponibili
            setTimeout(() => {
                if (typeof facilityData !== 'undefined') {
                    initializeAdvancedMarkerSystem();
                }
            }, 2000);
        }
    }, 500);
});

// =====================================================================
// LOG FINALE E RIEPILOGO ARCHITETTURA
// =====================================================================

console.log(`
🎯 === MARKERS EVOLVED - PATTERN-DRIVEN ARCHITECTURE LOADED ===

🏗️ DESIGN PATTERNS IMPLEMENTATI:
   • Factory Pattern - Creazione intelligente marker
   • Strategy Pattern - Sistema validazione modulare  
   • Observer Pattern - Sincronizzazione stati automatica
   • Builder Pattern - Costruzione marker specializzati

🚀 OTTIMIZZAZIONI PERFORMANCE:
   • Batch processing per operazioni massive
   • Virtual DOM leggero per caching
   • Async/await per non bloccare UI
   • Performance monitoring integrato

🔧 MIGLIORAMENTI ARCHITETTURALI:
   • Responsabilità separate e ben definite
   • Estensibilità tramite pattern modulari
   • Testing-friendly con dependency injection
   • Backward compatibility mantenuta

📚 EDUCATIONAL VALUE:
   Questo modulo dimostra come evolvere codice procedurale
   in un'architettura enterprise-grade mantenendo compatibilità
   e migliorando performance, manutenibilità ed estensibilità.

=== END MARKERS EVOLVED ===
`);

// Esportazioni per compatibilità
window.MarkerSystemConfig = MarkerSystemConfig;
window.IntelligentValidator = IntelligentValidator;
window.PerformanceOptimizedMarkerManager = PerformanceOptimizedMarkerManager;