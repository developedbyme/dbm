/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Exports layers of an illustrator document.
 */
dbm.registerClass("dbm.adobeextendscript.illustrator.utils.export.LayerExporter", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.adobeextendscript.illustrator.utils.export.LayerExporter");
	//"use strict";
	
	//Self reference
	var LayerExporter = dbm.importClass("dbm.adobeextendscript.illustrator.utils.export.LayerExporter");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	var MetaDataObject = dbm.importClass("dbm.core.globalobjects.xmlobjectencoder.encodingdata.MetaDataObject");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var PathLayer = dbm.importClass("dbm.adobeextendscript.illustrator.items.layers.PathLayer");
	var CompoundPathLayer = dbm.importClass("dbm.adobeextendscript.illustrator.items.layers.CompoundPathLayer");
	var TransformedObjectData = dbm.importClass("dbm.core.data.graphics.TransformedObjectData");
	
	//Utils
	
	//Constants
	
	
	staticFunctions.exportLayers = function(aTreeStructureItems, aReturnParentTreeStructureItem, aOffsetX, aOffsetY) {
		//console.log("dbm.adobeextendscript.illustrator.utils.export.LayerExporter::exportLayers");
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
			
			var newOffsetX = currentLayer.getX();
			var newOffsetY = currentLayer.getY();
			
			var x = newOffsetX-aOffsetX;
			var y = newOffsetY-aOffsetY;
			
			layerMetaData.addObject("name", currentLayer.getProperty("name").getValue());
			layerMetaData.addObject("width", currentLayer.getWidth());
			layerMetaData.addObject("height", currentLayer.getHeight());
			
			currentType = "layer";
			
			var transformedObject = TransformedObjectData.create(null, x, y);
			layerData.data = transformedObject;
			
			if(currentLayer instanceof PathLayer) {
				transformedObject.object = currentLayer.generateShapeData(newOffsetX, newOffsetY);
				currentType = "path";
			}
			else if(currentLayer instanceof CompoundPathLayer) {
				currentType = "compoundPath";
				layerMetaData.addObject("isClipping", currentLayer.isClipping());
			};
			layerMetaData.addObject("type", currentType);
			
			ClassReference.exportLayers(currentTreeStructureItem.getChildren(), newItem, newOffsetX, newOffsetY);
		}
	};
});