/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Test of animation ofver a spatial curve.
 */
dbm.registerClass("dbm.projects.tests.math.curves.SpatialAnimationApplication", "dbm.projects.tests.math.curves.ArcLengthOfCurveApplication", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.BaseObject");
	
	//Self reference
	var SpatialAnimationApplication = dbm.importClass("dbm.projects.tests.math.curves.SpatialAnimationApplication");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	var SpatialCurveTimelinePart = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.parts.SpatialCurveTimelinePart");
	var PlaybackNode = dbm.importClass("dbm.flow.nodes.time.PlaybackNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.projects.tests.math.curves.SpatialAnimationApplication::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("dbm.projects.tests.math.curves.SpatialAnimationApplication::_createPage");
		
		this.superCall();
		
		var animationLength = 10;
		
		var playbackNode = PlaybackNode.createWithGlobalInput();
		playbackNode.setupPlayback(0, animationLength, true);
		playbackNode.play();
		
		var animatedObject = DisplayBaseObject.createDiv(this._contentHolder, true, {"style": "position: absolute; left: 0px; top: 0px; width: 10px; height: 10px; background-color: #666666"});
		animatedObject.setElementAsTransformed();
		
		var xMultiplierNode = MultiplicationNode.create(1, 0.5);
		var yMultiplierNode = MultiplicationNode.create(1, 0.5);
		
		animatedObject.setPropertyInput("x", xMultiplierNode.getProperty("outputValue"));
		animatedObject.setPropertyInput("y", yMultiplierNode.getProperty("outputValue"));
		
		var xTimeline = Timeline.create(0);
		var xTimelinePart = SpatialCurveTimelinePart.create(this._curve, 0, animationLength);
		xTimeline.addPart(xTimelinePart);
		
		var yTimeline = Timeline.create(0);
		var yTimelinePart = SpatialCurveTimelinePart.create(this._curve, 0, animationLength);
		yTimelinePart.pointProperty = "outputValueY";
		yTimeline.addPart(yTimelinePart);
		
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(xTimeline, playbackNode.getProperty("outputTime"), xMultiplierNode.getProperty("inputValue1"));
		dbm.singletons.dbmAnimationManager.setupTimelineConnection(yTimeline, playbackNode.getProperty("outputTime"), yMultiplierNode.getProperty("inputValue1"));
		
		animatedObject.getProperty("display").startUpdating();
	};
	
	/**
	 * Set all properties of the object to null. Part of the destroy function.
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
	};
});