/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.DelayedExtendedEventController", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.DelayedExtendedEventController");
	
	var DelayedExtendedEventController = dbm.importClass("com.developedbyme.core.extendedevent.DelayedExtendedEventController");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var ExtendedEventProperty = dbm.importClass("com.developedbyme.core.objectparts.ExtendedEventProperty");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.DelayedExtendedEventController::_init");
		
		this.superCall();
		
		this._owner = null;
		
		this._delayedTimesArray = new Array();
		this._delayedCommands = new Array();
		this._delayedUndoCommands = new Array();
		this._lastPosition = 0;
		this._currentPosition = this.createProperty("currentPosition", 0);
		this._currentPosition.createTimelineControl();
		this._perform = this.createGhostProperty("perform");
		
		this.createUpdateFunction("default", this._updateFlow, [this._currentPosition], [this._perform]);
		this._perform.startUpdating();
		
		return this;
	};
	
	objectFunctions._getInsertPosition = function(aTime) {
		
		var currentArray = this._delayedTimesArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aTime < currentArray[i]) {
				return i;
			}
		}
		
		return -1;
	};
	
	objectFunctions.setOwner = function(aOwner) {
		//console.log("com.developedbyme.core.extendedevent.DelayedExtendedEventController::setOwner");
		//console.log(aOwner);
		
		this._owner = aOwner;
		
		return this;
	};
	
	objectFunctions.addCommand = function(aCommand, aUndoCommand, aDelay) {
		//console.log("com.developedbyme.core.extendedevent.DelayedExtendedEventController::addCommand");
		var newTime = this._currentPosition.getAnimationController().getTime()+aDelay;
		
		this.addCommandAt(aCommand, aUndoCommand, newTime);
	};
	
	objectFunctions.addCommandAt = function(aCommand, aUndoCommand, aTime) {
		var newInternalName = dbm.singletons.dbmIdManager.getNewId("delayedEvent");
		var newInternalUndoName = null;
		
		this._owner.getExtendedEvent().createEvent(newInternalName);
		this._owner.getExtendedEvent().addCommandToEvent(newInternalName, aCommand);
		
		if(aUndoCommand !== null) {
			newInternalUndoName = dbm.singletons.dbmIdManager.getNewId("delayedUndoEvent");
			this._owner.getExtendedEvent().createEvent(newInternalUndoName);
			this._owner.getExtendedEvent().addCommandToEvent(newInternalUndoName, aUndoCommand);
		}
		
		this.callEventAt(newInternalName, newInternalUndoName, aTime);
	};
	
	objectFunctions.addFunctionCall = function(aObject, aFunction, aArguments, aDelay) {
		//console.log("com.developedbyme.core.extendedevent.DelayedExtendedEventController::addFunctionCall");
		
		this.addCommand(CallFunctionCommand.createCommand(aObject, aFunction, aArguments), null, aDelay);
	};
	
	objectFunctions.addFunctionCallAt = function(aObject, aFunction, aArguments, aTime) {
		//console.log("com.developedbyme.core.extendedevent.DelayedExtendedEventController::addFunctionCallAt");
		
		this.addCommandAt(CallFunctionCommand.createCommand(aObject, aFunction, aArguments), null, aTime);
	};
	
	objectFunctions.callEvent = function(aEventName, aUndoEventName, aDelay) {
		
		var newTime = this._currentPosition.getAnimationController().getTime()+aDelay;
		this.callEventAt(aEventName, aUndoEventName, newTime);
	};
	
	objectFunctions.callEventAt = function(aEventName, aUndoEventName, aTime) {
		
		var insertPosition = this._getInsertPosition(aTime);
		
		if(insertPosition !== -1) {
			this._delayedTimesArray.splice(insertPosition, 0, aTime);
			this._delayedCommands.splice(insertPosition, 0, aEventName);
			this._delayedUndoCommands.splice(insertPosition, 0, aUndoEventName);
			
			var theLength = this._delayedTimesArray.length;
			for(var i = insertPosition; i < theLength; i++) {
				this._currentPosition.getAnimationController().setValueAt(i+1, this._delayedTimesArray[i]);
			}
			
			if(insertPosition < this._lastPosition) {
				this._lastPosition++;
				this._owner.getExtendedEvent().perform(aEventName);
			}
		}
		else {
			this._delayedTimesArray.push(aTime);
			this._delayedCommands.push(aEventName);
			this._delayedUndoCommands.push(aUndoEventName);
			
			this._currentPosition.getAnimationController().setValueAt(this._delayedTimesArray.length, aTime);
		}
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		
		var newPosition = this._currentPosition.getValueWithoutFlow();
		
		if(newPosition < this._lastPosition) {
			for(var i = this._lastPosition-1; i >= newPosition; i--) {
				var currentEvent = this._delayedUndoCommands[i];
				if(currentEvent !== null) {
					this._owner.getExtendedEvent().perform(currentEvent);
				}
			}
		}
		else {
			for(var i = this._lastPosition; i < newPosition; i++) {
				var currentEvent = this._delayedCommands[i];
				if(currentEvent !== null) {
					this._owner.getExtendedEvent().perform(currentEvent);
				}
			}
		}
		
		this._lastPosition = newPosition;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._owner = null;
		this._delayedTimesArray = null;
		this._delayedCommands = null;
		this._delayedUndoCommands = null;
		this._currentPosition = null;
		this._perform = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_owner":
			case "_delayedProperty":
				return false;
		}
		return this.superCall();
	};
	
	staticFunctions.create = function(aOwner) {
		return (new ClassReference()).init().setOwner(aOwner);
	};
	
});