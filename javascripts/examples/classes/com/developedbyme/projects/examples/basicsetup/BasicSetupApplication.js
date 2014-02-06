dbm.registerClass("com.developedbyme.projects.examples.basicsetup.BasicSetupApplication", "com.developedbyme.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	//Self reference
	var BasicSetupApplication = dbm.importClass("com.developedbyme.projects.examples.basicsetup.BasicSetupApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.projects.examples.basicsetup.BasicSetupApplication::_init");
		
		this.superCall();
		
		var templatePath = "../assets/examples/workspace/basicSetup/visualTemplatesWithCommands2.html#mainWorkspace";
		
		this._assetsLoader.addAssetsByPath(templatePath);
		this._addStartFunction(this._createPage, [templatePath]);
		
		return this;
	};
	
	objectFunctions._createPage = function(aTemplatePath) {
		console.log("com.developedbyme.projects.examples.basicsetup.BasicSetupApplication::_createPage");
		
		var windowSizeNode = WindowSizeNode.create(dbm.getWindow());
		windowSizeNode.start();
		this.addDestroyableObject(windowSizeNode);
		
		dbm.singletons.dbmTemplateManager.createControllersForAsset(aTemplatePath, {"width": windowSizeNode.getProperty("width"), "height": windowSizeNode.getProperty("height")}, true, dbm.getDocument().body, true);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});