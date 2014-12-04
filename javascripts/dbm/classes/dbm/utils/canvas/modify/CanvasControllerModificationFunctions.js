/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for modifying a canvas controller.
 */
dbm.registerClass("dbm.utils.canvas.modify.CanvasControllerModificationFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.canvas.modify.CanvasControllerModificationFunctions");
	
	//Self reference
	var CanvasControllerModificationFunctions = dbm.importClass("dbm.utils.canvas.modify.CanvasControllerModificationFunctions");
	
	//Error report
	
	//Dependencies
	var CanvasLayer2d = dbm.importClass("dbm.utils.canvas.CanvasLayer2d");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	staticFunctions.getAllGraphics = function(aLayer, aReturnArray) {
		ArrayFunctions.concatToArray(aReturnArray, aLayer.getGraphics());
		
		var currentTreeStructureItem = aLayer.getTreeStructureItem();
		var currentArray = currentTreeStructureItem.getChildren();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[i];
			ClassReference.getAllGraphics(currentTreeStructureItem.data, aReturnArray);
		}
	};
	
	staticFunctions.createInsertedLayer = function(aContentLayer) {
		var newLayer = CanvasLayer2d.create();
		newLayer.createTreeStructureItem();
		aContentLayer.getTreeStructureItem().getInheritedAttribute("graphicsUpdate").connectInput(newLayer.getProperty("graphicsUpdate"));
		
		ClassReference.insertLayer(aContentLayer, newLayer);
		
		return newLayer;
	};
	
	staticFunctions.insertLayer = function(aContentLayer, aNewLayer) {
		var contentTreeStructureItem = aContentLayer.getTreeStructureItem();
		var newTreeStructureItem = aNewLayer.getTreeStructureItem();
		var currentArray = ArrayFunctions.copyArray(contentTreeStructureItem.getChildren());
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTreeStructureItem = currentArray[i];
			currentTreeStructureItem.retain();
			
			contentTreeStructureItem.removeChild(currentTreeStructureItem);
			newTreeStructureItem.addChild(currentTreeStructureItem);
			
			currentTreeStructureItem.release();
		}
		
		contentTreeStructureItem.addChild(newTreeStructureItem);
	};
});