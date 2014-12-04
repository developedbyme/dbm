/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.parse.ParseFloatNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.parse.ParseFloatNode");
	
	var ParseFloatNode = dbm.importClass("dbm.flow.nodes.parse.ParseFloatNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.parse.ParseFloatNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.parse.ParseFloatNode::_update");
		this._outputValue.setValueWithFlow(parseFloat(this._inputValue.getValueWithoutFlow()), aFlowUpdateNumber);
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