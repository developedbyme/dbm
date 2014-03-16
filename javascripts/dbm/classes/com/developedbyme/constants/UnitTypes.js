/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.UnitTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.UnitTypes");
	//"use strict";
	
	var UnitTypes = dbm.importClass("com.developedbyme.constants.UnitTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	staticFunctions.NONE = "none";
	staticFunctions.UNKNOWN = "unknown";
	staticFunctions.PX = "px";
	staticFunctions.PERCENTAGE = "%";
	staticFunctions.EM = "em";
	staticFunctions.EX = "ex";
	staticFunctions.IN = "in";
	staticFunctions.CM = "cm";
	staticFunctions.MM = "mm";
	staticFunctions.PT = "pt";
	staticFunctions.PC = "pc";
	
	staticFunctions.unitTypes = [staticFunctions.UNKNOWN, staticFunctions.NONE, staticFunctions.PX, staticFunctions.PERCENTAGE, staticFunctions.EM, staticFunctions.EX, staticFunctions.IN, staticFunctions.CM, staticFunctions.MM, staticFunctions.PT, staticFunctions.PC];
	
	staticFunctions.svgUnitTypes = [0, 1, 5, 2, 3, 4, 8, 6, 7, 9, 10];
	
	staticFunctions.getSvgUnitType = function getSvgUnitType(aUnitType) {
		
		var unitTypeIndex = ArrayFunctions.indexOfInArray(ClassReference.unitTypes, aUnitType);
		if(unitTypeIndex >= 0) {
			return ClassReference.svgUnitTypes[unitTypeIndex];
		}
		
		//METODO: error message
		return 0;
	};
});