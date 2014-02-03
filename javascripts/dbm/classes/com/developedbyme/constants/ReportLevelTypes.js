dbm.registerClass("com.developedbyme.constants.ReportLevelTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.ReportLevelTypes");
	
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	staticFunctions.CRITICAL = 5;
	staticFunctions.MAJOR = 4;
	staticFunctions.NORMAL = 3;
	staticFunctions.MINOR = 2;
	staticFunctions.NOTICE = 1;
	staticFunctions.NONE = 0;
	staticFunctions.UNKNOWN = -1;
	
});