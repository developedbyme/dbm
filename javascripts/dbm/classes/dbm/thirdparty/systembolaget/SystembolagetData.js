/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.thirdparty.systembolaget.SystembolagetData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SystembolagetData = dbm.importClass("dbm.thirdparty.systembolaget.SystembolagetData");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var Point = dbm.importClass("dbm.core.data.points.Point");
	var LazyArray = dbm.importClass("dbm.utils.data.lazy.LazyArray");
	var LazyObject = dbm.importClass("dbm.utils.data.lazy.LazyObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var ParserGenerator = dbm.importClass("dbm.utils.data.lazy.ParserGenerator");
	var SwedishRt90Converter = dbm.importClass("dbm.utils.math.mapprojection.SwedishRt90Converter");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var VectorFunctions = dbm.importClass("dbm.utils.math.VectorFunctions");
	var ArrayComparison = dbm.importClass("dbm.utils.native.array.ArrayComparison");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var CallFunctionObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.CallFunctionObject");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.thirdparty.systembolaget.SystembolagetData::_init");
		
		this.superCall();
		
		this._parserStructure = ParserGenerator.createTreeStructure();
		var rootNode = this._parserStructure.getRoot();
		this._lazyData = LazyObject.create(null, rootNode);
		this._setupDefaultParsers();
		
		return this;
	};
	
	objectFunctions._setupDefaultParsers = function() {
		ParserGenerator.createArrayIndexedXmlDataNodes(this._parserStructure.getItemByPath("stores/__defaultParser"));
		ParserGenerator.createArrayIndexedXmlDataNodes(this._parserStructure.getItemByPath("products/__defaultParser"));
		
		ParserGenerator.createArrayIndexedXmlDataNodes(this._parserStructure.getItemByPath("storeProducts/__defaultParser"));
		ParserGenerator.createNamedAttribute(this._parserStructure.getItemByPath("storeProducts/__defaultParser/ButikNr"));
		ParserGenerator.createNodeList(this._parserStructure.getItemByPath("storeProducts/__defaultParser/products"), "ArtikelNr");
	};
	
	objectFunctions.setStoresData = function(aDataArray) {
		var treeStructureItem = this._parserStructure.getItemByPath("stores");
		this._lazyData.setParsedData("stores", LazyArray.create(aDataArray, treeStructureItem));
	};
	
	objectFunctions.setProductsData = function(aDataArray) {
		var treeStructureItem = this._parserStructure.getItemByPath("products");
		this._lazyData.setParsedData("products", LazyArray.create(aDataArray, treeStructureItem));
	};
	
	objectFunctions.setStoreProductsData = function(aDataArray) {
		var treeStructureItem = this._parserStructure.getItemByPath("storeProducts");
		
		this._lazyData.setParsedData("storeProducts", LazyArray.create(aDataArray, treeStructureItem));
	};
	
	objectFunctions.getClosestStore = function(aLatitude, aLongitude) {
		console.log("dbm.thirdparty.systembolaget.SystembolagetData::getClosestStore");
		
		var inputPoint = Point.create(aLatitude, aLongitude);
		var returnPoint = Point.create();
		
		SwedishRt90Converter.convertLatLongToRt90(inputPoint, returnPoint);
		
		var currentX = returnPoint.x;
		var currentY = returnPoint.y;
		var closestDistance = -1;
		var closestData = null;
		
		var storeData = this._lazyData.getLazy("stores");
		
		var currentArrayLength = storeData.getLength();
		console.log(storeData, currentArrayLength);
		for(var i = 0; i < currentArrayLength; i++) {
			var currentDataObject = storeData.getByIndex(i);
			
			var x = 1*currentDataObject.getData("RT90x");
			var y = 1*currentDataObject.getData("RT90y");
			var currentDistance = VectorFunctions.lengthFromVectorValues2d(currentX-x, currentY-y);
			if(currentDistance < closestDistance || closestDistance === -1) {
				closestDistance = currentDistance;
				closestData = currentDataObject;
			}
		}
		
		return closestData.getData("Nr");
	};
	
	objectFunctions.getFullProductNumbers = function(aShortProductNumber, aReturnArray) {
		
		var productsData = this._lazyData.getLazy("products");
		var currentArrayLength = productsData.getLength();
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentDataObject = productsData.getByIndex(i);
			var currentShortProductNumber = currentDataObject.getData("Varnummer");
			if(currentShortProductNumber === aShortProductNumber) {
				aReturnArray.push(currentDataObject.getData("nr"));
			}
		}
	};
	
	objectFunctions.getStoreProducts = function(aStoreId) {
		
		var productsData = this._lazyData.getLazy("storeProducts");
		var currentArrayLength = productsData.getLength();
		
		for(var i = 0; i < currentArrayLength; i++) {
			var currentDataObject = productsData.getByIndex(i);
			var currentStoreId = currentDataObject.getData("ButikNr");
			if(aStoreId === currentStoreId) {
				var returnValue = currentDataObject.getData("products");
				return returnValue;
			}
		}
		
		//METODO: error message
		return null;
	};
	
	objectFunctions.getStoreData = function(aId) {
		
		var storeData = this._lazyData.getLazy("stores");
		
		var currentArrayLength = storeData.getLength();
		for(var i = 0; i < currentArrayLength; i++) {
			var currentDataObject = storeData.getByIndex(i);
		
			if(currentDataObject.getData("Nr") === aId) {
				return currentDataObject;
			}
		}
		
		//METODO: error message
		return null;
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		
		var newSystembolagetData = (new ClassReference()).init();
		
		return newSystembolagetData;
	};
	
	staticFunctions.createFromAssets = function(aStoresAsset, aProductsAsset, aStoreProductsAsset) {
		console.log("dbm.thirdparty.systembolaget.SystembolagetData::createFromAssets");
		console.log(aStoresAsset, aProductsAsset, aStoreProductsAsset);
		
		var newSystembolagetData = (new ClassReference()).init();
		
		newSystembolagetData.setStoresData(XmlChildRetreiver.getChilds(aStoresAsset.getData().firstChild, "ButikOmbud"));
		newSystembolagetData.setProductsData(XmlChildRetreiver.getChilds(aProductsAsset.getData().firstChild, "artikel"));
		newSystembolagetData.setStoreProductsData(XmlChildRetreiver.getChilds(aStoreProductsAsset.getData().firstChild, "Butik"));
		
		return newSystembolagetData;
	};
	
	staticFunctions.createFromUnloadedAssets = function(aStoresAsset, aProductsAsset, aStoreProductsAsset) {
		//console.log("dbm.thirdparty.systembolaget.SystembolagetData::createFromUnloadedAssets");
		//console.log(aStoresAsset, aProductsAsset, aStoreProductsAsset);
		
		var newSystembolagetData = (new ClassReference()).init();
		
		aStoresAsset.runCommandWhenLoaded(
			CallFunctionCommand.createCommand(
				newSystembolagetData,
				newSystembolagetData.setStoresData,
				[CallFunctionObject.createCommand(
					XmlChildRetreiver,
					XmlChildRetreiver.getChilds,
					[GetVariableObject.createCommand(CallFunctionObject.createCommand(aStoresAsset, aStoresAsset.getData, []), "firstChild"), "ButikOmbud"]
				)]
			)
		);
		
		aProductsAsset.runCommandWhenLoaded(
			CallFunctionCommand.createCommand(
				newSystembolagetData,
				newSystembolagetData.setProductsData,
				[CallFunctionObject.createCommand(
					XmlChildRetreiver,
					XmlChildRetreiver.getChilds,
					[GetVariableObject.createCommand(CallFunctionObject.createCommand(aProductsAsset, aStoresAsset.getData, []), "firstChild"), "artikel"]
				)]
			)
		);
		
		aStoreProductsAsset.runCommandWhenLoaded(
			CallFunctionCommand.createCommand(
				newSystembolagetData,
				newSystembolagetData.setStoreProductsData,
				[CallFunctionObject.createCommand(
					XmlChildRetreiver,
					XmlChildRetreiver.getChilds,
					[GetVariableObject.createCommand(CallFunctionObject.createCommand(aStoreProductsAsset, aStoresAsset.getData, []), "firstChild"), "Butik"]
				)]
			)
		);
		
		return newSystembolagetData;
	};
});