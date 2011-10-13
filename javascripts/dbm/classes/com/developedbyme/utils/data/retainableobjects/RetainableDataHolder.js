/**
 * Data holder that can be retained.
 * 
 * @author	mattiase
 * @version	0.0.01
 */
dbm.registerClass("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder");
	
	/**
	 * Constructor
	 */
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.data.retainableobjects.RetainableDataHolder::init");
		
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
	};
	
	/**
	 * Releases the object
	 */
	objectFunctions.release = function() {
		if(this._numberOfRetains != 0) {
			this._numberOfRetains--;
		}
	};
	
	/**
	 * Releases the object and if no reatins are left the object is destroyed.
	 */
	objectFunctions.releaseAndDestroy = function() {
		this.release();
		if(this._numberOfRetains == 0) {
			this.destroy();
		}
	};
	
	/**
	 * Forces the relase of all retains.
	 */
	objectFunctions.forceReleaseAllRetains = function() {
		this._numberOfRetains = 0;
	};
	
	/**
	 * Destroys all the data of the object.
	 */
	objectFunctions.performDestroy = function() {
		if(this.ownsData && this.data != null && this.data.destroy) {
			this.data.destroy();
		}
		this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.data = null;
		
		this.superCall();
	};
});