/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.animation.ValueToAnimationNode", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.animation.ValueToAnimationNode");
	//"use strict";
	
	var ValueToAnimationNode = dbm.importClass("dbm.flow.nodes.animation.ValueToAnimationNode");
	
	var ValueChangeObject = dbm.importClass("dbm.core.data.generic.ValueChangeObject");
	
	var GenericExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.GenericExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.animation.ValueToAnimationNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", null);
		this._currentValue = this.createProperty("currentValue", null);
		this._timeline = null; //METODO: this shouldn't be owned by this object
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._currentValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.animation.ValueToAnimationNode::_update");
		
		var inputValue = this._inputValue.getValueWithoutFlow();
		var currentValue = this._currentValue.getValueWithoutFlow();
		var changeObject = ValueChangeObject.create(currentValue, inputValue);
		
		if(this.getExtendedEvent().hasEvent(GenericExtendedEventIds.VALUE_CHANGED)) {
			this.getExtendedEvent().perform(GenericExtendedEventIds.VALUE_CHANGED, changeObject);
		}
		
		this._currentValue.setValueWithFlow(inputValue, aFlowUpdateNumber);
	};
	
	objectFunctions.setTimeline = function(aTimeline) {
		//console.log("dbm.flow.nodes.animation.ValueToAnimationNode::setTimeline");
		
		this._timeline = aTimeline;
		this._timeline.getProperty("anyChange").connectInput(this._currentValue);
	};
	
	objectFunctions.getTimeline = function() {
		return this._timeline;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case GenericExtendedEventIds.VALUE_CHANGED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._currentValue = null;
		this._timeline = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput, aTimeline) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		newNode.setTimeline(aTimeline);
		
		return newNode;
	};
});