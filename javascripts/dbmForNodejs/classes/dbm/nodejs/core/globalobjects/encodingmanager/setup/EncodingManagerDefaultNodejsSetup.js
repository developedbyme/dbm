/**
 * Default setup for the global encoding manager.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultNodejsSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultNodejsSetup");
	//"use strict";
	
	//Self reference
	var EncodingManagerDefaultNodejsSetup = dbm.importClass("dbm.nodejs.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultNodejsSetup");
	
	//Error report
	
	//Dependencies
	var HmacEncoder = dbm.importClass("dbm.nodejs.core.globalobjects.encodingmanager.encoders.HmacEncoder");
	var SignatureEncoder = dbm.importClass("dbm.nodejs.core.globalobjects.encodingmanager.encoders.SignatureEncoder");
	
	//Utils
	
	//Constants
	var EncodingMethodIds = dbm.importClass("dbm.constants.EncodingMethodIds");
	
	/**
	 * Sets up the default encoders.
	 */
	staticFunctions.setup = function() {
		dbm.singletons.dbmEncodingManager.addEncoder(EncodingMethodIds.RSA_SHA1, SignatureEncoder.create(EncodingMethodIds.RSA_SHA1));
		dbm.singletons.dbmEncodingManager.addEncoder(EncodingMethodIds.HMAC_SHA1, HmacEncoder.create("sha1"));
	};
});