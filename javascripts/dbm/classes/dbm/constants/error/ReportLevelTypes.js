/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.error.ReportLevelTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.error.ReportLevelTypes");
	
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	staticFunctions.CRITICAL = 5;
	staticFunctions.MAJOR = 4;
	staticFunctions.NORMAL = 3;
	staticFunctions.MINOR = 2;
	staticFunctions.NOTICE = 1;
	staticFunctions.NONE = 0;
	staticFunctions.UNKNOWN = -1;
	
});