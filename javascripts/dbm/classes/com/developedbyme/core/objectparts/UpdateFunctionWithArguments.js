dbm.registerClass("com.developedbyme.core.objectparts.UpdateFunctionWithArguments", "com.developedbyme.core.objectparts.UpdateFunction", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.UpdateFunctionWithArguments");
	//"use strict";
	
	var UpdateFunctionWithArguments = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunctionWithArguments");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.UpdateFunctionWithArguments::_init");
		
		this.superCall();
		
		this._cachedInputArray = new Array();
		
		return this;
	};
	
	objectFunctions.updateFlow = function() {
		
		var inputLength = this._inputConnections.length;
		if(this._cachedInputArray.length !== inputLength) {
			this._cachedInputArray = new Array(inputLength);
		}
		
		var newFlowUpdateNumber = this._getInputFlowUpdateParameters(this._cachedInputArray);
		var globalUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
		if(newFlowUpdateNumber > this._flowUpdateNumber) {
			this._flowUpdateNumber = globalUpdateNumber;
			var returnValue = this._updateFunction.apply(this, this._cachedInputArray);
			if(returnValue !== undefined) {
				this._outputConnections[0].setValueWithFlow(returnValue, this._flowUpdateNumber);
			}
		}
		if(!this._isDestroyed) {
			this._cleanGhostPropertyOutput(globalUpdateNumber);
		}
	};
	
	objectFunctions.updateFlowOutput = function(/* rest */) {
		var argumentsArray = arguments;
		var currentArray = this._outputConnections;
		var currentArrayLength = Math.min(argumentsArray.length, currentArray.length);
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i].setValueWithFlow(argumentsArray[i], this._flowUpdateNumber);
		}
	};
	
	objectFunctions._getInputFlowUpdateParameters = function(aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.UpdateFunctionWithArguments::_getInputFlowUpdateParameters");
		var returnNumber = 0;
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			aReturnArray[i] = currentObject.getValueWithoutFlow();
			returnNumber = Math.max(returnNumber, currentObject.getFlowUpdateNumber());
		}
		return returnNumber;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._cachedInputArray = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aOwnerObject, aUpdateFunctionWithArguments, aInputsArray, aOutputsArray) {
		var newUpdateFunctionWithArguments = (new UpdateFunctionWithArguments()).init();
		newUpdateFunctionWithArguments.setup(aOwnerObject, aUpdateFunctionWithArguments, aInputsArray, aOutputsArray);
		return newUpdateFunctionWithArguments;
	};
	
});