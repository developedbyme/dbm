/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Meta data types for display properties.
 */
dbm.registerClass("com.developedbyme.constants.metadata.DisplayMetaDataTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.metadata.DisplayMetaDataTypes");
	
	//Self reference
	var DisplayMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.DisplayMetaDataTypes");
	
	staticFunctions.WIDTH = "width";
	staticFunctions.HEIGHT = "height";
	staticFunctions.BACKGROUND_COLOR = "backgroundColor";
	
});