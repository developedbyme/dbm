/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A node that evaluates a timeline.
 */
dbm.registerClass("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode");
	//"use strict";
	
	//Self reference
	var EvaluateTimelineNode = dbm.importClass("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode");
	
	//Error report
	
	//Dependencies
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode::_init");
		
		this.superCall();
		
		var timeline = this.createProperty("timeline", null).setAlwaysUpdateFlow(true);
		var inputValue = this.createProperty("inputValue", 0);
		var outputValue = this.createProperty("outputValue", null);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [timeline, inputValue], [outputValue]);
		
		return this;
	};
	
	staticFunctions.create = function(aTimeline, aInputValue) {
		//console.log("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode::create");
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("timeline", aTimeline);
		
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		
		//console.log(newNode);
		
		return newNode;
	};
	
	staticFunctions._update = function(aTimeline, aInputValue) {
		//console.log("com.developedbyme.flow.nodes.animation.EvaluateTimelineNode::_update");
		//console.log(aTimeline, aInputValue);
		
		if(aTimeline === null) {
			return null;
		}
		return aTimeline.getValueAt(aInputValue);
	};
});