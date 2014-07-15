/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * An array that can securly be iterated over.
 */
dbm.registerClass("com.developedbyme.utils.data.iterator.ArrayIterator", "com.developedbyme.utils.data.ArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.iterator.ArrayIterator");
	
	//Self reference
	var ArrayIterator = dbm.importClass("com.developedbyme.utils.data.iterator.ArrayIterator");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var IterationData = dbm.importClass("com.developedbyme.utils.data.iterator.IterationData");
	
	//Utils
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator::_init");
		
		this.superCall();
		
		this._currentItem = null;
		this._currentPosition = 0;
		
		this._iteratorDatas = ClassReference._createArray();
		
		return this;
	};
	
	/**
	 * Sets the array
	 *
	 * @return	self
	 */
	objectFunctions._internalFunctionality_setArray = function(aArray, aOwnsObjects) {
		
		this.array = aArray;
		this.ownsObjects = (aOwnsObjects !== false);
		this._currentPosition = 0;
		this._checkIfTheArrayIsAtEnd();
		
		return this;
	}; //End function setArray
	
	
	objectFunctions._verifyItem = function(aObject) {
		return true;
	};
	
	objectFunctions._itemAdded = function(aObject) {
		//MENOTE: should be overridden
	};
	
	objectFunctions._itemRemoved = function(aObject) {
		if(aObject === this._currentItem) {
			this._currentItem = null;
		}
	};
	
	/**
	 * Creates a new iteration data for this array.
	 *
	 * @return	IterationData	The newly created object.
	 */
	objectFunctions.createIterationData = function() {
		//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator::createIterationData");
		
		var newIterationData = IterationData.create(this.array);
		this.addIterationData(newIterationData);
		return newIterationData;
	}; //End function createIterationData
	
	/**
	 * Adds an iteration data.
	 *
	 * @param	aIterationData	IterationData	The iteration data to add to this iterator.
	 *
	 * @return	self
	 */
	objectFunctions.addIterationData = function(aIterationData) {
		this._iteratorDatas.push(aIterationData);
		
		return this;
	}; //End function addIterationData
	
	/**
	 * Reomves an iteration data.
	 *
	 * @param	aAddIterationData	IterationData	The iteration data to remove to this iterator.
	 *
	 * @return	self
	 */
	objectFunctions.removeIterationData = function(aIterationData) {
		var index = ArrayFunctions.indexOfInArray(this._iteratorDatas, aIterationData);
		if(index !== -1) {
			this._iteratorDatas.splice(index, 1);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeIterationData", "Iteration data is not used by " + this + ".");
		}
		
		return this;
	}; //End function removeIterationData
	
	/**
	 * Stop using iteration data.
	 *
	 * @param	aIterationData	The iteration data that is no longer being used.
	 *
	 * @return	self
	 */
	objectFunctions.stopUsingIterationData = function(aIterationData) {
		//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator::stopUsingIterationData");
		
		//METODO: would this be better as a retained object
		this.removeIterationData(aIterationData);
		aIterationData.destroy();
		
		return this;
	}; //End function stopUsingIterationData
	
	/**
	 * Updates all the iteration datas after update.
	 *
	 * @param	aFromPosition	int	The position where the array was altered at.
	 * @param	aAdjustment		int	The amount that the array has been adjusted.
	 * @param	aNewLength		int	The new total length of the array.
	 */
	objectFunctions._updateAllIterationDatas = function(aFromPosition, aAdjustment, aNewLength) {
		var currentArray = this._iteratorDatas;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIterationData = currentArray[i];
			if(currentIterationData.position >= aFromPosition) {
				currentIterationData.position += aAdjustment;
				//METODO: fix negative numbers
			}
			currentIterationData.length = aNewLength;
		};
	}; //End function _updateAllIterationDatas
	
	/**
	 * Pushes an object to the list.
	 */
	objectFunctions.push = function(aObject) {
		if(!this._verifyItem(aObject)) return;
		var newLength = this.array.push(aObject);
		this._itemAdded(aObject);
		
		this._updateAllIterationDatas(newLength, 1, newLength);
	};
	
	/**
	 * Pops an item from the list.
	 */
	objectFunctions.pop = function() {
		this._itemRemoved(this.array.pop());
		
		this._updateAllIterationDatas(newLength+1, -1, this.array.length);
	};
	
	/**
	 * Inserts an item in the beginning of the list.
	 */
	objectFunctions.unshift = function(aObject) {
		if(!this.verifyItem(aObject)) return;
		var newLength = this.array.unshift(aObject);
		this._itemAdded(aObject);
		
		this._updateAllIterationDatas(0, 1, newLength);
	};
	
	/**
	 * Shifts an object from the list.
	 */
	objectFunctions.shift = function() {
		this.itemRemoved(this.array.shift());
		
		this._updateAllIterationDatas(0, -1, this.array.length);
	};
	
	/**
	 * Removes an item from the list.
	 */
	objectFunctions.removeItem = function(aObject) {
		//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator::removeItem");
		
		var currentArray = this.array;
		var index = ArrayFunctions.indexOfInArray(currentArray, aObject);
		
		if(index !== -1) {
			this._itemRemoved(currentArray[index]);
			currentArray.splice(index, 1);
			
			this._updateAllIterationDatas(index, -1, this.array.length);
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeItem", "Item " + aObject + " doesn't exist in " + this + ".");
		}
	};
	
	/**
	 * Removes an object at a specified index.
	 */
	objectFunctions.removeItemAt = function(aIndex) {
		if(aIndex < this.array.length) {
			this._itemRemoved(this.array[aIndex]);
			this.array.splice(aIndex, 1);
			
			this._updateAllIterationDatas(aIndex, -1, this.array.length);
			return;
		}
		else {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "removeItemAt", "Index " + aIndex + " is larger than array " + this + ".");
		}
	};
	
	/**
	 * Adds an item at the specifed index, moving every item after it.
	 */
	objectFunctions.addItemAt = function(aObject, aIndex) {
		if(!this.verifyItem(aObject)) return;
		if(aIndex >= this.array.length) {
			var newLength = this.array.push(aObject);
			this._updateAllIterationDatas(newLength, 1, newLength);
		}
		else {
			this.array.splice(aIndex, 0, aObject);
			
			this._updateAllIterationDatas(aIndex, 1, this.array.length);
		}
		this._itemAdded(aObject);
	};
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		ClassReference._reuseArray(this._iteratorDatas);
		this._iteratorDatas = null;
		this._currentItem = null;
		
		this.superCall();
	};
	
	/**
	 * Checks if a variable is owned by this object. Part of the destroy function.
	 *
	 * @param	aName	The name of the variable.
	 *
	 * @return	Boolean	True if this object is the owner of a variable.
	 */
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_currentItem":
				return false;
		}
		return this.superCall(aName);
	};
});