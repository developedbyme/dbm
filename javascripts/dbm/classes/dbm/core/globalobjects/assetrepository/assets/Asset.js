/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base class for every asset
 */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assets.Asset", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assets.Asset");
	//"use strict";
	
	//Self reference
	var Asset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.Asset");
	
	//Error report
	
	//Dependencies
	var EventDataObject = dbm.importClass("dbm.core.extendedevent.EventDataObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var AssetStatusTypes = dbm.importClass("dbm.constants.status.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assets.Asset::_init");
		
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
		//console.log("dbm.core.globalobjects.assetrepository.assets.Asset::_setStatus");
		//console.log(aStatus);
		if(aStatus === AssetStatusTypes.LOADED || aStatus === AssetStatusTypes.LOADING_ERROR) {
			this._loadProgress = 1;
		}
		this._status.setValue(aStatus);
	};
	
	objectFunctions.setHierarchyItem = function(aItem) {
		this._hierarchyItem = aItem;
	};
	
	objectFunctions.runCommandWhenLoaded = function(aCommand) {
		//console.log("dbm.core.globalobjects.assetrepository.assets.Asset::runCommandWhenLoaded");
		
		if(this.getStatus() === AssetStatusTypes.LOADED) {
			aCommand.retain();
			var eventDataObject = EventDataObject.create(null, this, this);
			aCommand.perform(eventDataObject);
			aCommand.releaseAndDestroy();
		}
		else {
			this.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, aCommand);
		}
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
	 * Checks if an extended event is expected for this object.
	 *
	 * @param	aName	String	The name of the event.
	 *
	 * @return	Boolean	True if the event is expected.
	 */
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case LoadingExtendedEventIds.LOADED:
			case LoadingExtendedEventIds.LOADING_ERROR:
				return true;
		}
		
		return this.superCall(aName);
	}; //End function _extendedEvent_eventIsExpected
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 *
	 * @param	aReturnArray	Array	The array that gets filled with the parameters description.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._status !== null) {
			aReturnArray.push("status: " + this._status.getValue());
		}
	}; //End function _toString_getAttributes
	
	/**
	 * Sets all the references to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._status = null;
		this._data = null;
		
		this.superCall();
	}; //End function setAllReferencesToNull
	
	/**
	 * Creates a new objetc of this class.
	 *
	 * @return	The newly created object.
	 */
	staticFunctions.create = function() {
		var newAsset = ClassReference._createAndInitClass(ClassReference);
		return newAsset;
	}; //End function create
});