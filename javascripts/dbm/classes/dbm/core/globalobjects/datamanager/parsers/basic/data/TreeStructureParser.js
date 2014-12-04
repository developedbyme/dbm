/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser", "dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser");
	
	//Self reference
	var TreeStructureParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser");
	
	//Error report
	
	//Dependencies
	var TreeStructure = dbm.importClass("dbm.utils.data.treestructure.TreeStructure");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		console.log("dbm.core.globalobjects.datamanager.parsers.basic.data.TreeStructureParser::parseXml");
		
		var result = ParserResultDataObject.create(TreeStructure.create(), []);
		result.childrenIsProperties = 1;
		
		return result;
	};
	
	staticFunctions.create = function() {
		var newTreeStructureParser = (new ClassReference()).init();
		return newTreeStructureParser;
	};
});