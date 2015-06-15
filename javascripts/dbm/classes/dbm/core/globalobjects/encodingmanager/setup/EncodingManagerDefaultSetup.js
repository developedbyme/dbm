/**
 * Default setup for the global encoding manager.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultSetup");
	//"use strict";
	
	//Self reference
	var EncodingManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.encodingmanager.setup.EncodingManagerDefaultSetup");
	
	//Error report
	
	//Dependencies
	var PlainTextEncoder = dbm.importClass("dbm.core.globalobjects.encodingmanager.encoders.PlainTextEncoder");
	
	//Utils
	
	//Constants
	var EncodingMethodIds = dbm.importClass("dbm.constants.generic.EncodingMethodIds");
	
	/**
	 * Sets up the default encoders.
	 */
	staticFunctions.setup = function() {
		dbm.singletons.dbmEncodingManager.addEncoder(EncodingMethodIds.PLAIN_TEXT, PlainTextEncoder.create());
	};
});