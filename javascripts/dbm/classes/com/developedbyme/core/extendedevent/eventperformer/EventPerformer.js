dbm.registerClass("com.developedbyme.core.extendedevent.eventperformer.EventPerformer", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.eventperformer.EventPerformer");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	var CommandsArrayIterator = dbm.importClass("com.developedbyme.core.extendedevent.commands.CommandsArrayIterator");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.extendedevent.eventperformer.EventPerformer::init");
		
		this.superCall();
		
		this._commandsArray = (new CommandsArrayIterator()).init();
		this._commandsArray.canRemoveItemsWhileActive = true;
		this._commandsArray.canAddItemsWhileActive = false;
		
		this.breakOnError = false;
		this._isPerforming = false;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.eventperformer.EventPerformer::perform");
		var currentCommand;
		var theResult;
		
		this._commandsArray.start();
		while(this._commandsArray.isActive()) {
			currentCommand = this._commandsArray.getNextItem();
			theResult = currentCommand.perform(aEventDataObject);
			if(this._isDestroyed) {
				break;
			}
			if(currentCommand.removeAfterPerform) {
				this._commandsArray.removeItem(currentCommand);
			}
			
			if((theResult == CommandStatusTypes.BREAK) || (this.breakOnError && (theResult == CommandStatusTypes.ERROR))) {
				this._commandsArray.stop();
			}
		}
	};
	
	objectFunctions.addCommand = function(aCommand) {
		this._commandsArray.push(aCommand);
	};
	
	objectFunctions.removeCommand = function(aCommand) {
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
	
	
	objectFunctions.performDestroy = function() {
		
		//METODO: destroy
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._commandsArray = null;
		
		this.superCall();
	};
});