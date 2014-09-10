/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureItemParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureItemParser");
	
	//Self reference
	var TreeStructureItemParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureItemParser");
	
	//Error report
	
	//Dependencies
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureItemParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		
		var dataNamespace = dbm.xmlNamespaces.dbmData;
		var nameResult = dbm.singletons.dbmDataManager.getAttribute(aXml, dataNamespace, "name", aPathReference);
		
		var result = ParserResultDataObject.create(TreeStructureItem.create(nameResult.result), []);
		result.childrenIsProperties = 1;
		
		return result;
	};
	
	staticFunctions.create = function() {
		var newTreeStructureItemParser = (new ClassReference()).init();
		return newTreeStructureItemParser;
	};
});