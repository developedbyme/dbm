/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of using bridge talk between applications.
 */
dbm.registerClass("com.developedbyme.adobeextendscript.projects.tests.common.BridgeTalkApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var BridgeTalkApplication = dbm.importClass("com.developedbyme.adobeextendscript.projects.tests.common.BridgeTalkApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var BridgeClassRunner = dbm.importClass("com.developedbyme.adobeextendscript.utils.bridge.BridgeClassRunner");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.projects.tests.common.BridgeTalkApplication::_init");
		
		this.superCall();
		
		this._bridgeClassRunner = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("com.developedbyme.adobeextendscript.projects.tests.common.BridgeTalkApplication::_createPage");
		
		this._bridgeClassRunner = BridgeClassRunner.create("photoshop");
		this._bridgeClassRunner.perform();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});