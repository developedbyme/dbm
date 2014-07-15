/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example application that updates every frame.
 */
dbm.registerClass("com.developedbyme.projects.examples.setup.UpdateEveryFrameApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var UpdateEveryFrameApplication = dbm.importClass("com.developedbyme.projects.examples.setup.UpdateEveryFrameApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.setup.UpdateEveryFrameApplication::_init");
		
		this.superCall();
		
		this._addStartFunction(this._startUpdating, []);
		
		return this;
	};
	
	/**
	 * Starts the updating of this application
	 */
	objectFunctions._startUpdating = function() {
		console.log("com.developedbyme.projects.examples.setup.UpdateEveryFrameApplication::_startUpdating");
		
		dbm.singletons.dbmUpdateManager.addUpdater(this);
	};
	
	/**
	 * Interface function called from the update manager every frame.
	 *
	 * @param	aCurrentTime	The local time of the application in seconds.
	 * @param	aCurrentFrame	The current frame of the application.
	 */
	objectFunctions.updateTime = function(aCurrentTime, aCurrentFrame) {
		console.log("com.developedbyme.projects.examples.setup.UpdateEveryFrameApplication::updateTime");
		console.log(aCurrentTime, aCurrentFrame);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});