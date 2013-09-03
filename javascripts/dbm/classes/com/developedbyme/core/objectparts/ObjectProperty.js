dbm.registerClass("com.developedbyme.core.objectparts.ObjectProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.ObjectProperty");
	//"use strict";
	
	var ObjectProperty = dbm.importClass("com.developedbyme.core.objectparts.ObjectProperty");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::_init");
		
		this.superCall();
		this._isOutput = true;
		this._objectProperties = new Array();
		
		return this;
	};
	
	objectFunctions.isOutput = function() {
		return this._isOutput;
	};
	
	objectFunctions.setValue = function(aValue) {
		
	};
	
	objectFunctions.setup = function(aObject) {
		this._value = aObject;
		return this;
	};
	
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::setValueWithFlow");
		this._flowUpdateNumber = aFlowUpdateNumber;
		this._status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions._linkRegistration_addObjectProperty = function(aProperty) {
		this._objectProperties.push(aProperty);
	};
	
	objectFunctions._linkRegistration_removeObjectProperty = function(aProperty) {
		//console.log("com.developedbyme.core.objectparts.ObjectProperty::_linkRegistration_removeObjectProperty");
		var objectIndex = ArrayFunctions.indexOfInArray(this._objectProperties, aProperty);
		if(objectIndex !== -1) {
			this._objectProperties.splice(objectIndex, 1);
		}
		//console.log("//com.developedbyme.core.objectparts.ObjectProperty::_linkRegistration_removeObjectProperty");
	};
	
	objectFunctions.fillWithCleanOutputConnections = function(aReturnArray) {
		if(!this._isOutput) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject.getStatus === undefined || currentObject.getStatus() === FlowStatusTypes.UPDATED) {
					aReturnArray.push(currentObject);
				}
			}
		}
		this.superCall(aReturnArray);
	};
	
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		if(this._isOutput) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				if(currentObject.getStatus === undefined || currentObject.getStatus() === FlowStatusTypes.NEEDS_UPDATE) {
					aReturnArray.push(currentObject);
				}
			}
		}
		this.superCall(aReturnArray);
	};
	
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.objectparts.Property::performDestroy");
		//console.log(this.toString());
		
		if(this._objectProperties !== null) {
			var currentArray = this._objectProperties;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentObject = currentArray[i];
				currentObject._linkRegistration_removeObjectInputConnection();
			}
			currentArray.splice(0, currentArrayLength);
		}
		
		this.superCall();
		//console.log("//com.developedbyme.core.objectparts.Property::performDestroy");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._objectProperties = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aObject) {
		var newObjectProperty = (new ObjectProperty()).init();
		newObjectProperty.setup(aObject);
		return newObjectProperty;
	};
	
});