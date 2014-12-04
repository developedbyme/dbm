/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.css.MediaFeatureTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.css.MediaFeatureTypes");
	
	var MediaFeatureTypes = dbm.importClass("dbm.constants.css.MediaFeatureTypes");
	
	MediaFeatureTypes.WIDTH = "width";
	MediaFeatureTypes.HEIGHT = "height";
	MediaFeatureTypes.DEVICE_WIDTH = "device-width";
	MediaFeatureTypes.DEVICE_HEIGHT = "device-height";
	MediaFeatureTypes.ORIENTATION = "orientation";
	MediaFeatureTypes.ASPECT_RATIO = "aspect-ratio";
	MediaFeatureTypes.DEVICE_ASPECT_RATIO = "device-aspect-ratio";
	MediaFeatureTypes.COLOR = "color";
	MediaFeatureTypes.COLOR_INDEX = "color-index";
	MediaFeatureTypes.MONOCHROME = "monochrome";
	MediaFeatureTypes.RESOLUTION = "resolution";
	MediaFeatureTypes.SCAN = "scan";
	MediaFeatureTypes.GRID = "grid";
	
});
