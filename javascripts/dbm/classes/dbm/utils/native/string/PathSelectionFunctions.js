/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.native.string.PathSelectionFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.native.string.PathSelectionFunctions");
	//"use strict";
	
	var PathSelectionFunctions = dbm.importClass("dbm.utils.native.string.PathSelectionFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	staticFunctions.getAllPathsInFolder = function(aPaths, aFolderPath) {
		var returnArray = new Array();
		
		var currentArray = aPaths;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentTestPath = currentArray[i];
			if(currentTestPath.indexOf(aFolderPath) === 0) {
				returnArray.push(currentTestPath);
			}
		}
		
		return returnArray;
	};
});