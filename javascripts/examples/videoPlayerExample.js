dbm.runTempFunction(function() {
	
	var VideoView = dbm.importClass("com.developedbyme.gui.video.VideoView");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var HorizontalScaleSlider = dbm.importClass("com.developedbyme.gui.form.sliders.HorizontalScaleSlider");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(document);
		
		var videoView = VideoView.create(document.body, true, ["/debugData/oceans-clip.mp4", "/debugData/oceans-clip.ogv", "/debugData/oceans-clip.webm"], true);
		videoView.setPlaybackNode(dbm.singletons.dbmAnimationManager.getPlaybackNode());
		
		//dbm.singletons.dbmAnimationManager.getPlaybackNode().setPropertyInput("minTime", -Infinity);
		//dbm.singletons.dbmAnimationManager.getPlaybackNode().setPropertyInput("playbackSpeed", -2);
		
		//dbm.singletons.dbmAnimationManager.getPlaybackNode().setPropertyInput("playbackSpeed", 0.5);
		
		//dbm.singletons.dbmAnimationManager.getPlaybackNode().setPropertyInput("playbackSpeed", 3);
		
		var playButton = BaseButton.create(htmlCreator.createNode("div", {}, "Play"));
		playButton.addToParent(document.body);
		playButton.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(videoView, videoView.play, []));
		playButton.activate();
		
		var seekButton = BaseButton.create(htmlCreator.createNode("div", {}, "Seek"));
		seekButton.addToParent(document.body);
		seekButton.getExtendedEvent().addCommandToEvent("click", CallFunctionCommand.createCommand(videoView, videoView.seek, [5]));
		seekButton.activate();
		
		
		var slider = HorizontalScaleSlider.createSimple2ColorSlider(document.body, true, 300, 10, 0xFF0000, 0x666666);
		slider.getProperty("maxValue").setValue(120);
		slider.connectPlaybackNode(dbm.singletons.dbmAnimationManager.getPlaybackNode());
		slider.activate();
		
		console.log(slider);
	});
});