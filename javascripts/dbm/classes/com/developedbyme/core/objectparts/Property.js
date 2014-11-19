/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.objectparts.Property", "com.developedbyme.core.objectparts.FlowStatusBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.objectparts.Property");
	//"use strict";
	
	//Self reference
	var Property = dbm.importClass("com.developedbyme.core.objectparts.Property");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	var GlobalVariables = dbm.importClass("com.developedbyme.core.globalobjects.GlobalVariables");
	var FlowStatusTypes = dbm.importClass("com.developedbyme.constants.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.objectparts.Property::_init");
		
		this.superCall();
		
		this.name = null;
		
		this._alwaysUpdateFlow = false;
		this._canSetValueInAnimation = true;
		
		this._value = null;
		this._inputConnection = null;
		this._inputUpdateFunction = null;
		this._inputConnections = new Array();
		this._outputConnections = new Array();
		this._animationController = null;
		
		this._isUpdating = false;
		
		this._cachedDependentNodeChains = null;
		
		return this;
	};
	
	/**
	 * Gets the property that is inputting to this property.
	 *
	 * @return	Property	The inpurt property. Null if it doesn't have any input.
	 */ 
	objectFunctions.getInputProperty = function() {
		return this._inputConnection;
	}
	
	/**
	 * Performs setting the value of this property. Used in subclasses that affects functionality.
	 *
	 * @param	aValue	*	The value to set to this property.
	 */ 
	objectFunctions._performSetValue = function(aValue) {
		this._value = aValue;
	};
	
	/**
	 * Gets the value of this property without triggering the flow update.
	 *
	 * @return	*	The value of this property.
	 */
	objectFunctions.getValueWithoutFlow = function() {
		return this._value;
	};
	
	/**
	 * An external change is happening to the value. Used by subclasses that can have external functionality working togheter with the flow.
	 *
	 * @return	*	The value to set to this property.
	 */
	objectFunctions.externalChangeToValue = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.Property::externalChangeToValue");
		if(aValue === this.getValueWithoutFlow()) return;
		this._performSetValue(aValue);
		this.flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this.setDependentConnectionsAsDirty();
	};
	
	/**
	 * Sets the value of this property. If this property is connected to an animation controller (or if the system is recording) the value is added to that timeline.
	 *
	 * @param	aValue	*	The value to set to this property.
	 */
	objectFunctions.setValue = function(aValue) {
		if(this._inputConnection !== null && (this._animationController === null || !this._canSetValueInAnimation)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValue", "Can't set value when property has input.");
			return;
		}
		if(this._animationController === null) {
			if(!dbm.singletons.dbmAnimationManager.isRecording()) {
				if(this._alwaysUpdateFlow || (aValue !== this.getValueWithoutFlow())) {
					this._performSetValue(aValue);
					this.flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
					this.setDependentConnectionsAsDirty();
				}
				return;
			}
			this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this.getValueWithoutFlow(), this);
		}
		this._animationController.setValue(aValue);
	};
	
	/**
	 * Sets the value on the timeline control with a delay.
	 *
	 * @param	aValue	*		The value to set to this property.
	 * @param	aDelay	Number	The time (in seconds) to delay the value change.
	 */
	objectFunctions.setValueWithDelay = function(aValue, aDelay) {
		if(!this.canBeSet()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setValueWithDelay", "Can't set value when property has input.");
			return;
		}
		this.createTimelineControl();
		this._animationController.setValue(aValue, aDelay);
	};
	
	/**
	 * Animates the value of this property (from the curent value) on the timeline control.
	 *
	 * @param	aValue			*									The value to animate this property to.
	 * @param	aTime			Number								The time (in seconds) to animate.
	 * @param	aInterpolation	InterpolationTypes|String|Function	The interpolation to use over the animation time.
	 * @param	aDelay			Number								The time in seconds to wait before starting the animation.
	 */
	objectFunctions.animateValue = function(aValue, aTime, aInterpolation, aDelay) {
		if(!this.canBeSet()) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "animateValue", "Can't set value when property has input.");
			return;
		}
		this.createTimelineControl();
		this._animationController.animateValue(aValue, aTime, aInterpolation, aDelay);
	};
	
	/**
	 * Creates timeline control for this property.
	 *
	 * @return	Timeline	The timeline control for this property. Null if the property already has an input connection and can't be controlled.
	 */
	objectFunctions.createTimelineControl = function() {
		if(this._animationController === null) {
			if(this._inputConnection !== null) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "createTimelineControl", "Can't set value when property has input.");
				return null;
			}
			this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this.getValueWithoutFlow(), this);
		}
		
		return this._animationController;
	};
	
	/**
	 * Sets the animation controller for this object.
	 *
	 * @param	aController		Timeline	The timeline controller.
	 *
	 * @return	self
	 */
	objectFunctions.setAnimationController = function(aController) {
		this._animationController = aController;
		
		return this;
	};
	
	/**
	 * Gets the animation controller for this object. A new controller is created if it doesn't already exist, unless the property already has an input connection.
	 *
	 * @return	Timeline	The animation controller. Null if it doesn't exist and can't be created.
	 */
	objectFunctions.getAnimationController = function() {
		if(this._animationController !== null) {
			return this._animationController;
		}
		if(this._inputConnection !== null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getAnimationController", "Property doesn't have an animation controller as input.");
			return null;
		}
		this._animationController = dbm.singletons.dbmAnimationManager.createTimeline(this.getValueWithoutFlow(), this);
		return this._animationController;
	};
	
	/**
	 * Checkes if the value of this property can be set. Either direct or on a timeline.
	 *
	 * @return	Boolean		True if the value can be set.
	 */
	objectFunctions.canBeSet = function() {
		return (this._inputConnection === null || (this._animationController !== null && this._canSetValueInAnimation));
	};
	
	/**
	 * Sets the value when the whole flow is evaluated.
	 *
	 * @param	aValue				*		The value to set this property to.
	 * @param	aFlowUpdateNumber	Number	The integer for keeping track of flow updates.
	 */
	objectFunctions.setValueWithFlow = function(aValue, aFlowUpdateNumber) {
		//console.log("com.developedbyme.core.objectparts.Property::setValueWithFlow");
		//console.log(this.name);
		//console.log(aValue, this._value);
		if(this._alwaysUpdateFlow || (aValue !== this.getValueWithoutFlow())) {
			this._performSetValue(aValue);
			this.flowUpdateNumber = aFlowUpdateNumber;
		}
		this.status = FlowStatusTypes.UPDATED;
	};
	
	/**
	 * Gets the value of this property. A flow update is triggered if this property has an input connection.
	 *
	 * @return	*	The value of this property.
	 */ 
	objectFunctions.getValue = function() {
		
		if(this.status === FlowStatusTypes.NEEDS_UPDATE) {
			dbm.singletons.dbmFlowManager.updateProperty(this);
		}
		
		return this.getValueWithoutFlow();
	};
	
	/**
	 * Checks if this property has an animation controller.
	 *
	 * @return	Boolean		True if this property is connected to a timeline control.
	 */
	objectFunctions.hasAnimationController = function() {
		return (this._animationController !== null);
	};
	
	/**
	 * Sets the property to always update. Objects are tested with a shallow compare, so they will need this setting unless a new object is generated every update.
	 *
	 * @param	aUpdate		Boolean		Setting if the property should always update. (Optional, default true)
	 *
	 * @return	self
	 */
	objectFunctions.setAlwaysUpdateFlow = function(aUpdate) {
		this._alwaysUpdateFlow = !VariableAliases.isFalse(aUpdate);
		
		return this;
	};
	
	/**
	 * Link registation to set the updating flag.
	 *
	 * @param	aIsUpdating		Boolean		If the property is updating or not.
	 */
	objectFunctions._linkRegistration_setAsUpdating = function(aIsUpdating) {
		this._isUpdating = aIsUpdating;
	};
	
	/**
	 * Checks if this property is updated every frame.
	 *
	 * @return	Boolean		True if the property is updated every frame.
	 */
	objectFunctions.isUpdating = function() {
		return this._isUpdating;
	};
	
	/**
	 * Updates the value of this property.
	 *
	 * @return	self
	 */
	objectFunctions.update = function() {
		dbm.singletons.dbmFlowManager.updateProperty(this);
		
		return this;
	};
	
	/**
	 * Starts updating this property on every frame update from the UpdateManager.
	 *
	 * @return	self
	 */
	objectFunctions.startUpdating = function() {
		if(this._isUpdating) return this;
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(this);
		
		return this;
	};
	
	/**
	 * Stops updating this property on every frame update from the UpdateManager.
	 *
	 * @return	self
	 */
	objectFunctions.stopUpdating = function() {
		if(!this._isUpdating) return this;
		
		dbm.singletons.dbmFlowManager.removeUpdatedProperty(this);
		
		return this;
	};
	
	/**
	 * Interface to update the the flow of this property.
	 */
	objectFunctions.updateFlow = function() {
		//console.log("com.developedbyme.core.objectparts.Property::updateFlow");
		//console.log(this.name);
		
		if(this._inputConnection !== null) {
			this._performSetValue(this._inputConnection.getValueWithoutFlow());
		}
	};
	
	/**
	 * Connects another property to be the input of this property.
	 *
	 * @param	aProeprty	Proeprty	The input property.
	 */
	objectFunctions.connectInput = function(aProperty) {
		dbm.singletons.dbmFlowManager.connectProperties(aProperty, this);
		
		return this;
	};
	
	/**
	 * Disconnects the input from this property.
	 *
	 * @return self
	 */
	objectFunctions.disconnectInput = function() {
		if(this._inputConnection === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "disconnectInput", "Property " + this + " doesn't have any input.");
			return this;
		}
		dbm.singletons.dbmFlowManager.disconnectProperties(this._inputConnection, this);
		
		return this;
	};
	
	/**
	 * Connects another property to be an output for this property.
	 *
	 * @param	aProeprty	Proeprty	The output property.
	 */
	objectFunctions.connectOutput = function(aProperty) {
		dbm.singletons.dbmFlowManager.connectProperties(this, aProperty);
		
		return this;
	};
	
	/**
	 * Disconnects a property that has been an output for this property.
	 *
	 * @param	aProeprty	Proeprty	The output property to disconnect.
	 */
	objectFunctions.disconnectOutput = function(aProperty) {
		dbm.singletons.dbmFlowManager.disconnectProperties(this, aProperty);
		
		return this;
	};
	
	/**
	 * Link registation to set the input connection.
	 *
	 * @param	aInputConnection	Property	The input property.
	 */
	objectFunctions._linkRegistration_setInputConnection = function(aInputConnection) {
		//console.log("com.developedbyme.core.objectparts.Property::_linkRegistration_setInputConnection");
		//console.log(this.name);
		if(this._inputConnection !== null) {
			this.disconnectInput();
		}
		this._inputConnection = aInputConnection;
		this._inputConnections.push(aInputConnection);
		if(aInputConnection instanceof Timeline) { //METODO: fix this to check if it's a timline evaluator
			this._animationController = aInputConnection;
		}
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		this.setDependentConnectionsAsDirty();
		
		this.flowUpdateNumber = 0;
	};
	
	objectFunctions._linkRegistration_addConnectedOutput = function(aOutputConnection) {
		this._outputConnections.push(aOutputConnection);
	};
	
	/**
	 * Link registration to set the input update function.
	 *
	 * @param	aUpdateFunction		UpdateFunction	The input update function.
	 */
	objectFunctions._linkRegistration_setInputUpdateFunction = function(aUpdateFunction) {
		this._inputUpdateFunction = aUpdateFunction;
		this._inputConnections.push(aUpdateFunction);
		this.setAsDirty();
	};
	
	/**
	 * Link registation to remove the input update function.
	 */
	objectFunctions._linkRegistration_removeInputUpdateFunction = function() {
		this._inputUpdateFunction = null;
		this._inputConnections.pop();
	};
	
	/**
	 * Link registation for removing an input property.
	 *
	 * @param	aOutputConnection	Property	The input to remove.
	 */
	objectFunctions._linkRegistration_removeInputConnection = function(aProperty) {
		//console.log("com.developedbyme.core.objectparts.Property::_linkRegistration_removeInputConnection");
		//console.log(this.name);
		if(this._inputConnection === null) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_linkRegistration_removeInputConnection", "Property " + this + " doesn't have any input.");
			return;
		}
		
		var shouldUpdate = !(this._inputConnection.isDestroyed() || this.isDestroyed());
		
		var oldInput = this._inputConnection;
		this._inputConnection = null;
		this._inputConnections.pop();
		this._animationController = null;
		
		if(shouldUpdate) {
			this.setValue(oldInput.getValue());
		}
	};
	
	/**
	 * Link registation for removing an output connection.
	 *
	 * @param	aOutputConnection	Property|UpdateFunction		The output to remove.
	 */
	objectFunctions._linkRegistration_removeConnectedOutput = function(aOutputConnection) {
		
		var index = ArrayFunctions.indexOfInArray(this._outputConnections, aOutputConnection);
		if(index === -1) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_linkRegistration_removeConnectedOutput", "Property " + this + " doesn't have output " + aOutputConnection + ".");
			return;
		}
		this._outputConnections.splice(index, 1);
	};
	
	/**
	 * Fills an array with all the clean (status: updated) output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithCleanOutputConnections = function(aReturnArray) {
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			if(currentObject.status === FlowStatusTypes.UPDATED) {
				aReturnArray.push(currentObject);
			}
		}
	};
	
	/**
	 * Fills an array with all the dirty (status: needs update) input properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithDirtyInputConnections = function(aReturnArray) {
		if(this._inputConnection !== null && this._inputConnection.status === FlowStatusTypes.NEEDS_UPDATE) {
			aReturnArray.push(this._inputConnection);
		}
		if(this._inputUpdateFunction !== null) {
			aReturnArray.push(this._inputUpdateFunction);
		}
	};
	
	/**
	 * Fills an array with all the all input properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllInputConnections = function(aReturnArray) {
		if(this._inputConnection !== null) {
			aReturnArray.push(this._inputConnection);
		}
		if(this._inputUpdateFunction !== null) {
			aReturnArray.push(this._inputUpdateFunction);
		}
	};
	
	/**
	 * Fills an array with all the output properties and update functions.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with connections.
	 */
	objectFunctions.fillWithAllOutputConnections = function(aReturnArray) {
		//console.log("com.developedbyme.core.objectparts.Property::fillWithAllOutputConnections");
		
		var currentArray = this._outputConnections;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentObject = currentArray[i];
			aReturnArray.push(currentObject);
		}
	};
	
	/**
	 * Sets the status of this property to need update, and marks the rest of the down stream flow to also need update.
	 */
	objectFunctions.setAsDirty = function() {
		//console.log("com.developedbyme.core.objectparts.Property::setAsDirty");
		//console.log(this.name);
		this.setStatus(FlowStatusTypes.NEEDS_UPDATE);
		this.flowUpdateNumber = GlobalVariables.FLOW_UPDATE_NUMBER;
		this.setDependentConnectionsAsDirty();
	};
	
	/**
	 * Marks the rest of the down stream flow to need update.
	 */
	objectFunctions.setDependentConnectionsAsDirty = function() {
		//console.log("com.developedbyme.core.objectparts.Property::setDependentConnectionsAsDirty");
		//console.log(this, this._cachedDependentNodeChains);
		
		if(this._cachedDependentNodeChains !== null) {
			dbm.singletons.dbmFlowManager.setUpdateChainsAsDirty(this._cachedDependentNodeChains);
		}
		else {
			dbm.singletons.dbmFlowManager.setDependentConnectionsAsDirty(this);
		}
	};
	
	/**
	 * Sets a cashed list of nodes to be used for dependent nodes instead of dynamically generate a new one for every change.
	 *
	 * @param	aNodeChains		Array	The array of chains to use as cache.
	 */
	objectFunctions.setCachedDependentNodeChains = function(aNodeChains) {
		//console.log("com.developedbyme.core.objectparts.Property::setCachedDependentNodeChains");
		//console.log(this, aNodeChains);
		
		this._cachedDependentNodeChains = aNodeChains;
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("name: " + this.name);
		aReturnArray.push("value: " + this.getValueWithoutFlow());
	};
	
	/**
	 * Performs the destruction of all the properties in the object. Part of the destroy function.
	 */
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.core.objectparts.Property::performDestroy");
		//console.log(this.toString());
		
		if(this._isUpdating) {
			dbm.singletons.dbmFlowManager.removeUpdatedProperty(this);
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
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_value":
				return false;
		}
		return this.superCall();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._value = null;
		this._inputConnection = null;
		this._animationController = null;
		this._inputUpdateFunction = null;
		this._inputConnections = null;
		this._outputConnections = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new object of a certain class (Property or subclasses) and sets the object and value.
	 *
	 * @param	aClass	Function	The constructor function of the class.
	 * @param	aValue	Property|*	The input connection or value to set to the property. (Optional)
	 *
	 * @return	Property	The newly created property.
	 */
	staticFunctions._createWithInputValue = function(aClass, aValue) {
		var newProperty = ClassReference._createAndInitClass(aClass);
		ClassReference.setInputOrValueToProperty(newProperty, aValue);
		return newProperty;
	};
	
	/**
	 * Creates a new object of this class.
	 *
	 * @param	aValue	*	The value for the new property. (Optional)
	 *
	 * @return	Property	The newly created object.
	 */
	staticFunctions.create = function(aValue) {
		//console.log("com.developedbyme.core.objectparts.Property::create");
		return ClassReference._createWithInputValue(Property, aValue);
	};
	
	/**
	 * Connects the input or sets the value of a property depending on the input.
	 *
	 * @param	aProperty	Property	The property to set the input connection or value to.
	 * @param	aValue		Property|*	The input property or value to use for the input of the property.
	 *
	 * @return	Property	The property that is passed in.
	 */
	staticFunctions.setInputOrValueToProperty = function(aProperty, aValue) {
		if(aValue instanceof Property) {
			aProperty.connectInput(aValue);
		}
		else {
			aProperty.setValue(aValue);
		}
		return aProperty;
	};
});