dbm.runTempFunction(function() {
	
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var PrintTextHandler = dbm.importClass("dbm.core.globalobjects.errormanager.handlers.PrintTextHandler");
	
	var startFunction = function() {
		
		ErrorManager.getInstance().addHandler(PrintTextHandler.createWithDiv(document));
		
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "startFunction", "Test of error");
		ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.MAJOR, this, "startFunction", "Test of error");
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "startFunction", "Test of warning");
		ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "startFunction", "Test of warning");
		ErrorManager.getInstance().report(ReportTypes.TRACE, ReportLevelTypes.NONE, this, "startFunction", "Test of trace");
		ErrorManager.getInstance().report(ReportTypes.TRACE, ReportLevelTypes.NONE, this, "startFunction", "Test of trace");
		
		try {
			throw("Test exception");
		}
		catch(theError) {
			ErrorManager.getInstance().reportError(this, "startFunction", theError);
		}
	};
	
	dbm.addStartFunction(startFunction);
});