/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.data.matrices.TransformationMatrix3d", "com.developedbyme.core.data.matrices.Matrix", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.matrices.TransformationMatrix3d");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.matrices.TransformationMatrix3d");
		
		this.superCall();
		
		this.setupSize(4, 4);
		this.setAsIdentityMatrix();
		
		return this;
	};
	
	staticFunctions.setRotationX = function(aMatrix, aRotation) {
		
		ClassReference.setRotationForPositions(aMatrix, aRotation, 1, 2);
		
	};
	
	staticFunctions.setRotationY = function(aMatrix, aRotation) {
		
		ClassReference.setRotationForPositions(aMatrix, aRotation, 2, 0);
		
	};
	
	staticFunctions.setRotationZ = function(aMatrix, aRotation) {
		
		ClassReference.setRotationForPositions(aMatrix, aRotation, 0, 1);
		
	};
	
	staticFunctions.setRotationForPositions = function(aMatrix, aRotation, aPosition1, aPosition2) {
		var sinValue = Math.sin(aRotation);
		var cosValue = Math.cos(aRotation);
		
		aMatrix.setAsIdentityMatrix();
		aMatrix.setValue(aPosition1, aPosition1, cosValue);
		aMatrix.setValue(aPosition2, aPosition1, sinValue);
		aMatrix.setValue(aPosition1, aPosition2, -1*sinValue);
		aMatrix.setValue(aPosition2, aPosition2, cosValue);
	}
});