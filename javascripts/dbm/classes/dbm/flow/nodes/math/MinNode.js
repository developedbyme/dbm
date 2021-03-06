/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.MinNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.MinNode");
	
	var MinNode = dbm.importClass("dbm.flow.nodes.math.MinNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.MinNode::_init");
		
		this.superCall();
		
		this._inputValue1 = this.createProperty("inputValue1", 0);
		this._inputValue2 = this.createProperty("inputValue2", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunction("default", this._update, [this._inputValue1, this._inputValue2], [this._outputValue]);
		
		return this;
	};
	
	objectFunctions._update = function(aFlowUpdateNumber) {
		//console.log("dbm.flow.nodes.math.MinNode::_update");
		//console.log(Math.min(this._inputValue1.getValueWithoutFlow(), this._inputValue2.getValueWithoutFlow()), this._inputValue1.getValueWithoutFlow(), this._inputValue2.getValueWithoutFlow());
		this._outputValue.setValueWithFlow(Math.min(this._inputValue1.getValueWithoutFlow(), this._inputValue2.getValueWithoutFlow()), aFlowUpdateNumber);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._inputValue1 = null;
		this._inputValue2 = null;
		this._outputValue = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aInput1, aInput2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue1", aInput1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInput2);
		return newNode;
	};
});