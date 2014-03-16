/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultTextParsersSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	
	var DefaultTextParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	
	var ToUpperCaseParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.ToUpperCaseParser");
	var ToLowerCaseParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.ToLowerCaseParser");
	var TextReplacementParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var DataParserTypes = dbm.importClass("com.developedbyme.constants.DataParserTypes");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.UPPER_CASE_TEXT, ToUpperCaseParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.LOWER_CASE_TEXT, ToLowerCaseParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.TEXT_REPLACEMENT, TextReplacementParser.create());
	};
});