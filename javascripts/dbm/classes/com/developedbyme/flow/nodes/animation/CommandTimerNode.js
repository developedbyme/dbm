/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.animation.CommandTimerNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.animation.CommandTimerNode");
	//"use strict";
	
	var CommandTimerNode = dbm.importClass("com.developedbyme.flow.nodes.animation.CommandTimerNode");
	
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.animation.CommandTimerNode::_init");
		
		this.superCall();
		
		this._lastPosition = 0;
		this._time = this.createProperty("time", 0);
		this._currentPosition = this.createProperty("currentPosition", 0);
		
		this._delayedTimesArray = new Array();
		this._delayedCommands = new Array();
		this._delayedUndoCommands = new Array();
		
		this.createUpdateFunction("default", this._update, [this._time], [this._currentPosition]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.animation.CommandTimerNode::_update");
		
		var currentTime = this._time.getValueWithoutFlow();
		
		var theLength = this._delayedTimesArray.length;
		
		for(var i = this._lastPosition-1; i >= 0; i--) {
			if(currentTime < this._delayedTimesArray[i]) {
				var currentEvent = this._delayedUndoCommands[i];
				if(currentEvent !== null) {
					var eventDataObject = EventDataObject.create(null, this, this);
					currentEvent.perform(eventDataObject);
					eventDataObject.destroy();
				}
				this._lastPosition = i;
			}
			else {
				break;
			}
		}
		
		for(var i = this._lastPosition; i < theLength; i++) {
			//console.log(i, currentTime, this._delayedTimesArray[i]);
			if(currentTime >= this._delayedTimesArray[i]) {
				var currentEvent = this._delayedCommands[i];
				if(currentEvent !== null) {
					var eventDataObject = EventDataObject.create(null, this, this);
					currentEvent.perform(eventDataObject);
					eventDataObject.destroy();
				}
				this._lastPosition = i+1;
			}
			else {
				break;
			}
		}
		
		this._currentPosition.setValueWithFlow(this._lastPosition, aFlowUpdateNumber);
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
	
	objectFunctions.addCommand = function(aCommand, aUndoCommand, aDelay) {
		var newTime = this._currentPosition.getAnimationController().getTime()+aDelay;
		
		this.addCommandAt(aCommand, aUndoCommand, newTime);
	};
	
	objectFunctions.addCommandAt = function(aCommand, aUndoCommand, aTime) {
		
		var insertPosition = this._getInsertPosition(aTime);
		
		if(aCommand !== null) {
			aCommand.retain();
		}
		if(aUndoCommand !== null) {
			aUndoCommand.retain();
		}
		
		if(insertPosition !== -1) {
			this._delayedTimesArray.splice(insertPosition, 0, aTime);
			this._delayedCommands.splice(insertPosition, 0, aCommand);
			this._delayedUndoCommands.splice(insertPosition, 0, aUndoCommand);
			
			if(insertPosition < this._lastPosition) {
				this._lastPosition++;
				var eventDataObject = EventDataObject.create(null, this, this);
				aCommand.perform(eventDataObject);
				eventDataObject.destroy();
			}
		}
		else {
			this._delayedTimesArray.push(aTime);
			this._delayedCommands.push(aCommand);
			this._delayedUndoCommands.push(aUndoCommand);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._time = null;
		this._currentPosition = null;
		
		this._delayedTimesArray = null;
		this._delayedCommands = null;
		this._delayedUndoCommands = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aTime) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("time", aTime);
		
		return newNode;
	};
});