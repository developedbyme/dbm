/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.facebook.constants.StatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.thirdparty.facebook.constants.StatusTypes");
	
	//REFERENCE: https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
	
	var StatusTypes = dbm.importClass("dbm.thirdparty.facebook.constants.StatusTypes");
	
	staticFunctions.CONNECTED = "connected";
	staticFunctions.NOT_AUTHORIZED = "not_authorized";
	staticFunctions.UNKNOWN = "unknown";
	
});