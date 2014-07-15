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
	
	objectFunctions.setValue = function(aValue) {
		//MENOTE: do nothing
		
		this._flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this.setDependentConnectionsAsDirty();
	};
	
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::setValueWithFlow");
		this._flowUpdateNumber = aFlowUpdateNumber;
		this._status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions.getValue = function() {
		return null;
	};
	
	objectFunctions.getValueWithoutFlow = function() {
		return null;
	};
	
	objectFunctions.updateFlow = function() {
		//console.log("com.developedbyme.core.objectparts.GhostProperty::updateFlow");
		this._flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this._status = FlowStatusTypes.UPDATED;
	};
	
	staticFunctions.create = function(aObjectInput) {
		var newGhostProperty = ClassReference._createAndInitClass(ClassReference);
		if(aObjectInput !== null) {
			aObjectInput._linkRegistration_addObjectProperty(newGhostProperty);
			newGhostProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		}
		return newGhostProperty;
	};
});