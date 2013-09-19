dbm.registerClass("com.developedbyme.core.objectparts.ExternalVariableProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty");
	//"use strict";
	
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::_init");
		
		this.superCall();
		
		this._externalObject = null;
		this._externalVariableName = null;
		
		return this;
	};
	
	objectFunctions.getExternalObject = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::getExternalObject");
		
		return this._externalObject;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::_performSetValue");
		if(this._externalObject === null) {
			this._value = aValue;
			return;
		}
		this._externalObject[this._externalVariableName] = aValue;
	};
	
	objectFunctions._performGetValue = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::_performGetValue");
		if(this._externalObject === null) {
			return this._value;
		}
		return this._externalObject[this._externalVariableName];
	};
	
	objectFunctions.setupExternalObject = function(aObject, aVariableName) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::setupExternalObject");
		
		if(this._externalObject !== null) {
			//METODO: warning message
			this.removeExternalObject();
		}
		
		var startValue = this.getValue();
		
		this._externalObject = aObject;
		this._externalVariableName = aVariableName;
		
		if(startValue !== null) {
			this._performSetValue(startValue);
		}
		else {
			this.setAsDirty();
		}
	};
	
	objectFunctions.removeExternalObject = function() {
		
		if(this._externalObject !== null) {
			this._value = this._externalObject[this._externalVariableName];
		}
		else {
			//METODO: error message
		}
		
		this._externalObject = null;
		this._externalVariableName = null;
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._externalObject = null;
		this._externalVariableName = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aExternalObject, aVariableName) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::create (static)");
		var newExternalVariableProperty = (new ExternalVariableProperty()).init();
		aObjectInput._linkRegistration_addObjectProperty(newExternalVariableProperty);
		newExternalVariableProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		newExternalVariableProperty.setupExternalObject(aExternalObject, aVariableName);
		return newExternalVariableProperty;
	};
	
	staticFunctions.createWithoutExternalObject = function(aObjectInput, aValue) {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::createWithoutExternalObject (static)");
		var newExternalVariableProperty = (new ExternalVariableProperty()).init();
		aObjectInput._linkRegistration_addObjectProperty(newExternalVariableProperty);
		newExternalVariableProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		if(aValue !== null) {
			newExternalVariableProperty.setValue(aValue);
		}
		return newExternalVariableProperty;
	};
	
});