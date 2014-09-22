/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A property that doesn't have any value. Used by update functions that have a doesn't have a specific output (eg. updating the display of an element).
 */
dbm.registerClass("com.developedbyme.core.objectparts.GhostProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.GhostProperty");
	//"use strict";
	
	//Self reference
	var GhostProperty = dbm.importClass("com.developedbyme.core.objectparts.GhostProperty");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::_init");
		
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
		
		this._flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this.setDependentConnectionsAsDirty();
	};
	
	/**
	 * Interface functions. Only changes the status of this property.
	 *
	 * @param	aValue				*		Ignored.
	 * @param	aFlowUpdateNumber	Number	The interger that keeps track of when the flow was latest updated.
	 */
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::setValueWithFlow");
		this._flowUpdateNumber = aFlowUpdateNumber;
		this._status = FlowStatusTypes.UPDATED;
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
		//console.log("com.developedbyme.core.objectparts.GhostProperty::updateFlow");
		this._flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this._status = FlowStatusTypes.UPDATED;
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