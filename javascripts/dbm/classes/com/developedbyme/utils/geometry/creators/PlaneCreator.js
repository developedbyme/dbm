dbm.registerClass("com.developedbyme.utils.geometry.creators.PlaneCreator", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.geometry.creators.PlaneCreator");
	
	var PlaneCreator = dbm.importClass("com.developedbyme.utils.geometry.creators.PlaneCreator");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.createSimpleXYPlane = function(aMesh, aX, aY, aWidth, aHeight, aSectionsHorizontal, aSectionsVertical, aMinU, aMinV, aMaxU, aMaxV) {
		aX = VariableAliases.valueWithDefault(aX, 0);
		aY = VariableAliases.valueWithDefault(aX, 0);
		aWidth = VariableAliases.valueWithDefault(aWidth, 1);
		aHeight = VariableAliases.valueWithDefault(aHeight, 1);
		aSectionsHorizontal = VariableAliases.valueWithDefault(aSectionsHorizontal, 3);
		aSectionsVertical = VariableAliases.valueWithDefault(aSectionsVertical, 3);
		aMinU = VariableAliases.valueWithDefault(aMinU, 0);
		aMinV = VariableAliases.valueWithDefault(aMinV, 0);
		aMaxU = VariableAliases.valueWithDefault(aMaxU, 1);
		aMaxV = VariableAliases.valueWithDefault(aMaxV, 1);
		
		var numberOfFaces = 2*(aSectionsVertical)*(aSectionsHorizontal);
		var verticesArray = new Array((aSectionsVertical+1)*(aSectionsHorizontal+1));
		
		for(var i = 0; i <= aSectionsVertical; i++) {
			var verticalParameter = i/aSectionsVertical;
			for(var j = 0; j <= aSectionsHorizontal; j++) {
				var horizontalParameter = j/aSectionsHorizontal;
				var newIndex = aMesh.createVertex(aX+horizontalParameter*aWidth, aY+verticalParameter*aHeight, 0, (aMaxU-aMinU)*horizontalParameter+aMinU, (aMaxV-aMinV)*verticalParameter+aMinV);
				verticesArray[i*(aSectionsVertical+1)+j] = newIndex;
			}
		}
		
		ClassReference.createFacesFromGridVertecies(aMesh, verticesArray, aSectionsHorizontal, aSectionsVertical);
		
		return aMesh;
	};
	
	staticFunctions.createPlane = function(aMesh, aPoint, aHorizontalVector, aVerticalVector, aSectionsHorizontal, aSectionsVertical, aUvPoint, aUvHorizontalVector, aUvVerticalVector) {
		console.log("com.developedbyme.utils.geometry.creators.PlaneCreator::createPlane");
		var horizontalMoveVector = aHorizontalVector.duplicate();
		VectorFunctions.multiply3d((1/(aSectionsHorizontal)), horizontalMoveVector, horizontalMoveVector);
		var verticalMoveVector = aVerticalVector.duplicate();
		VectorFunctions.multiply3d((1/(aSectionsVertical)), verticalMoveVector, verticalMoveVector);
		var tempHorizontalVector = Point.create();
		var tempVerticalVector = Point.create();
		
		var uvHorizontalMoveVector = aUvHorizontalVector.duplicate();
		VectorFunctions.multiply3d((1/(aSectionsHorizontal)), uvHorizontalMoveVector, uvHorizontalMoveVector);
		var uvVerticalMoveVector = aUvVerticalVector.duplicate();
		VectorFunctions.multiply2d((1/(aSectionsVertical)), uvVerticalMoveVector, uvVerticalMoveVector);
		var tempUvHorizontalVector = Point.create();
		var tempUvVerticalVector = Point.create();
		
		var verticesArray = new Array((aSectionsVertical+1)*(aSectionsHorizontal+1));
		
		for(var i = 0; i <= aSectionsVertical; i++) {
			var verticalParameter = i/aSectionsVertical;
			
			tempHorizontalVector.setValues(0, 0, 0);
			tempUvHorizontalVector.setValues(0, 0, 0);
			
			for(var j = 0; j <= aSectionsHorizontal; j++) {
				var horizontalParameter = j/aSectionsHorizontal;
				
				var newIndex = aMesh.createVertex(
					aPoint.x+tempHorizontalVector.x+tempVerticalVector.x,
					aPoint.y+tempHorizontalVector.y+tempVerticalVector.y,
					aPoint.z+tempHorizontalVector.z+tempVerticalVector.z,
					aUvPoint.x+tempUvHorizontalVector.x+tempUvVerticalVector.x,
					aUvPoint.y+tempUvHorizontalVector.y+tempUvVerticalVector.y
				);
				verticesArray[i*(aSectionsVertical+1)+j] = newIndex;
				
				VectorFunctions.add3d(tempHorizontalVector, horizontalMoveVector, tempHorizontalVector);
				VectorFunctions.add2d(tempUvHorizontalVector, uvHorizontalMoveVector, tempUvHorizontalVector);
			}
			
			VectorFunctions.add3d(tempVerticalVector, verticalMoveVector, tempVerticalVector);
			VectorFunctions.add2d(tempUvVerticalVector, uvVerticalMoveVector, tempUvVerticalVector);
		}
		
		ClassReference.createFacesFromGridVertecies(aMesh, verticesArray, aSectionsHorizontal, aSectionsVertical);
		
		return aMesh;
	};
	
	staticFunctions.createFacesFromGridVertecies = function(aMesh, aIndexesArray, aSectionsHorizontal, aSectionsVertical) {
		for(var i = 0; i < aSectionsVertical; i++) {
			for(var j = 0; j < aSectionsHorizontal; j++) {
				var vertexIndex1 = aIndexesArray[i*(aSectionsVertical+1)+j];
				var vertexIndex2 = aIndexesArray[i*(aSectionsVertical+1)+j+1];
				var vertexIndex3 = aIndexesArray[(i+1)*(aSectionsVertical+1)+j];
				var vertexIndex4 = aIndexesArray[(i+1)*(aSectionsVertical+1)+j+1];
				
				aMesh.createFace(vertexIndex1, vertexIndex2, vertexIndex3);
				aMesh.createFace(vertexIndex3, vertexIndex2, vertexIndex4);
			}
		}
		
		return aMesh;
	};
});