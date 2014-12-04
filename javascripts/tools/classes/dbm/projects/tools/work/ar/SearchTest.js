/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.SearchTest", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var SearchTest = dbm.importClass("dbm.projects.tools.work.ar.SearchTest");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.SearchTest::_init");
		
		this.superCall();
		
		this._mainTemplatePath = "../assets/tools/work/ar/searchTest/templates.html#main";
		this._searchTemplatePath = "../assets/tools/work/ar/searchTest/templates.html#search";
		this._resultsHolderTemplatePath = "../assets/tools/work/ar/searchTest/templates.html#resultsHolder";
		this._resultTemplatePath = "../assets/tools/work/ar/searchTest/templates.html#result";
		
		this._recipeIdsArray = []; //[37, 51, 97, 190, 468, 854, 204, 233, 205, 988, 211, 259, 202, 230, 198, 229, 290, 88, 194, 433, 263, 6, 519, 816, 156, 315, 379, 208, 47, 329, 342, 684, 289, 280, 448, 827];
		this._recipesArray = new Array(this._recipeIdsArray.length);
		
		this._mainHolder = null;
		this._searchTextField = null;
		this._searchButton = null;
		this._resultsHolder = null;
		
		return this;
	};
	
	objectFunctions._setup = function() {
		console.log("dbm.projects.tools.work.ar.SearchTest::_setup");
		
		//http://sainsbury-recipes-stage.appspot.com/api/recipes/51
		
		this.addCssLink("../styles/utils/display.css");
		this.addCssLink("../styles/utils/centeredContent.css");
		this.addCssLink("../styles/utils/boxes.css");
		
		this._assetsLoader.addAssetsByPath(this._mainTemplatePath, this._searchTemplatePath, this._resultsHolderTemplatePath, this._resultTemplatePath);
		
		var serverPath = "http://sainsbury-recipes-stage.appspot.com/";
		dbm.singletons.dbmAssetRepository.linkFolderToServer("api", serverPath);
		
		var currentArray = this._recipeIdsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var filePath = "api/recipes/" + currentArray[i];
			var adminFilePath = "admin/recipe/edit/" + currentArray[i];
			var asset = dbm.singletons.dbmAssetRepository.createFileAsset(filePath, serverPath + filePath, "json");
			this._assetsLoader.addAsset(asset);
			//var asset = dbm.singletons.dbmAssetRepository.createFileAsset(adminFilePath, serverPath + adminFilePath, "xml");
			//console.log(asset);
			//this._assetsLoader.addAsset(asset);
		}
	};
	
	objectFunctions._assetsLoaded = function() {
		console.log("dbm.projects.tools.work.ar.SearchTest::_assetsLoaded");
		this._createPage();
		
		var mainControllerResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._mainTemplatePath);
		this._mainHolder = mainControllerResult.getController("contentHolder");
		this._mainHolder.addToParent(dbm.getDocument().body);
		
		var searchResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._searchTemplatePath);
		this._searchTextField = searchResult.getController("ingredients");
		this._searchTextField.setDefaultText("Ingredients");
		this._searchTextField.activate();
		this._searchButton = searchResult.getController("searchButton");
		this._searchButton.activate();
		this._mainHolder.getElement().appendChild(searchResult.rootElement);
		
		var resultsHolderResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(this._resultsHolderTemplatePath);
		this._resultsHolder = resultsHolderResult.getController("contentHolder");
		this._mainHolder.getElement().appendChild(resultsHolderResult.rootElement);
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.SearchTest::_createPage");
		
		var currentArray = this._recipeIdsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var filePath = "api/recipes/" + currentArray[i];
			this._recipesArray[i] = dbm.singletons.dbmAssetRepository.getAssetData(filePath);
		}
		
		console.log(this._recipesArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new SearchTest()).init();
	};
});