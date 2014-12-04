/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.google.maps.ApiFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ApiFunctions = dbm.importClass("dbm.thirdparty.google.maps.ApiFunctions");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	staticFunctions.getJavascriptUrl = function(aKey, aSensor) {
		
		aSensor = VariableAliases.valueWithDefault(aSensor, false);
		
		return "https://maps.googleapis.com/maps/api/js?key=" + aKey + "&sensor=" + aSensor;
	};
	
	staticFunctions.getJavascriptUrlWithCallback = function(aKey, aCallback, aSensor) {
		
		aSensor = VariableAliases.valueWithDefault(aSensor, false);
		
		return "https://maps.googleapis.com/maps/api/js?key=" + aKey + "&sensor=" + aSensor + "&callback=" + "dbm.singletons." + aCallback;
	};
});