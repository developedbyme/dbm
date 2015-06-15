/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A node that evaluates a timeline with complex values.
 */
dbm.registerClass("dbm.flow.nodes.animation.EvaluateComplexTimelineNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.animation.EvaluateComplexTimelineNode");
	//"use strict";
	
	//Self reference
	var EvaluateComplexTimelineNode = dbm.importClass("dbm.flow.nodes.animation.EvaluateComplexTimelineNode");
	
	//Error report
	
	//Dependencies
	var Timeline = dbm.importClass("dbm.core.globalobjects.animationmanager.timeline.Timeline");
	
	//Utils
	
	//Constants
	var FlowStatusTypes = dbm.importClass("dbm.constants.status.FlowStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.animation.EvaluateComplexTimelineNode::_init");
		
		this.superCall();
		
		this._timeline = this.createProperty("timeline", null).setAlwaysUpdateFlow(true);
		this._inputValue = this.createProperty("inputValue", 0);
		this._part = this.createProperty("part", null);
		this._partParameter = this.createProperty("partParameter", 0);
		
		this._outputValue = this.createProperty("outputValue", null).setAlwaysUpdateFlow(true);
		
		this.createUpdateFunction("selectPart", this._updateFlowSelectPart, [this._timeline, this._inputValue], [this._part, this._partParameter]);
		this.createUpdateFunction("getValue", this._updateFlowGetValue, [this._timeline, this._part, this._partParameter], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._updateFlowSelectPart = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.animation.EvaluateComplexTimelineNode::_updateFlowSelectPart");
		
		var theTimeline = this._timeline.getValueWithoutFlow();
		
		if(theTimeline === null) {
			this._inputPart.setValueWithFlow(null, aFlowUpdateNumber);
		}
		else {
			theTimeline._internalFunctionality_getPartAtInFlow(this._inputValue.getValueWithoutFlow(), this._part, this._partParameter, aFlowUpdateNumber);
			this._partParameter.status = FlowStatusTypes.UPDATED;
		}
	};
	
	objectFunctions._updateFlowGetValue = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.animation.EvaluateComplexTimelineNode::_updateFlowGetValue");
		
		var thePart = this._part.getValueWithoutFlow();
		if(thePart !== null) {
			var parameter = this._partParameter.getValueWithoutFlow();
			this._outputValue.setValueWithFlow(thePart.getValueAt(parameter), aFlowUpdateNumber);
		}
		else {
			var theTimeline = this._timeline.getValueWithoutFlow();
			this._outputValue.setValueWithFlow(theTimeline.getProperty("startValue").getValueWithoutFlow(), aFlowUpdateNumber);
		}
	};
	
	staticFunctions.create = function(aTimeline, aInputValue) {
		//console.log("dbm.flow.nodes.animation.EvaluateComplexTimelineNode::create");
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("timeline", aTimeline);
		
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		
		//console.log(newNode);
		
		return newNode;
	};
	
	
});