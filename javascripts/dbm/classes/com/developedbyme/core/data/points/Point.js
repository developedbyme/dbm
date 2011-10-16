/**
 * A point.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.3.01
 */
dbm.registerClass("com.developedbyme.core.data.points.Point", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.points.Point");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");

	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
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
	
	staticFunctions.create = function(aX, aY, aZ, aW) {
		//console.log("com.developedbyme.core.data.points.Point::create (static)");
		//console.log(aX, aY, aZ, aW);
		var newPoint = (new Point()).init();
		newPoint.x = VariableAliases.valueWithDefault(aX, 0);
		newPoint.y = VariableAliases.valueWithDefault(aY, 0);
		newPoint.z = VariableAliases.valueWithDefault(aZ, 0);
		newPoint.w = VariableAliases.valueWithDefault(aW, 1);
		
		return newPoint;
	};
	
	staticFunctions.getLengthOfVectorValues2d = function(aX, aY) {
		//console.log("com.developedbyme.core.data.points.Point::getLengthOfVectorValues2d (static)");
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2));
	};
	
	staticFunctions.getLengthOfVectorValues3d = function(aX, aY, aZ) {
		//console.log("com.developedbyme.core.data.points.Point::getLengthOfVectorValues3d (static)");
		return Math.sqrt(Math.pow(aX, 2)+Math.pow(aY, 2)+Math.pow(aY, 3));
	};
});