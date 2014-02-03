dbm.registerClass("com.developedbyme.constants.ReportTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.ReportTypes");
	
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	
	staticFunctions.ERROR = "error";
	staticFunctions.WARNING = "warning";
	staticFunctions.TRACE = "log";
	staticFunctions.LOG = "log";
	staticFunctions.UNKNOWN = "unknown";
	
});