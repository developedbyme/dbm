/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.objects.DataObject", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.objects.DataObject");
	
	var DataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.DataObject");
	
	var ArrayHolder = dbm.importClass("dbm.utils.data.ArrayHolder");
	
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	var AssetStatusTypes = dbm.importClass("dbm.constants.status.AssetStatusTypes");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.objects.DataObject::_init");
		
		this.superCall();
		
		this.parentApplyType = null;
		this._hierarchyItem = null;
		this._data = this.createProperty("data", null);
		this._definitionFilePath = null;
		this._definitionFileType = null;
		this._definitionXml = null;
		this._nodes = ArrayHolder.create(true);
		this.addDestroyableObject(this._nodes);
		
		return this;
	};
	
	objectFunctions.setData = function(aData) {
		this._data.setValue(aData);
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
		if(this._definitionXml === null && this._definitionFilePath !== null) {
			switch(this._definitionFileType) {
				case "dbmData":
					var currentAsset = dbm.singletons.dbmAssetRepository.getAsset(this._definitionFilePath);
					if(currentAsset.getStatus() !== AssetStatusTypes.LOADED) {
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
		
		if(this._data !== null) {
			aReturnArray.push("data: " + this._data.getValue());
		}
		if(this._definitionFilePath !== null) {
			aReturnArray.push("definitionFilePath: " + this._definitionFilePath);
			aReturnArray.push("definitionFileType: " + this._definitionFileType);
		}
	};
	
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