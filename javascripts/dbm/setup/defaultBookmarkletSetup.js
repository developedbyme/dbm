dbm.runTempFunction(function() {
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var WindowManager = dbm.importClass("dbm.core.globalobjects.windowmanager.WindowManager");
	
	dbm.addStartFunction(function() {
		
		if(window.dbmBookmarklet === undefined) {
			ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.CRITICAL, "[defaultBookmarkletSetup]", "startFunction", "dbmBookmarklet is undefined");
			return;
		}
		
		console.log(window.dbmBookmarklet);
		WindowManager.getInstance().createWindowFromExisiting("bookmarkletMain", window.dbmBookmarklet.parentDocument.defaultView);
		
		console.log(WindowManager.getInstance().getWindow("bookmarkletMain"));
		
		delete window.dbmBookmarklet;
	});
});