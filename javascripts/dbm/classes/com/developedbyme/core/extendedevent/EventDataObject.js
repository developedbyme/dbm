dbm.registerClass("com.developedbyme.core.extendedevent.EventDataObject", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.EventDataObject");
	
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.EventDataObject::init");
		
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
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.data = null;
		this.ownerObject = null;
		this.performingObject = null;

		this.resultsArray = null;
		this.statusData = null;
		
		this.superCall();
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