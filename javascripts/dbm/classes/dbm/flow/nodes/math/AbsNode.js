/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.flow.nodes.math.AbsNode", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.flow.nodes.math.AbsNode");
	//"use strict";
	
	//Self reference
	var AbsNode = dbm.importClass("dbm.flow.nodes.math.AbsNode");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.flow.nodes.math.AbsNode::_init");
		
		this.superCall();
		
		var inputValue = this.createProperty("inputValue", 0);
		var outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", Math.abs, [inputValue], [outputValue]);
		
		return this;
	};
	
	staticFunctions.create = function(aInput) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue", aInput);
		return newNode;
	};
});