/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser");
	
	//Self reference
	var TreeStructureParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser");
	
	//Error report
	
	//Dependencies
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser::parseXml");
		
		var result = ParserResultDataObject.create(TreeStructure.create(), []);
		result.childrenIsProperties = 1;
		
		return result;
	};
	
	staticFunctions.create = function() {
		var newTreeStructureParser = (new ClassReference()).init();
		return newTreeStructureParser;
	};
});