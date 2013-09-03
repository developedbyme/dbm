dbm.registerClass("com.developedbyme.core.objectparts.Property", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.Property");
	//"use strict";
	
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	objectFunctions._init = function _init() {
		//console.log("com.developedbyme.core.objectparts.Property::_init");
		
		this.superCall();
		
		this.name = null;
		
		this._status = FlowStatusTypes.UPDATED;
		this._flowUpdateNumber = 0;
		this._alwaysUpdateFlow = false;
		this._canSetValueInAnimation = true;
		
		this._value = null;
		this._objectInputConnection = null;
		this._inputConnection = null;
		this._inputUpdateFunction = null;
		this._outputConnections = new Array();
		this._animationController = null;
		
		this._isUpdating = false;
		this._mustUpdate = true;
		
		return this;
	};
	
	objectFunctions._performSetValue = function _performSetValue(aValue) {
		this._value = aValue;
	};
	
	objectFunctions._performGetValue = function _performGetValue() {
		return this._value;
	};
	
	objectFunctions.setValue = function setValue(aValue) {
		if(this._inputConnection !== null && (this._animationController === null || !this._canSetValueInAnimation)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValue", "Can't set value when property has input.");
			return;
		}
		if(this._animationController === null) {
			if(!dbm.singletons.dbmAnimationManager.isRecording()) {
				this._performSetValue(aValue);
				this._flowUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
				this.setDependentConnectionsAsDirty();
				return;
			}
			this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this._performGetValue(), this);
		}
		this._animationController.setValue(aValue);
	};
	
	objectFunctions.setValueWithDelay = function setValueWithDelay(aValue, aDelay) {
		if(this._inputConnection !== null && this._animationController === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValueWithDelay", "Can't set value when property has input.");
			return;
		}
		if(this._animationController === null) {
			this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this._performGetValue(), this);
		}
		this._animationController.setValue(aValue, aDelay);
	};
	
	objectFunctions.animateValue = function animateValue(aValue, aTime, aInterpolation, aDelay) {
		if(this._animationController === null) {
			if(this._inputConnection !== null) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "animateValue", "Can't set value when property has input.");
				return;
			}
			this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this._performGetValue(), this);
		}
		this._animationController.animateValue(aValue, aTime, aInterpolation, aDelay);
	};
	
	objectFunctions.createTimelineControl = function createTimelineControl() {
		if(this._animationController === null) {
			if(this._inputConnection !== null) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "createTimelineControl", "Can't set value when property has input.");
				return;
			}
			this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this._performGetValue(), this);
		}
		
		return this._animationController;
	};
	
	objectFunctions.getAnimationController = function getAnimationController() {
		if(this._animationController !== null) {
			return this._animationController;
		}
		if(this._inputConnection !== null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getAnimationController", "Property doesn't have an animation controller as input.");
			return null;
		}
		this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this._performGetValue(), this);
		return this._animationController;
	};
	
	objectFunctions.canBeSet = function canBeSet() {
		return (this._inputConnection === null || (this._animationController !== null && this._canSetValueInAnimation));
	};
	
	objectFunctions.setValueWithFlow = function setValueWithFlow(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.Property::setValueWithFlow");
		//console.log(this.name);
		//console.log(aValue, this._value);
		if(this._alwaysUpdateFlow || this._mustUpdate || (aValue !== this._value)) {
			this._performSetValue(aValue);
			this._flowUpdateNumber = aFlowUpdateNumber;
			this._mustUpdate = false;
		}
		this._status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions.setFlowAsUpdated =function(aFlowUpdateNumber) {
		this._flowUpdateNumber = aFlowUpdateNumber;
		this._mustUpdate = false;
		this._status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions.getValue = function getValue() {
		
		if(this._status === FlowStatusTypes.NEEDS_UPDATE) {
			dbm.singletons.dbmFlowManager.updateProperty(this);
		}
		
		return this._performGetValue();
	};
	
	objectFunctions.getValueWithoutFlow = function getValueWithoutFlow() {
		return this._performGetValue();
	};
	
	objectFunctions.getAnimationController = function getAnimationController() {
		return this._animationController;
	};
	
	objectFunctions.hasAnimationController = function hasAnimationController() {
		return (this._animationController !== null);
	};
	
	objectFunctions.setStatus = function setStatus(aStatus) {
		this._status = aStatus;
	};
	
	objectFunctions.getStatus = function getStatus() {
		return this._status;
	};
	
	objectFunctions.setAlwaysUpdateFlow = function setAlwaysUpdateFlow(aUpdate) {
		this._alwaysUpdateFlow = !VariableAliases.isFalse(aUpdate);
		
		return this;
	};
	
	objectFunctions.getFlowUpdateNumber = function getFlowUpdateNumber() {
		//console.log("com.developedbyme.core.objectparts.Property::getFlowUpdateNumber");
		return this._flowUpdateNumber;
	};
	
	objectFunctions._internalFunctionality_setFlowUpdateNumber = function _internalFunctionality_setFlowUpdateNumber(aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.Property::_internalFunctionality_setFlowUpdateNumber");
		this._flowUpdateNumber = aFlowUpdateNumber;
	};
	
	objectFunctions._linkRegistration_setAsUpdating = function _linkRegistration_setAsUpdating(aIsUpdating) {
		this._isUpdating = aIsUpdating;
	};
	
	objectFunctions.isUpdating = function isUpdating() {
		return this._isUpdating;
	};
	
	objectFunctions.update = function update() {
		dbm.singletons.dbmFlowManager.updateProperty(this);
		
		return this;
	};
	
	objectFunctions.startUpdating = function startUpdating() {
		if(this._isUpdating) return this;
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(this);
		
		return this;
	};
	
	objectFunctions.stopUpdating = function stopUpdating() {
		if(!this._isUpdating) return this;
		
		dbm.singletons.dbmFlowManager.removeUpdatedProperty(this);
		
		return this;
	};
	
	objectFunctions.updateFlow = function updateFlow() {
		//console.log("com.developedbyme.core.objectparts.Property::updateFlow");
		//console.log(this.name);
		if(this._inputConnection !== null) {
			var newFlowUpdateNumber = this._inputConnection.getFlowUpdateNumber();
			//console.log(newFlowUpdateNumber, this._flowUpdateNumber);
			if(newFlowUpdateNumber > this._flowUpdateNumber) {
				var newValue = this._inputConnection.getValue();
				//console.log(newValue, this._value, newValue !== this._value);
				if(this._alwaysUpdateFlow|| this._mustUpdate || (newValue !== this._performGetValue())) {
					this._performSetValue(newValue);
					this._flowUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
					this._mustUpdate = false;
				}
			}
		}
		this._status = FlowStatusTypes.UPDATED;
	};
	
	objectFunctions._linkRegistration_setObjectInputConnection = function _linkRegistration_setObjectInputConnection(aInputConnection) {
		this._objectInputConnection = aInputConnection;
	};
	
	objectFunctions._linkRegistration_removeObjectInputConnection = function _linkRegistration_removeObjectInputConnection() {
		this._objectInputConnection = null;
	};
	
	objectFunctions.connectInput = function connectInput(aProperty) {
		dbm.singletons.dbmFlowManager.connectProperties(aProperty, this);
		
		return this;
	};
	
	objectFunctions.disconnectInput = function disconnectInput() {
		if(this._inputConnection === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "disconnectInput", "Property " + this + " doesn't have any input.");
			return;
		}
		dbm.singletons.dbmFlowManager.disconnectProperties(this._inputConnection, this);
		
		return this;
	};
	
	objectFunctions.connectOutput = function connectOutput(aProperty) {
		dbm.singletons.dbmFlowManager.connectProperties(this, aProperty);
		
		return this;
	};
	
	objectFunctions.disconnectOutput = function disconnectOutput(aProperty) {
		dbm.singletons.dbmFlowManager.disconnectProperties(this, aProperty);
		
		return this;
	};
	
	objectFunctions._linkRegistration_setInputConnection = function _linkRegistration_setInputConnection(aInputConnection) {
		//console.log("com.developedbyme.core.objectparts.Property::_linkRegistration_setInputConnection");
		//console.log(this.name);
		if(this._inputConnection !== null) {
			this.disconnectInput();
		}
		this._inputConnection = aInputConnection;
		if(aInputConnection instanceof Timeline) {
			this._animationController = aInputConnection;
		}
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		this.setDependentConnectionsAsDirty();
		
		this._flowUpdateNumber = 0;
	};
	
	objectFunctions._linkRegistration_addConnectedOutput = function _linkRegistration_addConnectedOutput(aOutputConnection) {
		this._outputConnections.push(aOutputConnection);
	};
	
	objectFunctions._linkRegistration_setInputUpdateFunction = function _linkRegistration_setInputUpdateFunction(aUpdateFunction) {
		this._inputUpdateFunction = aUpdateFunction;
		this.setAsDirty();
	};
	
	objectFunctions._linkRegistration_removeInputUpdateFunction = function _linkRegistration_removeInputUpdateFunction() {
		this._inputUpdateFunction = null;
	};
	
	objectFunctions._linkRegistration_removeInputConnection = function _linkRegistration_removeInputConnection(aProperty) {
		//console.log("com.developedbyme.core.objectparts.Property::_linkRegistration_removeInputConnection");
		//console.log(this.name);
		if(this._inputConnection === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_linkRegistration_removeInputConnection", "Property " + this + " doesn't have any input.");
			return;
		}
		
		var shouldUpdate = !(this._inputConnection.isDestroyed() || this.isDestroyed());
		
		var oldInput = this._inputConnection;
		this._inputConnection = null;
		this._animationController = null;
		
		if(shouldUpdate) {
			this.setValue(oldInput.getValue());
		}
	};
	
	objectFunctions._linkRegistration_removeConnectedOutput = function _linkRegistration_removeConnectedOutput(aOutputConnection) {
		
		var index = ArrayFunctions.indexOfInArray(this._outputConnections, aOutputConnection);
		if(index === -1) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_linkRegistration_removeConnectedOutput", "Property " + this + " doesn't have output " + aOutputConnection + ".");
			return;
		}
		this._outputConnections.splice(index, 1);
	};
	
	objectFunctions.fillWithCleanOutputConnections = function fillWithCleanOutputConnections(aReturnArray) {
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.getStatus === undefined || currentObject.getStatus() === FlowStatusTypes.UPDATED) {
				aReturnArray.push(currentObject);
			}
		}
		if(this._objectInputConnection !== null && this._objectInputConnection.isOutput() && this._objectInputConnection.getStatus() === FlowStatusTypes.UPDATED) {
			aReturnArray.push(this._objectInputConnection);
		}
	};
	
	objectFunctions.fillWithDirtyInputConnections = function fillWithDirtyInputConnections(aReturnArray) {
		if(this._inputConnection !== null && this._inputConnection.getStatus() === FlowStatusTypes.NEEDS_UPDATE) {
			aReturnArray.push(this._inputConnection);
		}
		if(this._objectInputConnection !== null && !this._objectInputConnection.isOutput() && this._objectInputConnection.getStatus() === FlowStatusTypes.NEEDS_UPDATE) {
			aReturnArray.push(this._objectInputConnection);
		}
		if(this._inputUpdateFunction !== null) {
			aReturnArray.push(this._inputUpdateFunction);
		}
	};
	
	objectFunctions.fillWithAllInputConnections = function fillWithInputConnections(aReturnArray) {
		if(this._inputConnection !== null) {
			aReturnArray.push(this._inputConnection);
		}
		if(this._objectInputConnection !== null && !this._objectInputConnection.isOutput()) {
			aReturnArray.push(this._objectInputConnection);
		}
		if(this._inputUpdateFunction !== null) {
			aReturnArray.push(this._inputUpdateFunction);
		}
	};
	
	objectFunctions.fillWithAllOutputConnections = function fillWithCleanOutputConnections(aReturnArray) {
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			aReturnArray.push(currentObject);
		}
		if(this._objectInputConnection !== null && this._objectInputConnection.isOutput()) {
			aReturnArray.push(this._objectInputConnection);
		}
	};
	
	objectFunctions.setAsDirty = function setAsDirty() {
		//console.log("com.developedbyme.core.objectparts.Property::setAsDirty");
		//console.log(this.name);
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		this._flowUpdateNumber = dbm.singletons.dbmFlowManager.getFlowUpdateNumber();
		this.setDependentConnectionsAsDirty();
	};
	
	objectFunctions.setDependentConnectionsAsDirty = function setDependentConnectionsAsDirty() {
		//console.log("com.developedbyme.core.objectparts.Property::setDependentConnectionsAsDirty");
		
		dbm.singletons.dbmFlowManager.setDependentConnectionsAsDirty(this);
	};
	
	objectFunctions._toString_getAttributes = function _toString_getAttributes(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this.name);
		aReturnArray.push("value: " + this._performGetValue());
	};
	
	objectFunctions.performDestroy = function performDestroy() {
		//console.log("com.developedbyme.core.objectparts.Property::performDestroy");
		//console.log(this.toString());
		
		if(this._isUpdating) {
			dbm.singletons.dbmFlowManager.removeUpdatedProperty(this);
		}
		if(this._objectInputConnection !== null) {
			this._objectInputConnection._linkRegistration_removeObjectProperty(this);
		}
		if(this._inputConnection !== null) {
			this.disconnectInput();
		}
		if(this._inputUpdateFunction !== null) {
			this._inputUpdateFunction._linkRegistration_removeOutputConnection(this);
			this._linkRegistration_removeInputUpdateFunction();
		}
		if(this._outputConnections !== null) {
			var currentArray = ArrayFunctions.copyArray(this._outputConnections);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				this.disconnectOutput(currentArray[i]);
			}
		}
		
		this.superCall();
		//console.log("//com.developedbyme.core.objectparts.Property::performDestroy");
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function _internalFunctionality_ownsVariable(aName) {
		switch(aName) {
			case "_value":
				return false;
		}
		return this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function setAllReferencesToNull() {
		
		this._value = null;
		this._objectInputConnection = null;
		this._inputConnection = null;
		this._animationController = null;
		this._inputUpdateFunction = null;
		this._outputConnections = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function create(aObjectInput, aValue) {
		//console.log("com.developedbyme.core.objectparts.Property::create");
		var newProperty = (new Property()).init();
		aObjectInput._linkRegistration_addObjectProperty(newProperty);
		newProperty._linkRegistration_setObjectInputConnection(aObjectInput);
		if(aValue instanceof Property) {
			newProperty.connectInput(aValue);
		}
		else {
			newProperty.setValue(aValue);
		}
		return newProperty;
	};
	
});