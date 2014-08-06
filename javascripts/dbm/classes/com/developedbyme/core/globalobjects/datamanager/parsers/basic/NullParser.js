/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.NullParser", "com.developedbyme.core.globalobjects.datamanager.parsers.ParserBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.NullParser");
	
	//Self reference
	var NullParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.NullParser");
	
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
		//console.log("com.developedbyme.core.globalobjects.datamanager.parsers.basic.NullParser::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.parseXml = function(aXml, aPathReference, aType) {
		var result = ParserResultDataObject.create(null);
		return result;
	};
	
	staticFunctions.create = function() {
		var newNullParser = (new ClassReference()).init();
		return newNullParser;
	};
});