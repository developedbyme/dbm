dbm.runTempFunction(function() {
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var WindowManager = dbm.importClass("dbm.core.globalobjects.windowmanager.WindowManager");
	
	var IframeElement = dbm.importClass("dbm.gui.other.IframeElement");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var bookmarkletMainWindow = WindowManager.getInstance().getWindow("bookmarkletMain");
		
		var newIframe = IframeElement.create(bookmarkletMainWindow.getDocument(), true, "http://localhost/");
		
		var iframeLoadedCallbackFunction = function(aIframe) {
			console.log("iframeLoadedCallbackFunction");
			console.log(aIframe);
			console.log(aIframe.getElement().contentDocument);
		};
		
		newIframe.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, iframeLoadedCallbackFunction, [newIframe]));
		
	});
});