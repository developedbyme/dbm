dbm.registerClass("com.developedbyme.core.ExtendedEventBaseObject", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.ExtendedEventBaseObject");
	
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.ExtendedEventBaseObject::init");
		
		this.superCall();
		
		this._extendedEvent = null;
		
		return this;
	};
	
	objectFunctions.getExtendedEvent = function() {
		if(this._extendedEvent == null) {
			this._extendedEvent = ExtendedEventController.create(this);
			this.addDestroyableObject(this._extendedEvent);
		} 
		
		return this._extendedEvent;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//MENOTE: should be overridden
		
		return false;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEvent = null;
		
		this.superCall();
	};
});