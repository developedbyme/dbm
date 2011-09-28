/**
 * A rectangle.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.1.01
 */
dbm.registerClass("com.developedbyme.core.data.geometry.Rectangle", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.geometry.Rectangle");
	
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");

	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.data.geometry.Rectangle");
		
		this.superCall();
		
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		
		return this;
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
		theObject.width = this.width;
		theObject.height = this.height;
		return theObject;
	};
	
	staticFunctions.create = function(aX, aY, aWidth, aHeight) {
		//console.log("com.developedbyme.core.data.geometry.Rectangle::create (static)");
		//console.log(aX, aY, aWidth, aHeight);
		var newRectangle = (new Rectangle()).init();
		newRectangle.x = aX
		newRectangle.y = aY
		newRectangle.width = aWidth;
		newRectangle.height = aHeight;
		
		return newRectangle;
	};
});