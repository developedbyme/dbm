/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.EventDataObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.EventDataObject");
	
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.EventDataObject::_init");
		
		this.superCall();
		
		this.data = null;
		this.ownerObject = null;
		this.performingObject = null;

		this.resultsArray = new Array();
		this.statusData = null;
		
		return this;
	};
	
	/**
	 * Adds a result to this event data.
	 * 
	 * @param	aData	The data to store in the results array.
	 */
	objectFunctions.addResult = function(aData) {
		this.resultsArray.push(aData);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("ownerObject: " + this.ownerObject);
		aReturnArray.push("performingObject: " + this.performingObject);
		aReturnArray.push("data: " + this.data);
		aReturnArray.push("statusData: " + this.statusData);
		aReturnArray.push("resultsArray: " + this.resultsArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.data = null;
		this.ownerObject = null;
		this.performingObject = null;

		this.resultsArray = null;
		this.statusData = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "data":
			case "ownerObject":
			case "performingObject":
				return false;
		}
		return this.superCall();
	};
	
	staticFunctions.create = function(aData, aOwner, aPerformingObject) {
		//console.log("com.developedbyme.core.extendedevent.EventDataObject::create (static)");
		var newData = (new EventDataObject()).init();
		
		newData.data = aData;
		newData.ownerObject = aOwner;
		newData.performingObject = aPerformingObject;
		
		return newData;
	};
	
});