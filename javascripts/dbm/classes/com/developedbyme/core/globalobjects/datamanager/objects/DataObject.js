dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.objects.DataObject", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.objects.DataObject");
	
	var DataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.DataObject");
	
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.objects.DataObject::_init");
		
		this.superCall();
		
		this._hierarchyItem = null;
		this._data = this.createProperty("data", null);
		this._definitionFilePath = null;
		this._definitionFileType = null;
		this._definitionXml = null;
		this._nodes = ArrayHolder.create(true);
		this.addDestroyableObject(this._nodes);
		
		return this;
	};
	
	objectFunctions.getData = function() {
		return this._data.getValue();
	};
	
	objectFunctions.setHierarchyItem = function(aItem) {
		this._hierarchyItem = aItem;
	};
	
	objectFunctions.getHierarchyItem = function() {
		return this._hierarchyItem;
	};
	
	objectFunctions.setDefinitionFile = function(aPath, aType) {
		this._definitionFilePath = aPath;
		this._definitionFileType = aType;
		this._hierarchyItem.setAttribute("filesRelativeTo", aPath);
	};
	
	objectFunctions.setDefinitionXml = function(aXml) {
		this._definitionXml = aXml;
	};
	
	objectFunctions.getDefinitionXml = function() {
		if(this._definitionXml == null && this._definitionFilePath != null) {
			switch(this._definitionFileType) {
				case "dbmData":
					var currentAsset = dbm.singletons.dbmAssetRepository.getAsset(this._definitionFilePath);
					if(currentAsset.getStatus() != AssetStatusTypes.LOADED) {
						currentAsset.useAsync = false;
						currentAsset.load();
						this.setDefinitionXml(XmlChildRetreiver.getFirstChild(currentAsset.getData()));
					}
					dbm.singletons.dbmDataManager.parseLinks(this);
					break;
				case "json":
				case "dictionaryXml":
				case "xml":
					//METODO
					break;
			}
		}
		return this._definitionXml;
	};
	
	objectFunctions.addNode = function(aNode) {
		this._nodes.array.push(aNode);
	};
	
	/**
	 * Gets the parameters for this class. Part of the toString function.
	 */
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		if(this._data != null) {
			aReturnArray.push("data: " + this._data.getValue());
		}
		if(this._definitionFilePath != null) {
			aReturnArray.push("definitionFilePath: " + this._definitionFilePath);
			aReturnArray.push("definitionFileType: " + this._definitionFileType);
		}
	}
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._hierarchyItem = null;
		this._data = null;
		this._definitionXml = null;
		this._nodes = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newDataObject = (new ClassReference()).init();
		return newDataObject;
	};
});