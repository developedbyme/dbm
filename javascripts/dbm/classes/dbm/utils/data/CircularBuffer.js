/**
 * A circular buffer.
 * 
 * @author	mattiase
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.data.CircularBuffer", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.data.CircularBuffer");
	//"use strict";
	
	var CircularBuffer = dbm.importClass("dbm.utils.data.CircularBuffer");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.utils.data.CircularBuffer");
		
		this._currentPosition = 0;
		this._buffer = new Array();
		this._bufferLength = 0;
		
		return this;
	};
	
	/**
	 * Sets the length of the buffer
	 * 
	 * @param	aLength	the new length of the buffer
	 * @return	this
	 */
	objectFunctions.setLength = function(aLength) {
		
		var i;
		
		if(aLength > this._bufferLength) {
			var itemsToAdd = aLength-this._bufferLength;
			if(this._currentPosition < this._bufferLength-1) {
				for(i = -1; ++i < itemsToAdd;) {
					this._buffer.splice(this._currentPosition+1, 0, null);
				}
				
			}
			else {
				for(i = -1; ++i < itemsToAdd;) {
					this._buffer.push(null);
				}
			}
		}
		else if(aLength < this._bufferLength) {
			var itemsToRemove = this._bufferLength-aLength;
			var itemsAfterPosition =  this._bufferLength-this._currentPosition-1;
			var removeLength = Math.min(itemsToRemove, itemsAfterPosition);
			this._buffer.splice(this._currentPosition+1, removeLength);
			if(removeLength < itemsToRemove) {
				this._buffer.splice(0, itemsToRemove-removeLength);
			}
		}
		
		this._bufferLength = aLength;
		return this;
	};
	
	/**
	 * Sets data at the next position.
	 * 
	 * @param	aData	The data to set
	 * @return	this;
	 */
	objectFunctions.setNewData = function(aData) {
		this._currentPosition = ((this._currentPosition+1) % this._bufferLength);
		this._buffer[this._currentPosition] = aData;
		return this;
	};
	
	/**
	 * Steps manually in the buffer.
	 *
	 * @param	aSteps	The number of steps to take.
	 */
	objectFunctions.manuallyStep = function(aSteps) {
		if(aSteps === undefined) {
			aSteps = 1;
		}
		var newPosition = this._currentPosition+aSteps;
		if(newPosition > 0) {
			newPosition %= this._bufferLength;
		}
		else {
			while(newPosition < 0) {
				newPosition += this._bufferLength;
			}
		}
		this._currentPosition = newPosition;
		return this;
	};
	
	/**
	 * Gets the data at the current position
	 * 
	 * @return	The data at the curren position (null if offset is out of bounds)
	 */
	objectFunctions.getData = function(aOffset) {
		
		if(aOffset === undefined) {
			aOffset = 0;
		}
		if(aOffset > 0) {
			console.log("//Offset should be negative");
			return null;
		}
		else if(-1*aOffset >= this._bufferLength) {
			console.log("//Buffer isn't that long");
			return null;
		}
		
		var samplePosition = (this._currentPosition+aOffset+this._bufferLength)%this._bufferLength;
		
		return this._buffer[samplePosition];
	};
	
	staticFunctions.create = function(aLength) {
		var newCircularBuffer = (new CircularBuffer()).init();
		newCircularBuffer.setLength(aLength);
		return newCircularBuffer;
	};
});