dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.AssetRepository", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository");
	//"use strict";
	
	var AssetRepository = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.AssetRepository");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var ImageAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.ImageAsset");
	var XmlAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlAsset");
	var TextAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.TextAsset");
	var AudioAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.AudioAsset");
	var VideoAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.VideoAsset");
	var ArrayBufferAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.ArrayBufferAsset");
	var XmlIdElementAsset = dbm.importClass("com.developedbyme.core.globalobjects.assetrepository.assets.XmlIdElementAsset");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	var MimeTypeFunctions = dbm.importClass("com.developedbyme.utils.file.MimeTypeFunctions");
	var FeatureCheck = dbm.importClass("com.developedbyme.utils.browser.FeatureCheck");
	
	dbm.setClassAsSingleton("dbmAssetRepository");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::_init");
		
		this.superCall();
		
		this._hierarchy = TreeStructure.create();
		this._rootNode = this._hierarchy.getRoot();
		
		this.selectedVideoExtension = "[unknown]";
		this.selectedAudioExtension = "[unknown]";
		
		this._pseudoVideoExtension = "[video]";
		this._pseudoAudioExtension = "[audio]";
		
		return this;
	};
	
	objectFunctions.setupDefaultExtensions = function() {
		this.selectedVideoExtension = MimeTypeFunctions.getFileExtensionForMimeType(FeatureCheck.getSupportedVideoFormat());
		this.selectedAudioExtension = MimeTypeFunctions.getFileExtensionForMimeType(FeatureCheck.getSupportedAudioFormat());
	};
	
	objectFunctions.setRoot = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::setRoot");
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::getRootPath");
		
		return this._rootNode.getPath();
	};
	
	objectFunctions.linkFolderToServer = function(aPath, aServerPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::linkFolderToServer");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		currentItem.setAttribute("absolutePath", aServerPath);
	};
	
	objectFunctions._createAssetForTreeStructure = function(aTreeStructureItem) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::_createAssetForTreeStructure");
		
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
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::getAsset");
		//console.log(aPath);
		
		var hashIndex = aPath.indexOf("#");
		var hashString = null;
		if(hashIndex >= 0) {
			hashString = aPath.substring(hashIndex+1, aPath.length);
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
			
			hashItem.data = XmlIdElementAsset.create(hashString, currentItem.data);
			hashItem.retain();
			
			currentItem = hashItem;
		}
		
		//this._hierarchy.debugTraceStructure();
		
		return currentItem.data;
	};
	
	objectFunctions.getAssetData = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::getAssetData");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		if(currentItem.data === null) {
			this._createAssetForTreeStructure(currentItem);
		}
		
		return currentItem.data.getData();
	};
	
	objectFunctions.addAsset = function(aPath, aAsset) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::addAsset");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		if(currentItem.data !== null) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "addAsset", "Asset " + aPath + " already exists, replacing.");
		}
		
		currentItem.data = aAsset;
		aAsset.retain();
	};
	
	objectFunctions.hasAsset = function(aPath, aAsset) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::hasAsset");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		return (currentItem.data !== null);
	};
	
	objectFunctions.createFileAsset = function(aPath, aFilePath, aType) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::createFileAsset");
		
		//METODO
	};
	
	objectFunctions.getVideoPath = function(aPath) {
		return aPath + "." + this.selectedVideoExtension;
	};
	
	objectFunctions.getAudioPath = function(aPath) {
		return aPath + "." + this.selectedAudioExtension;
	};
	
	objectFunctions._createAsset = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::_createAsset");
		
		var newAsset = null;
		var fileExtension = PathFunctions.getFileExtension(aPath);
		switch(fileExtension) {
			case "jpg":
			case "jpeg":
			case "gif":
			case "png":
			case "webp":
				newAsset = ImageAsset.create(aPath);
				break;
			case "html":
			case "xml":
			case "xsl":
				newAsset = XmlAsset.create(aPath);
				break;
			case "text":
			case "txt":
			case "vert":
			case "frag":
				newAsset = TextAsset.create(aPath);
				break;
			case "mp3":
			case "oga":
				newAsset = AudioAsset.create(aPath);
				break;
			case "mp4":
			case "ogv":
			case "webm":
				newAsset = VideoAsset.create(aPath);
				break;
			case "wav":
			case "bin":
			case "mid": //METODO: this needs to be registered instead a case
				newAsset = ArrayBufferAsset.create(aPath);
				break;
			case this._pseudoVideoExtension:
				newAsset = VideoAsset.create(this.getVideoPath(aPath.substring(0, aPath.length-this._pseudoVideoExtension.length-1)));
				break;
			case this._pseudoAudioExtension:
				newAsset = AudioAsset.create(this.getAudioPath(aPath.substring(0, aPath.length-this._pseudoAudioExtension.length-1)));
				break;
			default:
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_createAsset", "Unknown file extension " + fileExtension + ".");
				break;
		}
		
		return newAsset;
	};
});