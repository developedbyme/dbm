/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.gui.form.sliders.SimplePlaybackControllerApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SimplePlaybackControllerApplication = dbm.importClass("dbm.projects.examples.gui.form.sliders.SimplePlaybackControllerApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var HorizontalPlayheadSlider = dbm.importClass("dbm.gui.form.sliders.HorizontalPlayheadSlider");
	var StateImage = dbm.importClass("dbm.gui.images.StateImage");
	var PlaybackNode = dbm.importClass("dbm.flow.nodes.time.PlaybackNode");
	var IndexSwitchedNode = dbm.importClass("dbm.flow.nodes.logic.IndexSwitchedNode");
	var StateActivatedCommandsController = dbm.importClass("dbm.core.extendedevent.StateActivatedCommandsController");
	var ExtendedEventValueProperty = dbm.importClass("dbm.core.objectparts.ExtendedEventValueProperty");
	var LastValidValueNode = dbm.importClass("dbm.flow.nodes.data.LastValidValueNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Constants
	var PlaybackStateTypes = dbm.importClass("dbm.constants.PlaybackStateTypes");
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.gui.form.sliders.SimplePlaybackControllerApplication::_init");
		
		this.superCall();
		
		this._playbackNode = null;
		this._playButton = null;
		this._stateImage = null;
		this._slider = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.gui.form.sliders.SimplePlaybackControllerApplication::_createPage");
		
		//Create elements
		this._playbackNode = PlaybackNode.createWithGlobalInput();
		this._playbackNode.setupPlayback(0, 300, false);
		
		this._playButton = BaseButton.createDiv(this._contentHolder, true, {"style": "width: 30px; height: 30px; background-color: #00FF00"});
		this._playButton.activate();
		this._playButton.getProperty("display").startUpdating();
		
		this._stateImage = StateImage.create(this._playButton.getElement(), true, "../images/icons/gentleface/black/playback_play_icon&24.png", PlaybackStateTypes.getName(PlaybackStateTypes.PAUSED));
		this._stateImage.addState(PlaybackStateTypes.getName(PlaybackStateTypes.PLAYING), "../images/icons/gentleface/black/playback_pause_icon&24.png")
		this._stateImage.getProperty("display").startUpdating();
		
		this._slider = HorizontalPlayheadSlider.createSimple2ColorSlider(this._contentHolder, true, 300, 30, 1, 0xFF0000, 0xCCCCCC);
		this._slider.activate();
		this._slider.getProperty("display").startUpdating();
		this._slider.connectPlaybackNode(this._playbackNode);
		
		//Switch commands on button
		var stateNameNode = IndexSwitchedNode.create(this._playbackNode.getProperty("state"), PlaybackStateTypes.NAME_ARRAY_OFFSET, PlaybackStateTypes.NAME_ARRAY);
		this._playButton.addDestroyableObject(stateNameNode);
		
		var buttonStateController = StateActivatedCommandsController.create(this._playButton.getExtendedEvent());
		buttonStateController.addCommandToEvent(PlaybackStateTypes.getName(PlaybackStateTypes.PAUSED), ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this._playbackNode, this._playbackNode.play, []));
		buttonStateController.addCommandToEvent(PlaybackStateTypes.getName(PlaybackStateTypes.PLAYING), ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this._playbackNode, this._playbackNode.pause, []));
		this._playButton.addDestroyableObject(buttonStateController);
		
		var stateTriggerProperty = ExtendedEventValueProperty.create(stateNameNode.getProperty("outputValue"));
		this._playButton.addProperty("stateTrigger", stateTriggerProperty);
		stateTriggerProperty.getExtendedEvent().addCommandToEvent(GenericExtendedEventIds.UPDATE, CallFunctionCommand.createCommand(buttonStateController, buttonStateController.setActiveState, [GetVariableObject.createSelectDataCommand()]));
		stateTriggerProperty.startUpdating();
		
		//Setup state image
		
		var validStateNode = LastValidValueNode.create(stateNameNode.getProperty("outputValue"), [PlaybackStateTypes.getName(PlaybackStateTypes.PAUSED), PlaybackStateTypes.getName(PlaybackStateTypes.PLAYING)]);
		this._stateImage.addDestroyableObject(validStateNode);
		this._stateImage.getProperty("state").connectInput(validStateNode.getProperty("outputValue"));
		
		//Start the playback
		this._playbackNode.play();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});