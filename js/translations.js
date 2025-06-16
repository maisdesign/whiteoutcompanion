// =====================================================================
// TRANSLATIONS.JS - SISTEMA COMPLETO MULTILINGUA
// =====================================================================
// Questo file contiene tutte le traduzioni per Whiteout Survival Companion
// organizzate in modo modulare per facilità di manutenzione e espansione.
//
// STRUTTURA ORGANIZZATIVA:
// Ogni lingua è divisa in sezioni logiche che corrispondono alle 
// funzionalità dell'applicazione. Questo approccio modulare permette
// di aggiungere facilmente nuove funzionalità senza perdere la 
// coerenza organizzativa.
//
// LINGUE SUPPORTATE: 
// - Italiano (it) - Lingua principale di sviluppo
// - Inglese (en) - Lingua internazionale di fallback  
// - Spagnolo (es) - Mercato latino
// - Francese (fr) - Mercato europeo
// - Tedesco (de) - Mercato europeo centrale
// - Portoghese (pt) - Mercato brasiliano/portoghese

console.log('🌐 Caricamento sistema traduzioni multilingua...');

// =====================================================================
// TRADUZIONI COMPLETE PER LINGUA
// =====================================================================

const translations = {
  
  // ===================================================================
  // 🇮🇹 ITALIANO - LINGUA PRINCIPALE
  // ===================================================================
  // L'italiano è spesso usato come lingua di riferimento per lo sviluppo
  // dato che il progetto sembra essere di origine italiana
  
  it: {
    // =================================================================
    // SEZIONE: INTERFACCIA PRINCIPALE
    // =================================================================
    // Elementi base dell'interfaccia utente: titoli, sottotitoli, 
    // navigazione principale
    
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestione professionale alleanze con calibrazione mappa",
    interactiveMap: "🗺️ Mappa Interattiva",
    legend: "Legenda",
    legendTitle: "🎨 Legenda Colori e Icone Ufficiali",
    
    // =================================================================
    // SEZIONE: GESTIONE ALLEANZE
    // =================================================================
    // Tutto ciò che riguarda la creazione, modifica e gestione delle alleanze
    
    alliances: "Alleanze",
    assigned: "Assegnate",
    allianceManagement: "🏰 Gestione Alleanze",
    allianceName: "Nome alleanza...",
    addAlliance: "✨ Aggiungi Alleanza",
    editAlliance: "Modifica Alleanza",
    allianceIcon: "Icona alleanza",
    optional: "opzionale",
    currentIcon: "Icona attuale",
    save: "Salva",
    cancel: "Annulla",
    allianceUpdated: "Alleanza aggiornata",
    allianceCreated: "Alleanza creata",
    
    // =================================================================
    // SEZIONE: IMPORT/EXPORT E FILE
    // =================================================================
    // Funzionalità di importazione, esportazione e gestione file
    
    exportCSV: "📊 Esporta CSV",
    exportPNG: "🖼️ Esporta PNG",
    importCSV: "📥 Importa CSV", 
    csvExported: "📊 CSV esportato con successo!",
    pngExported: "PNG esportato",
    importSuccess: "Importazione completata",
    exportError: "Errore durante l'export",
    importError: "Errore nell'importazione del CSV",
    emptyCsv: "CSV vuoto o non valido",
    pngExportNotAvailable: "Funzione export PNG non disponibile",
    
    // Gestione file avanzata
    processing: "Elaborazione...",
    processingImage: "Elaborazione immagine...",
    imageOptimized: "Immagine ottimizzata",
    iconAlreadyUsed: "Icona già utilizzata, generazione automatica...",
    formatNotSupported: "Formato non supportato. Usa JPG, PNG, GIF o WebP.",
    fileTooLarge: "File troppo grande. Massimo 2MB.",
    invalidExtension: "Estensione file non valida.",
    imageProcessingFailed: "Errore nell'elaborazione dell'immagine.",
    fileReadFailed: "Errore nella lettura del file.",
    fileTooltip: "JPG, PNG, GIF, WebP - Max 2MB",
    
    // Messaggi export PNG
    exportedOn: "Esportato il",
    free: "Libere",
    active: "Attive",
    preparingExport: "Preparazione export...",
    renderingImage: "Rendering immagine...",
    
    // =================================================================
    // SEZIONE: SISTEMA MULTILINGUA
    // =================================================================
    // Controlli e messaggi per la gestione delle lingue
    
    language: "🌐 Lingua",
    selectLanguage: "🌐 Seleziona Lingua",
    languageSet: "🌐 Lingua impostata!",
    
    // =================================================================
    // SEZIONE: COLORI E TIPI FACILITY
    // =================================================================
    // Nomi e descrizioni dei tipi di facility con i loro colori ufficiali
    
    colorCastle: "Castle (Oro)",
    colorConstruction: "Construction (Blu)",
    colorProduction: "Production (Verde)",
    colorDefense: "Defense (Verde Acqua)",
    colorGathering: "Gathering (Viola)",
    colorTech: "Research/Tech (Arancione)",
    colorWeapons: "Troop Attack (Rosso)",
    colorTraining: "Training (Giallo)",
    colorExpedition: "March/Expedition (Rosa)",
    colorStronghold: "Stronghold (Marrone)",
    colorFortress: "Fortress (Grigio Scuro)",
    
    // =================================================================
    // SEZIONE: RIEPILOGHI E STATISTICHE
    // =================================================================
    // Interfacce per visualizzare statistiche e riepiloghi
    
    facilitySummary: "📋 Riepilogo Strutture",
    buffSummary: "⚡ Riepilogo Buff",
    noStructuresLoaded: "Nessuna struttura caricata",
    noAllianceAssigned: "Nessuna alleanza assegnata",
    noBuffRecognized: "Nessun buff riconosciuto",
    structures: "strutture",
    
    // =================================================================
    // SEZIONE: CALIBRAZIONE AVANZATA
    // =================================================================
    // Sistema per la calibrazione precisa della mappa
    
    advancedCalibration: "🔧 Calibrazione Avanzata",
    calibrationUnlocked: "🔓 Calibrazione sbloccata!",
    wrongPassword: "❌ Password errata!",
    
    // =================================================================
    // SEZIONE: ASSEGNAZIONI E DROPDOWN
    // =================================================================
    // Interfaccia per assegnare facility alle alleanze
    
    unassigned: "Non assegnata",
    assignedTo: "assegnata a",
    removed: "rimossa", 
    options: "opzioni",
    scrollToSeeAll: "Scrolla per vedere tutte le alleanze",
    markersUpdated: "marker aggiornati",
    
    // =================================================================
    // SEZIONE: VALIDAZIONE E MESSAGGI DI ERRORE
    // =================================================================
    // Messaggi per validazioni, errori e avvertimenti
    
    addAtLeastOneAlliance: "⚠️ Aggiungi almeno un'alleanza prima di assegnare.",
    enterAllianceName: "Inserisci un nome per l'alleanza",
    allianceExists: "Alleanza già esistente",
    maxAlliances: "Massimo 50 alleanze",
    
    // =================================================================
    // SEZIONE: SISTEMA ANTI-DUPLICATI (NUOVO)
    // =================================================================
    // Tutto il sistema educativo per prevenire conflitti di buff
    
    // Messaggi principali dell'alert
    assignmentCancelled: "Assegnazione annullata per evitare conflitto buff",
    duplicateAssignmentConfirmed: "Buff duplicato assegnato (non ottimale)",
    duplicateFacilityWarning: "ATTENZIONE: Buff Duplicato Rilevato!",
    duplicateFacilityExplanation: "In Whiteout Survival i buff NON si sommano per facility identiche!",
    
    // Calcoli e statistiche buff
    theoreticalBuff: "Buff teorico",
    actualBuff: "Buff REALE", 
    wastedBuffs: "Buff sprecati",
    buffCalculation: "Calcolo Buff",
    
    // Strategia e suggerimenti
    betterStrategy: "STRATEGIA MIGLIORE",
    diversifyFacilities: "Diversifica i tipi di facility per massimizzare i buff!",
    moreEffectiveAlternatives: "Alternative più efficaci",
    noAlternativesAvailable: "Nessuna alternativa disponibile al momento",
    
    // Interfaccia dell'alert
    continueAnyway: "Vuoi continuare comunque con questa assegnazione?",
    notRecommended: "(Non raccomandata per ottimizzazione strategica)",
    alreadyPresent: "Già presenti",
    situation: "Situazione",
    gameplayProblem: "PROBLEMA DEL GAMEPLAY",
    
    // =================================================================
    // SEZIONE: SISTEMA RESET CON UNDO
    // =================================================================
    // Funzionalità avanzata di reset con possibilità di annullamento
    
    resetAssignments: "Reset Assegnazioni",
    noAssignmentsToReset: "⚠️ Nessuna assegnazione da resettare",
    resetConfirmationTitle: "🗑️ Conferma Reset Totale",
    resetConfirmationMessage: "Questa azione rimuoverà TUTTE le assegnazioni di alleanze dalle strutture. Sarà possibile annullare per 10 secondi.",
    assignedStructures: "Strutture Assegnate",
    alliancesAffected: "Alleanze Coinvolte",
    willRemainFree: "Rimarranno Libere",
    resetWarning: "⚠️ Per confermare, digita \"RESET\" qui sotto:",
    typeReset: "Digita RESET",
    confirmReset: "CONFERMA RESET",
    resetCompleted: "Reset Completato",
    assignmentsRemoved: "assegnazioni rimosse",
    undo: "Annulla",
    undoNotAvailable: "❌ Annullamento non disponibile",
    undoCompleted: "Annullamento completato",
    assignmentsRestored: "assegnazioni ripristinate",
    
    // =================================================================
    // SEZIONE: REPORT E ANALISI
    // =================================================================
    // Sistema di reporting per ottimizzazione strategica
    
    buffOptimizationReport: "Report Ottimizzazione Buff",
    totalAlliances: "Alleanze totali",
    alliancesWithIssues: "Alleanze con problemi",
    totalWastedBuffs: "Buff sprecati totali",
    noConflictsDetected: "Perfetto! Nessun conflitto di buff rilevato.",
    issuesByAlliance: "Dettaglio problemi per alleanza",
    totalFacilities: "Facility totali",
    problems: "Problemi",
    copies: "copie",
    wasted: "sprecate",
    
    // =================================================================
    // SEZIONE: MESSAGGI DI SISTEMA
    // =================================================================
    // Messaggi di caricamento, stato e feedback generale
    
    appLoaded: "🎯 App caricata! {count} strutture con colori ufficiali.",
    appReady: "🚀 App pronta per l'uso"
  },
  
  // ===================================================================
  // 🇺🇸 INGLESE - LINGUA INTERNAZIONALE
  // ===================================================================
  // L'inglese serve come lingua di fallback e per il mercato internazionale
  
  en: {
    // =================================================================
    // SEZIONE: INTERFACCIA PRINCIPALE
    // =================================================================
    
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Professional alliance management with map calibration",
    interactiveMap: "🗺️ Interactive Map",
    legend: "Legend",
    legendTitle: "🎨 Official Colors and Icons Legend",
    
    // =================================================================
    // SEZIONE: GESTIONE ALLEANZE
    // =================================================================
    
    alliances: "Alliances",
    assigned: "Assigned",
    allianceManagement: "🏰 Alliance Management",
    allianceName: "Alliance name...",
    addAlliance: "✨ Add Alliance",
    editAlliance: "Edit Alliance",
    allianceIcon: "Alliance icon",
    optional: "optional",
    currentIcon: "Current icon",
    save: "Save",
    cancel: "Cancel",
    allianceUpdated: "Alliance updated",
    allianceCreated: "Alliance created",
    
    // =================================================================
    // SEZIONE: IMPORT/EXPORT E FILE
    // =================================================================
    
    exportCSV: "📊 Export CSV",
    exportPNG: "🖼️ Export PNG",
    importCSV: "📥 Import CSV",
    csvExported: "📊 CSV exported successfully!",
    pngExported: "PNG exported",
    importSuccess: "Import completed",
    exportError: "Export error",
    importError: "Error importing CSV",
    emptyCsv: "Empty or invalid CSV",
    pngExportNotAvailable: "PNG export function not available",
    
    // Gestione file avanzata
    processing: "Processing...",
    processingImage: "Processing image...",
    imageOptimized: "Image optimized",
    iconAlreadyUsed: "Icon already used, generating automatic...",
    formatNotSupported: "Format not supported. Use JPG, PNG, GIF or WebP.",
    fileTooLarge: "File too large. Maximum 2MB.",
    invalidExtension: "Invalid file extension.",
    imageProcessingFailed: "Error processing image.",
    fileReadFailed: "Error reading file.",
    fileTooltip: "JPG, PNG, GIF, WebP - Max 2MB",
    
    // Messaggi export PNG
    exportedOn: "Exported on",
    free: "Free",
    active: "Active",
    preparingExport: "Preparing export...",
    renderingImage: "Rendering image...",
    
    // =================================================================
    // SEZIONE: SISTEMA MULTILINGUA
    // =================================================================
    
    language: "🌐 Language",
    selectLanguage: "🌐 Select Language",
    languageSet: "🌐 Language set!",
    
    // =================================================================
    // SEZIONE: COLORI E TIPI FACILITY
    // =================================================================
    
    colorCastle: "Castle (Gold)",
    colorConstruction: "Construction (Blue)",
    colorProduction: "Production (Green)",
    colorDefense: "Defense (Teal)",
    colorGathering: "Gathering (Purple)",
    colorTech: "Research/Tech (Orange)",
    colorWeapons: "Troop Attack (Red)",
    colorTraining: "Training (Yellow)",
    colorExpedition: "March/Expedition (Pink)",
    colorStronghold: "Stronghold (Brown)",
    colorFortress: "Fortress (Dark Gray)",
    
    // =================================================================
    // SEZIONE: RIEPILOGHI E STATISTICHE
    // =================================================================
    
    facilitySummary: "📋 Facility Summary",
    buffSummary: "⚡ Buff Summary",
    noStructuresLoaded: "No structures loaded",
    noAllianceAssigned: "No alliance assigned",
    noBuffRecognized: "No buff recognized",
    structures: "structures",
    
    // =================================================================
    // SEZIONE: CALIBRAZIONE AVANZATA
    // =================================================================
    
    advancedCalibration: "🔧 Advanced Calibration",
    calibrationUnlocked: "🔓 Calibration unlocked!",
    wrongPassword: "❌ Wrong password!",
    
    // =================================================================
    // SEZIONE: ASSEGNAZIONI E DROPDOWN
    // =================================================================
    
    unassigned: "Unassigned",
    assignedTo: "assigned to",
    removed: "removed",
    options: "options",
    scrollToSeeAll: "Scroll to see all alliances",
    markersUpdated: "markers updated",
    
    // =================================================================
    // SEZIONE: VALIDAZIONE E MESSAGGI DI ERRORE
    // =================================================================
    
    addAtLeastOneAlliance: "⚠️ Add at least one alliance before assigning.",
    enterAllianceName: "Enter an alliance name",
    allianceExists: "Alliance already exists",
    maxAlliances: "Maximum 50 alliances",
    
    // =================================================================
    // SEZIONE: SISTEMA ANTI-DUPLICATI
    // =================================================================
    
    assignmentCancelled: "Assignment cancelled to avoid buff conflict",
    duplicateAssignmentConfirmed: "Duplicate buff assigned (not optimal)",
    duplicateFacilityWarning: "WARNING: Duplicate Buff Detected!",
    duplicateFacilityExplanation: "In Whiteout Survival buffs DO NOT stack for identical facilities!",
    theoreticalBuff: "Theoretical buff",
    actualBuff: "ACTUAL buff",
    wastedBuffs: "Wasted buffs",
    buffCalculation: "Buff Calculation",
    betterStrategy: "BETTER STRATEGY",
    diversifyFacilities: "Diversify facility types to maximize buffs!",
    moreEffectiveAlternatives: "More effective alternatives",
    noAlternativesAvailable: "No alternatives available at the moment",
    continueAnyway: "Do you want to continue with this assignment anyway?",
    notRecommended: "(Not recommended for strategic optimization)",
    alreadyPresent: "Already present",
    situation: "Situation",
    gameplayProblem: "GAMEPLAY ISSUE",
    
    // =================================================================
    // SEZIONE: SISTEMA RESET CON UNDO
    // =================================================================
    
    resetAssignments: "Reset Assignments",
    noAssignmentsToReset: "⚠️ No assignments to reset",
    resetConfirmationTitle: "🗑️ Confirm Total Reset",
    resetConfirmationMessage: "This action will remove ALL alliance assignments from structures. You can undo for 10 seconds.",
    assignedStructures: "Assigned Structures",
    alliancesAffected: "Alliances Affected",
    willRemainFree: "Will Remain Free",
    resetWarning: "⚠️ To confirm, type \"RESET\" below:",
    typeReset: "Type RESET",
    confirmReset: "CONFIRM RESET",
    resetCompleted: "Reset Completed",
    assignmentsRemoved: "assignments removed",
    undo: "Undo",
    undoNotAvailable: "❌ Undo not available",
    undoCompleted: "Undo completed",
    assignmentsRestored: "assignments restored",
    
    // =================================================================
    // SEZIONE: REPORT E ANALISI
    // =================================================================
    
    buffOptimizationReport: "Buff Optimization Report",
    totalAlliances: "Total alliances",
    alliancesWithIssues: "Alliances with issues",
    totalWastedBuffs: "Total wasted buffs",
    noConflictsDetected: "Perfect! No buff conflicts detected.",
    issuesByAlliance: "Issues by alliance",
    totalFacilities: "Total facilities",
    problems: "Issues",
    copies: "copies",
    wasted: "wasted",
    
    // =================================================================
    // SEZIONE: MESSAGGI DI SISTEMA
    // =================================================================
    
    appLoaded: "🎯 App loaded! {count} structures with official colors.",
    appReady: "🚀 App ready for use"
  },
  
  // ===================================================================
  // 🇪🇸 SPAGNOLO - MERCATO LATINO
  // ===================================================================
  // Lo spagnolo copre un vasto mercato di giocatori in America Latina e Spagna
  
  es: {
    // =================================================================
    // SEZIONE: INTERFACCIA PRINCIPALE
    // =================================================================
    
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestión profesional de alianzas con calibración de mapa",
    interactiveMap: "🗺️ Mapa Interactivo",
    legend: "Leyenda",
    legendTitle: "🎨 Leyenda Colores e Iconos Oficiales",
    
    // =================================================================
    // SEZIONE: GESTIONE ALLEANZE
    // =================================================================
    
    alliances: "Alianzas",
    assigned: "Asignadas",
    allianceManagement: "🏰 Gestión de Alianzas",
    allianceName: "Nombre de alianza...",
    addAlliance: "✨ Agregar Alianza",
    editAlliance: "Editar Alianza",
    allianceIcon: "Icono de alianza",
    optional: "opcional",
    currentIcon: "Icono actual",
    save: "Guardar",
    cancel: "Cancelar",
    allianceUpdated: "Alianza actualizada",
    allianceCreated: "Alianza creada",
    
    // =================================================================
    // SEZIONE: IMPORT/EXPORT E FILE
    // =================================================================
    
    exportCSV: "📊 Exportar CSV",
    exportPNG: "🖼️ Exportar PNG",
    importCSV: "📥 Importar CSV",
    csvExported: "📊 ¡CSV exportado con éxito!",
    pngExported: "PNG exportado",
    importSuccess: "Importación completada",
    exportError: "Error de exportación",
    importError: "Error al importar CSV",
    emptyCsv: "CSV vacío o inválido",
    pngExportNotAvailable: "Función de exportación PNG no disponible",
    
    // Gestione file avanzata
    processing: "Procesando...",
    processingImage: "Procesando imagen...",
    imageOptimized: "Imagen optimizada",
    iconAlreadyUsed: "Icono ya utilizado, generando automático...",
    formatNotSupported: "Formato no soportado. Usa JPG, PNG, GIF o WebP.",
    fileTooLarge: "Archivo demasiado grande. Máximo 2MB.",
    invalidExtension: "Extensión de archivo inválida.",
    imageProcessingFailed: "Error procesando imagen.",
    fileReadFailed: "Error leyendo archivo.",
    fileTooltip: "JPG, PNG, GIF, WebP - Máx 2MB",
    
    // Messaggi export PNG
    exportedOn: "Exportado el",
    free: "Libres",
    active: "Activas",
    preparingExport: "Preparando exportación...",
    renderingImage: "Renderizando imagen...",
    
    // =================================================================
    // SEZIONE: SISTEMA MULTILINGUA
    // =================================================================
    
    language: "🌐 Idioma",
    selectLanguage: "🌐 Seleccionar Idioma",
    languageSet: "🌐 ¡Idioma establecido!",
    
    // =================================================================
    // SEZIONE: COLORI E TIPI FACILITY
    // =================================================================
    
    colorCastle: "Castle (Oro)",
    colorConstruction: "Construction (Azul)",
    colorProduction: "Production (Verde)",
    colorDefense: "Defense (Verde Agua)",
    colorGathering: "Gathering (Púrpura)",
    colorTech: "Research/Tech (Naranja)",
    colorWeapons: "Troop Attack (Rojo)",
    colorTraining: "Training (Amarillo)",
    colorExpedition: "March/Expedition (Rosa)",
    colorStronghold: "Stronghold (Marrón)",
    colorFortress: "Fortress (Gris Oscuro)",
    
    // =================================================================
    // SEZIONE: RIEPILOGHI E STATISTICHE
    // =================================================================
    
    facilitySummary: "📋 Resumen de Instalaciones",
    buffSummary: "⚡ Resumen de Buff",
    noStructuresLoaded: "No hay estructuras cargadas",
    noAllianceAssigned: "No hay alianza asignada",
    noBuffRecognized: "No hay buff reconocido",
    structures: "estructuras",
    
    // =================================================================
    // SEZIONE: CALIBRAZIONE AVANZATA
    // =================================================================
    
    advancedCalibration: "🔧 Calibración Avanzada",
    calibrationUnlocked: "🔓 ¡Calibración desbloqueada!",
    wrongPassword: "❌ ¡Contraseña incorrecta!",
    
    // =================================================================
    // SEZIONE: ASSEGNAZIONI E DROPDOWN
    // =================================================================
    
    unassigned: "Sin asignar",
    assignedTo: "asignada a",
    removed: "removida",
    options: "opciones",
    scrollToSeeAll: "Desplázate para ver todas las alianzas",
    markersUpdated: "marcadores actualizados",
    
    // =================================================================
    // SEZIONE: VALIDAZIONE E MESSAGGI DI ERRORE
    // =================================================================
    
    addAtLeastOneAlliance: "⚠️ Agrega al menos una alianza antes de asignar.",
    enterAllianceName: "Ingresa un nombre de alianza",
    allianceExists: "La alianza ya existe",
    maxAlliances: "Máximo 50 alianzas",
    
    // =================================================================
    // SEZIONE: SISTEMA ANTI-DUPLICATI
    // =================================================================
    
    assignmentCancelled: "Asignación cancelada para evitar conflicto de buff",
    duplicateAssignmentConfirmed: "Buff duplicado asignado (no óptimo)",
    duplicateFacilityWarning: "¡ATENCIÓN: Buff Duplicado Detectado!",
    duplicateFacilityExplanation: "¡En Whiteout Survival los buffs NO se acumulan para instalaciones idénticas!",
    theoreticalBuff: "Buff teórico",
    actualBuff: "Buff REAL",
    wastedBuffs: "Buffs desperdiciados",
    buffCalculation: "Cálculo de Buff",
    betterStrategy: "MEJOR ESTRATEGIA",
    diversifyFacilities: "¡Diversifica los tipos de instalaciones para maximizar los buffs!",
    moreEffectiveAlternatives: "Alternativas más efectivas",
    noAlternativesAvailable: "No hay alternativas disponibles en este momento",
    continueAnyway: "¿Quieres continuar con esta asignación de todos modos?",
    notRecommended: "(No recomendado para optimización estratégica)",
    alreadyPresent: "Ya presentes",
    situation: "Situación",
    gameplayProblem: "PROBLEMA DE JUGABILIDAD",
    
    // =================================================================
    // SEZIONE: SISTEMA RESET CON UNDO
    // =================================================================
    
    resetAssignments: "Resetear Asignaciones",
    noAssignmentsToReset: "⚠️ No hay asignaciones que resetear",
    resetConfirmationTitle: "🗑️ Confirmar Reset Total",
    resetConfirmationMessage: "Esta acción eliminará TODAS las asignaciones de alianzas de las estructuras. Podrás deshacerlo por 10 segundos.",
    assignedStructures: "Estructuras Asignadas",
    alliancesAffected: "Alianzas Afectadas",
    willRemainFree: "Permanecerán Libres",
    resetWarning: "⚠️ Para confirmar, escribe \"RESET\" abajo:",
    typeReset: "Escribe RESET",
    confirmReset: "CONFIRMAR RESET",
    resetCompleted: "Reset Completado",
    assignmentsRemoved: "asignaciones eliminadas",
    undo: "Deshacer",
    undoNotAvailable: "❌ Deshacer no disponible",
    undoCompleted: "Deshacer completado",
    assignmentsRestored: "asignaciones restauradas",
    
    // =================================================================
    // SEZIONE: REPORT E ANALISI
    // =================================================================
    
    buffOptimizationReport: "Reporte de Optimización de Buff",
    totalAlliances: "Alianzas totales",
    alliancesWithIssues: "Alianzas con problemas",
    totalWastedBuffs: "Buffs desperdiciados totales",
    noConflictsDetected: "¡Perfecto! No se detectaron conflictos de buff.",
    issuesByAlliance: "Detalles de problemas por alianza",
    totalFacilities: "Instalaciones totales",
    problems: "Problemas",
    copies: "copias",
    wasted: "desperdiciadas",
    
    // =================================================================
    // SEZIONE: MESSAGGI DI SISTEMA
    // =================================================================
    
    appLoaded: "🎯 ¡App cargada! {count} estructuras con colores oficiales.",
    appReady: "🚀 App lista para usar"
  },
  
  // ===================================================================
  // 🇫🇷 FRANCESE - MERCATO EUROPEO
  // ===================================================================
  // Il francese copre Francia, Belgio, Svizzera francese, Canada francofono
  
  fr: {
    // =================================================================
    // SEZIONE: INTERFACCIA PRINCIPALE
    // =================================================================
    
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestion professionnelle d'alliances avec calibrage de carte",
    interactiveMap: "🗺️ Carte Interactive",
    legend: "Légende",
    legendTitle: "🎨 Légende Couleurs et Icônes Officielles",
    
    // =================================================================
    // SEZIONE: GESTIONE ALLEANZE
    // =================================================================
    
    alliances: "Alliances",
    assigned: "Assignées",
    allianceManagement: "🏰 Gestion des Alliances",
    allianceName: "Nom d'alliance...",
    addAlliance: "✨ Ajouter Alliance",
    editAlliance: "Modifier Alliance",
    allianceIcon: "Icône d'alliance",
    optional: "optionnel",
    currentIcon: "Icône actuelle",
    save: "Sauvegarder",
    cancel: "Annuler",
    allianceUpdated: "Alliance mise à jour",
    allianceCreated: "Alliance créée",
    
    // =================================================================
    // SEZIONE: IMPORT/EXPORT E FILE
    // =================================================================
    
    exportCSV: "📊 Exporter CSV",
    exportPNG: "🖼️ Exporter PNG",
    importCSV: "📥 Importer CSV",
    csvExported: "📊 CSV exporté avec succès !",
    pngExported: "PNG exporté",
    importSuccess: "Importation terminée",
    exportError: "Erreur d'export",
    importError: "Erreur lors de l'importation CSV",
    emptyCsv: "CSV vide ou invalide",
    pngExportNotAvailable: "Fonction d'export PNG non disponible",
    
    // Gestione file avanzata
    processing: "Traitement...",
    processingImage: "Traitement de l'image...",
    imageOptimized: "Image optimisée",
    iconAlreadyUsed: "Icône déjà utilisée, génération automatique...",
    formatNotSupported: "Format non supporté. Utilisez JPG, PNG, GIF ou WebP.",
    fileTooLarge: "Fichier trop volumineux. Maximum 2MB.",
    invalidExtension: "Extension de fichier invalide.",
    imageProcessingFailed: "Erreur de traitement de l'image.",
    fileReadFailed: "Erreur de lecture du fichier.",
    fileTooltip: "JPG, PNG, GIF, WebP - Max 2MB",
    
    // Messaggi export PNG
    exportedOn: "Exporté le",
    free: "Libres",
    active: "Actives",
    preparingExport: "Préparation de l'export...",
    renderingImage: "Rendu de l'image...",
    
    // =================================================================
    // SEZIONE: SISTEMA MULTILINGUA
    // =================================================================
    
    language: "🌐 Langue",
    selectLanguage: "🌐 Sélectionner la Langue",
    languageSet: "🌐 Langue définie !",
    
    // =================================================================
    // SEZIONE: COLORI E TIPI FACILITY
    // =================================================================
    
    colorCastle: "Castle (Or)",
    colorConstruction: "Construction (Bleu)",
    colorProduction: "Production (Vert)",
    colorDefense: "Defense (Vert d'Eau)",
    colorGathering: "Gathering (Violet)",
    colorTech: "Research/Tech (Orange)",
    colorWeapons: "Troop Attack (Rouge)",
    colorTraining: "Training (Jaune)",
    colorExpedition: "March/Expedition (Rose)",
    colorStronghold: "Stronghold (Marron)",
    colorFortress: "Fortress (Gris Foncé)",
    
    // =================================================================
    // SEZIONE: RIEPILOGHI E STATISTICHE
    // =================================================================
    
    facilitySummary: "📋 Résumé des Installations",
    buffSummary: "⚡ Résumé des Buff",
    noStructuresLoaded: "Aucune structure chargée",
    noAllianceAssigned: "Aucune alliance assignée",
    noBuffRecognized: "Aucun buff reconnu",
    structures: "structures",
    
    // =================================================================
    // SEZIONE: CALIBRAZIONE AVANZATA
    // =================================================================
    
    advancedCalibration: "🔧 Calibrage Avancé",
    calibrationUnlocked: "🔓 Calibrage débloqué !",
    wrongPassword: "❌ Mot de passe incorrect !",
    
    // =================================================================
    // SEZIONE: ASSEGNAZIONI E DROPDOWN
    // =================================================================
    
    unassigned: "Non assignée",
    assignedTo: "assignée à",
    removed: "supprimée",
    options: "options",
    scrollToSeeAll: "Faire défiler pour voir toutes les alliances",
    markersUpdated: "marqueurs mis à jour",
    
    // =================================================================
    // SEZIONE: VALIDAZIONE E MESSAGGI DI ERRORE
    // =================================================================
    
    addAtLeastOneAlliance: "⚠️ Ajoutez au moins une alliance avant d'assigner.",
    enterAllianceName: "Entrez un nom d'alliance",
    allianceExists: "L'alliance existe déjà",
    maxAlliances: "Maximum 50 alliances",
    
    // =================================================================
    // SEZIONE: SISTEMA ANTI-DUPLICATI
    // =================================================================
    
    assignmentCancelled: "Assignation annulée pour éviter un conflit de buff",
    duplicateAssignmentConfirmed: "Buff dupliqué assigné (non optimal)",
    duplicateFacilityWarning: "ATTENTION: Buff Dupliqué Détecté!",
    duplicateFacilityExplanation: "Dans Whiteout Survival les buffs ne se cumulent PAS pour des installations identiques!",
    theoreticalBuff: "Buff théorique",
    actualBuff: "Buff RÉEL",
    wastedBuffs: "Buffs gaspillés",
    buffCalculation: "Calcul de Buff",
    betterStrategy: "MEILLEURE STRATÉGIE",
    diversifyFacilities: "Diversifiez les types d'installations pour maximiser les buffs!",
    moreEffectiveAlternatives: "Alternatives plus efficaces",
    noAlternativesAvailable: "Aucune alternative disponible pour le moment",
    continueAnyway: "Voulez-vous continuer cette assignation quand même?",
    notRecommended: "(Non recommandé pour l'optimisation stratégique)",
    alreadyPresent: "Déjà présentes",
    situation: "Situation",
    gameplayProblem: "PROBLÈME DE GAMEPLAY",
    
    // =================================================================
    // SEZIONE: SISTEMA RESET CON UNDO
    // =================================================================
    
    resetAssignments: "Reset Assignations",
    noAssignmentsToReset: "⚠️ Aucune assignation à remettre à zéro",
    resetConfirmationTitle: "🗑️ Confirmer Reset Total",
    resetConfirmationMessage: "Cette action supprimera TOUTES les assignations d'alliances des structures. Vous pouvez annuler pendant 10 secondes.",
    assignedStructures: "Structures Assignées",
    alliancesAffected: "Alliances Affectées",
    willRemainFree: "Resteront Libres",
    resetWarning: "⚠️ Pour confirmer, tapez \"RESET\" ci-dessous:",
    typeReset: "Tapez RESET",
    confirmReset: "CONFIRMER RESET",
    resetCompleted: "Reset Terminé",
    assignmentsRemoved: "assignations supprimées",
    undo: "Annuler",
    undoNotAvailable: "❌ Annulation non disponible",
    undoCompleted: "Annulation terminée",
    assignmentsRestored: "assignations restaurées",
    
    // =================================================================
    // SEZIONE: REPORT E ANALISI
    // =================================================================
    
    buffOptimizationReport: "Rapport d'Optimisation des Buffs",
    totalAlliances: "Alliances totales",
    alliancesWithIssues: "Alliances avec problèmes",
    totalWastedBuffs: "Buffs gaspillés totaux",
    noConflictsDetected: "Parfait! Aucun conflit de buff détecté.",
    issuesByAlliance: "Détails des problèmes par alliance",
    totalFacilities: "Installations totales",
    problems: "Problèmes",
    copies: "copies",
    wasted: "gaspillées",
    
    // =================================================================
    // SEZIONE: MESSAGGI DI SISTEMA
    // =================================================================
    
    appLoaded: "🎯 App chargée ! {count} structures avec couleurs officielles.",
    appReady: "🚀 App prête à utiliser"
  },
  
  // ===================================================================
  // 🇩🇪 TEDESCO - MERCATO EUROPA CENTRALE
  // ===================================================================
  // Il tedesco copre Germania, Austria, Svizzera tedesca
  
  de: {
    // =================================================================
    // SEZIONE: INTERFACCIA PRINCIPALE
    // =================================================================
    
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Professionelle Allianz-Verwaltung mit Kartenkalibrierung",
    interactiveMap: "🗺️ Interaktive Karte",
    legend: "Legende",
    legendTitle: "🎨 Offizielle Farben und Symbole Legende",
    
    // =================================================================
    // SEZIONE: GESTIONE ALLEANZE
    // =================================================================
    
    alliances: "Allianzen",
    assigned: "Zugewiesen",
    allianceManagement: "🏰 Allianz-Verwaltung",
    allianceName: "Allianzname...",
    addAlliance: "✨ Allianz Hinzufügen",
    editAlliance: "Allianz Bearbeiten",
    allianceIcon: "Allianz-Symbol",
    optional: "optional",
    currentIcon: "Aktuelles Symbol",
    save: "Speichern",
    cancel: "Abbrechen",
    allianceUpdated: "Allianz aktualisiert",
    allianceCreated: "Allianz erstellt",
    
    // =================================================================
    // SEZIONE: IMPORT/EXPORT E FILE
    // =================================================================
    
    exportCSV: "📊 CSV Exportieren",
    exportPNG: "🖼️ PNG Exportieren",
    importCSV: "📥 CSV Importieren",
    csvExported: "📊 CSV erfolgreich exportiert!",
    pngExported: "PNG exportiert",
    importSuccess: "Import abgeschlossen",
    exportError: "Export-Fehler",
    importError: "Fehler beim CSV-Import",
    emptyCsv: "Leere oder ungültige CSV",
    pngExportNotAvailable: "PNG-Export-Funktion nicht verfügbar",
    
    // Gestione file avanzata
    processing: "Verarbeitung...",
    processingImage: "Bild verarbeiten...",
    imageOptimized: "Bild optimiert",
    iconAlreadyUsed: "Symbol bereits verwendet, automatische Generierung...",
    formatNotSupported: "Format nicht unterstützt. Verwenden Sie JPG, PNG, GIF oder WebP.",
    fileTooLarge: "Datei zu groß. Maximum 2MB.",
    invalidExtension: "Ungültige Dateierweiterung.",
    imageProcessingFailed: "Fehler bei der Bildverarbeitung.",
    fileReadFailed: "Fehler beim Lesen der Datei.",
    fileTooltip: "JPG, PNG, GIF, WebP - Max 2MB",
    
    // Messaggi export PNG
    exportedOn: "Exportiert am",
    free: "Frei",
    active: "Aktiv",
    preparingExport: "Export vorbereiten...",
    renderingImage: "Bild rendern...",
    
    // =================================================================
    // SEZIONE: SISTEMA MULTILINGUA
    // =================================================================
    
    language: "🌐 Sprache",
    selectLanguage: "🌐 Sprache Auswählen",
    languageSet: "🌐 Sprache eingestellt!",
    
    // =================================================================
    // SEZIONE: COLORI E TIPI FACILITY
    // =================================================================
    
    colorCastle: "Castle (Gold)",
    colorConstruction: "Construction (Blau)",
    colorProduction: "Production (Grün)",
    colorDefense: "Defense (Türkis)",
    colorGathering: "Gathering (Lila)",
    colorTech: "Research/Tech (Orange)",
    colorWeapons: "Troop Attack (Rot)",
    colorTraining: "Training (Gelb)",
    colorExpedition: "March/Expedition (Rosa)",
    colorStronghold: "Stronghold (Braun)",
    colorFortress: "Fortress (Dunkelgrau)",
    
    // =================================================================
    // SEZIONE: RIEPILOGHI E STATISTICHE
    // =================================================================
    
    facilitySummary: "📋 Anlagen-Zusammenfassung",
    buffSummary: "⚡ Buff-Zusammenfassung",
    noStructuresLoaded: "Keine Strukturen geladen",
    noAllianceAssigned: "Keine Allianz zugewiesen",
    noBuffRecognized: "Kein Buff erkannt",
    structures: "Strukturen",
    
    // =================================================================
    // SEZIONE: CALIBRAZIONE AVANZATA
    // =================================================================
    
    advancedCalibration: "🔧 Erweiterte Kalibrierung",
    calibrationUnlocked: "🔓 Kalibrierung freigeschaltet!",
    wrongPassword: "❌ Falsches Passwort!",
    
    // =================================================================
    // SEZIONE: ASSEGNAZIONI E DROPDOWN
    // =================================================================
    
    unassigned: "Nicht zugewiesen",
    assignedTo: "zugewiesen an",
    removed: "entfernt",
    options: "Optionen",
    scrollToSeeAll: "Scrollen Sie, um alle Allianzen zu sehen",
    markersUpdated: "Markierungen aktualisiert",
    
    // =================================================================
    // SEZIONE: VALIDAZIONE E MESSAGGI DI ERRORE
    // =================================================================
    
    addAtLeastOneAlliance: "⚠️ Fügen Sie mindestens eine Allianz hinzu, bevor Sie zuweisen.",
    enterAllianceName: "Geben Sie einen Allianznamen ein",
    allianceExists: "Allianz existiert bereits",
    maxAlliances: "Maximal 50 Allianzen",
    
    // =================================================================
    // SEZIONE: SISTEMA ANTI-DUPLICATI
    // =================================================================
    
    assignmentCancelled: "Zuordnung abgebrochen um Buff-Konflikt zu vermeiden",
    duplicateAssignmentConfirmed: "Doppelter Buff zugeordnet (nicht optimal)",
    duplicateFacilityWarning: "WARNUNG: Doppelter Buff Erkannt!",
    duplicateFacilityExplanation: "In Whiteout Survival stapeln sich Buffs NICHT für identische Anlagen!",
    theoreticalBuff: "Theoretischer Buff",
    actualBuff: "ECHTER Buff",
    wastedBuffs: "Verschwendete Buffs",
    buffCalculation: "Buff-Berechnung",
    betterStrategy: "BESSERE STRATEGIE",
    diversifyFacilities: "Diversifizieren Sie Anlagentypen um Buffs zu maximieren!",
    moreEffectiveAlternatives: "Effektivere Alternativen",
    noAlternativesAvailable: "Momentan keine Alternativen verfügbar",
    continueAnyway: "Möchten Sie trotzdem mit dieser Zuordnung fortfahren?",
    notRecommended: "(Nicht empfohlen für strategische Optimierung)",
    alreadyPresent: "Bereits vorhanden",
    situation: "Situation",
    gameplayProblem: "GAMEPLAY-PROBLEM",
    
    // =================================================================
    // SEZIONE: SISTEMA RESET CON UNDO
    // =================================================================
    
    resetAssignments: "Zuweisungen Zurücksetzen",
    noAssignmentsToReset: "⚠️ Keine Zuweisungen zum Zurücksetzen",
    resetConfirmationTitle: "🗑️ Totalen Reset Bestätigen",
    resetConfirmationMessage: "Diese Aktion wird ALLE Allianzzuweisungen von Strukturen entfernen. Sie können 10 Sekunden lang rückgängig machen.",
    assignedStructures: "Zugewiesene Strukturen",
    alliancesAffected: "Betroffene Allianzen",
    willRemainFree: "Bleiben Frei",
    resetWarning: "⚠️ Zur Bestätigung geben Sie \"RESET\" unten ein:",
    typeReset: "RESET eingeben",
    confirmReset: "RESET BESTÄTIGEN",
    resetCompleted: "Reset Abgeschlossen",
    assignmentsRemoved: "Zuweisungen entfernt",
    undo: "Rückgängig",
    undoNotAvailable: "❌ Rückgängig nicht verfügbar",
    undoCompleted: "Rückgängig abgeschlossen",
    assignmentsRestored: "Zuweisungen wiederhergestellt",
    
    // =================================================================
    // SEZIONE: REPORT E ANALISI
    // =================================================================
    
    buffOptimizationReport: "Buff-Optimierungs-Bericht",
    totalAlliances: "Allianzen gesamt",
    alliancesWithIssues: "Allianzen mit Problemen",
    totalWastedBuffs: "Verschwendete Buffs gesamt",
    noConflictsDetected: "Perfekt! Keine Buff-Konflikte erkannt.",
    issuesByAlliance: "Probleme nach Allianz",
    totalFacilities: "Anlagen gesamt",
    problems: "Probleme",
    copies: "Kopien",
    wasted: "verschwendet",
    
    // =================================================================
    // SEZIONE: MESSAGGI DI SISTEMA
    // =================================================================
    
    appLoaded: "🎯 App geladen! {count} Strukturen mit offiziellen Farben.",
    appReady: "🚀 App bereit für den Einsatz"
  },
  
  // ===================================================================
  // 🇵🇹 PORTOGHESE - MERCATO BRASILIANO/PORTOGHESE
  // ===================================================================
  // Il portoghese copre Brasile (mercato enorme) e Portogallo
  
  pt: {
    // =================================================================
    // SEZIONE: INTERFACCIA PRINCIPALE
    // =================================================================
    
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestão profissional de alianças com calibração de mapa",
    interactiveMap: "🗺️ Mapa Interativo",
    legend: "Legenda",
    legendTitle: "🎨 Legenda Cores e Ícones Oficiais",
    
    // =================================================================
    // SEZIONE: GESTIONE ALLEANZE
    // =================================================================
    
    alliances: "Alianças",
    assigned: "Atribuídas",
    allianceManagement: "🏰 Gestão de Alianças",
    allianceName: "Nome da aliança...",
    addAlliance: "✨ Adicionar Aliança",
    editAlliance: "Editar Aliança",
    allianceIcon: "Ícone da aliança",
    optional: "opcional",
    currentIcon: "Ícone atual",
    save: "Salvar",
    cancel: "Cancelar",
    allianceUpdated: "Aliança atualizada",
    allianceCreated: "Aliança criada",
    
    // =================================================================
    // SEZIONE: IMPORT/EXPORT E FILE
    // =================================================================
    
    exportCSV: "📊 Exportar CSV",
    exportPNG: "🖼️ Exportar PNG",
    importCSV: "📥 Importar CSV",
    csvExported: "📊 CSV exportado com sucesso!",
    pngExported: "PNG exportado",
    importSuccess: "Importação concluída",
    exportError: "Erro de exportação",
    importError: "Erro ao importar CSV",
    emptyCsv: "CSV vazio ou inválido",
    pngExportNotAvailable: "Função de exportação PNG não disponível",
    
    // Gestione file avanzata
    processing: "Processando...",
    processingImage: "Processando imagem...",
    imageOptimized: "Imagem otimizada",
    iconAlreadyUsed: "Ícone já utilizado, gerando automático...",
    formatNotSupported: "Formato não suportado. Use JPG, PNG, GIF ou WebP.",
    fileTooLarge: "Arquivo muito grande. Máximo 2MB.",
    invalidExtension: "Extensão de arquivo inválida.",
    imageProcessingFailed: "Erro processando imagem.",
    fileReadFailed: "Erro lendo arquivo.",
    fileTooltip: "JPG, PNG, GIF, WebP - Máx 2MB",
    
    // Messaggi export PNG
    exportedOn: "Exportado em",
    free: "Livres",
    active: "Ativas",
    preparingExport: "Preparando exportação...",
    renderingImage: "Renderizando imagem...",
    
    // =================================================================
    // SEZIONE: SISTEMA MULTILINGUA
    // =================================================================
    
    language: "🌐 Idioma",
    selectLanguage: "🌐 Selecionar Idioma",
    languageSet: "🌐 Idioma definido!",
    
    // =================================================================
    // SEZIONE: COLORI E TIPI FACILITY
    // =================================================================
    
    colorCastle: "Castle (Ouro)",
    colorConstruction: "Construction (Azul)",
    colorProduction: "Production (Verde)",
    colorDefense: "Defense (Verde Água)",
    colorGathering: "Gathering (Roxo)",
    colorTech: "Research/Tech (Laranja)",
    colorWeapons: "Troop Attack (Vermelho)",
    colorTraining: "Training (Amarelo)",
    colorExpedition: "March/Expedition (Rosa)",
    colorStronghold: "Stronghold (Marrom)",
    colorFortress: "Fortress (Cinza Escuro)",
    
    // =================================================================
    // SEZIONE: RIEPILOGHI E STATISTICHE
    // =================================================================
    
    facilitySummary: "📋 Resumo de Instalações",
    buffSummary: "⚡ Resumo de Buff",
    noStructuresLoaded: "Nenhuma estrutura carregada",
    noAllianceAssigned: "Nenhuma aliança atribuída",
    noBuffRecognized: "Nenhum buff reconhecido",
    structures: "estruturas",
    
    // =================================================================
    // SEZIONE: CALIBRAZIONE AVANZATA
    // =================================================================
    
    advancedCalibration: "🔧 Calibração Avançada",
    calibrationUnlocked: "🔓 Calibração desbloqueada!",
    wrongPassword: "❌ Senha incorreta!",
    
    // =================================================================
    // SEZIONE: ASSEGNAZIONI E DROPDOWN
    // =================================================================
    
    unassigned: "Não atribuída",
    assignedTo: "atribuída a",
    removed: "removida",
    options: "opções",
    scrollToSeeAll: "Role para ver todas as alianças",
    markersUpdated: "marcadores atualizados",
    
    // =================================================================
    // SEZIONE: VALIDAZIONE E MESSAGGI DI ERRORE
    // =================================================================
    
    addAtLeastOneAlliance: "⚠️ Adicione pelo menos uma aliança antes de atribuir.",
    enterAllianceName: "Digite um nome de aliança",
    allianceExists: "Aliança já existe",
    maxAlliances: "Máximo 50 alianças",
    
    // =================================================================
    // SEZIONE: SISTEMA ANTI-DUPLICATI
    // =================================================================
    
    assignmentCancelled: "Atribuição cancelada para evitar conflito de buff",
    duplicateAssignmentConfirmed: "Buff duplicado atribuído (não ideal)",
    duplicateFacilityWarning: "ATENÇÃO: Buff Duplicado Detectado!",
    duplicateFacilityExplanation: "No Whiteout Survival os buffs NÃO se acumulam para instalações idênticas!",
    theoreticalBuff: "Buff teórico",
    actualBuff: "Buff REAL",
    wastedBuffs: "Buffs desperdiçados",
    buffCalculation: "Cálculo de Buff",
    betterStrategy: "MELHOR ESTRATÉGIA",
    diversifyFacilities: "Diversifique os tipos de instalações para maximizar buffs!",
    moreEffectiveAlternatives: "Alternativas mais eficazes",
    noAlternativesAvailable: "Nenhuma alternativa disponível no momento",
    continueAnyway: "Quer continuar com esta atribuição mesmo assim?",
    notRecommended: "(Não recomendado para otimização estratégica)",
    alreadyPresent: "Já presentes",
    situation: "Situação",
    gameplayProblem: "PROBLEMA DE GAMEPLAY",
    
    // =================================================================
    // SEZIONE: SISTEMA RESET CON UNDO
    // =================================================================
    
    resetAssignments: "Resetar Atribuições",
    noAssignmentsToReset: "⚠️ Nenhuma atribuição para resetar",
    resetConfirmationTitle: "🗑️ Confirmar Reset Total",
    resetConfirmationMessage: "Esta ação removerá TODAS as atribuições de alianças das estruturas. Você pode desfazer por 10 segundos.",
    assignedStructures: "Estruturas Atribuídas",
    alliancesAffected: "Alianças Afetadas",
    willRemainFree: "Permanecerão Livres",
    resetWarning: "⚠️ Para confirmar, digite \"RESET\" abaixo:",
    typeReset: "Digite RESET",
    confirmReset: "CONFIRMAR RESET",
    resetCompleted: "Reset Concluído",
    assignmentsRemoved: "atribuições removidas",
    undo: "Desfazer",
    undoNotAvailable: "❌ Desfazer não disponível",
    undoCompleted: "Desfazer concluído",
    assignmentsRestored: "atribuições restauradas",
    
    // =================================================================
    // SEZIONE: REPORT E ANALISI
    // =================================================================
    
    buffOptimizationReport: "Relatório de Otimização de Buff",
    totalAlliances: "Alianças totais",
    alliancesWithIssues: "Alianças com problemas",
    totalWastedBuffs: "Buffs desperdiçados totais",
    noConflictsDetected: "Perfeito! Nenhum conflito de buff detectado.",
    issuesByAlliance: "Detalhes de problemas por aliança",
    totalFacilities: "Instalações totais",
    problems: "Problemas",
    copies: "cópias",
    wasted: "desperdiçadas",
    
    // =================================================================
    // SEZIONE: MESSAGGI DI SISTEMA
    // =================================================================
    
    appLoaded: "🎯 App carregado! {count} estruturas com cores oficiais.",
    appReady: "🚀 App pronto para usar"
  }
  
  // ===================================================================
  // FINE DEFINIZIONE TRADUZIONI
  // ===================================================================
};

// =====================================================================
// FUNZIONI DI UTILITÀ PER IL SISTEMA TRADUZIONI
// =====================================================================

/**
 * Verifica la completezza delle traduzioni per tutte le lingue
 * Questa funzione aiuta a identificare traduzioni mancanti durante lo sviluppo
 * 
 * @returns {Object} Report sulla completezza delle traduzioni
 */
function validateTranslationsCompleteness() {
  const languages = Object.keys(translations);
  const referenceLanguage = 'en'; // Inglese come riferimento
  const referenceKeys = new Set(Object.keys(translations[referenceLanguage]));
  
  const report = {
    totalLanguages: languages.length,
    referenceKeyCount: referenceKeys.size,
    languageReports: {},
    missingKeys: {},
    extraKeys: {}
  };
  
  languages.forEach(lang => {
    const langKeys = new Set(Object.keys(translations[lang]));
    const missing = [...referenceKeys].filter(key => !langKeys.has(key));
    const extra = [...langKeys].filter(key => !referenceKeys.has(key));
    
    report.languageReports[lang] = {
      totalKeys: langKeys.size,
      missingCount: missing.length,
      extraCount: extra.length,
      completeness: Math.round(((langKeys.size - missing.length) / referenceKeys.size) * 100)
    };
    
    if (missing.length > 0) report.missingKeys[lang] = missing;
    if (extra.length > 0) report.extraKeys[lang] = extra;
  });
  
  return report;
}

/**
 * Funzione di debug per verificare la qualità delle traduzioni
 * Accessibile dalla console per troubleshooting
 */
window.debugTranslations = function() {
  const report = validateTranslationsCompleteness();
  
  console.log('🌐 === REPORT TRADUZIONI ===');
  console.log(`📊 Lingue supportate: ${report.totalLanguages}`);
  console.log(`🔑 Chiavi di riferimento (EN): ${report.referenceKeyCount}`);
  console.log('');
  
  Object.entries(report.languageReports).forEach(([lang, data]) => {
    const flag = {
      'it': '🇮🇹', 'en': '🇺🇸', 'es': '🇪🇸', 
      'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇵🇹'
    }[lang] || '🏳️';
    
    console.log(`${flag} ${lang.toUpperCase()}:`);
    console.log(`  • Completezza: ${data.completeness}%`);
    console.log(`  • Chiavi totali: ${data.totalKeys}`);
    console.log(`  • Chiavi mancanti: ${data.missingCount}`);
    console.log(`  • Chiavi extra: ${data.extraCount}`);
    
    if (report.missingKeys[lang]) {
      console.log(`  • Mancanti: ${report.missingKeys[lang].slice(0, 3).join(', ')}${report.missingKeys[lang].length > 3 ? '...' : ''}`);
    }
    console.log('');
  });
  
  console.log('=== FINE REPORT ===');
  return report;
};

// =====================================================================
// INIZIALIZZAZIONE E LOG
// =====================================================================

// Verifica di integrità al caricamento
const integrityCheck = validateTranslationsCompleteness();
const hasIssues = Object.values(integrityCheck.languageReports).some(report => report.completeness < 100);

if (hasIssues) {
  console.warn('⚠️ Alcune traduzioni potrebbero essere incomplete. Usa debugTranslations() per dettagli.');
} else {
  console.log('✅ Tutte le traduzioni sono complete e integrate correttamente.');
}

console.log(`🌐 Sistema traduzioni caricato: ${integrityCheck.totalLanguages} lingue, ${integrityCheck.referenceKeyCount} chiavi per lingua`);

// =====================================================================
// ESPORTAZIONE
// =====================================================================

// Esporta per compatibilità con sistemi esterni
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}