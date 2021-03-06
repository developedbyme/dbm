/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Holder of an array and a position of the current object.
 */
dbm.registerClass("dbm.utils.data.PositionedArrayHolder", "dbm.utils.data.ArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.PositionedArrayHolder");
	//"use strict";
	
	//Self reference
	var PositionedArrayHolder = dbm.importClass("dbm.utils.data.PositionedArrayHolder");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.PositionedArrayHolder::_init");
		
		this.superCall();
		
		this.position = 0;
		this.numberOfItems = 0;
		
		return this;
	}; //End function _init
	
	objectFunctions.push = function(aValue) {
		
		if(this.position === this.numberOfItems) {
			this.array.push(aValue);
			this.numberOfItems++;
		}
		else {
			this.array[this.position] = aValue;
		}
		this.position++;
	};
	
	/**
	 * Creates a new instance of this class.
	 *
	 * @param	aOwnsObjects	Boolean		If the array is owned by the new holder and should be destroyed when the holder is destroyed.
	 *
	 * @return	PositionedArrayHolder	The newly created object.
	 */
	staticFunctions.create = function(aOwnsObjects) {
		var newPositionedArrayHolder = ClassReference._createAndInitClass(ClassReference);
		newPositionedArrayHolder.ownsObjects = aOwnsObjects;
		return newPositionedArrayHolder;
	}; //End function create
	
	/**
	 * Creates a new holder from an existing array.
	 *
	 * @param	aArray			Array		The array that the new holder will hold.
	 * @param	aOwnsObjects	Boolean		If the array is owned by the new holder and should be destroyed when the holder is destroyed.
	 *
	 * @return	PositionedArrayHolder	The newly created object.
	 */
	staticFunctions.createFromArray = function(aArray, aOwnsObjects) {
		var newPositionedArrayHolder = ClassReference.create(aOwnsObjects);
		newPositionedArrayHolder.array = aArray;
		newPositionedArrayHolder.numberOfItems = aArray.length;
		return newPositionedArrayHolder;
	}; //End function createFromArray
});