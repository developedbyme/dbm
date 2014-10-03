/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Exports layers of an illustrator document.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.illustrator.utils.export.LayerExporter", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.illustrator.utils.export.LayerExporter");
	//"use strict";
	
	//Self reference
	var LayerExporter = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.utils.export.LayerExporter");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var MetaDataObject = dbm.importClass("com.developedbyme.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var PathLayer = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer");
	var CompoundPathLayer = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	
	//Utils
	
	//Constants
	
	
	staticFunctions.exportLayers = function(aTreeStructureItems, aReturnParentTreeStructureItem) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.utils.export.LayerExporter::exportLayers");
		//console.log(aTreeStructureItems, aReturnParentTreeStructureItem);
		
		var currentArray = aTreeStructureItems;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[i];
			var currentLayer = currentTreeStructureItem.data;
			var newItem = TreeStructureItem.create(currentTreeStructureItem.getName());
			aReturnParentTreeStructureItem.addChild(newItem);
			
			var layerData = MetaDataObject.create();
			newItem.data = layerData;
			var layerMetaData = layerData.metaData;
			
			currentType = "layer";
			if(currentLayer instanceof PathLayer) {
				layerData.data = currentLayer.generateShapeData();
				currentType = "path";
			}
			else if(currentLayer instanceof CompoundPathLayer) {
				currentType = "compoundPath";
			};
			layerMetaData.addObject("type", currentType);
			
			ClassReference.exportLayers(currentTreeStructureItem.getChildren(), newItem);
		}
	};
});