/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of the object pool.
 */
dbm.registerClass("com.developedbyme.projects.tests.setup.ObjectPoolTestApplication", "com.developedbyme.projects.examples.setup.UpdateEveryFrameApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var ObjectPoolTestApplication = dbm.importClass("com.developedbyme.projects.tests.setup.ObjectPoolTestApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.tests.setup.ObjectPoolTestApplication::_init");
		
		this.superCall();
		
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.gui.DisplayBaseObject");
		
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.objectparts.Property");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.objectparts.GhostProperty");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.objectparts.UpdateFunction");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.objectparts.UpdateFunctionWithArguments");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.utils.data.NamedArray");
		dbm.singletons.dbmObjectPoolManager.setupObjectPoolIfClassExists("com.developedbyme.core.objectparts.ObjectProperty");
		
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