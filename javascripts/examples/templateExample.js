dbm.runTempFunction(function() {
	
	var VideoView = dbm.importClass("dbm.gui.media.video.VideoView");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		dbm.singletons.dbmTemplateManager.registerClassShortcut("VideoView", VideoView);
		dbm.singletons.dbmTemplateManager.registerClassShortcut("BaseButton", BaseButton);
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(document.getElementById("testTemplate"));
		
		console.log(templateResult);
		
		templateResult.getController("testButton").activate();
		
		console.log(templateResult.mainController);
		console.log(templateResult.getController("contentArea/videoPlayer"));
		
	});
});