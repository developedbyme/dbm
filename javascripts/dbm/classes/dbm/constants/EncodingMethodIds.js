/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.EncodingMethodIds", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.EncodingMethodIds");
	
	var EncodingMethodIds = dbm.importClass("dbm.constants.EncodingMethodIds");
	
	staticFunctions.PLAIN_TEXT = "PLAINTEXT";
	staticFunctions.RSA_SHA1 = "RSA-SHA1";
	staticFunctions.HMAC_SHA1 = "HMAC-SHA1";
	
});