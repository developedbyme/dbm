/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Default setup for the global object pool manager.
 */
dbm.registerClass("dbm.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup");
	//"use strict";
	
	//Self reference
	var ObjectPoolManagerDefaultSetup = dbm.importClass("dbm.core.globalobjects.objectpoolmanager.setup.ObjectPoolManagerDefaultSetup");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Sets up the default pooled objects.
	 */
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.extendedevent.EventDataObject");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.data.points.Point");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.utils.data.iterator.IterationData");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.utils.data.PositionedArrayHolder");
		
	};
});