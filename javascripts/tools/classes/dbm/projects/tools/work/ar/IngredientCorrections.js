/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.IngredientCorrections", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var IngredientCorrections = dbm.importClass("dbm.projects.tools.work.ar.IngredientCorrections");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var ArrayGenerator = dbm.importClass("dbm.utils.native.array.ArrayGenerator");
	var ArraySortingFunctions = dbm.importClass("dbm.utils.native.array.ArraySortingFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.IngredientCorrections::_init");
		
		this.superCall();
		
		this._databaseCsvPath = "../assets/tools/work/ar/ingredientCorrections/databaseIngredients.csv";
		this._finalCsvPath = "../assets/tools/work/ar/ingredientCorrections/finalIngredients.csv";
		
		this._databaseCsv = null;
		this._finalCsv = null;
		
		return this;
	};
	
	objectFunctions._setup = function() {
		console.log("dbm.projects.tools.work.ar.IngredientCorrections::_setup");
		
		//http://sainsbury-recipes-stage.appspot.com/api/recipes/51
		
		//this.addCssLink("../styles/utils/display.css");
		//this.addCssLink("../styles/utils/centeredContent.css");
		//this.addCssLink("../styles/utils/boxes.css");
		
		this._assetsLoader.addAssetsByPath(this._databaseCsvPath, this._finalCsvPath);
	};
	
	objectFunctions._assetsLoaded = function() {
		console.log("dbm.projects.tools.work.ar.IngredientCorrections::_assetsLoaded");
		this._createPage();
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.IngredientCorrections::_createPage");
		
		var databaseCsvData = dbm.singletons.dbmAssetRepository.getAssetData(this._databaseCsvPath);
		this._databaseCsv = CsvParser.create(databaseCsvData);
		this._databaseCsv.parse();
		
		var finalCsvData = dbm.singletons.dbmAssetRepository.getAssetData(this._finalCsvPath);
		this._finalCsv = CsvParser.create(finalCsvData);
		this._finalCsv.parse();
		
		var currentArray = this._finalCsv.getRows();
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i++) {
			var currentRow = currentArray[i];
			var searchValue = currentRow[1].toLowerCase();
			
			var isFound = false;
			var currentArray2 = this._databaseCsv.getRows();
			var currentArray2Length = currentArray2.length;
			for(var j = 1; j < currentArray2Length; j++) {
				var currentRow = currentArray2[j];
				if(currentRow[1].toLowerCase() === searchValue) {
					isFound = true;
				}
			}
			
			if(isFound) {
				console.log("Found:", searchValue);
			}
			else {
				console.log("Not found: \"" + searchValue + "\"");
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new IngredientCorrections()).init();
	};
});