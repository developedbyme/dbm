/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.data.matrices.TransformationMatrix3d", "com.developedbyme.core.data.matrices.Matrix", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.matrices.TransformationMatrix3d");

	staticFunctions.ROTATION_ORDER_XYZ = 0;
	staticFunctions.ROTATION_ORDER_XZY = 1;
	staticFunctions.ROTATION_ORDER_YXZ = 2;
	staticFunctions.ROTATION_ORDER_YZX = 3;
	staticFunctions.ROTATION_ORDER_ZXY = 4;
	staticFunctions.ROTATION_ORDER_ZYX = 5;
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.matrices.TransformationMatrix3d");
		
		this.superCall();
		
		this.setupSize(4, 4);
		this.setAsIdentityMatrix();
		
		return this;
	};
});