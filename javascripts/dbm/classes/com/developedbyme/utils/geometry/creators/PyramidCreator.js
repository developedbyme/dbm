dbm.registerClass("com.developedbyme.utils.geometry.creators.PyramidCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.geometry.creators.PyramidCreator");
	
	var PyramidCreator = dbm.importClass("com.developedbyme.utils.geometry.creators.PyramidCreator");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var PlaneCreator = dbm.importClass("com.developedbyme.utils.geometry.creators.PlaneCreator");
	
	staticFunctions.createRectangularBox = function(aMesh, aX, aY, aZ, aHeight, aRadius, aNumberOfBasePoints, aHeightSections, aBaseSections) {
		
		//METODO
		
		return aMesh;
	};
});