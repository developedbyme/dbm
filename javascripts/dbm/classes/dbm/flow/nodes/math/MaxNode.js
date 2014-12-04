/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.MaxNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.MaxNode");
	
	var MaxNode = dbm.importClass("dbm.flow.nodes.math.MaxNode");
	
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.MaxNode::_init");
		
		this.superCall();
		
		this._inputValue1 = this.createProperty("inputValue1", 0);
		this._inputValue2 = this.createProperty("inputValue2", 0);
		this._outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", Math.max, [this._inputValue1, this._inputValue2], [this._outputValue]);
		
		return this;
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