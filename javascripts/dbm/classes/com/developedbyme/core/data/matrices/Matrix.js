/**
 * A 2d matrix with dynamic size.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.3.01
 */
dbm.registerClass("com.developedbyme.core.data.matrices.Matrix", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.matrices.Matrix");
	
	var Matrix = dbm.importClass("com.developedbyme.core.data.matrices.Matrix");

	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.matrices.Matrix::_init");
		
		this.superCall();
		
		this.sizeH = 0;
		this.sizeV = 0;
		this.valuesArray = null;
		
		return this;
	};
	
	/**
	 * Sets up and creates all the values in the matrix
	 */
	objectFunctions.setupSize = function(aSizeH, aSizeV) {
		//console.log("com.developedbyme.core.data.matrices.Matrix::setupSize");
		//console.log(aSizeH, aSizeV);
		this.sizeH = aSizeH;
		this.sizeV = aSizeV;
		var currentArray = new Array(aSizeH*aSizeV);
		this.valuesArray = currentArray;
		this.reset();
	};
	
	/**
	 * Resets the matrix by setting all values to 0.
	 */
	objectFunctions.reset = function() {
		var currentArray = this.valuesArray;
		var theLength = currentArray.length;
		for(var i = -1; ++i < theLength;) {
			currentArray[i] = 0;
		}
	};
	
	/**
	 * Sets the matrix values to an identity matrix. Only possible when the horisontal size and vertical size are the same.
	 */
	objectFunctions.setAsIdentityMatrix = function() {
		if(this.sizeH != this.sizeV) {
			//METODO: error message
			return;
		}
		this.reset();
		var theSize = this.sizeH;
		var currentArray = this.valuesArray;
		for(var i = -1; ++i < theSize;) {
			currentArray[i*(theSize+1)] = 1;
		}
	};
	
	/**
	 * Sets a value in the matrix.
	 *
	 * @param	aX		The x postion of the matrix
	 * @param	aY		The y position of the matrix
	 * @param	aValue	The value to set at the position
	 */
	objectFunctions.setValue = function(aX, aY, aValue) {
		var currentArray = this.valuesArray;
		currentArray[this.sizeH*aY+aX] = aValue;
	};
	
	/**
	 * Gets a value in the matrix.
	 *
	 * @param	aX	The x postion of the matrix
	 * @param	aY	The y position of the matrix
	 * @return	The value to set at the position
	 */
	objectFunctions.getValue = function(aX, aY) {
		var currentArray = this.valuesArray;
		return currentArray[this.sizeH*aY+aX];
	};
	
	/**
	 * Duplicates the matrix.
	 *
	 * @return	The new matrix.
	 */
	objectFunctions.duplicate = function() {
		return ClassReference.duplicateMatrix(this);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this.valuesArray != null) {
			aReturnArray.push("values: [" + this.valuesArray.join(", ") + "]");
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.valuesArray = null;
		
		this.superCall();
	};
	
	/**
	 * Duplicates a matrix
	 *
	 * @param	aMatrix	The matrix to be duplicated.
	 * @return	The new matrix.
	 */
	staticFunctions.duplicateMatrix = function(aMatrix) {
		var newMatrix = (new Matrix()).init();
		newMatrix.setupSize(aMatrix.sizeH, aMatrix.sizeV);
		var currentArray = aMatrix.valuesArray;
		var outputArray = newMatrix.valuesArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			outputArray[i] = currentArray[i];
		}
		return newMatrix;
	};
	
	/**
	 * Multiplies two matrices.
	 *
	 * @param	aInputMatrix1	The first (left) matrix in the multiplication.
	 * @param	aInputMatrix2	The second (right) matrix in the multiplication.
	 * @param	aOutputMatrix	The matrix that is the result of the multiplication.
	 */
	staticFunctions.multiplyMatrices = function(aInputMatrix1, aInputMatrix2, aOutputMatrix) {
		//console.log("com.developedbyme.core.data.matrices.Matrix.(static)multiplyMatrices");
		
		var inputValuesArray1 = aInputMatrix1.valuesArray;
		var inputValuesArray2 = aInputMatrix2.valuesArray;
		var outputValuesArray = aOutputMatrix.valuesArray;
		
		var loopCount1 = aInputMatrix1.sizeV;
		var loopCount2 = aInputMatrix2.sizeH;
		var loopCount3 = aInputMatrix1.sizeH;
		
		for(var i = -1; ++i < loopCount1;) {
			for(var j = -1; ++j < loopCount2;) {
				var newValue = 0;
				for(var k = -1; ++k < loopCount3;) {
					newValue += inputValuesArray1[i*loopCount3+k]*inputValuesArray2[k*loopCount2+j];
				}
				outputValuesArray[loopCount2*i+j] = newValue;
			}
		}
	};
	
	/**
	 * Creates a new matrix.
	 *
	 * @param	aWidth	The width of the matrix.
	 * @param	aHeight	The height of the matrix.
	 *
	 * @return	The new matrix
	 */
	staticFunctions.create = function(aWidth, aHeight) {
		//console.log("com.developedbyme.core.data.matrices.Matrix::create (static)");
		//console.log(aWidth, aHeight);
		var newMatrix = (new ClassReference()).init();
		newMatrix.setupSize(aWidth, aHeight);
		return newMatrix;
	};
	
	/**
	 * Creates a new identity matrix.
	 *
	 * @param	aWidth	The width of the matrix.
	 * @param	aHeight	The height of the matrix.
	 *
	 * @return	The new matrix
	 */
	staticFunctions.createIdentity = function(aWidth, aHeight) {
		//console.log("com.developedbyme.core.data.matrices.Matrix::createIdentity (static)");
		//console.log(aWidth, aHeight);
		var newMatrix = (new ClassReference()).init();
		newMatrix.setupSize(aWidth, aHeight);
		newMatrix.setAsIdentityMatrix();
		return newMatrix;
	};
	
	staticFunctions.createWithValues = function(aWidth, aHeight, aValues) {
		//console.log("com.developedbyme.core.data.matrices.Matrix::createWithValues (static)");
		//console.log(aWidth, aHeight, aValues);
		var newMatrix = (new ClassReference()).init();
		newMatrix.setupSize(aWidth, aHeight);
		var currentArray = aValues;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			newMatrix.valuesArray[i] = currentArray[i];
		}
		return newMatrix;
	};
});