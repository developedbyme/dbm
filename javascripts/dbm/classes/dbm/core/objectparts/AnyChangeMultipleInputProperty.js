/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A ghost property that has multiple input connections.
 */
dbm.registerClass("dbm.core.objectparts.AnyChangeMultipleInputProperty", "dbm.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	//"use strict";
	
	//Self reference
	var AnyChangeMultipleInputProperty = dbm.importClass("dbm.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("dbm.constants.FlowStatusTypes");
	var GlobalVariables = dbm.importClass("dbm.core.globalobjects.GlobalVariables");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty::_init");
		
		this.superCall();
		
		this._inputConnections = new Array();
		
		return this;
	};
	
	objectFunctions.setValue = function(aValue) {
		
	};
	
	objectFunctions.setValueWithDelay = function(aValue, aDelay) {
		
	};
	
	objectFunctions.animateValue = function(aValue, aTime, aInterpolation, aDelay) {
		
	};
	
	objectFunctions.createTimelineControl = function() {
		
	};
	
	objectFunctions.getAnimationController = function() {
		return null;
	};
	
	objectFunctions.canBeSet = function() {
		return false;
	};
	
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		
	};
	
	objectFunctions.updateFlow = function() {
		//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty::updateFlow");
		//console.log(this.name);
		
		//var globalFlowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this._performSetValue(GlobalVariables.FLOW_UPDATE_NUMBER);
		//this.flowUpdateNumber = globalFlowUpdateNumber;
	};
	
	objectFunctions.disconnectInput = function(aProperty) {
		dbm.singletons.dbmFlowManager.disconnectProperties(aProperty, this);
		
		return this;
	};
	
	objectFunctions._linkRegistration_setInputConnection = function(aInputConnection) {
		//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty::_linkRegistration_setInputConnection");
		//console.log(this.name);
		this._inputConnections.push(aInputConnection);
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		this.setDependentConnectionsAsDirty();
		
		this.flowUpdateNumber = 0;
	};
	
	objectFunctions._linkRegistration_setInputUpdateFunction = function(aUpdateFunction) {
		
	};
	
	objectFunctions._linkRegistration_removeInputConnection = function(aProperty) {
		//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty::_linkRegistration_removeInputConnection");
		//console.log(this.name);
		
		var index = ArrayFunctions.indexOfInArray(this._inputConnections, aProperty);
		if(index !== -1) {
			this._inputConnections.splice(index, 1);
		}
	};
	
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			if(currentConnection !== null && currentConnection.status === FlowStatusTypes.NEEDS_UPDATE) {
				aReturnArray.push(currentConnection);
			}
		}
	};
	
	objectFunctions.fillWithAllInputConnections = function(aReturnArray) {
		//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty::fillWithAllInputConnections");
		
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			if(currentConnection !== null) {
				aReturnArray.push(currentConnection);
			}
		}
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._inputConnections !== null) {
			var currentArray = ArrayFunctions.copyArray(this._inputConnections);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this.disconnectInput(currentArray[i]);
			}
		}
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputConnections = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.core.objectparts.AnyChangeMultipleInputProperty::create");
		//console.log(aObjectInput);
		var newAnyChangeMultipleInputProperty = (new AnyChangeMultipleInputProperty()).init();
		return newAnyChangeMultipleInputProperty;
	};
	
});