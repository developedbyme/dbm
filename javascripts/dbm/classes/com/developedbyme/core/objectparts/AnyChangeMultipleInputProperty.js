/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty", "com.developedbyme.core.objectparts.Property", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	//"use strict";
	
	var AnyChangeMultipleInputProperty = dbm.importClass("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
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
		
		if(highestFlowUpdateNumber > this._flowUpdateNumber) {
			this._performSetValue(dbm.singletons.dbmFlowManager.getFlowUpdateNumber());
			this._flowUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
		}
		this._status = FlowStatusTypes.UPDATED;
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
		
		this._flowUpdateNumber = 0;
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
			if(currentConnection !== null && currentConnection.getStatus() === FlowStatusTypes.NEEDS_UPDATE) {
				aReturnArray.push(currentConnection);
			}
		}
		
		if(this._objectInputConnection !== null && !this._objectInputConnection.isOutput() && this._objectInputConnection.getStatus() === FlowStatusTypes.NEEDS_UPDATE) {
			aReturnArray.push(this._objectInputConnection);
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
		
		if(this._objectInputConnection !== null && !this._objectInputConnection.isOutput()) {
			aReturnArray.push(this._objectInputConnection);
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
	
	staticFunctions.create = function(aObjectInput) {
		//console.log("com.developedbyme.core.objectparts.AnyChangeMultipleInputProperty::create");
		//console.log(aObjectInput);
		var newAnyChangeMultipleInputProperty = (new AnyChangeMultipleInputProperty()).init();
		if(aObjectInput !== null) {
			aObjectInput._linkRegistration_addObjectProperty(newAnyChangeMultipleInputProperty);
			newAnyChangeMultipleInputProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		}
		return newAnyChangeMultipleInputProperty;
	};
	
});