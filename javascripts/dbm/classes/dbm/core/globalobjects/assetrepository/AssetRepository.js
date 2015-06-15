/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.assetrepository.AssetRepository", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.assetrepository.AssetRepository");
	//"use strict";
	
	//Self reference
	var AssetRepository = dbm.importClass("dbm.core.globalobjects.assetrepository.AssetRepository");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItemLink");
	var ImageAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.ImageAsset");
	var XmlAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.XmlAsset");
	var TextAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.TextAsset");
	var JsonAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.JsonAsset");
	var AudioAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.AudioAsset");
	var VideoAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.VideoAsset");
	var ArrayBufferAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	var XmlIdElementAsset = dbm.importClass("dbm.core.globalobjects.assetrepository.assets.XmlIdElementAsset");
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	
	//Utils
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("dbm.utils.file.PathFunctions");
	var MimeTypeFunctions = dbm.importClass("dbm.utils.file.MimeTypeFunctions");
	var FeatureCheck = dbm.importClass("dbm.utils.browser.FeatureCheck");
	
	//Constants
	
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::_init");
		
		this.superCall();
		
		this._hierarchy = TreeStructure.create();
		this._rootNode = this._hierarchy.getRoot();
		
		this.selectedVideoExtension = "[unknown]";
		this.selectedAudioExtension = "[unknown]";
		
		this._assetCreators = NamedArray.create(true);
		
		return this;
	};
	
	objectFunctions.setupDefaultExtensions = function() {
		this.selectedVideoExtension = MimeTypeFunctions.getFileExtensionForMimeType(FeatureCheck.getSupportedVideoFormat());
		this.selectedAudioExtension = MimeTypeFunctions.getFileExtensionForMimeType(FeatureCheck.getSupportedAudioFormat());
	};
	
	objectFunctions.setRoot = function(aPath) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::setRoot");
		//console.log(aPath);
		
		if(aPath === "") {
			this._rootNode = this._hierarchy.getRoot();
		}
		else {
			this._rootNode = this._hierarchy.getItemByPath(aPath, this._rootNode);
		}
		
		//this._hierarchy.debugTraceStructure();
	};
	
	objectFunctions.getRootPath = function(aPath) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::getRootPath");
		
		return this._rootNode.getPath();
	};
	
	objectFunctions.getAbsoultePath = function(aPath) {
		//METODO: fix this function
		var rootPath = this.getRootPath();
		return rootPath + "/" + aPath;
	};
	
	objectFunctions.linkFolderToServer = function(aPath, aServerPath) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::linkFolderToServer");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		currentItem.setAttribute("absolutePath", aServerPath);
	};
	
	objectFunctions.addAssetCreatorForTypes = function(aCreator, aTypes) {
		var currentArray = aTypes;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			this._assetCreators.addObject(currentArray[i], aCreator);
		}
	};
	
	objectFunctions._createAssetForTreeStructure = function(aTreeStructureItem) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::_createAssetForTreeStructure");
		
		var currentItem = aTreeStructureItem;
		var returnArray = new Array();
		while(currentItem !== null) {
			if(currentItem.hasAttribute("absolutePath")) {
				returnArray.unshift(currentItem.getAttribute("absolutePath"));
				break;
			}
			returnArray.unshift(currentItem.getName());
			currentItem = currentItem.getParent();
		}
		var currentPath = returnArray.join("/");
		
		aTreeStructureItem.data = this._createAsset(currentPath);
		aTreeStructureItem.retain();
	};
	
	objectFunctions.getAsset = function(aPath) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::getAsset");
		//console.log(aPath);
		
		var hashIndex = aPath.indexOf("#");
		var hashString = null;
		if(hashIndex >= 0) {
			hashString = aPath.substring(hashIndex, aPath.length);
			aPath = aPath.substring(0, hashIndex);
		}
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		if(currentItem.data === null) {
			//console.log("new", currentItem.getPath());
			this._createAssetForTreeStructure(currentItem);
		}
		
		if(hashIndex >= 0) {
			//console.log(aPath, hashString);
			//console.log(currentItem.data, currentItem.data instanceof XmlAsset);
			if(!(currentItem.data instanceof XmlAsset)) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "getAsset", "Asset " + aPath + " is not an xml, can't get hash " + hashString + ".");
				return null;
			}
			var hashItem = this._hierarchy.getItemByPath(hashString, currentItem);
			
			hashItem.data = XmlIdElementAsset.create(hashString.substring(1, hashString.length), currentItem.data);
			hashItem.retain();
			
			currentItem = hashItem;
		}
		
		//this._hierarchy.debugTraceStructure();
		
		return currentItem.data;
	};
	
	objectFunctions.getAssetData = function(aPath) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::getAssetData");
		return this.getAsset(aPath).getData();
	};
	
	objectFunctions.addAsset = function(aPath, aAsset) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::addAsset");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		if(currentItem.data !== null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addAsset", "Asset " + aPath + " already exists, replacing.");
		}
		
		currentItem.data = aAsset;
		aAsset.retain();
	};
	
	objectFunctions.hasAsset = function(aPath, aAsset) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::hasAsset");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		return (currentItem.data !== null);
	};
	
	objectFunctions.createFileAsset = function(aPath, aFilePath, aType) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::createFileAsset");
		
		var newAsset = this._createAssetOfType(aFilePath, aType);
		this.addAsset(aPath, newAsset);
		return newAsset;
	};
	
	objectFunctions.getVideoPath = function(aPath) {
		return aPath + "." + this.selectedVideoExtension;
	};
	
	objectFunctions.getAudioPath = function(aPath) {
		return aPath + "." + this.selectedAudioExtension;
	};
	
	objectFunctions._createAsset = function(aPath) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::_createAsset");
		
		return this._createAssetOfType(aPath, PathFunctions.getFileExtension(aPath));
	};
	
	objectFunctions._createAssetOfType = function(aPath, aType) {
		//console.log("dbm.core.globalobjects.assetrepository.AssetRepository::_createAssetOfType");
		
		if(this._assetCreators.select(aType)) {
			return this._assetCreators.currentSelectedItem.createAsset(aPath, aType);
		}
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_createAssetOfType", "Type " + aType + " is not registered. Can't create.");
		return null;
	};
});