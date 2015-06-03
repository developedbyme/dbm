/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.AccessExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.AccessExtendedEventIds");
	//"use strict";
	
	var AccessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.AccessExtendedEventIds");
	
	staticFunctions.SIGNED_IN = "signedIn";
	staticFunctions.UNSUCCESSFUL_SIGN_IN = "unsuccessfulSignIn";
	staticFunctions.SIGNED_OUT = "signedOut";
	
});