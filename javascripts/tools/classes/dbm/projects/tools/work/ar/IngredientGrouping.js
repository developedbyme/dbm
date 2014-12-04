/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.IngredientGrouping", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var IngredientGrouping = dbm.importClass("dbm.projects.tools.work.ar.IngredientGrouping");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var ArrayGenerator = dbm.importClass("dbm.utils.native.array.ArrayGenerator");
	var ArraySortingFunctions = dbm.importClass("dbm.utils.native.array.ArraySortingFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.IngredientGrouping::_init");
		
		this.superCall();
		
		this._numberOfRecipes = 1245;
		
		this._recipeIdsArray = ArrayGenerator.createNewRange(1, this._numberOfRecipes);
		this._recipesArray = new Array(this._recipeIdsArray.length);
		this._ingredients = NamedArray.create(true);
		
		//http://sainsbury-recipes-stage.appspot.com/api/recipes/51
		
		//this.addCssLink("../styles/utils/display.css");
		//this.addCssLink("../styles/utils/centeredContent.css");
		//this.addCssLink("../styles/utils/boxes.css");
		
		//this._assetsLoader.addAssetsByPath(this._mainTemplatePath, this._searchTemplatePath, this._resultsHolderTemplatePath, this._resultTemplatePath);
		
		var serverPath = "http://sainsbury-recipes-stage.appspot.com/";
		dbm.singletons.dbmAssetRepository.linkFolderToServer("api", serverPath);
		
		var currentArray = this._recipeIdsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var filePath = "api/recipes/" + currentArray[i];
			var adminFilePath = "admin/recipe/edit/" + currentArray[i];
			var asset = dbm.singletons.dbmAssetRepository.createFileAsset(filePath, serverPath + filePath, "json");
			this._assetsLoader.addAsset(asset);
		}
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.IngredientGrouping::_createPage");
		
		var currentArray = this._recipeIdsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			
			var currentId = currentArray[i];
			var filePath = "api/recipes/" + currentId;
			var currentData = dbm.singletons.dbmAssetRepository.getAssetData(filePath);
			this._recipesArray[i] = currentData;
			
			if(currentData !== null) {
				var currentArray2 = currentData["ingredients"];
				var currentArray2Length = currentArray2.length;
				for(var j = 0; j < currentArray2Length; j++) {
					var currentIngredient = currentArray2[j];
					var currentHolder = null;
					var ingredientName = currentIngredient["name"];
					if(this._ingredients.select(ingredientName)) {
						currentHolder = this._ingredients.currentSelectedItem;
					}
					else {
						currentHolder = new Array();
						this._ingredients.addObject(ingredientName, currentHolder);
					}
					currentHolder.push({"name": currentIngredient["display_name"], "id": currentId});
				}
			}
		}
		
		console.log(this._recipesArray);
		console.log(this._ingredients);
		
		this._generateHtml();
	};
	
	objectFunctions._generateHtml = function() {
		
		var htmlString = "";
		
		var currentArray = ArrayFunctions.copyArray(this._ingredients.getNamesArray());
		currentArray.sort(ArraySortingFunctions.caseInsensitive);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentIngredient = currentArray[i];
			htmlString += "<div class=\"group\"><div class=\"ingredient\">" + currentIngredient + "</div><div class=\"displayTextGroup\">";
			var currentArray2 = this._ingredients.getObject(currentIngredient);
			var currentArray2Length = currentArray2.length;
			for(var j = 0; j < currentArray2Length; j++) {
				var currentDisplayText = currentArray2[j];
				htmlString += "<div class=\"displayText\">" + currentDisplayText["name"] + " <a href=\"http://sainsbury-recipes-stage.appspot.com/admin/recipe/edit/" + currentDisplayText["id"] + "\" target=\"_blank\">" + currentDisplayText["id"] + "</a></div>";
			}
			htmlString += "</div></div>";
		}
		
		console.log(htmlString);
		//document.body.innerHTML = htmlString;
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new IngredientGrouping()).init();
	};
});