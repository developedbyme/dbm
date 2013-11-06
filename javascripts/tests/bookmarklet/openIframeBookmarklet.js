dbm.runTempFunction(function() {
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var WindowManager = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.WindowManager");
	
	var IframeElement = dbm.importClass("com.developedbyme.gui.other.IframeElement");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
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