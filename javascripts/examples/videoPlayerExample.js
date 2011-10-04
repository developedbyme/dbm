dbm.runTempFunction(function() {
	
	var VideoView = dbm.importClass("com.developedbyme.gui.video.VideoView");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var videoView = VideoView.create(document.body, true, ["/debugData/oceans-clip.mp4", "/debugData/oceans-clip.webm", "/debugData/oceans-clip.ogv"], true, {"width": 320, "height": 240});
		videoView.setPlaybackNode(dbm.singletons.dbmAnimationManager.getPlaybackNode());
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(document);
		
		var playButton = BaseButton.create(htmlCreator.createNode("div", {}, "Play"));
		playButton.addToParent(document.body);
		
		playButton.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(videoView, videoView.play, []));
		playButton.activate();
		
		var seekButton = BaseButton.create(htmlCreator.createNode("div", {}, "Seek"));
		seekButton.addToParent(document.body);
		
		seekButton.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(videoView, videoView.seek, [5]));
		seekButton.activate();
		
		console.log(videoView);
	});
});