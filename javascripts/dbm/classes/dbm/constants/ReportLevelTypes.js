/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.ReportLevelTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.ReportLevelTypes");
	
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	staticFunctions.CRITICAL = 5;
	staticFunctions.MAJOR = 4;
	staticFunctions.NORMAL = 3;
	staticFunctions.MINOR = 2;
	staticFunctions.NOTICE = 1;
	staticFunctions.NONE = 0;
	staticFunctions.UNKNOWN = -1;
	
});