/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.work.ar.PriceInjection", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	var PriceInjection = dbm.importClass("dbm.projects.tools.work.ar.PriceInjection");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var CsvParser = dbm.importClass("dbm.utils.file.formats.csv.CsvParser");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var StringFunctions = dbm.importClass("dbm.utils.native.string.StringFunctions");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var ArraySortingFunctions = dbm.importClass("dbm.utils.native.array.ArraySortingFunctions");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.projects.tools.work.ar.PriceInjection::_init");
		
		this.superCall();
		
		this._csvDataPath = "../assets/tools/work/ar/priceInjection/databaseData.csv";
		this._csvData2Path = "../assets/tools/work/ar/priceInjection/prices_131203.csv";
		
		return this;
	};
	
	objectFunctions._setup = function() {
		console.log("dbm.projects.tools.work.ar.PriceInjection::_setup");
		
		this.addCssLink("../styles/utils/display.css");
		
		this._assetsLoader.addAssetsByPath(this._csvDataPath, this._csvData2Path);
	};
	
	objectFunctions._assetsLoaded = function() {
		console.log("dbm.projects.tools.work.ar.PriceInjection::_assetsLoaded");
		this._createPage();
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tools.work.ar.PriceInjection::_createPage");
		
		var csvData = dbm.singletons.dbmAssetRepository.getAssetData(this._csvDataPath);
		var parser = CsvParser.create(csvData);
		parser.parse();
		
		var productNumberIndex = parser.findColumnByValue(0, "product_number");
		
		var productNameIndex = parser.findColumnByValue(0, "average_price_product");
		
		var averagePriceIndex = parser.findColumnByValue(0, "average_price");
		var averagePriceAmountIndex = parser.findColumnByValue(0, "average_price_amount");
		var averagePriceUnitIndex = parser.findColumnByValue(0, "average_price_unit");
		var averagePriceStatusIndex = parser.findColumnByValue(0, "average_price_status");
		
		console.log(productNameIndex, averagePriceIndex, averagePriceAmountIndex, averagePriceUnitIndex, averagePriceStatusIndex);
		
		
		
		var csvData2 = dbm.singletons.dbmAssetRepository.getAssetData(this._csvData2Path);
		var parser2 = CsvParser.create(csvData2);
		parser2.parse();
		console.log(parser2);
		
		var currentArray = parser.getRows();
		var currentArrayLength = currentArray.length;
		for(var i = 1; i < currentArrayLength; i++) {
			
			var currentRow = currentArray[i];
			var currentProductNumber = currentRow[productNumberIndex].replace(new RegExp("^[0]+", "g"), ""); //MENOTE: remove leading zeros
			
			console.log(currentProductNumber, currentRow);
			
			if(currentProductNumber !== "") {
				var priceIndex = parser2.findRowByField(0, currentProductNumber, 1);
				console.log(priceIndex);
				if(priceIndex !== -1) {
					var priceRow = parser2.getRow(priceIndex);
					var newProductName = priceRow[1];
					var newPrice = priceRow[5];
					var newPriceAmount = priceRow[3];
					var newPriceUnit = this._getUnit(priceRow[4]);
					
					if(true) {
						currentRow[productNameIndex] = newProductName;
						currentRow[averagePriceIndex] = newPrice;
						currentRow[averagePriceAmountIndex] = newPriceAmount;
						currentRow[averagePriceUnitIndex] = newPriceUnit;
						currentRow[averagePriceStatusIndex] = "updated";
					}
					else {
						currentRow[averagePriceStatusIndex] = "already done";
					}
				}
				else {
					currentRow[averagePriceStatusIndex] = "product not found";
				}
			}
			else {
				currentRow[averagePriceStatusIndex] = "no product number";
			}
			
		}
		
		console.log(parser);
		console.log(parser.encode());
		
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
		return (new PriceInjection()).init();
	};
});