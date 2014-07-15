/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.extendedevent.commands.CommandsArrayIterator", "com.developedbyme.utils.data.iterator.ActiveRetainArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.CommandsArrayIterator");
	
	var CommandsArrayIterator = dbm.importClass("com.developedbyme.core.extendedevent.commands.CommandsArrayIterator");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.CommandsArrayIterator::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createCommandsForCommandQueue = function() {
		this.superCall();
		
		this._commandQueue.createFunctionTypeCommand("removeItemById", this, this.push, true);
	};
	
	/**
	 * Verifies that an item can be added
	 */
	objectFunctions._verifyItem = function(aObject) {
		
		//METODO
		
		return true;
	};
	
	/**
	 * Checks if an item from the list has the id.
	 * 
	 * @param	aId	The id of the commands to check for.
	 * 
	 * @return	true if one or more commands exist
	 */
	objectFunctions.hasItemWithId = function(aId) {
		var currentArray = this.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aId === currentArray[i].id) {
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Removes an item from the list by id.
	 * 
	 * @param	aId	The id of the commands to remove
	 */
	objectFunctions.removeItemById = function(aId) {
		//console.log("com.developedbyme.core.extendedevent.commands.CommandsArrayIterator::removeItemById");
		//console.log(this._isActive, this._canRemoveItemsWhileActive);
		if(!this._lock.isLocked() || this._canRemoveItemsWhileActive) {
			var isFound = false;
			var currentArray = this.array;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentCommand = currentArray[i];
				if(aId === currentCommand.id) {
					this._itemRemoved(currentArray[i]);
					currentArray.splice(i, 1);
					currentArrayLength--;
					i--;
					isFound = true;
					this._updateAllIterationDatas(i, -1, currentArrayLength);
				}
			}
			if(!isFound) {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "removeItemById", "No item with id " + aId + " exists.");
			}
		}
		else {
			this._commandQueue.createQueuedCommand("removeItemById", aId);
		}
	};
});