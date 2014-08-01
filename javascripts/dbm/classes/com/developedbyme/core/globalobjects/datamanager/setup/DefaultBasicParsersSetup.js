/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	
	//Self reference
	var DefaultBasicParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	
	//Error report
	
	//Dependencies
	var StringParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser");
	var FloatParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.FloatParser");
	var BooleanParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.BooleanParser");
	var ArrayParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ArrayParser");
	var ObjectParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.ObjectParser");
	var PointsArrayParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.data.PointsArrayParser");
	
	//Utils
	
	//Constants
	var DataParserTypes = dbm.importClass("com.developedbyme.constants.DataParserTypes");
	
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.STRING, StringParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.FLOAT, FloatParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.NUMBER, FloatParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.BOOLEAN, BooleanParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.ARRAY, ArrayParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.OBJECT, ObjectParser.create());
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.POINTS_ARRAY, PointsArrayParser.create());
		
	};
});