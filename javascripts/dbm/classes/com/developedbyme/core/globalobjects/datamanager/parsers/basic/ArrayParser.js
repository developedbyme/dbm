/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ArrayParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ArrayParser");
	
	//Self reference
	var ArrayParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ArrayParser");
	
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
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ArrayParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		return this._createResult();
		//METODO: enable links
	};
	
	objectFunctions._createInputLink = function(aInputProperty) {
		return ParserResultDataObject.createLinked(aInputProperty, []);
	};
	
	objectFunctions._createResult = function() {
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ArrayParser::_createResult");
		
		var result = ParserResultDataObject.create(new Array());
		result.childrenIsProperties = 2;
		
		return result;
	};
	
	staticFunctions.create = function() {
		var newArrayParser = (new ClassReference()).init();
		return newArrayParser;
	};
});