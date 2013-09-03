/**
 * Static class for matrix functions.
 *
 * @authur Mattias Ekendahl (mattias@developedbyme.com)
 * @version 0.0.01
 */
dbm.registerClass("com.developedbyme.utils.math.MatrixFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.math.MatrixFunctions");
	
	var MatrixFunctions = dbm.importClass("com.developedbyme.utils.math.MatrixFunctions");
	
	staticFunctions.scaleMatrix = function(aScale, aInputMatrix, aOutputMatrix) {
		
		var sizeH = aInputMatrix.sizeH;
		var sizeV = aInputMatrix.sizeV;
		
		for(var i = 0; i < sizeH; i++) {
			for(var j = 0; j < sizeV; j++) {
				aOutputMatrix.setValue(i, j, aScale*aInputMatrix.getValue(i, j))
			}
		}
	};
	
	staticFunctions.transposeMatrix = function(aInputMatrix, aOutputMatrix) {
		
		var sizeH = aInputMatrix.sizeH;
		var sizeV = aInputMatrix.sizeV;
		
		var outputSizeH = aOutputMatrix.sizeH;
		var outputSizeV = aOutputMatrix.sizeV;
		
		if(sizeH !== outputSizeV || sizeV !== outputSizeH) {
			//METODO: error message
			return;
		}
		
		if(sizeH === sizeV) {
			ClassReference.transposeQuadraticMatrix(aInputMatrix, aOutputMatrix);
			return;
		}
		
		for(var i = 0; i < sizeH; i++) {
			for(var j = 0; j < sizeV; j++) {
				aOutputMatrix.setValue(j, i, aInputMatrix.getValue(i, j))
			}
		}
	};
	
	staticFunctions.transposeQuadraticMatrix = function(aInputMatrix, aOutputMatrix) {
		for(var i = 0; i < sizeH; i++) {
			aOutputMatrix.setValue(i, i, aInputMatrix.getValue(i, i));
			for(var j = i+1; j < sizeV; j++) {
				var value1 = aInputMatrix.getValue(i, j);
				var value2 = aInputMatrix.getValue(j, i);
				aOutputMatrix.setValue(j, i, value1);
				aOutputMatrix.setValue(i, j, value2);
			}
		}
	};
	
	staticFunctions.getDeterminant4x4Matrix = function(aMatrix) {
		//MENOTE: implemented from http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		
		var m00 = aMatrix.getValue(0, 0);
		var m01 = aMatrix.getValue(0, 1);
		var m02 = aMatrix.getValue(0, 2);
		var m03 = aMatrix.getValue(0, 3);
		var m10 = aMatrix.getValue(1, 0);
		var m11 = aMatrix.getValue(1, 1);
		var m12 = aMatrix.getValue(1, 2);
		var m13 = aMatrix.getValue(1, 3);
		var m20 = aMatrix.getValue(2, 0);
		var m21 = aMatrix.getValue(2, 1);
		var m22 = aMatrix.getValue(2, 2);
		var m23 = aMatrix.getValue(2, 3);
		var m30 = aMatrix.getValue(3, 0);
		var m31 = aMatrix.getValue(3, 1);
		var m32 = aMatrix.getValue(3, 2);
		var m33 = aMatrix.getValue(3, 3);
		
		return  m03*m12*m21*m30-m02*m13*m21*m30-m03*m11*m22*m30+m01*m13*m22*m30+m02*m11*m23*m30-m01*m12*m23*m30-m03*m12*m20*m31+m02*m13*m20*m31+m03*m10*m22*m31-m00*m13*m22*m31-m02*m10*m23*m31+m00*m12*m23*m31+m03*m11*m20*m32-m01*m13*m20*m32-m03*m10*m21*m32+m00*m13*m21*m32+m01*m10*m23*m32-m00*m11*m23*m32-m02*m11*m20*m33+m01*m12*m20*m33+m02*m10*m21*m33-m00*m12*m21*m33-m01*m10*m22*m33+m00*m11*m22*m33;
	};
	
	staticFunctions.getInverted4x4Matrix = function(aMatrix, aOutputMatrix) {
		//MENOTE: implemented from http://stackoverflow.com/questions/2624422/efficient-4x4-matrix-inverse-affine-transform
		
		var m00 = aMatrix.getValue(0, 0);
		var m01 = aMatrix.getValue(0, 1);
		var m02 = aMatrix.getValue(0, 2);
		var m03 = aMatrix.getValue(0, 3);
		var m10 = aMatrix.getValue(1, 0);
		var m11 = aMatrix.getValue(1, 1);
		var m12 = aMatrix.getValue(1, 2);
		var m13 = aMatrix.getValue(1, 3);
		var m20 = aMatrix.getValue(2, 0);
		var m21 = aMatrix.getValue(2, 1);
		var m22 = aMatrix.getValue(2, 2);
		var m23 = aMatrix.getValue(2, 3);
		var m30 = aMatrix.getValue(3, 0);
		var m31 = aMatrix.getValue(3, 1);
		var m32 = aMatrix.getValue(3, 2);
		var m33 = aMatrix.getValue(3, 3);
		
		var s0 = m00 * m11 - m10 * m01;
		var s1 = m00 * m12 - m10 * m02;
		var s2 = m00 * m13 - m10 * m03;
		var s3 = m01 * m12 - m11 * m02;
		var s4 = m01 * m13 - m11 * m03;
		var s5 = m02 * m13 - m12 * m03;

		var c5 = m22 * m33 - m32 * m23;
		var c4 = m21 * m33 - m31 * m23;
		var c3 = m21 * m32 - m31 * m22;
		var c2 = m20 * m33 - m30 * m23;
		var c1 = m20 * m32 - m30 * m22;
		var c0 = m20 * m31 - m30 * m21;
		
		var scale = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);
		
		aOutputMatrix.setValue(0, 0, scale*( m11 * c5 - m12 * c4 + m13 * c3));
		aOutputMatrix.setValue(0, 1, scale*(-m01 * c5 + m02 * c4 - m03 * c3));
		aOutputMatrix.setValue(0, 2, scale*( m31 * s5 - m32 * s4 + m33 * s3));
		aOutputMatrix.setValue(0, 3, scale*(-m21 * s5 + m22 * s4 - m23 * s3));
		aOutputMatrix.setValue(1, 0, scale*(-m10 * c5 + m12 * c2 - m13 * c1));
		aOutputMatrix.setValue(1, 1, scale*( m00 * c5 - m02 * c2 + m03 * c1));
		aOutputMatrix.setValue(1, 2, scale*(-m30 * s5 + m32 * s2 - m33 * s1));
		aOutputMatrix.setValue(1, 3, scale*( m20 * s5 - m22 * s2 + m23 * s1));
		aOutputMatrix.setValue(2, 0, scale*( m10 * c4 - m11 * c2 + m13 * c0));
		aOutputMatrix.setValue(2, 1, scale*(-m00 * c4 + m01 * c2 - m03 * c0));
		aOutputMatrix.setValue(2, 2, scale*( m30 * s4 - m31 * s2 + m33 * s0));
		aOutputMatrix.setValue(2, 3, scale*(-m20 * s4 + m21 * s2 - m23 * s0));
		aOutputMatrix.setValue(3, 0, scale*(-m10 * c3 + m11 * c1 - m12 * c0));
		aOutputMatrix.setValue(3, 1, scale*( m00 * c3 - m01 * c1 + m02 * c0));
		aOutputMatrix.setValue(3, 2, scale*(-m30 * s3 + m31 * s1 - m32 * s0));
		aOutputMatrix.setValue(3, 3, scale*( m20 * s3 - m21 * s1 + m22 * s0));
		
		
	};
});