/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.DataManager", "dbm.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.DataManager");
	
	//Self reference
	var DataManager = dbm.importClass("dbm.core.globalobjects.datamanager.DataManager");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("dbm.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("dbm.utils.data.treestructure.TreeStructureItemLink");
	var DataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.DataObject");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ArrayFunctions = dbm.importClass("dbm.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("dbm.utils.file.PathFunctions");
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	dbm.setClassAsSingleton("dbmDataManager");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::_init");
		
		this.superCall();
		
		this._hierarchy = TreeStructure.create();
		this._rootNode = this._hierarchy.getRoot();
		this._parsers = NamedArray.create(true);
		
		this._rootNode.data = DataObject.create();
		
		this._hierarchy.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.ITEM_CREATED, CallFunctionCommand.createCommand(this, this._setupItem, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions.setRoot = function(aPath) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::setRoot");
		
		if(aPath === "") {
			this._rootNode = this._hierarchy.getRoot();
		}
		else {
			this._rootNode = this._hierarchy.getItemByPath(aPath, this._rootNode);
		}
		
		//this._hierarchy.debugTraceStructure();
	};
	
	objectFunctions.getRootPath = function(aPath) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::getRootPath");
		
		return this._rootNode.getPath();
	};
	
	objectFunctions.addDefinitionFile = function(aFilePath, aFileType, aPath) {
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		currentItem.data.setDefinitionFile(aFilePath, aFileType);
	};
	
	objectFunctions.addXmlDefinition = function(aXml, aPath) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::addXmlDefinition");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		currentItem.data.setDefinitionXml(aXml);
		this.parseLinks(currentItem.data);
		this._parseDataObject(currentItem.data);
	};
	
	objectFunctions.addParser = function(aName, aParser) {
		this._parsers.addObject(aName, aParser);
	};
	
	objectFunctions._setupItem = function(aTreeStructureItem) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::_setupItem");
		//console.log(aTreeStructureItem.getPath());
		
		var newDataObject = this._createDataObject(aTreeStructureItem);
		
		var parentData = aTreeStructureItem.getParent().data;
		var parentDefinitionXml = parentData.getDefinitionXml();
		if(parentDefinitionXml !== null) {
			var dataNamespace = dbm.xmlNamespaces.dbmData;
			var currentChild = XmlChildRetreiver.getNamespacedChildByNamespacedAttribute(parentDefinitionXml, dataNamespace, "name", aTreeStructureItem.getName(), dataNamespace, "item");
			
			var currentChildName = aTreeStructureItem.getName();
			
			if(currentChild === null && currentChildName.indexOf("child[") === 0) {
				var children = this.getDataChildren(parentDefinitionXml);
				var childIndex = parseInt(currentChildName.substring(6, currentChildName.length-1), 10);
				currentChild = children[childIndex];
			}
			
			if(currentChild !== null) {
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
	};
	
	objectFunctions._parseDataObject = function(aDataObject) {
		
		
		var definitionXml = aDataObject.getDefinitionXml();
		
		var parseResult = this._parseNode(definitionXml, aDataObject.getHierarchyItem().getPath());
		if(parseResult === null) {
			//METODO: error message
			console.log(definitionXml);
			console.error("Null result for " + aDataObject.getHierarchyItem().getPath());
			return;
		}
		
		
		aDataObject.parentApplyType = parseResult.parentApplyType;
		
		if(parseResult.isLinked) {
			aDataObject.setPropertyInput("data", parseResult.result);
			var currentArray = parseResult.nodes;
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				aDataObject.addNode(currentArray[i]);
			}
		}
		else {
			aDataObject.getProperty("data").setValue(parseResult.result);
		}
		
		if(parseResult.childrenIsProperties !== 0) {
			
			var ownerObject = aDataObject.getProperty("data").getValue();
			
			//METODO: check if it inside of on data:nodeValue
			var currentArray = this.getDataChildren(definitionXml);
			var currentArrayLength = currentArray.length;
			for(var i = 0; i < currentArrayLength; i++) {
				var currentNode = currentArray[i];
				
				//METODO: parse node
				var nodeName = null;
				var requestName = null;
				
				if(parseResult.childrenIsProperties === 1) {
					var dataNamespace = dbm.xmlNamespaces.dbmData;
					nodeName = XmlChildRetreiver.getNamespacedAttribute(currentNode, dataNamespace, "name");
					if(nodeName !== null) {
						requestName = encodeURIComponent(nodeName);
					}
					else {
						nodeName = i;
						requestName = "child[" + nodeName + "]";
					}
				}
				else if(parseResult.childrenIsProperties === 2) {
					nodeName = i;
					requestName = "child[" + nodeName + "]";
				}
				else {
					//METODO: error message
					break;
				}
				
				var currentData = this._hierarchy.getItemByPath(requestName, aDataObject.getHierarchyItem());
				
				if(currentData !== null) {
					
					if(currentData.data.parentApplyType === null) {
						ownerObject[nodeName] = currentData.data.getProperty("data").getValue();
					}
					else {
						switch(currentData.data.parentApplyType) { //METODO: report in instead of switch
							case "namedArray/addObject":
								ownerObject.addObject(nodeName, currentData.data.getProperty("data").getValue());
								break;
							case "setPropertyInput":
								if(!ownerObject.hasProperty(nodeName)) {
									ownerObject.createProperty(nodeName);
								}
								ownerObject.getProperty(nodeName).setValue(currentData.data.getProperty("data").getValue());
								break;
							case "animatedProperty":
								var newProperty = ownerObject.createProperty(nodeName);
								newProperty.setAnimationController(currentData.data.getProperty("data").getValue());
								break;
							case "timeline/applyParts":
								ownerObject.setParts(currentData.data.getProperty("data").getValue());
								break;
							case "gradient/addColorStops":
								var currentArray2 = currentData.data.getProperty("data").getValue();
								var currentArray2Length = currentArray2.length;
								for(var j = 0; j < currentArray2Length; j++) {
									ownerObject.addColorStop(currentArray2[j]);
								}
								break;
							case "treeStructure/setAttribute":
								ownerObject.setAttribute(nodeName, currentData.data.getProperty("data").getValue());
								break;
							case "treeStructure/addChild":
								ownerObject.addChild(currentData.data.getProperty("data").getValue());
								break;
							case "treeStructure/root":
								ownerObject._internalFunctionality_replaceRoot(currentData.data.getProperty("data").getValue());
								break;
							default:
								//METODO: error message
								console.warn("No apply type " + currentData.data.parentApplyType);
								break;
						}
					}
				}
				
				//METODO: replace data link
			}
		}
	};
	
	objectFunctions._parseNode = function(aXml, aPathReference, aDefaultType) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::_parseNode");
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		aDefaultType = VariableAliases.valueWithDefault(aDefaultType, "string");
		var dataType = VariableAliases.valueWithDefault(XmlChildRetreiver.getNamespacedAttribute(aXml, dataNamespace, "type"), aDefaultType);
		
		var result =  this._parseNodeAsType(aXml, aPathReference, dataType);
		if(result !== null) {
			result.parentApplyType = XmlChildRetreiver.getNamespacedAttribute(aXml, dataNamespace, "parentApplyType");
		}
		
		return result;
	};
	
	objectFunctions._parseNodeAsType = function(aXml, aPathReference, aType) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::_parseNodeAsType");
		//console.log(aType);
		if(!this._parsers.select(aType)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_parseNodeAsType", "Unknown data type " + aType);
			return null;
		}
		
		var currentParser = this._parsers.currentSelectedItem;
		var parseResult = currentParser.parseXml(aXml, aPathReference, aType);
		
		return parseResult;
	};
	
	objectFunctions.parseLinks = function(aDataObject) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::parseLinks");
		var parentPath = aDataObject.getHierarchyItem().getPath();
		var currentArray = XmlChildRetreiver.getChilds(aDataObject.getDefinitionXml());
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			var dataNamespace = dbm.xmlNamespaces.dbmData;
			if(currentChild.namespaceURI === dataNamespace) {
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
	
	objectFunctions.getDataChildren = function(aXml) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::parseLinks");
		var returnArray = new Array();
		var currentArray = XmlChildRetreiver.getChilds(aXml);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild = currentArray[i];
			var dataNamespace = dbm.xmlNamespaces.dbmData;
			if(currentChild.namespaceURI === dataNamespace) {
				switch(currentChild.localName) {
					case "link":
					case "fileLink":
					case "item":
						returnArray.push(currentChild);
						break;
					case "nodeValue":
					case "attribute":
						//MENOTE: do nothing
						break;
				}
			}
		}
		return returnArray;
	};
	
	objectFunctions.setData = function(aPath, aData) {
		this.getDataItem(aPath).setData(aData);
	};
	
	objectFunctions.getDataItem = function(aPath) {
		var currentTreeStructureItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		return currentTreeStructureItem.data;
	};
	
	objectFunctions.getData = function(aPath) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::getData");
		//console.log(aPath);
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		return currentItem.data.getData();
	};
	
	objectFunctions.getDataProperty = function(aPath) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::getDataProperty");
		
		var currentItem = this._hierarchy.getItemByPath(aPath, this._rootNode);
		
		if(currentItem.data === null) {
			this._createAssetForTreeStructure(currentItem);
		}
		
		return currentItem.data.getProperty("data");
	};
	
	objectFunctions._getRelativeDataProperty = function(aPath, aBasePath) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::_getRelativeDataProperty");
		
		aBasePath = VariableAliases.valueWithDefault(aBasePath, "");
		var rootItem = this._hierarchy.getItemByPath(aBasePath, this._rootNode).getParent();
		var currentItem = this._hierarchy.getItemByPath(aPath, rootItem);
		
		if(currentItem.data === null) {
			this._createAssetForTreeStructure(currentItem);
		}
		
		return currentItem.data.getProperty("data");
	};
	
	objectFunctions.getNodeValue = function(aXml) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::getNodeValue");
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var returnValue = XmlChildRetreiver.getNamespacedAttribute(aXml, dataNamespace, "nodeValue");
		if(returnValue !== null) {
			return returnValue;
		}
		
		if(XmlChildRetreiver.hasSimpleContent(aXml)) {
			return XmlChildRetreiver.getNodeValue(aXml);
		}
		
		return XmlChildRetreiver.getNodeValue(XmlChildRetreiver.getNamespacedChild(aXml, dataNamespace, "nodeValue"));
	};
	
	objectFunctions.parseNodeValue = function(aXml, aPathReference, aType) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::parseNodeValue");
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var attributeValue = XmlChildRetreiver.getNamespacedAttribute(aXml, dataNamespace, "nodeValue");
		if(attributeValue  !== null) {
			return this.parseAttribute(attributeValue, aPathReference);
		}
		
		if(XmlChildRetreiver.hasSimpleContent(aXml)) {
			return ParserResultDataObject.create(XmlChildRetreiver.getNodeValue(aXml));
		}
		
		var nodeValueNode = XmlChildRetreiver.getNamespacedChild(aXml, dataNamespace, "nodeValue");
		if(nodeValueNode !== null) {
			return this._parseNode(nodeValueNode, aPathReference, aType);
		}
		
		return null;
	};
	
	objectFunctions.parseFirstChild = function(aXml, aPathReference) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::parseFirstChild");
		
		var children = this.getDataChildren(aXml);
		if(children.length === 0) {
			//METODO: error message
			return null;
		}
		if(children.length > 1) {
			//METODO: error message
		}
		var firstChild = children[0];
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var childName = XmlChildRetreiver.getNamespacedAttribute(firstChild, dataNamespace, "name");
		if(childName === null) {
			childName = "child[0]";
		}
		var childPath = aPathReference + "/" + childName;
		var inputProperty = dbm.singletons.dbmDataManager.getDataProperty(childPath);
		var parseResult = ParserResultDataObject.createLinked(inputProperty, []);
		
		return parseResult;
	};
	
	objectFunctions.parseAttribute = function(aAttribute, aPathReference) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::parseAttribute");
		
		if(aAttribute.indexOf("dbmDataLink:") === 0) {
			var linkedPath = aAttribute.substring(12, aAttribute.length);
			var returnProperty = this._getRelativeDataProperty(linkedPath, aPathReference);
			return ParserResultDataObject.createLinked(returnProperty, []);
		}
		else {
			return ParserResultDataObject.create(aAttribute);
		}
	};
	
	objectFunctions.getAttribute = function(aXml, aNamespace, aAttribute, aPathReference) {
		//console.log("dbm.core.globalobjects.datamanager.DataManager::getAttribute");
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var returnValue = XmlChildRetreiver.getNamespacedAttribute(aXml, aNamespace, aAttribute);
		if(returnValue !== null) {
			return this.parseAttribute(returnValue, aPathReference);
		}
		
		var attributeNode = XmlChildRetreiver.getNamespacedChild(aXml, aNamespace, "attribute");
		
		//METODO: select correct attribute
		
		return this._parseNode(attributeNode, aPathReference);
	};
	
	objectFunctions.debugTraceStructure = function() {
		this._hierarchy.debugTraceStructure(20);
	};
});