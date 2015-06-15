/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A property that doesn't have any value. Used by update functions that have a doesn't have a specific output (eg. updating the display of an element).
 */
dbm.registerClass("dbm.core.objectparts.GhostProperty", "dbm.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.GhostProperty");
	//"use strict";
	
	//Self reference
	var GhostProperty = dbm.importClass("dbm.core.objectparts.GhostProperty");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.GhostProperty::_init");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Interface functions. Only changes the status of this property.
	 *
	 * @param	aValue	*	Ignored.
	 */
	objectFunctions.setValue = function(aValue) {
		//MENOTE: do nothing
		
		this.flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this.setDependentConnectionsAsDirty();
	};
	
	/**
	 * Interface functions. Only changes the status of this property.
	 *
	 * @param	aValue				*		Ignored.
	 * @param	aFlowUpdateNumber	Number	The interger that keeps track of when the flow was latest updated.
	 */
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("dbm.core.objectparts.GhostProperty::setValueWithFlow");
		this.flowUpdateNumber = aFlowUpdateNumber;
		this.status = FlowStatusTypes.UPDATED;
	};
	
	/**
	 * Interface function. Returns null.
	 *
	 * @return	*	Returns null.
	 */
	objectFunctions.getValue = function() {
		return null;
	};
	
	/**
	 * Interface function. Returns null.
	 *
	 * @return	*	Returns null.
	 */
	objectFunctions.getValueWithoutFlow = function() {
		return null;
	};
	
	/**
	 * Interface function to update the flow. Only changes the status of this property.
	 */
	objectFunctions.updateFlow = function() {
		//console.log("dbm.core.objectparts.GhostProperty::updateFlow");
		
		//this.flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @return	GhostProperty	The newly created object.
	 */
	staticFunctions.create = function() {
		var newGhostProperty = ClassReference._createAndInitClass(ClassReference);
		return newGhostProperty;
	};
});