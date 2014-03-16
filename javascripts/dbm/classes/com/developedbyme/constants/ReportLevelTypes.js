/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
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