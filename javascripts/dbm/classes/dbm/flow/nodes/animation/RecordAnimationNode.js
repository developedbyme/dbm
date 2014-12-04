/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Node that records all changes to a timeline.
 */
dbm.registerClass("dbm.flow.nodes.animation.RecordAnimationNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.animation.RecordAnimationNode");
	//"use strict";
	
	//Self reference
	var RecordAnimationNode = dbm.importClass("dbm.flow.nodes.animation.RecordAnimationNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.animation.RecordAnimationNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", null);
		this._time = this.createProperty("time", null);
		this._timeline = null;
		
		this._updateProperty = this.createGhostProperty("update");
		
		this.createUpdateFunction("default", this._update, [this._inputValue, this._time], [this._updateProperty]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.animation.RecordAnimationNode::_update");
		
		var inputValue = this._inputValue.getValueWithoutFlow();
		var time = this._time.getValueWithoutFlow();
		
		this._timeline.setValueAt(inputValue, time);
	};
	
	objectFunctions.setTimeline = function(aTimeline) {
		//console.log("dbm.flow.nodes.animation.RecordAnimationNode::setTimeline");
		
		this._timeline = aTimeline;
		this._timeline.getProperty("anyChange").connectInput(this._updateProperty);
	};
	
	objectFunctions.getTimeline = function() {
		return this._timeline;
	};
	
	objectFunctions._internalFunctionality_ownsVariable = function(aName) {
		switch(aName) {
			case "_timeline":
				return false;
		}
		return this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._time = null;
		this._updateProperty = null;
		this._timeline = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInputValue, aTime, aTimeline) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInputValue);
		newNode.setPropertyInputWithoutNull("time", aTime);
		newNode.setTimeline(aTimeline);
		
		return newNode;
	};
});