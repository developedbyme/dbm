dbm.registerClass("com.developedbyme.core.objectparts.ExtendedEventProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	var ExtendedEventProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.ExtendedEventProperty::init");
		
		this.superCall();
		
		this._extendedEvent = ExtendedEventController.create(this);
		this.addDestroyableObject(this._extendedEvent);
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		this.superCall(aValue);
		if(aValue != null) {
			this._extendedEvent.perform(aValue, null);
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
	
	staticFunctions.create = function(aObjectInput) {
		var newExtendedEventProperty = (new ExtendedEventProperty()).init();
		//METODO: set object property
		newExtendedEventProperty.setupExternalObject(aExternalObject, aVariableName);
		return newExtendedEventProperty;
	};
	
});