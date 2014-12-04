/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser", "dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser");
	
	var StringAliasesParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser");
	
	var StringAliases = dbm.importClass("dbm.utils.native.string.StringAliases");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	var XmlChildRetreiver = dbm.importClass("dbm.utils.xml.XmlChildRetreiver");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	/*
	objectFunctions._setupReplacement = function(aReplacementNode, aXml, aPathReference) {
		//console.log("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser::_setupReplacement");
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
		//console.log("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser::_createInputLink");
		var parseNode = StringAliases.create();
		
		this._setupReplacement(parseNode, aXml, aPathReference);
		
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue, aXml, aPathReference) {
		//console.log("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser::_createResult");
		var parseNode = StringAliases.create();
		
		this._setupReplacement(parseNode, aXml, aPathReference);
		
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	*/
	
	staticFunctions.create = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.objects.StringAliasesParser::create");
		var newStringAliasesParser = (new ClassReference()).init();
		return newStringAliasesParser;
	};
});