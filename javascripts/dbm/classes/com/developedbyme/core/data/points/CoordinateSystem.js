/**
 * A coordination system.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.2.02
 */
dbm.registerClass("com.developedbyme.core.data.points.CoordinateSystem", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.points.CoordinateSystem");

	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");
	var MatrixTransformation = dbm.importClass("com.developedbyme.utils.math.MatrixTransformation");
	
	staticFunctions._tempTransformationMatrix = null;
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.points.CoordinateSystem");
		
		this.superCall();
		
		this.origoPoint = (new Point()).init();
		this.xVector = (new Point()).init();
		this.yVector = (new Point()).init();
		
		if(ClassReference._tempTransformationMatrix === null) {
			ClassReference._tempTransformationMatrix = (new Matrix()).init();
			ClassReference._tempTransformationMatrix.setupSize(3, 3);
			ClassReference._tempTransformationMatrix.setAsIdentityMatrix();
		}
		
		return this;
	};
	
	/**
	 * Sets up the coordinate system to match normal space.
	 */
	objectFunctions.setAsNormalCoordinateSystem = function() {
		//console.log("com.developedbyme.core.data.points.CoordinateSystem.setAsNormalCoordinateSystem");
		
		this.origoPoint.x = 0;
		this.origoPoint.y = 0;
		this.xVector.x = 1;
		this.xVector.y = 0;
		this.yVector.x = 0;
		this.yVector.y = 1;
		
		return this;
	};
	
	/**
	 * Gets a matrix that transform points in this coordinate system space to normal space. Retun matrix is not affected on the last row (so it needs to be set to identity matrix before).
	 *
	 * @param	aReturnMatrix	The matrix that gets the transformation values.
	 */
	objectFunctions.getFromTransformationMatrix = function(aReturnMatrix) {
		//console.log("com.developedbyme.core.data.points.CoordinateSystem.getFromTransformationMatrix");
		
		//MENOTE: translation
		aReturnMatrix.valuesArray[2] = this.origoPoint.x;
		aReturnMatrix.valuesArray[5] = this.origoPoint.y;
		
		//MENOTE: x-vector
		aReturnMatrix.valuesArray[0] = this.origoPoint.x+this.xVector.x;
		aReturnMatrix.valuesArray[3] = this.origoPoint.y+this.xVector.y;
		
		//MENOTE: y-vector
		aReturnMatrix.valuesArray[1] = this.origoPoint.x+this.yVector.x;
		aReturnMatrix.valuesArray[4] = this.origoPoint.y+this.yVector.y;
	};
	
	/**
	 * Gets a matrix that transform points in normal space to this coordinate system space. Retun matrix is not affected on the last row (so it needs to be set to identity matrix before).
	 *
	 * @param	aReturnMatrix	The matrix that gets the transformation values.
	 */
	objectFunctions.getToTransformationMatrix = function(aReturnMatrix) {
		//console.log("com.developedbyme.core.data.points.CoordinateSystem.getFromTransformationMatrix");
		
		var translateX = (-1)*this.origoPoint.x;
		var translateY = (-1)*this.origoPoint.y;
		
		var returnArray = aReturnMatrix.valuesArray;
		
		if(this.xVector.y === 0) {
			returnArray[0] = 1/this.xVector.x;
			returnArray[1] = -1*returnArray[0]*(this.yVector.x)/(this.yVector.y);
		}
		else if(this.xVector.x === 0) {
			returnArray[1] = 1/this.xVector.y;
			returnArray[0] = -1*returnArray[1]*(this.yVector.y)/(this.yVector.x);
		}
		else {
			returnArray[0] = 1/(this.xVector.x*this.yVector.y/this.yVector.x+this.xVector.y);
			returnArray[1] = -1*returnArray[0]*(this.yVector.x)/(this.yVector.y);
		}
		returnArray[2] = returnArray[0]*translateX+returnArray[1]*translateY;

		if(this.yVector.y === 0) {
			returnArray[3] = 1/this.yVector.x;
			returnArray[4] = -1*returnArray[0]*(this.xVector.x)/(this.xVector.y);
		}
		else if(this.yVector.x === 0) {
			returnArray[4] = 1/this.yVector.y;
			returnArray[3] = -1*returnArray[1]*(this.xVector.y)/(this.xVector.x);
		}
		else {
			returnArray[3] = 1/(this.yVector.x*this.xVector.y/this.xVector.x+this.yVector.y);
			returnArray[4] = -1*returnArray[0]*(this.xVector.x)/(this.xVector.y);
		}
		returnArray[5] = returnArray[3]*translateX+returnArray[4]*translateY;
	};
	
	/**
	 * Transforms a point set to the coordinate system space from normal space.
	 *
	 * @param	aInputPointSet	The point set with points in normal space.
	 * @param	aOutputPointSet	The point set with the transformed points in this coordinate system space. 
	 */
	objectFunctions.transformPointSetToCoordinateSystem = function(aInputPointSet, aOutputPointSet) {
		//console.log("com.developedbyme.core.data.points.CoordinateSystem.transformPointSetToCoordinateSystem");
		
		this.getToTransformationMatrix(ClassReference._tempTransformationMatrix);
		MatrixTransformation.transform2dPointSet(ClassReference._tempTransformationMatrix, aInputPointSet, aOutputPointSet);
		
	};
	
	/**
	 * Transforms a point set to normal space from the coordinate system space.
	 *
	 * @param	aInputPointSet	The point set with points in this coordinate system space.
	 * @param	aOutputPointSet	The point set with the transformed points in this normal space. 
	 */
	objectFunctions.transformPointSetFromCoordinateSystem = function(aInputPointSet, aOutputPointSet) {
		//console.log("com.developedbyme.core.data.points.CoordinateSystem.transformPointSetFromCoordinateSystem");
		this.getFromTransformationMatrix(ClassReference._tempTransformationMatrix);
		MatrixTransformation.transform2dPointSet(ClassReference._tempTransformationMatrix, aInputPointSet, aOutputPointSet);
	};
});