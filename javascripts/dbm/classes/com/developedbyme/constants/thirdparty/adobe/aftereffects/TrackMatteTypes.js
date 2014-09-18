/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Types of track mattes that is used by after effects.
 */
dbm.registerClass("com.developedbyme.constants.thirdparty.adobe.aftereffects.TrackMatteTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.thirdparty.adobe.aftereffects.TrackMatteTypes");
	
	//Self reference
	var TrackMatteTypes = dbm.importClass("com.developedbyme.constants.thirdparty.adobe.aftereffects.TrackMatteTypes");
	
	staticFunctions.ALPHA = "alpha";
	staticFunctions.ALPHA_INVERTED = "alphaInverted";
	staticFunctions.LUMA = "luma";
	staticFunctions.LUMA_INVERTED = "lumaInverted";
	staticFunctions.NONE = "none";
	
});