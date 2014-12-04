/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.basic.FloatParser", "dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.basic.FloatParser");
	
	//Self reference
	var FloatParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.basic.FloatParser");
	
	//Error report
	
	//Dependencies
	var ParseFloatNode = dbm.importClass("dbm.flow.nodes.parse.ParseFloatNode");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.basic.FloatParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ParseFloatNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(parseFloat(aValue));
	};
	
	staticFunctions.create = function() {
		var newFloatParser = (new ClassReference()).init();
		return newFloatParser;
	};
});