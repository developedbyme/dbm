/**
 * A rectangle.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.1.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.data.geometry.Rectangle", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.geometry.Rectangle");
	
	var Rectangle = dbm.importClass("com.developedbyme.core.data.geometry.Rectangle");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
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
		newRectangle.x = VariableAliases.valueWithDefault(aX, 0);
		newRectangle.y = VariableAliases.valueWithDefault(aY, 0);
		newRectangle.width = VariableAliases.valueWithDefault(aWidth, 0);
		newRectangle.height = VariableAliases.valueWithDefault(aHeight, 0);
		
		return newRectangle;
	};
});