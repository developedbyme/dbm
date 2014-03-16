/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.objectparts.ExtendedEventProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty");
	//"use strict";
	
	var ExtendedEventProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty::_init");
		
		this.superCall();
		
		this._extendedEvent = ExtendedEventController.create(this);
		this.addDestroyableObject(this._extendedEvent);
		
		return this;
	};
	
	objectFunctions.changeToExternalEventController = function(aExtendedEventController) {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty::changeToExternalEventController");
		
		//METODO: Fix so this function can be called a second time
		this._extendedEvent.destroy();
		this.removeDestroyableObject(this._extendedEvent);
		
		this._extendedEvent = aExtendedEventController;
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty::_performSetValue");
		//console.log(aValue, this._extendedEvent.hasEvent(aValue));
		this.superCall(aValue);
		if(aValue !== null) {
			if(this._extendedEvent.hasEvent(aValue)) {
				this._extendedEvent.perform(aValue, null);
			}
		}
	};
	
	objectFunctions.getExtendedEvent = function() {
		return this._extendedEvent;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		return true;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._extendedEvent = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aValue) {
		return ClassReference._createWithInputValue(ExtendedEventProperty, aObjectInput, aValue);
	};
	
});