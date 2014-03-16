/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	
	var DefaultComplexParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	
	var KeyValueParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.complex.KeyValueParser");
	
	var DataParserTypes = dbm.importClass("com.developedbyme.constants.DataParserTypes");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.KEY_VALUE, KeyValueParser.create());
	};
});