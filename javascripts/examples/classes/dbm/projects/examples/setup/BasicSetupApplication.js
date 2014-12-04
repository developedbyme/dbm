/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Example application of a basic setup of a workspace.
 */
dbm.registerClass("dbm.projects.examples.setup.BasicSetupApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var BasicSetupApplication = dbm.importClass("dbm.projects.examples.setup.BasicSetupApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.setup.BasicSetupApplication::_init");
		
		this.superCall();
		
		var templatePath = "../assets/examples/workspace/basicSetup/visualTemplatesWithCommands2.html#mainWorkspace";
		
		this._assetsLoader.addAssetsByPath(templatePath);
		this._addStartFunction(this._createPage, [templatePath]);
		
		return this;
	};
	
	/**
	 * Creates the page.
	 *
	 * @param	aTemplatePath	The path to the template that is used to create the page.
	 */
	objectFunctions._createPage = function(aTemplatePath) {
		console.log("dbm.projects.examples.setup.BasicSetupApplication::_createPage");
		
		var windowSizeNode = WindowSizeNode.create(dbm.getWindow());
		windowSizeNode.start();
		this.addDestroyableObject(windowSizeNode);
		
		dbm.singletons.dbmTemplateManager.createControllersForAsset(aTemplatePath, {"width": windowSizeNode.getProperty("width"), "height": windowSizeNode.getProperty("height")}, true, dbm.getDocument().body, true);
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});