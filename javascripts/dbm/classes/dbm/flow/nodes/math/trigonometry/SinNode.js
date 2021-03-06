/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.trigonometry.SinNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.trigonometry.SinNode");
	
	var SinNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.SinNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.trigonometry.SinNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.trigonometry.SinNode::_update");
		this._outputValue.setValueWithFlow(Math.sin(this._inputValue.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	
	objectFunctions.performDestroy = function() {
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		this.superCall();
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});