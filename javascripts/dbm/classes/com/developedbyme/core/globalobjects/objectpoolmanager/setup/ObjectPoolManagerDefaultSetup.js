/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global object pool manager.
 */
dbm.registerClass("com.developedbyme.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup");
	//"use strict";
	
	//Self reference
	var ObjectPoolManagerDefaultSetup = dbm.importClass("com.developedbyme.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the default pooled objects.
	 */
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.extendedevent.EventDataObject");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.data.points.Point");
	};
});