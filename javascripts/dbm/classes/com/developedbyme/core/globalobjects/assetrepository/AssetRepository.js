dbm.registerClass("com.developedbyme.core.globalobjects.assetrepository.AssetRepository", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository");
	
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
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	dbm.setClassAsSingleton("dbmAssetRepository");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::init");
		
		this.superCall();
		
		this._hierarchy = TreeStructure.create();
		this._basePath = "../";
		
		return this;
	};
	
	objectFunctions.getAsset = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::getAsset");
		
		var currentItem = this._hierarchy.getItemByPath(aPath);
		
		if(currentItem.data == null) {
			currentItem.data = this._createAsset(currentItem.getPath());
			currentItem.retain();
		}
		
		return currentItem.data;
	};
	
	objectFunctions.getAssetData = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::getAssetData");
		
		var currentItem = this._hierarchy.getItemByPath(aPath);
		
		if(currentItem.data == null) {
			currentItem.data = this._createAsset(currentItem.getPath());
			currentItem.retain();
		}
		
		return currentItem.data.getData();
	};
	
	objectFunctions.addAsset = function(aPath, aAsset) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::addAsset");
		
		var currentItem = this._hierarchy.getItemByPath(aPath);
		
		if(currentItem.data != null) {
			//METODO: warning message
		}
		
		currentItem.data = aAsset;
		aAsset.retain();
	};
	
	objectFunctions.createFileAsset = function(aPath, aFilePath, aType) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::createFileAsset");
		
		//METODO
	};
	
	objectFunctions._createAsset = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.assetrepository.AssetRepository::_createAsset");
		
		var newAsset = null;
		switch(PathFunctions.getFileExtension(aPath)) {
			case "jpg":
			case "jpeg":
			case "gif":
			case "png":
				newAsset = ImageAsset.create(this._basePath + PathFunctions.removeInitialSlash(aPath));
				break;
			case "xml":
				//METODO:
				//break;
			default:
				//METODO: error message
				break;
		}
		
		return newAsset;
	};
	
});