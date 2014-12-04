/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.text.ToLowerCaseParser", "dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.text.ToLowerCaseParser");
	
	var ToLowerCaseParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.text.ToLowerCaseParser");
	
	var ToLowerCaseNode = dbm.importClass("dbm.flow.nodes.text.ToLowerCaseNode");
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.text.ToLowerCaseParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ToLowerCaseNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(aValue.toString().toLowerCase());
	};
	
	staticFunctions.create = function() {
		var newToLowerCaseParser = (new ClassReference()).init();
		return newToLowerCaseParser;
	};
});