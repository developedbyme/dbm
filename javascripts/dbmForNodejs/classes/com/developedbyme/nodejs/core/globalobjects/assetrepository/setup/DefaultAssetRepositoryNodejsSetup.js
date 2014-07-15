/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Sets up the asset creator for use in nodejs.
 */
dbm.registerClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryNodejsSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryNodejsSetup");
	//"use strict";
	
	//Self reference
	var DefaultAssetRepositoryNodejsSetup = dbm.importClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.setup.DefaultAssetRepositoryNodejsSetup");
	
	//Error report
	
	//Dependencies
	var PathAssetCreator = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assetcreators.PathAssetCreator");
	var BinaryFileAsset = dbm.importClass("com.developedbyme.nodejs.core.globalobjects.assetrepository.assets.BinaryFileAsset");
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the asset repository for browser use.
	 */
	staticFunctions.setup = function() {
		dbm.singletons.dbmAssetRepository.addAssetCreatorForTypes(PathAssetCreator.create(BinaryFileAsset), ["jpg", "jpeg", "gif", "png","webp", "html", "xml", "xsl", "text", "txt", "vert", "frag", "csv", "json"]);
		//METODO: media files
	}; //End function setup
});