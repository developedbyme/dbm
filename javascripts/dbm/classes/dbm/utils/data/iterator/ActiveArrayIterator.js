/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An array that can securly be iterated over, and additions or subtractions to the array can be delayed until the iteration is over.
 */
dbm.registerClass("dbm.utils.data.iterator.ActiveArrayIterator", "dbm.utils.data.iterator.ArrayIterator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.iterator.ActiveArrayIterator");
	//"use strict";
	
	//Self reference
	var ActiveArrayIterator = dbm.importClass("dbm.utils.data.iterator.ActiveArrayIterator");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var CommandQueue = dbm.importClass("dbm.utils.data.CommandQueue");
	var MultipleLock = dbm.importClass("dbm.utils.logic.MultipleLock");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var LockExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LockExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.iterator.ActiveArrayIterator::_init");
		
		this.superCall();
		
		this._canAddItemsWhileActive = true;
		this._canRemoveItemsWhileActive = true;
		
		this._lock = this.addDestroyableObject(MultipleLock.create());
		
		this._commandQueue = null;
		
		return this;
	}; //End function _init
	
	objectFunctions.getCommandQueue = function() {
		if(this._commandQueue === null) {
			this._createCommandQueue();
		}
		return this._commandQueue;
	};
	
	objectFunctions._createCommandQueue = function() {
		this._commandQueue = (new CommandQueue()).init();
		this.addDestroyableObject(this._commandQueue);
		
		this._createCommandsForCommandQueue();
		
		this._lock.getExtendedEvent().addCommandToEvent(LockExtendedEventIds.UNLOCKED, CallFunctionCommand.createCommand(this._commandQueue, this._commandQueue.runQueuedCommands, []));
		this._lock.getExtendedEvent().addCommandToEvent(LockExtendedEventIds.UNLOCKED, CallFunctionCommand.createCommand(this._commandQueue, this._commandQueue.reset, []));
		
		return this._commandQueue;
	};
	
	objectFunctions._createCommandsForCommandQueue = function() {
		this._commandQueue.createFunctionTypeCommand("push", this, this.push, true);
		this._commandQueue.createFunctionTypeCommand("pop", this, this.pop, false);
		this._commandQueue.createFunctionTypeCommand("unshift", this, this.unshift, true);
		this._commandQueue.createFunctionTypeCommand("shift", this, this.shift, false);
		this._commandQueue.createFunctionTypeCommand("removeItem", this, this.removeItem, true);
		this._commandQueue.createFunctionTypeCommand("removeItemAt", this, this.removeItemAt, true);
		this._commandQueue.createFunctionTypeCommandWithArguments("addItemAt", this, this.addItemAt, [GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "object"), GetVariableObject.createCommand(GetVariableObject.createSelectDataCommand(), "index")]);
		
		this._commandQueue.createFunctionTypeCommand("setAddItemsWhileActive", this, this.setAddItemsWhileActive, true);
		this._commandQueue.createFunctionTypeCommand("setRemoveItemsWhileActive", this, this.setRemoveItemsWhileActive, true);
	};
	
	objectFunctions._commandQueueIsRunning = function() {
		return (this._commandQueue !== null && this._commandQueue.isRunning());
	};
	
	/**
	 * Creates a new iteration data for this array.
	 *
	 * @return	IterationData	The newly created object.
	 */
	objectFunctions.createIterationData = function() {
		//console.log("dbm.utils.data.iterator.ActiveArrayIterator::createIterationData");
		
		var newIterationData = this.superCall();
		this._lock.lock(newIterationData);
		return newIterationData;
	}; //End function createIterationData
	
	/**
	 * Stop using iteration data.
	 *
	 * @param	aIterationData	The iteration data that is no longer being used.
	 *
	 * @return	self
	 */
	objectFunctions.stopUsingIterationData = function(aIterationData) {
		//console.log("dbm.utils.data.iterator.ActiveArrayIterator::stopUsingIterationData");
		
		this._lock.unlock(aIterationData);
		this.superCall(aIterationData);
		
		return this;
	}; //End function stopUsingIterationData
	
	objectFunctions._itemPreAdded = function(aObject) {
		//MENOTE: should be overridden
	};
	
	objectFunctions.setAddRemoveWhileActive = function(aCanAddItemsWhileActive, aCanRemoveItemsWhileActive) {
		if(!this._lock.isLocked()) {
			this._canAddItemsWhileActive = aCanAddItemsWhileActive;
			this._canRemoveItemsWhileActive = aCanRemoveItemsWhileActive;
		}
		else {
			this.getCommandQueue().createQueuedCommand("setAddItemsWhileActive", aCanAddItemsWhileActive);
			this.getCommandQueue().createQueuedCommand("setRemoveItemsWhileActive", aCanRemoveItemsWhileActive);
		}
		
		return this;
	};
	
	objectFunctions.setAddItemsWhileActive = function(aCanAddItemsWhileActive) {
		if(!this._lock.isLocked()) {
			this._canAddItemsWhileActive = aCanAddItemsWhileActive;
		}
		else {
			this.getCommandQueue().createQueuedCommand("setAddItemsWhileActive", aCanAddItemsWhileActive);
		}
		
		return this;
	};
	
	objectFunctions.setRemoveItemsWhileActive = function(aCanRemoveItemsWhileActive) {
		if(!this._lock.isLocked()) {
			this._canRemoveItemsWhileActive = aCanRemoveItemsWhileActive;
		}
		else {
			this.getCommandQueue().createQueuedCommand("setRemoveItemsWhileActive", aCanRemoveItemsWhileActive);
		}
		
		return this;
	};
	
	/**
	 * Pushes an object to the list.
	 */
	objectFunctions.push = function(aObject) {
		//console.log("dbm.utils.data.iterator.ActiveArrayIterator::push");
		if(!this._verifyItem(aObject)) return;
		if(!this._commandQueueIsRunning()) {
			this._itemPreAdded(aObject);
		}
		if(!this._lock.isLocked() || this._canAddItemsWhileActive) {
			this.superCall(aObject);
		}
		else {
			this.getCommandQueue().createQueuedCommand("push", aObject);
		}
	};
	
	/**
	 * Pops an item from the list.
	 */
	objectFunctions.pop = function() {
		if(!this._lock.isLocked() || this._canRemoveItemsWhileActive) {
			this.superCall();
		}
		else {
			this.getCommandQueue().createQueuedCommand("pop", null);
		}
	};
	
	/**
	 * Inserts an item in the beginning of the list.
	 */
	objectFunctions.unshift = function(aObject) {
		if(!this._verifyItem(aObject)) return;
		if(!this._commandQueueIsRunning()) {
			this._itemPreAdded(aObject);
		}
		if(!this._lock.isLocked() || this._canAddItemsWhileActive) {
			this.superCall(aObject);
		}
		else {
			this.getCommandQueue().createQueuedCommand("unshift", aObject);
		}
	};
	
	/**
	 * Shifts an object from the list.
	 */
	objectFunctions.shift = function() {
		if(!this._lock.isLocked() || this._canRemoveItemsWhileActive) {
			this.superCall();
		}
		else {
			this.getCommandQueue().createQueuedCommand("shift", null);
		}
	};
	
	/**
	 * Removes an item from the list.
	 */
	objectFunctions.removeItem = function(aObject) {
		//console.log("dbm.utils.data.iterator.ActiveArrayIterator::removeItem");
		//console.log(aObject);
		if(!this._lock.isLocked() || this._canRemoveItemsWhileActive) {
			this.superCall(aObject);
		}
		else {
			this.getCommandQueue().createQueuedCommand("removeItem", aObject);
		}
	};
	
	/**
	 * Removes an object at a specified index.
	 */
	objectFunctions.removeItemAt = function(aIndex) {
		if(!this._lock.isLocked() || this._canRemoveItemsWhileActive) {
			this.superCall(aIndex);
		}
		else {
			this.getCommandQueue().createQueuedCommand("removeItemAt", aIndex);
		}
	};
	
	/**
	 * Adds an item at the specifed index, moving every item after it.
	 */
	objectFunctions.addItemAt = function(aObject, aIndex) {
		if(!this._verifyItem(aObject)) return;
		if(!this._commandQueueIsRunning()) {
			this._itemPreAdded(aObject);
		}
		if(!this._lock.isLocked() || this._canAddItemsWhileActive) {
			this.superCall(aObject, aIndex);
		}
		else {
			this.getCommandQueue().createQueuedCommand("addItemAt", {"object": aObject, "index": aIndex});
		}
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._commandQueue = null;
		this._lock = null;
		
		this.superCall();
	}; //End function setAllReferencesToNull
});