/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Creates an asset and sets the path after transforming it.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.assetcreators.TransformedPathAssetCreator", "com.developedbyme.core.globalobjects.assetrepository.assetcreators.PathAssetCreator", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.assetcreators.TransformedPathAssetCreator");
	//"use strict";
	
	//Self reference
	var TransformedPathAssetCreator = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assetcreators.TransformedPathAssetCreator");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.assetcreators.TransformedPathAssetCreator::_init");
		
		this.superCall();
		
		this._pathReevaluator = null;
		
		return this;
	};
	
	/**
	 * Set the reevaluator for the path.
	 *
	 * @param	aPathReevaluator	The path reevaluator.
	 *
	 * @return	self
	 */
	objectFunctions.setPathReevaluator = function(aPathReevaluator) {
		this._pathReevaluator = aPathReevaluator;
		this.addDestroyableObject(this._pathReevaluator);
		
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
		return this.superCall(this._pathReevaluator.reevaluate(aPath), aType);
	};
	
	/**
	 * Sets all the references to null.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._pathReevaluator = null;
		
		this.superCall();
	};
	
	/**
	 * Creates a new transformed path asset creator.
	 *
	 * @param	aClass				The class that this creator is generating.
	 * @param	aPathReevaluator	The reevaluator for the path.
	 *
	 * @return	TransformedPathAssetCreator	The newly created transformed path asset creator.
	 */
	staticFunctions.create = function(aClass, aPathReevaluator) {
		var newTransformedPathAssetCreator = ClassReference._createAndInitClass(ClassReference);
		newTransformedPathAssetCreator.setClass(aClass);
		newTransformedPathAssetCreator.setPathReevaluator(aPathReevaluator);
		return newTransformedPathAssetCreator;
	};
});