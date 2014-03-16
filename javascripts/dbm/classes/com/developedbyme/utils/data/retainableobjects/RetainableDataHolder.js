/**
 * Data holder that can be retained.
 * 
 * @author	mattiase
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder::_init");
		
		this.superCall();
		
		this._numberOfRetains = 0;
		this.data = null;
		this.ownsData = false;
		
		return this;
	}; //End function RetainableDataHolder
	
	/**
	 * Gets the retain count.
	 */
	objectFunctions.getNumberOfRetains = function() {
		return this._numberOfRetains;
	};
	
	/**
	 * Retains the object.
	 */
	objectFunctions.retain = function() {
		this._numberOfRetains++;
		
		return this;
	};
	
	/**
	 * Releases the object
	 */
	objectFunctions.release = function() {
		if(this._numberOfRetains !== 0) {
			this._numberOfRetains--;
		}
		
		return this;
	};
	
	/**
	 * Releases the object and if no reatins are left the object is destroyed.
	 */
	objectFunctions.releaseAndDestroy = function() {
		this.release();
		if(this._numberOfRetains === 0) {
			this.destroy();
		}
		
		return this;
	};
	
	/**
	 * Forces the relase of all retains.
	 */
	objectFunctions.forceReleaseAllRetains = function() {
		this._numberOfRetains = 0;
		
		return this;
	};
	
	/**
	 * Destroys all the data of the object.
	 */
	objectFunctions.performDestroy = function() {
		//console.log("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder::performDestroy");
		//console.log(this.ownsData, this.data !== null, this.data.destroy);
		if(this.ownsData && this.data !== null && this.data.destroy) {
			this.data.destroy();
		}
		this.superCall();
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "data":
				return this.ownsData;
		}
		return this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.data = null;
		
		this.superCall();
	};
});