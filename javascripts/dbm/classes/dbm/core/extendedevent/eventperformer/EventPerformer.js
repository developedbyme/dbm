/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.extendedevent.eventperformer.EventPerformer", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.extendedevent.eventperformer.EventPerformer");
	
	//Self reference
	var EventPerformer = dbm.importClass("dbm.core.extendedevent.eventperformer.EventPerformer");
	
	//Error report
	
	//Dependencies
	var CommandsArrayIterator = dbm.importClass("dbm.core.extendedevent.commands.CommandsArrayIterator");
	
	//Utils
	
	//Constants
	var CommandStatusTypes = dbm.importClass("dbm.constants.status.CommandStatusTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.extendedevent.eventperformer.EventPerformer::_init");
		
		this.superCall();
		
		this._commandsArray = (new CommandsArrayIterator()).init();
		this._commandsArray.canRemoveItemsWhileActive = true;
		this._commandsArray.canAddItemsWhileActive = false;
		this.addDestroyableObject(this._commandsArray);
		
		this.breakOnError = false;
		this._isPerforming = false;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("dbm.core.extendedevent.eventperformer.EventPerformer::perform");
		var currentCommand;
		var theResult;
		
		var iterationData = this._commandsArray.createIterationData();
		for(;iterationData.position < iterationData.length; iterationData.position++) {
			currentCommand = iterationData.array[iterationData.position];
			theResult = currentCommand.perform(aEventDataObject);
			if(this._isDestroyed) {
				break;
			}
			if(currentCommand.removeAfterPerform) {
				this._commandsArray.removeItem(currentCommand);
			}
			
			if((theResult === CommandStatusTypes.BREAK) || (this.breakOnError && (theResult === CommandStatusTypes.ERROR))) {
				break;
			}
		}
		if(!this._isDestroyed) {
			this._commandsArray.stopUsingIterationData(iterationData);
		}
	};
	
	objectFunctions.addCommand = function(aCommand) {
		this._commandsArray.push(aCommand);
	};
	
	objectFunctions.removeCommand = function(aCommand) {
		//console.log("dbm.core.extendedevent.eventperformer.EventPerformer::removeCommand");
		
		this._commandsArray.removeItem(aCommand);
	};
	
	objectFunctions.removeCommandById = function(aId) {
		this._commandsArray.removeItemById(aId);
	};
	
	objectFunctions.hasCommandWithId = function(aId) {
		return this._commandsArray.hasItemWithId(aId);
	};
	
	objectFunctions.resetCommands = function() {
		this._commandsArray.stop();
		this._commandsArray.destroy();
		
		this._commandsArray = (new CommandsArrayIterator()).init();
		this._commandsArray.canRemoveItemsWhileActive = true;
		this._commandsArray.canAddItemsWhileActive = false;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._commandsArray = null;
		
		this.superCall();
	};
});