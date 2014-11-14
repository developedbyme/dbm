/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for modifying a canvas controller.
 */
dbm.registerClass("com.developedbyme.utils.canvas.modify.CanvasControllerModificationFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.canvas.modify.CanvasControllerModificationFunctions");
	
	//Self reference
	var CanvasControllerModificationFunctions = dbm.importClass("com.developedbyme.utils.canvas.modify.CanvasControllerModificationFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	
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
});