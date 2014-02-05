dbm.registerClass("com.developedbyme.utils.data.CommandQueue", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.CommandQueue");
	//"use strict";
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.CommandQueue");
	var EventDataObject = dbm.importClass("com.developedbyme.core.extendedevent.EventDataObject");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.CommandQueue::_init");
		
		this.superCall();
		
		this._commandQueueArray = new Array();
		this._commandsObject = new Object();
		this._currentPosition = 0;
		this._isRunning = false;
		
		return this;
	};
	
	/**
	 * Checks if the commands are running.
	 */
	objectFunctions.isRunning = function() {
		return this._isRunning;
	}; //End function get isRunning
	
	/**
	 * Adds a command that performs the queued command of a type.
	 *
	 * @param	aType		The identifier for the command.
	 * @param	aCommand	The command that performs the queued command
	 */
	objectFunctions.addTypeCommand = function(aType, aCommand) {
		this._commandsObject[aType] = aCommand;
	};
	
	/**
	 * Creates a command that calls a function.
	 */
	objectFunctions.createFunctionTypeCommand = function(aType, aObject, aFunction, aPassData) {
		var newCommand;
		if(aPassData) {
			newCommand = CallFunctionCommand.createCommand(aObject, aFunction, [GetVariableObject.createSelectDataCommand()]);
		}
		else {
			newCommand = CallFunctionCommand.createCommand(aObject, aFunction, []);
		}
		this.addTypeCommand(aType, newCommand);
	};
	
	/**
	 * Creates a command that calls a function with arguments.
	 */
	objectFunctions.createFunctionTypeCommandWithArguments = function(aType, aObject, aFunction, aArguments) {
		var newCommand = CallFunctionCommand.createCommand(aObject, aFunction, aArguments);
		this.addTypeCommand(aType, newCommand);
	};
	
	/**
	 * Adds a command to the queue.
	 *
	 * @param	aType		The identifier for the funnction that should perform the command.
	 * @param	aDataObject	The Object with all the data used in the command.
	 */
	objectFunctions.createQueuedCommand = function(aType, aDataObject) {
		var newObject = {type: aType, dataObject: aDataObject};
		this._commandQueueArray.push(newObject);
	};
	
	/**
	 * Runs all the queued commands.
	 */
	objectFunctions.runQueuedCommands = function() {
		this._isRunning = true;
		var currentArray = this._commandQueueArray;
		for(var i = (this._currentPosition-1); ++i < currentArray.length;) {
			var currentObject = currentArray[i];
			if(this._commandsObject[currentObject["type"]] === undefined) {
				//METODO: error message
			}
			else {
				var eventDataObject = EventDataObject.create(currentObject["dataObject"], null, null);
				this._commandsObject[currentObject["type"]].perform(eventDataObject);
				eventDataObject.destroy();
			}
		}
		this._isRunning = false;
	};
	
	/**
	 * Removes all the queued commands
	 */
	objectFunctions.reset = function() {
		this._commandQueueArray.splice(0, this._commandQueueArray.length);
		this._currentPosition = 0;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._commandQueueArray = null;
		this._commandsObject = null;
		
		this.superCall();
	};
});