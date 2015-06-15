/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for objects that can be updated by flow.
 */
dbm.registerClass("dbm.core.objectparts.FlowStatusBaseObject", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.FlowStatusBaseObject");
	//"use strict";
	
	//Self reference
	var FlowStatusBaseObject = dbm.importClass("dbm.core.objectparts.FlowStatusBaseObject");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.FlowStatusBaseObject::_init");
		
		this.superCall();
		
		this.status = FlowStatusTypes.UPDATED;
		this.flowUpdateNumber = 0;
		
		return this;
	};
	
	/**
	 * Sets the flow status of this property to updated.
	 *
	 * @param	aFlowUpdateNumber	Number	The integer for keeping track of flow updates.
	 */
	objectFunctions.setFlowAsUpdated = function(aFlowUpdateNumber) {
		this.flowUpdateNumber = aFlowUpdateNumber;
		this.status = FlowStatusTypes.UPDATED;
	};
	
	/**
	 * Sets the flow status of this property.
	 *
	 * @param	aStatus		FlowStatusTypes		The status for this property.
	 */
	objectFunctions.setStatus = function(aStatus) {
		this.status = aStatus;
	};
	
	/**
	 * Gets the flow status of this property.
	 *
	 * @return	FlowStatusTypes		The status for this property.
	 */
	objectFunctions.getStatus = function() {
		return this.status;
	};
	
	/**
	 * Gets the flow update number when this property was last updated.
	 *
	 * @return	Number	The interger that keeps track of when the flow was latest updated for this property.
	 */
	objectFunctions.getFlowUpdateNumber = function() {
		//console.log("dbm.core.objectparts.FlowStatusBaseObject::getFlowUpdateNumber");
		return this.flowUpdateNumber;
	};
	
	/**
	 * Internal functionality for changing the flow update number
	 *
	 * @param	aFlowUpdateNumber	Number	The interger that keeps track of when the flow was latest updated.
	 */
	objectFunctions._internalFunctionality_setFlowUpdateNumber = function(aFlowUpdateNumber) {
		//console.log("dbm.core.objectparts.FlowStatusBaseObject::_internalFunctionality_setFlowUpdateNumber");
		this.flowUpdateNumber = aFlowUpdateNumber;
	};
	
	/**
	 * Fills an array with all the output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllOutputConnections = function(aReturnArray) {
		//console.log("dbm.core.objectparts.FlowStatusBaseObject::fillWithAllOutputConnections");
		
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			aReturnArray.push(currentObject);
		}
	};
});