/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.bookmarklet.InjectDescriptions", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var InjectDescriptions = dbm.importClass("dbm.projects.tools.work.ar.bookmarklet.InjectDescriptions");
	
	//Error report
	
	//Dependencies
	var IframeElement = dbm.importClass("dbm.gui.other.IframeElement");
	
	//Utils
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.bookmarklet.InjectDescriptions::_init");
		
		this.superCall();
		
		this._descriptionsCsvPath = "remotes/localhost/tests/dbm/assets/tools/work/ar/bookmarklet/injectDescriptions/recipes19.csv";
		this._titleCorrectionsCsvPath = "remotes/localhost/tests/dbm/assets/tools/work/ar/bookmarklet/injectDescriptions/titleCorrections.csv";
		
		this._descriptionsCsv = null;
		this._titleCorrectionsCsv = null;
		
		this._currentIframe = null;
		this._recipeLoadedCommand = CallFunctionCommand.createCommand(this, this._recipeLoaded, []).retain();
		this._recipeUpdatedCommand = CallFunctionCommand.createCommand(this, this._recipeUpdated, []).retain();
		
		this._currentIndex = 0;
		this._maxIndex = 1242;
		
		this._assetsLoader.addAssetsByPath(this._descriptionsCsvPath, this._titleCorrectionsCsvPath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.bookmarklet.InjectDescriptions::_createPage");
		
		var descriptionsCsvData = dbm.singletons.dbmAssetRepository.getAssetData(this._descriptionsCsvPath);
		this._descriptionsCsv = CsvParser.create(descriptionsCsvData);
		this._descriptionsCsv.parse();
		
		console.log(this._descriptionsCsv);
		
		var titleCorrectionsCsvData = dbm.singletons.dbmAssetRepository.getAssetData(this._titleCorrectionsCsvPath);
		this._titleCorrectionsCsv = CsvParser.create(titleCorrectionsCsvData);
		this._titleCorrectionsCsv.parse();
		
		console.log(this._titleCorrectionsCsv);
		
		/*
		var testData = CsvParser.create(dbm.singletons.dbmAssetRepository.getAssetData("remotes/localhost/tests/dbm/assets/tests/csvParser/example.csv"));
		testData.parse();
		var currentArray = testData._rows;
		var currentArrayLength = currentArray.length;
		for(var i = 2; i < currentArrayLength; i++) {
			var currentTitle = currentArray[i][1];
			var currentDescrption = this._getDescriptionForTitle(currentTitle);
			if(currentDescrption === null) {
				console.log(currentTitle, ">>>", currentDescrption);
			}
		}
		*/
		
		this._loadNextIframe();
	};
	
	objectFunctions._recipeLoaded = function() {
		//console.log("dbm.projects.tools.work.ar.bookmarklet.InjectDescriptions::_recipeLoaded");
		
		this._currentIframe.getExtendedEvent().removeCommandFromEvent(LoadingExtendedEventIds.LOADED, this._recipeLoadedCommand);
		
		var shouldSubmit = false;
		var recipeDocument = this._currentIframe.getElement().contentDocument;
		var titleField = recipeDocument.querySelector("form.deform input[name=name]");
		if(titleField !== null) {
			var descriptionField = recipeDocument.querySelector("form.deform textarea[name=description]");
		
			var title = titleField.value;
			var currentDescription = descriptionField.innerHTML;
			
			if(title !== "") {
				if(currentDescription === "") {
					var newDescription = this._getDescriptionForTitle(title);
					if(newDescription !== null) {
						descriptionField.innerText = newDescription;
						shouldSubmit = true;
						console.log(this._currentIndex+";updated;"+title+";"+newDescription);
					}
					else {
						console.log(this._currentIndex+";nodescription;"+title+";");
					}
				}
				else {
					console.log(this._currentIndex+";alreadydone;"+title+";"+currentDescription);
				}
			}
		}
		else {
			console.log(this._currentIndex+";norecipe;");
		}
		
		if(shouldSubmit) {
			this._currentIframe.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, this._recipeUpdatedCommand);
			
			var theForm = recipeDocument.querySelector("form.deform");
			theForm.submit.click();
		}
		else {
			this._loadNextIframe();
		}
	};
	
	objectFunctions._recipeUpdated = function() {
		//console.log("dbm.projects.tools.work.ar.bookmarklet.InjectDescriptions::_recipeUpdated");
		
		this._currentIframe.getExtendedEvent().removeCommandFromEvent(LoadingExtendedEventIds.LOADED, this._recipeUpdatedCommand);
		
		this._loadNextIframe();
	};
	
	objectFunctions._removeCurrentIframe = function() {
		this._currentIframe.removeFromDom();
		this._currentIframe.destroy();
		this._currentIframe = null;
	};
	
	objectFunctions._loadNextIframe = function() {
		if(this._currentIframe !== null) {
			this._removeCurrentIframe();
		}
		
		this._currentIndex++;
		
		if(this._currentIndex < this._maxIndex) {
			var bookmarkletMainWindow = dbm.singletons.dbmWindowManager.getWindow("bookmarkletMain");
		
			this._currentIframe = IframeElement.create(bookmarkletMainWindow.getDocument(), true, "http://sainsbury-recipes-stage.appspot.com/admin/recipe/edit/" + this._currentIndex, {"style": "position: absolute; left: 0px; top: 0px; width: 800px; height: 500px;"});
			this._currentIframe.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, this._recipeLoadedCommand);
		}
	}
	
	objectFunctions._getDescriptionForTitle = function(aTitle) {
		var resultIndex = this._descriptionsCsv.findRowByField(0, aTitle, 1);
		if(resultIndex === -1) {
			var conversionIndex = this._titleCorrectionsCsv.findRowByField(0, aTitle, 1);
			if(conversionIndex !== -1) {
				var newTitle = this._titleCorrectionsCsv.getRow(conversionIndex)[1];
				resultIndex = this._descriptionsCsv.findRowByField(0, newTitle, 1);
			}
		}
		
		if(resultIndex === -1) {
			return null;
		}
		
		return this._descriptionsCsv.getRow(resultIndex)[1];
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new InjectDescriptions()).init();
	};
});