/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.math.TrigonometryFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.TrigonometryFunctions");
	//"use strict";
	
	var TrigonometryFunctions = dbm.importClass("com.developedbyme.utils.math.TrigonometryFunctions");
	
	staticFunctions.getRadiusFromChord = function(aAngle, aLength) {
		return aLength/(2*Math.sin(0.5*aAngle));
	};
	
	staticFunctions.getChordLength = function(aAngle, aRadius) {
		return aRadius*2*Math.sin(0.5*aAngle);
	};
});