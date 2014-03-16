/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var TextReplacementParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var TextReplacementNode = dbm.importClass("com.developedbyme.flow.nodes.text.TextReplacementNode");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	var XmlChildRetreiver = dbm.importClass("com.developedbyme.utils.xml.XmlChildRetreiver");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._setupReplacement = function(aReplacementNode, aXml, aPathReference) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::_setupReplacement");
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var currentArray = dbm.singletons.dbmDataManager.getDataChildren(aXml);
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentChild =  currentArray[i];
			var parentApplyType = XmlChildRetreiver.getNamespacedAttribute(currentChild, dataNamespace, "parentApplyType");
			if(parentApplyType === "replacement") {
				var childName = XmlChildRetreiver.getNamespacedAttribute(currentChild, dataNamespace, "name");
				if(childName === null) {
					childName = "child[" + i + "]";
				}
				var childPath = aPathReference + "/" + childName;
				var currentKeyValue = dbm.singletons.dbmDataManager.getData(childPath);
				aReplacementNode.addReplacement(currentKeyValue.keyValue, currentKeyValue.dataValue);
			}
		}
	};
	
	objectFunctions._createInputLink = function(aInputProperty, aXml, aPathReference) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::_createInputLink");
		var parseNode = TextReplacementNode.create(aInputProperty);
		
		this._setupReplacement(parseNode, aXml, aPathReference);
		
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue, aXml, aPathReference) {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::_createResult");
		var parseNode = TextReplacementNode.create(aValue);
		
		this._setupReplacement(parseNode, aXml, aPathReference);
		
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	staticFunctions.create = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser::create");
		var newTextReplacementParser = (new ClassReference()).init();
		return newTextReplacementParser;
	};
});