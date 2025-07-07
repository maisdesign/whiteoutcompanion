// =====================================================================
// TRANSLATIONS.JS - COMPLETE MULTILINGUAL SYSTEM
// =====================================================================
// Translation system for Whiteout Survival Companion: 6 core languages
// All strings are properly translated and validated
// 
// UPDATED VERSION with all missing keys added and structure optimized

console.log('🌐 Loading complete translation system...');

// =====================================================================
// SUPPORTED LANGUAGES CONFIGURATION
// =====================================================================

const SUPPORTED_LANGUAGES = ['en', 'it', 'es', 'fr', 'de', 'pt'];

function getLanguageDisplayName(languageCode) {
  const names = {
    'en': 'English',
    'it': 'Italiano', 
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'pt': 'Português'
  };
  return names[languageCode] || languageCode.toUpperCase();
}

// =====================================================================
// COMPLETE TRANSLATIONS - ALL KEYS INCLUDED
// =====================================================================

const translations = {
  
  // =================================================================
  // 🇺🇸 ENGLISH (Reference Language)
  // =================================================================
  
  en: {
    // Main Interface
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Professional alliance management with map calibration",
    interactiveMap: "🗺️ Interactive Map",
    legend: "Legend",
    legendTitle: "🎨 Official Colors and Icons Legend",
    
    // Alliance Management
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
    
    // Import/Export
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
    exportedOn: "Exported on",
    free: "Free",
    active: "Active",
    preparingExport: "Preparing export...",
    renderingImage: "Rendering image...",
    
    // Language System
    language: "🌐 Language",
    selectLanguage: "🌐 Select Language",
    languageSet: "🌐 Language set!",
    
    // Facility Colors
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
    
    // Summaries
    facilitySummary: "📋 Facility Summary",
    buffSummary: "⚡ Buff Summary",
    noStructuresLoaded: "No structures loaded",
    noAllianceAssigned: "No alliance assigned",
    noBuffRecognized: "No buff recognized",
    structures: "structures",
    
    // Calibration
    advancedCalibration: "🔧 Advanced Calibration",
    calibrationUnlocked: "🔓 Calibration unlocked!",
    wrongPassword: "❌ Wrong password!",
    
    // Assignments
    unassigned: "Unassigned",
    assignedTo: "assigned to",
    removed: "removed",
    options: "options",
    scrollToSeeAll: "Scroll to see all alliances",
    markersUpdated: "markers updated",
    
    // Validation
    addAtLeastOneAlliance: "⚠️ Add at least one alliance before assigning.",
    enterAllianceName: "Enter an alliance name",
    allianceExists: "Alliance already exists",
    maxAlliances: "Maximum 50 alliances",
    
    // Anti-Duplicate System
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
    
    // Reset System with Undo
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
    
    // Reports and Analysis
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
    
    // Fixed Bar Controls
    noChange: "No Change",
    facilityType: "Type",
    facilityLevel: "Level",
    selectFacility: "Select a facility",
    close: "Close",
    chooseDifferent: "Choose Different",
    confirmAnyway: "Confirm Anyway",
    remove: "Remove",
    assign: "Assign",
    
    // System Messages
    unknownBuff: "Unknown buff",
    betterAlternatives: "Better alternatives",
    showMore: "Show more",
    showLess: "Show less",
    errorOccurred: "An error occurred",
    tryAgain: "Try again",
    loading: "Loading...",
    saving: "Saving...",
    saved: "Saved",
    fieldRequired: "Required field",
    invalidInput: "Invalid input",
    
    // System Status Messages
    appLoaded: "🎯 App loaded! {count} structures with official colors.",
    appReady: "🚀 App ready for use",
    
    // Chief Charms Calculator
    chiefsCharmsCalculator: "Chief Charms Calculator",
    startLevel: "Start Level:",
    endLevel: "End Level:",
    calculate: "Calculate",
    total: "Total",
    charmGuides: "Charm Guides",
    charmDesigns: "Charm Designs",
    jewelSecrets: "Jewel Secrets",
    levelAbbr: "Lv",
    headgear: "Headgear",
    armor: "Armor",
    belt: "Belt",
    watch: "Watch",
    pants: "Pants",
    gloves: "Gloves",
    
    // Terms Page
    termsTitle: "Terms of Use",
    termsIntro: "By accessing and using Whiteout Companion, you agree to the following terms and conditions.",
    termsSection1: "1. Use of the Website",
    termsSection1Text: "You may use the site solely for personal and non-commercial purposes. Copying, reproducing or scraping any part of this site without permission is prohibited.",
    termsSection2: "2. Intellectual Property",
    termsSection2Text: "All content, tools and designs are property of Whiteout Companion, unless otherwise noted. Game assets are property of the original game developer.",
    termsSection3: "3. Limitation of Liability",
    termsSection3Text: "Whiteout Companion is offered as-is. We are not responsible for any damages, losses or inaccuracies that may occur from using this site or its data.",
    termsSection4: "4. Account & Data",
    termsSection4Text: "We do not require user accounts. You are responsible for any data you submit via forms or external integrations (e.g., CSV upload).",
    termsSection5: "5. Modifications",
    termsSection5Text: "We reserve the right to modify these terms at any time. Changes will be posted on this page.",
    termsLastUpdated: "Last updated: July 5, 2025"
  },
  
  // =================================================================
  // 🇮🇹 ITALIAN
  // =================================================================
  
  it: {
    // Main Interface
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestione professionale alleanze con calibrazione mappa",
    interactiveMap: "🗺️ Mappa Interattiva",
    legend: "Legenda",
    legendTitle: "🎨 Legenda Colori e Icone Ufficiali",
    
    // Alliance Management
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
    
    // Import/Export
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
    exportedOn: "Esportato il",
    free: "Libere",
    active: "Attive",
    preparingExport: "Preparazione export...",
    renderingImage: "Rendering immagine...",
    
    // Language System
    language: "🌐 Lingua",
    selectLanguage: "🌐 Seleziona Lingua",
    languageSet: "🌐 Lingua impostata!",
    
    // Facility Colors
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
    
    // Summaries
    facilitySummary: "📋 Riepilogo Strutture",
    buffSummary: "⚡ Riepilogo Buff",
    noStructuresLoaded: "Nessuna struttura caricata",
    noAllianceAssigned: "Nessuna alleanza assegnata",
    noBuffRecognized: "Nessun buff riconosciuto",
    structures: "strutture",
    
    // Calibration
    advancedCalibration: "🔧 Calibrazione Avanzata",
    calibrationUnlocked: "🔓 Calibrazione sbloccata!",
    wrongPassword: "❌ Password errata!",
    
    // Assignments
    unassigned: "Non assegnata",
    assignedTo: "assegnata a",
    removed: "rimossa",
    options: "opzioni",
    scrollToSeeAll: "Scrolla per vedere tutte le alleanze",
    markersUpdated: "marker aggiornati",
    
    // Validation
    addAtLeastOneAlliance: "⚠️ Aggiungi almeno un'alleanza prima di assegnare.",
    enterAllianceName: "Inserisci un nome per l'alleanza",
    allianceExists: "Alleanza già esistente",
    maxAlliances: "Massimo 50 alleanze",
    
    // Anti-Duplicate System
    assignmentCancelled: "Assegnazione annullata per evitare conflitto buff",
    duplicateAssignmentConfirmed: "Buff duplicato assegnato (non ottimale)",
    duplicateFacilityWarning: "ATTENZIONE: Buff Duplicato Rilevato!",
    duplicateFacilityExplanation: "In Whiteout Survival i buff NON si sommano per facility identiche!",
    theoreticalBuff: "Buff teorico",
    actualBuff: "Buff REALE",
    wastedBuffs: "Buff sprecati",
    buffCalculation: "Calcolo Buff",
    betterStrategy: "STRATEGIA MIGLIORE",
    diversifyFacilities: "Diversifica i tipi di facility per massimizzare i buff!",
    moreEffectiveAlternatives: "Alternative più efficaci",
    noAlternativesAvailable: "Nessuna alternativa disponibile al momento",
    continueAnyway: "Vuoi continuare comunque con questa assegnazione?",
    notRecommended: "(Non raccomandata per ottimizzazione strategica)",
    alreadyPresent: "Già presenti",
    situation: "Situazione",
    gameplayProblem: "PROBLEMA DEL GAMEPLAY",
    
    // Reset System with Undo
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
    
    // Reports and Analysis
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
    
    // Fixed Bar Controls
    noChange: "Nessun Cambio",
    facilityType: "Tipo",
    facilityLevel: "Livello",
    selectFacility: "Seleziona una facility",
    close: "Chiudi",
    chooseDifferent: "Scegli Diversa",
    confirmAnyway: "Conferma Comunque",
    remove: "Rimuovi",
    assign: "Assegna",
    
    // System Messages
    unknownBuff: "Buff sconosciuto",
    betterAlternatives: "Alternative migliori",
    showMore: "Mostra altro",
    showLess: "Mostra meno",
    errorOccurred: "Si è verificato un errore",
    tryAgain: "Riprova",
    loading: "Caricamento...",
    saving: "Salvataggio...",
    saved: "Salvato",
    fieldRequired: "Campo obbligatorio",
    invalidInput: "Input non valido",
    
    // System Status Messages
    appLoaded: "🎯 App caricata! {count} strutture con colori ufficiali.",
    appReady: "🚀 App pronta per l'uso",
    
    // Chief Charms Calculator
    chiefsCharmsCalculator: "Calcolatore Potenziamento Charm",
    startLevel: "Livello Iniziale:",
    endLevel: "Livello Finale:",
    calculate: "Calcola",
    total: "Totale",
    charmGuides: "Guide Charm",
    charmDesigns: "Progetti Charm",
    jewelSecrets: "Segreti Charm",
    levelAbbr: "Lv",
    headgear: "Cappello",
    armor: "Armatura",
    belt: "Cintura",
    watch: "Orologio",
    pants: "Pantaloni",
    gloves: "Guanti",
    
    // Terms Page
    termsTitle: "Termini d'Uso",
    termsIntro: "Accedendo e utilizzando Whiteout Companion, accetti i seguenti termini e condizioni.",
    termsSection1: "1. Uso del Sito",
    termsSection1Text: "Puoi usare il sito solo per scopi personali e non commerciali. È vietata la copia, riproduzione o scraping senza autorizzazione.",
    termsSection2: "2. Proprietà Intellettuale",
    termsSection2Text: "Tutti i contenuti, strumenti e design sono proprietà di Whiteout Companion, salvo diversamente indicato. Le risorse di gioco appartengono agli sviluppatori originali.",
    termsSection3: "3. Limitazione di Responsabilità",
    termsSection3Text: "Whiteout Companion è fornito così com'è. Non siamo responsabili per eventuali danni, perdite o inesattezze derivanti dall'uso del sito o dei suoi dati.",
    termsSection4: "4. Account e Dati",
    termsSection4Text: "Non è richiesto alcun account. Sei responsabile dei dati inseriti tramite form o integrazioni (es. upload CSV).",
    termsSection5: "5. Modifiche",
    termsSection5Text: "Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.",
    termsLastUpdated: "Ultimo aggiornamento: 5 luglio 2025"
  },
  
  // =================================================================
  // 🇪🇸 SPANISH
  // =================================================================
  
  es: {
    // Main Interface
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestión profesional de alianzas con calibración de mapa",
    interactiveMap: "🗺️ Mapa Interactivo",
    legend: "Leyenda",
    legendTitle: "🎨 Leyenda Colores e Iconos Oficiales",
    
    // Alliance Management
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
    
    // Import/Export
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
    exportedOn: "Exportado el",
    free: "Libres",
    active: "Activas",
    preparingExport: "Preparando exportación...",
    renderingImage: "Renderizando imagen...",
    
    // Language System
    language: "🌐 Idioma",
    selectLanguage: "🌐 Seleccionar Idioma",
    languageSet: "🌐 ¡Idioma establecido!",
    
    // Facility Colors
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
    
    // Summaries
    facilitySummary: "📋 Resumen de Instalaciones",
    buffSummary: "⚡ Resumen de Buff",
    noStructuresLoaded: "No hay estructuras cargadas",
    noAllianceAssigned: "No hay alianza asignada",
    noBuffRecognized: "No hay buff reconocido",
    structures: "estructuras",
    
    // Calibration
    advancedCalibration: "🔧 Calibración Avanzada",
    calibrationUnlocked: "🔓 ¡Calibración desbloqueada!",
    wrongPassword: "❌ ¡Contraseña incorrecta!",
    
    // Assignments
    unassigned: "Sin asignar",
    assignedTo: "asignada a",
    removed: "removida",
    options: "opciones",
    scrollToSeeAll: "Desplázate para ver todas las alianzas",
    markersUpdated: "marcadores actualizados",
    
    // Validation
    addAtLeastOneAlliance: "⚠️ Agrega al menos una alianza antes de asignar.",
    enterAllianceName: "Ingresa un nombre de alianza",
    allianceExists: "La alianza ya existe",
    maxAlliances: "Máximo 50 alianzas",
    
    // Anti-Duplicate System
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
    
    // Reset System with Undo
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
    
    // Reports and Analysis
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
    
    // Fixed Bar Controls
    noChange: "Sin Cambios",
    facilityType: "Tipo",
    facilityLevel: "Nivel",
    selectFacility: "Selecciona una instalación",
    close: "Cerrar",
    chooseDifferent: "Elegir Diferente",
    confirmAnyway: "Confirmar De Todos Modos",
    remove: "Eliminar",
    assign: "Asignar",
    
    // System Messages
    unknownBuff: "Buff desconocido",
    betterAlternatives: "Mejores alternativas",
    showMore: "Mostrar más",
    showLess: "Mostrar menos",
    errorOccurred: "Ocurrió un error",
    tryAgain: "Inténtalo de nuevo",
    loading: "Cargando...",
    saving: "Guardando...",
    saved: "Guardado",
    fieldRequired: "Campo requerido",
    invalidInput: "Entrada inválida",
    
    // System Status Messages
    appLoaded: "🎯 ¡App cargada! {count} estructuras con colores oficiales.",
    appReady: "🚀 App lista para usar",
    
    // Chief Charms Calculator
    chiefsCharmsCalculator: "Calculadora de Encantos",
    startLevel: "Nivel Inicial:",
    endLevel: "Nivel Final:",
    calculate: "Calcular",
    total: "Total",
    charmGuides: "Guías de Encantos",
    charmDesigns: "Diseños de Encantos",
    jewelSecrets: "Secretos de Encantos",
    levelAbbr: "Nv",
    headgear: "Casco",
    armor: "Armadura",
    belt: "Cinturón",
    watch: "Reloj",
    pants: "Pantalones",
    gloves: "Guantes",
    
    // Terms Page
    termsTitle: "Términos de Uso",
    termsIntro: "Al acceder y utilizar Whiteout Companion, aceptas los siguientes términos y condiciones.",
    termsSection1: "1. Uso del sitio web",
    termsSection1Text: "Puedes usar el sitio únicamente con fines personales y no comerciales. Está prohibido copiar, reproducir o extraer contenido sin permiso.",
    termsSection2: "2. Propiedad intelectual",
    termsSection2Text: "Todo el contenido, herramientas y diseños son propiedad de Whiteout Companion, salvo indicación en contrario. Los recursos del juego pertenecen al desarrollador original.",
    termsSection3: "3. Limitación de responsabilidad",
    termsSection3Text: "Whiteout Companion se ofrece tal cual. No somos responsables de daños, pérdidas o inexactitudes derivadas del uso del sitio o sus datos.",
    termsSection4: "4. Cuenta y datos",
    termsSection4Text: "No se requieren cuentas de usuario. Eres responsable de cualquier dato que envíes mediante formularios o integraciones externas (por ejemplo, carga CSV).",
    termsSection5: "5. Modificaciones",
    termsSection5Text: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en esta página.",
    termsLastUpdated: "Última actualización: 5 de julio de 2025"
  },
  
  // =================================================================
  // 🇫🇷 FRENCH
  // =================================================================
  
  fr: {
    // Main Interface
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestion professionnelle d'alliances avec calibrage de carte",
    interactiveMap: "🗺️ Carte Interactive",
    legend: "Légende",
    legendTitle: "🎨 Légende Couleurs et Icônes Officielles",
    
    // Alliance Management
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
    
    // Import/Export
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
    exportedOn: "Exporté le",
    free: "Libres",
    active: "Actives",
    preparingExport: "Préparation de l'export...",
    renderingImage: "Rendu de l'image...",
    
    // Language System
    language: "🌐 Langue",
    selectLanguage: "🌐 Sélectionner la Langue",
    languageSet: "🌐 Langue définie !",
    
    // Facility Colors
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
    
    // Summaries
    facilitySummary: "📋 Résumé des Installations",
    buffSummary: "⚡ Résumé des Buff",
    noStructuresLoaded: "Aucune structure chargée",
    noAllianceAssigned: "Aucune alliance assignée",
    noBuffRecognized: "Aucun buff reconnu",
    structures: "structures",
    
    // Calibration
    advancedCalibration: "🔧 Calibrage Avancé",
    calibrationUnlocked: "🔓 Calibrage débloqué !",
    wrongPassword: "❌ Mot de passe incorrect !",
    
    // Assignments
    unassigned: "Non assignée",
    assignedTo: "assignée à",
    removed: "supprimée",
    options: "options",
    scrollToSeeAll: "Faire défiler pour voir toutes les alliances",
    markersUpdated: "marqueurs mis à jour",
    
    // Validation
    addAtLeastOneAlliance: "⚠️ Ajoutez au moins une alliance avant d'assigner.",
    enterAllianceName: "Entrez un nom d'alliance",
    allianceExists: "L'alliance existe déjà",
    maxAlliances: "Maximum 50 alliances",
    
    // Anti-Duplicate System
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
    
    // Reset System with Undo
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
    
    // Reports and Analysis
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
    
    // Fixed Bar Controls
    noChange: "Aucun Changement",
    facilityType: "Type",
    facilityLevel: "Niveau",
    selectFacility: "Sélectionner une installation",
    close: "Fermer",
    chooseDifferent: "Choisir Différent",
    confirmAnyway: "Confirmer Quand Même",
    remove: "Supprimer",
    assign: "Assigner",
    
    // System Messages
    unknownBuff: "Buff inconnu",
    betterAlternatives: "Meilleures alternatives",
    showMore: "Voir plus",
    showLess: "Voir moins",
    errorOccurred: "Une erreur s'est produite",
    tryAgain: "Réessayer",
    loading: "Chargement...",
    saving: "Sauvegarde...",
    saved: "Sauvé",
    fieldRequired: "Champ requis",
    invalidInput: "Entrée invalide",
    
    // System Status Messages
    appLoaded: "🎯 App chargée ! {count} structures avec couleurs officielles.",
    appReady: "🚀 App prête à utiliser",
    
    // Chief Charms Calculator
    chiefsCharmsCalculator: "Calculateur de Charms",
    startLevel: "Niveau de départ:",
    endLevel: "Niveau final:",
    calculate: "Calculer",
    total: "Total",
    charmGuides: "Guides de Charms",
    charmDesigns: "Plans de Charms",
    jewelSecrets: "Secrets de Charms",
    levelAbbr: "Nv",
    headgear: "Casque",
    armor: "Armure",
    belt: "Ceinture",
    watch: "Montre",
    pants: "Pantalon",
    gloves: "Gants",
    
    // Terms Page
    termsTitle: "Conditions d'utilisation",
    termsIntro: "En accédant à Whiteout Companion et en l'utilisant, vous acceptez les conditions générales suivantes.",
    termsSection1: "1. Utilisation du site Web",
    termsSection1Text: "Vous pouvez utiliser ce site uniquement à des fins personnelles et non commerciales. Il est interdit de copier, reproduire ou extraire du contenu sans autorisation.",
    termsSection2: "2. Propriété intellectuelle",
    termsSection2Text: "Tout le contenu, les outils et les conceptions sont la propriété de Whiteout Companion, sauf indication contraire. Les éléments du jeu appartiennent au développeur d'origine.",
    termsSection3: "3. Limitation de responsabilité",
    termsSection3Text: "Whiteout Companion est fourni tel quel. Nous ne sommes pas responsables des dommages, pertes ou inexactitudes pouvant résulter de l'utilisation de ce site ou de ses données.",
    termsSection4: "4. Compte et données",
    termsSection4Text: "Aucun compte utilisateur n'est requis. Vous êtes responsable de toutes les données soumises via des formulaires ou des intégrations externes (ex. import CSV).",
    termsSection5: "5. Modifications",
    termsSection5Text: "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées sur cette page.",
    termsLastUpdated: "Dernière mise à jour : 5 juillet 2025"
  },
  
  // =================================================================
  // 🇩🇪 GERMAN
  // =================================================================
  
  de: {
    // Main Interface
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Professionelle Allianz-Verwaltung mit Kartenkalibrierung",
    interactiveMap: "🗺️ Interaktive Karte",
    legend: "Legende",
    legendTitle: "🎨 Offizielle Farben und Symbole Legende",
    
    // Alliance Management
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
    
    // Import/Export
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
    exportedOn: "Exportiert am",
    free: "Frei",
    active: "Aktiv",
    preparingExport: "Export vorbereiten...",
    renderingImage: "Bild rendern...",
    
    // Language System
    language: "🌐 Sprache",
    selectLanguage: "🌐 Sprache Auswählen",
    languageSet: "🌐 Sprache eingestellt!",
    
    // Facility Colors
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
    
    // Summaries
    facilitySummary: "📋 Anlagen-Zusammenfassung",
    buffSummary: "⚡ Buff-Zusammenfassung",
    noStructuresLoaded: "Keine Strukturen geladen",
    noAllianceAssigned: "Keine Allianz zugewiesen",
    noBuffRecognized: "Kein Buff erkannt",
    structures: "Strukturen",
    
    // Calibration
    advancedCalibration: "🔧 Erweiterte Kalibrierung",
    calibrationUnlocked: "🔓 Kalibrierung freigeschaltet!",
    wrongPassword: "❌ Falsches Passwort!",
    
    // Assignments
    unassigned: "Nicht zugewiesen",
    assignedTo: "zugewiesen an",
    removed: "entfernt",
    options: "Optionen",
    scrollToSeeAll: "Scrollen Sie, um alle Allianzen zu sehen",
    markersUpdated: "Markierungen aktualisiert",
    
    // Validation
    addAtLeastOneAlliance: "⚠️ Fügen Sie mindestens eine Allianz hinzu, bevor Sie zuweisen.",
    enterAllianceName: "Geben Sie einen Allianznamen ein",
    allianceExists: "Allianz existiert bereits",
    maxAlliances: "Maximal 50 Allianzen",
    
    // Anti-Duplicate System
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
    
    // Reset System with Undo
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
    
    // Reports and Analysis
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
    
    // Fixed Bar Controls
    noChange: "Keine Änderung",
    facilityType: "Typ",
    facilityLevel: "Stufe",
    selectFacility: "Anlage auswählen",
    close: "Schließen",
    chooseDifferent: "Andere Wählen",
    confirmAnyway: "Trotzdem Bestätigen",
    remove: "Entfernen",
    assign: "Zuweisen",
    
    // System Messages
    unknownBuff: "Unbekannter Buff",
    betterAlternatives: "Bessere Alternativen",
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
    errorOccurred: "Ein Fehler ist aufgetreten",
    tryAgain: "Erneut versuchen",
    loading: "Laden...",
    saving: "Speichern...",
    saved: "Gespeichert",
    fieldRequired: "Pflichtfeld",
    invalidInput: "Ungültige Eingabe",
    
    // System Status Messages
    appLoaded: "🎯 App geladen! {count} Strukturen mit offiziellen Farben.",
    appReady: "🚀 App bereit für den Einsatz",
    
    // Chief Charms Calculator
    chiefsCharmsCalculator: "Charm Rechner",
    startLevel: "Startlevel:",
    endLevel: "Endlevel:",
    calculate: "Berechnen",
    total: "Gesamt",
    charmGuides: "Charm-Handbücher",
    charmDesigns: "Charm-Entwürfe",
    jewelSecrets: "Charm-Geheimnisse",
    levelAbbr: "Stufe",
    headgear: "Kopfbedeckung",
    armor: "Rüstung",
    belt: "Gürtel",
    watch: "Uhr",
    pants: "Hose",
    gloves: "Handschuhe",
    
    // Terms Page
    termsTitle: "Nutzungsbedingungen",
    termsIntro: "Durch den Zugriff auf und die Nutzung von Whiteout Companion stimmen Sie den folgenden Bedingungen zu.",
    termsSection1: "1. Nutzung der Website",
    termsSection1Text: "Die Nutzung der Website ist nur für persönliche, nicht kommerzielle Zwecke gestattet. Das Kopieren, Reproduzieren oder Scrapen von Inhalten ist ohne Genehmigung verboten.",
    termsSection2: "2. Geistiges Eigentum",
    termsSection2Text: "Alle Inhalte, Tools und Designs sind Eigentum von Whiteout Companion, sofern nicht anders angegeben. Spielmaterialien gehören dem ursprünglichen Entwickler.",
    termsSection3: "3. Haftungsbeschränkung",
    termsSection3Text: "Whiteout Companion wird wie besehen bereitgestellt. Wir übernehmen keine Haftung für Schäden, Verluste oder Ungenauigkeiten, die sich aus der Nutzung dieser Website oder ihrer Daten ergeben.",
    termsSection4: "4. Konto & Daten",
    termsSection4Text: "Es sind keine Benutzerkonten erforderlich. Sie sind verantwortlich für alle Daten, die Sie über Formulare oder externe Integrationen (z. B. CSV-Upload) einreichen.",
    termsSection5: "5. Änderungen",
    termsSection5Text: "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht.",
    termsLastUpdated: "Letzte Aktualisierung: 5. Juli 2025"
  },
  
  // =================================================================
  // 🇵🇹 PORTUGUESE
  // =================================================================
  
  pt: {
    // Main Interface
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestão profissional de alianças com calibração de mapa",
    interactiveMap: "🗺️ Mapa Interativo",
    legend: "Legenda",
    legendTitle: "🎨 Legenda Cores e Ícones Oficiais",
    
    // Alliance Management
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
    
    // Import/Export
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
    exportedOn: "Exportado em",
    free: "Livres",
    active: "Ativas",
    preparingExport: "Preparando exportação...",
    renderingImage: "Renderizando imagem...",
    
    // Language System
    language: "🌐 Idioma",
    selectLanguage: "🌐 Selecionar Idioma",
    languageSet: "🌐 Idioma definido!",
    
    // Facility Colors
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
    
    // Summaries
    facilitySummary: "📋 Resumo de Instalações",
    buffSummary: "⚡ Resumo de Buff",
    noStructuresLoaded: "Nenhuma estrutura carregada",
    noAllianceAssigned: "Nenhuma aliança atribuída",
    noBuffRecognized: "Nenhum buff reconhecido",
    structures: "estruturas",
    
    // Calibration
    advancedCalibration: "🔧 Calibração Avançada",
    calibrationUnlocked: "🔓 Calibração desbloqueada!",
    wrongPassword: "❌ Senha incorreta!",
    
    // Assignments
    unassigned: "Não atribuída",
    assignedTo: "atribuída a",
    removed: "removida",
    options: "opções",
    scrollToSeeAll: "Role para ver todas as alianças",
    markersUpdated: "marcadores atualizados",
    
    // Validation
    addAtLeastOneAlliance: "⚠️ Adicione pelo menos uma aliança antes de atribuir.",
    enterAllianceName: "Digite um nome de aliança",
    allianceExists: "Aliança já existe",
    maxAlliances: "Máximo 50 alianças",
    
    // Anti-Duplicate System
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
    
    // Reset System with Undo
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
    
    // Reports and Analysis
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
    
    // Fixed Bar Controls
    noChange: "Sem Mudança",
    facilityType: "Tipo",
    facilityLevel: "Nível",
    selectFacility: "Selecionar uma instalação",
    close: "Fechar",
    chooseDifferent: "Escolher Diferente",
    confirmAnyway: "Confirmar Mesmo Assim",
    remove: "Remover",
    assign: "Atribuir",
    
    // System Messages
    unknownBuff: "Buff desconhecido",
    betterAlternatives: "Melhores alternativas",
    showMore: "Mostrar mais",
    showLess: "Mostrar menos",
    errorOccurred: "Ocorreu um erro",
    tryAgain: "Tente novamente",
    loading: "Carregando...",
    saving: "Salvando...",
    saved: "Salvo",
    fieldRequired: "Campo obrigatório",
    invalidInput: "Entrada inválida",
    
    // System Status Messages
    appLoaded: "🎯 App carregado! {count} estruturas com cores oficiais.",
    appReady: "🚀 App pronto para usar",
    
    // Chief Charms Calculator
    chiefsCharmsCalculator: "Calculadora de Encantos",
    startLevel: "Nível Inicial:",
    endLevel: "Nível Final:",
    calculate: "Calcular",
    total: "Total",
    charmGuides: "Guias de Encantos",
    charmDesigns: "Projetos de Encantos",
    jewelSecrets: "Segredos de Encantos",
    levelAbbr: "Nv",
    headgear: "Capacete",
    armor: "Armadura",
    belt: "Cinto",
    watch: "Relógio",
    pants: "Calças",
    gloves: "Luvas",
    
    // Terms Page
    termsTitle: "Termos de Uso",
    termsIntro: "Ao acessar e utilizar o Whiteout Companion, você concorda com os seguintes termos e condições.",
    termsSection1: "1. Uso do Site",
    termsSection1Text: "Você pode usar o site apenas para fins pessoais e não comerciais. É proibido copiar, reproduzir ou extrair qualquer parte do site sem permissão.",
    termsSection2: "2. Propriedade Intelectual",
    termsSection2Text: "Todo o conteúdo, ferramentas e designs são propriedade do Whiteout Companion, salvo indicação em contrário. Os ativos do jogo pertencem ao desenvolvedor original.",
    termsSection3: "3. Limitação de Responsabilidade",
    termsSection3Text: "O Whiteout Companion é fornecido como está. Não somos responsáveis por quaisquer danos, perdas ou imprecisões decorrentes do uso do site ou de seus dados.",
    termsSection4: "4. Conta e Dados",
    termsSection4Text: "Não exigimos contas de usuário. Você é responsável por quaisquer dados enviados por meio de formulários ou integrações externas (por exemplo, upload CSV).",
    termsSection5: "5. Modificações",
    termsSection5Text: "Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão publicadas nesta página.",
    termsLastUpdated: "Última atualização: 5 de julho de 2025"
  }
};

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

/**
 * Validates that all translations are complete compared to the reference language (English)
 * @returns {Object} Detailed validation report
 */
function validateTranslationsCompleteness() {
  const languages = Object.keys(translations);
  const referenceKeys = new Set(Object.keys(translations['en']));
  
  const report = {
    totalLanguages: languages.length,
    referenceKeyCount: referenceKeys.size,
    languageReports: {},
    missingKeys: {},
    extraKeys: {},
    isComplete: true
  };
  
  languages.forEach(lang => {
    const langKeys = new Set(Object.keys(translations[lang]));
    const missing = [...referenceKeys].filter(key => !langKeys.has(key));
    const extra = [...langKeys].filter(key => !referenceKeys.has(key));
    
    const completeness = Math.round(((langKeys.size - missing.length) / referenceKeys.size) * 100);
    
    report.languageReports[lang] = {
      totalKeys: langKeys.size,
      missingCount: missing.length,
      extraCount: extra.length,
      completeness: completeness
    };
    
    if (missing.length > 0) {
      report.missingKeys[lang] = missing;
      report.isComplete = false;
    }
    if (extra.length > 0) {
      report.extraKeys[lang] = extra;
    }
  });
  
  return report;
}

/**
 * Gets a translation string with optional parameter substitution
 * @param {string} language - Language code
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for substitution
 * @returns {string} Translated string
 */
function getTranslation(language, key, params = {}) {
  const fallbackLanguage = 'en';
  
  // Try to get translation in requested language
  let translation = translations[language]?.[key];
  
  // Fallback to English if not found
  if (!translation) {
    translation = translations[fallbackLanguage]?.[key];
  }
  
  // Final fallback to key itself
  if (!translation) {
    console.warn(`Missing translation for key: ${key} in language: ${language}`);
    return key;
  }
  
  // Replace parameters in translation
  let result = translation;
  Object.entries(params).forEach(([param, value]) => {
    result = result.replace(`{${param}}`, value);
  });
  
  return result;
}

/**
 * Debug function to analyze translation completeness
 * Available globally for debugging purposes
 */
window.debugTranslations = function() {
  const report = validateTranslationsCompleteness();
  
  console.log('🌐 === COMPLETE TRANSLATION REPORT ===');
  console.log(`📊 Supported languages: ${report.totalLanguages}`);
  console.log(`🔑 Reference keys: ${report.referenceKeyCount}`);
  console.log(`✅ All translations complete: ${report.isComplete ? 'YES' : 'NO'}`);
  
  Object.entries(report.languageReports).forEach(([lang, data]) => {
    const flag = {
      'en': '🇺🇸', 'it': '🇮🇹', 'es': '🇪🇸', 
      'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇵🇹'
    }[lang] || '🏳️';
    
    console.log(`${flag} ${lang.toUpperCase()}: ${data.completeness}% (${data.totalKeys} keys)`);
    
    if (report.missingKeys[lang]?.length > 0) {
      console.log(`  ❌ Missing: ${report.missingKeys[lang].slice(0, 3).join(', ')}${report.missingKeys[lang].length > 3 ? '...' : ''}`);
    }
    
    if (report.extraKeys[lang]?.length > 0) {
      console.log(`  ➕ Extra: ${report.extraKeys[lang].slice(0, 3).join(', ')}${report.extraKeys[lang].length > 3 ? '...' : ''}`);
    }
  });
  
  console.log('=== END REPORT ===');
  return report;
};

// =====================================================================
// INTEGRITY CHECK AND INITIALIZATION
// =====================================================================

const integrityCheck = validateTranslationsCompleteness();

if (!integrityCheck.isComplete) {
  console.warn('⚠️ Some translations may be incomplete. Use debugTranslations() for details.');
  
  // List incomplete languages
  const incompleteLanguages = Object.entries(integrityCheck.languageReports)
    .filter(([_, data]) => data.completeness < 100)
    .map(([lang, data]) => `${lang} (${data.completeness}%)`)
    .join(', ');
  
  if (incompleteLanguages) {
    console.warn(`📝 Incomplete languages: ${incompleteLanguages}`);
  }
} else {
  console.log('✅ ALL translations are 100% complete!');
}

console.log(`🌐 Translation system loaded: ${integrityCheck.totalLanguages} languages, ${integrityCheck.referenceKeyCount} keys per language`);

// =====================================================================
// EXPORTS AND GLOBAL AVAILABILITY
// =====================================================================

// Make functions available globally
window.getTranslation = getTranslation;
window.translations = translations;
window.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
window.getLanguageDisplayName = getLanguageDisplayName;

// Node.js module export compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    translations,
    SUPPORTED_LANGUAGES,
    getLanguageDisplayName,
    getTranslation,
    validateTranslationsCompleteness
  };
}

console.log('🚀 Translation system ready for use');