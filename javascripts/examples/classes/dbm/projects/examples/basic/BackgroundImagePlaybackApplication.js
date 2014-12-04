/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.examples.basic.BackgroundImagePlaybackApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var BackgroundImagePlaybackApplication = dbm.importClass("dbm.projects.examples.basic.BackgroundImagePlaybackApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var MinNode = dbm.importClass("dbm.flow.nodes.math.MinNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var FloorNode = dbm.importClass("dbm.flow.nodes.math.round.FloorNode");
	var PadNumberNode = dbm.importClass("dbm.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("dbm.flow.nodes.text.TextReplacementNode");
	var PlaybackNode = dbm.importClass("dbm.flow.nodes.time.PlaybackNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LogCommand = dbm.importClass("dbm.core.extendedevent.commands.debug.LogCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var SetupCssPropertyFunctions = dbm.importClass("dbm.flow.setup.display.SetupCssPropertyFunctions");
	
	//Constants
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.examples.basic.BackgroundImagePlaybackApplication::_init");
		
		this.superCall();
		
		this._displayObject = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.examples.basic.BackgroundImagePlaybackApplication::_createPage");
		
		var fileName = "../assets/temp/savedFiles/maserati.[frame].jpg";
		var numberOfFrames = 3813;
		var fps = 25;
		var padding = 5;
		
		this._displayObject = DisplayBaseObject.createDiv(dbm.getDocument(), true, {"style": "width: 100%; height: 100%; background-size: cover; background-position: 50% 50%;"});
		
		var playbackNode = PlaybackNode.create();
		playbackNode.setPropertyInput("inputTime", dbm.singletons.dbmAnimationManager.globalTimeProperty);
		
		var fpsMultiplierNode = MultiplicationNode.create(playbackNode.getProperty("outputTime"), fps);
		var fpsFloorNode = FloorNode.create(fpsMultiplierNode.getProperty("outputValue"));
		var maxFrameNode = MinNode.create(fpsFloorNode.getProperty("outputValue"), numberOfFrames);
		var paddedFrameNode = PadNumberNode.create(maxFrameNode.getProperty("outputValue"), padding);
		var fileNameNode = TextReplacementNode.create(fileName);
		fileNameNode.addReplacement("[frame]", paddedFrameNode.getProperty("outputValue"));
		
		SetupCssPropertyFunctions.setupBackgroundImagePropertyWithCache(this._displayObject, fileNameNode.getProperty("outputValue"));
		
		playbackNode.play();
		this._displayObject.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});