/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Converts colors to and from the native illustrator objects.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.illustrator.utils.color.NativeColorConverter", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.illustrator.utils.color.NativeColorConverter");
	//"use strict";
	
	//Self reference
	var NativeColorConverter = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.utils.color.NativeColorConverter");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var RgbaColor = dbm.importClass("com.developedbyme.core.data.color.RgbaColor");
	var CmykColor = dbm.importClass("com.developedbyme.core.data.color.CmykColor");
	
	//Utils
	
	//Constants
	
	
	staticFunctions.convertNativeObject = function(aNativeObject) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.utils.color.NativeColorConverter::convertNativeObject");
		//console.log(aNativeObject);
		switch(aNativeObject.typename) {
			case "RGBColor":
				return ClassReference.convertNativeRgbColor(aNativeObject);
			case "GrayColor":
				return ClassReference.convertNativeGrayColor(aNativeObject);
			case "SpotColor":
				return ClassReference.convertNativeSpotColor(aNativeObject);
			case "CMYKColor":
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, "[NativeColorConverter]", "convertNativeObject", "Color space is not implemented, so CMYK colors can't be represented correctly.");
				return ClassReference.convertNativeCmykColor(aNativeObject);
			case "NoColor":
				return null;
			case "GradientColor":
			case "LabColor":
			case "PatternColor":
				//METODO: implement other types
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, "[NativeColorConverter]", "convertNativeObject", "Color type " + aNativeObject.typename + " is not implemented.");
				return null;
		}
	};
	
	staticFunctions.convertNativeRgbColor = function(aNativeObject) {
		return RgbaColor.create(aNativeObject.red/255, aNativeObject.green/255, aNativeObject.blue/255);
	};
	
	staticFunctions.convertNativeGrayColor = function(aNativeObject) {
		var value = 1-0.01*aNativeObject.gray; //MENOTE: documentation is wrong, value is K in CMYK
		return RgbaColor.create(value, value, value);
	};
	
	staticFunctions.convertNativeCmykColor = function(aNativeObject) {
		return CmykColor.create(aNativeObject.cyan/100, aNativeObject.magenta/100, aNativeObject.yellow/100, aNativeObject.black/100);
	};
	
	staticFunctions.convertNativeSpotColor = function(aNativeObject) {
		//METODO: how to handle tint values?
		return ClassReference.convertNativeObject(aNativeObject.spot.color);
	};
});