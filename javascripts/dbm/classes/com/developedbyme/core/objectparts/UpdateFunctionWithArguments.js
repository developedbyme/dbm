/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Update function that calls a function after getting arguments from input properties.
 * This enables calls directly to static functions, without having to get property values within the function.
 */
dbm.registerClass("com.developedbyme.core.objectparts.UpdateFunctionWithArguments", "com.developedbyme.core.objectparts.UpdateFunction", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.UpdateFunctionWithArguments");
	//"use strict";
	
	//Self reference
	var UpdateFunctionWithArguments = dbm.importClass("com.developedbyme.core.objectparts.UpdateFunctionWithArguments");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	var FlowManager = dbm.importClass("com.developedbyme.core.globalobjects.flowmanager.FlowManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.UpdateFunctionWithArguments::_init");
		
		this.superCall();
		
		this._cachedInputArray = new Array();
		
		return this;
	};
	
	/**
	 * Interface function for updating the flow. Performs the update function.
	 */
	objectFunctions.updateFlow = function() {
		
		this._getInputFlowUpdateParameters(this._inputConnections, this._cachedInputArray);
		var globalUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		//this.flowUpdateNumber = globalUpdateNumber;
		var returnValue = this._updateFunction.apply(this, this._cachedInputArray);
		if(returnValue !== undefined) {
			this._outputConnections[0].setValueWithFlow(returnValue, globalUpdateNumber);
		}
		if(!this._isDestroyed) {
			this._cleanGhostPropertyOutput(globalUpdateNumber);
		}
	};
	
	/**
	 * Updates the output properties with the result of the function call.
	 *
	 * @rest	Property	The properties to set the output to.
	 */
	objectFunctions.updateFlowOutput = function(/* rest */) {
		var argumentsArray = arguments;
		var currentArray = this._outputConnections;
		var currentArrayLength = Math.min(argumentsArray.length, currentArray.length);
		for(var i = 0; i < currentArrayLength; i++) {
			currentArray[i].setValueWithFlow(argumentsArray[i], this.flowUpdateNumber);
		}
	};
	
	/**
	 * Gets all the values from the input properties into an array to be applied as arguments.
	 *
	 * @param	aReturnArray	Array	The array where the input values are being set.
	 *
	 * @return	Number	The highest flow update number of the properties.
	 */
	objectFunctions._getInputFlowUpdateParameters = function(aInputArray, aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.UpdateFunctionWithArguments::_getInputFlowUpdateParameters");
		var currentArray = aInputArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			aReturnArray[i] = currentArray[i].getValueWithoutFlow();
		}
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._cachedInputArray = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aOwnerObject		FlowBaseObject		The owner of this function.
	 * @param	aUpdateFunction		Function			The function that is performing transformation the input to the output.
	 * @param	aInputsArray		Array<Property>		The properties that is used when performing the update.
	 * @param	aOutputsArray		Array<Property>		The properties that are being updated with this function.
	 *
	 * @return	UpdateFunctionWithArguments		The newly created object.
	 */
	staticFunctions.create = function(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray) {
		var newUpdateFunctionWithArguments = ClassReference._createAndInitClass(ClassReference);
		newUpdateFunctionWithArguments.setup(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray);
		newUpdateFunctionWithArguments._cachedInputArray = new Array(aInputsArray.length); //METODO: do not access private variable
		return newUpdateFunctionWithArguments;
	};
	
});