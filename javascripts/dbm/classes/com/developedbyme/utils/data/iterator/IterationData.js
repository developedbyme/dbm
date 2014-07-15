/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.iterator.IterationData", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.iterator.IterationData");
	
	//Self reference
	var IterationData = dbm.importClass("com.developedbyme.utils.data.iterator.IterationData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.iterator.ActiveIterationData::_init");
		
		this.superCall();
		
		this.position = 0;
		this.length = 0;
		this.array = null;
		
		return this;
	}; //End function _init
	
	/**
	 * Sets the array for this iteration.
	 *
	 * @return	self
	 */
	objectFunctions.setArray = function(aArray) {
		
		this.array = aArray;
		this.length = aArray.length;
		
		return this;
	}; //End function setArray
	
	/**
	 * Updates the cached length value. Only necessary to use if the data isn't added to an iteration.
	 *
	 * @return	self
	 */
	objectFunctions.updateLength = function() {
		this.length = this.array.length;
		
		return this;
	}; //End function updateLength
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.array = null;
		
		this.superCall();
	}; //End function setAllReferencesToNull
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "array":
				return false;
		}
		return this.superCall(aName);
	}; //End function _internalFunctionality_ownsVariable
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aArray	The array for for this iteration.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function(aArray) {
		var newIterationData = ClassReference._createAndInitClass(ClassReference);
		newIterationData.setArray(aArray);
		return newIterationData;
	}; //End function create
});