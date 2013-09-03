dbm.registerClass("com.developedbyme.core.ExtendedEventBaseObject", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.ExtendedEventBaseObject");
	//"use strict";
	
	var ExtendedEventBaseObject = dbm.importClass("com.developedbyme.core.ExtendedEventBaseObject");
	
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	var DelayedExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.DelayedExtendedEventController");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.ExtendedEventBaseObject::_init");
		
		this.superCall();
		
		this._extendedEvent = null;
		this._delayedExtendedEvent = null;
		
		return this;
	};
	
	objectFunctions.getExtendedEvent = function() {
		if(this._extendedEvent === null) {
			this._extendedEvent = ExtendedEventController.create(this);
			this.addDestroyableObject(this._extendedEvent);
		} 
		
		return this._extendedEvent;
	};
	
	objectFunctions.getDelayedExtendedEvent = function() {
		if(this._delayedExtendedEvent === null) {
			this._delayedExtendedEvent = DelayedExtendedEventController.create(this);
			this.addDestroyableObject(this._delayedExtendedEvent);
		} 
		
		return this._delayedExtendedEvent;
	};
	
	objectFunctions.reactivateForNewDocument = function() {
		if(this._extendedEvent !== null) {
			this._extendedEvent.reactivateEventListeners();
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//MENOTE: should be overridden
		
		return false;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEvent = null;
		this._delayedExtendedEvent = null;
		
		this.superCall();
	};
});