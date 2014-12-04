/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of setting up a project in after effects.
 */
dbm.registerClass("dbm.adobeextendscript.projects.tests.aftereffects.setup.ProjectSetupApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var ProjectSetupApplication = dbm.importClass("dbm.adobeextendscript.projects.tests.aftereffects.setup.ProjectSetupApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var AfterEffectsProject = dbm.importClass("dbm.adobeextendscript.aftereffects.AfterEffectsProject");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.adobeextendscript.projects.tests.aftereffects.setup.ProjectSetupApplication::_init");
		
		this.superCall();
		
		this._project = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.adobeextendscript.projects.tests.aftereffects.setup.ProjectSetupApplication::_createPage");
		
		this._project = AfterEffectsProject.create();
		console.log(this._project.getActiveItem());
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});