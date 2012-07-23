dbm.registerClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	
	var DefaultBasicParsersSetup = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.setup.DefaultBasicParsersSetup");
	
	var StringParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.StringParser");
	var FloatParser = dbm.importClass("com.developedbyme.core.globalobjects.datamanager.parsers.basic.FloatParser");
	
	var DataParserTypes = dbm.importClass("com.developedbyme.constants.DataParserTypes");
	
	staticFunctions.setup = function() {
		
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.STRING, StringParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.FLOAT, FloatParser.create());
		dbm.singletons.dbmDataManager.addParser(DataParserTypes.NUMBER, FloatParser.create());
	};
});