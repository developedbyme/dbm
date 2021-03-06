/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.MultiplicationNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.MultiplicationNode");
	
	//Self reference
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.MultiplicationNode::_init");
		
		this.superCall();
		
		var inputValue1 = this.createProperty("inputValue1", 1);
		var inputValue2 = this.createProperty("inputValue2", 1);
		var outputValue = this.createProperty("outputValue", 1);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [inputValue1, inputValue2], [outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aInputValue1, aInputValue2) {
		//console.log("dbm.flow.nodes.math.MultiplicationNode::_update");
		return aInputValue1*aInputValue2;
	};
	
	staticFunctions.create = function(aInput1, aInput2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue1", aInput1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInput2);
		return newNode;
	};
});