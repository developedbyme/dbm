/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Creates an asset and sets the path.
 */
dbm.registerClass("dbm.core.globalobjects.assetrepository.assetcreators.PathAssetCreator", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.assetcreators.PathAssetCreator");
	//"use strict";
	
	//Self reference
	var PathAssetCreator = dbm.importClass("dbm.core.globalobjects.assetrepository.assetcreators.PathAssetCreator");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.assetcreators.PathAssetCreator::_init");
		
		this.superCall();
		
		this._class = null;
		
		return this;
	};
	
	/**
	 * Set the class that this creator is using to create new assets.
	 *
	 * @param	aClass	The class to create
	 *
	 * @return	self
	 */
	objectFunctions.setClass = function(aClass) {
		this._class = aClass;
		
		return this;
	};
	
	/**
	 * Creates a new asset.
	 *
	 * @param	aPath	The path to the asset.
	 * @param	aType	The type of asset to create (interface/ignored for class).
	 *
	 * @return	Asset	The newly created asset.
	 */
	objectFunctions.createAsset = function(aPath, aType) {
		return this._class.create(aPath);
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._status !== null) {
			aReturnArray.push("class: " + this._class);
		}
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._class = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new path asset creator.
	 *
	 * @param	aClass	The class that this creator is generating.
	 *
	 * @return	PathAssetCreator	The newly create path asset creator.
	 */
	staticFunctions.create = function(aClass) {
		var newPathAssetCreator = ClassReference._createAndInitClass(ClassReference);
		newPathAssetCreator.setClass(aClass);
		return newPathAssetCreator;
	};
});