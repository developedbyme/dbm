dbm.registerClass("com.developedbyme.core.objectparts.UpdateFunction", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.UpdateFunction");
	//"use strict";
	
	var UpdateFunction = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunction");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.UpdateFunction::_init");
		
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
			if(!(currentProperty instanceof Property)) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setup", "Object " + currentProperty + " is not a property. Index " + i + " in input " + currentArray);
				continue;
			}
			currentProperty._linkRegistration_addConnectedOutput(this);
		}
		
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			if(!(currentProperty instanceof Property)) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setup", "Object " + currentProperty + " is not a property. Index " + i + " in output " + currentArray);
				continue;
			}
			currentProperty._linkRegistration_setInputUpdateFunction(this);
			
			if(currentProperty instanceof GhostProperty) {
				this._ghostOutputConnections.push(currentProperty);
			}
		}
		
		return this;
	};
	
	objectFunctions.getOwnerObject = function() {
		return this._ownerObject;
	};
	
	objectFunctions.addInputConnection = function(aProperty) {
		aProperty._linkRegistration_addConnectedOutput(this);
		this._linkRegistration_addInputConnection(aProperty);
	};
	
	objectFunctions.removeInputConnection = function(aProperty) {
		aProperty._linkRegistration_removeConnectedOutput(this);
		this._linkRegistration_removeInputConnection(aProperty);
	};
	
	objectFunctions._linkRegistration_addInputConnection = function(aProperty) {
		this._inputConnections.push(aProperty);
		
		this._flowUpdateNumber = 0;
	};
	
	objectFunctions.addOutputConnection = function(aProperty) {
		aProperty._linkRegistration_setInputUpdateFunction(this);
		this._linkRegistration_addOutputConnection(aProperty);
	};
	
	objectFunctions.removeOutputConnection = function(aProperty) {
		aProperty._linkRegistration_removeInputUpdateFunction(this);
		this._linkRegistration_removeOutputConnection(aProperty);
	};
	
	objectFunctions._linkRegistration_addOutputConnection = function(aProperty) {
		this._outputConnections.push(aProperty);
		aProperty._linkRegistration_setInputUpdateFunction(this);
	};
	
	objectFunctions.updateFlow = function() {
		var newFlowUpdateNumber = this._getInputFlowUpdateNumber();
		var globalUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
		if(newFlowUpdateNumber > this._flowUpdateNumber) {
			this._flowUpdateNumber = globalUpdateNumber;
			this._updateFunction.call(this._ownerObject, globalUpdateNumber);
		}
		if(!this._isDestroyed) {
			this._cleanGhostPropertyOutput(globalUpdateNumber);
		}
		
	};
	
	objectFunctions._cleanGhostPropertyOutput = function(aFlowUpdateNumber) {
		var currentArray = this._ghostOutputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty.setValueWithFlow(null, aFlowUpdateNumber);
		}
	}
	
	objectFunctions.fillWithCleanOutputConnections = function(aReturnArray) {
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.getStatus() === FlowStatusTypes.UPDATED) {
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
	
	objectFunctions.fillWithAllInputConnections = function(aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.UpdateFunction::fillWithAllInputConnections");
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			aReturnArray.push(currentObject);
		}
	};
	
	objectFunctions.fillWithAllOutputConnections = function(aReturnArray) {
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			aReturnArray.push(currentObject);
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
	
	objectFunctions._linkRegistration_removeInputConnection = function(aProperty) {
		var index = ArrayFunctions.indexOfInArray(this._inputConnections, aProperty);
		if(index !== -1) {
			this._inputConnections.splice(index, 1);
		}
		
		if(aProperty instanceof GhostProperty) {
			var index = ArrayFunctions.indexOfInArray(this._ghostOutputConnections, aProperty);
			if(index !== -1) {
				this._ghostOutputConnections.splice(index, 1);
			}
		}
	};
	
	objectFunctions._linkRegistration_removeOutputConnection = function(aProperty) {
		var index = ArrayFunctions.indexOfInArray(this._outputConnections, aProperty);
		if(index !== -1) {
			this._outputConnections.splice(index, 1);
		}
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this.name);
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._inputConnections !== null) {
			var currentArray = ArrayFunctions.copyArray(this._inputConnections);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this.removeInputConnection(currentArray[i]);
			}
		}
		
		if(this._outputConnections !== null) {
			var currentArray = ArrayFunctions.copyArray(this._outputConnections);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this.removeOutputConnection(currentArray[i]);
			}
		}
		
		this.superCall();
		//console.log("//com.developedbyme.core.objectparts.Property::performDestroy");
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateFunction = null;
		this._ownerObject = null;
		
		this._inputConnections = null;
		this._outputConnections = null;
		this._ghostOutputConnections = null;
		
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