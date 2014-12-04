/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.PriceInjectionDatabase", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var PriceInjectionDatabase = dbm.importClass("dbm.projects.tools.work.ar.PriceInjectionDatabase");
	
	//Error report
	
	//Dependencies
	var FileInputField = dbm.importClass("dbm.gui.form.FileInputField");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var LoadingSequence = dbm.importClass("dbm.core.globalobjects.assetrepository.loaders.LoadingSequence");
	var FileReaderAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.FileReaderAsset");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ArraySortingFunctions = dbm.importClass("dbm.utils.native.array.ArraySortingFunctions");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var IsoDate = dbm.importClass("dbm.utils.native.date.IsoDate");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.PriceInjectionDatabase::_init");
		
		this.superCall();
		
		this._dataInputField = null;
		this._priceInputField = null;
		this._runButton = null;
		
		//this._csvDataPath = "../assets/tools/work/ar/priceInjection/databaseData_live_20140410.csv";
		//this._csvData2Path = "../assets/tools/work/ar/priceInjection/prices_20140413.csv";
		
		this.addCssLink("../styles/utils/display.css");
		
		//this._assetsLoader.addAssetsByPath(this._csvDataPath, this._csvData2Path);
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.PriceInjectionDatabase::_createPage");
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		var dataInputHolder = htmlCreator.createDiv(null, htmlCreator.createNode("label", {"for": "dataFile"}, "Database spreadsheet"));
		dbm.getDocument().body.appendChild(dataInputHolder);
		this._dataInputField = FileInputField.createOnParent(dataInputHolder, true, "file", {"name": "dataFile"}).activate();
		
		var priceInputHolder = htmlCreator.createDiv(null, htmlCreator.createNode("label", {"for": "priceFile"}, "Price spreadsheet"));
		dbm.getDocument().body.appendChild(priceInputHolder);
		this._priceInputField = FileInputField.createOnParent(priceInputHolder, true, "file", {"name": "priceFile"}).activate();
		
		this._runButton = BaseButton.createButton(dbm.getDocument().body, true, {}, "Run").activate();
		this._runButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._loadFiles, []));
	};
	
	objectFunctions._loadFiles = function() {
		console.log("dbm.projects.tools.work.ar.PriceInjectionDatabase::_loadFiles");
		
		var loader = LoadingSequence.create();
		
		var dataFile = this._dataInputField.getValue();
		var priceFile = this._priceInputField.getValue();
		
		if(dataFile !== null && priceFile !== null) {
			this._dataInputField.deactivate();
			this._priceInputField.deactivate();
			this._runButton.deactivate();
			
			var dataAsset = FileReaderAsset.create(dataFile, "text");
			loader.addAsset(dataAsset);
			
			var priceAsset = FileReaderAsset.create(priceFile, "text");
			loader.addAsset(priceAsset);
			
			loader.load();
			loader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, this._generateNewPrices, [dataAsset, priceAsset]));
		}
	};
	
	objectFunctions._generateNewPrices = function(aDataAsset, aPriceAsset) {
		console.log("dbm.projects.tools.work.ar.PriceInjectionDatabase::_generateNewPrices");
		
		var parser = CsvParser.create(aDataAsset.getData());
		parser.parse();
		
		var productNumberIndex = parser.findColumnByValue(0, "product_number");
		var productNameIndex = parser.findColumnByValue(0, "product_name");
		
		var averagePriceIndex = parser.findColumnByValue(0, "average_price");
		var averageQuantityIndex = parser.findColumnByValue(0, "average_quantity");
		
		var parser2 = CsvParser.create(aPriceAsset.getData());
		parser2.parse();
		
		var sourceProductNumberIndex = parser2.findColumnByValue(0, "JSPN");
		var sourceNameIndex = parser2.findColumnByValue(0, "SKU_DESC");
		var sourcePriceIndex = parser2.findColumnByValue(0, "js_price");
		var sourceAmountIndex = parser2.findColumnByValue(0, "CONVERTED_WEIGHT");
		var sourceUnitIndex = parser2.findColumnByValue(0, "STANDARD_UNIT");
		
		var noPriceItems = new Array();
		
		var currentArray = parser.getRows();
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i++) {
			
			var currentRow = currentArray[i];
			var currentProductNumber = StringFunctions.trim(currentRow[productNumberIndex]).replace(new RegExp("^[0]+", "g"), ""); //MENOTE: remove leading zeros
			
			console.log(currentProductNumber, currentRow);
			
			if(currentProductNumber !== "") {
				var priceIndex = parser2.findRowByField(sourceProductNumberIndex, currentProductNumber, 1);
				console.log(priceIndex);
				if(priceIndex !== -1) {
					var priceRow = parser2.getRow(priceIndex);
					var newProductName = priceRow[sourceNameIndex];
					var newPrice = priceRow[sourcePriceIndex];
					var newPriceAmount = priceRow[sourceAmountIndex];
					var newPriceUnit = this._getUnit(priceRow[sourceUnitIndex]);
					
					var pricePerGram = newPrice/newPriceAmount;
					if(currentRow[averageQuantityIndex] === 0) {
						pricePerGram = 0;
					}
					else {
						if(newPriceUnit !== "pieces") {
							pricePerGram *= currentRow[averageQuantityIndex];
						}
					}
					console.log("+++", currentProductNumber, newProductName, newPriceUnit, pricePerGram);
					
					currentRow[averagePriceIndex] = pricePerGram.toString();
					currentRow[productNameIndex] = newProductName;
				}
				else {
					noPriceItems.push(currentProductNumber);
				}
			}
		}
		
		console.log(parser);
		console.log(parser2);
		
		var encodedData = parser.encode();
		
		console.log(encodedData);
		console.log("No product data: " + noPriceItems.join(", "));
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getMasterHtmlCreator();
		
		var dataLink = htmlCreator.createNode("a", {"href": "data:text/csv;charset=UTF-8," + encodeURIComponent(encodedData), "download": "databaseData_" + IsoDate.getCompactIsoDateAndTime(new Date()) + ".csv"}, "Download new spreadsheet");
		dbm.getDocument().body.appendChild(dataLink);
	};
	
	objectFunctions._getUnit = function(aPriceUnit) {
		if(aPriceUnit === "EA") {
			return "pieces"; 
		}
		return aPriceUnit.toLowerCase(); //MEDEBUG
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		return (new PriceInjectionDatabase()).init();
	};
});