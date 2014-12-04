/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.geometry.triangulation.DelaunayTriangulation", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.geometry.triangulation.DelaunayTriangulation");
	
	//Self reference
	var DelaunayTriangulation = dbm.importClass("dbm.utils.geometry.triangulation.DelaunayTriangulation");
	
	//Error report
	
	//Dependencies
	var Mesh = dbm.importClass("dbm.core.data.geometry.mesh.Mesh");
	
	//Utils
	var MeshFunctions = dbm.importClass("dbm.utils.geometry.MeshFunctions");
	
	//Constants
	
	
	staticFunctions.addInternalPoint = function(aMesh, aPoint) {
		//METODO
	};
	
	staticFunctions.createSuperTriangleForPointSet = function(aPointsArray) {
		
		
		var returnMesh = Mesh.create();
		
		var bottomIndex = MeshFunctions.getMaxPoint2d(aPointsArray, -0.5*Math.PI);
		var leftIndex = MeshFunctions.getMaxPoint2d(aPointsArray, (-0.5-2/3)*Math.PI);
		var rightIndex = MeshFunctions.getMaxPoint2d(aPointsArray, (-0.5+2/3)*Math.PI);
		
		//METODO
		
		return returnMesh;
	};
});