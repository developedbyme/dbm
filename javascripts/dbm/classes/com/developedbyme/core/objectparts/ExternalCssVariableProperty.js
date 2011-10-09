dbm.registerClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	
	var ExternalCssVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalCssVariableProperty");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalCssVariableProperty::init");
		
		this.superCall();
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		this._priority = "";
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		
		if(this._externalObject == null) {
			this._value = aValue;
			return;
		}
		
		var newValue = (this._unit == null) ? aValue :  aValue + "" + this._unit;
		
		this._externalObject.style.setProperty(this._externalVariableName, newValue, this._priority);
	};
	
	objectFunctions._performGetValue = function() {
		
		if(this._externalObject == null) {
			return this._value;
		}
		
		var cssValue = this._externalObject.style.getPropertyValue(this._externalVariableName);
		
		if(cssValue == null) {
			return null;
		}
		else if(this._unit != null) {
			var unitPosition = cssValue.lastIndexOf(this._unit);
			var valueWithoutUnit = cssValue.substring(0, unitPosition);
			return parseFloat(valueWithoutUnit);
		}
		
		return cssValue;
	};
	
	objectFunctions.setupExternalObject = function(aObject, aVariableName, aUnit) {
		
		if(this._externalObject != null) {
			//METODO: warning message
			this.removeExternalObject();
		}
		
		var startValue = this.getValue();
		
		this._externalObject = aObject;
		this._externalVariableName = aVariableName;
		this._unit = aUnit;
		
		if(startValue != null) {
			this._performSetValue(startValue);
		}
		else {
			this.setAsDirty();
		}
	};
	
	objectFunctions.removeExternalObject = function() {
		
		if(this._externalObject != null) {
			this._value = this._performGetValue();
		}
		else {
			//METODO: error message
		}
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._externalObject = null;
		this._externalVariableName = null;
		this._unit = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aExternalObject, aVariableName, aUnit) {
		var newExternalCssVariableProperty = (new ExternalCssVariableProperty()).init();
		//METODO: set object property
		newExternalCssVariableProperty.setupExternalObject(aExternalObject, aVariableName, aUnit);
		return newExternalCssVariableProperty;
	};
	
	staticFunctions.createWithoutExternalObject = function(aObjectInput, aValue) {
		var newExternalCssVariableProperty = (new ExternalCssVariableProperty()).init();
		//METODO: set object property
		if(aValue != null) {
			newExternalCssVariableProperty.setvalue(aValue);
		}
		return newExternalCssVariableProperty;
	};
	
});