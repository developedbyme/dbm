/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Data used to perform an extended event.
 */
dbm.registerClass("com.developedbyme.core.extendedevent.EventDataObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.EventDataObject");
	
	//Self reference
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.EventDataObject::_init");
		
		this.superCall();
		
		this.data = null;
		this.ownerObject = null;
		this.performingObject = null;
		
		this.resultsArray = ClassReference._createArray();
		this.statusData = null;
		
		return this;
	}; //End function _init
	
	/**
	 * Adds a result to this event data.
	 * 
	 * @param	aData	The data to store in the results array.
	 */
	objectFunctions.addResult = function(aData) {
		this.resultsArray.push(aData);
	}; //End function addResult
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("ownerObject: " + this.ownerObject);
		aReturnArray.push("performingObject: " + this.performingObject);
		aReturnArray.push("data: " + this.data);
		aReturnArray.push("statusData: " + this.statusData);
		aReturnArray.push("resultsArray: " + this.resultsArray);
	}; //End function _toString_getAttributes
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.data = null;
		this.ownerObject = null;
		this.performingObject = null;
		
		ClassReference._reuseArray(this.resultsArray);
		this.resultsArray = null;
		this.statusData = null;
		
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
			case "data":
			case "ownerObject":
			case "performingObject":
				return false;
		}
		return this.superCall();
	}; //End function _internalFunctionality_ownsVariable
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aData				Any						The data for the event.
	 * @param	aOwner				ExtendedEventBaseObject	The owner of this event.
	 * @param	aPerformingObject	Any						The object that is actually performing the event.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function(aData, aOwner, aPerformingObject) {
		//console.log("com.developedbyme.core.extendedevent.EventDataObject::create (static)");
		var newData = ClassReference._createAndInitClass(ClassReference);
		
		newData.data = aData;
		newData.ownerObject = aOwner;
		newData.performingObject = aPerformingObject;
		
		return newData;
	}; //End function create
});