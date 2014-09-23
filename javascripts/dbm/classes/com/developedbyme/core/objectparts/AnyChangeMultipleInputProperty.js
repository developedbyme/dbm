/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A ghost property that has multiple input connections.
 */
dbm.registerClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	//"use strict";
	
	//Self reference
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::_init");
		
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
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::updateFlow");
		//console.log(this.name);
		
		var highestFlowUpdateNumber = 0;
		var currentArray = this._inputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentConnection = currentArray[i];
			highestFlowUpdateNumber = Math.max(highestFlowUpdateNumber, currentConnection.getFlowUpdateNumber());
		}
		
		if(highestFlowUpdateNumber > this.flowUpdateNumber) {
			this._performSetValue(dbm.singletons.dbmFlowManager.getFlowUpdateNumber());
			this.flowUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
		}
		this.status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions.disconnectInput = function(aProperty) {
		dbm.singletons.dbmFlowManager.disconnectProperties(aProperty, this);
		
		return this;
	};
	
	objectFunctions._linkRegistration_setInputConnection = function(aInputConnection) {
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::_linkRegistration_setInputConnection");
		//console.log(this.name);
		this._inputConnections.push(aInputConnection);
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		this.setDependentConnectionsAsDirty();
		
		this.flowUpdateNumber = 0;
	};
	
	objectFunctions._linkRegistration_setInputUpdateFunction = function(aUpdateFunction) {
		
	};
	
	objectFunctions._linkRegistration_removeInputConnection = function(aProperty) {
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::_linkRegistration_removeInputConnection");
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
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::fillWithAllInputConnections");
		
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
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::create");
		//console.log(aObjectInput);
		var newAnyChangeMultipleInputProperty = (new AnyChangeMultipleInputProperty()).init();
		return newAnyChangeMultipleInputProperty;
	};
	
});