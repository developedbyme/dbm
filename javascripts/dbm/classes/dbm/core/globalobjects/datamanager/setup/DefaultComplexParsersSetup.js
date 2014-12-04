/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	
	var DefaultComplexParsersSetup = dbm.importClass("dbm.core.globalobjects.datamanager.setup.DefaultComplexParsersSetup");
	
	var KeyValueParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.complex.KeyValueParser");
	var DbmObjectParser = dbm.importClass("dbm.core.globalobjects.datamanager.parsers.complex.DbmObjectParser");
	
	var DataParserTypes = dbm.importClass("dbm.constants.DataParserTypes");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.KEY_VALUE, KeyValueParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.DBM_OBJECT, DbmObjectParser.create());
		
	};
});