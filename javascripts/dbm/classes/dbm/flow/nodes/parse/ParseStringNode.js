/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.parse.ParseStringNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.parse.ParseStringNode");
	
	var ParseStringNode = dbm.importClass("dbm.flow.nodes.parse.ParseStringNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.parse.ParseStringNode::_init");
		
		this.superCall();
		
		this._inputValue = this.createProperty("inputValue", "");
		this._outputValue = this.createProperty("outputValue", "");
		
		this.createUpdateFunction("default", this._update, [this._inputValue], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.parse.ParseStringNode::_update");
		this._outputValue.setValueWithFlow(this._inputValue.getValueWithoutFlow().toString(), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});