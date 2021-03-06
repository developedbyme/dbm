/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.media.RecordFramesFromVideoApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.tools.media.RecordFramesFromVideoApplication");
	//"use strict";
	
	//Self reference
	var RecordFramesFromVideoApplication = dbm.importClass("dbm.projects.tools.media.RecordFramesFromVideoApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var VideoView = dbm.importClass("dbm.gui.media.video.VideoView");
	var AddToArrayNode = dbm.importClass("dbm.flow.nodes.data.AddToArrayNode");
	var DrawElementNode = dbm.importClass("dbm.flow.nodes.canvas.DrawElementNode");
	var DrawElementWithScaleNode = dbm.importClass("dbm.flow.nodes.canvas.DrawElementWithScaleNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var FloorNode = dbm.importClass("dbm.flow.nodes.math.round.FloorNode");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("dbm.projects.tools.media.RecordFramesFromVideoApplication::_init");
		
		this.superCall();
		
		this._video = null;
		this._drawElementNode = null;
		this._addToArrayNode = null;
		this._viewImagesButton = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		this._video = VideoView.create(dbm.getDocument().body, true, ["/debugData/oceans-clip.mp4", "/debugData/oceans-clip.ogv", "/debugData/oceans-clip.webm"], true);
		this._video.setPlaybackNode(dbm.singletons.dbmAnimationManager.getPlaybackNode());
		this._video.setPropertyInput("volume", 0);
		
		var fpsMultiplierNode = MultiplicationNode.create(this._video.getProperty("outputTime"), 25);
		var fpsFloorNode = FloorNode.create(fpsMultiplierNode.getProperty("outputValue"));
		
		var inputWidth = 634;
		var inputHeight = 264;
		var outputWidth = 320;
		var outputHeight = 180;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		var canvas = htmlCreator.createNode("canvas", {"width": outputWidth, "height": outputHeight});
		this._drawElementNode = DrawElementWithScaleNode.create(this._video.getElement(), inputWidth, inputHeight, canvas, outputWidth, outputHeight, "image/jpeg", 1, fpsFloorNode.getProperty("outputValue"));
		this._addToArrayNode = AddToArrayNode.create(fpsFloorNode.getProperty("outputValue"), this._drawElementNode.getProperty("dataUrl"));
		this._addToArrayNode.getProperty("array").startUpdating();
		
		this._video.play();
		
		this._viewImagesButton = BaseButton.createButton(dbm.getDocument().body, true, null, "View images");
		this._viewImagesButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.CLICK, CallFunctionCommand.createCommand(this, this._createImages, []));
		this._viewImagesButton.activate();
	};
	
	objectFunctions._createImages = function() {
		console.log("dbm.projects.tools.media.RecordFramesFromVideoApplication::_createImages");
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		
		var currentArray = this._addToArrayNode.getProperty("array").getValue();
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPath = currentArray[i];
			if(VariableAliases.isSet(currentPath)) {
				dbm.getDocument().body.appendChild(htmlCreator.createImage(currentPath));
			}
			else {
				ErrorManager.getInstance().report(ReportTypes.WARNING, ReportLevelTypes.NORMAL, this, "_createImages", "Image " + i + " is not set.");
			}
		}
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});