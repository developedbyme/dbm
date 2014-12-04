/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.parsers.basic.ObjectParser", "dbm.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.parsers.basic.ObjectParser");
	
	//Self reference
	var ObjectParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.basic.ObjectParser");
	
	//Error report
	
	//Dependencies
	var ParserResultDataObject = dbm.importClass("dbm.core.globalobjects.datamanager.objects.ParserResultDataObject");
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.datamanager.parsers.basic.ObjectParser::_init");
		
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
		//console.log("dbm.core.globalobjects.datamanager.parsers.basic.ObjectParser::_createResult");
		
		var result = ParserResultDataObject.create(new Object());
		result.childrenIsProperties = 1;
		
		return result;
	};
	
	staticFunctions.create = function() {
		var newObjectParser = (new ClassReference()).init();
		return newObjectParser;
	};
});