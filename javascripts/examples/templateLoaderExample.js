dbm.runTempFunction(function() {
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	var VideoView = dbm.importClass("com.developedbyme.gui.media.video.VideoView");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var fileName = "../assets/templates/testTemplate.xml#testTemplate";
		
		var fileLoaded = function(aLoader) {
			console.log("fileLoaded");
			
			var templateElement = aLoader.getData();
			templateElement = document.adoptNode(templateElement, true);
			document.body.appendChild(templateElement);
			
			dbm.singletons.dbmTemplateManager.registerClassShortcut("VideoView", VideoView);
			dbm.singletons.dbmTemplateManager.registerClassShortcut("BaseButton", BaseButton);

			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(templateElement);

			console.log(templateResult);

			templateResult.getController("testButton").activate();

			console.log(templateResult.mainController);
			console.log(templateResult.getController("contentArea/videoPlayer"));
		}
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(fileName);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, [templateLoader]));
		templateLoader.load();
	});
});