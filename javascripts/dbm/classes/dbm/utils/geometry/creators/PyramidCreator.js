/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.geometry.creators.PyramidCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.geometry.creators.PyramidCreator");
	
	var PyramidCreator = dbm.importClass("dbm.utils.geometry.creators.PyramidCreator");
	
	var Point = dbm.importClass("dbm.core.data.points.Point");
	
	var VectorFunctions = dbm.importClass("dbm.utils.math.VectorFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	var PlaneCreator = dbm.importClass("dbm.utils.geometry.creators.PlaneCreator");
	
	staticFunctions.createRectangularBox = function(aMesh, aX, aY, aZ, aHeight, aRadius, aNumberOfBasePoints, aHeightSections, aBaseSections) {
		
		//METODO
		
		return aMesh;
	};
});