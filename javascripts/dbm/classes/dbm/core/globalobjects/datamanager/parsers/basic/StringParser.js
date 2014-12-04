/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.basic.StringParser", "dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.basic.StringParser");
	
	var StringParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.basic.StringParser");
	
	var ParseStringNode = dbm.importClass("dbm.flow.nodes.parse.ParseStringNode");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.basic.StringParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ParseStringNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(aValue.toString());
	};
	
	staticFunctions.create = function() {
		var newStringParser = (new ClassReference()).init();
		return newStringParser;
	};
});