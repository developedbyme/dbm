/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.tools.media.SaveFramesFromVideoApplication", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.tools.media.SaveFramesFromVideoApplication");
	//"use strict";
	
	//Self reference
	var SaveFramesFromVideoApplication = dbm.importClass("dbm.projects.tools.media.SaveFramesFromVideoApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var VideoView = dbm.importClass("dbm.gui.media.video.VideoView");
	var DrawElementNode = dbm.importClass("dbm.flow.nodes.canvas.DrawElementNode");
	var DrawElementWithScaleNode = dbm.importClass("dbm.flow.nodes.canvas.DrawElementWithScaleNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var FloorNode = dbm.importClass("dbm.flow.nodes.math.round.FloorNode");
	var PadNumberNode = dbm.importClass("dbm.flow.nodes.text.PadNumberNode");
	var TextReplacementNode = dbm.importClass("dbm.flow.nodes.text.TextReplacementNode");
	var GetDataFromDataUrlNode = dbm.importClass("dbm.flow.nodes.text.GetDataFromDataUrlNode");
	var SaveFileNode = dbm.importClass("dbm.flow.nodes.server.SaveFileNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("dbm.utils.reevaluation.objectreevaluation.GetVariableObject");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("dbm.projects.tools.media.SaveFramesFromVideoApplication::_init");
		
		this.superCall();
		
		this._video = null;
		this._drawElementNode = null;
		
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		
		var fileName = "maserati";
		
		this._video = VideoView.create(dbm.getDocument().body, true, ["/debugData/" + fileName + ".mp4", "/debugData/" + fileName + ".ogv", "/debugData/" + fileName + ".webm"], true);
		this._video.setPlaybackNode(dbm.singletons.dbmAnimationManager.getPlaybackNode());
		this._video.setPropertyInput("volume", 0);
		
		var fpsMultiplierNode = MultiplicationNode.create(this._video.getProperty("outputTime"), 25);
		var fpsFloorNode = FloorNode.create(fpsMultiplierNode.getProperty("outputValue"));
		var paddedFrameNode = PadNumberNode.create(fpsFloorNode.getProperty("outputValue"), 5);
		var fileNameNode = TextReplacementNode.create(fileName + ".[frame].jpg");
		fileNameNode.addReplacement("[frame]", paddedFrameNode.getProperty("outputValue"));
		
		var inputWidth = 1280;
		var inputHeight = 720;
		var outputWidth = 320;
		var outputHeight = 180;
		
		var quality = 0.8;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.getDocument());
		var canvas = htmlCreator.createNode("canvas", {"width": outputWidth, "height": outputHeight});
		this._drawElementNode = DrawElementWithScaleNode.create(this._video.getElement(), inputWidth, inputHeight, canvas, outputWidth, outputHeight, "image/jpeg", quality, fpsFloorNode.getProperty("outputValue"));
		
		var dataFormatterNode = GetDataFromDataUrlNode.create(this._drawElementNode.getProperty("dataUrl"));
		
		var fileSaverNode = SaveFileNode.create("http://localhost:8080/dbm/examples/saveFile", fileNameNode.getProperty("outputValue"), dataFormatterNode.getProperty("outputValue"), "base64");
		fileSaverNode.getProperty("update").startUpdating();
		
		this._video.play();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});