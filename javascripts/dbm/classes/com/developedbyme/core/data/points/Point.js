/**
 * A point.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.3.01
 */
dbm.registerClass("com.developedbyme.core.data.points.Point", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.points.Point");
	//"use strict";
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");

	/**
	 * Constructor
	 */
	objectFunctions._init = function _init() {
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
	objectFunctions.setupFromArray = function setupFromArray(aArray) {
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
	objectFunctions.duplicate = function duplicate() {
		var theObject = (new ClassReference()).init();
		theObject.x = this.x;
		theObject.y = this.y;
		theObject.z = this.z;
		theObject.w = this.w;
		return theObject;
	};
	
	objectFunctions.setValues = function create(aX, aY, aZ, aW) {
		//console.log("com.developedbyme.core.data.points.Point::setValues");
		//console.log(aX, aY, aZ, aW);
		this.x = VariableAliases.valueWithDefault(aX, 0);
		this.y = VariableAliases.valueWithDefault(aY, 0);
		this.z = VariableAliases.valueWithDefault(aZ, 0);
		this.w = VariableAliases.valueWithDefault(aW, 1);
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function _toString_getAttributes(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("x: " + this.x);
		aReturnArray.push("y: " + this.y);
		aReturnArray.push("z: " + this.z);
		
	}
	
	staticFunctions.create = function create(aX, aY, aZ, aW) {
		//console.log("com.developedbyme.core.data.points.Point::create (static)");
		//console.log(aX, aY, aZ, aW);
		var newPoint = (new Point()).init();
		newPoint.x = VariableAliases.valueWithDefault(aX, 0);
		newPoint.y = VariableAliases.valueWithDefault(aY, 0);
		newPoint.z = VariableAliases.valueWithDefault(aZ, 0);
		newPoint.w = VariableAliases.valueWithDefault(aW, 1);
		
		return newPoint;
	};
	
	staticFunctions.getLengthOfVectorValues2d = function getLengthOfVectorValues2d(aX, aY) {
		//console.log("com.developedbyme.core.data.points.Point::getLengthOfVectorValues2d (static)");
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2));
	};
	
	staticFunctions.getLengthOfVectorValues3d = function getLengthOfVectorValues3d(aX, aY, aZ) {
		//console.log("com.developedbyme.core.data.points.Point::getLengthOfVectorValues3d (static)");
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2)+Math.pow(aY, 3));
	};
	
	staticFunctions.copyPointValues3d = function copyPointValues3d(aInputPoint, aOutputPoint) {
		//console.log("com.developedbyme.core.data.points.Point::copyPointValues3d (static)");
		aOutputPoint.x = aInputPoint.x;
		aOutputPoint.y = aInputPoint.y;
		aOutputPoint.z = aInputPoint.z;
	};
});