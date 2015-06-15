/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Exports after effects compositions.
 */
dbm.registerClass("dbm.adobeextendscript.aftereffects.utils.export.CompositionExporter", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.aftereffects.utils.export.CompositionExporter");
	//"use strict";
	
	//Self reference
	var CompositionExporter = dbm.importClass("dbm.adobeextendscript.aftereffects.utils.export.CompositionExporter");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var MetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	
	//Utils
	var LayerExporter = dbm.importClass("dbm.adobeextendscript.aftereffects.utils.export.LayerExporter");
	var MetaDataFunctions = dbm.importClass("dbm.adobeextendscript.aftereffects.utils.export.MetaDataFunctions");
	
	//Constants
	
	
	staticFunctions.exportCompositions = function(aCompositions, aProject, aFilesToCopy, aPhotoshopLayersToExport, aReturnArray) {
		//console.log("dbm.adobeextendscript.aftereffects.utils.export.CompositionExporter::exportCompositions");
		
		var currentArray = aCompositions;
		for(var i = 0; i < currentArray.length; i++) { //MENOTE: array can change in the loop
			var currentNativeComposition = currentArray[i];
			
			var currentComposition = aProject.getItemByNativeItem(currentNativeComposition);
			
			var compositionMetaData = MetaDataObject.create();
			aReturnArray.push(compositionMetaData);
			
			MetaDataFunctions.setCompositionMetaData(currentComposition, compositionMetaData.metaData);
			
			var exportedLayerData = TreeStructure.create();
			compositionMetaData.data = exportedLayerData;
			
			LayerExporter.exportLayers(currentComposition.getLayers(), exportedLayerData.getRoot(), aCompositions, aFilesToCopy, aPhotoshopLayersToExport);
			
			
		}
		
	};
});