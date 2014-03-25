/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.flow.nodes.math.SubtractionNode", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.flow.nodes.math.SubtractionNode");
	
	//Self reference
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	
	//Error report
	
	//Dependencies
	
	//Utils
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.flow.nodes.math.SubtractionNode::_init");
		
		this.superCall();
		
		var inputValue1 = this.createProperty("inputValue1", 0);
		var inputValue2 = this.createProperty("inputValue2", 0);
		var outputValue = this.createProperty("outputValue", 0);
		
		this.createUpdateFunctionWithArguments("default", ClassReference._update, [inputValue1, inputValue2], [outputValue]);
		
		return this;
	};
	
	staticFunctions._update = function(aInputValue1, aInputValue2) {
		//console.log("com.developedbyme.flow.nodes.math.SubtractionNode::_update");
		return aInputValue1-aInputValue2;
	};
	
	staticFunctions.create = function(aInput1, aInput2) {
		var newNode = (new ClassReference()).init();
		newNode.setPropertyInputWithoutNull("inputValue1", aInput1);
		newNode.setPropertyInputWithoutNull("inputValue2", aInput2);
		return newNode;
	};
});