dbm.registerClass("com.developedbyme.core.objectparts.ExternalVariableProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.ExternalVariableProperty::init");
		
		this.superCall();
		
		this._externalObject = null;
		this._externalVariableName = null;
		
		return this;
	};
	
	objectFunctions._performSetValue = function(aValue) {
		this._externalObject[this._externalVariableName] = aValue;
	};
	
	objectFunctions._performGetValue = function() {
		return this._externalObject[this._externalVariableName];
	};
	
	objectFunctions.setupExternalObject = function(aObject, aVariableName) {
		this._externalObject = aObject;
		this._externalVariableName = aVariableName;
		
		this.setValue(this._externalObject[this._externalVariableName]);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._externalObject = null;
		this._externalVariableName = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObjectInput, aExternalObject, aVariableName) {
		var newExternalVariableProperty = (new ExternalVariableProperty()).init();
		//METODO: set object property
		newExternalVariableProperty.setupExternalObject(aExternalObject, aVariableName);
		return newExternalVariableProperty;
	};
	
});