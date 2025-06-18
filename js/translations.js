// =====================================================================
// TRANSLATIONS.JS - SISTEMA MULTILINGUA COMPLETO E AGGIORNATO
// =====================================================================
// Sistema traduzioni per Whiteout Survival Companion: 6 lingue complete
// TUTTE le stringhe sono ora tradotte correttamente!
//
// VERSIONE AGGIORNATA con TUTTE le chiavi mancanti aggiunte

console.log('🌐 Caricamento sistema traduzioni completo e aggiornato...');

// =====================================================================
// CONFIGURAZIONE LINGUE SUPPORTATE
// =====================================================================

const SUPPORTED_LANGUAGES = ['it', 'en', 'es', 'fr', 'de', 'pt'];

function getLanguageDisplayName(languageCode) {
  const names = {
    'it': 'Italiano',
    'en': 'English', 
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'pt': 'Português'
  };
  return names[languageCode] || languageCode.toUpperCase();
}

// =====================================================================
// TRADUZIONI COMPLETE - TUTTE LE CHIAVI INCLUSE
// =====================================================================

const translations = {
  
  // =================================================================
  // 🇮🇹 ITALIANO
  // =================================================================
  
  it: {
    // Interfaccia principale
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestione professionale alleanze con calibrazione mappa",
    interactiveMap: "🗺️ Mappa Interattiva",
    legend: "Legenda",
    legendTitle: "🎨 Legenda Colori e Icone Ufficiali",
    
    // Gestione alleanze
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
    
    // Sistema multilingua
    language: "🌐 Lingua",
    selectLanguage: "🌐 Seleziona Lingua",
    languageSet: "🌐 Lingua impostata!",
    
    // Colori facility
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
    
    // Riepiloghi
    facilitySummary: "📋 Riepilogo Strutture",
    buffSummary: "⚡ Riepilogo Buff",
    noStructuresLoaded: "Nessuna struttura caricata",
    noAllianceAssigned: "Nessuna alleanza assegnata",
    noBuffRecognized: "Nessun buff riconosciuto",
    structures: "strutture",
    
    // Calibrazione
    advancedCalibration: "🔧 Calibrazione Avanzata",
    calibrationUnlocked: "🔓 Calibrazione sbloccata!",
    wrongPassword: "❌ Password errata!",
    
    // Assegnazioni
    unassigned: "Non assegnata",
    assignedTo: "assegnata a",
    removed: "rimossa",
    options: "opzioni",
    scrollToSeeAll: "Scrolla per vedere tutte le alleanze",
    markersUpdated: "marker aggiornati",
    
    // Validazione
    addAtLeastOneAlliance: "⚠️ Aggiungi almeno un'alleanza prima di assegnare.",
    enterAllianceName: "Inserisci un nome per l'alleanza",
    allianceExists: "Alleanza già esistente",
    maxAlliances: "Massimo 50 alleanze",
    
    // Sistema anti-duplicati
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
    
    // Sistema reset con undo
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
    
    // Report e analisi
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
    
    // NUOVE CHIAVI AGGIUNTE - Controlli barra fissa
    noChange: "Nessun Cambio",
    facilityType: "Tipo",
    facilityLevel: "Livello",
    selectFacility: "Seleziona una facility",
    close: "Chiudi",
    chooseDifferent: "Scegli Diversa",
    confirmAnyway: "Conferma Comunque",
    remove: "Rimuovi",
    assign: "Assegna",
    
    // NUOVE CHIAVI - Messaggi sistema
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
    
    // Messaggi sistema
    appLoaded: "🎯 App caricata! {count} strutture con colori ufficiali.",
    appReady: "🚀 App pronta per l'uso"
  },
  
  // =================================================================
  // 🇺🇸 INGLESE
  // =================================================================
  
  en: {
    // Interfaccia principale
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Professional alliance management with map calibration",
    interactiveMap: "🗺️ Interactive Map",
    legend: "Legend",
    legendTitle: "🎨 Official Colors and Icons Legend",
    
    // Gestione alleanze
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
    
    // Sistema multilingua
    language: "🌐 Language",
    selectLanguage: "🌐 Select Language",
    languageSet: "🌐 Language set!",
    
    // Colori facility
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
    
    // Riepiloghi
    facilitySummary: "📋 Facility Summary",
    buffSummary: "⚡ Buff Summary",
    noStructuresLoaded: "No structures loaded",
    noAllianceAssigned: "No alliance assigned",
    noBuffRecognized: "No buff recognized",
    structures: "structures",
    
    // Calibrazione
    advancedCalibration: "🔧 Advanced Calibration",
    calibrationUnlocked: "🔓 Calibration unlocked!",
    wrongPassword: "❌ Wrong password!",
    
    // Assegnazioni
    unassigned: "Unassigned",
    assignedTo: "assigned to",
    removed: "removed",
    options: "options",
    scrollToSeeAll: "Scroll to see all alliances",
    markersUpdated: "markers updated",
    
    // Validazione
    addAtLeastOneAlliance: "⚠️ Add at least one alliance before assigning.",
    enterAllianceName: "Enter an alliance name",
    allianceExists: "Alliance already exists",
    maxAlliances: "Maximum 50 alliances",
    
    // Sistema anti-duplicati
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
    
    // Sistema reset con undo
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
    
    // Report e analisi
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
    
    // NUOVE CHIAVI AGGIUNTE - Controlli barra fissa
    noChange: "No Change",
    facilityType: "Type",
    facilityLevel: "Level",
    selectFacility: "Select a facility",
    close: "Close",
    chooseDifferent: "Choose Different",
    confirmAnyway: "Confirm Anyway",
    remove: "Remove",
    assign: "Assign",
    
    // NUOVE CHIAVI - Messaggi sistema
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
    
    // Messaggi sistema
    appLoaded: "🎯 App loaded! {count} structures with official colors.",
    appReady: "🚀 App ready for use"
  },
  
  // =================================================================
  // 🇪🇸 SPAGNOLO
  // =================================================================
  
  es: {
    // Interfaccia principale
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestión profesional de alianzas con calibración de mapa",
    interactiveMap: "🗺️ Mapa Interactivo",
    legend: "Leyenda",
    legendTitle: "🎨 Leyenda Colores e Iconos Oficiales",
    
    // Gestione alleanze
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
    
    // Sistema multilingua
    language: "🌐 Idioma",
    selectLanguage: "🌐 Seleccionar Idioma",
    languageSet: "🌐 ¡Idioma establecido!",
    
    // Colori facility
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
    
    // Riepiloghi
    facilitySummary: "📋 Resumen de Instalaciones",
    buffSummary: "⚡ Resumen de Buff",
    noStructuresLoaded: "No hay estructuras cargadas",
    noAllianceAssigned: "No hay alianza asignada",
    noBuffRecognized: "No hay buff reconocido",
    structures: "estructuras",
    
    // Calibrazione
    advancedCalibration: "🔧 Calibración Avanzada",
    calibrationUnlocked: "🔓 ¡Calibración desbloqueada!",
    wrongPassword: "❌ ¡Contraseña incorrecta!",
    
    // Assegnazioni
    unassigned: "Sin asignar",
    assignedTo: "asignada a",
    removed: "removida",
    options: "opciones",
    scrollToSeeAll: "Desplázate para ver todas las alianzas",
    markersUpdated: "marcadores actualizados",
    
    // Validazione
    addAtLeastOneAlliance: "⚠️ Agrega al menos una alianza antes de asignar.",
    enterAllianceName: "Ingresa un nombre de alianza",
    allianceExists: "La alianza ya existe",
    maxAlliances: "Máximo 50 alianzas",
    
    // Sistema anti-duplicati
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
    
    // Sistema reset con undo
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
    
    // Report e analisi
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
    
    // NUOVE CHIAVI AGGIUNTE - Controlli barra fissa
    noChange: "Sin Cambios",
    facilityType: "Tipo",
    facilityLevel: "Nivel",
    selectFacility: "Selecciona una instalación",
    close: "Cerrar",
    chooseDifferent: "Elegir Diferente",
    confirmAnyway: "Confirmar De Todos Modos",
    remove: "Eliminar",
    assign: "Asignar",
    
    // NUOVE CHIAVI - Messaggi sistema
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
    
    // Messaggi sistema
    appLoaded: "🎯 ¡App cargada! {count} estructuras con colores oficiales.",
    appReady: "🚀 App lista para usar"
  },
  
  // =================================================================
  // 🇫🇷 FRANCESE
  // =================================================================
  
  fr: {
    // Interfaccia principale
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestion professionnelle d'alliances avec calibrage de carte",
    interactiveMap: "🗺️ Carte Interactive",
    legend: "Légende",
    legendTitle: "🎨 Légende Couleurs et Icônes Officielles",
    
    // Gestione alleanze
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
    
    // Sistema multilingua
    language: "🌐 Langue",
    selectLanguage: "🌐 Sélectionner la Langue",
    languageSet: "🌐 Langue définie !",
    
    // Colori facility
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
    
    // Riepiloghi
    facilitySummary: "📋 Résumé des Installations",
    buffSummary: "⚡ Résumé des Buff",
    noStructuresLoaded: "Aucune structure chargée",
    noAllianceAssigned: "Aucune alliance assignée",
    noBuffRecognized: "Aucun buff reconnu",
    structures: "structures",
    
    // Calibrazione
    advancedCalibration: "🔧 Calibrage Avancé",
    calibrationUnlocked: "🔓 Calibrage débloqué !",
    wrongPassword: "❌ Mot de passe incorrect !",
    
    // Assegnazioni
    unassigned: "Non assignée",
    assignedTo: "assignée à",
    removed: "supprimée",
    options: "options",
    scrollToSeeAll: "Faire défiler pour voir toutes les alliances",
    markersUpdated: "marqueurs mis à jour",
    
    // Validazione
    addAtLeastOneAlliance: "⚠️ Ajoutez au moins une alliance avant d'assigner.",
    enterAllianceName: "Entrez un nom d'alliance",
    allianceExists: "L'alliance existe déjà",
    maxAlliances: "Maximum 50 alliances",
    
    // Sistema anti-duplicati
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
    
    // Sistema reset con undo
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
    
    // Report e analisi
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
    
    // NUOVE CHIAVI AGGIUNTE - Controlli barra fissa
    noChange: "Aucun Changement",
    facilityType: "Type",
    facilityLevel: "Niveau",
    selectFacility: "Sélectionner une installation",
    close: "Fermer",
    chooseDifferent: "Choisir Différent",
    confirmAnyway: "Confirmer Quand Même",
    remove: "Supprimer",
    assign: "Assigner",
    
    // NUOVE CHIAVI - Messaggi sistema
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
    
    // Messaggi sistema
    appLoaded: "🎯 App chargée ! {count} structures avec couleurs officielles.",
    appReady: "🚀 App prête à utiliser"
  },
  
  // =================================================================
  // 🇩🇪 TEDESCO
  // =================================================================
  
  de: {
    // Interfaccia principale
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Professionelle Allianz-Verwaltung mit Kartenkalibrierung",
    interactiveMap: "🗺️ Interaktive Karte",
    legend: "Legende",
    legendTitle: "🎨 Offizielle Farben und Symbole Legende",
    
    // Gestione alleanze
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
    
    // Sistema multilingua
    language: "🌐 Sprache",
    selectLanguage: "🌐 Sprache Auswählen",
    languageSet: "🌐 Sprache eingestellt!",
    
    // Colori facility
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
    
    // Riepiloghi
    facilitySummary: "📋 Anlagen-Zusammenfassung",
    buffSummary: "⚡ Buff-Zusammenfassung",
    noStructuresLoaded: "Keine Strukturen geladen",
    noAllianceAssigned: "Keine Allianz zugewiesen",
    noBuffRecognized: "Kein Buff erkannt",
    structures: "Strukturen",
    
    // Calibrazione
    advancedCalibration: "🔧 Erweiterte Kalibrierung",
    calibrationUnlocked: "🔓 Kalibrierung freigeschaltet!",
    wrongPassword: "❌ Falsches Passwort!",
    
    // Assegnazioni
    unassigned: "Nicht zugewiesen",
    assignedTo: "zugewiesen an",
    removed: "entfernt",
    options: "Optionen",
    scrollToSeeAll: "Scrollen Sie, um alle Allianzen zu sehen",
    markersUpdated: "Markierungen aktualisiert",
    
    // Validazione
    addAtLeastOneAlliance: "⚠️ Fügen Sie mindestens eine Allianz hinzu, bevor Sie zuweisen.",
    enterAllianceName: "Geben Sie einen Allianznamen ein",
    allianceExists: "Allianz existiert bereits",
    maxAlliances: "Maximal 50 Allianzen",
    
    // Sistema anti-duplicati
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
    
    // Sistema reset con undo
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
    
    // Report e analisi
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
    
    // NUOVE CHIAVI AGGIUNTE - Controlli barra fissa
    noChange: "Keine Änderung",
    facilityType: "Typ",
    facilityLevel: "Stufe",
    selectFacility: "Anlage auswählen",
    close: "Schließen",
    chooseDifferent: "Andere Wählen",
    confirmAnyway: "Trotzdem Bestätigen",
    remove: "Entfernen",
    assign: "Zuweisen",
    
    // NUOVE CHIAVI - Messaggi sistema
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
    
    // Messaggi sistema
    appLoaded: "🎯 App geladen! {count} Strukturen mit offiziellen Farben.",
    appReady: "🚀 App bereit für den Einsatz"
  },
  
  // =================================================================
  // 🇵🇹 PORTOGHESE
  // =================================================================
  
  pt: {
    // Interfaccia principale
    title: "🗺️ Whiteout Survival Companion",
    subtitle: "Gestão profissional de alianças com calibração de mapa",
    interactiveMap: "🗺️ Mapa Interativo",
    legend: "Legenda",
    legendTitle: "🎨 Legenda Cores e Ícones Oficiais",
    
    // Gestione alleanze
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
    
    // Sistema multilingua
    language: "🌐 Idioma",
    selectLanguage: "🌐 Selecionar Idioma",
    languageSet: "🌐 Idioma definido!",
    
    // Colori facility
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
    
    // Riepiloghi
    facilitySummary: "📋 Resumo de Instalações",
    buffSummary: "⚡ Resumo de Buff",
    noStructuresLoaded: "Nenhuma estrutura carregada",
    noAllianceAssigned: "Nenhuma aliança atribuída",
    noBuffRecognized: "Nenhum buff reconhecido",
    structures: "estruturas",
    
    // Calibrazione
    advancedCalibration: "🔧 Calibração Avançada",
    calibrationUnlocked: "🔓 Calibração desbloqueada!",
    wrongPassword: "❌ Senha incorreta!",
    
    // Assegnazioni
    unassigned: "Não atribuída",
    assignedTo: "atribuída a",
    removed: "removida",
    options: "opções",
    scrollToSeeAll: "Role para ver todas as alianças",
    markersUpdated: "marcadores atualizados",
    
    // Validazione
    addAtLeastOneAlliance: "⚠️ Adicione pelo menos uma aliança antes de atribuir.",
    enterAllianceName: "Digite um nome de aliança",
    allianceExists: "Aliança já existe",
    maxAlliances: "Máximo 50 alianças",
    
    // Sistema anti-duplicati
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
    
    // Sistema reset con undo
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
    
    // Report e analisi
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
    
    // NUOVE CHIAVI AGGIUNTE - Controlli barra fissa
    noChange: "Sem Mudança",
    facilityType: "Tipo",
    facilityLevel: "Nível",
    selectFacility: "Selecionar uma instalação",
    close: "Fechar",
    chooseDifferent: "Escolher Diferente",
    confirmAnyway: "Confirmar Mesmo Assim",
    remove: "Remover",
    assign: "Atribuir",
    
    // NUOVE CHIAVI - Messaggi sistema
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
    
    // Messaggi sistema
    appLoaded: "🎯 App carregado! {count} estruturas com cores oficiais.",
    appReady: "🚀 App pronto para usar"
  }
};

// =====================================================================
// FUNZIONI UTILITÀ
// =====================================================================

function validateTranslationsCompleteness() {
  const languages = Object.keys(translations);
  const referenceKeys = new Set(Object.keys(translations['en']));
  
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

window.debugTranslations = function() {
  const report = validateTranslationsCompleteness();
  
  console.log('🌐 === REPORT TRADUZIONI COMPLETO ===');
  console.log(`📊 Lingue supportate: ${report.totalLanguages}`);
  console.log(`🔑 Chiavi di riferimento: ${report.referenceKeyCount}`);
  
  Object.entries(report.languageReports).forEach(([lang, data]) => {
    const flag = {
      'it': '🇮🇹', 'en': '🇺🇸', 'es': '🇪🇸', 
      'fr': '🇫🇷', 'de': '🇩🇪', 'pt': '🇵🇹'
    }[lang] || '🏳️';
    
    console.log(`${flag} ${lang.toUpperCase()}: ${data.completeness}% (${data.totalKeys} chiavi)`);
    
    if (report.missingKeys[lang]?.length > 0) {
      console.log(`  ❌ Mancanti: ${report.missingKeys[lang].slice(0, 3).join(', ')}${report.missingKeys[lang].length > 3 ? '...' : ''}`);
    }
  });
  
  console.log('=== FINE REPORT ===');
  return report;
};

// =====================================================================
// VERIFICA INTEGRITÀ FINALE
// =====================================================================

const integrityCheck = validateTranslationsCompleteness();
const hasIssues = Object.values(integrityCheck.languageReports).some(report => report.completeness < 100);

if (hasIssues) {
  console.warn('⚠️ Alcune traduzioni potrebbero essere incomplete. Usa debugTranslations() per dettagli.');
} else {
  console.log('✅ TUTTE le traduzioni sono complete al 100%!');
}

console.log(`🌐 Sistema traduzioni COMPLETO caricato: ${integrityCheck.totalLanguages} lingue, ${integrityCheck.referenceKeyCount} chiavi per lingua`);

// Esporta per compatibilità
if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}