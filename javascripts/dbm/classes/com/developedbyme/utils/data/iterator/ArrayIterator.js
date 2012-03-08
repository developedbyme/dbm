dbm.registerClass("com.developedbyme.utils.data.iterator.ArrayIterator", "com.developedbyme.utils.data.ArrayHolder", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.iterator.ArrayIterator");
	
	var CommandQueue = dbm.importClass("com.developedbyme.utils.data.CommandQueue");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.iterator.ActiveArrayIterator::_init");
		
		this.superCall();
		
		this._currentItem = null;
		this._currentPosition = 0;
		
		return this;
	};
	
	/**
	 * Sets the array
	 *
	 * @return	self
	 */
	objectFunctions._internalFunctionality_setArray = function(aArray, aOwnsObjects) {
		
		this.array = aArray;
		this.ownsObjects = (aOwnsObjects != false);
		this._currentPosition = 0;
		this._checkIfTheArrayIsAtEnd();
		
		return this;
	} //End function setArray
	
	
	objectFunctions._verifyItem = function(aObject) {
		return true;
	};
	
	objectFunctions._itemAdded = function(aObject) {
		//MENOTE: should be overridden
	};
	
	objectFunctions._itemRemoved = function(aObject) {
		if(aObject == this._currentItem) {
			this._currentItem = null;
		}
	};
	
	objectFunctions._checkIfTheArrayIsAtEnd = function() {
		
	};
	
	/**
	 * Gets the current item.
	 */
	objectFunctions.getCurrentItem = function() {
		return this._currentItem;
	}
	
	/**
	 * Gets the next item.
	 */
	objectFunctions.getNextItem = function() {
		if(this._currentPosition < this.array.length) {
			this._currentItem = this.array[this._currentPosition];
			this._currentPosition++;
			this._checkIfTheArrayIsAtEnd();
			return this._currentItem;
		}
		//METODO: error report
		return null;
	}
		
	/**
	 * Gets a specific item.
	 * 
	 * @param	aIndex					The absolute index to get the item at.
	 * @param	aMoveCurrentPosition	If the current position should be moved to the current position.
	 */
	objectFunctions.getItem = function(aIndex, aMoveCurrentPosition) {
		if(aIndex < this.array.length) {
			var returnItem = this.array[aIndex];
			if(aMoveCurrentPosition != false) {
				this._currentItem = returnItem;
				this._currentPosition = aIndex+1;
				this._checkIfTheArrayIsAtEnd();
			}
			return returnItem;
		}
		//METODO: error report
		return null;
	}
	
	/**
	 * Checks if the position can change to a specific index.
	 * 
	 * @param	aIndex	The absolute index to check if the item can change to.
	 */
	objectFunctions.canChangePosition = function(aIndex) {
		return (aIndex < this.array.length);
	}
	
	/**
	 * Resets the position.
	 */
	objectFunctions.resetPosition = function() {
		this._currentPosition = 0;
	}

	/**
	 * Checks if there is a next item.
	 */
	objectFunctions.hasNextItem = function() {
		return (this._currentPosition < this.array.length);
	}
	
	/**
	 * Checks if there the position is specified.
	 */
	objectFunctions.hasPosition = function() {
		return true;
	}
	
	/**
	 * Gets the current position in the list.
	 * 
	 * @return	The index of the current position, -1 if the position isn't specified.
	 */
	objectFunctions.getPosition = function() {
		return this._currentPosition-1;
	}
	
	/**
	 * Checks if the total length can be specified.
	 */
	objectFunctions.hasLength = function() {
		return true;
	}
	
	/**
	 * Gets the length of the list.
	 * 
	 * @return	The length of the list, -1 if the length isn't specified.
	 */
	objectFunctions.getLength = function() {
		return this.array.length;
	}
	
	/**
	 * Pushes an object to the list.
	 */
	objectFunctions.push = function(aObject) {
		if(!this._verifyItem(aObject)) return;
		this.array.push(aObject);
		this._itemAdded(aObject);
	}
	
	/**
	 * Pops an item from the list.
	 */
	objectFunctions.pop = function() {
		if(this._currentPosition == this.array.length) {
			this._currentPosition--;
		}
		this._itemRemoved(this.array.pop());
		this._checkIfTheArrayIsAtEnd();
	}
	
	/**
	 * Inserts an item in the beginning of the list.
	 */
	objectFunctions.unshift = function(aObject) {
		if(!this.verifyItem(aObject)) return;
		this.array.unshift(aObject);
		if(this._currentPosition > 0) {
			this._currentPosition++;
		}
		this._itemAdded(aObject);
	}
	
	/**
	 * Shifts an object from the list.
	 */
	objectFunctions.shift = function() {
		this.itemRemoved(this.array.shift());
		if(this._currentPosition > 0) {
			this._currentPosition--;
			this._checkIfTheArrayIsAtEnd();
		}
	}
	
	/**
	 * Removes an item from the list.
	 */
	objectFunctions.removeItem = function(aObject) {
		var currentArray = this.array;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			if(aObject === currentArray[i]) {
				this._itemRemoved(currentArray[i]);
				currentArray.splice(i, 1);
				if(i < this._currentPosition) {
					this._currentPosition--;
				}
				this._checkIfTheArrayIsAtEnd();
				return;
			}
		}
		//METODO: error message
	}
	
	/**
	 * Removes an object at a specified index.
	 */
	objectFunctions.removeItemAt = function(aIndex) {
		if(aIndex < this.array.length) {
			this._itemRemoved(this.array[aIndex]);
			this.array.splice(aIndex, 1);
			if(aIndex < this._currentPosition) {
				this._currentPosition--;
			}
			this._checkIfTheArrayIsAtEnd();
			return;
		}
		//METODO: error message
	}
	
	/**
	 * Adds an item at the specifed index, moving every item after it.
	 */
	objectFunctions.addItemAt = function(aObject, aIndex) {
		if(!this.verifyItem(aObject)) return;
		if(aIndex >= this.array.length) {
			this.array.push(aObject);	
		}
		else {
			if(aIndex <= this._currentPosition) {
				this._currentPosition++;
			}
			this.array.splice(aIndex, 0, aObject);
		}
		this._itemAdded(aObject);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._currentItem = null;
		
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_currentItem":
				return false;
		}
		return this.superCall(aName);
	};
});