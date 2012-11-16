dbm.registerClass("com.developedbyme.flow.nodes.animation.ValueToAnimationNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.animation.ValueToAnimationNode");
	//"use strict";
	
	var ValueToAnimationNode = dbm.importClass("com.developedbyme.flow.nodes.animation.ValueToAnimationNode");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.animation.ValueToAnimationNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", null);
		this._currentValue = this.createProperty("currentValue", null);
		this._timeline = null;
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._currentValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.flow.nodes.animation.ValueToAnimationNode::_update");
		
		var inputValue = this._inputValue.getValueWithoutFlow();
		var currentValue = this._currentValue.getValueWithoutFlow();
		
	};
	
	objectFunctions.setTimeline = function(aTimeline) {
		//console.log("com.developedbyme.flow.nodes.animation.ValueToAnimationNode::setTimeline");
		
		this._timeline = aTimeline;
		
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
		
		return newNode;
	};
});