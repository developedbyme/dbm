/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Holder of an array.
 * The purpose of this object is that it implements and destroy() function and destroys the array if it owns it.
 */
dbm.registerClass("com.developedbyme.utils.data.ArrayHolder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.ArrayHolder");
	//"use strict";
	
	//Self reference
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.ArrayHolder::_init");
		
		this.superCall();
		
		this.array = new Array();
		this.ownsObjects = false;
		
		return this;
	}; //End function _init
	
	/**
	 * Performs the destruction of this object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		
		if(this.ownsObjects) {
			ClassReference.destroyArrayIfExists(this.array);
		}
		
		this.superCall();
	};
	
	/**
	 * Sets all the refernences to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.array = null;
		
		this.superCall();
	};
	
	/**
	 * Checks if this object owns a specific variable. Part of the destroy function.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "array":
				return this.ownsObjects;
		}
		return this.superCall();
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aOwnsObjects	Boolean		If the array is owned by the new holder and should be destroyed when the holder is destroyed.
	 *
	 * @return	ArrayHolder	The newly created object.
	 */
	staticFunctions.create = function(aOwnsObjects) {
		//trace("breel.utils.data.ArrayHolder.create");
		var newArrayHolder = (new ArrayHolder()).init();
		newArrayHolder.ownsObjects = aOwnsObjects;
		return newArrayHolder;
	}; //End function create
	
	/**
	 * Creates a new holder from an existing array.
	 *
	 * @param	aArray			Array		The array that the new holder will hold.
	 * @param	aOwnsObjects	Boolean		If the array is owned by the new holder and should be destroyed when the holder is destroyed.
	 *
	 * @return	ArrayHolder	The newly created object.
	 */
	staticFunctions.createFromArray = function(aArray, aOwnsObjects) {
		//trace("breel.utils.data.ArrayHolder.createFromArray");
		var newArrayHolder = (new ArrayHolder()).init();
		newArrayHolder.array = aArray;
		newArrayHolder.ownsObjects = aOwnsObjects;
		return newArrayHolder;
	}; //End function createFromArray
});