/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.EncodingMethodIds", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.EncodingMethodIds");
	
	var EncodingMethodIds = dbm.importClass("com.developedbyme.constants.EncodingMethodIds");
	
	staticFunctions.PLAIN_TEXT = "PLAINTEXT";
	staticFunctions.RSA_SHA1 = "RSA-SHA1";
	staticFunctions.HMAC_SHA1 = "HMAC-SHA1";
	
});