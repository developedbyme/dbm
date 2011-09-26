dbm.registerClass("com.developedbyme.core.objectparts.UpdateFunction", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.UpdateFunction");
	
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.objectparts.UpdateFunction::init");
		
		this.superCall();
		
		this.name = null;
		
		this._flowUpdateNumber = 0;
		
		this._updateFunction = null;
		this._ownerObject = null;
		
		this._inputConnections = new Array();
		this._outputConnections = new Array();
		this._ghostOutputConnections = new Array();
		
		return this;
	};
	
	objectFunctions.setup = function(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray) {
		//console.log("com.developedbyme.core.objectparts.UpdateFunction::setup");
		//console.log(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray);
		this._updateFunction = aUpdateFunction;
		this._ownerObject = aOwnerObject;
		
		this._inputConnections = aInputsArray;
		this._outputConnections = aOutputsArray;
		
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty._linkRegistration_addConnectedOutput(this);
		}
		
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty._linkRegistration_setInputUpdateFunction(this);
			
			if(currentProperty instanceof GhostProperty) {
				this._ghostOutputConnections.push(currentProperty);
			}
		}
		
		return this;
	};
	
	objectFunctions._linkRegistration_addInputConnection = function(aProperty) {
		this._inputConnections.push(aProperty);
		aProperty._linkRegistration_addConnectedOutput(this);
		
		this._flowUpdateNumber = 0;
	};
	
	objectFunctions._linkRegistration_addOutputConnection = function(aProperty) {
		this._outputConnections.push(aProperty);
		aProperty._linkRegistration_setInputUpdateFunction(this);
	};
	
	objectFunctions.updateFlow = function() {
		var newFlowUpdateNumber = this._getInputFlowUpdateNumber();
		if(newFlowUpdateNumber > this._flowUpdateNumber) {
			this._flowUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
			this._updateFunction.call(this._ownerObject, this._flowUpdateNumber);
		}
		var currentArray = this._ghostOutputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty.setValueWithFlow(null, dbm.singletons.dbmFlowManager.getFlowUpdateNumber());
		}
	};
	
	objectFunctions.fillWithCleanOutputConnections = function(aReturnArray) {
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.getStatus() == FlowStatusTypes.UPDATED) {
				aReturnArray.push(currentObject);
			}
		}
	};
	
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.UpdateFunction::fillWithDirtyInputConnections");
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.getStatus() == FlowStatusTypes.NEEDS_UPDATE) {
				aReturnArray.push(currentObject);
			}
		}
	};
	
	objectFunctions._getInputFlowUpdateNumber = function() {
		//console.log("com.developedbyme.core.objectparts.UpdateFunction::_getInputFlowUpdateNumber");
		var returnNumber = 0;
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			returnNumber = Math.max(returnNumber, currentObject.getFlowUpdateNumber());
		}
		return returnNumber;
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateFunction = null;
		this._ownerObject = null;
		
		this._inputsArray = null;
		this._outputsArray = null;
		
		this.superCall();
	};
	
	staticFunctions._noUpdateFunction = function(aFlowUpdateNumber) {
		//MENOTE: do nothing
	};
	
	staticFunctions.create = function(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray) {
		var newUpdateFunction = (new UpdateFunction()).init();
		newUpdateFunction.setup(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray);
		return newUpdateFunction;
	};
	
	staticFunctions.createGhostFunction = function(aInputsArray, aOutputsArray) {
		var newUpdateFunction = (new UpdateFunction()).init();
		newUpdateFunction.setup(null, ClassReference._noUpdateFunction, aInputsArray, aOutputsArray);
		return newUpdateFunction;
	};
	
});