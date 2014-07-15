/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.StateActivatedCommandsController", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.StateActivatedCommandsController");
	
	//Self reference
	var StateActivatedCommandsController = dbm.importClass("com.developedbyme.core.extendedevent.StateActivatedCommandsController");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.StateActivatedCommandsController::_init");
		
		this.superCall();
		
		this._currentStateName = null;
		this._eventPerformer = null;
		this._states = this.addDestroyableObject(NamedArray.create(true));
		
		return this;
	};
	
	objectFunctions._activateState = function(aStateName) {
		//console.log("com.developedbyme.core.extendedevent.StateActivatedCommandsController::_activateState");
		//console.log(aStateName);
		
		if(this._states.select(aStateName)) {
			var currentState = this._states.currentSelectedItem;
			var currentArray = currentState.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentEventName = currentArray[i];
				var currentArray2 = currentState.getObject(currentEventName);
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					this._eventPerformer.addCommandToEvent(currentEventName, currentArray2[j]);
				}
			}
		}
	};
	
	objectFunctions._deactivateState = function(aStateName) {
		//console.log("com.developedbyme.core.extendedevent.StateActivatedCommandsController::_deactivateState");
		//console.log(aStateName);
		
		if(this._states.select(aStateName)) {
			var currentState = this._states.currentSelectedItem;
			var currentArray = currentState.getNamesArray();
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentEventName = currentArray[i];
				var currentArray2 = currentState.getObject(currentEventName);
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					this._eventPerformer.removeCommandFromEvent(currentEventName, currentArray2[j]);
				}
			}
		}
	};
	
	objectFunctions.setActiveState = function(aStateName) {
		if(this._currentStateName === aStateName) return;
		
		if(this._eventPerformer !== null) {
			if(this._currentStateName !== null) {
				this._deactivateState(this._currentStateName);
			}
			if(aStateName !== null) {
				this._activateState(aStateName);
			}
		}
		
		this._currentStateName = aStateName;
	};
	
	objectFunctions.setEventPerformer = function(aEventPerformer) {
		//console.log("com.developedbyme.core.extendedevent.StateActivatedCommandsController::setEventPerformer");
		//console.log(aEventPerformer);
		
		this._eventPerformer = aEventPerformer;
		
		if(this._currentStateName !== null) {
			this._activateState(this._currentStateName);
		}
		
		return this;
	};
	
	objectFunctions.addCommandToEvent = function(aStateName, aEventName, aCommand) {
		//console.log("com.developedbyme.core.extendedevent.StateActivatedCommandsController::addCommandToEvent");
		
		aCommand.retain();
		
		var currentState;
		var currentArray = null;
		if(this._states.select(aStateName)) {
			currentState = this._states.currentSelectedItem;
			if(currentState.select(aEventName)) {
				currentArray = currentState.currentSelectedItem;
			}
		}
		else {
			currentState = NamedArray.create(true);
			this._states.addObject(aStateName, currentState);
			
		}
		
		if(currentArray === null) {
			currentArray = new Array();
			currentState.addObject(aEventName, currentArray);
		}
		
		currentArray.push(aCommand);
		
		if(this._currentStateName === aStateName) {
			if(this._eventPerformer !== null) {
				this._eventPerformer.addCommandToEvent(aEventName, aCommand);
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._currentStateName = null;
		this._eventPerformer = null;
		this._states = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_eventPerformer":
				return false;
		}
		return this.superCall();
	};
	
	staticFunctions.create = function(aEventPerformer) {
		return (new ClassReference()).init().setEventPerformer(aEventPerformer);
	};
	
});