/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of the object pool.
 */
dbm.registerClass("dbm.projects.tests.setup.ObjectPoolTestApplication", "dbm.projects.examples.setup.UpdateEveryFrameApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ObjectPoolTestApplication = dbm.importClass("dbm.projects.tests.setup.ObjectPoolTestApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tests.setup.ObjectPoolTestApplication::_init");
		
		this.superCall();
		
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.gui.DisplayBaseObject");
		
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.objectparts.Property");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.objectparts.GhostProperty");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.objectparts.UpdateFunction");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.objectparts.UpdateFunctionWithArguments");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.utils.data.NamedArray");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("dbm.core.objectparts.ObjectProperty");
		
		return this;
	};
	
	/**
	 * Interface function called from the update manager every frame.
	 *
	 * @param	aCurrentTime	The local time of the application in seconds.
	 * @param	aCurrentFrame	The current frame of the application.
	 */
	objectFunctions.updateTime = function(aCurrentTime, aCurrentFrame) {
		
		var length = 1; //Math.floor(100*Math.random());
		for(var i = 0; i < length; i++) {
			var newObject = DisplayBaseObject._createAndInitClass(DisplayBaseObject);
			newObject.destroy();
		}
		
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});