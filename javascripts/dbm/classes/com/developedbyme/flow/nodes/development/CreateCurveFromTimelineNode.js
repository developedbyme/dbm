/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode");
	//"use strict";
	
	//Self reference
	var CreateCurveFromTimelineNode = dbm.importClass("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode");
	
	//Error report
	
	//Dependencies
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode::_init");
		
		this.superCall();
		
		this._timeline = this.createProperty("timeline", null).setAlwaysUpdateFlow(true);
		this._timelineChange = this.createGhostProperty("timelineChange"); //METODO: remove this when time is no longer apart of the timeline
		this._startTime = this.createProperty("startTime", 0);
		this._endTime = this.createProperty("endTime", 1);
		this._defaultNumberOfSteps = this.createProperty("defaultNumberOfSteps", 512);
		this._xOffset = this.createProperty("xOffset", 512);
		
		this._outputCurve = this.createProperty("outputCurve", BezierCurve.create(3, true));
		
		this.createUpdateFunction("default", this._update, [this._timeline, this._timelineChange, this._startTime, this._endTime, this._defaultNumberOfSteps, this._xOffset], [this._outputCurve]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode::_update");
		
		var timeline = this._timeline.getValueWithoutFlow();
		var startTime = this._startTime.getValueWithoutFlow();
		var endTime = this._endTime.getValueWithoutFlow();
		var defaultNumberOfSteps = this._defaultNumberOfSteps.getValueWithoutFlow();
		var xOffset = this._xOffset.getValueWithoutFlow();
		var curve = this._outputCurve.getValueWithoutFlow();
		
		dbm.singletons.dbmCurveCreator.createCurveFromTimeline(timeline, startTime, endTime, defaultNumberOfSteps, xOffset, curve);
		
		this._outputCurve.setFlowAsUpdated(aFlowUpdateNumber);
	};
	
	staticFunctions.create = function(aTimeline, aStartTime, aEndTime, aDefaultNumberOfSteps, aXOffset) {
		//console.log("com.developedbyme.flow.nodes.development.CreateCurveFromTimelineNode::create");
		var newNode = (new ClassReference()).init();
		if(aTimeline instanceof Timeline) {
			newNode.setPropertyInputWithoutNull("timeline", aTimeline.getObjectProperty());
		}
		else {
			newNode.setPropertyInputWithoutNull("timeline", aTimeline);
		}
		
		newNode.setPropertyInputWithoutNull("timelineChange", newNode.getProperty("timeline").getValue().getProperty("partChange"));
		
		newNode.setPropertyInputWithoutNull("startTime", aStartTime);
		newNode.setPropertyInputWithoutNull("endTime", aEndTime);
		newNode.setPropertyInputWithoutNull("defaultNumberOfSteps", aDefaultNumberOfSteps);
		newNode.setPropertyInputWithoutNull("xOffset", aXOffset);
		
		//console.log(newNode);
		
		return newNode;
	};
	
	
});