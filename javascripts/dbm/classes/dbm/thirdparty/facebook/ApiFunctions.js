/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.ApiFunctions", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.ApiFunctions");
	
	//Self reference
	var ApiFunctions = dbm.importClass("dbm.thirdparty.facebook.ApiFunctions");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	staticFunctions.createProfileImageUrl = function(aId, aWidth, aHeight) {
		//console.log("dbm.thirdparty.facebook.ApiFunctions::createProfileImageUrl");
		
		var returnString = "https://graph.facebook.com/" + aId + "/picture";
		if(VariableAliases.isSet(aWidth) && VariableAliases.isSet(aHeight)) {
			returnString += "?width=" + aWidth + "&height=" + aHeight;
		}
		
		return returnString;
	};
});