/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.data.geometry.mesh.PointMesh", "com.developedbyme.utils.data.MultidimensionalArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.geometry.mesh.PointMesh");
	
	//Self reference
	var PointMesh = dbm.importClass("com.developedbyme.core.data.geometry.mesh.PointMesh");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.geometry.mesh.PointMesh::_init");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.create2d = function(aNumberOfPointsX, aNumberOfPointsY, aX, aY, aWidth, aHeight) {
		//console.log("com.developedbyme.core.data.geometry.mesh.PointMesh::create2d");
		var newPointMesh = (new PointMesh()).init();
		
		newPointMesh.setLengths([aNumberOfPointsX, aNumberOfPointsY]);
		
		for(var i = 0; i < aNumberOfPointsX; i++) {
			for(var j = 0; j < aNumberOfPointsY; j++) {
				newPointMesh.setValue(i, j, Point.create(i/(aNumberOfPointsX-1)*aWidth+aX), j/(aNumberOfPointsY-1)*aHeight+aY));
			}
		}
		
		return newPointMesh;
	};
});