/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Css unit types and conversion to svg types.
 */
dbm.registerClass("dbm.constants.UnitTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.UnitTypes");
	//"use strict";
	
	//Self refernce
	var UnitTypes = dbm.importClass("dbm.constants.UnitTypes");
	
	//Error report
	
	//Dependencies
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Utils
	
	//Constants
	
	
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
	staticFunctions.DEGREE = "deg";
	
	/**
	 * Array with names that correlates to svgUnitTypes.
	 */
	staticFunctions.unitTypes = [staticFunctions.UNKNOWN, staticFunctions.NONE, staticFunctions.PX, staticFunctions.PERCENTAGE, staticFunctions.EM, staticFunctions.EX, staticFunctions.IN, staticFunctions.CM, staticFunctions.MM, staticFunctions.PT, staticFunctions.PC];
	
	/**
	 * Array with values that correlates to unitTypes.
	 */
	staticFunctions.svgUnitTypes = [0, 1, 5, 2, 3, 4, 8, 6, 7, 9, 10];
	
	/**
	 * Converts a css unit type to the integer representation in svg.
	 *
	 * @param	aUnitType	UnitTypes	The css unit type.
	 *
	 * @return	Number	The integer type that represents the same type in css. 0 (unknown) is returned if no match is found.
	 */
	staticFunctions.getSvgUnitType = function(aUnitType) {
		
		var unitTypeIndex = ArrayFunctions.indexOfInArray(ClassReference.unitTypes, aUnitType);
		if(unitTypeIndex >= 0) {
			return ClassReference.svgUnitTypes[unitTypeIndex];
		}
		
		//METODO: error message
		return 0;
	};
});