/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Functions for setting meta data when exporting after effects objects.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions");
	//"use strict";
	
	//Self reference
	var MetaDataFunctions = dbm.importClass("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	var GeneralMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.GeneralMetaDataTypes");
	var DisplayMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.DisplayMetaDataTypes");
	var PlaybackMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.PlaybackMetaDataTypes");
	
	
	staticFunctions.setCompositionMetaData = function(aComposition, aReturnNamedArray) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions::setCompositionMetaData");
		//console.log(aComposition, aReturnNamedArray);
		
		aReturnNamedArray.addObject(GeneralMetaDataTypes.NAME, aComposition.getProperty("name").getValue());
		aReturnNamedArray.addObject(DisplayMetaDataTypes.WIDTH, aComposition.getProperty("width").getValue());
		aReturnNamedArray.addObject(DisplayMetaDataTypes.HEIGHT, aComposition.getProperty("height").getValue());
		aReturnNamedArray.addObject(PlaybackMetaDataTypes.DURATION, aComposition.getProperty("duration").getValue());
		aReturnNamedArray.addObject(PlaybackMetaDataTypes.FRAME_RATE, aComposition.getProperty("frameRate").getValue());
		aReturnNamedArray.addObject(DisplayMetaDataTypes.BACKGROUND_COLOR, aComposition.getBackgroundColor());
	};
	
	staticFunctions.setLayerMetaData = function(aLayer, aReturnNamedArray) {
		//console.log("com.developedbyme.adobeextendscript.aftereffects.utils.export.MetaDataFunctions::setLayerMetaData");
		//console.log(aLayer, aReturnNamedArray);
		
		aReturnNamedArray.addObject(GeneralMetaDataTypes.NAME, aLayer.getProperty("name").getValue());
		aReturnNamedArray.addObject(PlaybackMetaDataTypes.START_TIME, aLayer.getProperty("inPoint").getValue());
		aReturnNamedArray.addObject(PlaybackMetaDataTypes.END_TIME, aLayer.getProperty("outPoint").getValue());
	};
});