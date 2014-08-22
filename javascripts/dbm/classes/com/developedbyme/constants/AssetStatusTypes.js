/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Status codes for assets.
 */
dbm.registerClass("com.developedbyme.constants.AssetStatusTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.AssetStatusTypes");
	
	//Self reference
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	staticFunctions.NOT_LOADED = 0;
	staticFunctions.LOADED = 1;
	staticFunctions.LOADING = 2;
	staticFunctions.ERROR = -1;
	
});