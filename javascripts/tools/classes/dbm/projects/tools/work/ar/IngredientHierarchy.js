/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.IngredientHierarchy", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var IngredientHierarchy = dbm.importClass("dbm.projects.tools.work.ar.IngredientHierarchy");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var LevenshteinDistance = dbm.importClass("dbm.utils.native.string.LevenshteinDistance");
	var StringAliases = dbm.importClass("dbm.utils.native.string.StringAliases");
	
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var StringAliases = dbm.importClass("dbm.utils.native.string.StringAliases");
	var XmlModifier = dbm.importClass("dbm.utils.xml.XmlModifier");
	var XmlCreator = dbm.importClass("dbm.utils.xml.XmlCreator");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var DomManipulationFunctions = dbm.importClass("dbm.utils.htmldom.DomManipulationFunctions");
	
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var FormFieldExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.FormFieldExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_init");
		
		this.superCall();
		
		this._foodCategoriesPath = "../assets/tests/csvParser/foodCategories.xml";
		this._brandedFoodProductsPath = "../assets/tests/csvParser/brandedFoodProducts.xml";
		this._wordCorrectionsPath = "../assets/tests/csvParser/wordCorrections.xml";
		this._csvDataPath = "../assets/tests/csvParser/example.csv";
		this._rawIngredientTemplatePath = "../assets/tests/csvParser/inputTemplates.html#addRawIngredient";
		this._brandedIngredientTemplatePath = "../assets/tests/csvParser/inputTemplates.html#addBrandedIngredient";
		this._exportXmlsTemplatePath = "../assets/tests/csvParser/inputTemplates.html#exportXmls";
		
		this._foodCategories = null;
		this._brandedFoodProducts = null;
		this._wordCorrections = null;
		
		this._addRawIngredientField = null;
		this._addRawParentIngredientField = null;
		this._addRawParentIngredientAutocomplete = null;
		this._addRawButton = null;
		
		this._addBrandedIngredientField = null;
		this._addBrandedParentIngredientField = null;
		this._addBrandedParentIngredientAutocomplete = null;
		this._addBrandedRawIngredientField = null;
		this._addBrandedRawIngredientAutocomplete = null;
		this._addBrandedButton = null;
		this._skipBrandedButton = null;
		
		this._progressText = null;
		this._totalText = null;
		this._exportButton = null;
		
		this._currentPosition = 0;
		this._inputArray = new Array();
		this._rawIngredientsIdsArray = new Array();
		this._levenshteinDistance = LevenshteinDistance.create();
		this._wordCorrectionAliases = StringAliases.create();
		this._wordCorrectionAliases.addStringConversion({"convertString": function(aText) {return aText.toLowerCase()}});
		
		return this;
	};
	
	objectFunctions._setup = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_setup");
		
		this.addCssLink("../styles/utils/display.css");
		
		this._assetsLoader.addAssetsByPath(this._csvDataPath, this._foodCategoriesPath, this._brandedFoodProductsPath, this._wordCorrectionsPath, this._rawIngredientTemplatePath, this._brandedIngredientTemplatePath, this._exportXmlsTemplatePath);
	};
	
	objectFunctions._assetsLoaded = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_assetsLoaded");
		this._createPage();
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_createPage");
		
		this._foodCategories = dbm.singletons.dbmAssetRepository.getAssetData(this._foodCategoriesPath);
		this._brandedFoodProducts = dbm.singletons.dbmAssetRepository.getAssetData(this._brandedFoodProductsPath);
		this._wordCorrections = dbm.singletons.dbmAssetRepository.getAssetData(this._wordCorrectionsPath);
		
		XmlChildRetreiver.getAllValuesForAttribute(this._foodCategories, "id", this._rawIngredientsIdsArray);
		
		var currentArray = this._rawIngredientsIdsArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentId = currentArray[i];
			//console.log(currentId);
			this._wordCorrectionAliases.addRealValue(currentId);
			
			var wordCorrectionsNode = this._wordCorrections.getElementById(currentId);
			if(wordCorrectionsNode !== null) {
				//console.log(wordCorrectionsNode);
				var currentArray2 = XmlChildRetreiver.getChilds(wordCorrectionsNode);
				var currentArray2Length = currentArray2.length;
				var correctedWordsArray = new Array(currentArray2Length);
				for(var j = 0; j < currentArray2Length; j++) {
					correctedWordsArray[j] = XmlChildRetreiver.getNodeValue(currentArray2[j]);
				}
				this._wordCorrectionAliases.addAliasesToValue(correctedWordsArray, currentId);
			}
		}
		
		var currentArray = new Array();
		XmlChildRetreiver.getAllValuesForAttribute(this._brandedFoodProducts, "id", currentArray);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentId = currentArray[i];
			if(ArrayFunctions.indexOfInArray(this._rawIngredientsIdsArray, currentId) === -1) {
				//console.log(currentId);
				this._wordCorrectionAliases.addRealValue(currentId);
				
				var wordCorrectionsNode = this._wordCorrections.getElementById(currentId);
				if(wordCorrectionsNode !== null) {
					//console.log(wordCorrectionsNode);
					var currentArray2 = XmlChildRetreiver.getChilds(wordCorrectionsNode);
					var currentArray2Length = currentArray2.length;
					var correctedWordsArray = new Array(currentArray2Length);
					for(var j = 0; j < currentArray2Length; j++) {
						correctedWordsArray[j] = XmlChildRetreiver.getNodeValue(currentArray2[j]);
					}
					this._wordCorrectionAliases.addAliasesToValue(correctedWordsArray, currentId);
				}
			}
		}
		
		//console.log(this._wordCorrectionAliases.resolveAlias("(1/3rd x 2.5kg bag) x 2.5kg pack basics potatoes"));
		
		//Csv import
		var csvData = dbm.singletons.dbmAssetRepository.getAssetData(this._csvDataPath);
		var parser = CsvParser.create(csvData);
		
		parser.parse();
		
		var currentArray = parser.getRows();
		var currentArrayLength = currentArray.length;
		for(var i = 2; i < currentArrayLength; i++) {
			var currentArray2 = currentArray[i][8].split(";");
			var currentArray2Length = currentArray2.length;
			
			for(var j = 0; j < currentArray2Length; j++) {
				if(ArrayFunctions.indexOfInArray(this._inputArray, currentArray2[j]) === -1) {
					this._inputArray.push(currentArray2[j]);
				}
			}
		}
		
		this._inputArray.sort(function(a,b) {
			a = a.toLowerCase();
			b = b.toLowerCase();
			if( a == b) return 0;
			if( a > b) return 1;
			return -1;
		});
		
		//Raw ingredients
		var addElement = DomManipulationFunctions.importNode(dbm.singletons.dbmAssetRepository.getAssetData(this._rawIngredientTemplatePath), true, dbm.getDocument());
		addElement.id = null;
		dbm.getDocument().body.appendChild(addElement);
		
		var rawIngredientTemplate = dbm.singletons.dbmTemplateManager.createControllersForTemplate(addElement);
		
		this._addRawIngredientField = rawIngredientTemplate.getController("ingredient");
		this._addRawIngredientField.setDefaultText("Ingredient");
		this._addRawIngredientField.activate();
		
		this._addRawParentIngredientField = rawIngredientTemplate.getController("parentIngredient");
		this._addRawParentIngredientField.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._callback_addRawParentIngredientChanged, []));
		this._addRawParentIngredientField.setDefaultText("Parent");
		this._addRawParentIngredientField.activate();
		
		this._addRawParentIngredientAutocomplete = rawIngredientTemplate.getController("autocomplete");
		
		this._addRawButton = rawIngredientTemplate.getController("addButton");
		this._addRawButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._callback_addRawIngredient, []));
		this._addRawButton.activate();
		
		//Branded ingredients
		var brandedElement = DomManipulationFunctions.importNode(dbm.singletons.dbmAssetRepository.getAssetData(this._brandedIngredientTemplatePath), true, dbm.getDocument());
		brandedElement.id = null;
		dbm.getDocument().body.appendChild(brandedElement);
		
		var brandedIngredientTemplate = dbm.singletons.dbmTemplateManager.createControllersForTemplate(brandedElement);
		
		this._addBrandedIngredientField = brandedIngredientTemplate.getController("input");
		this._addBrandedIngredientField.setDefaultText("Input");
		this._addBrandedIngredientField.activate();
		
		this._addBrandedParentIngredientField = brandedIngredientTemplate.getController("ingredient");
		this._addBrandedParentIngredientField.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._callback_addBrandedParentIngredientChanged, []));
		this._addBrandedParentIngredientField.setDefaultText("Ingredient");
		this._addBrandedParentIngredientField.activate();
		
		this._addBrandedParentIngredientAutocomplete = brandedIngredientTemplate.getController("autocompleteIngredient");
		
		this._addBrandedRawIngredientField = brandedIngredientTemplate.getController("rawIngredient");
		this._addBrandedRawIngredientField.getExtendedEvent().addCommandToEvent(FormFieldExtendedEventIds.CHANGE, CallFunctionCommand.createCommand(this, this._callback_addBrandedRawIngredientChanged, []));
		this._addBrandedRawIngredientField.setDefaultText("Raw ingredient");
		this._addBrandedRawIngredientField.activate();
		
		this._addBrandedRawIngredientAutocomplete = brandedIngredientTemplate.getController("autocompleteRawIngredient");
		
		this._addBrandedButton = brandedIngredientTemplate.getController("addButton");
		this._addBrandedButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._callback_addBrandedIngredient, []));
		this._addBrandedButton.activate();
		
		this._skipBrandedButton = brandedIngredientTemplate.getController("skipButton");
		this._skipBrandedButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._showNextData, []));
		this._skipBrandedButton.activate();
		
		//Export
		var exportElement = DomManipulationFunctions.importNode(dbm.singletons.dbmAssetRepository.getAssetData(this._exportXmlsTemplatePath), true, dbm.getDocument());
		exportElement.id = null;
		dbm.getDocument().body.appendChild(exportElement);
		
		var exportTemplate = dbm.singletons.dbmTemplateManager.createControllersForTemplate(exportElement);
		
		this._progressText = exportTemplate.getController("progress");
		this._progressText.getProperty("text").setValue(this._currentPosition);
		this._totalText = exportTemplate.getController("total");
		this._totalText.getProperty("text").setValue(this._inputArray.length);
		
		this._exportButton = exportTemplate.getController("exportButton");
		this._exportButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._callback_exportXmls, []));
		this._exportButton.activate();
		
		//Start
		this._showNextData();
	};
	
	objectFunctions._callback_addRawIngredient = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_callback_addRawIngredient");
		
		var ingredient = this._addRawIngredientField.getValue();
		var parentIngredient = this._addRawParentIngredientAutocomplete.getProperty("text").getValue();
		
		console.log(ingredient, parentIngredient);
		
		this._rawIngredientsIdsArray.push(ingredient);
		var parentElement = this._foodCategories.getElementById(parentIngredient);
		XmlModifier.createAttribute(XmlModifier.createChild(parentElement, "data"), "id", ingredient);
		this._wordCorrectionAliases.addRealValue(ingredient);
		
		this._addRawIngredientField.setText("");
		this._addRawParentIngredientField.setText("");
		
		this._callback_addRawParentIngredientChanged();
	};
	
	objectFunctions._callback_addRawParentIngredientChanged = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_callback_addRawParentIngredientChanged");
		
		var currentText = this._addRawParentIngredientField.getValue().toLowerCase();
		
		var lowestText = "";
		var lowestValue = 1000;
		
		if(currentText !== "") {
			var currentArray = this._rawIngredientsIdsArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentWord = currentArray[i].toLowerCase();
			
				//var minScore = Math.abs(currentText.length-currentWord.length);
				//var maxScore = Math.max(currentText.length, currentWord.length);
				var testValue = this._levenshteinDistance.compareStrings(currentText, currentWord);
				if(currentText.length < currentWord.length) {
					var testValue2 = this._levenshteinDistance.compareStrings(currentText, currentWord.substring(0, currentText.length));
					if(testValue2 < testValue) {
						testValue = testValue2;
					}
				}
				if(testValue < lowestValue || (testValue === lowestValue && Math.abs(currentText.length-currentWord.length) < Math.abs(currentText.length-lowestText.length))) {
					lowestValue = testValue;
					lowestText = currentArray[i];
				}
			}
		}
		
		//console.log(lowestText);
		this._addRawParentIngredientAutocomplete.getProperty("text").setValue(lowestText);
	};
	
	objectFunctions._callback_addBrandedParentIngredientChanged = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_callback_addBrandedParentIngredientChanged");
		
		var currentValue = this._addBrandedParentIngredientField.getValue();
		
		var bestGuess = this._wordCorrectionAliases.getClosestValue(currentValue);
		this._addBrandedParentIngredientAutocomplete.getProperty("text").setValue(bestGuess);
		
		var currentText = currentValue;
		var lowestText = currentValue;
		var lowestValue = 1000;
		
		if(ArrayFunctions.indexOfInArray(this._rawIngredientsIdsArray, currentValue) === -1) {
			var brandNode = this._brandedFoodProducts.getElementById(currentValue);
			if(brandNode !== null) {
				lowestText = XmlChildRetreiver.getAttribute(brandNode.parentNode, "id");
			}
			else if(currentText !== "") {
				var currentArray = this._rawIngredientsIdsArray;
				var currentArrayLength = currentArray.length;
				for(var i = 0; i < currentArrayLength; i++) {
					var currentWord = currentArray[i].toLowerCase();
			
					//var minScore = Math.abs(currentText.length-currentWord.length);
					//var maxScore = Math.max(currentText.length, currentWord.length);
					var testValue = this._levenshteinDistance.compareStrings(currentText, currentWord);
					if(currentText.length < currentWord.length) {
						var testValue2 = this._levenshteinDistance.compareStrings(currentText, currentWord.substring(0, currentText.length));
						if(testValue2 < testValue) {
							testValue = testValue2;
						}
					}
					if(testValue < lowestValue || (testValue === lowestValue && Math.abs(currentText.length-currentWord.length) < Math.abs(currentText.length-lowestText.length))) {
						lowestValue = testValue;
						lowestText = currentArray[i];
					}
				}
			}
		}
		
		//console.log(lowestText);
		this._addBrandedRawIngredientField.setText(lowestText);
		
		this._callback_addBrandedRawIngredientChanged();
	};
	
	objectFunctions._callback_addBrandedRawIngredientChanged = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_callback_addBrandedRawIngredientChanged");
		
		var currentValue = this._addBrandedRawIngredientField.getValue();
		
		var currentText = currentValue;
		var lowestText = currentValue;
		var lowestValue = 1000;
		
		if(currentText !== "") {
			var currentArray = this._rawIngredientsIdsArray;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentWord = currentArray[i].toLowerCase();
	
				//var minScore = Math.abs(currentText.length-currentWord.length);
				//var maxScore = Math.max(currentText.length, currentWord.length);
				var testValue = this._levenshteinDistance.compareStrings(currentText, currentWord);
				if(currentText.length < currentWord.length) {
					var testValue2 = this._levenshteinDistance.compareStrings(currentText, currentWord.substring(0, currentText.length));
					if(testValue2 < testValue) {
						testValue = testValue2;
					}
				}
				if(testValue < lowestValue || (testValue === lowestValue && Math.abs(currentText.length-currentWord.length) < Math.abs(currentText.length-lowestText.length))) {
					lowestValue = testValue;
					lowestText = currentArray[i];
				}
			}
		}
		
		//console.log(lowestText);
		this._addBrandedRawIngredientAutocomplete.getProperty("text").setValue(lowestText);
		
	};
	
	objectFunctions._callback_addBrandedIngredient = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_callback_addBrandedIngredient");
		
		var input = this._addBrandedIngredientField.getValue();
		var parentIngredient = this._addBrandedParentIngredientField.getValue();
		var rawIngredient = this._addBrandedRawIngredientAutocomplete.getProperty("text").getValue();
		
		console.log(input, parentIngredient, rawIngredient);
		
		var parentWordCorrectionNode = this._wordCorrections.getElementById(parentIngredient);
		if(parentWordCorrectionNode === null) {
			parentWordCorrectionNode = XmlModifier.createAttribute(XmlModifier.createChild(XmlChildRetreiver.getFirstChild(this._wordCorrections), "data"), "id", parentIngredient);
		}
		XmlModifier.createText(XmlModifier.createChild(parentWordCorrectionNode, "data"), input);
		this._wordCorrectionAliases.addAliasesToValue([input], parentIngredient);
		
		if(rawIngredient !== parentIngredient && this._brandedFoodProducts.getElementById(parentIngredient) === null) {
			var rawParentNode = this._brandedFoodProducts.getElementById(rawIngredient);
			if(rawParentNode === null) {
				rawParentNode = XmlModifier.createAttribute(XmlModifier.createChild(XmlChildRetreiver.getFirstChild(this._brandedFoodProducts), "data"), "id", rawIngredient);
			}
			XmlModifier.createAttribute(XmlModifier.createChild(rawParentNode, "data"), "id", parentIngredient);
		}
		
		this._showNextData();
	};
	
	objectFunctions._callback_exportXmls = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_callback_exportXmls");
		
		console.log(XmlCreator.createStringFromXml(this._foodCategories));
		console.log(XmlCreator.createStringFromXml(this._brandedFoodProducts));
		console.log(XmlCreator.createStringFromXml(this._wordCorrections));
	};
	
	objectFunctions._showNextData = function() {
		console.log("dbm.projects.tools.work.ar.IngredientHierarchy::_showNextData");
		
		if(this._currentPosition < this._inputArray.length) {
			var currentData = this._inputArray[this._currentPosition];
			console.log(currentData);
			this._currentPosition++;
			this._progressText.getProperty("text").setValue(this._currentPosition);
			
			if(this._wordCorrectionAliases.resolveAlias(currentData) !== null) {
				this._showNextData();
				return;
			}
			this._addBrandedIngredientField.setText(currentData);
			
			var bestGuess = this._wordCorrectionAliases.getClosestValue(currentData);
			this._addBrandedParentIngredientField.setText(bestGuess);
			this._callback_addBrandedParentIngredientChanged();
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new IngredientHierarchy()).init();
	};
});