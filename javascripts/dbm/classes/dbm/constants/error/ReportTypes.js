/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.error.ReportTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.error.ReportTypes");
	
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	
	staticFunctions.ERROR = "error";
	staticFunctions.WARNING = "warning";
	staticFunctions.TRACE = "log";
	staticFunctions.LOG = "log";
	staticFunctions.UNKNOWN = "unknown";
	
});