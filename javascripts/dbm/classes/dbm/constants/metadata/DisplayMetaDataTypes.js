/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Meta data types for display properties.
 */
dbm.registerClass("dbm.constants.metadata.DisplayMetaDataTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.metadata.DisplayMetaDataTypes");
	
	//Self reference
	var DisplayMetaDataTypes = dbm.importClass("dbm.constants.metadata.DisplayMetaDataTypes");
	
	staticFunctions.WIDTH = "width";
	staticFunctions.HEIGHT = "height";
	staticFunctions.BACKGROUND_COLOR = "backgroundColor";
	
});