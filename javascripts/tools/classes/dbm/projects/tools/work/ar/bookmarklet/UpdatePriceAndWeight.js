/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.bookmarklet.UpdatePriceAndWeight", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var UpdatePriceAndWeight = dbm.importClass("dbm.projects.tools.work.ar.bookmarklet.UpdatePriceAndWeight");
	
	//Error report
	
	//Dependencies
	var IframeElement = dbm.importClass("dbm.gui.other.IframeElement");
	
	//Utils
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.bookmarklet.UpdatePriceAndWeight::_init");
		
		this.superCall();
		
		this._dataCsvPath = "remotes/localhost/tests/dbm/assets/tools/work/ar/bookmarklet/updatePriceAndWeight/data_20140530.csv";
		
		this._dataCsv = null;
		
		this._currentIframe = null;
		this._pageLoadedCommand = CallFunctionCommand.createCommand(this, this._pageLoaded, []).retain();
		this._pageUpdatedCommand = CallFunctionCommand.createCommand(this, this._pageUpdated, []).retain();
		
		this._currentIndex = 0;
		this._currentId = -1;
		this._numberOfRows = 0;
		
		this._assetsLoader.addAssetsByPath(this._dataCsvPath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.bookmarklet.UpdatePriceAndWeight::_createPage");
		
		this._dataCsv = CsvParser.create(dbm.singletons.dbmAssetRepository.getAssetData(this._dataCsvPath));
		this._dataCsv.parse();
		
		this._numberOfRows = this._dataCsv.getRows().length;
		
		this._loadNextIframe();
	};
	
	objectFunctions._pageLoaded = function() {
		//console.log("dbm.projects.tools.work.ar.bookmarklet.UpdatePriceAndWeight::_pageLoaded");
		
		this._currentIframe.getExtendedEvent().removeCommandFromEvent(LoadingExtendedEventIds.LOADED, this._pageLoadedCommand);
		
		var currentRow = this._dataCsv.getRow(this._currentIndex);
		var idIndex = this._dataCsv.findColumnByValue(0, "id");
		var quantityIndex = this._dataCsv.findColumnByValue(0, "average_quantity");
		var priceIndex = this._dataCsv.findColumnByValue(0, "average_price");
		var productNumberIndex = this._dataCsv.findColumnByValue(0, "product_number");
		
		var currentId = currentRow[idIndex];
		
		var shouldSubmit = false;
		var ingredientDocument = this._currentIframe.getElement().contentDocument;
		var quantityField = ingredientDocument.querySelector("form.deform input[name=average_quantity]");
		
		if(quantityField !== null) {
			var priceField = ingredientDocument.querySelector("form.deform input[name=average_price]");
			var productNumberField = ingredientDocument.querySelector("form.deform input[name=product_number]");
			
			if(parseFloat(quantityField.value) !== parseFloat(currentRow[quantityIndex])) {
				console.log(currentId + ";update quantity;" + quantityField.value +  ";" + currentRow[quantityIndex] + ";");
				quantityField.value = currentRow[quantityIndex];
				shouldSubmit = true;
			}
			
			if(currentRow[priceIndex] !== "") {
				var roundValue = 100000000;
				var newPrice = Math.round(roundValue*parseFloat(currentRow[priceIndex]))/roundValue;
				if(Math.abs(parseFloat(priceField.value)-newPrice) >= 10/roundValue) {
					console.log(currentId + ";update price;" + priceField.value +  ";" + newPrice + ";");
					priceField.value = newPrice;
					shouldSubmit = true;
				}
			}
			
			if(StringFunctions.trim(productNumberField.value) !== StringFunctions.trim(currentRow[productNumberIndex])) {
				console.log(currentId + ";update product number;" + productNumberField.value +  ";" + currentRow[productNumberIndex] + ";");
				productNumberField.value = StringFunctions.trim(currentRow[productNumberIndex]);
				shouldSubmit = true;
			}
			
			if(!shouldSubmit) {
				console.log(currentId+";no change;;;");
			}
		}
		else {
			console.log(currentId+";no ingredient;;;");
		}
		
		if(shouldSubmit) {
			this._currentIframe.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, this._pageUpdatedCommand);
			
			var theForm = ingredientDocument.querySelector("form.deform");
			theForm.submit.click();
			
		}
		else {
			this._loadNextIframe();
		}
	};
	
	objectFunctions._pageUpdated = function() {
		//console.log("dbm.projects.tools.work.ar.bookmarklet.UpdatePriceAndWeight::_pageUpdated");
		
		this._currentIframe.getExtendedEvent().removeCommandFromEvent(LoadingExtendedEventIds.LOADED, this._pageUpdatedCommand);
		
		var thisPointer = this;
		setTimeout(function() {
			thisPointer._loadNextIframe();
		}, 3000);
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
		
		if(this._currentIndex < this._numberOfRows) {
			
			var currentRow = this._dataCsv.getRow(this._currentIndex);
			var idIndex = this._dataCsv.findColumnByValue(0, "id");
			var currentId = currentRow[idIndex];
			
			var bookmarkletMainWindow = dbm.singletons.dbmWindowManager.getWindow("bookmarkletMain");
		
			this._currentIframe = IframeElement.create(bookmarkletMainWindow.getDocument(), true, "http://sainsbury-recipes-live.appspot.com/admin/ingredients/edit/" + currentId, {"style": "position: absolute; left: 0px; top: 0px; width: 800px; height: 500px;"});
			this._currentIframe.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, this._pageLoadedCommand);
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new UpdatePriceAndWeight()).init();
	};
});