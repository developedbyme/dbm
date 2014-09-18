/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.utils.data.ConstantConverter", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.utils.data.ConstantConverter");
	//"use strict";
	
	//Self reference
	var ConstantConverter = dbm.importClass("com.developedbyme.adobeextendscript.utils.data.ConstantConverter");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var TrackMatteTypes = dbm.importClass("com.developedbyme.constants.thirdparty.adobe.aftereffects.TrackMatteTypes");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	
	//Constants
	
	
	staticFunctions._trackMatteNames = null;
	staticFunctions._trackMatteIds = null;
	
	
	staticFunctions.convertTrackMatteToName = function(aValue) {
		//console.log("com.developedbyme.adobeextendscript.utils.data.ConstantConverter::convertTrackMatteToName");
		if(ClassReference._trackMatteNames === null) {
			ClassReference._trackMatteNames = [TrackMatteTypes.ALPHA, TrackMatteTypes.ALPHA_INVERTED, TrackMatteTypes.LUMA, TrackMatteTypes.LUMA_INVERTED, TrackMatteTypes.NONE];
			ClassReference._trackMatteIds = [TrackMatteType.ALPHA, TrackMatteType.ALPHA_INVERTED, TrackMatteType.LUMA, TrackMatteType.LUMA_INVERTED, TrackMatteTypes.NO_TRACK_MATTE];
		}
		return ClassReference.convertConstant(aValue, ClassReference._trackMatteIds, ClassReference._trackMatteNames);
	};
	
	staticFunctions.convertConstant = function(aValue, aInputArray, aOutputArray) {
		//console.log("com.developedbyme.adobeextendscript.utils.data.ConstantConverter::convertConstant");
		
		var index = ArrayFunctions.indexOfInArray(aInputArray, aValue);
		if(index === -1) {
			//METODO: error message
			return null;
		}
		return aOutputArray[index];
	};
});