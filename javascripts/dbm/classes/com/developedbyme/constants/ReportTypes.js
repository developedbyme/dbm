/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.ReportTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.ReportTypes");
	
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	
	staticFunctions.ERROR = "error";
	staticFunctions.WARNING = "warning";
	staticFunctions.TRACE = "log";
	staticFunctions.LOG = "log";
	staticFunctions.UNKNOWN = "unknown";
	
});