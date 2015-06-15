/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Function taht has a number of input properties to generates values for another set of properties.
 */
dbm.registerClass("dbm.core.objectparts.UpdateFunction", "dbm.core.objectparts.FlowStatusBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.UpdateFunction");
	//"use strict";
	
	//Self reference
	var UpdateFunction = dbm.importClass("dbm.core.objectparts.UpdateFunction");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var Property = dbm.importClass("dbm.core.objectparts.Property");
	var GhostProperty = dbm.importClass("dbm.core.objectparts.GhostProperty");
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.UpdateFunction::_init");
		
		this.superCall();
		
		this.name = null;
		
		this._updateFunction = null;
		this._ownerObject = null;
		
		this._inputConnections = new Array();
		this._outputConnections = new Array();
		this._ghostOutputConnections = new Array();
		
		return this;
	};
	
	/**
	 * Sets up the function.
	 *
	 * @param	aOwnerObject		FlowBaseObject		The owner of this function.
	 * @param	aUpdateFunction		Function			The function that is performing transformation the input to the output.
	 * @param	aInputsArray		Array<Property>		The properties that is used when performing the update.
	 * @param	aOutputsArray		Array<Property>		The properties that are being updated with this function.
	 *
	 * @return	self
	 */
	objectFunctions.setup = function(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray) {
		//console.log("dbm.core.objectparts.UpdateFunction::setup");
		//console.log(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray);
		
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		
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
	
	/**
	 * Gets the owner object of this function.
	 *
	 * @return	FlowBaseObject	The owner of this function.
	 */
	objectFunctions.getOwnerObject = function() {
		return this._ownerObject;
	};
	
	/**
	 * Adds an input property that is used when the function is updating.
	 *
	 * @param	aProperty	Property	The input property to add.
	 */
	objectFunctions.addInputConnection = function(aProperty) {
		aProperty._linkRegistration_addConnectedOutput(this);
		this._linkRegistration_addInputConnection(aProperty);
	};
	
	/**
	 * Removes an input property that no longer is used when the function is updating.
	 *
	 * @param	aProperty	Property	The input property to remove.
	 */
	objectFunctions.removeInputConnection = function(aProperty) {
		aProperty._linkRegistration_removeConnectedOutput(this);
		this._linkRegistration_removeInputConnection(aProperty);
	};
	
	/**
	 * Link registation for adding an input property.
	 *
	 * @param	aProperty	Property	The input property to add.
	 */
	objectFunctions._linkRegistration_addInputConnection = function(aProperty) {
		this._inputConnections.push(aProperty);
		
		this.flowUpdateNumber = 0;
		dbm.singletons.dbmFlowManager.setDependentConnectionsAsDirty(this);
	};
	
	/**
	 * Adds a property that is set by this function.
	 *
	 * @param	aProeprty	Proeprty	The output property to add.
	 */
	objectFunctions.addOutputConnection = function(aProperty) {
		aProperty._linkRegistration_setInputUpdateFunction(this);
		this._linkRegistration_addOutputConnection(aProperty);
	};
	
	/**
	 * Removes a property that is no longer being set by this function.
	 *
	 * @param	aProeprty	Proeprty	The output property to remove.
	 */
	objectFunctions.removeOutputConnection = function(aProperty) {
		aProperty._linkRegistration_removeInputUpdateFunction(this);
		this._linkRegistration_removeOutputConnection(aProperty);
	};
	
	/**
	 * Link registation for adding an output property.
	 *
	 * @param	aProperty	Property	The output property to add.
	 */
	objectFunctions._linkRegistration_addOutputConnection = function(aProperty) {
		this._outputConnections.push(aProperty);
		aProperty._linkRegistration_setInputUpdateFunction(this);
	};
	
	/**
	 * Interface function for updating the flow. Performs the update function.
	 */
	objectFunctions.updateFlow = function() {
		
		var globalUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		//this.flowUpdateNumber = globalUpdateNumber;
		this._updateFunction.call(this._ownerObject, globalUpdateNumber);
		if(!this._isDestroyed) {
			this._cleanGhostPropertyOutput(globalUpdateNumber);
		}
	};
	
	/**
	 * Sets the status of all output ghost properties to updated.
	 *
	 * @param	aFlowUpdateNumber	Number	The interger that keeps track of when the flow was latest updated.
	 */
	objectFunctions._cleanGhostPropertyOutput = function(aFlowUpdateNumber) {
		var currentArray = this._ghostOutputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentProperty = currentArray[i];
			currentProperty.setFlowAsUpdated(aFlowUpdateNumber);
		}
	};
	
	/**
	 * Fills an array with properties of a ceratin status.
	 *
	 * @param	aProperties		Array<Property>		The list of properties to search in.
	 * @param	aStatus			FlowStatusTypes		The status that qualifies the property.
	 * @param	aReturnArray	Array				The array that gets filled with the matching properties.
	 */
	objectFunctions._fillWithPropertiesOfStatus = function(aProperties, aStatus, aReturnArray) {
		var currentArray = aProperties;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.status === aStatus) {
				aReturnArray.push(currentObject);
			}
		}
	};
	
	/**
	 * Fills an array with all the clean (status: updated) output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithCleanOutputConnections = function(aReturnArray) {
		this._fillWithPropertiesOfStatus(this._outputConnections, FlowStatusTypes.UPDATED, aReturnArray);
	};
	
	/**
	 * Fills an array with all the dirty (status: needs update) input properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		//console.log("dbm.core.objectparts.UpdateFunction::fillWithDirtyInputConnections");
		this._fillWithPropertiesOfStatus(this._inputConnections, FlowStatusTypes.NEEDS_UPDATE, aReturnArray);
	};
	
	/**
	 * Fills an array with all the all input properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllInputConnections = function(aReturnArray) {
		//console.log("dbm.core.objectparts.UpdateFunction::fillWithAllInputConnections");
		
		ArrayFunctions.concatToArray(aReturnArray, this._inputConnections);
	};
	
	/**
	 * Fills an array with all the output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllOutputConnections = function(aReturnArray) {
		
		ArrayFunctions.concatToArray(aReturnArray, this._outputConnections);
	};
	
	/**
	 * Link registation for removing an input connection.
	 *
	 * @param	aProeprty	Property	The property to remove.
	 */
	objectFunctions._linkRegistration_removeInputConnection = function(aProperty) {
		//console.log("dbm.core.objectparts.Property::_linkRegistration_removeInputConnection");
		
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
		
		this.flowUpdateNumber = 0;
		dbm.singletons.dbmFlowManager.setDependentConnectionsAsDirty(this);
	};
	
	/**
	 * Link registation for removing an output connection.
	 *
	 * @param	aProeprty	Property	The property to remove.
	 */
	objectFunctions._linkRegistration_removeOutputConnection = function(aProperty) {
		//console.log("dbm.core.objectparts.Property::_linkRegistration_removeOutputConnection");
		
		var index = ArrayFunctions.indexOfInArray(this._outputConnections, aProperty);
		if(index !== -1) {
			this._outputConnections.splice(index, 1);
		}
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this.name);
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
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
		//console.log("//dbm.core.objectparts.Property::performDestroy");
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._updateFunction = null;
		this._ownerObject = null;
		
		this._inputConnections = null;
		this._outputConnections = null;
		this._ghostOutputConnections = null;
		
		this.superCall();
	};
	
	/**
	 * Update function that doesn't do anything. Used when this is created as a ghost.
	 */
	staticFunctions._noUpdateFunction = function(aFlowUpdateNumber) {
		//MENOTE: do nothing
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aOwnerObject		FlowBaseObject		The owner of this function.
	 * @param	aUpdateFunction		Function			The function that is performing transformation the input to the output.
	 * @param	aInputsArray		Array<Property>		The properties that is used when performing the update.
	 * @param	aOutputsArray		Array<Property>		The properties that are being updated with this function.
	 *
	 * @return	UpdateFunction	The newly created object.
	 */
	staticFunctions.create = function(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray) {
		var newUpdateFunction = ClassReference._createAndInitClass(ClassReference);
		newUpdateFunction.setup(aOwnerObject, aUpdateFunction, aInputsArray, aOutputsArray);
		return newUpdateFunction;
	};
	
	/**
	 * Creates a new object of this class, that doesn't perform a function when updated.
	 * This has been depreciated, use a AnyChangeMultipleInputProperty instead.
	 *
	 * @param	aInputsArray		Array<Property>		The properties that is used when performing the update.
	 * @param	aOutputsArray		Array<Property>		The properties that are being updated with this function.
	 *
	 * @return	UpdateFunction	The newly created object.
	 */
	staticFunctions.createGhostFunction = function(aInputsArray, aOutputsArray) {
		var newUpdateFunction = ClassReference._createAndInitClass(ClassReference);
		newUpdateFunction.setup(null, ClassReference._noUpdateFunction, aInputsArray, aOutputsArray);
		return newUpdateFunction;
	};
	
});