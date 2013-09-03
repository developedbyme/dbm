dbm.registerClass("com.developedbyme.core.objectparts.PropertyDependentFunction", "com.developedbyme.core.objectparts.ExtendedFunctionBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.PropertyDependentFunction");
	//"use strict";
	
	var PropertyDependentFunction = dbm.importClass("com.developedbyme.core.objectparts.PropertyDependentFunction");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.PropertyDependentFunction::_init");
		
		this.superCall();
		
		this._dependentProperty = this.createProperty("dependentProperty", null);
		this._checkForDependentProperty = this.createGhostProperty("checkForDependentProperty");
		this._function = null;
		
		this._storedCalls = new Array();
		this._type = "notNull";
		
		this.createUpdateFunction("default", this._updateFlow, [this._dependentProperty], [this._checkForDependentProperty]);
		
		return this;
	};
	
	objectFunctions.setFunction = function(aFunction) {
		//console.log("com.developedbyme.core.objectparts.PropertyDependentFunction::setDefaultFunction");
		
		this._function = aFunction;
		
		return this;
	};
	
	objectFunctions.setType = function(aType) {
		//console.log("com.developedbyme.core.objectparts.PropertyDependentFunction::setType");
		
		this._type = aType;
		
		return this;
	};
	
	objectFunctions.clear = function() {
		//console.log("com.developedbyme.core.objectparts.PropertyDependentFunction::clear");
		
		this._storedCalls.splice(0, this._storedCalls.length);
		this._checkForDependentProperty.stopUpdating();
		
		return this;
	};
	
	objectFunctions.callFunction = function(aArguments) {
		//console.log("com.developedbyme.core.objectparts.PropertyDependentFunction::callFunction");
		//console.log(this._canRunFunction(), this._function);
		if(this._canRunFunction()) {
			return this.superCall(aArguments);
		}
		else {
			this._storedCalls.push(aArguments);
			this._checkForDependentProperty.startUpdating();
		}
	};
	
	objectFunctions._performCallFunction = function(aArguments) {
		
		return this._function.apply(this._owner, aArguments);
	};
	
	objectFunctions._canRunFunction = function() {
		var currentValue = this._dependentProperty.getValue();
		switch(this._type) {
			case "notNull":
				return (currentValue !== null);
			case "isTrue":
				return (currentValue === true);
			default:
				//METODO: error message
		}
		return false;
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		if(this._canRunFunction()) {
			var currentArray = this._storedCalls;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this._performCallFunction(currentArray[i]);
			}
			this._storedCalls.splice(0, currentArrayLength);
			this._checkForDependentProperty.stopUpdating();
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._dependentProperty = null;
		this._checkForDependentProperty = null;
		this._function = null;
		
		this._storedCalls = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwner, aFunction, aDependentPropertyInput) {
		var newFunction = (new PropertyDependentFunction()).init().setOwner(aOwner).setFunction(aFunction);
		newFunction.setPropertyInputWithoutNull("dependentProperty", aDependentPropertyInput);
		return newFunction;
	}
});