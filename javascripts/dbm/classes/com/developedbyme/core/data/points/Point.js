/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A point.
 */
dbm.registerClass("com.developedbyme.core.data.points.Point", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.points.Point");
	//"use strict";
	
	//Self reference
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.points.Point");
		
		this.superCall();
		
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.w = 1;
		
		return this;
	};
	
	/**
	 * Sets up the values from the first two values in the array
	 *
	 * @param	aArray	An array containing the x and y value.
	 */
	objectFunctions.setupFromArray = function(aArray) {
		switch(aArray.length) {
			default:
			case 4:
				this.w = aArray[3];
			case 3:
				this.z = aArray[2];
			case 2:
				this.y = aArray[1];
			case 1:
				this.x = aArray[0];
			case 0:
		}
	};
	
	/**
	 * Duplicates the object without the data flow connections.
	 *
	 * @return	The newly created object.
	 */
	objectFunctions.duplicate = function() {
		var theObject = (new ClassReference()).init();
		theObject.x = this.x;
		theObject.y = this.y;
		theObject.z = this.z;
		theObject.w = this.w;
		return theObject;
	};
	
	objectFunctions.setValues = function(aX, aY, aZ, aW) {
		//console.log("com.developedbyme.core.data.points.Point::setValues");
		//console.log(aX, aY, aZ, aW);
		this.x = VariableAliases.valueWithDefault(aX, 0);
		this.y = VariableAliases.valueWithDefault(aY, 0);
		this.z = VariableAliases.valueWithDefault(aZ, 0);
		this.w = VariableAliases.valueWithDefault(aW, 1);
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("x: " + this.x);
		aReturnArray.push("y: " + this.y);
		aReturnArray.push("z: " + this.z);
		
	};
	
	staticFunctions.create = function(aX, aY, aZ, aW) {
		//console.log("com.developedbyme.core.data.points.Point::create (static)");
		//console.log(aX, aY, aZ, aW);
		var newPoint = ClassReference._createAndInitClass(ClassReference);
		newPoint.setValues(aX, aY, aZ, aW);
		
		return newPoint;
	};
	
	staticFunctions.getLengthOfVectorValues2d = function(aX, aY) {
		//console.log("com.developedbyme.core.data.points.Point::getLengthOfVectorValues2d (static)");
		//console.log(aX, aY);
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2));
	};
	
	staticFunctions.getLengthOfVectorValues3d = function(aX, aY, aZ) {
		//console.log("com.developedbyme.core.data.points.Point::getLengthOfVectorValues3d (static)");
		//console.log(aX, aY, aZ);
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2)+Math.pow(aZ, 2));
	};
	
	staticFunctions.copyPointValues3d = function(aInputPoint, aOutputPoint) {
		//console.log("com.developedbyme.core.data.points.Point::copyPointValues3d (static)");
		aOutputPoint.x = aInputPoint.x;
		aOutputPoint.y = aInputPoint.y;
		aOutputPoint.z = aInputPoint.z;
	};
	
	staticFunctions.adjustPointsArrayLength = function(aArray, aDifference) {
		if(aDifference < 0) {
			aDifference *= -1;
			for(var i = 0; i < aDifference; i++) {
				var currentPoint = aArray.pop();
				currentPoint.destroy();
			}
		}
		else {
			for(var i = 0; i < aDifference; i++) {
				aArray.push(ClassReference.create());
			}
		}
	};
	
	staticFunctions.setValues3d = function(aPoint, aX, aY, aZ) {
		aPoint.x = aX;
		aPoint.y = aY;
		aPoint.z = aZ;
	};
});