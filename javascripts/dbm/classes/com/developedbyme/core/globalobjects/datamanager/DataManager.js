dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.DataManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager");
	
	var DataManager = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.DataManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var DataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.DataObject");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	var GenericExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.GenericExtendedEventIds");
	
	dbm.setClassAsSingleton("dbmDataManager");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::init");
		
		this.superCall();
		
		this._hierarchy = TreeStructure.create();
		this._rootNode = this._hierarchy.getRoot();
		this._parsers = NamedArray.create(true);
		
		this._rootNode.data = DataObject.create();
		
		this._hierarchy.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._setupItem, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setRoot = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::setRoot");
		
		if(aPath == "") {
			this._rootNode = this._hierarchy.getRoot();
		}
		else {
			this._rootNode = this._hierarchy.getItemByPath(aPath, this._rootNode);
		}
		
		//this._hierarchy.debugTraceStructure();
	};
	
	objectFunctions.getRootPath = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::getRootPath");
		
		return this._rootNode.getPath();
	};
	
	objectFunctions.addDefinitionFile = function(aFilePath, aFileType, aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		currentItem.data.setDefinitionFile(aFilePath, aFileType);
	}
	
	objectFunctions.addXmlDefinition = function(aXml, aPath) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::addXmlDefinition");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		currentItem.data.setDefinitionXml(aXml);
		this.parseLinks(currentItem.data);
	};
	
	objectFunctions.addParser = function(aName, aParser) {
		this._parsers.addObject(aName, aParser);
	};
	
	objectFunctions._setupItem = function(aTreeStructureItem) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::_setupItem");
		
		var newDataObject = this._createDataObject(aTreeStructureItem);
		
		var parentData = aTreeStructureItem.getParent().data;
		var parentDefinitionXml = parentData.getDefinitionXml();
		if(parentDefinitionXml != null) {
			var dataNamespace = dbm.xmlNamespaces.dbmData;
			var currentChild = XmlChildRetreiver.getNamespacedChildByNamespacedAttribute(parentDefinitionXml, dataNamespace, "name", aTreeStructureItem.getName(), dataNamespace, "item");
			
			if(currentChild == null && aTreeStructureItem.getName() == "default") {
				currentChild = XmlChildRetreiver.getNamespacedChild(parentDefinitionXml, dataNamespace, "item");
			}
			if(currentChild == null && !isNaN(aTreeStructureItem.getName())) {
				//METODO: get the n:th child
			}
			
			if(currentChild != null) {
				newDataObject.setDefinitionXml(currentChild);
				this.parseLinks(newDataObject);
				this._parseDataObject(newDataObject);
			}
		}
		
		//console.log(newDataObject);
	};
	
	objectFunctions._createDataObject = function(aTreeStructureItem) {
		var newDataObject = DataObject.create();
		
		aTreeStructureItem.data = newDataObject;
		newDataObject.setHierarchyItem(aTreeStructureItem);
		
		return newDataObject;
	}
	
	objectFunctions._parseDataObject = function(aDataObject) {
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var definitionXml = aDataObject.getDefinitionXml();
		var dataType = XmlChildRetreiver.getNamespacedAttribute(definitionXml, dataNamespace, "type");
		
		if(!this._parsers.select(dataType)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_parseDataObject", "Unknown data type " + dataType);
			return;
		}
		var currentParser = this._parsers.currentSelectedItem;
		currentParser.parseObject(aDataObject);
	};
	
	objectFunctions.parseLinks = function(aDataObject) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::parseLinks");
		var parentPath = aDataObject.getHierarchyItem().getPath();
		var currentArray = XmlChildRetreiver.getChilds(aDataObject.getDefinitionXml());
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			var dataNamespace = dbm.xmlNamespaces.dbmData;
			if(currentChild.namespaceURI == dataNamespace) {
				var linkName = XmlChildRetreiver.getNamespacedAttribute(currentChild, dataNamespace, "name");
			 	switch(currentChild.localName) {
					case "link":
						var linkReference = XmlChildRetreiver.getNamespacedAttribute(currentChild, dataNamespace, "link");
						this._hierarchy.addItem(TreeStructureItemLink.create(linkName, linkReference), parentPath, aDataObject.getHierarchyItem());
						break;
					case "fileLink":
						var filePath = XmlChildRetreiver.getNamespacedAttribute(currentChild, dataNamespace, "filePath");
						var fileType = XmlChildRetreiver.getNamespacedAttribute(currentChild, dataNamespace, "fileType");
						var fileLinkItem = TreeStructureItem.create(linkName);
						this._createDataObject(fileLinkItem);
						fileLinkItem.data.setDefinitionFile(filePath, fileType);
						this._hierarchy.addItem(fileLinkItem, parentPath, aDataObject.getHierarchyItem());
						break;
					case "item":
						//MENOTE: do nothing
						break;
				}
			}
		}
	};
	
	objectFunctions.getData = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::getData");
		//console.log(aPath);
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		return currentItem.data.getData();
	};
	
	objectFunctions.getDataProperty = function(aPath) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::getAssetData");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		if(currentItem.data == null) {
			this._createAssetForTreeStructure(currentItem);
		}
		
		return currentItem.data.getProperty("data");
	};
	
	objectFunctions.getNodeValue = function(aXml) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::getNodeValue");
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var returnValue = XmlChildRetreiver.getNamespacedAttribute(aXml, dataNamespace, "nodeValue");
		if(returnValue != null) {
			return returnValue;
		}
		
		if(XmlChildRetreiver.hasSimpleContent(aXml)) {
			return XmlChildRetreiver.getNodeValue(aXml);
		}
		
		return XmlChildRetreiver.getNodeValue(XmlChildRetreiver.getNamespacedChild(aXml, dataNamespace, "nodeValue"));
	};
	
	objectFunctions.getAttribute = function(aXml, aNamespace, aAttribute) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::getAttribute");
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var returnValue = XmlChildRetreiver.getNamespacedAttribute(aXml, aNamespace, aAttribute);
		if(returnValue != null) {
			return returnValue;
		}
		
		return XmlChildRetreiver.getNodeValue(XmlChildRetreiver.getNamespacedChild(aXml, aNamespace, aAttribute));
	};
	
	objectFunctions.getFirstChild = function(aXml) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.DataManager::getFirstChild");
		
		//METODO
	};
	
	objectFunctions.debugTraceStructure = function() {
		this._hierarchy.debugTraceStructure(20);
	};
});