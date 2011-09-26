dbm.registerClass("com.developedbyme.utils.data.iterator.ActiveArrayIterator", "com.developedbyme.utils.data.iterator.ArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator");
	
	var CommandQueue = dbm.importClass("com.developedbyme.utils.data.CommandQueue");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator::init");
		
		this.superCall();
		
		this._isActive = false;
		this._canAddItemsWhileActive = true;
		this._canRemoveItemsWhileActive = true;
			
		this._commandQueue = (new CommandQueue()).init();
		
		this._commandQueue.createFunctionTypeCommand("push", this, this.push, true);
		this._commandQueue.createFunctionTypeCommand("pop", this, this.push, false);
		this._commandQueue.createFunctionTypeCommand("unshift", this, this.unshift, true);
		this._commandQueue.createFunctionTypeCommand("shift", this, this.push, false);
		this._commandQueue.createFunctionTypeCommand("removeItem", this, this.removeItem, true);
		this._commandQueue.createFunctionTypeCommand("removeItemAt", this, this.removeItemAt, true);
		this._commandQueue.createFunctionTypeCommandWithArguments("addItemAt", this, this.addItemAt, [GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "object"), GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "index")]);
		
		this._commandQueue.createFunctionTypeCommand("setAddItemsWhileActive", this, this.setAddItemsWhileActive, true);
		this._commandQueue.createFunctionTypeCommand("setRemoveItemsWhileActive", this, this.setRemoveItemsWhileActive, true);
		
		return this;
	};
	
	objectFunctions._itemPreAdded = function(aObject) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.setAddRemoveWhileActive = function(aCanAddItemsWhileActive, aCanRemoveItemsWhileActive) {
		if(!this._isActive) {
			this._canAddItemsWhileActive = aCanAddItemsWhileActive;
			this._canRemoveItemsWhileActive = aCanRemoveItemsWhileActive;
		}
		else {
			this._commandQueue.createQueuedCommand("setAddItemsWhileActive", aCanAddItemsWhileActive);
			this._commandQueue.createQueuedCommand("setRemoveItemsWhileActive", aCanRemoveItemsWhileActive);
		}
		
		return this;
	};
	
	objectFunctions.setAddItemsWhileActive = function(aCanAddItemsWhileActive) {
		if(!this._isActive) {
			this._canAddItemsWhileActive = aCanAddItemsWhileActive;
		}
		else {
			this._commandQueue.createQueuedCommand("setAddItemsWhileActive", aCanAddItemsWhileActive);
		}
		
		return this;
	};
	
	objectFunctions.setRemoveItemsWhileActive = function(aCanRemoveItemsWhileActive) {
		if(!this._isActive) {
			this._canRemoveItemsWhileActive = aCanRemoveItemsWhileActive;
		}
		else {
			this._commandQueue.createQueuedCommand("setRemoveItemsWhileActive", aCanRemoveItemsWhileActive);
		}
		
		return this;
	};
	
	objectFunctions._checkIfTheArrayIsAtEnd = function() {
		if(this._currentPosition >= this.array.length) {
			this.stop();
		}
	};
	
	objectFunctions.start = function() {
		this._isActive = true;
		this._checkIfTheArrayIsAtEnd();
	};
	
	objectFunctions.isActive = function() {
		return this._isActive;
	};
	
	objectFunctions.stop = function() {
		this._isActive = false;
		this.resetPosition();
		this._commandQueue.runQueuedCommands();
		this._commandQueue.reset();
	};
	
	/**
	 * Pushes an object to the list.
	 */
	objectFunctions.push = function(aObject) {
		if(!this._verifyItem(aObject)) return;
		if(!this._commandQueue.isRunning) {
			this._itemPreAdded(aObject);
		}
		if(!this._isActive || this._canAddItemsWhileActive) {
			this.superCall(aObject);
		}
		else {
			this._commandQueue.createQueuedCommand("push", aObject);
		}
	}
	
	/**
	 * Pops an item from the list.
	 */
	objectFunctions.pop = function() {
		if(!this._isActive || this._canRemoveItemsWhileActive) {
			this.superCall();
		}
		else {
			this._commandQueue.createQueuedCommand("pop", null);
		}
	}
	
	/**
	 * Inserts an item in the beginning of the list.
	 */
	objectFunctions.unshift = function(aObject) {
		if(!this._verifyItem(aObject)) return;
		if(!this._commandQueue.isRunning) {
			this._itemPreAdded(aObject);
		}
		if(!this._isActive || this._canAddItemsWhileActive) {
			this.superCall(aObject);
		}
		else {
			this._commandQueue.createQueuedCommand("unshift", aObject);
		}
	}
	
	/**
	 * Shifts an object from the list.
	 */
	objectFunctions.shift = function() {
		if(!this._isActive || this._canRemoveItemsWhileActive) {
			this.superCall();
		}
		else {
			this._commandQueue.createQueuedCommand("shift", null);
		}
	}
	
	/**
	 * Removes an item from the list.
	 */
	objectFunctions.removeItem = function(aObject) {
		if(!this._isActive || this._canRemoveItemsWhileActive) {
			this.superCall(aObject);
		}
		else {
			this._commandQueue.createQueuedCommand("removeItem", aObject);
		}
	}
	
	/**
	 * Removes an object at a specified index.
	 */
	objectFunctions.removeItemAt = function(aIndex) {
		if(!this._isActive || this._canRemoveItemsWhileActive) {
			this.superCall(aIndex);
		}
		else {
			this._commandQueue.createQueuedCommand("removeItemAt", aIndex);
		}
	}
	
	/**
	 * Adds an item at the specifed index, moving every item after it.
	 */
	objectFunctions.addItemAt = function(aObject, aIndex) {
		if(!this._verifyItem(aObject)) return;
		if(!this._commandQueue.isRunning) {
			this._itemPreAdded(aObject);
		}
		if(!this._isActive || this._canAddItemsWhileActive) {
			this.superCall(aObject, aIndex);
		}
		else {
			this._commandQueue.createQueuedCommand("addItemAt", {"object": aObject, "index": aIndex});
		}
	}
	
	objectFunctions.performDestroy = function() {
		
		
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		
		
		this.superCall();
	};
});