dbm.registerClass("com.developedbyme.core.objectparts.ExtendedEventProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	var ExtendedEventProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	var ExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.ExtendedEventController");
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty::init");
		
		this.superCall();
		
		this._extendedEvent = ExtendedEventController.create(this);
		this.addDestroyableObject(this._extendedEvent);
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty::_performSetValue");
		//console.log(aValue, this._extendedEvent.hasEvent(aValue));
		this.superCall(aValue);
		if(aValue != null) {
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
		var newExtendedEventProperty = (new ExtendedEventProperty()).init();
		aObjectInput._linkRegistration_addObjectProperty(newExtendedEventProperty);
		newExtendedEventProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		if(aValue instanceof Property) {
			newExtendedEventProperty.connectInput(aValue);
		}
		else {
			newExtendedEventProperty.setValue(aValue);
		}
		return newExtendedEventProperty;
	};
	
});