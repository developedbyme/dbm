dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assets.Asset", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.Asset");
	//"use strict";
	
	var Asset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.Asset");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.Asset::_init");
		
		this.superCall();
		
		this._hierarchyItem = null;
		this._status = this.createProperty("status", AssetStatusTypes.NOT_LOADED);
		this._data = this.createProperty("data", null);
		this._numberOfRetains = 0;
		
		this._loadingSize = 20000;
		this._loadProgress = 0;
		
		return this;
	};
	
	objectFunctions.getData = function() {
		return this._data.getValue();
	};
	
	objectFunctions.getStatus = function() {
		return this._status.getValue();
	};
	
	objectFunctions.getProgress = function() {
		return this._loadProgress;
	};
	
	objectFunctions.getLoadedSize = function() {
		return this._loadProgress*this._loadingSize;
	};
	
	objectFunctions.getTotalSize = function() {
		return this._loadingSize;
	};
	
	objectFunctions._setStatus = function(aStatus) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assets.Asset::_setStatus");
		//console.log(aStatus);
		if(aStatus === AssetStatusTypes.LOADED || aStatus === AssetStatusTypes.LOADING_ERROR) {
			this._loadProgress = 1;
		}
		this._status.setValue(aStatus);
	};
	
	objectFunctions.setHierarchyItem = function(aItem) {
		this._hierarchyItem = aItem;
	};
	
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
		if(this._numberOfRetains !== 0) {
			this._numberOfRetains--;
		}
	};
	
	/**
	 * Releases the object and if no reatins are left the object is destroyed.
	 */
	objectFunctions.releaseAndDestroy = function() {
		this.release();
		if(this._numberOfRetains === 0) {
			this.destroy();
		}
	};
	
	/**
	 * Forces the relase of all retains.
	 */
	objectFunctions.forceReleaseAllRetains = function() {
		this._numberOfRetains = 0;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LoadingExtendedEventIds.LOADED:
			case LoadingExtendedEventIds.LOADING_ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._status !== null) {
			aReturnArray.push("status: " + this._status.getValue());
		}
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._status = null;
		this._data = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newAsset = (new ClassReference()).init();
		return newAsset;
	};
});