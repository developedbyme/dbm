/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.ToUpperCaseParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.ToUpperCaseParser");
	
	var ToUpperCaseParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.ToUpperCaseParser");
	
	var ToUpperCaseNode = dbm.importClass("com.developedbyme.flow.nodes.text.ToUpperCaseNode");
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.text.ToUpperCaseParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		var parseNode = ToUpperCaseNode.create(aInputProperty);
		return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(aValue.toString().toUpperCase());
	};
	
	staticFunctions.create = function() {
		var newToUpperCaseParser = (new ClassReference()).init();
		return newToUpperCaseParser;
	};
});