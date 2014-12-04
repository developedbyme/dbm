/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.treestructure.TreeStructureApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var TreeStructureApplication = dbm.importClass("dbm.projects.examples.treestructure.TreeStructureApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.treestructure.TreeStructureApplication::_init");
		
		this.superCall();
		
		var mainTemplatePath = "../assets/examples/workspace/treeStructure/visualTemplates.html#treeStructure";
		var itemTemplatePath = "../assets/examples/workspace/treeStructure/visualTemplates.html#treeStructureItem";
		
		this._assetsLoader.addAssetsByPath(mainTemplatePath, itemTemplatePath);
		this._addStartFunction(this._createPage, [mainTemplatePath, itemTemplatePath]);
		
		return this;
	};
	
	objectFunctions._createPage = function(aMainTemplatePath, aItemTemplatePath) {
		console.log("dbm.projects.examples.treestructure.TreeStructureApplication::_createPage");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(aMainTemplatePath, null, true, dbm.getDocument().body, true);
		var treeStructureView = templateResult.mainController;
		
		treeStructureView.setItemTemplate(dbm.singletons.dbmAssetRepository.getAssetData(aItemTemplatePath));
		treeStructureView.setTreeStructure(dbm.singletons.dbmAssetRepository._hierarchy);
		treeStructureView.getProperty("display").startUpdating();
		
		console.log(treeStructureView);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});