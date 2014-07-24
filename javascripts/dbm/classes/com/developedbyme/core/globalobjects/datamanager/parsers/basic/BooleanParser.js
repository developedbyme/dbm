/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.BooleanParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.BooleanParser");
	
	//Self reference
	var BooleanParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.BooleanParser");
	
	//Error report
	
	//Dependencies
	var ParserResultDataObject = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.BooleanParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		//METODO
		//var parseNode = ParseFloatNode.create(aInputProperty);
		//return ParserResultDataObject.createLinked(parseNode.getProperty("outputValue"), [parseNode]);
		return null; //MEDEBUG
	};
	
	objectFunctions._createResult = function(aValue) {
		return ParserResultDataObject.create(VariableAliases.isTrue(aValue));
	};
	
	staticFunctions.create = function() {
		var newBooleanParser = (new ClassReference()).init();
		return newBooleanParser;
	};
});