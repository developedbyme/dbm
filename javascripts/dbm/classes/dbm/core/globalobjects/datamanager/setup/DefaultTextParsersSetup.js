/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.setup.DefaultTextParsersSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	
	var DefaultTextParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultTextParsersSetup");
	
	var ToUpperCaseParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.text.ToUpperCaseParser");
	var ToLowerCaseParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.text.ToLowerCaseParser");
	var TextReplacementParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.text.TextReplacementParser");
	
	var DataParserTypes = dbm.importClass("dbm.constants.generic.DataParserTypes");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.UPPER_CASE_TEXT, ToUpperCaseParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.LOWER_CASE_TEXT, ToLowerCaseParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.TEXT_REPLACEMENT, TextReplacementParser.create());
	};
});