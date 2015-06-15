/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.gui.abstract.transition.TransitionBaseObject", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.gui.abstract.transition.TransitionBaseObject");
	
	//Self reference
	var TransitionBaseObject = dbm.importClass("dbm.gui.abstract.transition.TransitionBaseObject");
	
	//Error report
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var TransationStateTypes = dbm.importClass("dbm.constants.status.TransationStateTypes");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.gui.abstract.transition.TransitionBaseObject::_init");
		
		this.superCall();
		
		this._states = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions._performAnimateState = function(aStateProperties, aState, aTransitionState, aParameter, aTime, aInterpolationType, aDelay) {
		
		aInterpolationType = VariableAliases.valueWithDefault(aInterpolationType, TransationStateTypes.LINEAR);
		aDelay = VariableAliases.valueWithDefault(aDelay, 0);
		
		var stateProperty = aStateProperties.getProperty("state");
		var parameterProperty = aStateProperties.getProperty("parameter");
		
		if(aTime === 0 && aDelay === 0) {
			stateProperty.setValue(aState);
			parameterProperty.setValue(aParameter);
		}
		else {
			if(aDelay === 0) {
				stateProperty.setValue(aTransitionState);
			}
			else {
				stateProperty.setValueWithDelay(aTransitionState, aDelay);
			}
			
			parameterProperty.animateValue(aParameter, aTime, aInterpolationType, aDelay);
			stateProperty.setValueWithDelay(aState, aTime+aDelay);
		}
	};
	
	objectFunctions.animateOnState = function(aName, aTime, aInterpolationType, aDelay) {
		
		var stateProperties = this.getState(aName);
		this._performAnimateState(stateProperties, TransationStateTypes.ON, TransationStateTypes.ON_TRANSITION, 1, aTime, aInterpolationType, aDelay);
	};
	
	objectFunctions.animateOffState = function(aName, aTime, aInterpolationType, aDelay) {
		
		var stateProperties = this.getState(aName);
		this._performAnimateState(stateProperties, TransationStateTypes.OFF, TransationStateTypes.OFF_TRANSITION, 0, aTime, aInterpolationType, aDelay);
	};
	
	objectFunctions.createState = function(aName, aInitialState, aInitialParameter) {
		if(this._states.select(aName)) {
			//METODO: warning message
			return this._states.currentSelectedItem;
		}
		return this._createNewState(aName);
	};
	
	objectFunctions.getState = function(aName) {
		if(this._states.select(aName)) {
			return this._states.currentSelectedItem;
		}
		//METODO: warning message
		return this._createNewState(aName);
	};
	
	objectFunctions._createNewState = function(aName, aInitialState, aInitialParameter) {
		
		aInitialState = VariableAliases.valueWithDefault(aInitialState, TransationStateTypes.OFF);
		
		if(!VariableAliases.isSet(aInitialParameter)) {
			if(aInitialState === TransationStateTypes.ON || aInitialState === TransationStateTypes.OFF_TRANSITION) {
				aInitialParameter = 1;
			}
			else {
				aInitialParameter = 0;
			}
		}
		
		var newState = PropertiesHolder.create({"state": aInitialState, "parameter": aInitialParameter});
		this._states.addObject(aName, newState);
		
		return newState;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._states = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aStateNames) {
		var newTransitionBaseObject = (new TransitionBaseObject()).init();
		
		var currentArray = aStateNames;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			newTransitionBaseObject.createState(currentArray[i]);
		}
		
		return newTransitionBaseObject;
	};
});