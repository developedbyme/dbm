/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Static class for calculating gauss distributions.
 */
dbm.registerClass("com.developedbyme.utils.math.MatrixTransformation", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.MatrixTransformation");
	
	//Self reference
	var MatrixTransformation = dbm.importClass("com.developedbyme.utils.math.MatrixTransformation");
	
	/**
	 * Transforms a point with a matrix.
	 *
	 * @param	aMatrix			Matrix	The matrix to transform the point with. Should be a 3x3 matrix.
	 * @param	aInputPoint		Point	The point to transform.
	 * @param	aOutputPoint	Point	The point that gets the transformed values.
	 */
	staticFunctions.transform2dPoint = function(aMatrix, aInputPoint, aOutputPoint) {
		var matrixValuesArray = aMatrix.valuesArray;
		var inputXValue = aInputPoint.x;
		var inputYValue = aInputPoint.y;
		var invertedWeight = 1/(inputXValue*matrixValuesArray[6]+inputYValue*matrixValuesArray[7]+matrixValuesArray[8]);
		aOutputPoint.x = invertedWeight*(inputXValue*matrixValuesArray[0]+inputYValue*matrixValuesArray[1]+matrixValuesArray[2]);
		aOutputPoint.y = invertedWeight*(inputXValue*matrixValuesArray[3]+inputYValue*matrixValuesArray[4]+matrixValuesArray[5]);
	};
	
	/**
	 * Transform a point set with a matrix.
	 *
	 * @param	aMatrix		Matrix		The matrix to transform the point set with. The matrix should be a 3x3 matrix.
	 * @param	aInputSet	PointSet	The set of points to be transform.
	 * @param	aOutputSet	PointSet	The set that gets all the transformed points.
	 */
	staticFunctions.transform2dPointSet = function(aMatrix, aInputSet, aOutputSet) {
		var valuesArray = aMatrix.valuesArray;
		var currentArray = aInputSet.pointsArray;
		var outputArray = aOutputSet.pointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			ClassReference.transform2dPoint(aMatrix, currentArray[i], outputArray[i]);
		}
	};
	
	/**
	 * Blends two point sets into one.
	 *
	 * @param	aParameter	Number		The parameter of how the blend is performed.
	 * @param	aInputSet1	PointSet	The first set of points to be blended from.
	 * @param	aInputSet2	PointSet	The secon set of points to be blended from.
	 * @param	aOutputSet	PointSet	The set that gets all the blended points.
	 */
	staticFunctions.blend2dPointSets = function(aParameter, aInputSet1, aInputSet2, aOutputSet) {
		//console.log("com.developedbyme.utils.math.MatrixTransformation::blend2dPointSets");
		//console.log(aParameter);
		
		var invertedParameter = (1-aParameter);
		var input1Array = aInputSet1.pointsArray;
		var input2Array = aInputSet2.pointsArray;
		var outputArray = aOutputSet.pointsArray;
		var theLength = input1Array.length;
		for(var i = 0; i < theLength; i++) {
			var input1Point = input1Array[i];
			var input2Point = input2Array[i];
			var outputPoint = outputArray[i];
			outputPoint.x = (invertedParameter*input1Point.x)+(aParameter*input2Point.x);
			outputPoint.y = (invertedParameter*input1Point.y)+(aParameter*input2Point.y);
		}
	};
	
	staticFunctions.transform3dPoint = function(aMatrix, aInputPoint, aOutputPoint) {
		var valuesArray = aMatrix.valuesArray;
		var inputXValue = aInputPoint.x;
		var inputYValue = aInputPoint.y;
		var inputZValue = aInputPoint.z;
		var invertedWeight = 1/(inputXValue*valuesArray[12]+inputYValue*valuesArray[13]+inputZValue*valuesArray[14]+valuesArray[15]);
		aOutputPoint.x = (inputXValue*valuesArray[0]+inputYValue*valuesArray[1]+inputZValue*valuesArray[2]+valuesArray[3])*invertedWeight;
		aOutputPoint.y = (inputXValue*valuesArray[4]+inputYValue*valuesArray[5]+inputZValue*valuesArray[6]+valuesArray[7])*invertedWeight;
		aOutputPoint.z = (inputXValue*valuesArray[8]+inputYValue*valuesArray[9]+inputZValue*valuesArray[10]+valuesArray[11])*invertedWeight;
	};
	
	staticFunctions.transform3dPointSet = function(aMatrix, aInputSet, aOutputSet) {
		//console.log("com.developedbyme.utils.math.MatrixTransformation::transform3dPointSet");
		var valuesArray = aMatrix.valuesArray;
		var currentArray = aInputSet.pointsArray;
		var outputArray = aOutputSet.pointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			ClassReference.transform3dPoint(aMatrix, currentArray[i], outputArray[i]);
		}
	};
		
	staticFunctions.blend3dPointSets = function(aParameter, aInputSet1, aInputSet2, aOutputSet) {
		//console.log("com.developedbyme.utils.math.MatrixTransformation::blend3dPointSets");
		//console.log(aParameter);
		
		var invertedParameter = (1-aParameter);
		var input1Array = aInputSet1.pointsArray;
		var input2Array = aInputSet2.pointsArray;
		var outputArray = aOutputSet.pointsArray;
		var theLength = input1Array.length;
		for(var i = 0; i < theLength; i++) {
			var input1Point = input1Array[i];
			var input2Point = input2Array[i];
			var outputPoint = outputArray[i];
			outputPoint.x = (invertedParameter*input1Point.x)+(aParameter*input2Point.x);
			outputPoint.y = (invertedParameter*input1Point.y)+(aParameter*input2Point.y);
			outputPoint.z = (invertedParameter*input1Point.z)+(aParameter*input2Point.z);
		}
	};
	
	staticFunctions.transformWeighted3dPoint = function(aMatrix, aInputPoint, aOutputPoint) {
		var valuesArray = aMatrix.valuesArray;
		var inputXValue = aInputPoint.x;
		var inputYValue = aInputPoint.y;
		var inputZValue = aInputPoint.z;
		var weight = (inputXValue*valuesArray[12]+inputYValue*valuesArray[13]+inputZValue*valuesArray[14]+valuesArray[15]);
		aOutputPoint.w = weight;
		var invertedWeight = 1/weight;
		aOutputPoint.x = (inputXValue*valuesArray[0]+inputYValue*valuesArray[1]+inputZValue*valuesArray[2]+valuesArray[3])*invertedWeight;
		aOutputPoint.y = (inputXValue*valuesArray[4]+inputYValue*valuesArray[5]+inputZValue*valuesArray[6]+valuesArray[7])*invertedWeight;
		aOutputPoint.z = (inputXValue*valuesArray[8]+inputYValue*valuesArray[9]+inputZValue*valuesArray[10]+valuesArray[11])*invertedWeight;
	};
	
	staticFunctions.transformWeighted3dPointSet = function(aMatrix, aInputSet, aOutputSet) {
		var valuesArray = aMatrix.valuesArray;
		var currentArray = aInputSet.pointsArray;
		var outputArray = aOutputSet.pointsArray;
		var theLength = currentArray.length;
		for(var i = -1; ++i < theLength;) {
			ClassReference.transformWeighted3dPoint(aMatrix, currentArray[i], outputArray[i]);
		}
	};
});